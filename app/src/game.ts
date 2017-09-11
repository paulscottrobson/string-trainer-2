/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Game main state.
 * 
 * @class MainState
 * @extends {Phaser.State}
 * @implements {IControllable}
 */
class MainState extends Phaser.State implements IControllable {

    private static VERSION:string="0.9:11/Sep/17";
    private renderManager: IRenderManager;
    private music:IMusic;
    private barFractionalPosition:number = 0;
    private isPaused:boolean = false;
    private tempo:number = 120;
    private audioMetronome:IClockAudioEntity;
    private guiMetronome:IClockEntity;
    private musicPlayer:IClockAudioEntity;
    private lastFractionalPosition:number;
    private controller:IController;

    create() : void {
        // Stretched background
        var bgr:Phaser.Image = this.game.add.image(0,0,"sprites","background");
        bgr.width = this.game.width;bgr.height = this.game.height;

        // Info Label
        var lbl:Phaser.BitmapText = this.game.add.bitmapText(this.game.width,this.game.height,
                                                             "font",MainState.VERSION,
                                                             24);
        lbl.anchor.x = lbl.anchor.y = 1;lbl.tint = 0;                                                             

        // Load Music in
        var json:any = this.game.cache.getJSON("music");
        this.music = new Music(json);

        // Create the render manager, which creates the renderers.
        this.renderManager = new StringRenderManager(this.game,
                                        this.music.getInstrument(),this.music);
        //this.renderManager.destroy();this.renderManager = null;

        this.barFractionalPosition = 0;
        this.lastFractionalPosition = -1;

        this.tempo = this.music.getTempo();
        this.audioMetronome = new AudioMetronome(this.game,this.music);
        this.guiMetronome = new VisualMetronome(this.game,this.music);
        this.musicPlayer = new MusicPlayer(this.game,this.music);
        this.controller = new Controller(this.game,this,MainState.BUTTON_LIST);
    }

    destroy() : void {
        this.renderManager.destroy();
        this.audioMetronome.destroy();
        this.guiMetronome.destroy();
        this.musicPlayer.destroy();
        this.controller.destroy();
        this.music = this.renderManager = this.audioMetronome = null;
        this.guiMetronome = this.musicPlayer = this.controller = null;
    }

    update() : void {
        if (this.renderManager != null) {
            this.controller.checkUpdateController();
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

    doCommand(shortCut:string):void {
        //console.log("Do command "+shortCut);
        switch(shortCut) {
            case "P":
                this.isPaused = false;break;
            case "H":
                this.isPaused = true;break;
            case "R":                
                this.barFractionalPosition = 0;break;
            case "S":
                this.tempo *= 0.9;break;
            case "N":                
                this.tempo = this.music.getTempo();break;
            case "F":
                this.tempo /= 0.9;break;
            case "M":
                this.musicPlayer.setVolume(true);break;
            case "Q":
                this.musicPlayer.setVolume(false);break;
            case "T":
                this.audioMetronome.setVolume(true);break;
            case "X":
                this.audioMetronome.setVolume(false);break;
        }
    }

    /**
     * Command/icon name list for Controller object.
     * 
     * @private
     * @static
     * @type {string[][]}
     * @memberof MainState
     */
    private static BUTTON_LIST:string[][] = [
        ["P","i_play"],
        ["H","i_stop"],
        ["R","i_restart"],
        ["S","i_slower"],
        ["N","i_normal"],
        ["F","i_faster"],
        ["M","i_music_on"],
        ["Q","i_music_off"],
        ["T","i_metronome_on"],
        ["X","i_metronome_off"]
    ];
}    
