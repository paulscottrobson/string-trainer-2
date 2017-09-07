/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 *  Preloads all resources except those loaded in Boot for use in the preloader.
 * 
 * @class PreloadState
 * @extends {Phaser.State}
 */
class PreloadState extends Phaser.State {

    /**
     * Preloader. Loads sprite atlas, font, metrnome sound and the instrument notes.
     * 
     * @memberOf PreloadState
     */
    preload(): void {
        // Create the loading sprite
        this.game.stage.backgroundColor = "#000000";
        var loader:Phaser.Sprite = this.add.sprite(this.game.width/2,
                                                   this.game.height/2,
                                                   "loader");
        loader.width = this.game.width * 9 / 10;
        loader.height = this.game.height / 8;        
        loader.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(loader);

        // Load the sprite atlas.
        this.game.load.atlas("sprites","assets/sprites/sprites.png",
                                       "assets/sprites/sprites.json");
        // Load the fonts
        for (var fontName of ["7seg","font"]) {
            this.game.load.bitmapFont(fontName,"assets/fonts/"+fontName+".png",
                                               "assets/fonts/"+fontName+".fnt");
        }
        // Load instrument notes - hopefully cached after first time.
        this.preloadSounds(new SoundSet_String());
        this.preloadSounds(new SoundSet_Harmonica());

        // Load metronome sounds
        this.game.load.audio("metronome",["assets/sounds/metronome.mp3",
                                          "assets/sounds/metronome.ogg"]);
        // Load the music file.
        var src:string = StringTrainerApplication.getURLName("music","music.json");
        this.game.load.json("music",StringTrainerApplication.getURLName("music",src));

        // Switch to game state when load complete.        
        this.game.load.onLoadComplete.add(() => { this.game.state.start("Main",true,false,1); },this);
    }

    /**
     * Load a single set of sounds
     * 
     * @private
     * @param {ISoundSet} desc descriptor for those sounds.
     * @memberof PreloadState
     */
    private preloadSounds(desc:ISoundSet) {
        for (var i:number = 1;i <= desc.getNoteCount();i++) {
            var sound:string = desc.getStem()+"-"+(i < 10 ? "0":"")+i.toString();
            this.game.load.audio(sound,["assets/sounds/"+sound+".mp3",
                                        "assets/sounds/"+sound+".ogg"]);
        }        
    }
}
