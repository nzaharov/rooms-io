import { Scene, GameObjects } from 'phaser';
import { Subject, Observable } from 'rxjs';
import { IAction } from './interfaces/Action';
import IsoPlugin from 'phaser3-plugin-isometric';
import { IsoUnit } from './game-objects/IsoUnit';

export class MainScene extends Scene {
    private map: GameObjects.Image;
    private sceneOutput$: Subject<any>;
    private inputQueue: IAction[] = [];

    private isoGroup;

    private units: IsoUnit[] = [];

    constructor() {
        super({ key: 'main', mapAdd: { isoPlugin: 'iso' } });

        this.sceneOutput$ = new Subject<any>();
    }

    
    preload() {
        this.load.scenePlugin({
            key: 'IsoPlugin',
            url: IsoPlugin,
            sceneKey: 'iso'
        });

        this.load.image('map', '/assets/game/space-background.png');
        this.load.spritesheet('dude',
            '/assets/game/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.image('tile', '/assets/game/tile.png');
    }

    create() {
        this.map = this.add.image(400, 400, 'map').setInteractive();
        // this.map.on('pointerdown', (e) => this.addUnit(e.x, e.y));
        this.isoGroup = this.add.group();

        (this as any).iso.projector.origin.setTo(0.5, 0.3);
        this.generateFloor();
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
                    this.units.push(this.createUnit(payload.x, payload.y, payload.id));
                }
            }
        }
    }

    private generateFloor() {
        for (let x = 0; x < 256 * 2; x += 38 * 2) {  // base the tilemap on a 2d array
            for (let y = 0; y < 256 * 2; y += 38 * 2) {
                const tile = (this.add as any).isoSprite(x, y, 0, 'tile', this.isoGroup);
                tile.scale = 2;
                tile.setInteractive();

                tile.on('pointerover', function () {
                    this.setTint(0x86bfda);
                    this.isoZ += 3;
                });

                tile.on('pointerout', function () {
                    this.clearTint();
                    this.isoZ -= 3;
                });

                tile.on('pointerup', () => {
                    this.addUnit(x, y);
                });
            }
        }
    }

    private addUnit(x: number, y: number) {
        const unit = this.createUnit(x, y);
        this.units.push(unit);
        this.sceneOutput$.next({ event: 'newUnit', payload: { id: unit.id, x, y } });
    }

    private createUnit(x: number, y: number, id?: string): IsoUnit {
        const sprite = (this.add as any).isoSprite(x, y, 40, 'dude');
        sprite.scale = 2;
        return new IsoUnit(sprite, id);
    }

}