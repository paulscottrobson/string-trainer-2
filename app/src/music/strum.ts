/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Concrete strum implementation
 * 
 * @class Strum
 * @implements {IStrum}
 */

class Strum implements IStrum {

    public static NOSTRUM:number = -1;

    private stringCount:number;
    private fretting:number[];
    private startTime:number;
    private qbLength:number;
    private label:string;

    constructor(strumDef:string,instrument:IInstrument,startTime:number,label:string) {
        this.stringCount = instrument.getStringCount();
        this.startTime = startTime;
        this.label = label;
        this.qbLength = parseInt(strumDef.substr(-2),10);
        this.fretting = [];
        for (var n = 0;n < this.stringCount;n++) {
            var c:number = parseInt(strumDef.substr(n*2,2),10);
            c = (c == 99) ? Strum.NOSTRUM : c;        
            this.fretting.push(c);
        }
        // console.log(strumDef,this.qbLength,this.label,this.fretting);
    }

    getStringCount(): number {
        return this.stringCount;
    }
    getFretPosition(stringNumber: number): number {
        return this.fretting[stringNumber];
    }
    getStartTime(): number {
        return this.startTime;
    }
    getEndTime(): number {
        return this.startTime + this.qbLength;
    }
    getLength(): number {
        return this.qbLength;
    }
    getLabel(): string {
        return this.label;
    }

}