/// <reference path="../../../lib/phaser.comments.d.ts"/>

/**
 * This Render Manager is used for Stave Rendering
 * 
 * @abstract
 * @class BaseStaveRenderManager
 * @extends {BaseRenderManager}
 */
abstract class BaseStaveRenderManager extends BaseRenderManager {
    
    getStaveBox():Phaser.Rectangle {
        return new Phaser.Rectangle(0,0,this.getBoxWidth(),this.getBoxHeight());
    }
}

class TestStaveRenderManager extends BaseStaveRenderManager {

    getBoxWidth(): number {
        return this.game.width / 3;
    }
    getBoxHeight(): number {
        return this.game.height / 2;
    }
    getXBox(fracPos: number, bar: number) {
        return this.game.width / 4 + (-fracPos + bar) * this.getBoxWidth();
    }
    getYBox(fracPos: number, bar: number) {
        return this.game.height * 4 / 5 - this.getBoxHeight();
    }
    getStaveBox():Phaser.Rectangle {
        return new Phaser.Rectangle(0,20,this.getBoxWidth()-0,this.getBoxHeight()/2);
    }
    drawBackground(): void {    
    }

    eraseBackground(): void {        
    }

}