/// <reference path="../../../lib/phaser.comments.d.ts"/>

/**
 * Harmonica Renderer Factory Class
 * 
 * @class HarmonicaRendererFactory
 * @implements {IRendererFactory}
 */
class HarmonicaRendererFactory implements IRendererFactory {
    
    getRenderManager(game:Phaser.Game,instrument:IInstrument,music:IMusic): IRenderManager {
        return new HarmonicaRenderManager(game,instrument,music);
    }
    
    getRenderer(game: Phaser.Game,manager:IRenderManager, instrument: IInstrument, 
                        bar: IBar,width:number, height:number): IRenderer {
        return new HarmonicaRenderer(game,manager,bar,instrument,width,height);
    }

}