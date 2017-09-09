/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Interface to a sound set descriptor
 * 
 * @interface ISoundSet
 */
interface ISoundSet {
    /**
     * Lowest note (e.g. note 01) in C4 format
     * 
     * @returns {string} string descriptor using D#3 format. (no flats)
     * @memberof ISoundSet
     */
    getBaseNote():string;
    /**
     * Get Number of notes in set
     * 
     * @returns {number} 
     * @memberof ISoundSet
     */
    getNoteCount():number;
    /**
     * Get the stem descriptor
     * 
     * @returns {string} 
     * @memberof ISoundSet
     */
    getStem():string;
}