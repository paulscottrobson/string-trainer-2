/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Base class for clock entities (mainly sound production). Provides
 * two methods to be overridden either on quarterbeat change or
 * any change.
 * 
 * @class BaseClockEntity
 */
class BaseClockEntity {

    protected beats:number;
    private lastBar:number;
    private lastQBeat:number;

    /**
     * Create the entity
     * 
     * @param {number} beats number of beats in the bar
     * @memberof BaseClockEntity
     */
    constructor(beats:number) {
        this.beats = beats;
        this.lastBar = this.lastQBeat = -1;    
    }

    /**
     * Update the time in the entity
     * 
     * @param {number} fracPos fractional bar position
     * @memberof BaseClockEntity
     */
    updateTime(fracPos:number) {
        var bar:number = Math.floor(fracPos);
        var qBeat:number = Math.floor((fracPos-bar) * this.beats * 4);
        if (bar != this.lastBar || qBeat != this.lastQBeat) {
            this.updateOnQuarterBeatChange(bar,qBeat);            
            this.lastBar = bar;
            this.lastQBeat = qBeat;
        }
        this.updateOnFractionalChange(bar,fracPos-bar);
    }

    /**
     * Called when quarter beat changes - override this
     * 
     * @param {number} bar bar number
     * @param {number} quarterBeat quarterbeat position
     * @memberof BaseClockEntity
     */
    updateOnQuarterBeatChange(bar:number,quarterBeat:number) {        
    }

    /**
     * Called when fractional position changes - override this
     * 
     * @param {number} bar bar number
     * @param {number} fracPosInBar fractional position in bar
     * @memberof BaseClockEntity
     */
    updateOnFractionalChange(bar:number,fracPosInBar:number) {

    }
}