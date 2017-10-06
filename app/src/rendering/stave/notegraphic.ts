/// <reference path="../../../lib/phaser.comments.d.ts"/>

class NoteGraphic extends Phaser.Group {

    private lowest:number;
    private highest:number;
    private qbLength:number;
    private spacing:number;

    constructor(game:Phaser.Game,length:number,spacing:number) {
        super(game);
        //var img:Phaser.Image = this.game.add.image(0,0,"sprites","marker",this);
        //img.anchor.x = img.anchor.y = 0.5;
        this.lowest = 0;
        this.highest = 0;
        this.qbLength = length;
        this.spacing = spacing;
    }

    addNote(note:number,str:number,centre:number): void {
        var offset:number = this.toWhiteNoteOffset(note)-this.toWhiteNoteOffset(centre);
        //console.log(offset,note,centre);
        var img:Phaser.Image = this.game.add.image(0,0,"sprites",this.qbLength >= 2*4 ? "minim":"crotchet",this);
        img.anchor.x = img.anchor.y = 0.5;img.width = this.spacing*1.2;img.height = this.spacing*0.9;
        img.y = -offset * this.spacing / 2;
        this.lowest = Math.min(this.lowest,offset);
        this.highest = Math.max(this.highest,offset);
        if (Music.isNoteIDSharp(note)) {
            img = this.game.add.image(img.x-this.spacing*1.1,img.y,"sprites","sharp",this);
            img.anchor.x = 0.5;img.anchor.y = 0.5;img.width = this.spacing * 0.7;img.height = this.spacing;
        }
    }

    addSpacers(): void {
        for (var p = this.lowest ; p <= this.highest;p++) {
            if (p % 2 == 0) {
                var l = p / 2;
                if (Math.abs(l) > 2) {
                    var img:Phaser.Image = this.game.add.image(0,-l*this.spacing,"sprites","rectangle",this);
                    img.width = this.spacing * 2;img.height = Math.max(1,this.spacing/4);
                    img.anchor.x = img.anchor.y = 0.5;img.tint = 0x000000;
                }
            }
        }
    }

    addRest() : void {
        var img:Phaser.Image = this.game.add.image(0,0,"sprites",this.qbLength >= 4 ? "rest1":"rest2",this);
        img.anchor.x = img.anchor.y = 0.5;
        img.width = this.spacing * 3/2;img.height = this.spacing * 3;
    }

    private static BASENOTES:number[] = [
        0,0,1,1,2,3,3,4,4,5,5,6
    ];

    private toWhiteNoteOffset(note:number):number {
        return Math.floor(note / 12) * 7 + NoteGraphic.BASENOTES[note % 12];
    }
}
