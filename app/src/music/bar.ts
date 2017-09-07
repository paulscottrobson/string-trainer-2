/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Concrete Bar implementation
 * 
 * @class Bar
 * @implements {IBar}
 */
class Bar implements IBar {

    private barNumber:number;
    private beats:number;
    private strums:IStrum[];
    private strumCount:number;

    /**
     * Creates an instance of Bar.
     * @param {string} def bar definition encoded
     * @param {number} beats number of beats
     * @param {IInstrument} instrument instrument info
     * @param {number} barNumber bar number
     * @memberof Bar
     */
    constructor(def:string,beats:number,instrument:IInstrument,barNumber:number) {
        this.barNumber = barNumber;
        this.beats = beats;
        this.strums = [];
        this.strumCount = 0;
        var qbTime:number = 0;
        var currentLabel:string = "";
        if (def != "") {
            for (var strumDef of def.split(";")) {
                if (strumDef[0] == '[') {
                    currentLabel = strumDef.substr(1,strumDef.length-2);
                } else {
                    var strum:IStrum = new Strum(strumDef,instrument,qbTime,currentLabel);
                    this.strums.push(strum);
                    this.strumCount++;
                    qbTime = qbTime + strum.getLength();
                }
            }
        }
    }

    getBarNumber(): number {
        return this.barNumber;
    }
    getStrumCount(): number {
        return this.strumCount;
    }
    getStrum(strum: number): IStrum {
        return this.strums[strum];
    }
    getBeats(): number {
        return this.beats;
    }

}