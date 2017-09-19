/// <reference path="../../../lib/phaser.comments.d.ts"/>

/**
 * Harmonica Render Manager Subclass.
 * 
 * @class HarmonicaRenderManager
 * @extends {BaseRenderManager}
 */

class HarmonicaRenderManager extends BaseRenderManager {

    private harmonicaGfx:HarmonicaGraphic;
    private boxWidth:number;
    private lineGroup:Phaser.Group;

    updatePosition(fracPos:number) : void {
        this.game.world.bringToTop(this.harmonicaGfx);
        super.updatePosition(fracPos);
    }
    
    drawBackground(): void { 
        var hSize:number = this.getHarmonicaSize();
        var holeSize:number = Math.floor(this.game.width * 0.85 / (Math.max(10,hSize)+1));
        this.lineGroup = this.game.add.group();
        this.harmonicaGfx = new HarmonicaGraphic(this.game,hSize,holeSize,holeSize);
        this.harmonicaGfx.x = this.game.width/2;
        this.harmonicaGfx.y = this.game.height*4/5;
        this.boxWidth = holeSize;
        for (var n:number = 1;n <= this.getHarmonicaSize()+1;n++) {
            var img:Phaser.Image = this.game.add.image(this.getXTrack(n,0),0,"sprites","rectangle",this.lineGroup);
            img.anchor.x = 0.5;img.width = Math.max(1,this.game.width/512);
            img.height = this.game.height*5/4;img.tint = 0x00;
            var angle:number = Math.atan2(-this.harmonicaGfx.y-this.harmonicaGfx.getHoleWidth()/2,
                                          this.getXTrack(n,0)-this.getXTrack(n,this.harmonicaGfx.y));
            img.rotation = angle - Math.PI*3/2;
            //console.log(n,angle * 360 / (2 * Math.PI),this.getXTrack(n,0),this.getXTrack(n,this.harmonicaGfx.y));                                                      
        }
    }
    
    eraseBackground(): void {    
        this.lineGroup.destroy();
        this.lineGroup = null;
        this.harmonicaGfx.destroy();
        this.harmonicaGfx = null;
    }

    getBoxWidth():number {
        return this.boxWidth * this.getHarmonicaSize();
    }

    getBoxHeight():number {
        return this.game.height / 1.5;
    }

    getXBox(fracPos:number,bar:number) {
        return this.game.width / 2 - this.getBoxWidth()/2;
    }

    getYBox(fracPos:number,bar:number) {
        return this.harmonicaGfx.getYHole() - (-fracPos + bar + 1) * this.getBoxHeight();
    }

    getHarmonicaSize(): number {
        return 10;
    }

    getXTrack(hole:number,y:number) {
        var x = this.harmonicaGfx.getXHole(hole) - this.harmonicaGfx.getHoleWidth() / 2;
        x = x - this.game.width / 2;
        x = x * (0.5 * y / this.harmonicaGfx.y + 0.5);
        return x + this.game.width / 2;
    }
}