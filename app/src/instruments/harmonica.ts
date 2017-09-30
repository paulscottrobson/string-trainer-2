/// <reference path="../../lib/phaser.comments.d.ts"/>
/// <reference path="instrument.ts"/>

/**
 * Harmonica.
 * 
 * Obviously NOT a stringed instrument. So instead we view it as a 3 string
 * instrument (perhaps should be 4 or 5) as the number of simultaneous notes
 * each of which can play one of the diatonic notes.
 * 
 * @class Harmonica
 * @extends {Instrument}
 */
class Harmonica extends Instrument {
    
    getDefaultTuning(): string {    
        return "c4";
    }

    // 3 independent strings (usually !)
    getStringCount(): number {
        return 3;
    }

    getSoundSetDescriptor(): ISoundSet {
        return new SoundSet_Harmonica();
    }

    isContinuous(): boolean {
        return true;
    }

    getInstrumentRendererFactory() : IRendererFactory {
        return new HarmonicaRendererFactory();
    }

    toDisplayFret(fret: number): string {
        if (Harmonica.toDisplayConverted == null) {
            // Converts TODISPLAY static to an array.
            var s:string = "";
            for (var s1 of Harmonica.TODISPLAY) { s = s + " " + s1; }
            s = s.replace("\t"," ");
            Harmonica.toDisplayConverted = s.split(" ").filter(function(s) {return (s != "");})            
        }
        return Harmonica.toDisplayConverted[fret-1];
    }

    private static toDisplayConverted:string[] = null;

    private static TODISPLAY:string[] = [
        //  C   C#  D   D#  E   F     F#    G   G#     A     A#     B
        "   1   -1b -1  X   2   -2bb  -2b   3   -3bbb  -3bb  -3b    -3",
        "   4   -4b -4  X   5   -5    X     6   -6b    -6    X      -7",
        "   7   X   -8  8b  8   -9    9b   9   X       -10   10bb   10b",
        "   10"
    ]
}

