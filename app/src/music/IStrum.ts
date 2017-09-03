/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Interface to a single strum group
 * 
 * @interface IStrum
 */
interface IStrum {
    /**
     * Get the number of independent strings (e.g. mandolin is 4 not 8)
     * 
     * @returns {number} 
     * @memberof IStrum
     */
    getStringCount():number;
    /**
     * Get the fret position of a strum on a specific string
     * 
     * @param {number} stringNumber the string from 0 upwards (0 = lowest pitch string)
     * @returns {number} fret position (chromatic) or -1 if not strummed this strum
     * @memberof IStrum
     */
    getFretPosition(stringNumber:number):number;

    /**
     * Get the start time of the strum in the bar
     * 
     * @returns {number} start time in millibars
     * @memberof IStrum
     */
    getStartTime():number;

    /**
     * Get the end time of the strum in the bar
     * 
     * @returns {number} end time in millibars
     * @memberof IStrum
     */
    getEndTime():number;

    /**
     * Get the duration of the strum 
     * 
     * @returns {number} duration in millibars
     * @memberof IStrum
     */
    getLength():number;

    /**
     * Get the displayed label for this strum
     * 
     * @returns {string} displayed string, or empty string for nothing.
     * @memberof IStrum
     */
    getLabel():string;
}