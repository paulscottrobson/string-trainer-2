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
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainState.prototype.create = function () {
        var bgr = this.game.add.image(0, 0, "sprites", "background");
        bgr.width = this.game.width;
        bgr.height = this.game.height;
        var json = this.game.cache.getJSON("music");
        this.music = new Music(json);
        var rdr = new StringRenderer(this.game, this.music.getBar(0), this.music.getInstrument(), 600, 300);
        rdr.moveTo(100, 100);
    };
    MainState.prototype.destroy = function () {
        this.music = null;
    };
    MainState.prototype.update = function () {
    };
    return MainState;
}(Phaser.State));
var Instrument = (function () {
    function Instrument() {
    }
    Instrument.prototype.isContinuous = function () {
        return false;
    };
    Instrument.prototype.isLowestPitchAtBottom = function () {
        return false;
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
    StringInstrument.prototype.getRendererFactory = function () {
        return new StringRendererFactory();
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
        n = n + Math.floor(fret / 12);
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
var Mandolin = (function (_super) {
    __extends(Mandolin, _super);
    function Mandolin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mandolin.prototype.getDefaultTuning = function () {
        return "g3,d3,a4,e5";
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
        if (tuning != "") {
            tuning = this.instrument.getDefaultTuning();
        }
        return tuning.toLowerCase().split(",");
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
            default:
                throw new Error("Not implemented.");
        }
        return iObj;
    };
    return Music;
}());
var Strum = (function () {
    function Strum(strumDef, instrument, startTime, label) {
        this.stringCount = instrument.getStringCount();
        this.startTime = startTime;
        this.label = label;
        this.qbLength = strumDef.charCodeAt(this.stringCount + 1) - 97;
        this.fretting = [];
        for (var n = 0; n < this.stringCount; n++) {
            var c = strumDef.charCodeAt(n);
            c = (c == 45) ? Strum.NOSTRUM : c - 97;
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
        var _this = _super.call(this, 1280, 800, Phaser.AUTO, "", null, false, false) || this;
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
        for (var i = 1; i <= PreloadState.NOTE_COUNT; i++) {
            var sound = i.toString();
            this.game.load.audio(sound, ["assets/sounds/" + sound + ".mp3",
                "assets/sounds/" + sound + ".ogg"]);
        }
        this.game.load.audio("metronome", ["assets/sounds/metronome.mp3",
            "assets/sounds/metronome.ogg"]);
        var src = StringTrainerApplication.getURLName("music", "music.json");
        this.game.load.json("music", StringTrainerApplication.getURLName("music", src));
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Main", true, false, 1); }, this);
    };
    PreloadState.NOTE_COUNT = 48;
    return PreloadState;
}(Phaser.State));
var BaseRenderer = (function (_super) {
    __extends(BaseRenderer, _super);
    function BaseRenderer(game, bar, instrument, width, height) {
        var _this = _super.call(this, game) || this;
        _this.isDrawn = false;
        _this.rWidth = width;
        _this.rHeight = height;
        _this.bar = bar;
        _this.instrument = instrument;
        _this.xiLast = _this.yiLast = -999999;
        _this.debugRectangle = null;
        _this.debugRectangle = _this.game.add.image(0, 0, "sprites", "rectangle", _this);
        _this.debugRectangle.width = width;
        _this.debugRectangle.height = height;
        _this.debugRectangle.alpha = 0.3;
        return _this;
    }
    BaseRenderer.prototype.moveTo = function (x, y) {
        x = Math.round(x);
        y = Math.round(y);
        if (x == this.xiLast && y == this.yiLast)
            return;
        if (x > this.game.height || x + this.rWidth < 0 ||
            y > this.game.width || y + this.rHeight < 0) {
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
        _super.prototype.destroy.call(this);
    };
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
var StringRendererFactory = (function () {
    function StringRendererFactory() {
    }
    StringRendererFactory.prototype.getRenderManager = function () {
        throw new Error("Method not implemented.");
    };
    StringRendererFactory.prototype.getRenderer = function (game, instrument, bar) {
        throw new Error("Method not implemented.");
    };
    return StringRendererFactory;
}());
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
        text.tint = 0xFFFFFF;
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
