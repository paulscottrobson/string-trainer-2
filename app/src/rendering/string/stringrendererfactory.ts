/// <reference path="../../../lib/phaser.comments.d.ts"/>

/**
 * String Renderer Factory Class
 * 
 * @class StringRendererFactory
 * @implements {IRendererFactory}
 */
class StringRendererFactory implements IRendererFactory {
    
    getRenderManager(game:Phaser.Game,instrument:IInstrument,music:IMusic): IRenderManager {
        //return new StringRenderManager(game,instrument,music);
        return new TestStaveRenderManager(game,instrument,music);
    }
    
    getRenderer(game: Phaser.Game, manager:IRenderManager,instrument: IInstrument, 
                        bar: IBar,width:number, height:number): IRenderer {
        return new TestStaveRenderer(game,manager,bar,instrument,width,height);
        //return new StringRenderer(game,manager,bar,instrument,width,height);
    }

}