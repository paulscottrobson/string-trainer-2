/// <reference path="../../../lib/phaser.comments.d.ts"/>

/**
 * Harmonica visual object
 * 
 * @class Harmonica
 * @extends {Phaser.Group}
 */
class HarmonicaGraphic extends Phaser.Group  {
    
        private holeWidth:number;
        private holeHeight:number;
        private holeCount:number;
    
        /**
         * Creates an instance of visual Harmonica.
         * 
         * @param {Phaser.Game} game Phaser object
         * @param {number} count Number of holes
         * @param {number} hWidth Hole width
         * @param {number} hHeight Hole height
         * @memberof Harmonica
         */

        constructor(game:Phaser.Game,count:number,hWidth:number,hHeight:number) {
            super(game);
            this.holeWidth = hWidth;this.holeCount = count;this.holeHeight = hHeight;
            // Create the hole graphics
            for (var n:number = 0;n <= count;n++) {
                if (n < count) {
                    var img:Phaser.Image = this.game.add.image((n-count/2)*hWidth,-hHeight/2,
                                                               "sprites","hole",this);
                    img.width = hWidth;img.height = hHeight;  
                    var txt:Phaser.BitmapText = this.game.add.bitmapText(img.x+hWidth/2,-hHeight*2/3,
                                                                         "font",(n+1).toString(),
                                                                         hWidth*2/3,this);
                    txt.anchor.x = 0.5;txt.anchor.y = 1;txt.tint = 0xFF8000;                                                          
                }
            }
            // Draw the frame
            var colour:number = 0xCCCCCC;
            for (var s:number = -1;s <= 1;s += 2) {
                var img:Phaser.Image;
                img = this.game.add.image(0,s*hHeight/2,"sprites","rectangle",this);
                img.width = count * hWidth+4;img.height = hHeight / 4;
                img.anchor.x = 0.5;img.anchor.y = 1-(s+1)/2;img.tint = colour;
                img = this.game.add.image(s*count/2*hWidth,0,"sprites","rectangle",this);
                img.anchor.x = 1-(s+1)/2;img.anchor.y = 0.5;
                img.height = hHeight * 3/2;img.width = hWidth / 4;img.tint = colour;
                img = this.game.add.image(s*count/2*hWidth,0,"sprites","rectangle",this);
                img.anchor.x = 1-(s+1)/2;img.anchor.y = 0.5;
                img.height = hHeight*2/3;img.width = hWidth;img.tint = colour;
            }
            // We don't ever change the components of this graphic.
            this.cacheAsBitmap = true;
        }
    
        getXHole(hole:number):number {
            return this.x - this.holeCount * this.holeWidth / 2 +
                    this.holeWidth * (hole -1) + this.holeWidth/2;
        }
    
        getYHole():number {
            return this.y - this.holeHeight/2;
        }
    
        getHoleWidth():number {
            return Math.floor(this.holeWidth * 80 / 100);
        }
    
        destroy() {
            super.destroy();
        }
    }