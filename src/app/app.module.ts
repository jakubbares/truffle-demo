import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CarService} from '../services/car.service';
import {routes} from "./app.routes";
import {DataComponent} from "./pages/data/data.page";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    routes
  ],
  declarations: [
    AppComponent,
    DataComponent
  ],
  providers: [CarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
