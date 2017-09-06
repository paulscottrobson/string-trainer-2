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

    constructor(game:Phaser.Game,instrument:IInstrument,music:IMusic) {
        super(game);
        this.instrument = instrument;this.music = music;
        this.drawBackground();
        // Get factory to create renderers
        var factory:IRendererFactory = instrument.getRendererFactory();
        // Create renderers for each bar
        this.renderers = [];
        for (var bar:number = 0;bar < music.getBarCount();bar++) {
            var rnd:IRenderer = factory.getRenderer(game,instrument,
                                                    music.getBar(bar),
                                                    this.getBoxWidth(),
                                                    this.getBoxHeight());
            this.renderers.push(rnd);
            //rnd.moveTo(50+(bar % 4)*210,Math.floor(bar/4)*110+10);
        }
        // Start position.
        this.updatePosition(0);
    }

    updatePosition(fracPos: number): void {
        for (var bar:number = 0;bar < this.music.getBarCount();bar++) {
            this.renderers[bar].moveTo(this.getXBox(fracPos,bar),
                                       this.getYBox(fracPos,bar));
        }
    }

    destroy(): void {
        for (var rnd of this.renderers) {
            rnd.destroy();
        }
        this.eraseBackground();
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