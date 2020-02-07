import { v4 } from 'uuid';
import IsoSprite from 'phaser3-plugin-isometric/';


// Maybe create unit factory
export class IsoUnit {

    id: string;
    isPlayerOne: boolean;
    sprite: IsoSprite;
    speed: number;
    motion: 'walk' | 'stand' | 'stopped' = 'stand';

    constructor(sprite: IsoSprite, isPlayerOne: boolean, id?: string) {
        this.id = id || v4();
        this.sprite = sprite;
        this.sprite.scale = 2;
        this.speed = isPlayerOne ? 0.005 : -0.005;
        this.isPlayerOne = isPlayerOne;

    }

    update(): void {
        if (this.motion === 'walk') {
            this.sprite.isoY -= 100 * this.speed;

            if (this.isPlayerOne && this.sprite.isoY <= 0) {
                this.motion = 'stopped';
            }
            if (!this.isPlayerOne && this.sprite.isoY >= 512) {
                this.motion = 'stopped';
            }
        } else if (this.motion === 'stand') {
            this.motion = 'walk';
        }
    }
}
