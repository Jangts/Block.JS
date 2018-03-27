/*!
 * tangram.js framework source code
 *
 * class medias.FlashSoundPlayer
 *
 * Date 2017-04-06
 */
;
tangram.block('$_/dom/', function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        document = global.document,
        console = global.console;

    // 注册_.medias命名空间到pandora
    _('medias');

    declare('medias.FlashSoundPlayer', {
        movieName: "",
        lastUrl: "",
        init: function(swfobjec, src, flashId, callback) {
            this.movieName = flashId;
            var that = this;
            _.load(swfobjec, function() {
                that.loadSWF(src, callback);
            });
        },
        loadSWF: function(src, callback) {
            var flashId = this.movieName || "FlashSoundPlayer";
            var elem = document.createElement('div');
            _.dom.setAttr(elem, "id", flashId);
            _.dom.setStyle(elem, { width: '0px', height: '0px', "overflow": 'hidden' });
            _.dom.append(document.body, elem);
            swfobject.embedSWF(src, flashId, 1, 1, "10.0.0", "", {}, {}, {}, callback);
        },
        loaded: function() {
            this.isload = true;
        },
        loadSound: function(str, key) {
            var f = null;
            var that = this;
            key = key || "";
            setTimeout(function() {
                if (that.thisMovie(that.movieName)) {
                    that.thisMovie(that.movieName).loadFile(str, key);
                    that.lastUrl = str;
                    //f?f.call(that):null;
                    var timer = setInterval(function() {
                        if (that.isload) {
                            clearInterval(timer);
                            f ? f.call(that) : null;
                        }
                    }, 50);
                }
            }, 1000);
            return {
                done: function(t) {
                    f = t || f;
                }
            };
        },
        play: function(str, isLoop) {
            var that = this;
            if (that.thisMovie(that.movieName)) {
                str = str || this.lastUrl;
                isLoop = isLoop || false;
                this.thisMovie(this.movieName).onPlay(str, isLoop);
            }
            return this;
        },
        stop: function(str) {
            var that = this;
            if (that.thisMovie(that.movieName)) {
                str = str || this.lastUrl;
                this.thisMovie(this.movieName).onStop(str);
            }
            return this;
        },
        thisMovie: function(movieName) {
            if (navigator.an.indexOf("Microsoft") != -1) {
                return window[movieName];
            } else {
                return document[movieName];
            }
        }
    });
});