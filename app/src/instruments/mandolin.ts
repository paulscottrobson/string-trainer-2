/// <reference path="../../lib/phaser.comments.d.ts"/>
/// <reference path="instrument.ts"/>

/**
 * Mandolin.
 * 
 * @class Mandolin
 * @implements {IInstrument}
 */
class Mandolin extends StringInstrument {

    getDefaultTuning(): string {
        return "g3,d4,a4,e5";
    }
    getStringCount(): number {
        return 4;
    }
    isDoubleString(str: number): boolean {
        return true;
    }
}