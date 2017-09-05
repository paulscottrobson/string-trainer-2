/// <reference path="../../lib/phaser.comments.d.ts"/>

interface IRendererFactory {
    /**
     * Create a render management object
     * 
     * @returns {IRenderManager} 
     * @memberof IRendererFactory
     */
    getRenderManager(): IRenderManager;

    /**
     * Create an object that renders a bar.
     * 
     * @param {Phaser.Game} game 
     * @param {IInstrument} instrument 
     * @param {IBar} bar 
     * @returns {IRenderer} 
     * @memberof IRendererFactory
     */
    getRenderer(game:Phaser.Game,instrument:IInstrument,bar:IBar):IRenderer;
}