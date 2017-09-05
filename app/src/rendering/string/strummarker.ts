/// <reference path="../../../lib/phaser.comments.d.ts"/>

/**
 * Invariant graphic which is a rounded end button with text on it. 
 * 
 * @class StrumMarker
 * @extends {Phaser.Group}
 */
class StrumMarker extends Phaser.Group {
    /**
     * Create a strum marker.
     * 
     * @param {Phaser.Game} game Phaser game object
     * @param {string} sText text to go on
     * @param {number} width size
     * @param {number} height size
     * @param {number} tint colour of background.
     * @memberof StrumMarker
     */
    constructor(game:Phaser.Game,sText:string,width:number,height:number,tint:number) {
        super(game);
        // Pick graphic to use
        var gfxName:string = "rr"+this.selectGraphicFrame(width/height).toString();
        // Frame
        var frame:Phaser.Image = this.game.add.image(0,0,"sprites",gfxName,this);
        frame.width = width;frame.height = height;
        frame.anchor.x = frame.anchor.y = 0.5;frame.tint = tint;
        // Background
        var text:Phaser.BitmapText = this.game.add.bitmapText(0,0,"font",sText,height*65/100,this);
        text.anchor.x = 0.5;text.anchor.y = 0.4;text.tint = 0xFFFFFF;
        // It doesn't change now.
        this.cacheAsBitmap = true;
    }

    /**
     * Pick graphic (rr1..rr8) to use for this aspect ratio button
     * 
     * @private
     * @param {number} aspect aspect ration of required button
     * @returns {number} number of rr graphic to use.
     * @memberof StrumMarker
     */
    private selectGraphicFrame(aspect:number):number {
        var bestGraphic:number = 1;
        var bestDifference:number = 99999;
        for (var g:number = 1;g <= StrumMarker.BOXRATIO.length;g++) {
            var diff:number = Math.abs(aspect-StrumMarker.BOXRATIO[g]);
            if (diff < bestDifference) {
                bestGraphic = g;
                bestDifference = diff;
            }
        }
        return bestGraphic;
    }

    // Aspect ratio of rr1 .. rr8 taken from sprites.json (there is no rr0)
    private static BOXRATIO:number[] = 
                [ 0,102/50,124/50,152/50,183/50,199/50,75/50,50/50,250/50 ];
}