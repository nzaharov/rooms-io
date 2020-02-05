import { v4 } from 'uuid';
import IsoSprite from 'node_modules/phaser3-plugin-isometric/'


// Maybe create unit factory
export class IsoUnit {

    id: string;
    sprite: IsoSprite;

    constructor(sprite: IsoSprite, id?: string) {
        this.sprite = sprite;
        this.id = id || v4();
    }
}
