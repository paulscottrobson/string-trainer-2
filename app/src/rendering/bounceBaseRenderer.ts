/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * This class provides the sine curve and bouncing ball.
 * 
 * @abstract
 * @class BounceBaseRenderer
 * @extends {BaseRenderer}
 */
abstract class BounceBaseRenderer extends BaseRenderer {
    
    private sineList:Phaser.Image[];
    private sineStartTime:number[];
    private sineEndTime:number[];

    moveAllObjects(x:number,y:number): void {
        // Position any sine curves.
        for (var n:number = 0;n < this.sineList.length;n++) {
            this.sineList[n].x = x + this.sineStartTime[n] * this.rWidth / (this.bar.getBeats()*4);
            this.sineList[n].y = y + this.getSinePositionOffset();
        }
    }

    drawAllObjects(): void {

        this.sineList = [];
        this.sineStartTime = [];
        this.sineEndTime = [];

        // Now do the sine curves. If nothing in bar, do it on the beat.

        if (this.bar.getStrumCount() == 0) {
            for (var n = 0; n < this.beats; n++) {
                this.addSineGraphic(n * 4, (n + 1) * 4);
            }
        } else {
            // Before the first note
            this.addSineGraphic(0, this.bar.getStrum(0).getStartTime());
            // For each note
            for (var n = 0; n < this.bar.getStrumCount(); n++) {
                this.addSineGraphic(this.bar.getStrum(n).getStartTime(), this.bar.getStrum(n).getEndTime());
            }
            // After the last note.
            this.addSineGraphic(this.bar.getStrum(this.bar.getStrumCount() - 1).getEndTime(), this.beats * 4)
        }

    }

    eraseAllObjects(): void {
        for (var img2 of this.sineList) {
            img2.destroy();
        }
        this.sineList = this.sineStartTime = this.sineEndTime = null;
    }
    
    /**
    * Offset from centre line of area for the sine curves
    * 
    * @private
    * @returns {number} offset (vertical) from centre line
    * @memberof StringRenderer
    */
    private getSinePositionOffset(): number {
        return 0;
    }

    /**
    * Add a sine curve representing this range - if there is a range
    * 
    * @private
    * @param {number} start start time quarter beats
    * @param {number} end end time quarter beats
    * @memberof StringRenderer
    */
    private addSineGraphic(start: number, end: number) {
        if (start != end) {
            var sineHeight: number = this.getSineCurveHeight();
            var sineWidth: number = (end - start) * this.rWidth / (this.bar.getBeats() * 4);
            var img: Phaser.Image = this.game.add.image(0, 0, "sprites",
                (sineWidth / sineHeight > 1.4) ? "sinecurve_wide" : "sinecurve",
                this);
            img.width = sineWidth; img.height = sineHeight; img.anchor.y = 1;
            // img.tint = 0;
            this.sineList.push(img);
            this.sineStartTime.push(start);
            this.sineEndTime.push(end);
            // console.log(start,end,sineHeight,sineWidth);
        }
    }

    getXBall(fractionalBar: number): number {
        return fractionalBar * this.rWidth;
    }

    getYBall(fractionalBar: number): number {
        var qbPos: number = fractionalBar * this.bar.getBeats() * 4;
        for (var n: number = 0; n < this.sineList.length; n++) {
            if (qbPos >= this.sineStartTime[n] && qbPos < this.sineEndTime[n]) {
                var prop: number = (qbPos - this.sineStartTime[n]) / (this.sineEndTime[n] - this.sineStartTime[n]);
                var offset: number = Math.sin(prop * Math.PI);
                offset = offset * this.getSineCurveHeight();
                return this.getSinePositionOffset()-offset;
            }
        }
        return 0;
    }

    /**
     * Get height of sine curve
     * 
     * @returns {number} height in game units
     * @memberof BounceBaseRenderer
     */
    getSineCurveHeight():number {
        return this.game.height / 6;
    }
}
