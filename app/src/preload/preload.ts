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

        // Load metronome sounds
        this.game.load.audio("metronome",["assets/sounds/metronome.mp3",
                                          "assets/sounds/metronome.ogg"]);        

        // Analyse music and load sounds
        this.analyseMusic();                                          
        // Switch to game state when load complete.        
        this.game.load.onLoadComplete.add(() => { this.game.state.start("Main",true,false,1); },this);
    }

    /**
     * Load a single set of sounds
     * 
     * @private
     * @param {ISoundSet} desc descriptor for those sounds.
     * @param {Object} toLoad object whose keys specify the number to be loaded.
     * @memberof PreloadState
     */
    private preloadSounds(desc:ISoundSet,toLoad:Object) {
   
        for (var is in toLoad) {
            var i:number = parseInt(is,10);
            var sound:string = desc.getStem()+"-"+(i < 10 ? "0":"")+i.toString();
            this.game.load.audio(sound,["assets/sounds/"+sound+".mp3",
                                        "assets/sounds/"+sound+".ogg"]);
        }        
    }

    /**
     * Analyses a music object to see which notes it requires and
     * loads them.
     * 
     * @private
     * @memberof PreloadState
     */
    private analyseMusic() : void {
        // Numbers to load.
        var used:Object = {}
        // Load Music in amd convert to object
        var json:any = this.game.cache.getJSON("music");
        var music:IMusic = new Music(json);
        // Get tuning base
        var tuning:number[] = music.getTuningByID();
        // Work through all bars, strums and strings to see which notes are played
        for (var bar:number = 0;bar < music.getBarCount();bar++) {
            for (var strum:number = 0;strum < music.getBar(bar).getStrumCount();strum++) {
                var strumDef:IStrum = music.getBar(bar).getStrum(strum);
                for (var stringID = 0;stringID < strumDef.getStringCount();stringID++) {
                    var chromOffset = strumDef.getFretPosition(stringID);
                    if (chromOffset != Strum.NOSTRUM) {
                        //console.log(chromOffset,tuning[stringID])
                        used[(chromOffset+tuning[stringID]).toString()] = true
                    }
                }
            }
        }
        // And load only those.
        this.preloadSounds(music.getInstrument().getSoundSetDescriptor(),used);
    }
}
