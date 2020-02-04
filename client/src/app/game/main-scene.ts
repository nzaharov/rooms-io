import { Scene, GameObjects } from 'phaser';
import { Unit } from './game-objects/Unit';
import { Subject, Observable } from 'rxjs';

export class MainScene extends Scene {
    private map: GameObjects.Image;
    private units: Unit[] = [];
    private sceneOutput$: Subject<any>;

    constructor() {
        super({ key: 'main' });
        this.sceneOutput$ = new Subject<any>();
    }


    preload() {
        this.load.image('map', '/assets/game/space-background.png');
        this.load.spritesheet('dude',
            '/assets/game/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() {
        this.map = this.add.image(400, 400, 'map').setInteractive();
        this.map.on('pointerdown', (e) => this.addUnit(e.x, e.y));
    }

    update() {

    }

    getSceneOutput(): Observable<any> {
        return this.sceneOutput$.asObservable();
    }

    private addUnit(x: number, y: number) {
        const unit = new Unit(this, x, y);
        this.add.existing(unit);
        this.units.push(unit);
        this.sceneOutput$.next({ event: 'newUnit', payload: { x, y } });
    }
}