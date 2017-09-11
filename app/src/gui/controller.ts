/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Controller class. 
 * 
 * @class Controller
 * @extends {Phaser.Group}
 * @implements {IController}
 */
class Controller extends Phaser.Group implements IController {

    private controllable:IControllable;
    private keys:Phaser.Key[];
    private buttonInfo:string[][];

    constructor(game:Phaser.Game,controllable:IControllable,
                        buttonInfo:string[][],alignmentHorizontal:boolean = true) {
        super(game);
        var xOffset:number = 0;
        var yOffset:number = 0;
        this.controllable = controllable;
        this.buttonInfo = buttonInfo;
        this.keys = [];
        for (var n:number = 0;n < this.buttonInfo.length;n++) {
            var button:IGuiObject = new PushButton(game,
                                                   this.buttonInfo[n][1],
                                                   this,this.buttonClicked, 
                                                   this.buttonInfo[n][0]);
            button.x = button.width * 0.6+xOffset;
            button.y = button.height * 0.6 + yOffset;
            if (alignmentHorizontal) {
                xOffset += button.width * 1.1;
            } else {
                yOffset += button.height * 1.1;
            }                
            //this.keys[n] = game.input.keyboard.addKey(this.buttonInfo[n][0].charCodeAt(0));                                   
        }   
    }

    checkUpdateController(): void {
        if (this.keys != null && this.keys.length > 0) {
            for (var n:number = 0;n < this.keys.length;n++) {
                if (this.keys[n].justDown) {
                   this.controllable.doCommand(this.buttonInfo[n][0]);
                }
            }
        }

    }

    destroy() : void {
        super.destroy();
        this.controllable = null;
        this.keys = null;
        this.buttonInfo = null;
    }

    private buttonClicked(clicker:IGuiObject,shortCut:string) : void {
        this.controllable.doCommand(shortCut);    
    }


}