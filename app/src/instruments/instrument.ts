/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Base class for instruments, partially implements them.
 * 
 * @class Instrument
 * @implements {IInstrument}
 */
abstract class Instrument implements IInstrument {

    abstract getDefaultTuning(): string;
    abstract getStringCount(): number;
    abstract getRendererFactory():IRendererFactory;
    abstract getSoundSetDescriptor():ISoundSet;

    isContinuous():boolean {
        return false;
    }
    isLowestPitchAtBottom(): boolean {
        return false;
    }
    isDoubleString(str: number): boolean {
        return false;
    }
    toDisplayFret(fret: number): string {
        return fret.toString();
    }
}

/**
 * String Instrument abstract class. Any subclass of this uses the string renderer.
 * 
 * @abstract
 * @class StringInstrument
 * @extends {Instrument}
 */
abstract class StringInstrument extends Instrument {

    getRendererFactory(): IRendererFactory {
        return new StringRendererFactory();
    }
    getSoundSetDescriptor():ISoundSet {
        return new SoundSet_String();
    }

}

/**
 * Base class for diatonic instruments which decodes it back to 1+ format.
 * 
 * @abstract
 * @class DiatonicStringInstrument
 * @extends {Instrument}
 */

abstract class DiatonicStringInstrument extends StringInstrument {

    static TODIATONIC:number[] = [
        0,  0.5,1,  1.5,2,  3,  3.5,4,  4.5,5,  6,  6.5
    //  D   D#  E   F   F#  G   G#  A   A#  B   C   C#
    ];

    toDisplayFret(fret: number): string {
        // Get the offset for the bottom 7
        var n:number = DiatonicStringInstrument.TODIATONIC[fret % 12];
        // Adjust for octave
        n = n + Math.floor(fret/12) * 7;
        // Convert to string
        var display:string = Math.floor(n).toString();
        // If .5 add a '+'
        if (n != Math.floor(n)) {
            display = display + "+";
        }
        return display;
    }
}
