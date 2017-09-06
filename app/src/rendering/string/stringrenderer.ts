/// <reference path="../../../lib/phaser.comments.d.ts"/>

/**
 * This is responsible for rendering string strums - guitar, ukulele, dulcimer etc.
 * 
 * @class StringRenderer
 * @extends {BaseRenderer}
 */
class StringRenderer extends BaseRenderer {

    private markerList:StrumMarker[];
    private sineList:Phaser.Image[];
    private sineStartTime:number[];
    private sineEndTime:number[];

    moveAllObjects(x: number, y: number): void {
        var beats:number = this.bar.getBeats();
        // we use this to work through the objects in order
        var midx:number = 0;
        // work through strums
        for (var n:number = 0;n < this.bar.getStrumCount();n++) {
            // access strum and calculate midposition in space
            var strum:IStrum = this.bar.getStrum(n);
            var xPos:number = (strum.getStartTime()+strum.getLength()/2) * this.rWidth / (4 * beats);            
            // work through non strum frets
            for (var str:number = 0;str < this.instrument.getStringCount();str++) {
                var fret:number = strum.getFretPosition(str);
                if (fret != Strum.NOSTRUM) {
                    // Reposition horizontally and vertically
                    this.markerList[midx].x = x + xPos;
                    var drawStr:number = str;
                    if (this.instrument.isLowestPitchAtBottom()) {
                        drawStr = (this.instrument.getStringCount()-1-drawStr);
                    }
                    this.markerList[midx].y = y + (drawStr + 0.5) * this.rHeight / (this.instrument.getStringCount());
                    // Look at the next strum marker.
                    midx++;
                }
            }
        }
        // Position any sine curves.
        for (var n:number = 0;n < this.sineList.length;n++) {
            this.sineList[n].x = x + this.sineStartTime[n] * this.rWidth / (this.bar.getBeats()*4);
            this.sineList[n].y = y + this.getSinePositionOffset();
        }
    }

    drawAllObjects() {
        this.markerList = [];
        this.sineList = [];         
        this.sineStartTime = [];
        this.sineEndTime = [];
        var beats:number = this.bar.getBeats();
        // Height of object, allow spacing
        var objHeight:number = this.rHeight / (this.instrument.getStringCount()) * 0.9;
        // Work through strums in this bar.
        for (var n:number = 0;n < this.bar.getStrumCount();n++) {
            // Access strum, work out how long the strum is.
            var strum:IStrum = this.bar.getStrum(n);
            var objWidth:number = this.rWidth * strum.getLength() / (4 * beats) * 0.95;
            // Work through each string
            for (var str:number = 0;str < this.instrument.getStringCount();str++) {
                // Retreive fret number
                var fret:number = strum.getFretPosition(str);
                // If strumming
                if (fret != Strum.NOSTRUM) {
                    // Work out display colour.
                    var colour:number = StringRenderer._colours[fret % StringRenderer._colours.length];
                    // Work out display name.
                    var fName:string = this.instrument.toDisplayFret(fret);
                    // Create the strum marker.
                    var sm:StrumMarker = new StrumMarker(this.game,fName,
                                                         objWidth,objHeight,
                                                         colour);
                    // add to list - order is important.                                                         
                    this.markerList.push(sm);
                }
            }        
        }
        // Now do the sine curves. If nothing in bar, do it on the beat.
        if (this.bar.getStrumCount() == 0) {
            for (var n = 0;n < beats;n++) {
                this.addSineGraphic(n*4,(n+1)*4);
            }
        } else {
            // Before the first note
            this.addSineGraphic(0,this.bar.getStrum(0).getStartTime());
            // For each note
            for (var n = 0;n < this.bar.getStrumCount();n++) {
                this.addSineGraphic(this.bar.getStrum(n).getStartTime(),this.bar.getStrum(n).getEndTime());
            }
            // After the last note.
            this.addSineGraphic(this.bar.getStrum(this.bar.getStrumCount()-1).getEndTime(),beats*4)
        }
    }

    // Colour set used to draw buttons.
    private static _colours:number[] = 
        [   0xFF0000,0x00FF00,0x0040FF,0xFFFF00,0x00FFFF,0xFF00FF,0xFF8000,
            0x808080,0xFFFFFF,0x8B4513 ];

    eraseAllObjects(): void {
        for (var img of this.markerList) {
            img.destroy();
        }
        for (var img2 of this.sineList) {
            img2.destroy();
        }
        this.markerList = this.sineList = this.sineStartTime = this.sineEndTime = null;
    }

    /**
     * Offset from centre line of area for the sine curves
     * 
     * @private
     * @returns {number} offset (vertical) from centre line
     * @memberof StringRenderer
     */
    private getSinePositionOffset(): number {
        return - this.rHeight/2;
    }

    /**
     * Add a sine curve representing this range - if there is a range
     * 
     * @private
     * @param {number} start start time quarter beats
     * @param {number} end end time quarter beats
     * @memberof StringRenderer
     */
    private addSineGraphic(start:number,end:number) {
        if (start != end) {
            var sineHeight:number = this.rHeight/2;
            var sineWidth:number = (end-start)*this.rWidth / (this.bar.getBeats()*4);
            var img:Phaser.Image = this.game.add.image(0,0,"sprites",
                                            (sineWidth/sineHeight > 1.4) ? "sinecurve_wide":"sinecurve",
                                            this);
            img.width = sineWidth;img.height = sineHeight;img.anchor.y = 0;
            // img.tint = 0;
            this.sineList.push(img);
            this.sineStartTime.push(start);
            this.sineEndTime.push(start);
            // console.log(start,end,sineHeight,sineWidth);
        }
    }

}