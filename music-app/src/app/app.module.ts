import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { HomePage } from "./home/home.page";
import { AppRoutingModule } from "./app-routing.module";

import { Media } from "@ionic-native/media/ngx";
import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule } from "@angular/common/http";

import { HTTP } from "@ionic-native/http/ngx";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Media,
    HTTP
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
