/// <reference path="../lib/phaser.comments.d.ts"/>

class MainState extends Phaser.State {

    private music:IMusic;

    create() : void {
        // Stretched background
        var bgr:Phaser.Image = this.game.add.image(0,0,"sprites","background");
        bgr.width = this.game.width;bgr.height = this.game.height;

        var json:any = this.game.cache.getJSON("music");
        this.music = new Music(json);

        var rdr:IRenderer = new StringRenderer(this.game,this.music.getBar(0),
                                               this.music.getInstrument(),600,300);
        rdr.moveTo(110,110);        
        //rdr.destroy();                                                
    }

    destroy() : void {
        this.music = null;
    }

    update() : void {
    }
}    
