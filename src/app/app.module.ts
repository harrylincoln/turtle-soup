import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { RegisterComponent } from './register/register.component';
import { RouterModule, Routes } from "@angular/router";
import { AF } from "../providers/af";

const routes: Routes = [
  { path: 'register', component: RegisterComponent}
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(
      environment.firebase
    ),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [AF],
  bootstrap: [AppComponent]
})
export class AppModule { }
