/*!
 * tangram.js framework source code
 *
 * http://www.yangram.net/tangram.js/
 *
 * Date: 2017-04-06
 */

/**
{
	preset: "slide",				// String: ["slide"|"slide-vert"|"seamless"|"seamless-vert"|"colx3"|"colx3-vert"|"fade"]，动画效果
	data: {},						// Object: 需要渲染的数据

	easing: "easeInOutQuart",		// String: 滚动动画计时函数
	switchActionType : 'click',			// String: 滚动动画计时函数
	direction : 'left',				// String: 滚动动画计时函数
	positive : true,				// Boolean: 正向运动

	loop: true,						// Boolean: 是否循环播放
	autoplay : true,				// Boolean: 是否自动播放
	curr: 0,						// Integer: 开始播放的 slide，从 0 开始计数

	speed: 5000,					// Integer: ms 滚动间隔时间
	duration: 600,					// Integer: ms 动画滚动速度

	// Usability features
	pauseOnAction: true,            // Boolean: 用户操作时停止自动播放
	pauseOnHover: false,            // Boolean: 悬停时暂停自动播放
	kbCtrlAble: true,					// Boolean: 是否开启键盘左（←）右（→）控制
	touch: true,                    // Boolean: 允许触摸屏触摸滑动滑块

	// Callback API
	start: function(n){},            // Callback: function(slider) - 初始化完成的回调
	before: function(n){},           // Callback: function(slider) - 每次滚动开始前的回调
	after: function(n){},            // Callback: function(slider) - 每次滚动完成后的回调
}
 */
