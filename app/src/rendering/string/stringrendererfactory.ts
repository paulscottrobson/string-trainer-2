/// <reference path="../../../lib/phaser.comments.d.ts"/>

/**
 * String Renderer Factory Class
 * 
 * @class StringRendererFactory
 * @implements {IRendererFactory}
 */
class StringRendererFactory implements IRendererFactory {
    
    getRenderManager(game:Phaser.Game,instrument:IInstrument,music:IMusic): IRenderManager {
        return new StringRenderManager(game,instrument,music);
    }
    
    getRenderer(game: Phaser.Game, instrument: IInstrument, 
                        bar: IBar,width:number, height:number): IRenderer {
        return new StringRenderer(game,bar,instrument,width,height);
    }

}