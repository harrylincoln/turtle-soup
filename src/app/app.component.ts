import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AF } from '../providers/af';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public items: FirebaseListObservable<any[]>;
  constructor(db: AngularFireDatabase, public afService: AF) {
    this.items = db.list('/');
  }

  sendMessageDOM(message) {
    event.preventDefault();
    this.afService.sendMessage(message);
  }
}
