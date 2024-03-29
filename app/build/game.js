var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MainState = (function (_super) {
    __extends(MainState, _super);
    function MainState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.barFractionalPosition = 0;
        _this.isPaused = false;
        _this.tempo = 120;
        return _this;
    }
    MainState.prototype.create = function () {
        var bgr = this.game.add.image(0, 0, "sprites", "background");
        bgr.width = this.game.width;
        bgr.height = this.game.height;
        var lbl = this.game.add.bitmapText(this.game.width / 2, this.game.height, "font", "by Paul Robson v" + MainState.VERSION, 18);
        lbl.anchor.x = 0.5;
        lbl.anchor.y = 1;
        lbl.tint = 0xFFFF00;
        var json = this.game.cache.getJSON("music");
        this.music = new Music(json);
        this.renderManager = this.music.getInstrument().getRendererFactory().getRenderManager(this.game, this.music.getInstrument(), this.music);
        this.barFractionalPosition = 0;
        this.lastFractionalPosition = -1;
        this.tempo = this.music.getTempo();
        this.audioMetronome = new AudioMetronome(this.game, this.music);
        this.guiMetronome = new VisualMetronome(this.game, this.music);
        this.musicPlayer = new MusicPlayer(this.game, this.music);
        this.positionBar = new PositionBar(this.game, this.music, 50, this.game.width - 50, this.game.height - 50);
        this.controller = new Controller(this.game, this, MainState.BUTTON_LIST);
    };
    MainState.prototype.destroy = function () {
        this.renderManager.destroy();
        this.audioMetronome.destroy();
        this.guiMetronome.destroy();
        this.musicPlayer.destroy();
        this.controller.destroy();
        this.music = this.renderManager = this.audioMetronome = null;
        this.guiMetronome = this.musicPlayer = this.controller = null;
    };
    MainState.prototype.update = function () {
        if (this.renderManager != null) {
            this.controller.checkUpdateController();
            this.barFractionalPosition =
                this.positionBar.updatePosition(this.barFractionalPosition);
            if (!this.isPaused) {
                var time = this.game.time.elapsedMS;
                time = time / 1000 / 60;
                var beatsElapsed = this.tempo * time;
                var barsElapsed = beatsElapsed / this.music.getBeats();
                this.barFractionalPosition += barsElapsed;
                this.barFractionalPosition = Math.min(this.barFractionalPosition, this.music.getBarCount());
            }
            if (this.barFractionalPosition != this.lastFractionalPosition) {
                this.renderManager.updatePosition(this.barFractionalPosition);
                this.audioMetronome.updateTime(this.barFractionalPosition);
                this.guiMetronome.updateTime(this.barFractionalPosition);
                this.musicPlayer.updateTime(this.barFractionalPosition);
                this.game.world.bringToTop(this.controller);
                this.game.world.bringToTop(this.positionBar);
                this.lastFractionalPosition = this.barFractionalPosition;
            }
        }
    };
    MainState.prototype.doCommand = function (shortCut) {
        switch (shortCut) {
            case "P":
                this.isPaused = false;
                break;
            case "H":
                this.isPaused = true;
                break;
            case "R":
                this.barFractionalPosition = 0;
                break;
            case "S":
                this.tempo *= 0.9;
                break;
            case "N":
                this.tempo = this.music.getTempo();
                break;
            case "F":
                this.tempo /= 0.9;
                break;
            case "M":
                this.musicPlayer.setVolume(true);
                break;
            case "Q":
                this.musicPlayer.setVolume(false);
                break;
            case "T":
                this.audioMetronome.setVolume(true);
                break;
            case "X":
                this.audioMetronome.setVolume(false);
                break;
        }
    };
    MainState.VERSION = "0.93:28/Sep/17 Phaser-CE 2.8.7";
    MainState.BUTTON_LIST = [
        ["P", "i_play"],
        ["H", "i_stop"],
        ["R", "i_restart"],
        ["S", "i_slower"],
        ["N", "i_normal"],
        ["F", "i_faster"],
        ["M", "i_music_on"],
        ["Q", "i_music_off"],
        ["T", "i_metronome_on"],
        ["X", "i_metronome_off"]
    ];
    return MainState;
}(Phaser.State));
var BaseClockEntity = (function () {
    function BaseClockEntity(beats) {
        this.beats = beats;
        this.lastBar = this.lastQBeat = -1;
    }
    BaseClockEntity.prototype.updateTime = function (fracPos) {
        var bar = Math.floor(fracPos);
        var qBeat = Math.floor((fracPos - bar) * this.beats * 4);
        if (bar != this.lastBar || qBeat != this.lastQBeat) {
            this.updateOnQuarterBeatChange(bar, qBeat);
            this.lastBar = bar;
            this.lastQBeat = qBeat;
        }
        this.updateOnFractionalChange(bar, fracPos - bar);
    };
    BaseClockEntity.prototype.updateOnQuarterBeatChange = function (bar, quarterBeat) {
    };
    BaseClockEntity.prototype.updateOnFractionalChange = function (bar, fracPosInBar) {
    };
    return BaseClockEntity;
}());
var AudioMetronome = (function (_super) {
    __extends(AudioMetronome, _super);
    function AudioMetronome(game, music) {
        var _this = _super.call(this, music.getBeats()) || this;
        _this.tick = game.add.audio("metronome");
        _this.metronomeOn = true;
        return _this;
    }
    AudioMetronome.prototype.destroy = function () {
        this.tick = null;
    };
    AudioMetronome.prototype.setVolume = function (isOn) {
        this.metronomeOn = isOn;
    };
    AudioMetronome.prototype.updateOnQuarterBeatChange = function (bar, quarterBeat) {
        if (quarterBeat % 4 == 0 && this.metronomeOn) {
            this.tick.play("", 0, (quarterBeat == 0) ? 1.0 : 0.5, false, true);
        }
    };
    return AudioMetronome;
}(BaseClockEntity));
var VisualMetronome = (function (_super) {
    __extends(VisualMetronome, _super);
    function VisualMetronome(game, music) {
        var _this = _super.call(this, music.getBeats()) || this;
        _this.metronome = game.add.image(100, game.height, "sprites", "metronome");
        _this.metronome.anchor.x = 0.5;
        _this.metronome.anchor.y = 0.9;
        var scale = game.height / 4 / _this.metronome.height;
        _this.metronome.scale.x = _this.metronome.scale.y = scale;
        _this.metronome.x = game.width - 100;
        _this.metronome.y = _this.metronome.height;
        return _this;
    }
    VisualMetronome.prototype.updateOnFractionalChange = function (bar, fracPosInBar) {
        var overallBeat = bar * this.beats + Math.floor(fracPosInBar * this.beats);
        var fracOffset = fracPosInBar * this.beats;
        fracOffset = fracOffset - Math.floor(fracOffset) - 0.5;
        if (overallBeat % 2 == 0)
            fracOffset = -fracOffset;
        this.metronome.rotation = Math.sin(fracOffset);
    };
    VisualMetronome.prototype.destroy = function () {
        this.metronome.destroy();
        this.metronome = null;
    };
    return VisualMetronome;
}(BaseClockEntity));
var MusicPlayer = (function (_super) {
    __extends(MusicPlayer, _super);
    function MusicPlayer(game, music) {
        var _this = _super.call(this, music.getBeats()) || this;
        _this.game = game;
        _this.music = music;
        _this.loadNoteSet(game);
        var tuning = _this.music.getTuning();
        _this.tuning = _this.music.getTuningByID();
        _this.stringSoundIndex = [];
        _this.musicOn = true;
        for (var n = 0; n < tuning.length; n++) {
            _this.stringSoundIndex[n] = Strum.NOSTRUM;
        }
        return _this;
    }
    MusicPlayer.prototype.destroy = function () {
        for (var _i = 0, _a = this.notes; _i < _a.length; _i++) {
            var note = _a[_i];
            note.destroy();
        }
        this.notes = null;
        this.music = null;
        this.tuning = null;
        this.game = null;
    };
    MusicPlayer.prototype.setVolume = function (isOn) {
        this.musicOn = isOn;
    };
    MusicPlayer.prototype.updateOnQuarterBeatChange = function (bar, quarterBeat) {
        if (bar < 0 || bar >= this.music.getBarCount() || !this.musicOn) {
            this.stopAllNotes();
            return;
        }
        var barInfo = this.music.getBar(bar);
        for (var n = 0; n < barInfo.getStrumCount(); n++) {
            var strum = barInfo.getStrum(n);
            if (strum.getEndTime() == quarterBeat) {
                if (this.music.getInstrument().isContinuous()) {
                    this.stopAllNotes();
                }
            }
            if (strum.getStartTime() == quarterBeat) {
                for (var ns = 0; ns < strum.getStringCount(); ns++) {
                    var offset = strum.getFretPosition(ns);
                    if (offset != Strum.NOSTRUM) {
                        this.startNote(offset, ns);
                    }
                }
            }
        }
    };
    MusicPlayer.prototype.startNote = function (noteOffset, stringID) {
        if (this.stringSoundIndex[stringID] != Strum.NOSTRUM) {
            this.notes[this.stringSoundIndex[stringID]].stop();
            this.stringSoundIndex[stringID] = Strum.NOSTRUM;
        }
        this.stringSoundIndex[stringID] = noteOffset + this.tuning[stringID];
        this.notes[this.stringSoundIndex[stringID]].play();
    };
    MusicPlayer.prototype.stopAllNotes = function () {
        for (var n = 0; n < this.stringSoundIndex.length; n++) {
            if (this.stringSoundIndex[n] != Strum.NOSTRUM) {
                this.notes[this.stringSoundIndex[n]].stop();
                this.stringSoundIndex[n] = Strum.NOSTRUM;
            }
        }
    };
    MusicPlayer.prototype.loadNoteSet = function (game) {
        var soundSet = this.music.getInstrument().getSoundSetDescriptor();
        this.notes = [];
        for (var n = 1; n <= soundSet.getNoteCount(); n++) {
            var name = soundSet.getStem() + "-" + (n < 10 ? "0" : "") + n.toString();
            this.notes[n] = game.add.audio(name);
        }
    };
    return MusicPlayer;
}(BaseClockEntity));
;
var PushButton = (function (_super) {
    __extends(PushButton, _super);
    function PushButton(game, image, context, callback, shortCut, width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        var _this = _super.call(this, game) || this;
        _this.signal = new Phaser.Signal();
        _this.button = game.add.image(0, 0, "sprites", "icon_frame", _this);
        _this.button.anchor.x = _this.button.anchor.y = 0.5;
        _this.button.width = (width == 0) ? game.width / 16 : width;
        _this.button.height = (height == 0) ? _this.button.width : height;
        _this.btnImage = game.add.image(0, 0, "sprites", "icon_frame", _this);
        _this.setImage(image);
        _this.button.inputEnabled = true;
        _this.button.events.onInputDown.add(_this.clicked, _this);
        _this.shortCut = shortCut;
        _this.context = context;
        _this.callback = callback;
        return _this;
    }
    PushButton.prototype.destroy = function () {
        this.button.destroy();
        this.btnImage.destroy();
        this.signal.dispose();
        this.signal = this.button = this.btnImage = this.context = this.callback = null;
        _super.prototype.destroy.call(this);
    };
    PushButton.prototype.setImage = function (imageName) {
        this.btnImage.loadTexture("sprites", imageName);
        this.btnImage.anchor.x = this.btnImage.anchor.y = 0.5;
        this.btnImage.width = this.button.width * 0.75;
        this.btnImage.height = this.button.height * 0.75;
    };
    PushButton.prototype.clicked = function () {
        this.callback.call(this.context, this, this.shortCut);
    };
    return PushButton;
}(Phaser.Group));
var Controller = (function (_super) {
    __extends(Controller, _super);
    function Controller(game, controllable, buttonInfo, alignmentHorizontal) {
        if (alignmentHorizontal === void 0) { alignmentHorizontal = true; }
        var _this = _super.call(this, game) || this;
        var xOffset = 0;
        var yOffset = 0;
        _this.controllable = controllable;
        _this.buttonInfo = buttonInfo;
        _this.keys = [];
        for (var n = 0; n < _this.buttonInfo.length; n++) {
            var button = new PushButton(game, _this.buttonInfo[n][1], _this, _this.buttonClicked, _this.buttonInfo[n][0]);
            _this.add(button);
            button.x = button.width * 0.6 + xOffset;
            button.y = button.height * 0.6 + yOffset;
            if (alignmentHorizontal) {
                xOffset += button.width * 1.1;
            }
            else {
                yOffset += button.height * 1.1;
            }
        }
        return _this;
    }
    Controller.prototype.checkUpdateController = function () {
        if (this.keys != null && this.keys.length > 0) {
            for (var n = 0; n < this.keys.length; n++) {
                if (this.keys[n].justDown) {
                    this.controllable.doCommand(this.buttonInfo[n][0]);
                }
            }
        }
    };
    Controller.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.controllable = null;
        this.keys = null;
        this.buttonInfo = null;
    };
    Controller.prototype.buttonClicked = function (clicker, shortCut) {
        this.controllable.doCommand(shortCut);
    };
    return Controller;
}(Phaser.Group));
var DraggableSphere = (function () {
    function DraggableSphere(game, owner, xStart, yStart, colour) {
        this.sphere = game.add.image(xStart, yStart, "sprites", "sphere_" + colour, owner);
        this.sphere.anchor.x = this.sphere.anchor.y = 0.5;
        this.sphere.height = this.sphere.width = 80;
        this.sphere.inputEnabled = true;
        this.sphere.input.enableDrag();
        this.sphere.input.setDragLock(true, false);
        this.sphere.events.onDragStop.add(owner.updatePositionsOnDrop, owner);
    }
    DraggableSphere.prototype.setBounds = function (xStart, xEnd, y) {
        this.sphere.input.boundsRect = new Phaser.Rectangle(xStart, y - 100, xEnd - xStart, y + 100);
    };
    DraggableSphere.prototype.moveTo = function (x, y) {
        this.sphere.x = x;
        this.sphere.y = y;
    };
    DraggableSphere.prototype.destroy = function () {
        this.sphere.destroy();
        this.sphere = null;
    };
    DraggableSphere.prototype.getX = function () {
        return this.sphere.x;
    };
    DraggableSphere.prototype.isDragging = function () {
        return this.sphere.input.isDragged;
    };
    return DraggableSphere;
}());
var PositionBar = (function (_super) {
    __extends(PositionBar, _super);
    function PositionBar(game, music, xLeft, xRight, y) {
        var _this = _super.call(this, game) || this;
        var bar = _this.game.add.image(xLeft, y, "sprites", "rectangle", _this);
        bar.width = xRight - xLeft;
        bar.height = 16;
        bar.tint = 0x0000;
        bar.anchor.y = 0.5;
        _this.xLeft = xLeft;
        _this.xRight = xRight;
        _this.yPos = y;
        _this.music = music;
        _this.spheres = [];
        _this.spheres.push(new DraggableSphere(game, _this, xLeft, y, "red"));
        _this.spheres.push(new DraggableSphere(game, _this, xRight, y, "green"));
        _this.spheres.push(new DraggableSphere(game, _this, (xLeft + xRight) / 2, y, "yellow"));
        for (var _i = 0, _a = _this.spheres; _i < _a.length; _i++) {
            var sphere = _a[_i];
            sphere.setBounds(xLeft, xRight, y);
        }
        return _this;
    }
    PositionBar.prototype.updatePosition = function (barFractionalPosition) {
        if (!this.spheres[2].isDragging()) {
            var frac = barFractionalPosition / this.music.getBarCount();
            frac = Math.min(1, frac);
            this.spheres[2].moveTo(this.xLeft + (this.xRight - this.xLeft) * frac, this.yPos);
        }
        var xPos = this.spheres[2].getX();
        xPos = Math.max(xPos, this.spheres[0].getX());
        if (xPos > this.spheres[1].getX())
            xPos = this.spheres[0].getX();
        barFractionalPosition = this.music.getBarCount() *
            (xPos - this.xLeft) / (this.xRight - this.xLeft);
        return barFractionalPosition;
    };
    PositionBar.prototype.updatePositionsOnDrop = function () {
        if (this.spheres[0].getX() + 50 >= this.spheres[1].getX()) {
            this.spheres[0].moveTo(Math.max(this.spheres[1].getX() - 50, 0), this.yPos);
        }
    };
    PositionBar.prototype.destroy = function () {
        for (var _i = 0, _a = this.spheres; _i < _a.length; _i++) {
            var ds = _a[_i];
            ds.destroy();
        }
        _super.prototype.destroy.call(this);
    };
    return PositionBar;
}(Phaser.Group));
var Instrument = (function () {
    function Instrument() {
    }
    Instrument.prototype.getRendererFactory = function () {
        return this.getInstrumentRendererFactory();
    };
    Instrument.prototype.isContinuous = function () {
        return false;
    };
    Instrument.prototype.isLowestPitchAtBottom = function () {
        return true;
    };
    Instrument.prototype.isDoubleString = function (str) {
        return false;
    };
    Instrument.prototype.toDisplayFret = function (fret) {
        return fret.toString();
    };
    return Instrument;
}());
var StringInstrument = (function (_super) {
    __extends(StringInstrument, _super);
    function StringInstrument() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StringInstrument.prototype.getInstrumentRendererFactory = function () {
        return new StringRendererFactory();
    };
    StringInstrument.prototype.getSoundSetDescriptor = function () {
        return new SoundSet_String();
    };
    return StringInstrument;
}(Instrument));
var DiatonicStringInstrument = (function (_super) {
    __extends(DiatonicStringInstrument, _super);
    function DiatonicStringInstrument() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DiatonicStringInstrument.prototype.toDisplayFret = function (fret) {
        var n = DiatonicStringInstrument.TODIATONIC[fret % 12];
        n = n + Math.floor(fret / 12) * 7;
        var display = Math.floor(n).toString();
        if (n != Math.floor(n)) {
            display = display + "+";
        }
        return display;
    };
    DiatonicStringInstrument.TODIATONIC = [
        0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 6, 6.5
    ];
    return DiatonicStringInstrument;
}(StringInstrument));
var MountainDulcimer = (function (_super) {
    __extends(MountainDulcimer, _super);
    function MountainDulcimer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MountainDulcimer.prototype.getDefaultTuning = function () {
        return "d3,a3,d4";
    };
    MountainDulcimer.prototype.getStringCount = function () {
        return 3;
    };
    MountainDulcimer.prototype.isLowestPitchAtBottom = function () {
        return false;
    };
    MountainDulcimer.prototype.isDoubleString = function (str) {
        return (str == 2);
    };
    return MountainDulcimer;
}(DiatonicStringInstrument));
var Harmonica = (function (_super) {
    __extends(Harmonica, _super);
    function Harmonica() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Harmonica.prototype.getDefaultTuning = function () {
        return "c4";
    };
    Harmonica.prototype.getStringCount = function () {
        return 3;
    };
    Harmonica.prototype.getSoundSetDescriptor = function () {
        return new SoundSet_Harmonica();
    };
    Harmonica.prototype.isContinuous = function () {
        return true;
    };
    Harmonica.prototype.getInstrumentRendererFactory = function () {
        return new HarmonicaRendererFactory();
    };
    Harmonica.prototype.toDisplayFret = function (fret) {
        if (Harmonica.toDisplayConverted == null) {
            var s = "";
            for (var _i = 0, _a = Harmonica.TODISPLAY; _i < _a.length; _i++) {
                var s1 = _a[_i];
                s = s + " " + s1;
            }
            s = s.replace("\t", " ");
            Harmonica.toDisplayConverted = s.split(" ").filter(function (s) { return (s != ""); });
        }
        return Harmonica.toDisplayConverted[fret];
    };
    Harmonica.toDisplayConverted = null;
    Harmonica.TODISPLAY = [
        "   1   -1b -1  X   2   -2bb  -2b   3   -3bbb  -3bb  -3b    -3",
        "   4   -4b -4  X   5   -5    X     6   -6b    -6    X      -7",
        "   7   X   -8  8b  8   -9    9b   9   X       -10   10bb   10b",
        "   10"
    ];
    return Harmonica;
}(Instrument));
var Mandolin = (function (_super) {
    __extends(Mandolin, _super);
    function Mandolin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mandolin.prototype.getDefaultTuning = function () {
        return "g3,d4,a4,e5";
    };
    Mandolin.prototype.getStringCount = function () {
        return 4;
    };
    Mandolin.prototype.isDoubleString = function (str) {
        return true;
    };
    return Mandolin;
}(StringInstrument));
var Ukulele = (function (_super) {
    __extends(Ukulele, _super);
    function Ukulele() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ukulele.prototype.getDefaultTuning = function () {
        return "g3,d4,a4,e4";
    };
    Ukulele.prototype.getStringCount = function () {
        return 4;
    };
    return Ukulele;
}(StringInstrument));
var MusicInfoItem;
(function (MusicInfoItem) {
    MusicInfoItem[MusicInfoItem["Title"] = 0] = "Title";
    MusicInfoItem[MusicInfoItem["Composer"] = 1] = "Composer";
    MusicInfoItem[MusicInfoItem["Translator"] = 2] = "Translator";
    MusicInfoItem[MusicInfoItem["Instrument"] = 3] = "Instrument";
    MusicInfoItem[MusicInfoItem["Tuning"] = 4] = "Tuning";
})(MusicInfoItem || (MusicInfoItem = {}));
var Bar = (function () {
    function Bar(def, beats, instrument, barNumber) {
        this.barNumber = barNumber;
        this.beats = beats;
        this.strums = [];
        this.strumCount = 0;
        var qbTime = 0;
        var currentLabel = "";
        if (def != "") {
            for (var _i = 0, _a = def.split(";"); _i < _a.length; _i++) {
                var strumDef = _a[_i];
                if (strumDef[0] == '[') {
                    currentLabel = strumDef.substr(1, strumDef.length - 2);
                }
                else {
                    var strum = new Strum(strumDef, instrument, qbTime, currentLabel);
                    this.strums.push(strum);
                    this.strumCount++;
                    qbTime = qbTime + strum.getLength();
                }
            }
        }
    }
    Bar.prototype.getBarNumber = function () {
        return this.barNumber;
    };
    Bar.prototype.getStrumCount = function () {
        return this.strumCount;
    };
    Bar.prototype.getStrum = function (strum) {
        return this.strums[strum];
    };
    Bar.prototype.getBeats = function () {
        return this.beats;
    };
    return Bar;
}());
var Music = (function () {
    function Music(musicJSON) {
        this.json = musicJSON;
        this.barCount = 0;
        this.bars = [];
        this.beats = parseInt(this.json["beats"], 10);
        this.tempo = parseInt(this.json["speed"], 10);
        this.capo = parseInt(this.json["capo"], 10);
        this.instrument = this.getInstrumentObject(this.json["instrument"]);
        this.bars.push(new Bar("", this.beats, this.instrument, this.barCount));
        this.barCount++;
        for (var _i = 0, _a = this.json["bars"]; _i < _a.length; _i++) {
            var barDef = _a[_i];
            this.bars.push(new Bar(barDef, this.beats, this.instrument, this.barCount));
            this.barCount++;
        }
    }
    Music.prototype.destroy = function () {
        this.json = null;
    };
    Music.prototype.getInfo = function (info) {
        var rInfo = "";
        switch (info) {
            case MusicInfoItem.Composer:
                rInfo = this.json["composer"];
                break;
            case MusicInfoItem.Instrument:
                rInfo = this.json["instrument"];
                break;
            case MusicInfoItem.Title:
                rInfo = this.json["title"];
                break;
            case MusicInfoItem.Translator:
                rInfo = this.json["translator"];
                break;
            case MusicInfoItem.Tuning:
                rInfo = this.json["tuning"];
                break;
            default:
                throw new Error("Not implemented.");
        }
        return rInfo;
    };
    Music.prototype.getBarCount = function () {
        return this.barCount;
    };
    Music.prototype.getBar = function (bar) {
        return this.bars[bar];
    };
    Music.prototype.getBeats = function () {
        return this.beats;
    };
    Music.prototype.getTempo = function () {
        return this.tempo;
    };
    Music.prototype.getCapoPosition = function () {
        return this.capo;
    };
    Music.prototype.getInstrument = function () {
        return this.instrument;
    };
    Music.prototype.getTuning = function () {
        var tuning = this.json["tuning"];
        if (tuning == "") {
            tuning = this.instrument.getDefaultTuning();
        }
        var tuningSet = tuning.toLowerCase().split(",");
        while (tuningSet.length < this.instrument.getStringCount()) {
            tuningSet.push(tuningSet[0]);
        }
        return tuningSet;
    };
    Music.prototype.getInstrumentObject = function (name) {
        var iObj = null;
        switch (name) {
            case "dulcimer":
                iObj = new MountainDulcimer();
                break;
            case "ukulele":
                iObj = new Ukulele();
                break;
            case "mandolin":
                iObj = new Mandolin();
                break;
            case "harmonica":
                iObj = new Harmonica();
                break;
            default:
                throw new Error("Not implemented.");
        }
        return iObj;
    };
    Music.convertToID = function (name) {
        name = name.toUpperCase();
        var base = Music.NOTETOOFFSET[name.substr(0, name.length - 1)];
        base = base + (name.charCodeAt(name.length - 1) - 49) * 12;
        return base;
    };
    Music.isNoteIDSharp = function (id) {
        return Music.NOTEISSHARP[id % 12];
    };
    Music.prototype.getTuningByID = function () {
        var tuning = this.getTuning();
        var byID = [];
        var soundSet = this.getInstrument().getSoundSetDescriptor();
        var baseNoteID = Music.convertToID(soundSet.getBaseNote());
        for (var _i = 0, tuning_1 = tuning; _i < tuning_1.length; _i++) {
            var t = tuning_1[_i];
            byID.push(Music.convertToID(t) - baseNoteID + 1);
        }
        return byID;
    };
    Music.NOTETOOFFSET = {
        "C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11
    };
    Music.NOTEISSHARP = [
        false, true, false, true, false, false, true, false, true, false, true, false
    ];
    return Music;
}());
var Strum = (function () {
    function Strum(strumDef, instrument, startTime, label) {
        this.stringCount = instrument.getStringCount();
        this.startTime = startTime;
        this.label = label;
        this.qbLength = parseInt(strumDef.substr(-2), 10);
        this.fretting = [];
        for (var n = 0; n < this.stringCount; n++) {
            var c = parseInt(strumDef.substr(n * 2, 2), 10);
            c = (c == 99) ? Strum.NOSTRUM : c;
            this.fretting.push(c);
        }
    }
    Strum.prototype.getStringCount = function () {
        return this.stringCount;
    };
    Strum.prototype.getFretPosition = function (stringNumber) {
        return this.fretting[stringNumber];
    };
    Strum.prototype.getStartTime = function () {
        return this.startTime;
    };
    Strum.prototype.getEndTime = function () {
        return this.startTime + this.qbLength;
    };
    Strum.prototype.getLength = function () {
        return this.qbLength;
    };
    Strum.prototype.getLabel = function () {
        return this.label;
    };
    Strum.NOSTRUM = -1;
    return Strum;
}());
window.onload = function () {
    var game = new StringTrainerApplication();
};
var StringTrainerApplication = (function (_super) {
    __extends(StringTrainerApplication, _super);
    function StringTrainerApplication() {
        var _this = _super.call(this, {
            enableDebug: false,
            width: 1280,
            height: 800,
            renderer: Phaser.AUTO,
            parent: null,
            transparent: false, antialias: true
        }) || this;
        _this.state.add("Boot", new BootState());
        _this.state.add("Preload", new PreloadState());
        _this.state.add("Main", new MainState());
        _this.state.start("Boot");
        return _this;
    }
    StringTrainerApplication.getURLName = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = ""; }
        var name = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key.toLowerCase()).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        return (name == "") ? defaultValue : name;
    };
    return StringTrainerApplication;
}(Phaser.Game));
var BootState = (function (_super) {
    __extends(BootState, _super);
    function BootState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BootState.prototype.preload = function () {
        var _this = this;
        this.game.load.image("loader", "assets/sprites/loader.png");
        var src = StringTrainerApplication.getURLName("music", "music.json");
        this.game.load.json("music", StringTrainerApplication.getURLName("music", src));
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Preload", true, false, 1); }, this);
    };
    BootState.prototype.create = function () {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    };
    return BootState;
}(Phaser.State));
var PreloadState = (function (_super) {
    __extends(PreloadState, _super);
    function PreloadState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreloadState.prototype.preload = function () {
        var _this = this;
        this.game.stage.backgroundColor = "#000000";
        var loader = this.add.sprite(this.game.width / 2, this.game.height / 2, "loader");
        loader.width = this.game.width * 9 / 10;
        loader.height = this.game.height / 8;
        loader.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(loader);
        this.game.load.atlas("sprites", "assets/sprites/sprites.png", "assets/sprites/sprites.json");
        for (var _i = 0, _a = ["7seg", "font"]; _i < _a.length; _i++) {
            var fontName = _a[_i];
            this.game.load.bitmapFont(fontName, "assets/fonts/" + fontName + ".png", "assets/fonts/" + fontName + ".fnt");
        }
        this.game.load.audio("metronome", ["assets/sounds/metronome.mp3",
            "assets/sounds/metronome.ogg"]);
        this.analyseMusic();
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Main", true, false, 1); }, this);
    };
    PreloadState.prototype.preloadSounds = function (desc, toLoad) {
        for (var is in toLoad) {
            var i = parseInt(is, 10);
            var sound = desc.getStem() + "-" + (i < 10 ? "0" : "") + i.toString();
            this.game.load.audio(sound, ["assets/sounds/" + sound + ".mp3",
                "assets/sounds/" + sound + ".ogg"]);
        }
    };
    PreloadState.prototype.analyseMusic = function () {
        var used = {};
        var json = this.game.cache.getJSON("music");
        var music = new Music(json);
        var tuning = music.getTuningByID();
        for (var bar = 0; bar < music.getBarCount(); bar++) {
            for (var strum = 0; strum < music.getBar(bar).getStrumCount(); strum++) {
                var strumDef = music.getBar(bar).getStrum(strum);
                for (var stringID = 0; stringID < strumDef.getStringCount(); stringID++) {
                    var chromOffset = strumDef.getFretPosition(stringID);
                    if (chromOffset != Strum.NOSTRUM) {
                        used[(chromOffset + tuning[stringID]).toString()] = true;
                    }
                }
            }
        }
        this.preloadSounds(music.getInstrument().getSoundSetDescriptor(), used);
    };
    return PreloadState;
}(Phaser.State));
var BaseRenderManager = (function (_super) {
    __extends(BaseRenderManager, _super);
    function BaseRenderManager(game, instrument, music) {
        var _this = _super.call(this, game) || this;
        _this.instrument = instrument;
        _this.music = music;
        _this.drawBackground();
        var factory = instrument.getRendererFactory();
        _this.renderers = [];
        for (var bar = 0; bar < music.getBarCount(); bar++) {
            var rnd = factory.getRenderer(game, _this, instrument, music.getBar(bar), _this.getBoxWidth(), _this.getBoxHeight());
            _this.renderers.push(rnd);
        }
        _this.bouncingBall = _this.game.add.image(100, 100, "sprites", "sphere_red");
        _this.bouncingBall.anchor.x = 0.5;
        _this.bouncingBall.anchor.y = 1;
        _this.bouncingBall.width = _this.bouncingBall.height = _this.getBoxHeight() / 5;
        _this.updatePosition(0);
        return _this;
    }
    BaseRenderManager.prototype.updatePosition = function (fracPos) {
        for (var bar = 0; bar < this.music.getBarCount(); bar++) {
            this.renderers[bar].moveTo(this.getXBox(fracPos, bar), this.getYBox(fracPos, bar));
        }
        var currentBar = Math.floor(fracPos);
        var fracPosPart = fracPos - Math.floor(fracPos);
        if (currentBar < this.music.getBarCount()) {
            var xBall = this.renderers[currentBar].getXBall(fracPosPart);
            var yBall = this.renderers[currentBar].getYBall(fracPosPart);
            if (xBall != null && yBall != null) {
                this.bouncingBall.visible = true;
                this.bouncingBall.bringToTop();
                this.bouncingBall.x = this.getXBox(fracPos, currentBar) + xBall;
                this.bouncingBall.y = this.getYBox(fracPos, currentBar) + yBall;
            }
            else {
                this.bouncingBall.visible = false;
            }
        }
    };
    BaseRenderManager.prototype.destroy = function () {
        for (var _i = 0, _a = this.renderers; _i < _a.length; _i++) {
            var rnd = _a[_i];
            rnd.destroy();
        }
        this.eraseBackground();
        this.bouncingBall.destroy();
        this.bouncingBall = null;
        _super.prototype.destroy.call(this);
        this.renderers = this.instrument = this.music = null;
    };
    return BaseRenderManager;
}(Phaser.Group));
var BaseRenderer = (function (_super) {
    __extends(BaseRenderer, _super);
    function BaseRenderer(game, manager, bar, instrument, width, height) {
        var _this = _super.call(this, game) || this;
        _this.isDrawn = false;
        _this.rWidth = width;
        _this.rHeight = height;
        _this.bar = bar;
        _this.instrument = instrument;
        _this.manager = manager;
        _this.beats = _this.bar.getBeats();
        _this.xiLast = _this.yiLast = -999999;
        _this.debugRectangle = null;
        if (BaseRenderer.SHOW_DEBUG) {
            _this.debugRectangle = _this.game.add.image(0, 0, "sprites", "rectangle", _this);
            _this.debugRectangle.width = width;
            _this.debugRectangle.height = height;
            _this.debugRectangle.alpha = 0.3;
            _this.debugRectangle.visible = false;
            _this.debugRectangle.tint = Math.floor(Math.random() * 0x1000000);
        }
        return _this;
    }
    BaseRenderer.prototype.moveTo = function (x, y) {
        x = Math.round(x);
        y = Math.round(y);
        if (x == this.xiLast && y == this.yiLast)
            return;
        if (x > this.game.width || x + this.rWidth < 0 ||
            y > this.game.height || y + this.rHeight < 0) {
            if (this.isDrawn) {
                this.eraseAllObjects();
                if (this.debugRectangle != null) {
                    this.debugRectangle.visible = false;
                }
                this.isDrawn = false;
            }
            return;
        }
        if (!this.isDrawn) {
            this.drawAllObjects();
            if (this.debugRectangle != null) {
                this.debugRectangle.visible = true;
            }
            this.isDrawn = true;
        }
        this.moveAllObjects(x, y);
        if (this.debugRectangle != null) {
            this.debugRectangle.x = x;
            this.debugRectangle.y = y;
        }
        this.xiLast = x;
        this.yiLast = y;
    };
    BaseRenderer.prototype.destroy = function () {
        if (this.isDrawn) {
            this.eraseAllObjects();
            this.isDrawn = false;
        }
        if (this.debugRectangle != null) {
            this.debugRectangle.destroy();
        }
        this.manager = null;
        _super.prototype.destroy.call(this);
    };
    BaseRenderer.prototype.getXBall = function (fractionalBar) {
        return null;
    };
    BaseRenderer.prototype.getYBall = function (fractionalBar) {
        return null;
    };
    BaseRenderer.SHOW_DEBUG = false;
    return BaseRenderer;
}(Phaser.Group));
var TestRenderer = (function (_super) {
    __extends(TestRenderer, _super);
    function TestRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestRenderer.prototype.moveAllObjects = function (x, y) {
        this.img.x = x;
        this.img.y = y;
    };
    TestRenderer.prototype.drawAllObjects = function () {
        this.img = this.game.add.image(0, 0, "sprites", "sphere_green", this);
        this.img.width = this.rWidth;
        this.img.height = this.rHeight;
    };
    TestRenderer.prototype.eraseAllObjects = function () {
        this.img.destroy();
        this.img = null;
    };
    return TestRenderer;
}(BaseRenderer));
var BounceBaseRenderer = (function (_super) {
    __extends(BounceBaseRenderer, _super);
    function BounceBaseRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BounceBaseRenderer.prototype.moveAllObjects = function (x, y) {
        for (var n = 0; n < this.sineList.length; n++) {
            this.sineList[n].x = x + this.sineStartTime[n] * this.rWidth / (this.bar.getBeats() * 4);
            this.sineList[n].y = y + this.getSinePositionOffset();
        }
    };
    BounceBaseRenderer.prototype.drawAllObjects = function () {
        this.sineList = [];
        this.sineStartTime = [];
        this.sineEndTime = [];
        if (this.bar.getStrumCount() == 0) {
            for (var n = 0; n < this.beats; n++) {
                this.addSineGraphic(n * 4, (n + 1) * 4);
            }
        }
        else {
            this.addSineGraphic(0, this.bar.getStrum(0).getStartTime());
            for (var n = 0; n < this.bar.getStrumCount(); n++) {
                this.addSineGraphic(this.bar.getStrum(n).getStartTime(), this.bar.getStrum(n).getEndTime());
            }
            this.addSineGraphic(this.bar.getStrum(this.bar.getStrumCount() - 1).getEndTime(), this.beats * 4);
        }
    };
    BounceBaseRenderer.prototype.eraseAllObjects = function () {
        for (var _i = 0, _a = this.sineList; _i < _a.length; _i++) {
            var img2 = _a[_i];
            img2.destroy();
        }
        this.sineList = this.sineStartTime = this.sineEndTime = null;
    };
    BounceBaseRenderer.prototype.getSinePositionOffset = function () {
        return 0;
    };
    BounceBaseRenderer.prototype.addSineGraphic = function (start, end) {
        if (start != end) {
            var sineHeight = this.getSineCurveHeight();
            var sineWidth = (end - start) * this.rWidth / (this.bar.getBeats() * 4);
            var img = this.game.add.image(0, 0, "sprites", (sineWidth / sineHeight > 1.4) ? "sinecurve_wide" : "sinecurve", this);
            img.width = sineWidth;
            img.height = sineHeight;
            img.anchor.y = 1;
            this.sineList.push(img);
            this.sineStartTime.push(start);
            this.sineEndTime.push(end);
        }
    };
    BounceBaseRenderer.prototype.getXBall = function (fractionalBar) {
        return fractionalBar * this.rWidth;
    };
    BounceBaseRenderer.prototype.getYBall = function (fractionalBar) {
        var qbPos = fractionalBar * this.bar.getBeats() * 4;
        for (var n = 0; n < this.sineList.length; n++) {
            if (qbPos >= this.sineStartTime[n] && qbPos < this.sineEndTime[n]) {
                var prop = (qbPos - this.sineStartTime[n]) / (this.sineEndTime[n] - this.sineStartTime[n]);
                var offset = Math.sin(prop * Math.PI);
                offset = offset * this.getSineCurveHeight();
                return this.getSinePositionOffset() - offset;
            }
        }
        return 0;
    };
    BounceBaseRenderer.prototype.getSineCurveHeight = function () {
        return this.game.height / 6;
    };
    return BounceBaseRenderer;
}(BaseRenderer));
var HarmonicaGraphic = (function (_super) {
    __extends(HarmonicaGraphic, _super);
    function HarmonicaGraphic(game, count, hWidth, hHeight) {
        var _this = _super.call(this, game) || this;
        _this.holeWidth = hWidth;
        _this.holeCount = count;
        _this.holeHeight = hHeight;
        for (var n = 0; n <= count; n++) {
            if (n < count) {
                var img = _this.game.add.image((n - count / 2) * hWidth, -hHeight / 2, "sprites", "hole", _this);
                img.width = hWidth;
                img.height = hHeight;
                var txt = _this.game.add.bitmapText(img.x + hWidth / 2, -hHeight * 2 / 3, "font", (n + 1).toString(), hWidth / 3, _this);
                txt.anchor.x = 0.5;
                txt.anchor.y = 1;
                txt.tint = 0xFF8000;
            }
        }
        var colour = 0xCCCCCC;
        for (var s = -1; s <= 1; s += 2) {
            var img;
            img = _this.game.add.image(0, s * hHeight / 2, "sprites", "rectangle", _this);
            img.width = count * hWidth + 4;
            img.height = hHeight / 8;
            img.anchor.x = 0.5;
            img.anchor.y = 1 - (s + 1) / 2;
            img.tint = colour;
            img = _this.game.add.image(s * count / 2 * hWidth, 0, "sprites", "rectangle", _this);
            img.anchor.x = 1 - (s + 1) / 2;
            img.anchor.y = 0.5;
            img.height = hHeight * 5 / 4;
            img.width = hWidth / 4;
            img.tint = colour;
            img = _this.game.add.image(s * count / 2 * hWidth, 0, "sprites", "rectangle", _this);
            img.anchor.x = 1 - (s + 1) / 2;
            img.anchor.y = 0.5;
            img.height = hHeight * 2 / 3;
            img.width = hWidth;
            img.tint = colour;
        }
        _this.cacheAsBitmap = true;
        return _this;
    }
    HarmonicaGraphic.prototype.getXHole = function (hole) {
        return this.x - this.holeCount * this.holeWidth / 2 +
            this.holeWidth * (hole - 1) + this.holeWidth / 2;
    };
    HarmonicaGraphic.prototype.getYHole = function () {
        return this.y - this.holeHeight / 2;
    };
    HarmonicaGraphic.prototype.getHoleWidth = function () {
        return Math.floor(this.holeWidth * 80 / 100);
    };
    HarmonicaGraphic.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    return HarmonicaGraphic;
}(Phaser.Group));
var HarmonicaRenderer = (function (_super) {
    __extends(HarmonicaRenderer, _super);
    function HarmonicaRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HarmonicaRenderer.prototype.moveAllObjects = function (x, y) {
        var mgr = (this.manager);
        var beats = this.bar.getBeats();
        var vidx = 0;
        for (var n = this.bar.getStrumCount() - 1; n >= 0; n--) {
            var strum = this.bar.getStrum(n);
            for (var str = 0; str < this.instrument.getStringCount(); str++) {
                var fret = strum.getFretPosition(str);
                if (fret != Strum.NOSTRUM) {
                    var note = this.instrument.toDisplayFret(fret);
                    var hole = Math.abs(parseInt(note.replace("b", ""), 10));
                    var yc = y + mgr.getBoxHeight();
                    yc = yc - strum.getStartTime() / (beats * 4) * mgr.getBoxHeight();
                    this.visList[vidx].x = mgr.getXHole(hole);
                    this.visList[vidx].y = yc;
                    var width = (mgr.getXHole(hole + 1) - mgr.getXHole(hole));
                    var height = mgr.getBoxHeight() * strum.getLength() / (beats * 4);
                    this.visList[vidx].width = width * 0.9;
                    this.visList[vidx].height = height * 0.9;
                    vidx++;
                }
            }
        }
        this.barMarker.x = this.game.width / 2;
        this.barMarker.y = y + mgr.getBoxHeight();
    };
    HarmonicaRenderer.prototype.drawAllObjects = function () {
        this.visList = [];
        this.barMarker = this.game.add.image(0, 0, "sprites", "bar", this);
        this.barMarker.rotation = Math.PI / 2;
        this.barMarker.height = this.rWidth;
        this.barMarker.width = Math.max(1, this.rHeight / 32);
        this.barMarker.anchor.x = this.barMarker.anchor.y = 0.5;
        var beats = this.bar.getBeats();
        for (var n = this.bar.getStrumCount() - 1; n >= 0; n--) {
            var strum = this.bar.getStrum(n);
            for (var str = 0; str < this.instrument.getStringCount(); str++) {
                var fret = strum.getFretPosition(str);
                if (fret != Strum.NOSTRUM) {
                    var disp = this.instrument.toDisplayFret(fret);
                    var img = this.game.add.image(100, 100, "sprites", disp[0] == "-" ? "drawfrectangle" : "blowfrectangle");
                    img.tint = this.getObjColour(disp);
                    img.anchor.x = 0.5;
                    img.anchor.y = 1;
                    this.visList.push(img);
                }
            }
        }
    };
    HarmonicaRenderer.prototype.eraseAllObjects = function () {
        for (var _i = 0, _a = this.visList; _i < _a.length; _i++) {
            var vis = _a[_i];
            vis.destroy();
        }
        this.barMarker.destroy();
        this.barMarker = this.visList = null;
    };
    HarmonicaRenderer.prototype.getObjColour = function (name) {
        name = name.toUpperCase();
        var bend = name.length - (name.replace("b", "").length);
        return name[0] == "-" ? HarmonicaRenderer.DRAW_COLOURS[bend] : HarmonicaRenderer.BLOW_COLOURS[bend];
    };
    HarmonicaRenderer.DRAW_COLOURS = [
        0xFFFF00,
        0xFF8000,
        0xFF0000,
        0xFF00FF
    ];
    HarmonicaRenderer.BLOW_COLOURS = [
        0x00CC00,
        0x006633,
        0x004C99,
        0x0000CC
    ];
    return HarmonicaRenderer;
}(BaseRenderer));
var HarmonicaRendererFactory = (function () {
    function HarmonicaRendererFactory() {
    }
    HarmonicaRendererFactory.prototype.getRenderManager = function (game, instrument, music) {
        return new HarmonicaRenderManager(game, instrument, music);
    };
    HarmonicaRendererFactory.prototype.getRenderer = function (game, manager, instrument, bar, width, height) {
        return new HarmonicaRenderer(game, manager, bar, instrument, width, height);
    };
    return HarmonicaRendererFactory;
}());
var HarmonicaRenderManager = (function (_super) {
    __extends(HarmonicaRenderManager, _super);
    function HarmonicaRenderManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HarmonicaRenderManager.prototype.updatePosition = function (fracPos) {
        this.game.world.bringToTop(this.harmonicaGfx);
        _super.prototype.updatePosition.call(this, fracPos);
    };
    HarmonicaRenderManager.prototype.drawBackground = function () {
        var hSize = this.getHarmonicaSize();
        var holeSize = Math.floor(this.game.width * 0.85 / (Math.max(10, hSize) + 1));
        this.lineGroup = this.game.add.group();
        this.harmonicaGfx = new HarmonicaGraphic(this.game, hSize, holeSize, holeSize);
        this.harmonicaGfx.x = this.game.width / 2;
        this.harmonicaGfx.y = this.game.height * 0.78;
        this.boxWidth = holeSize;
        for (var n = 1; n <= this.getHarmonicaSize() + 1; n++) {
            var img = this.game.add.image(this.getXHole(n) - holeSize / 2, 0, "sprites", "rectangle", this.lineGroup);
            img.anchor.x = 0.5;
            img.width = Math.max(1, this.game.width / 512);
            img.height = this.game.height * 5 / 4;
            img.tint = 0x00;
        }
    };
    HarmonicaRenderManager.prototype.eraseBackground = function () {
        this.lineGroup.destroy();
        this.lineGroup = null;
        this.harmonicaGfx.destroy();
        this.harmonicaGfx = null;
    };
    HarmonicaRenderManager.prototype.getBoxWidth = function () {
        return this.boxWidth * this.getHarmonicaSize();
    };
    HarmonicaRenderManager.prototype.getBoxHeight = function () {
        return this.game.height / 2.5;
    };
    HarmonicaRenderManager.prototype.getXBox = function (fracPos, bar) {
        return this.game.width / 2 - this.getBoxWidth() / 2;
    };
    HarmonicaRenderManager.prototype.getYBox = function (fracPos, bar) {
        return this.harmonicaGfx.getYHole() - (-fracPos + bar + 1) * this.getBoxHeight();
    };
    HarmonicaRenderManager.prototype.getHarmonicaSize = function () {
        return 10;
    };
    HarmonicaRenderManager.prototype.getXHole = function (hole) {
        return this.harmonicaGfx.getXHole(hole);
    };
    return HarmonicaRenderManager;
}(BaseRenderManager));
var BaseStaveRenderManager = (function (_super) {
    __extends(BaseStaveRenderManager, _super);
    function BaseStaveRenderManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseStaveRenderManager.prototype.getStaveBox = function () {
        return new Phaser.Rectangle(0, 0, this.getBoxWidth(), this.getBoxHeight());
    };
    return BaseStaveRenderManager;
}(BaseRenderManager));
var TestStaveRenderManager = (function (_super) {
    __extends(TestStaveRenderManager, _super);
    function TestStaveRenderManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestStaveRenderManager.prototype.getBoxWidth = function () {
        return this.game.width / 3;
    };
    TestStaveRenderManager.prototype.getBoxHeight = function () {
        return this.game.height / 2;
    };
    TestStaveRenderManager.prototype.getXBox = function (fracPos, bar) {
        return this.game.width / 4 + (-fracPos + bar) * this.getBoxWidth();
    };
    TestStaveRenderManager.prototype.getYBox = function (fracPos, bar) {
        return this.game.height * 4 / 5 - this.getBoxHeight();
    };
    TestStaveRenderManager.prototype.getStaveBox = function () {
        return new Phaser.Rectangle(0, 20, this.getBoxWidth() - 0, this.getBoxHeight() / 2);
    };
    TestStaveRenderManager.prototype.drawBackground = function () {
    };
    TestStaveRenderManager.prototype.eraseBackground = function () {
    };
    return TestStaveRenderManager;
}(BaseStaveRenderManager));
var TestRendererFactory = (function () {
    function TestRendererFactory() {
    }
    TestRendererFactory.prototype.getRenderManager = function (game, instrument, music) {
        return new TestStaveRenderManager(game, instrument, music);
    };
    TestRendererFactory.prototype.getRenderer = function (game, manager, instrument, bar, width, height) {
        return new TestStaveRenderer(game, manager, bar, instrument, width, height);
    };
    return TestRendererFactory;
}());
var BaseStaveRenderer = (function (_super) {
    __extends(BaseStaveRenderer, _super);
    function BaseStaveRenderer(game, manager, bar, instrument, width, height) {
        var _this = _super.call(this, game, manager, bar, instrument, width, height) || this;
        _this.stManager = _this.manager;
        _this.stRect = _this.stManager.getStaveBox();
        _this.backRect = null;
        return _this;
    }
    BaseStaveRenderer.prototype.moveAllObjects = function (x, y) {
        this.backRect.x = x + this.stRect.x;
        this.backRect.y = y + this.stRect.y;
        for (var i = 0; i < 5; i++) {
            this.lines[i].x = this.backRect.x;
            this.lines[i].y = y + this.getYStaveLine(i);
        }
        this.barLine.x = this.backRect.x + this.stRect.width * 15 / 16;
        this.barLine.y = y + this.getYStaveLine(2);
        for (var n = 0; n < this.bar.getStrumCount(); n++) {
            var strum = this.bar.getStrum(n);
            var xPos = (strum.getStartTime()) * this.rWidth / (4 * this.beats);
            this.noteGraphics[n].x = this.stRect.x + x + xPos;
            this.noteGraphics[n].y = y + this.getYStaveLine(2);
        }
        _super.prototype.moveAllObjects.call(this, x, y);
    };
    BaseStaveRenderer.prototype.getYStaveLine = function (n) {
        return (4 - 1.5 - n) * this.getStaveSpacing() + this.stRect.halfHeight;
    };
    BaseStaveRenderer.prototype.getStaveSpacing = function () {
        return this.stRect.height / 8;
    };
    BaseStaveRenderer.prototype.drawAllObjects = function () {
        this.backRect = this.game.add.image(0, 0, "sprites", "rectangle");
        this.backRect.width = this.stRect.width;
        this.backRect.height = this.stRect.height;
        this.barLine = this.game.add.image(0, 0, "sprites", "rectangle");
        this.barLine.width = this.game.width / 160;
        this.barLine.height = (this.getYStaveLine(0) - this.getYStaveLine(4)) + 4;
        this.barLine.tint = 0x0;
        this.barLine.anchor.y = 0.5;
        this.lines = [];
        for (var i = 0; i < 5; i++) {
            this.lines[i] = this.game.add.image(0, 0, "sprites", "rectangle");
            this.lines[i].width = this.stRect.width;
            this.lines[i].height = Math.max(2, this.game.height / 160);
            this.lines[i].anchor.y = 0.5;
            this.lines[i].tint = 0x000000;
            if (i == 0)
                this.lines[i].tint = 0xFF8000;
        }
        var tuning = this.manager.music.getTuning();
        var midNote = Music.convertToID(this.getCentreLineNote());
        this.noteGraphics = [];
        var beats = this.bar.getBeats();
        for (var n = 0; n < this.bar.getStrumCount(); n++) {
            var strum = this.bar.getStrum(n);
            var ng = new NoteGraphic(this.game, strum.getLength(), this.getStaveSpacing());
            this.noteGraphics[n] = ng;
            var isRest = true;
            for (var str = 0; str < this.instrument.getStringCount(); str++) {
                var fret = strum.getFretPosition(str);
                if (fret != Strum.NOSTRUM) {
                    ng.addNote(strum.getFretPosition(str) + Music.convertToID(tuning[str]), str, midNote);
                    isRest = false;
                }
            }
            if (isRest) {
                ng.addRest();
            }
            else {
                ng.addSpacers();
            }
        }
        _super.prototype.drawAllObjects.call(this);
    };
    BaseStaveRenderer.prototype.eraseAllObjects = function () {
        for (var _i = 0, _a = this.noteGraphics; _i < _a.length; _i++) {
            var g = _a[_i];
            g.destroy();
        }
        this.backRect.destroy();
        this.barLine.destroy();
        for (var _b = 0, _c = this.lines; _b < _c.length; _b++) {
            var l = _c[_b];
            l.destroy();
        }
        this.backRect = null;
        this.lines = null;
        this.barLine = null;
        this.noteGraphics = null;
        _super.prototype.eraseAllObjects.call(this);
    };
    BaseStaveRenderer.prototype.getCentreLineNote = function () {
        return "B3";
    };
    return BaseStaveRenderer;
}(BounceBaseRenderer));
var TestStaveRenderer = (function (_super) {
    __extends(TestStaveRenderer, _super);
    function TestStaveRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestStaveRenderer.prototype.moveAllObjects = function (x, y) {
        _super.prototype.moveAllObjects.call(this, x, y);
    };
    TestStaveRenderer.prototype.drawAllObjects = function () {
        _super.prototype.drawAllObjects.call(this);
    };
    TestStaveRenderer.prototype.eraseAllObjects = function () {
        _super.prototype.eraseAllObjects.call(this);
    };
    return TestStaveRenderer;
}(BaseStaveRenderer));
var NoteGraphic = (function (_super) {
    __extends(NoteGraphic, _super);
    function NoteGraphic(game, length, spacing) {
        var _this = _super.call(this, game) || this;
        _this.lowest = 0;
        _this.highest = 0;
        _this.qbLength = length;
        _this.spacing = spacing;
        return _this;
    }
    NoteGraphic.prototype.addNote = function (note, str, centre) {
        var offset = this.toWhiteNoteOffset(note) - this.toWhiteNoteOffset(centre);
        var img = this.game.add.image(0, 0, "sprites", this.qbLength >= 2 * 4 ? "minim" : "crotchet", this);
        img.anchor.x = img.anchor.y = 0.5;
        img.width = this.spacing * 1.2;
        img.height = this.spacing * 0.9;
        img.y = -offset * this.spacing / 2;
        this.lowest = Math.min(this.lowest, offset);
        this.highest = Math.max(this.highest, offset);
        if (Music.isNoteIDSharp(note)) {
            img = this.game.add.image(img.x - this.spacing * 1.1, img.y, "sprites", "sharp", this);
            img.anchor.x = 0.5;
            img.anchor.y = 0.5;
            img.width = this.spacing * 0.7;
            img.height = this.spacing;
        }
    };
    NoteGraphic.prototype.addSpacers = function () {
        for (var p = this.lowest; p <= this.highest; p++) {
            if (p % 2 == 0) {
                var l = p / 2;
                if (Math.abs(l) > 2) {
                    var img = this.game.add.image(0, -l * this.spacing, "sprites", "rectangle", this);
                    img.width = this.spacing * 2;
                    img.height = Math.max(1, this.spacing / 4);
                    img.anchor.x = img.anchor.y = 0.5;
                    img.tint = 0x000000;
                }
            }
        }
    };
    NoteGraphic.prototype.addRest = function () {
        var img = this.game.add.image(0, 0, "sprites", this.qbLength >= 4 ? "rest1" : "rest2", this);
        img.anchor.x = img.anchor.y = 0.5;
        img.width = this.spacing * 3 / 2;
        img.height = this.spacing * 3;
    };
    NoteGraphic.prototype.toWhiteNoteOffset = function (note) {
        return Math.floor(note / 12) * 7 + NoteGraphic.BASENOTES[note % 12];
    };
    NoteGraphic.BASENOTES = [
        0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6
    ];
    return NoteGraphic;
}(Phaser.Group));
var StringRenderer = (function (_super) {
    __extends(StringRenderer, _super);
    function StringRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StringRenderer.prototype.moveAllObjects = function (x, y) {
        var beats = this.bar.getBeats();
        var midx = 0;
        for (var n = 0; n < this.bar.getStrumCount(); n++) {
            var strum = this.bar.getStrum(n);
            var xPos = (strum.getStartTime() + strum.getLength() / 2) * this.rWidth / (4 * beats);
            for (var str = 0; str < this.instrument.getStringCount(); str++) {
                var fret = strum.getFretPosition(str);
                if (fret != Strum.NOSTRUM) {
                    this.markerList[midx].x = x + xPos;
                    var drawStr = str;
                    if (this.instrument.isLowestPitchAtBottom()) {
                        drawStr = (this.instrument.getStringCount() - 1 - drawStr);
                    }
                    this.markerList[midx].y = y + (drawStr + 0.5) * this.rHeight / (this.instrument.getStringCount());
                    midx++;
                }
            }
        }
        _super.prototype.moveAllObjects.call(this, x, y);
        this.barMarker.x = x;
        this.barMarker.y = y;
    };
    StringRenderer.prototype.drawAllObjects = function () {
        this.markerList = [];
        this.barMarker = this.game.add.image(0, 0, "sprites", "bar", this);
        this.barMarker.anchor.x = 0.5;
        this.barMarker.height = this.rHeight;
        this.barMarker.width = Math.max(1, this.rWidth / 48);
        var beats = this.bar.getBeats();
        var objHeight = this.rHeight / (this.instrument.getStringCount()) * 0.9;
        for (var n = 0; n < this.bar.getStrumCount(); n++) {
            var strum = this.bar.getStrum(n);
            var objWidth = this.rWidth * strum.getLength() / (4 * beats) * 0.95;
            for (var str = 0; str < this.instrument.getStringCount(); str++) {
                var fret = strum.getFretPosition(str);
                if (fret != Strum.NOSTRUM) {
                    var colour = StringRenderer._colours[fret % StringRenderer._colours.length];
                    var fName = this.instrument.toDisplayFret(fret);
                    var sm = new StrumMarker(this.game, fName, objWidth, objHeight, colour);
                    this.markerList.push(sm);
                }
            }
        }
        _super.prototype.drawAllObjects.call(this);
    };
    StringRenderer.prototype.eraseAllObjects = function () {
        _super.prototype.eraseAllObjects.call(this);
        for (var _i = 0, _a = this.markerList; _i < _a.length; _i++) {
            var img = _a[_i];
            img.destroy();
        }
        this.barMarker.destroy();
        this.barMarker = null;
        this.markerList = null;
    };
    StringRenderer._colours = [0xFF0000, 0x00FF00, 0x0040FF, 0xFFFF00, 0x00FFFF, 0xFF00FF, 0xFF8000,
        0x808080, 0xFFFFFF, 0x8B4513];
    return StringRenderer;
}(BounceBaseRenderer));
var StringRendererFactory = (function () {
    function StringRendererFactory() {
    }
    StringRendererFactory.prototype.getRenderManager = function (game, instrument, music) {
        return new StringRenderManager(game, instrument, music);
    };
    StringRendererFactory.prototype.getRenderer = function (game, manager, instrument, bar, width, height) {
        return new StringRenderer(game, manager, bar, instrument, width, height);
    };
    return StringRendererFactory;
}());
var StringRenderManager = (function (_super) {
    __extends(StringRenderManager, _super);
    function StringRenderManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StringRenderManager.prototype.drawBackground = function () {
        var bgr = this.game.add.image(0, this.getYBox(0, 0) + this.getBoxHeight() / 2, "sprites", "fretboard", this);
        bgr.width = this.game.width;
        bgr.height = this.getBoxHeight() * 130 / 100;
        bgr.anchor.y = 0.5;
        for (var s = 0; s < this.instrument.getStringCount(); s++) {
            var sn = s;
            if (this.instrument.isLowestPitchAtBottom()) {
                sn = this.instrument.getStringCount() - 1 - sn;
            }
            var y = this.getYBox(0, 0) + (sn + 0.5) * this.getBoxHeight() / this.instrument.getStringCount();
            var str = this.game.add.image(0, y, "sprites", this.instrument.isDoubleString(s) ? "mstring" : "string", this);
            str.width = this.game.width;
            str.height = Math.max(1, this.getBoxHeight() / 24);
            str.anchor.y = 0.5;
            if (this.instrument.isDoubleString(s)) {
                str.height = str.height * 2;
            }
        }
    };
    StringRenderManager.prototype.eraseBackground = function () {
    };
    StringRenderManager.prototype.getBoxWidth = function () {
        return this.game.width / 2.5;
    };
    StringRenderManager.prototype.getBoxHeight = function () {
        return this.game.height / 2.5;
    };
    StringRenderManager.prototype.getXBox = function (fracPos, bar) {
        return this.game.width / 4 + (-fracPos + bar) * this.getBoxWidth();
    };
    StringRenderManager.prototype.getYBox = function (fracPos, bar) {
        return this.game.height - 150 - this.getBoxHeight();
    };
    return StringRenderManager;
}(BaseRenderManager));
var StrumMarker = (function (_super) {
    __extends(StrumMarker, _super);
    function StrumMarker(game, sText, width, height, tint) {
        var _this = _super.call(this, game) || this;
        var gfxName = "rr" + _this.selectGraphicFrame(width / height).toString();
        var frame = _this.game.add.image(0, 0, "sprites", gfxName, _this);
        frame.width = width;
        frame.height = height;
        frame.anchor.x = frame.anchor.y = 0.5;
        frame.tint = tint;
        var text = _this.game.add.bitmapText(0, 0, "font", sText, height * 65 / 100, _this);
        text.anchor.x = 0.5;
        text.anchor.y = 0.4;
        text.tint = 0;
        _this.cacheAsBitmap = true;
        return _this;
    }
    StrumMarker.prototype.selectGraphicFrame = function (aspect) {
        var bestGraphic = 1;
        var bestDifference = 99999;
        for (var g = 1; g <= StrumMarker.BOXRATIO.length; g++) {
            var diff = Math.abs(aspect - StrumMarker.BOXRATIO[g]);
            if (diff < bestDifference) {
                bestGraphic = g;
                bestDifference = diff;
            }
        }
        return bestGraphic;
    };
    StrumMarker.BOXRATIO = [0, 102 / 50, 124 / 50, 152 / 50, 183 / 50, 199 / 50, 75 / 50, 50 / 50, 250 / 50];
    return StrumMarker;
}(Phaser.Group));
var SoundSet_Harmonica = (function () {
    function SoundSet_Harmonica() {
    }
    SoundSet_Harmonica.prototype.getBaseNote = function () {
        return "C4";
    };
    SoundSet_Harmonica.prototype.getNoteCount = function () {
        return 37;
    };
    SoundSet_Harmonica.prototype.getStem = function () {
        return "harmonica";
    };
    return SoundSet_Harmonica;
}());
var SoundSet_String = (function () {
    function SoundSet_String() {
    }
    SoundSet_String.prototype.getBaseNote = function () {
        return "C3";
    };
    SoundSet_String.prototype.getNoteCount = function () {
        return 48;
    };
    SoundSet_String.prototype.getStem = function () {
        return "string";
    };
    return SoundSet_String;
}());
