/// <reference path="../../../lib/phaser.comments.d.ts"/>

class StringRendererFactory implements IRendererFactory {
    
    getRenderManager(): IRenderManager {
        throw new Error("Method not implemented.");
    }
    getRenderer(game: Phaser.Game, instrument: IInstrument, bar: IBar): IRenderer {
        throw new Error("Method not implemented.");
    }

}