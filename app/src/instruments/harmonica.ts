/// <reference path="../../lib/phaser.comments.d.ts"/>
/// <reference path="instrument.ts"/>

class Harmonica extends StringInstrument {
    
    getDefaultTuning(): string {    
        return "c4,c4,c4";
    }

    // 3 independent strings (usually !)
    getStringCount(): number {
        return 3;
    }
}

