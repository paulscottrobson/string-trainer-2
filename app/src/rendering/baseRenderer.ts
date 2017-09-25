/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Base class for all renderers. Handles drawing and erasing control, passing off 
 * to concrete subclasses creation, moving and erasing.
 * 
 * @abstract
 * @class BaseRenderer
 * @extends {Phaser.Group}
 * @implements {IRenderer}
 */

abstract class BaseRenderer extends Phaser.Group implements IRenderer {

    private isDrawn:boolean;

    protected rWidth:number;
    protected rHeight:number;
    protected bar:IBar;
    protected instrument:IInstrument;
    protected beats:number;
    protected manager:IRenderManager;

    private debugRectangle:Phaser.Image;
    private xiLast:number;
    private yiLast:number;

    private static SHOW_DEBUG:boolean = false;

    abstract moveAllObjects(x:number,y:number): void;
    abstract drawAllObjects(); void;
    abstract eraseAllObjects(): void;

    /**
     * Creates an instance of BaseRenderer.
     * 
     * @param {Phaser.Game} game Phaser game
     * @param {IBar} bar Bar it represents
     * @param {IInstrument} instrument instrument info
     * @param {number} width size
     * @param {number} height size
     * @memberof BaseRenderer
     */

    constructor(game:Phaser.Game,manager:IRenderManager,bar:IBar,instrument:IInstrument,width:number,height:number) {
        super(game);
        // Mark as not drawn and save information
        this.isDrawn = false;
        this.rWidth = width;this.rHeight = height;
        this.bar = bar;this.instrument = instrument;
        this.manager = manager;
        this.beats = this.bar.getBeats();
        this.xiLast = this.yiLast = -999999;
        this.debugRectangle = null;
        
        if (BaseRenderer.SHOW_DEBUG) {
            this.debugRectangle = this.game.add.image(0,0,"sprites","rectangle",this);
            this.debugRectangle.width = width;this.debugRectangle.height = height;
            this.debugRectangle.alpha = 0.3;this.debugRectangle.visible = false;
            this.debugRectangle.tint = Math.floor(Math.random() * 0x1000000);
        }
    }

    moveTo(x:number,y:number): void {
        // Check if it has actually moved.
        x = Math.round(x);y = Math.round(y);
        if (x == this.xiLast && y == this.yiLast) return;

        // Is it off the screen ?
        if (x > this.game.width || x+this.rWidth < 0 || 
            y > this.game.height || y+this.rHeight < 0) {
            // If object is drawn, remove it as not needed.
            if (this.isDrawn) {
                this.eraseAllObjects();
                if (this.debugRectangle != null) {
                    this.debugRectangle.visible = false;
                }
                this.isDrawn = false;
            }
            // And exit
            return;
        }
        // It's on the screen, create if necessary.
        if (!this.isDrawn) {
            this.drawAllObjects();
            if (this.debugRectangle != null) {
                this.debugRectangle.visible = true;
            }
        this.isDrawn = true;
        }
        // Move it
        this.moveAllObjects(x,y);
        if (this.debugRectangle != null) {
            this.debugRectangle.x = x;this.debugRectangle.y = y;
        }
        this.xiLast = x;this.yiLast = y;
    }

    destroy() : void {
        // Erase rendered objects
        if (this.isDrawn) {
            this.eraseAllObjects();
            this.isDrawn = false;
        }
        // Erase debug rectangle if present
        if (this.debugRectangle != null) {
            this.debugRectangle.destroy();
        }
        this.manager = null;
        // Finish off.
        super.destroy();
    }

    getXBall(fractionalBar:number):number {
        return null;
    }
    getYBall(fractionalBar:number):number {
        return null;
    }
    
}

/**
 * This is a simple test renderer, fills it with green ellipse.
 * 
 * @class TestRenderer
 * @extends {BaseRenderer}
 */

class TestRenderer extends BaseRenderer {

    private img:Phaser.Image;

    moveAllObjects(x: number, y: number): void {
        this.img.x = x;this.img.y = y;
    }

    drawAllObjects() {
        this.img = this.game.add.image(0,0,"sprites","sphere_green",this);
        this.img.width = this.rWidth;this.img.height = this.rHeight;
    }

    eraseAllObjects(): void {
        this.img.destroy();
        this.img = null;
    }
}