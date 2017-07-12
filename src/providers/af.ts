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
  public user: FirebaseListObservable<any>;
  private beTokenUrl = 'http://localhost:8081/get-token';
  private verifyTokenUrl = 'http://localhost:8081/verifyIdToken';
  private authApiUrl = 'http://localhost:8081/api/hello';
  private createUserUrl = 'http://localhost:8081/create-user';
  public clientToken: string;
  private tokenID: string;

  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase, private http: Http) {
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        console.log('user is logged in', res);
        this.user = db.list('users/' + res.uid);
        console.log('this.user', this.user);
      } else {
        console.log('user not logged in');
      }
    });
  }

  createNewUser(email, password) {
    this.http.post(this.createUserUrl, {emailAddress: email, pass: password})
    .toPromise()
    .then(function (res) {
      console.log('createNewUser success', res.json());
    })
    .catch(function(error) {
      console.log('createNewUser error', error);
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getCurrentUserData() {
    console.log('getCurrentUser');
    return this.user;
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
    console.log('log in the user', user);
    }).catch(function(error) {
      console.log('signInWithCustomToken fail', error);
    });
  }

  getTokenAndSendToAPI() {
    this.afAuth.auth.currentUser.getToken().then(idToken => {
      this.tokenID = idToken;
      console.log('getTokenAndSendToAPI() idToken', this.tokenID);
      let headersObj = new Headers();
      headersObj.append('Authorization', 'Bearer ' + this.tokenID)
      let options = new RequestOptions({ headers: headersObj });

      this.http.get(this.authApiUrl, options)
        .toPromise()
        .then(function (res) {
          console.log('getTokenAndSendToAPI() signin success?', res.json());
        })
        .catch(function(error) {
          console.log('getTokenAndSendToAPI() sigin error', error);
        });
    }).catch(function(error) {
      console.log('currentUser getToken error', error)
    });
  }

  signInEmailPass(email, password) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then((user) => {
      console.log('Logged in as', user);
      // let headersObj = new Headers();
      // headersObj.append('Authorization', 'Bearer ' + user.uid)
      // let options = new RequestOptions({ headers: headersObj });

      // this.http.post('http://localhost:8081/add-data', {test: 'Yoooooooooo', uid: user.uid} , options)
      // .toPromise()
      // .then(function (res) {
      //   console.log('add additional data', res.json());
      // })
      // .catch(function(error) {
      //   console.error('', error);
      // });

    }).catch(function(error) {
      console.error('signInEmailPass()', error);
    });
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