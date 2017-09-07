/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Sound set descriptor for string
 * 
 * @class SoundSet_String
 * @implements {ISoundSet}
 */
class SoundSet_String implements ISoundSet {
    
    getBassNote(): string {
        return "C3";
    }
    getNoteCount(): number {
        return 48;
    }
    getStem(): string {
        return "string";
    }

}