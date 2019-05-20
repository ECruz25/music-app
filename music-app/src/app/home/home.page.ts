import { Component, OnInit } from "@angular/core";

declare var cordova: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  result = {};
  constructor() {}

  ngOnInit() {}

  authWithSpotify() {
    console.log("entre a la autenticacion");
    const config = {
      clientId: "5c3b13a967bc4bf598898a7eaac6e54a ",
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
    console.log({ config });

    cordova.plugins.spotifyAuth
      .authorize(config)
      .then(({ accessToken, encryptedRefreshToken, expiresAt }) => {
        console.log("entre a la autenticacion");

        console.log(accessToken, encryptedRefreshToken, expiresAt);
        this.result = {
          access_token: accessToken,
          expires_in: expiresAt,
          ref: encryptedRefreshToken
        };
      })
      .catch(e => {
        console.log("Erroooor");
        console.log(e);
      });
  }
}
