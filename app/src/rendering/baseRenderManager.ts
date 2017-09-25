/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Abstract base class for render managers.
 * 
 * @abstract
 * @class BaseRenderManager
 * @extends {Phaser.Group}
 * @implements {IRenderManager}
 */

abstract class BaseRenderManager extends Phaser.Group implements IRenderManager {

    protected renderers:IRenderer[];
    protected instrument:IInstrument;
    protected music:IMusic;
    private   bouncingBall:Phaser.Image;

    constructor(game:Phaser.Game,instrument:IInstrument,music:IMusic) {
        super(game);
        this.instrument = instrument;this.music = music;
        this.drawBackground();
        // Get factory to create renderers
        var factory:IRendererFactory = instrument.getRendererFactory();
        // Create renderers for each bar
        this.renderers = [];
        for (var bar:number = 0;bar < music.getBarCount();bar++) {
            var rnd:IRenderer = factory.getRenderer(game,
                                                    this,
                                                    instrument,
                                                    music.getBar(bar),
                                                    this.getBoxWidth(),
                                                    this.getBoxHeight());
            this.renderers.push(rnd);
            //rnd.moveTo(50+(bar % 4)*210,Math.floor(bar/4)*110+10);
        }
        // Create bouncy ball
        this.bouncingBall = this.game.add.image(100,100,"sprites","sphere_red");
        this.bouncingBall.anchor.x = 0.5;this.bouncingBall.anchor.y = 1;
        this.bouncingBall.width = this.bouncingBall.height = this.getBoxHeight()/5;
        // Start position.
        this.updatePosition(0);
    }

    updatePosition(fracPos: number): void {
        for (var bar:number = 0;bar < this.music.getBarCount();bar++) {
            this.renderers[bar].moveTo(this.getXBox(fracPos,bar),
                                       this.getYBox(fracPos,bar));
        }
        var currentBar:number = Math.floor(fracPos);
        var fracPosPart:number = fracPos - Math.floor(fracPos);
        if (currentBar < this.music.getBarCount()) {
            var xBall:number = this.renderers[currentBar].getXBall(fracPosPart);
            var yBall:number = this.renderers[currentBar].getYBall(fracPosPart);
            if (xBall != null &&     yBall != null) {
                this.bouncingBall.visible = true;
                this.bouncingBall.bringToTop();
                this.bouncingBall.x = this.getXBox(fracPos,currentBar) + xBall;
                this.bouncingBall.y = this.getYBox(fracPos,currentBar) + yBall;
            } else {
                this.bouncingBall.visible = false;
            }
        }
    }

    destroy(): void {
        for (var rnd of this.renderers) {
            rnd.destroy();
        }
        this.eraseBackground();
        this.bouncingBall.destroy();this.bouncingBall = null;
        super.destroy();
        this.renderers = this.instrument = this.music = null;
    }

    /**
     * Get size of box containing bar data
     * 
     * @abstract
     * @returns {number} 
     * @memberof BaseRenderManager
     */
    abstract getBoxWidth():number;
    /**
     * Get size of box containing bar data 
     * 
     * @abstract
     * @returns {number} 
     * @memberof BaseRenderManager
     */
    abstract getBoxHeight():number;
    /**
     * Get horizontal position of given bar for given offset
     * 
     * @abstract
     * @param {number} fracPos fractional position through tune
     * @param {number} bar bar number
     * @memberof BaseRenderManager
     */
    abstract getXBox(fracPos:number,bar:number);
    /**
     * Get vertictal position of given bar for given offset
     * 
     * @abstract
     * @param {number} fracPos fractional position through tune
     * @param {number} bar bar number
     * @memberof BaseRenderManager
     */
    abstract getYBox(fracPos:number,bar:number);
    /**
     * Draw background graphics
     * 
     * @abstract
     * @memberof BaseRenderManager
     */
    abstract drawBackground():void;
    /**
     * Remove background graphics - if they are in the group destroy() will
     * do this automatically.
     * 
     * @abstract
     * @memberof BaseRenderManager
     */
    abstract eraseBackground():void;
}