import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { Game, Types } from 'phaser';
import { MainScene } from 'src/app/game/main-scene';
import { Subscription } from 'rxjs';
import { IAction } from 'src/app/game/interfaces/Action';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  private game: Game;
  private config: Types.Core.GameConfig;
  private mainScene: MainScene;

  private gameOutputSubscription: Subscription;

  @Input()
  set inputAction(action: IAction) {
    if (this.mainScene) {
      this.mainScene.enqueue(action);
    }
  }

  @Output() output = new EventEmitter<IAction>();

  constructor() { }

  ngOnInit() {

    this.mainScene = new MainScene();
    this.gameOutputSubscription = this.mainScene.getSceneOutput()
      .subscribe((event: IAction) => this.output.emit(event));

    this.config = {
      type: Phaser.WEBGL,
      height: 800,
      width: 1000,
      scene: [this.mainScene],
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

  ngOnDestroy() {
    this.gameOutputSubscription.unsubscribe();
  }

}
