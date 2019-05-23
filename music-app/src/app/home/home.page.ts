import { Component, OnInit } from "@angular/core";
import { NavController, Platform, LoadingController } from "@ionic/angular";
// import { , RequestOptions, HttpClient } from "@angular/common/http";
import { HTTP } from "@ionic-native/http/ngx";

import SpotifyWebApi from "spotify-web-api-js";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

declare var cordova: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  result = {};
  data = "";
  playlists = [];
  spotifyApi: any;
  loggedIn = false;
  loading = false;
  clientId = "5c3b13a967bc4bf598898a7eaac6e54a";
  accessToken = null;
  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private plt: Platform,
    private loadingCtrl: LoadingController,
    private router: Router,
    public http: HTTP
  ) {
    this.spotifyApi = new SpotifyWebApi();
    this.plt.ready().then(() => {
      this.storage.get("logged_in").then(res => {
        if (res) {
          this.authWithSpotify(true);
        }
      });
    });
  }

  sendPostRequest(accessToken: string) {
    let postData = {
      accessToken
    };
    this.http.setHeader(
      "http://music-app-ec.azurewebsites.net/",
      "Accept",
      "application/json"
    );
    this.http.setHeader(
      "http://music-app-ec.azurewebsites.net/",
      "Content-Type",
      "application/json"
    );
    this.http
      .post("http://music-app-ec.azurewebsites.net/", postData, {
        Accept: "application/json",
        "Content-Type": "application/json"
      })
      .then(response => {
        console.log(response);
      });
  }

  ngOnInit() {}

  authWithSpotify(showLoading = false) {
    const config2 = {
      clientId: this.clientId,
      redirectUrl: "spotify-app-ec://callback",
      scopes: [
        "streaming",
        "playlist-read-private",
        "user-read-email",
        "user-read-private"
      ],
      tokenExchangeUrl: "https://spotify-app-ec.herokuapp.com/exchange",
      tokenRefreshUrl: "https://spotify-app-ec.herokuapp.com/refresh"
    };
    if (showLoading) {
      // this.loading = this.loadingCtrl.create();
      // this.loading.present();
    }

    cordova.plugins.spotifyAuth
      .authorize(config2)
      .then(({ accessToken, encryptedRefreshToken, expiresAt }) => {
        this.result = {
          access_token: accessToken,
          expires_in: expiresAt,
          ref: encryptedRefreshToken
        };
        this.accessToken = accessToken;
        this.loggedIn = true;
        this.spotifyApi.setAccessToken(accessToken);
        // this.sendPostRequest(this.accessToken);
        this.getUserPlaylists();
        this.storage.set("logged_in", true);
      })
      .catch((e: any) => {
        console.log(e);
      });
  }
  getUserPlaylists() {
    // this.loading = this.loadingCtrl.create({
    //   content: "Loading Playlists..."
    // });
    // this.loading.present();

    this.spotifyApi.getUserPlaylists().then(
      data => {
        if (this.loading) {
          // this.loading.dismiss();
        }
        this.playlists = data.items;
      },
      err => {
        console.error(err);
        if (this.loading) {
          // this.loading.dismiss();
        }
      }
    );
  }
  openPlaylist(item) {
    this.storage.set("playlistPage", {
      playlist: item,
      accessToken: this.accessToken
    });
    // this.navCtrl.navigateForward(["page-slug"], item);
    return this.router.navigateByUrl("playlist");
  }

  logout() {
    cordova.plugins.spotifyAuth.forget();

    this.loggedIn = false;
    this.playlists = [];
    this.storage.set("logged_in", false);
  }
}
