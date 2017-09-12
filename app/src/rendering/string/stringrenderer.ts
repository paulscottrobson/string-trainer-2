/// <reference path="../../../lib/phaser.comments.d.ts"/>

/**
 * This is responsible for rendering string strums - guitar, ukulele, dulcimer etc.
 * 
 * @class StringRenderer
 * @extends {BaseRenderer}
 */
class StringRenderer extends BounceBaseRenderer {

    private markerList:StrumMarker[];

    private barMarker:Phaser.Image;

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
        // Sine curves
        super.moveAllObjects(x,y);
        // Position barmarker
        this.barMarker.x = x;this.barMarker.y = y;
    }

    drawAllObjects() {

        this.markerList = [];

        // Create the start of bar marker on the bottom.
        this.barMarker = this.game.add.image(0,0,"sprites","bar",this);
        this.barMarker.anchor.x = 0.5;this.barMarker.height = this.rHeight;
        this.barMarker.width = Math.max(1,this.rWidth / 48);

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
        // Sine curves
        super.drawAllObjects();
    }

    // Colour set used to draw buttons.
    private static _colours:number[] = 
        [   0xFF0000,0x00FF00,0x0040FF,0xFFFF00,0x00FFFF,0xFF00FF,0xFF8000,
            0x808080,0xFFFFFF,0x8B4513 ];

    eraseAllObjects(): void {
        super.eraseAllObjects();
        for (var img of this.markerList) {
            img.destroy();
        }
        this.barMarker.destroy();
        this.barMarker = null;
        this.markerList = null;
    }

}
