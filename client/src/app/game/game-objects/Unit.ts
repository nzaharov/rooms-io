import { GameObjects, Scene } from 'phaser';

export class Unit extends GameObjects.Sprite {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'dude');
        this.scale = 3;
    }
}
