/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Metronome audio.
 * 
 * @class AudioMetronome
 * @extends {BaseClockEntity}
 */
class AudioMetronome extends BaseClockEntity {

    private metronomeOn: boolean;
    private tick:Phaser.Sound;

    /**
     * Create an audio metronome object
     * 
     * @param {Phaser.Game} game 
     * @param {IMusic} music 
     * @memberof AudioMetronome
     */
    constructor(game:Phaser.Game,music:IMusic) {
        super(music.getBeats());
        this.tick = game.add.audio("metronome");
        this.metronomeOn = true;
    }

    destroy() : void {
        this.tick = null;
    }

    /**
     * Set metronome on/off state
     * 
     * @param {boolean} isOn true if on.
     * @memberof AudioMetronome
     */
    setMetronome(isOn:boolean) {
        this.metronomeOn = isOn;
    }

    updateOnQuarterBeatChange(bar:number,quarterBeat:number) { 
        if (quarterBeat % 4 == 0 && this.metronomeOn) {
            this.tick.play("",0,(quarterBeat == 0) ? 1.0 : 0.5,false,true);
        }
    }
}