/// <reference path="../lib/phaser.comments.d.ts"/>

class MainState extends Phaser.State {
    
    private renderManager: IRenderManager;
    private music:IMusic;
    private barFractionalPosition:number = 0;
    private isPaused:boolean = false;
    private tempo:number = 120;

    create() : void {
        // Stretched background
        var bgr:Phaser.Image = this.game.add.image(0,0,"sprites","background");
        bgr.width = this.game.width;bgr.height = this.game.height;

        // Load Music in
        var json:any = this.game.cache.getJSON("music");
        this.music = new Music(json);

        // Create the render manager, which creates the renderers.
        this.renderManager = new StringRenderManager(this.game,
                                        this.music.getInstrument(),this.music);
        //this.renderManager.destroy();this.renderManager = null;

        this.barFractionalPosition = 0;
        this.tempo = this.music.getTempo();

        var a:Phaser.Sound = this.game.add.audio("harmonica-01");
        a.play();
    }

    destroy() : void {
        this.renderManager.destroy();
        this.music = this.renderManager = null;
    }

    update() : void {
        if (this.renderManager != null) {
            if (!this.isPaused) {
                // Elapsed ms time.
                var time:number = this.game.time.elapsedMS;
                // Convert to elapsed minutes.
                time = time / 1000 / 60;
                // Convert to beats elapsed 
                var beatsElapsed:number = this.tempo * time;
                // Convert to bars elapsed 
                var barsElapsed = beatsElapsed / this.music.getBeats();
                // Offset position by that and stop at the end of the song.
                this.barFractionalPosition += barsElapsed
                this.barFractionalPosition = Math.min(this.barFractionalPosition,
                                                      this.music.getBarCount());
                // Update the music position.                                                      
                this.renderManager.updatePosition(this.barFractionalPosition);
            }
        }
    }
}    
