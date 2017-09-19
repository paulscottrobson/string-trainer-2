/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Clockable entity that makes noise - has option to shut it up.
 * 
 * @interface IClockAudioEntity
 * @extends {IClockEntity}
 */
interface IClockAudioEntity extends IClockEntity {
    /**
     * Set audio volume
     * 
     * @param {boolean} isOn 
     * @memberof IClockAudioEntity
     */
    setVolume(isOn:boolean) : void ;
}
