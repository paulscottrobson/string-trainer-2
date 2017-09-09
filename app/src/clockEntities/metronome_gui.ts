/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * This is the visual metronome which oscillates back and forth.
 * 
 * @class VisualMetronome
 * @extends {BaseClockEntity}
 */
class VisualMetronome extends BaseClockEntity {

    private metronome:Phaser.Image;

    constructor(game:Phaser.Game,music:IMusic) {
        super(music.getBeats());
        this.metronome = game.add.image(100,game.height,"sprites","metronome");
        this.metronome.anchor.x = 0.5;this.metronome.anchor.y = 0.9;
        var scale:number = game.height / 4 / this.metronome.height;
        this.metronome.scale.x = this.metronome.scale.y = scale;
        this.metronome.x = game.width - 100;this.metronome.y = this.metronome.height;
    }

    updateOnFractionalChange(bar:number,fracPosInBar:number) {
        // Beat number in whole song
        var overallBeat:number = bar * this.beats + Math.floor(fracPosInBar * this.beats);
        // Work out fractional part in that beat
        var fracOffset = fracPosInBar * this.beats;
        fracOffset = fracOffset - Math.floor(fracOffset) - 0.5;
        // Make it oscillate back and forth
        if (overallBeat % 2 == 0) fracOffset = -fracOffset;
        // Rotate the graphic.
        this.metronome.rotation = Math.sin(fracOffset);

    }

    destroy(): void {
        this.metronome.destroy();
        this.metronome = null;
    }
}