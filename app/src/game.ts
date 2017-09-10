/// <reference path="../lib/phaser.comments.d.ts"/>

class MainState extends Phaser.State implements IControllable {
    
    private renderManager: IRenderManager;
    private music:IMusic;
    private barFractionalPosition:number = 0;
    private isPaused:boolean = false;
    private tempo:number = 120;
    private audioMetronome:IClockAudioEntity;
    private guiMetronome:IClockEntity;
    private musicPlayer:IClockAudioEntity;
    private lastFractionalPosition:number;

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
        this.lastFractionalPosition = -1;

        this.tempo = this.getDefaultTempo();
        this.audioMetronome = new AudioMetronome(this.game,this.music);
        this.guiMetronome = new VisualMetronome(this.game,this.music);
        this.musicPlayer = new MusicPlayer(this.game,this.music);

        var btn:IGuiObject = new PushButton(this.game,"i_faster",this,this.clicked,'Q');
        btn.x = btn.y = 100;
    }

    clicked(sender:any,shortcut:string) : void {
        console.log("clicked",shortcut,sender);
    }

    destroy() : void {
        this.renderManager.destroy();
        this.audioMetronome.destroy();
        this.guiMetronome.destroy();
        this.musicPlayer.destroy();
        this.music = this.renderManager = this.audioMetronome = null;
        this.guiMetronome = this.musicPlayer = null;
    }

    setPosition(barFractionalPosition:number) : void {
        this.barFractionalPosition = barFractionalPosition;
        this.lastFractionalPosition = -1;
    }
    
    setTempo(tempo:number) : void {
        this.tempo = tempo;
    }

    getPosition(): number  {
        return this.barFractionalPosition;
    }

    getTempo(): number { 
        return this.tempo;
    }

    getDefaultTempo(): number {
        return this.music.getTempo();
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
                }
            if (this.barFractionalPosition != this.lastFractionalPosition) {                
                // Update the music position, metronomes and player
                this.renderManager.updatePosition(this.barFractionalPosition);
                this.audioMetronome.updateTime(this.barFractionalPosition);
                this.guiMetronome.updateTime(this.barFractionalPosition);
                this.musicPlayer.updateTime(this.barFractionalPosition);
                this.lastFractionalPosition = this.barFractionalPosition;
            }
        }
    }
}    
