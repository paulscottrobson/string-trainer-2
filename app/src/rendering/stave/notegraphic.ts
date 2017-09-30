/// <reference path="../../../lib/phaser.comments.d.ts"/>

class NoteGraphic extends Phaser.Group {

    private lowest:number;
    private highest:number;

    constructor(game:Phaser.Game) {
        super(game);
        //var img:Phaser.Image = this.game.add.image(0,0,"sprites","marker",this);
        //img.anchor.x = img.anchor.y = 0.5;
        this.lowest = 0;
        this.highest = 0;
    }

    addNote(note:number,qbLength:number,str:number,spacing:number,centre:number): void {
        var offset:number = this.toWhiteNoteOffset(note)-this.toWhiteNoteOffset(centre);
        //console.log(offset,note,centre);
        var img:Phaser.Image = this.game.add.image(0,0,"sprites",qbLength >= 2*4 ? "minim":"crotchet",this);
        img.anchor.x = img.anchor.y = 0.5;img.width = spacing*1.2;img.height = spacing*0.9;
        img.y = -offset * spacing / 2;
        this.lowest = Math.min(this.lowest,offset);
        this.highest = Math.max(this.highest,offset);
        if (Music.isNoteIDSharp(note)) {
            img = this.game.add.image(img.x+spacing*1.1,img.y,"sprites","sharp",this);
            img.anchor.x = 0.5;img.anchor.y = 0.5;img.width = spacing * 0.7;img.height = spacing;
        }
    }

    addSpacers(spacing:number): void {
        for (var p = this.lowest ; p <= this.highest;p++) {
            if (p % 2 == 0) {
                var l = p / 2;
                if (Math.abs(l) > 2) {
                    var img:Phaser.Image = this.game.add.image(0,-l*spacing,"sprites","rectangle",this);
                    img.width = spacing * 2;img.height = Math.max(1,spacing/4);
                    img.anchor.x = img.anchor.y = 0.5;img.tint = 0x000000;
                }
            }
        }
    }

    addRest(qbLength:number,spacing:number) : void {
        var img:Phaser.Image = this.game.add.image(0,0,"sprites",qbLength >= 4 ? "rest1":"rest2",this);
        img.anchor.x = img.anchor.y = 0.5;
        img.width = spacing * 3/2;img.height = spacing * 3;
    }

    private static BASENOTES:number[] = [
        0,0,1,1,2,3,3,4,4,5,5,6
    ];

    private toWhiteNoteOffset(note:number):number {
        return Math.floor(note / 12) * 7 + NoteGraphic.BASENOTES[note % 12];
    }
}
