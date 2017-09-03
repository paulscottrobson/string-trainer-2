/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Bar Interface
 * 
 * @interface IBar
 */
interface IBar {
    /**
     * Get the bar number
     * 
     * @returns {number} bar number, indexed from zero.
     * @memberof IBar
     */
    getBarNumber(): number;

    /**
     * Get the number of strums in the bar
     * 
     * @returns {number} number of strums
     * @memberof IBar
     */
    getStrumCount(): number;
    
    /**
     * Get a specific strum from the bar
     * 
     * @param {number} strum number of strum, indexed from zero.
     * @returns {IStrum} strum object
     * @memberof IBar
     */
    getStrum(strum:number):IStrum;

    /**
     * Get the number of beats in this bar.
     * 
     * @returns {number} 
     * @memberof IBar
     */
    getBeats():number;


}