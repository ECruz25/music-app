import { Component, OnInit } from "@angular/core";
import { NavController, LoadingController } from "@ionic/angular";
import { Media, MediaObject } from "@ionic-native/media/ngx";
import SpotifyWebApi from "spotify-web-api-js";
import { ActivatedRoute } from "@angular/router";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-playlist",
  templateUrl: "./playlist.page.html",
  styleUrls: ["./playlist.page.scss"]
})
export class PlaylistPage implements OnInit {
  tracks = [];
  playlistInfo = null;
  playing = false;
  spotifyApi: any;
  currentTrack: MediaObject = null;
  playlist: any;
  _storage: Storage;
  constructor(
    public navCtrl: NavController,
    private media: Media,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private route: ActivatedRoute
  ) {
    storage.get("playlistPage").then(data => {
      this.spotifyApi = new SpotifyWebApi();
      this.spotifyApi.setAccessToken(data.accessToken);
      this.loadPlaylistData(data.playlist);
    });
  }

  async loadPlaylistData(playlist: { id: any }) {
    this.spotifyApi
      .getPlaylist(playlist.id)
      .then((data: { tracks: { items: any[] } }) => {
        this.playlistInfo = data;
        this.tracks = data.tracks.items;
      })
      .catch((er: any) => {
        console.log(er);
      });
  }
  play(item: string) {
    this.playing = true;

    this.currentTrack = this.media.create(item);

    this.currentTrack.onSuccess.subscribe(() => {
      this.playing = false;
    });
    this.currentTrack.onError.subscribe(error => {
      this.playing = false;
    });

    this.currentTrack.play();
  }
  playActiveDevice(item: { track: { uri: any } }) {
    this.spotifyApi.play({ uris: [item.track.uri] });
  }
  stop() {
    if (this.currentTrack) {
      this.currentTrack.stop();
      this.playing = false;
    }
  }

  open(item: { track: { external_urls: { spotify: string } } }) {
    window.open(item.track.external_urls.spotify, "_system", "location=yes");
  }
  ngOnInit() {}
}
