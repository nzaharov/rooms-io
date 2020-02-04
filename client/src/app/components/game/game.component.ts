import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Game, Types } from 'phaser';
import { MainScene } from 'src/app/game/main-scene';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game: Game;
  config: Types.Core.GameConfig;
  @Output() output = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {

    const mainScene = new MainScene();
    mainScene.getSceneOutput().subscribe((event) => this.output.emit(event));

    this.config = {
      type: Phaser.WEBGL,
      height: 800,
      width: 800,
      scene: [mainScene],
      parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 100 }
        }
      },
      fps: {
        target: 30
      }
    };

    this.game = new Game(this.config);
  }

}
