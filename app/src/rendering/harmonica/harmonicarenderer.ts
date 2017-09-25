/// <reference path="../../../lib/phaser.comments.d.ts"/>

/**
 * Harmonica Renderer
 * 
 * @class HarmonicaRenderer
 * @extends {BounceBaseRenderer}
 */
class HarmonicaRenderer extends BaseRenderer {

    private barMarker:Phaser.Image;
    private visList:Phaser.Image[];

    moveAllObjects(x: number, y: number): void {
        var mgr:HarmonicaRenderManager = <HarmonicaRenderManager>(this.manager);
        var beats: number = this.bar.getBeats();
        var vidx:number = 0;
        for (var n: number = this.bar.getStrumCount()-1; n >= 0; n--) {
            var strum: IStrum = this.bar.getStrum(n);
            for (var str: number = 0; str < this.instrument.getStringCount(); str++) {
                var fret: number = strum.getFretPosition(str);
                if (fret != Strum.NOSTRUM) {
                    var note:string = this.instrument.toDisplayFret(fret);
                    var hole:number = Math.abs(parseInt(note.replace("b",""),10));
                    var yc:number = y + mgr.getBoxHeight();
                    yc = yc - strum.getStartTime()/(beats*4) * mgr.getBoxHeight();
                    this.visList[vidx].x = mgr.getXHole(hole);
                    this.visList[vidx].y = yc;
                    var width:number = (mgr.getXHole(hole+1)-mgr.getXHole(hole));
                    var height:number = mgr.getBoxHeight()*strum.getLength()/(beats*4);
                    this.visList[vidx].width = width * 0.9;
                    this.visList[vidx].height = height*0.9;
                    vidx++;
                }
            }
        }
        this.barMarker.x = this.game.width / 2;
        this.barMarker.y = y+ mgr.getBoxHeight();
    }

    drawAllObjects() {
  
        this.visList = [];
        
        // Create the start of bar marker on the bottom.
        this.barMarker = this.game.add.image(0,0,"sprites","bar",this);
        this.barMarker.rotation = Math.PI/2;
        this.barMarker.height = this.rWidth;
        this.barMarker.width = Math.max(1,this.rHeight/32);
        this.barMarker.anchor.x = this.barMarker.anchor.y = 0.5;

        var beats: number = this.bar.getBeats();
        for (var n: number = this.bar.getStrumCount()-1; n >= 0; n--) {
            var strum: IStrum = this.bar.getStrum(n);
            for (var str: number = 0; str < this.instrument.getStringCount(); str++) {
                var fret: number = strum.getFretPosition(str);
                if (fret != Strum.NOSTRUM) {
                    //var colour:string = this.getBallColour(this.instrument.toDisplayFret(fret));                  
                    var disp:string = this.instrument.toDisplayFret(fret);
                    var img:Phaser.Image = this.game.add.image(100,100,
                                                               "sprites",
                                                               disp[0] == "-" ? "drawfrectangle":"blowfrectangle");
                    img.tint = this.getObjColour(disp);
                    img.anchor.x = 0.5;img.anchor.y = 1;
                    this.visList.push(img);                                                               
                }
            }
        }
    }

    eraseAllObjects(): void {
        for (var vis of this.visList) { vis.destroy(); }
        this.barMarker.destroy();
        this.barMarker = this.visList = null;
    }

    private getObjColour(name:string):number {
        name = name.toUpperCase();
        var bend:number = name.length - (name.replace("b","").length);
        return name[0] == "-" ? HarmonicaRenderer.DRAW_COLOURS[bend]:HarmonicaRenderer.BLOW_COLOURS[bend];
    }

    private static DRAW_COLOURS:number[] =  [
        0xFFFF00,   // Yellow
        0xFF8000,   // Orange
        0xFF0000,   // Red
        0xFF00FF    // Purple
    ]
    private static BLOW_COLOURS:number[] =  [
        0x00CC00,   // Green
        0x006633,   // Turquouise Green
        0x004C99,   // Blue ish
        0x0000CC   // Blue

    ];
}

