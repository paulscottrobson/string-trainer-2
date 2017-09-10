/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Interface for controllable global playback object
 * 
 * @interface IControllable
 */
interface IControllable {
    /**
     * Set the position in the playback
     * 
     * @param {number} barFractionalPosition 
     * @memberof IControllable
     */
    setPosition(barFractionalPosition:number) : void ;
    /**
     * Update the tempo
     * 
     * @param {number} tempo 
     * @memberof IControllable
     */
    setTempo(tempo:number) : void ;
    /**
     * Get current position.
     * 
     * @returns {number} 
     * @memberof IControllable
     */
    getPosition(): number  ;
    /**
     * Get current tempo
     * 
     * @returns {number} 
     * @memberof IControllable
     */
    getTempo(): number ;
    /**
     * Get default tempo
     * 
     * @returns {number} 
     * @memberof IControllable
     */
    getDefaultTempo(): number ;
}
