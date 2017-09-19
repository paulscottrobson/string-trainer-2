/// <reference path="../../lib/phaser.comments.d.ts"/>

interface IRendererFactory {
    /**
     * Create a render management object
     * 
     * @param {Phaser.Game} game 
     * @param {IInstrument} instrument 
     * @param {IMusic} music
     * @returns {IRenderManager} 
     * @memberof IRendererFactory
     */
    getRenderManager(game:Phaser.Game,instrument:IInstrument,music:IMusic): IRenderManager;

    /**
     * Create an object that renders a bar.
     * 
     * @param {Phaser.Game} game 
     * @param {IInstrument} instrument 
     * @param {IBar} bar 
     * @param {IBar} width
     * @param {IBar} height
     * @returns {IRenderer} 
     * @memberof IRendererFactory
     */
    getRenderer(game:Phaser.Game,instrument:IInstrument,bar:IBar,width:number,height:number):IRenderer;
}