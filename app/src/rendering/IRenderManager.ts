/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Interface for an object which manages and positions a collection of 
 * Renderers.
 * 
 * @interface IRenderManager
 */
interface IRenderManager {
    /**
     * Update the position of the renderers to the given position. (Note this
     * position is fractional not a quarterBeat position)
     * 
     * @param {number} fracPos position to render at.
     * @memberof IRenderManager
     */

    updatePosition(fracPos:number) : void;
    /**
     * Destroy the render manager and associated renderers.
     * 
     * @memberof IRenderManager
     */
    destroy() : void;
}