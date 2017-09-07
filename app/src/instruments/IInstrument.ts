/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Instrument descriptor class
 * 
 * @interface IInstrument
 */
interface IInstrument {
    /**
     * Get the default tuning for this instrument
     * 
     * @returns {string} default tuning e.g. d3,a3,d4
     * @memberof IInstrument
     */
    getDefaultTuning(): string;

    /**
     * Get the number of independent strings (Mandolin is 4 not 8)
     * 
     * @returns {number} number of strings
     * @memberof IInstrument
     */
    getStringCount(): number;

    /**
     * Is the lowest pitch at the bottom of the TAB display. It normally is
     * but Dulcimers aren't.
     * 
     * @returns {boolean} true if lowest pitch at bottom
     * @memberof IInstrument
     */
    isLowestPitchAtBottom(): boolean;

    /**
     * Is given string double string.
     * 
     * @param {number} str string number (0 = lowest pitch)
     * @returns {boolean} true if double stringed
     * @memberof IInstrument
     */
    isDoubleString(str:number):boolean;

    /**
     * Convert a display fret number (chromatic) to a displayable fret number.
     * 
     * @param {number} fret 
     * @returns {number} 
     * @memberof IInstrument
     */
    toDisplayFret(fret:number):string;

    /**
     * Is the instrument continuous (i.e. the sound needs to be cut off at its end)
     * so a Harmonica will keep playing as long as you blow through it, but a strummed
     * string will die away naturally.
     * 
     * @returns {boolean} 
     * @memberof IInstrument
     */
    isContinuous():boolean;

    /**
     * Get factory for creating renderers/managers for this instrument.
     * 
     * @returns {IRendererFactory} 
     * @memberof IInstrument
     */
    getRendererFactory(): IRendererFactory;

    /**
     * Get the descriptor for the sound set to be used for this instrument.
     * 
     * @returns {ISoundSet} 
     * @memberof IInstrument
     */
    getSoundSetDescriptor(): ISoundSet;
}