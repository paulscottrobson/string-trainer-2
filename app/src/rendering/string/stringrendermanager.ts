/// <reference path="../../../lib/phaser.comments.d.ts"/>

/**
 * String render manager subclass.
 * 
 * @class StringRenderManager
 * @extends {BaseRenderManager}
 */
class StringRenderManager extends BaseRenderManager {

    drawBackground(): void {    
    }
    
    eraseBackground(): void {    
    }

    getBoxWidth():number {
        return this.game.width / 2.5;
    }

    getBoxHeight():number {
        return this.game.height / 3;
    }

    getXBox(fracPos:number,bar:number) {
        return 100 + (-fracPos + bar) * this.getBoxWidth();
    }

    getYBox(fracPos:number,bar:number) {
        return this.game.height - 100 - this.getBoxHeight();
    }

}