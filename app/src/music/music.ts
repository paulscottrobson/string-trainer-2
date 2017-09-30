/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Class representing a single piece of music played on a specific instrument.
 * 
 * @class Music
 * @implements {IMusic}
 */
class Music implements IMusic {
    
    private json:any; 
    private barCount:number;
    private bars:IBar[];
    private beats:number;
    private tempo:number;
    private capo:number;
    private instrument:IInstrument;

    constructor(musicJSON:any) {
        // Get basic stuff
        this.json = musicJSON;
        this.barCount = 0;
        this.bars = [];
        this.beats = parseInt(this.json["beats"],10);
        this.tempo = parseInt(this.json["speed"],10);
        this.capo = parseInt(this.json["capo"],10);
        // Get the instrument's information object
        this.instrument = this.getInstrumentObject(this.json["instrument"]);
        // Initial count in
        this.bars.push(new Bar("",this.beats,this.instrument,this.barCount));
        this.barCount++;
        // Parse bars.
        for (var barDef of this.json["bars"]) {
            this.bars.push(new Bar(barDef,this.beats,this.instrument,this.barCount));
            this.barCount++;
        }
        //console.log(this.getInfo(MusicInfoItem.Tuning),this.capo,this.tempo);
        //console.log(this.getTuning());
        //console.log(this.instrument.getDefaultTuning());
    }

    destroy() {
        this.json = null;
    }

    getInfo(info: MusicInfoItem): string {      
        var rInfo:string = "";
        switch (info) {
            case MusicInfoItem.Composer:
                rInfo = this.json["composer"];break;
            case MusicInfoItem.Instrument:
                rInfo = this.json["instrument"];break;
            case MusicInfoItem.Title:
                rInfo = this.json["title"];break;
            case MusicInfoItem.Translator:
                rInfo = this.json["translator"];break;
            case MusicInfoItem.Tuning:
                rInfo = this.json["tuning"];break;
            default:
                throw new Error("Not implemented.");
        }
        return rInfo;
    }
    getBarCount(): number {
        return this.barCount;
    }
    getBar(bar: number): IBar {
        return this.bars[bar];
    }
    getBeats(): number {
        return this.beats;
    }
    getTempo(): number {
        return this.tempo;
    }
    getCapoPosition(): number {
        return this.capo;
    }
    getInstrument(): IInstrument {
        return this.instrument;
    }
    getTuning(): string[] {
        var tuning:string = this.json["tuning"];
        if (tuning == "") {
            tuning = this.instrument.getDefaultTuning();
        }
        var tuningSet:string[] = tuning.toLowerCase().split(",");
        while (tuningSet.length < this.instrument.getStringCount()) {
            tuningSet.push(tuningSet[0]);
        }
        return tuningSet;
    }

    /**
     * A factory method that gets the instrument class for a given instrument.
     * When you add a new instrument, say a Guitar, you need to create an
     * information class (6 strings etc.) and put the type in here.
     * 
     * @private
     * @param {string} name name of instrument
     * @returns {IInstrument} information class.
     * @memberof Music
     */
    private getInstrumentObject(name:string):IInstrument {
        var iObj:IInstrument = null;
        switch(name) {
            case "dulcimer":
                iObj = new MountainDulcimer();break;
            case "ukulele":
                iObj = new Ukulele();break;
            case "mandolin":
                iObj = new Mandolin();break;
            case "harmonica":
                iObj = new Harmonica();break;
            default:
                throw new Error("Not implemented.");
        }
        return iObj;
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

    public static convertToID(name:string):number {
        name = name.toUpperCase();
        var base:number = Music.NOTETOOFFSET[name.substr(0,name.length-1)];
        base = base + (name.charCodeAt(name.length-1)-49) * 12;
        return base;
    }

    private static NOTETOOFFSET:any = { 
        "C":0,"C#":1,"D":2,"D#":3,"E":4,"F":5,"F#":6,"G":7,"G#":8,"A":9,"A#":10,"B":11
    };

    private static NOTEISSHARP:boolean[] = [
        false,true,false,true,false,false,true,false,true,false,true,false
    ];

    /**
     * Is a note sharp ?
     * 
     * @static
     * @param {number} id note ID
     * @returns true if it is a sharp
     * @memberof Music
     */
    public static isNoteIDSharp(id:number) {
        return Music.NOTEISSHARP[id % 12];
    }

    /**
     * Get the tuning for this music file as IDs.
     * 
     * @returns {number[]} 
     * @memberof Music
     */
    getTuningByID(): number[] {
        var tuning:string[] = this.getTuning();
        var byID:number[] = [];
        var soundSet:ISoundSet = this.getInstrument().getSoundSetDescriptor();        
        var baseNoteID = Music.convertToID(soundSet.getBaseNote());
        for (var t of tuning) {
            byID.push(Music.convertToID(t) - baseNoteID - 1);
        }
        //console.log(byID);
        return byID;
    }
}