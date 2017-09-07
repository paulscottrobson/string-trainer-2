/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Sound set descriptor for harmonica
 * 
 * @class SoundSet_String
 * @implements {ISoundSet}
 */
class SoundSet_Harmonica implements ISoundSet {
    
    getBassNote(): string {
        return "C4";
    }
    getNoteCount(): number {
        return 37;
    }
    getStem(): string {
        return "harmonica";
    }

}