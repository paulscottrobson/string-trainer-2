/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Items that can be retrieved as information.
 * 
 * @enum {number}
 */
enum MusicInfoItem {
    Title, Composer, Translator, Instrument, Tuning
}

/**
 * Single Musical Entity Interface
 * 
 * @interface IMusic
 */
interface IMusic {

    /**
     * Get a general piece of information about the music.
     * 
     * @param {MusicInfoItem} info one of the retrievables.
     * @returns {string} 
     * @memberof IMusic
     */
    getInfo(info:MusicInfoItem):string;

    /**
     * Get the number of bars
     * 
     * @returns {number} number of bars
     * @memberof IMusic
     */
    getBarCount(): number;

    /**
     * Access a specific bar
     * 
     * @param {number} bar bar number indexed from zero
     * @returns {IBar} bar object
     * @memberof IMusic
     */
    getBar(bar:number):IBar;

    /**
     * Get the number of beats in the bar.
     * 
     * @returns {number} beats in the bar
     * @memberof IMusic
     */
    getBeats():number;

    /**
     * Get the music tempo.
     * 
     * @returns {number} tempo of music in beats/minute
     * @memberof IMusic
     */
    getTempo():number;

    /**
     * Get the capo position
     * 
     * @returns {number} Capo position - 0 if none.
     * @memberof IMusic
     */
    getCapoPosition():number;

    /**
     * Get the instrument information object associated with this music.
     * 
     * @returns {IInstrument} 
     * @memberof IMusic
     */
    getInstrument():IInstrument;

    /**
     * Get the tuning information
     * 
     * @returns {string[]} array of tuning for strings, lowest first in c#4 format.
     * @memberof IMusic
     */
    getTuning():string[];

}

