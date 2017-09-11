/// <reference path="../../lib/phaser.comments.d.ts"/>

class DraggableSphere {

    private sphere:Phaser.Image;
    
    constructor (game:Phaser.Game,xStart:number,yStart:number,colour:string) {
        this.sphere = game.add.image(xStart,yStart,"sprites","sphere_"+colour);
        this.sphere.anchor.x = this.sphere.anchor.y = 0.5;
        this.sphere.height = this.sphere.width = 80;
        this.sphere.inputEnabled = true;
        this.sphere.input.enableDrag();
        this.sphere.input.setDragLock(true,false);
    }

    moveTo(x:number,y:number) : void {
        this.sphere.x = x;this.sphere.y = y;
    }

    destroy() : void {
        this.sphere.destroy();
        this.sphere = null;
    }
}

class PositionBar extends Phaser.Group implements IGuiObject {

    private xLeft:number;
    private xRight:number;
    private yPos:number;
    private spheres:DraggableSphere[];
    private music:IMusic;

    constructor(game:Phaser.Game,music:IMusic,xLeft:number,xRight:number,y:number) {
        super(game);
        var bar:Phaser.Image = this.game.add.image(xLeft,y,"sprites","rectangle",this);
        bar.width = xRight-xLeft;bar.height = 16;bar.tint = 0x0000;   
        bar.anchor.y = 0.5;
        this.xLeft = xLeft;this.xRight = xRight;this.yPos = y;this.music = music;
        this.spheres = [];
        this.spheres.push(new DraggableSphere(game,xLeft,y,"green"));
        this.spheres.push(new DraggableSphere(game,xRight,y,"green"));
        this.spheres.push(new DraggableSphere(game,(xLeft+xRight)/2,y,"orange"));
    }

    updatePosition(barFractionalPosition:number): void {
        var frac:number = barFractionalPosition / this.music.getBarCount();
        frac = Math.min(1,frac);
        this.spheres[2].moveTo(this.xLeft + (this.xRight-this.xLeft) * frac,this.yPos);
    }
    
    destroy() : void {
        for (var ds of this.spheres) { ds.destroy(); }
        super.destroy()
    }
}