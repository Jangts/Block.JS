/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Fri, 11 May 2018 04:49:05 GMT
 */
;
// tangram.config({});
tangram.init().block([
	'$_/util/bool',
	'$_/dom/Elements'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var view = pandora.ns('view', {});
	var bool = imports['$_/util/bool'];
	var _ = pandora;
	var doc = root.document;
	var location = root.location;
	var $ = pandora.dom.$;
	var Sliders = {};
	var uid = (function () {
		var id = 0;
		return function () {
			return "slider-" + id++;
		};
	})();
	pandora.declareClass('view.Slider', {
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
		_init: function (elem, preset, options) {
			this.Element = bool.isStr(elem) ? pandora.dom.query.byId(elem): elem;
			if (bool.isEl(this.Element)) {
				options = options || {}
				if (bool.isStr(preset) && pandora.view.Slider.presets[preset]) {
					pandora.extend(options, pandora.view.Slider.presets[preset]);
				}
				else if (bool.isObj(preset)) {
					pandora.extend(options, preset);
				}
				else {
					pandora.extend(options, pandora.view.Slider.presets.slide);
				}
				pandora.extend(this, true, options);
				if (this.Element && this.layout) {
					var that = this;
					$(this.Element).addClass(preset);
					this.data && this.bluider && this.bluider();
					this.stages = $('.stage', this.Element).addClass(bool.isArr(this.stageTheme) ? function (i) {
						return that.theme[i];
					} : this.stageTheme);
					this.troupe = $('.troupe', this.Element).get(0);
					this.actors = $('.actor', this.troupe);
					this.panelTheme = this.panelTheme || this.stageTheme;
					this.panel = $('.panel', this.Element).addClass(bool.isArr(this.panelTheme) ? function (i) {
						return that.panelTheme[i];
					} : this.panelTheme);
					this.anchors = $('.slider-anchor', this.Element);
					this.actorsNum = bool.isFn(this.counter) ? this.counter(this.actors.length): this.actors.length;
					this.layout();
					this.bind();
					this.uid = uid();
					this.start && this.start.call(this, n);
					Sliders[this.uid] = this.positive ? this.play(this.curr): this.play(this.actorsNum - 1);
				}
				else {
					_.error('Cannot find Element object or layout method of this Slider!');
				}
			};
		},
		play: function (n) {
			this.stop();
			var that = this;
			n = parseInt(n);
			this.before && this.before.call(this, n);
			this.cut && this.cut(n);
			setTimeout(function () {
				this.after && that.after.call(that, n);
				that.ontouched = false;
			}, this.duration);
			that.anchorStatus();
			if (this.autoplay) {
				if (bool.isFn(this.onprogress)) {
					var speed = this.speed/100;
					this.onprogress(progress = 0);
					this.timer = setInterval(function () {
						that.onprogress(++progress);
						if (progress === 100) {
							that.positive ? that.playNx(): that.playPr();
						};
					}, speed);
				}
				else {
					this.timer = this.autoplay && setTimeout(function () {
						that.positive ? that.playNx(): that.playPr();
					}, this.speed);
				}
			}
			return this;
		},
		playNx: function () {
			this.stop();
			var to = this.curr + 1;
			if (this.loop || to < this.actorsNum) {
				this.play(to);
			}
			return this;
		},
		playPr: function () {
			this.stop();
			var to = this.curr - 1;
			if (this.loop || to >= 0) {
				this.play(to);
			}
			return this;
		},
		stop: function () {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = undefined;
			}
			return this;
		},
		pause: function (pause) {
			this.stop();
			if (pause) {
				this.autoplay = false;
			}
			else {
				this.autoplay = true;
				var that = this;
				this.timer = setTimeout(function () {
					that.positive ? that.playNx(): that.playPr();
				}, this.speed);
			}
			return this;
		},
		bind: function () {
			var that = this;
			this.switchActionType = this.switchActionType == 'hover' ? 'mouseover':'click';
			$(this.Element)
				.on(this.switchActionType, '.cutter.goto-prev', function () {
					that.pause(false).playPr();
					that.pauseOnAction && (that.autoplay = false);
				})
				.on(this.switchActionType, '.cutter.goto-next', function () {
					that.pause(false).playNx();
					that.pauseOnAction && (that.autoplay = false);
				})
				.on(this.switchActionType, '.slider-anchor', function () {
					var index = $(this).data('actorIndex') || 0;
					that.pause(false).play(index);
					that.pauseOnAction && (that.autoplay = false);
				})
				.on('touchstart', '.stage', function (e) {
					if (that.ontouched === false) {
						that.ontouched = true;
						that.ontouchX = e.changedTouches[0].clientX;
						that.ontouchY = e.changedTouches[0].clientY;
					};
				})
				.on('touchend', '.stage', function (e) {
					if (that.ontouched === true) {
						if (directions[that.direction]) {
							directions[that.direction].call(that, e);
						}
					};
				});
			this.pauseOnHover && $(this.Element)
				.bind('mouseover', function () {
					that.pause(true);
				})
				.bind('mouseout', function () {
					that.pause(false);
				});
			this.kbCtrlAble && $(document).bind('keydown', function (e) {
				if (e.which == 37) {
					that.pause(false).playPr();
					that.pauseOnAction && (that.autoplay = false);
				}
				if (e.which == 39) {
					that.pause(false).playNx();
					that.pauseOnAction && (that.autoplay = false);
				};
			});
		},
		adaptive: function () {},
		anchorStatus: function () {
			if (this.anchors && this.anchors.length >= this.actorsNum) {
				var cur = this.curr < this.actorsNum ? this.curr : 0;
				$(this.anchors).removeClass('active');
				$(this.anchors[cur]).addClass('active');
			};
		}
	});
	pandora.extend(pandora.view.Slider, {
		presets: {},
		extend: function () {
			var _arguments = arguments;
			var base = {};
			var presets = {};
			var args = [].slice.call(arguments);
			pandora.each(args, function (_index, preset) {
				if (bool.isStr(preset) && pandora.view.Slider.presets[preset]) {
					_.extend(base, pandora.view.Slider.presets[preset]);
				}
				else if (bool.isObj(preset) && bool.isStr(preset.name)) {
					presets[preset.name] = preset;
				};
			}, this);
			pandora.each(presets, function (name, preset) {
				pandora.view.Slider.presets[name] = _.extend( {}, base, preset);
			}, this);
		}
	});
	pandora.view.Slider.extend({
		name: 'slide',
		easing: "linear",
		bluider: function () {},
		layout: function () {
			var power = (this.actorsNum % 2) == 0 ? this.actorsNum : this.actorsNum + 1;
			var widthTroupe = 100 * power;
			var widthAactor = 100/power;
			this.troupe.style.width = widthTroupe + '%';
			this.troupe.style.height = '100%';
			this.troupe.style.top = 0;
			this.troupe.style.left = 0;
			$(this.actors).each(function (i) {
				this.setAttribute('data-actor-index', i);
				this.style.width = widthAactor + '%';
				this.style.height = '100%';
			});
			if (this.renderPanel) {
				$('.panel', this.Element).each(function () {
					$('.slider-anchor', this).each(function (i) {
						this.setAttribute('data-actor-index', i);
					});
				});
			};
		},
		correcter: function (to) {
			to = (to < this.actorsNum) ? to : 0;
			to = (to >= 0) ? to : this.actorsNum - 1;
			return to;
		},
		cut: function (n) {
			var to = this.correcter(n);
			var position = to *  -100;
			$(this.troupe).stop(true, true).animate({left: position + '%'}, this.duration, this.easing);
			this.curr = to;
		}
	});
	pandora.view.Slider.extend({
		name: 'fade',
		layout: function () {
			var rank = this.rank(this.actorsNum);
			$(this.actors).each(function (i) {
				this.setAttribute('data-actor-index', rank[i]);
				this.style.position = 'absolute';
				this.style.width = '100%';
				this.style.top = 0;
				this.style.left = 0;
				this.style.opacity = i ? 0 : 1;
				this.style.zIndex = i ? 0 : 100;
			});
		},
		rank: function (num) {
			var rank = [];
			for (var i = 0;i < num;i++) {
				rank.push(i);
			}
			return rank;
		},
		correcter: function (to) {
			to = to < this.actorsNum ? to : 0;
			to = to >  -1 ? to : this.actorsNum - 1;
			return to;
		},
		cut: function (n) {
			var inner = this.troupe;
			var from = this.curr;
			var to = this.correcter(n);
			if (from != to) {
				$(this.troupe).find('[data-actor-index=' + to + ']').css('opacity', 1).hide().css('z-index', 200).stop(true, true).fadeIn(800, 'easeInOutQuart', function () {
					$(inner).find('[data-actor-index=' + from + ']').css('z-index', 0).css('opacity', 0);
					$(this).css('z-index', 100);
				});
			}
			this.curr = to;
		}
	});
	this.module.exports = pandora.view.Slider;
});
//# sourceMappingURL=Slider.js.map