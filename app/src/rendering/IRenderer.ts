/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Rendering object interface.
 * 
 * @interface IRenderer
 */
interface IRenderer {
    /**
     * Move the render to the given position (coordinates are top left of render area)
     * 
     * @param {number} x 
     * @param {number} y 
     * @memberof IRenderer
     */
    moveTo(x:number,y:number): void;        

    /**
     * Destroy the renderer.
     * 
     * @memberof IRenderer
     */
    destroy() : void;
}