/*!
 * Block.JS Framework Source Code
 *
 * class medias.Player
 *
 * Date 2017-04-06
 */
;
block('$_/dom/Events.cls', function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    // 注册_.medias命名空间到pandora
    _('medias');

    declare('medias.Player', {
        protectTime: 100,
        lastActionTime: Date.now(),
        _init: function(elem, sheet) {
            if (_.util.bool.isEl(elem)) {
                this.Element = elem;
                this.type = this.Element.tagName;
            } else {
                this.Element = new Audio;
            }
            this.sheet = {};
            this.register(sheet);
        },
        setSource: function(sources) {
            if (sources && (typeof sources === 'object')) {
                var that = this;
                for (var i in sources) {
                    if (this.canPlay(i) == 'maybe') {
                        try {
                            that.Element.src = sources[i];
                        } catch (e) {
                            this.stop(function() {
                                that.Element.src = sources[i];
                            });
                        }
                        break;
                    }
                }
            }
            return this;
        },
        register: function(sheet, sources) {
            if (sheet && (typeof sheet === 'object')) {
                for (var code in sheet) {
                    if (sheet[code] && (typeof sheet[code] === 'object')) {
                        this.sheet[code] = sheet[code];
                    }
                }
            } else if (sheet && sources && (typeof sheet === 'string') && (typeof sources === 'object')) {
                this.sheet[code] = sheet[code];
            }
            return this;
        },
        clear: function(sheet, sources) {
            this.sheet = [];
        },
        play: function(code) {
            if (code && this.sheet[code]) {
                this.setSource(this.sheet[code]);
            }
            var that = this,
                duration = Date.now() - this.lastActionTime;
            if (duration > this.protectTime) {
                this.Element.play();
                this.lastActionTime = Date.now();
            } else {
                this.timer && clearTimeout(this.timer);
                this.timer = setTimeout(function() {
                    that.Element.play();
                    that.lastActionTime = Date.now();
                }, this.protectTime - duration);
            }
            return this;
        },
        canPlay: function(mime) {
            return this.Element.canPlayType(mime);
        },
        pause: function(onpause) {
            var that = this,
                duration = Date.now() - this.lastActionTime;
            if (duration > this.protectTime) {
                this.Element.pause();
                this.lastActionTime = Date.now();
                _.util.bool.isFn(onpause) && onpause.call(this);
            } else {
                this.timer && clearTimeout(this.timer);
                this.timer = setTimeout(function() {
                    that.Element.pause();
                    that.lastActionTime = Date.now();
                    _.util.bool.isFn(onpause) && onpause.call(this);
                }, this.protectTime - duration);
            }
            return this;
        },
        stop: function(onstop) {
            this.pause(function() {
                this.Element.currentTime = 0;
                _.util.bool.isFn(onstop) && onstop.call(this);
            });
            return this;
        },
        volume: function(vol) {
            switch (typeof vol) {
                case 'string':
                    if (vol == 'up') {
                        var volume = this.Element.volume + 0.1;
                        if (volume >= 1) {
                            volume = 1;
                        }
                        this.Element.volume = volume;
                    } else if (vol == 'down') {
                        var volume = this.Element.volume - 0.1;
                        if (volume <= 0) {
                            volume = 0;
                        }
                        this.Element.volume = volume;
                    }
                    break;
                case 'number':
                    if (vol >= 0 && vol <= 1) {
                        this.Element.volume = vol;
                    }
                    break;
            }
        }
    });
});