/// <reference path="../../lib/phaser.comments.d.ts"/>
/// <reference path="instrument.ts"/>


/**
 * Another example, a Ukulele (standard tuning)
 * 
 * @class Ukulele
 * @extends {Instrument}
 */
class Ukulele extends StringInstrument {

    getDefaultTuning(): string {
        return "g3,d4,a4,e4";
    }
    getStringCount(): number {
        return 4;
    }
}
