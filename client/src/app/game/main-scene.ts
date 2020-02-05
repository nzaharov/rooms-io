import { Scene, GameObjects } from 'phaser';
import { Unit } from './game-objects/Unit';
import { Subject, Observable } from 'rxjs';
import { IAction } from './interfaces/Action';

export class MainScene extends Scene {
    private map: GameObjects.Image;
    private sceneOutput$: Subject<any>;
    private inputQueue: IAction[] = [];
    units: Unit[] = [];

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
        this.handleQueuedCommands();

    }

    getSceneOutput(): Observable<any> {
        return this.sceneOutput$.asObservable();
    }

    enqueue(action: IAction) {
        this.inputQueue.push(action);
    }

    private handleQueuedCommands() {
        while (this.inputQueue.length) {
            const action = this.inputQueue.shift();
            const payload = action.payload;

            if (action.event === 'newUnit') {
                if (!this.units.find((unit) => unit.id === payload.id)) {
                    this.units.push(new Unit(this, payload.x, payload.y, payload.id));
                }
            }
        }
    }

    private addUnit(x: number, y: number) {
        const unit = new Unit(this, x, y);
        this.units.push(unit);
        this.sceneOutput$.next({ event: 'newUnit', payload: { id: unit.id, x, y } });
    }

}