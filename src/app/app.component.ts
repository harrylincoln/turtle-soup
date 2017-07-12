import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AF } from '../providers/af';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public items: FirebaseListObservable<any[]>;
  public user: FirebaseListObservable<any>;
  constructor(db: AngularFireDatabase, public afService: AF, public afAuth: AngularFireAuth) {
    this.items = db.list('/users');
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.user = db.list('users/' + res.uid);
      }
    });
  }

  createNewUserHit(event) {
    event.preventDefault();
    this.afService.createNewUser('testy@testy.com', 'aSaf3rp@a55word!')
  }

  signInEmailPassHit(event) {
    event.preventDefault();
    this.afService.signInEmailPass('testy@testy.com', 'aSaf3rp@a55word!')
  }

  authIT(event) {
    event.preventDefault();
    this.afService.getCustomToken()
      .then(() => {
        this.afService.signInWithCustomToken();
      })
      .catch((err) => {
        console.error('Error calling "getCustomToken": ', err);
      });
  }

  logOutSession(event) {
    event.preventDefault();
    this.afService.logout()
  }

  authAPIHit(event) {
    event.preventDefault();
    this.afService.getTokenAndSendToAPI()
  }
}
