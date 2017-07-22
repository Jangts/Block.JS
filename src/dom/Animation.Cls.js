/*!
 * Block.JS Framework Source Code
 *
 * class dom.Animation
 *
 * Date 2017-04-06
 */
;
block(['$_/util/bool.xtd', '$_/util/Color.cls', '$_/dom/'], function(
    pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document;

    // 注册_.dom命名空间到pandora
    _('dom');

    var rgba = (function() {
        var div = document.createElement('div');
        div.style.backgroundColor = "rgb(0,0,0)";
        div.style.backgroundColor = "rgba(0,0,0,0)";
        var backgroundColor = div.style.backgroundColor;
        return (/^rgba\([0-9,\.\s]+\)$/.test(backgroundColor));
    })();

    declare('dom.Animation', _.Iterator, {
        _init: function(elem, settings) {
            this.Element = elem;
            this.curScene = 0;
            this.curFrame = 0;
            this.playback = true;
            this.running = false;
            this.looped = 0;
            settings && this.push(settings);
        },
        fps: 36,
        loop: 1,
        timer: undefined,
        data: undefined,

        tween: function(t, b, c, d) {
            return c * t / d + b;
        },

        cut: function(settings) {
            this.duration = settings.duration || 1000;
            this.tween = typeof(settings.tween) == 'function' ? settings.tween : this.tween;
            this.mc = {};
            for (var i in settings.to) {
                this.mc[i] = {
                    from: settings.from && typeof(settings.from[i]) != 'undefined' ? this.rgbFormat(settings.from[i]) : this.rgbFormat(_.dom.getStyle(this.Element, i)),
                    to: this.rgbFormat(settings.to[i]),
                    over: settings.over && settings.over[i] ? this.rgbFormat(settings.over[i]) : this.rgbFormat(settings.to[i]),
                    tween: settings.tween && settings.tween[i] ? settings.tween[i] : this.tween
                };
            };
            this.frames = Math.ceil(this.duration * this.fps / 1000);
            return this;
        },

        rgbFormat: function(value) {
            var arr = _.util.Color.toArray(value);
            if (arr) {
                return arr;
            }
            if (/^(\+|-)?\d+%$/.test(value)) {
                return value;
            }
            return parseFloat(value);
        },

        play: function(loop, callback) {
            if (this.playback && this.length > 0) {
                this.playback = false;
                this.running = true;
                loop = loop || this.loop || 1;
                this.curScene = 0;
                if (this.looped < loop || loop == -1) {
                    this.transfer(this);
                } else {
                    this.looped = 0;
                    callback = callback || this.callback || null;
                    callback && callback.call(this.Element, this.data);
                    this.length = 0;
                    this.curScene = 0;
                    this.playback = true;
                }
            }
        },

        transfer: function(that) {
            if (this.curScene < this.length) {
                this.gotoAndPlay(this.curScene, 0);
                this.curScene++;
            } else {
                this.looped++;
                this.playback = true;
                this.play();
            }
        },

        //开始播放
        enterClip: function(callback) {
            var that = this;
            callback = callback || this[this.curScene] && this[this.curScene].callback || null;
            this.timer && this.stop();
            this.timer = setInterval(function() {
                if (that.curFrame >= that.frames) {
                    that.stop();
                    callback && callback.call(that.Element, that.looped);
                    that.running && that.transfer();
                    return;
                }
                that.curFrame++;
                that.enterFrame.call(that);
            }, 1000 / this.fps);
            return this;
        },

        // 停止动画
        stop: function() {
            //console.log('结束动画！');
            if (this.timer) {
                clearInterval(this.timer);
                // 清除掉timer id
                this.timer = undefined;
            }
            return this;
        },
        //向后一帧
        next: function() {
            this.stop();
            this.curFrame++;
            this.curFrame = this.curFrame > this.frames ? this.frames : this.curFrame;
            this.enterFrame.call(this);
            return this;
        },
        //向前一帧
        prev: function() {
            this.stop();
            this.curFrame--;
            this.curFrame = this.curFrame < 0 ? 0 : this.curFrame;
            this.enterFrame.call(this);
            return this;
        },
        //跳跃到指定帧并播放
        gotoAndPlay: function(sc, frame) {
            this.stop();
            if (typeof frame != 'undefined') {
                this[sc] && this.cut(this[sc]);
                this.curFrame = frame;
            } else {
                this.curFrame = sc;
            }
            this.enterClip.call(this);
            return this;
        },
        //跳到指定帧停止播放
        gotoAndStop: function(sc, frame) {
            this.stop();
            if (typeof frame != 'undefined') {
                this[sc] && this.cut(this[sc]);
                this.curFrame = frame;
            } else {
                this.curFrame = sc;
            }
            this.enterFrame.call(this);
            return this;
        },
        //进入帧动作
        enterFrame: function() {
            //console.log('进入帧：' + this.curFrame)
            var ds, from, to;
            for (var prop in this.mc) {
                from = this.mc[prop]['from'],
                    to = this.curFrame == this.frames ? this.mc[prop]['over'] : this.mc[prop]['to'],
                    tween = this.mc[prop].tween;
                //console.log('from: ' + from)
                if (typeof(from) == 'number' && typeof(to) == 'number') {
                    ds = tween(this.curFrame, from, to - from, this.frames).toFixed(5);
                }
                if (typeof(from) == 'object' && to instanceof Array) {
                    var red = tween(this.curFrame, from[0], to[0] - from[0], this.frames).toFixed(0),
                        green = tween(this.curFrame, from[1], to[1] - from[1], this.frames).toFixed(0),
                        blue = tween(this.curFrame, from[2], to[2] - from[2], this.frames).toFixed(0);
                    alpha = tween(this.curFrame, from[3], to[3] - from[3], this.frames).toFixed(0);
                    if (rgba) {
                        ds = 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
                    } else {
                        ds = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
                    }
                }
                if (typeof(to) == 'string' && /^(\+|-)?\d+%$/.test(to)) {
                    var to = parseFloat(to);
                    if (/^(\+|-)?\d+%$/.test(from)) {
                        var from = parseFloat(from);
                    } else {
                        var parent = /(width|left|right)/i.test(prop) ? parseFloat(_.dom.getStyle(this.Element.parentNode, 'width')) : parseFloat(_.dom.getStyle(this.Element.parentNode, 'height')),
                            from = from / parent * 100;
                    }
                    ds = tween(this.curFrame, from, to - from, this.frames) + '%';
                } else if (typeof(from) == 'string' && /^(\+|-)?\d+%$/.test(from)) {
                    var parent = /(width|left|right)/i.test(prop) ? parseFloat(_.dom.getStyle(this.Element.parentNode, 'width')) : parseFloat(_.dom.getStyle(this.Element.parentNode, 'height')),
                        from = parseFloat(from) * parent / 100,
                        to = to;
                    ds = tween(this.curFrame, from, to - from, this.frames);
                }
                //console.log(prop + ':' + ds);
                _.dom.setStyle(this.Element, prop, ds);
            }
            return this;
        },
        complete: function() {},
        hasNext: function() {}
            //动画结束
    });

    _.extend(_.dom.Animation, {
        tweens: {},
        setTweens: function(tweens) {
            _.each(tweens, function(type, tween) {
                if (typeof tween === 'function') {
                    _.dom.Animation.tweens[type] = tween;
                } else if ((typeof tween === 'string') && _.dom.Animation.tweens[tween]) {
                    _.dom.Animation.tweens[type] = _.dom.Animation.tweens[tween];
                }
            });
        },
        getTween: function(tweenName) {
            if (tweenName && _.dom.Animation.tweens[tweenName]) {
                return _.dom.Animation.tweens[tweenName];
            }
            return function(t, b, c, d) {
                return c * t / d + b;
            }
        }
    });
});