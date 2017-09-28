/// <reference path="../../../lib/phaser.comments.d.ts"/>

abstract class BaseStaveRenderer extends BounceBaseRenderer {

    protected stRect:Phaser.Rectangle;
    protected stManager:BaseStaveRenderManager;
    private backRect:Phaser.Image;
    private lines:Phaser.Image[];
    private barLine:Phaser.Image;

    constructor(game:Phaser.Game,manager:IRenderManager,bar:IBar,instrument:IInstrument,width:number,height:number) {
        super(game,manager,bar,instrument,width,height);        
        this.stManager = <BaseStaveRenderManager>this.manager;
        this.stRect = this.stManager.getStaveBox();
        this.backRect = null;
    }

    moveAllObjects(x:number,y:number): void {
        this.backRect.x = x + this.stRect.x;
        this.backRect.y = y + this.stRect.y;
        for (var i:number = 0;i < 5;i++) {
            this.lines[i].x = this.backRect.x;
            this.lines[i].y = y+this.getYStaveLine(i);
        }
        this.barLine.x = this.backRect.x;
        this.barLine.y = y+this.getYStaveLine(2);
        super.moveAllObjects(x,y);
    }

    getYStaveLine(n:number) {
        return (4-1.5-n) * this.getStaveSpacing() + this.stRect.halfHeight;
    }

    getStaveSpacing(): number {
        return this.stRect.height / 8;
    }

    drawAllObjects() : void {
        this.backRect = this.game.add.image(0,0,"sprites","rectangle");
        this.backRect.width = this.stRect.width;
        this.backRect.height = this.stRect.height;
        this.barLine = this.game.add.image(0,0,"sprites","rectangle");
        this.barLine.width = this.game.width / 160;
        this.barLine.height = (this.getYStaveLine(0)-this.getYStaveLine(4))+4;
        this.barLine.tint = 0x0;this.barLine.anchor.y = 0.5;

        this.lines = [];
        for (var i = 0;i < 5;i++) {
            this.lines[i] = this.game.add.image(0,0,"sprites","rectangle");
            this.lines[i].width = this.stRect.width;
            this.lines[i].height = Math.max(2,this.game.height/160);
            this.lines[i].anchor.y = 0.5;
            this.lines[i].tint = 0x000000;
            if (i == 0) this.lines[i].tint = 0xFF8000;
        }
        super.drawAllObjects();
    }

    eraseAllObjects() : void {
        this.backRect.destroy();this.barLine.destroy();
        for (var l of this.lines) { l.destroy(); }
        this.backRect = null;this.lines = null;this.barLine = null;
        super.eraseAllObjects();
    }
 
}

class TestStaveRenderer extends BaseStaveRenderer {

    moveAllObjects(x:number,y:number): void {
        super.moveAllObjects(x,y);
    }

    drawAllObjects() : void {
        super.drawAllObjects();
    }

    eraseAllObjects() : void {
        super.eraseAllObjects();
    }
    
}