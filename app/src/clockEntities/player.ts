/// <reference path="../../lib/phaser.comments.d.ts"/>

class MusicPlayer extends BaseClockEntity implements IClockAudioEntity {

    private notes:Phaser.Sound[];
    private music:IMusic;
    private baseNoteID:number;
    private tuning:number[];
    private stringSoundIndex:number[];
    private musicOn:boolean;

    constructor(game:Phaser.Game,music:IMusic) {
        super(music.getBeats());
        this.music = music;
        this.loadNoteSet(game)
        var tuning:string[] = this.music.getTuning();
        this.tuning = [];
        this.stringSoundIndex = [];
        this.musicOn = true;
        for (var n:number = 0;n < tuning.length;n++) {
            this.tuning[n] = this.convertToID(tuning[n]);
            this.stringSoundIndex[n] = Strum.NOSTRUM;
            //console.log(tuning[n],this.tuning[n]);
        }
    }

    destroy() : void {
        for (var note of this.notes) { note.destroy(); }
        this.notes = null;
        this.music = null;
        this.tuning = null;
    }

    setVolume(isOn:boolean) : void {
        this.musicOn = isOn;
    }

    updateOnQuarterBeatChange(bar:number,quarterBeat:number) {        
        // Bad position, shut up and exit
        if (bar < 0 || bar >= this.music.getBarCount() || !this.musicOn) {
            this.stopAllNotes();
            return;
        }
        // Get bar info
        var barInfo:IBar = this.music.getBar(bar);
        // Check each strum
        for (var n = 0;n < barInfo.getStrumCount();n++) {
            var strum:IStrum = barInfo.getStrum(n);
            // If end note, and continuous (e.g. play till stopped) silence.
            if (strum.getEndTime() == quarterBeat) {
                if (this.music.getInstrument().isContinuous()) {
                    this.stopAllNotes();
                    //console.log("stopped all");
                }
            }
            // Time to play some music.
            if (strum.getStartTime() == quarterBeat) {
                // Play each string
                for (var ns = 0;ns < strum.getStringCount();ns++) {
                    var offset:number = strum.getFretPosition(ns);
                    if (offset != Strum.NOSTRUM) {
                        this.startNote(offset,ns);
                    }
                }
            }
        }
    }        

    /**
     * Start playing given note
     * 
     * @private
     * @param {number} noteOffset offset chromatic from tuning.
     * @param {number} stringID string being played on.
     * @memberof MusicPlayer
     */
    private startNote(noteOffset:number,stringID:number) {
        if (this.stringSoundIndex[stringID] != Strum.NOSTRUM) {
            this.notes[this.stringSoundIndex[stringID]].stop();
            this.stringSoundIndex[stringID] = Strum.NOSTRUM;
        }
        this.stringSoundIndex[stringID] = noteOffset + 
                                    this.tuning[stringID] - this.baseNoteID + 1;
        this.notes[this.stringSoundIndex[stringID]].play();
    }

    /**
     * Stop all playing notes.
     * 
     * @private
     * @memberof MusicPlayer
     */
    private stopAllNotes(): void {
        for (var n = 0;n < this.stringSoundIndex.length;n++) {
            if (this.stringSoundIndex[n] != Strum.NOSTRUM) {
                this.notes[this.stringSoundIndex[n]].stop();
                this.stringSoundIndex[n] = Strum.NOSTRUM;
            }
        }
    }
    /**
     * Load in (as Phaser.Sound objects) a complete set of notes.
     * 
     * @private
     * @param {Phaser.Game} game 
     * @memberof MusicPlayer
     */
    private loadNoteSet(game:Phaser.Game) {
        var soundSet:ISoundSet = this.music.getInstrument().getSoundSetDescriptor();
        this.notes = [];
        for (var n = 1;n <= soundSet.getNoteCount();n++) {
            var name:string = soundSet.getStem()+"-"+(n < 10 ? "0":"")+n.toString();
            this.notes[n] = game.add.audio(name);
        }
        this.baseNoteID = this.convertToID(soundSet.getBaseNote());
    }

    /**
     * Convert a string description "C#4" to a chromatic note offset
     * e.g. C1 is zero.
     * 
     * @protected
     * @param {string} name 
     * @returns {number} equivalent number.
     * @memberof MusicPlayer
     */

    protected convertToID(name:string):number {
        name = name.toUpperCase();
        var base:number = MusicPlayer.NOTETOOFFSET[name.substr(0,name.length-1)];
        base = base + (name.charCodeAt(name.length-1)-49) * 12;
        return base;
    }

    private static NOTETOOFFSET:any = { 
        "C":0,"C#":1,"D":2,"D#":3,"E":4,"F":5,"F#":6,"G":7,"G#":8,"A":9,"A#":10,"B":11
    };
}