import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';

@Component({
  selector: 'song-add',
  templateUrl: '../views/song-add.html',
  providers: [UserService, SongService, AlbumService]
})

export class SongAddComponent implements OnInit{
  public titulo: string;
  public song: Song;
  public identity;
  public token;
  public url: string;
  public alertMessage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _songService: SongService,
    private _albumService: AlbumService

  ){
    this.titulo = "Añadir nueva canción";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song(1,'','','','');
  }

  ngOnInit(){
    console.log('Song add component.ts cargado');
    this.getAlbum();

  }

  getAlbum(){
    this._route.params.forEach((params: Params) => {
      let id = params['album'];
      this._albumService.getAlbum(this.token, id).subscribe(
        response => {
          if (!response.album) {
              console.log('error en el servidor');
          } else {
              this.titulo = this.titulo + ' al albúm '+ response.album.title;
          }
        },
        error => {
          var errorMessage = <any>error;
          if (errorMessage != null) {
            var body = JSON.parse(error._body);
              //this.alertMessage = body.message;
              console.log(error);
          }
        }
      );
    });
  }

  onSubmit(){
    this._route.params.forEach((params: Params) =>{
    let album_id = params['album'];
    this.song.album = album_id;

    console.log(this.song);

    this._songService.addSong(this.token, this.song).subscribe(
      response => {
        if (!response.song) {
            this.alertMessage = 'Error en el servidor';
        } else {
          this.alertMessage = 'La canción fue agregada correctamente';
          this.song = response.song;

          this._router.navigate(['/editar-cancion', response.song._id]);
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var body = JSON.parse(error._body);
            this.alertMessage = body.message;
            console.log(error);
        }
      }
    );
  });
  }
}
