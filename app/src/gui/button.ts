/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Push button Class
 * 
 * @class PushButton
 * @extends {Phaser.Group}
 */
class PushButton extends Phaser.Group implements IGuiObject {

    private callback: Function;
    private context: Function;
    private signal:Phaser.Signal;
    private btnImage:Phaser.Image;
    private button:Phaser.Image;
    private shortCut:string;

    constructor(game:Phaser.Game,image:string,
                    context:any,callback:Function,shortCut:string,
                    width:number = 0,height:number = 0) {
        super(game);
        this.signal = new Phaser.Signal();
        this.button = game.add.image(0,0,"sprites","icon_frame",this);
        this.button.anchor.x = this.button.anchor.y = 0.5;
        this.button.width = (width == 0) ? game.width / 16 : width;
        this.button.height = (height == 0) ? this.button.width : height;
        this.btnImage = game.add.image(0,0,"sprites","icon_frame",this);
        this.setImage(image);
        this.button.inputEnabled = true;
        this.button.events.onInputDown.add(this.clicked,this);
        this.shortCut = shortCut;this.context = context;this.callback = callback;
    }

    destroy(): void {
        this.button.destroy();
        this.btnImage.destroy();
        this.signal.dispose();
        this.signal = this.button = this.btnImage = this.context = this.callback = null;
        super.destroy();
    }

    protected setImage(imageName:string): void {
        this.btnImage.loadTexture("sprites",imageName);
        this.btnImage.anchor.x = this.btnImage.anchor.y = 0.5;
        this.btnImage.width = this.button.width * 0.75;
        this.btnImage.height = this.button.height * 0.75;
    }

    protected clicked(): void {
        //console.log("aclicked",this.shortCut,this);
        this.callback.call(this.context,this,this.shortCut);
    }

    
}
