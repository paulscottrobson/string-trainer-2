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
    /**
     * Get the horizontal position of the ball in this bar.
     * 
     * @param {number} fractionalBar Fractional position in the bar.
     * @returns {number} offset in bar, null if no ball
     * @memberof IRenderer
     */
    getXBall(fractionalBar:number):number;
    /**
     * Get the vertical position of the ball in this bar.
     * 
     * @param {number} fractionalBar Fractional position in the bar.
     * @returns {number} offset in bar, null if no ball
     * @memberof IRenderer
     */
    getYBall(fractionalBar:number):number;
}