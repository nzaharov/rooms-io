import { GameObjects } from 'phaser';
import { v4 } from 'uuid';
import { MainScene } from '../main-scene';

// Maybe create unit factory
export class Unit extends GameObjects.Sprite {

    id: string;

    constructor(scene: MainScene, x: number, y: number, id?: string) {
        super(scene, x, y, 'dude');

        this.scale = 3;
        this.id = id || v4();
        scene.add.existing(this);
    }
}
