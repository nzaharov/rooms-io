import { Component, OnInit } from '@angular/core';
import { Game, Types } from 'phaser';
import { MainScene } from 'src/app/game/main-scene';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game: Game;
  config: Types.Core.GameConfig;

  constructor() { }

  ngOnInit() {
    this.config = {
      type: Phaser.AUTO,
      height: 600,
      width: 800,
      scene: [MainScene],
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