;
tangram.block([
    '$_/util/bool.xtd',
    '$_/dom/Elements/animation.clsx'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        location = global.location,
        $ = _.dom.select;

    var Sliders = {},
        uid = (function() {
            var id = 0;
            return function() {
                return "slider-" + id++;
            };
        })(),
        directions = {
            top: function(e) {
                if (e.changedTouches[0].clientY > this.ontouchY) {
                    this.pause(false).playPr();
                } else if (e.changedTouches[0].clientY < this.ontouchY) {
                    this.pause(false).playNx();
                }
                this.pauseOnAction && (this.autoplay = false);
            },
            right: function(e) {
                if (e.changedTouches[0].clientX < this.ontouchX) {
                    this.pause(false).playPr();
                } else if (e.changedTouches[0].clientX > this.ontouchX) {
                    this.pause(false).playNx();
                }
                this.pauseOnAction && (this.autoplay = false);
            },
            bottom: function(e) {
                if (e.changedTouches[0].clientY < this.ontouchY) {
                    this.pause(false).playPr();
                } else if (e.changedTouches[0].clientY > this.ontouchY) {
                    this.pause(false).playNx();
                }
                this.pauseOnAction && (this.autoplay = false);
            },
            left: function(e) {
                if (e.changedTouches[0].clientX > this.ontouchX) {
                    this.pause(false).playPr();
                } else if (e.changedTouches[0].clientX < this.ontouchX) {
                    this.pause(false).playNx();
                }
                this.pauseOnAction && (this.autoplay = false);
            },
        };

    declare('see.Slider', {
        _init: function(elem, preset, settings) {
            this.Element = _.util.bool.isStr(elem) ? _.dom.query.byId(elem) : elem;
            if (_.util.bool.isEl(this.Element)) {
                settings = settings || {};
                if (_.util.bool.isStr(preset) && _.see.Slider.presets[preset]) {
                    _.extend(settings, _.see.Slider.presets[preset]);
                } else if (_.util.bool.isObj(preset)) {
                    _.extend(settings, preset);
                } else {
                    _.extend(settings, _.see.Slider.presets.slide);
                }
                _.extend(this, true, settings);
                if (this.Element && this.layout) {
                    var that = this;
                    $(this.Element).addClass(preset);
                    this.data && this.bluider && this.bluider();
                    this.stages = $('.stage', this.Element).addClass(_.util.bool.isArr(this.stageTheme) ? function(i) {
                        return that.theme[i];
                    } : this.stageTheme);
                    this.troupe = $('.troupe', this.Element).get(0);
                    this.actors = $('.actor', this.troupe);
                    this.panelTheme = this.panelTheme || this.stageTheme;
                    this.panel = $('.panel', this.Element).addClass(_.util.bool.isArr(this.panelTheme) ? function(i) {
                        return that.panelTheme[i];
                    } : this.panelTheme);
                    this.anchors = $('.slider-anchor', this.Element);
                    this.actorsNum = _.util.bool.isFn(this.counter) ? this.counter(this.actors.length) : this.actors.length;
                    this.layout();
                    this.bind();
                    this.uid = uid();
                    this.start && this.start.call(this, n);
                    Sliders[this.uid] = this.positive ? this.play(this.curr) : this.play(this.actorsNum - 1);
                } else {
                    _.error('Cannot find Element object or layout method of this Slider!');
                }
            }
        },
        data: null,
        theme: 'default',
        actorsType: 'image',
        speed: 5000,
        duration: 600,
        renderPanel: false,
        switchActionType: 'click',
        kbCtrlAble: false,
        direction: 'left',
        positive: true,
        curr: 0,
        autoplay: true,
        loop: true,
        pauseOnHover: true,
        actorsNum: 0,
        ontouched: false,
        play: function(n) {
            this.stop();
            var that = this;
            n = parseInt(n);
            this.before && this.before.call(this, n);
            this.cut && this.cut(n);
            setTimeout(function() {
                this.after && that.after.call(that, n);
                that.ontouched = false;
            }, this.duration);
            that.anchorStatus();
            if (this.autoplay) {
                if (_.util.bool.isFn(this.onprogress)) {
                    var speed = this.speed / 100;
                    this.onprogress(progress = 0);
                    this.timer = setInterval(function() {
                        that.onprogress(++progress);
                        if (progress === 100) {
                            that.positive ? that.playNx() : that.playPr();
                        }
                    }, speed);
                } else {
                    this.timer = this.autoplay && setTimeout(function() {
                        that.positive ? that.playNx() : that.playPr();
                    }, this.speed);
                }

            };
            return this;
        },
        playNx: function() {
            this.stop();
            var to = this.curr + 1;
            if (this.loop || to < this.actorsNum) {
                this.play(to);
            }
            return this;
        },
        playPr: function() {
            this.stop();
            var to = this.curr - 1;
            if (this.loop || to >= 0) {
                this.play(to);
            }
            return this;
        },
        stop: function() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = undefined;
            };
            return this;
        },
        pause: function(pause) {
            this.stop();
            if (pause) {
                this.autoplay = false;
            } else {
                this.autoplay = true;
                var that = this;
                this.timer = setTimeout(function() {
                    that.positive ? that.playNx() : that.playPr();
                }, this.speed)
            }
            return this;
        },
        bind: function() {
            var that = this;
            this.switchActionType = this.switchActionType == 'hover' ? 'mouseover' : 'click';
            $(this.Element)
                .on(this.switchActionType, '.cutter.goto-prev', function() {
                    that.pause(false).playPr();
                    that.pauseOnAction && (that.autoplay = false);
                })
                .on(this.switchActionType, '.cutter.goto-next', function() {
                    that.pause(false).playNx();
                    that.pauseOnAction && (that.autoplay = false);
                })
                .on(this.switchActionType, '.slider-anchor', function() {
                    var index = $(this).data('actorIndex') || 0;
                    that.pause(false).play(index);
                    that.pauseOnAction && (that.autoplay = false);
                })
                .on('touchstart', '.stage', function(e) {
                    if (that.ontouched === false) {
                        that.ontouched = true;
                        that.ontouchX = e.changedTouches[0].clientX;
                        that.ontouchY = e.changedTouches[0].clientY;
                        //console.log(e.changedTouches);
                    }
                })
                .on('touchend', '.stage', function(e) {
                    if (that.ontouched === true) {
                        if (directions[that.direction]) {
                            directions[that.direction].call(that, e);
                        }
                    }
                });
            this.pauseOnHover && $(this.Element)
                .bind('mouseover', function() {
                    that.pause(true);
                })
                .bind('mouseout', function() {
                    that.pause(false);
                });
            this.kbCtrlAble && $(document).bind('keydown', function(e) {
                //console.log(e.which);
                if (e.which == 37) {
                    that.pause(false).playPr();
                    that.pauseOnAction && (that.autoplay = false);
                }
                if (e.which == 39) {
                    that.pause(false).playNx();
                    that.pauseOnAction && (that.autoplay = false);
                }
            });
        },
        adaptive: function() {},
        anchorStatus: function() {
            if (this.anchors && this.anchors.length >= this.actorsNum) {
                var cur = this.curr < this.actorsNum ? this.curr : 0;
                $(this.anchors).removeClass('active');
                $(this.anchors[cur]).addClass('active');
            }
        }
    });

    _.extend(_.see.Slider, {
        presets: {},
        extend: function() {
            var base = {}
            var presets = {};
            var args = [].slice.call(arguments);
            _.each(args, function() {
                if (_.util.bool.isStr(this) && _.see.Slider.presets[this]) {
                    _.extend(base, _.see.Slider.presets[this])
                } else if (_.util.bool.isObj(this) && _.util.bool.isStr(this.name)) {
                    presets[this.name] = this;
                }
            });
            _.each(presets, function(name, preset) {
                _.see.Slider.presets[name] = _.extend({}, base, preset);
            });
        }
    });
});