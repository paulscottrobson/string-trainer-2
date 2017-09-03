/// <reference path="../../lib/phaser.comments.d.ts"/>
/// <reference path="instrument.ts"/>

/**
 * Mountain dulcimer class.
 * 
 * @class MountainDulcimer
 * @implements {IInstrument}
 */
class MountainDulcimer extends DiatonicInstrument {

    // Okay, so not always right, but this or d3,a3,a3.
    getDefaultTuning(): string {    
        return "d3,a3,d4";
    }

    // 3 independent strings (usually !)
    getStringCount(): number {
        return 3;
    }

    // In Mountain Dulcimer TAB the highest pitch is at the bottom.
    isLowestPitchAtBottom(): boolean {
        return false;
    }

    // The highest string (numbered 0,1,2) is often a double string on a MD.
    isDoubleString(str: number): boolean {
        return (str == 2);
    }
}

/**
 * Another example, a Ukulele (standard tuning)
 * 
 * @class Ukulele
 * @extends {Instrument}
 */
class Ukulele extends Instrument {

    getDefaultTuning(): string {
        return "g3,d4,a4,e4";
    }
    getStringCount(): number {
        return 4;
    }
}

/**
 * Mandolin.
 * 
 * @class Mandolin
 * @implements {IInstrument}
 */
class Mandolin extends Instrument {

    getDefaultTuning(): string {
        return "g3,d3,a4,e5";
    }
    getStringCount(): number {
        return 4;
    }
    isDoubleString(str: number): boolean {
        return true;
    }
}