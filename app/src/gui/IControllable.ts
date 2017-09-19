/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Interface for controllable global playback object
 * 
 * @interface IControllable
 */
interface IControllable {
    /**
     * Do a given command identified by shortcut.
     * 
     * @param {string} shortCut 
     * @memberof IControllable
     */
    doCommand(shortCut:string):void;
}
