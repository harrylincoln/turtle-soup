import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AF } from '../providers/af';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public items: FirebaseListObservable<any[]>;
  public users: FirebaseListObservable<any>;
  constructor(db: AngularFireDatabase, public afService: AF) {
    this.items = db.list('/users');
    this.users = afService.getCurrentUsers();
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

  logTheHellOut(event) {
    event.preventDefault();
    this.afService.logout()
  }

  authAPIHit(event) {
    event.preventDefault();
    this.afService.getTokenAndSendToAPI()
  }

  createNewUserHit(event) {
    event.preventDefault();
    this.afService.createNewUser('alisonfoster@gmail.com', 'geneweeny')
  }

  signInEmailPassHit(event) {
    event.preventDefault();
    this.afService.signInEmailPass('alisonfoster@gmail.com', 'geneweeny')
  }
}
