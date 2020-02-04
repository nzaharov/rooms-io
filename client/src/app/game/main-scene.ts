import { Scene } from 'phaser';

export class MainScene extends Scene {
    constructor() {
        super({ key: 'main' });
    }

    create() {
        console.log('create');
    }

    preload() {
        console.log('preload');
    }
    
    update() {
        console.log('update');
    }
}