/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Clockable entity
 * 
 * @interface IClockEntity
 */

interface IClockEntity {

    /**
     * Update the time in the entity
     * 
     * @param {number} fracPos fractional bar position
     * @memberof BaseClockEntity
     */
    updateTime(fracPos:number) : void;

    destroy(): void;
}
