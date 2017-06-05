import {Injectable} from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { FirebaseObjectFactoryOpts } from "angularfire2/interfaces";
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AF {
  public messages: FirebaseListObservable<any>;
  public users: FirebaseListObservable<any>;
  public displayName: string;
  public email: string;
  public user: Observable<any>;
  private beTokenUrl = 'http://localhost:8081/get-token';
  private verifyTokenUrl = 'http://localhost:8081/verifyIdToken';
  public clientToken: string;

  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase, private http: Http) {
    this.afAuth.authState.subscribe(
      (auth) => {
        if (auth != null) {
          this.user = db.list('users/' + auth.uid);
        }
      })
    this.messages = db.list('messages');
    this.users = db.list('users');
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  setClientToken(token) {
    this.clientToken = token;
  }

  printUser() {
    console.log(this.users);
  }

  getCustomToken(){
    let _controller = this;
    let promise = new Promise((resolve, reject) => {
      this.http.get(this.beTokenUrl)
        .toPromise()
        .then(function (res) {
          let jsonRes = res.json();
          _controller.setClientToken(jsonRes.instanceID);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });

    return promise;
  }

  signInWithCustomToken() {
    this.afAuth.auth.signInWithCustomToken(this.clientToken).then(function(user) {
    console.log('log out the user', user);
    }).catch(function(error) {
      console.log('signInWithCustomToken fail', error);
    });
  }

  verifyToken(){
    let headersObj = new Headers();
    let clientToken = 'Bearer ' + this.clientToken;
    headersObj.append('Authorization', 'Bearer ' + this.clientToken)

    let options = new RequestOptions({ headers: headersObj });

    console.log('Token: ' + this.clientToken);

    return this.http.get(this.verifyTokenUrl, options)
      .toPromise()
      .then(function (res) {
        console.log('verifyToken', res.json());
      })
      .catch(this.handleError);
  }
  /**
   * Logs out the current user
   */
  logout() {
    return this.afAuth.auth.signOut();
  }

  /**
   *
   */
  addUserInfo(){
    //We saved their auth info now save the rest to the db.
    this.users.push({
      email: this.email,
      displayName: this.displayName
    });
  }

  /**
   * Saves a message to the Firebase Realtime Database
   * @param text
   */
  sendMessage(text) {
    var message = {
      message: text
    };
    this.messages.push(message);
  }

  /**
   *
   * @param uid
   * @param model
   * @returns {firebase.Promise<void>}
   */
  saveUserInfoFromForm(uid, name, email) {
    return this.db.list('registeredUsers/' + uid, {
      query: {
        name: name,
        email: email
      }
    });
  }

}