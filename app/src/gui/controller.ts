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

    constructor(game:Phaser.Game,controllable:IControllable,alignmentHorizontal:boolean = true) {
        super(game);
        var xOffset:number = 0;
        var yOffset:number = 0;
        this.controllable = controllable;
        this.keys = [];
        for (var n:number = 0;n < Controller.BUTTON_LIST.length;n++) {
            var button:IGuiObject = new PushButton(game,
                                                   Controller.BUTTON_LIST[n][1],
                                                   this,this.buttonClicked, 
                                                   Controller.BUTTON_LIST[n][0]);
            button.x = button.width * 0.6+xOffset;
            button.y = button.height * 0.6 + yOffset;
            if (alignmentHorizontal) {
                xOffset += button.width * 1.1;
            } else {
                yOffset += button.height * 1.1;
            }                
            this.keys[n] = game.input.keyboard.addKey(Controller.BUTTON_LIST[n][0].charCodeAt(0));                                   
        }   
    }

    checkUpdateController(): void {
        if (this.keys != null && this.keys.length > 0) {
            for (var n:number = 0;n < this.keys.length;n++) {
                if (this.keys[n].justDown) {
                   this.controllable.doCommand(Controller.BUTTON_LIST[n][0]);
                }
            }
        }

    }

    destroy() : void {
        super.destroy();
        this.controllable = null;
        this.keys = null;
    }

    private buttonClicked(clicker:IGuiObject,shortCut:string) : void {
        this.controllable.doCommand(shortCut);    
    }

    private static BUTTON_LIST:string[][] = [
        ["P","i_play"],
        ["H","i_stop"],
        ["R","i_restart"],
        ["S","i_slower"],
        ["N","i_normal"],
        ["F","i_faster"],
        ["M","i_music_on"],
        ["Q","i_music_off"],
        ["T","i_metronome_on"],
        ["X","i_metronome_off"]
    ];
}