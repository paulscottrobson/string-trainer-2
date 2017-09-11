/// <reference path="../../../lib/phaser.comments.d.ts"/>

/**
 * String render manager subclass.
 * 
 * @class StringRenderManager
 * @extends {BaseRenderManager}
 */
class StringRenderManager extends BaseRenderManager {

    drawBackground(): void { 
        // Fretboard
        var bgr:Phaser.Image = this.game.add.image(0,this.getYBox(0,0)+this.getBoxHeight()/2,
                                                   "sprites","fretboard",this); 
        bgr.width = this.game.width;bgr.height = this.getBoxHeight() * 130 / 100;
        bgr.anchor.y = 0.5;  
        // Strings
        for (var s:number = 0;s < this.instrument.getStringCount();s++) {
            var sn:number = s;
            // Normally true, except for Dulcimer.
            if (this.instrument.isLowestPitchAtBottom()) { 
                sn = this.instrument.getStringCount()-1-sn;
            }
            var y:number = this.getYBox(0,0)+(sn+0.5)*this.getBoxHeight()/this.instrument.getStringCount();
            var str:Phaser.Image = this.game.add.image(0,y,"sprites",
                        this.instrument.isDoubleString(s) ? "mstring":"string",this);
            str.width = this.game.width;str.height = Math.max(1,this.getBoxHeight()/24);
            str.anchor.y = 0.5;
            if (this.instrument.isDoubleString(s)) {
                str.height = str.height * 2;
            }
        }                                                   
    }
    
    eraseBackground(): void {    
        // Done automatically when the group is destroyed.
    }

    getBoxWidth():number {
        return this.game.width / 2.5;
    }

    getBoxHeight():number {
        return this.game.height / 2.5;
    }

    getXBox(fracPos:number,bar:number) {
        return this.game.width / 4 + (-fracPos + bar) * this.getBoxWidth();
    }

    getYBox(fracPos:number,bar:number) {
        return this.game.height - 150 - this.getBoxHeight();
    }

}