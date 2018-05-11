/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Fri, 11 May 2018 08:35:09 GMT
 */
;
// tangram.config({});
tangram.init().block([
	'$_/util/bool',
	'$_/util/Color',
	'$_/dom/'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var dom = pandora.ns('dom', {});
	var _ = pandora;
	var doc = root.document;
	var rgba = (function () {
		var div = doc.createElement('div');
		div.style.backgroundColor = "rgb(0,0,0)";
		div.style.backgroundColor = "rgba(0,0,0,0)";
		var backgroundColor = div.style.backgroundColor;
		return (/^rgba\([0-9,\.\s]+\)$/.test(backgroundColor));
	})();
	pandora.declareClass('dom.Animation', pandora.Iterator,{
		fps: 36,
		loop: 1,
		timer: undefined,
		data: undefined,
		_init: function (elem, options) {
			this.Element = elem;
			this.curScene = 0;
			this.curFrame = 0;
			this.playback = true;
			this.running = false;
			this.looped = 0;
			options && this.push(options);
		},
		tween: function (t, b, c, d) {
			return c * t/d + b;
		},
		cut: function (options) {
			this.duration = options.duration || 1000;
			this.tween = typeof(options.tween) == 'function' ? options.tween : this.tween;
			this.mc = {};
			for (var i in options.to) {
				this.mc[i] = {
					from: options.from && typeof(options.from[i]) != 'undefined' ? this.rgbFormat(options.from[i]): this.rgbFormat(pandora.dom.getStyle(this.Element, i)),
					to: this.rgbFormat(options.to[i]),
					over: options.over && options.over[i] ? this.rgbFormat(options.over[i]): this.rgbFormat(options.to[i]),
					tween: options.tween && options.tween[i] ? options.tween[i]: this.tween
				};
			}
			this.frames = Math.ceil(this.duration * this.fps/1000);
			return this;
		},
		rgbFormat: function (value) {
			var arr = _.util.Color.toArray(value);
			if (arr) {
				return arr;
			}
			if (/^(\+|-)?\d+%$/.test(value)) {
				return value;
			}
			return parseFloat(value);
		},
		play: function (loop, callback) {
			if (this.playback && this.length > 0) {
				this.playback = false;
				this.running = true;
				loop = loop || this.loop || 1;
				this.curScene = 0;
				if (this.looped < loop || loop ==  -1) {
					this.transfer(this);
				}
				else {
					this.looped = 0;
					callback = callback || this.callback || null;
					callback && callback.call(this.Element, this.data);
					this.length = 0;
					this.curScene = 0;
					this.playback = true;
				}
			};
		},
		transfer: function (that) {
			if (this.curScene < this.length) {
				this.gotoAndPlay(this.curScene, 0);
				this.curScene++;
			}
			else {
				this.looped++;
				this.playback = true;
				this.play();
			};
		},
		enterClip: function (callback) {
			var that = this;
			callback = callback || this[this.curScene] && this[this.curScene].callback || null;
			this.timer && this.stop();
			this.timer = setInterval(function () {
				if (that.curFrame >= that.frames) {
					that.stop();
					callback && callback.call(that.Element, that.looped);
					that.running && that.transfer();
					return;;
				}
				that.curFrame++;
				that.enterFrame.call(that);
			}, 1000/this.fps);
			return this;
		},
		stop: function () {
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = undefined;
			}
			return this;
		},
		next: function () {
			this.stop();
			this.curFrame++;
			this.curFrame = this.curFrame > this.frames ? this.frames : this.curFrame;
			this.enterFrame.call(this);
			return this;
		},
		prev: function () {
			this.stop();
			this.curFrame--;
			this.curFrame = this.curFrame < 0 ? 0 : this.curFrame;
			this.enterFrame.call(this);
			return this;
		},
		gotoAndPlay: function (sc, frame) {
			this.stop();
			if (typeof frame != 'undefined') {
				this[sc] && this.cut(this[sc]);
				this.curFrame = frame;
			}
			else {
				this.curFrame = sc;
			}
			this.enterClip.call(this);
			return this;
		},
		gotoAndStop: function (sc, frame) {
			this.stop();
			if (typeof frame != 'undefined') {
				this[sc] && this.cut(this[sc]);
				this.curFrame = frame;
			}
			else {
				this.curFrame = sc;
			}
			this.enterFrame.call(this);
			return this;
		},
		enterFrame: function () {
			var ds = void 0;
			var from = void 0;
			var to = void 0;
			for (var prop in this.mc) {
				from = this.mc[prop]['from']
				to = this.curFrame == this.frames ? this.mc[prop]['over']: this.mc[prop]['to']
				tween = this.mc[prop].tween;
				if (typeof(from) == 'number' && typeof(to) == 'number') {
					ds = tween(this.curFrame, from, to - from, this.frames).toFixed(5);
				}
				else if (typeof(from) == 'object' && to instanceof Array) {
					var red = tween(this.curFrame, from[0], to[0] - from[0], this.frames).toFixed(0);
					var green = tween(this.curFrame, from[1], to[1] - from[1], this.frames).toFixed(0);
					var blue = tween(this.curFrame, from[2], to[2] - from[2], this.frames).toFixed(0);
					alpha = tween(this.curFrame, from[3], to[3] - from[3], this.frames).toFixed(0);
					if (rgba) {
						ds = 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
					}
					else {
						ds = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
					}
				}
				else if (typeof(to) === 'string' && /^(\+|-)?\d+%$/.test(to)) {
					var to = parseFloat(to);
					if (/^(\+|-)?\d+%$/.test(from)) {
						var from = parseFloat(from);
					}
					else {
						var parent = /(width|left|right)/i.test(prop) ? parseFloat(pandora.dom.getStyle(this.Element.parentNode, 'width')):parseFloat(pandora.dom.getStyle(this.Element.parentNode, 'height'));
						var from = from/parent * 100;
					}
					ds = tween(this.curFrame, from, to - from, this.frames) + '%';
				}
				else if (typeof(from) === 'string' && /^(\+|-)?\d+%$/.test(from)) {
					var parent = /(width|left|right)/i.test(prop) ? parseFloat(pandora.dom.getStyle(this.Element.parentNode, 'width')):parseFloat(pandora.dom.getStyle(this.Element.parentNode, 'height'));
					var from = parseFloat(from) * parent/100;
					var to = to;
					ds = tween(this.curFrame, from, to - from, this.frames);
				};
				pandora.dom.setStyle(this.Element, prop, ds);
			}
			return this;
		},
		complete: function () {},
		hasNext: function () {}
	});
	pandora.extend(pandora.dom.Animation, {
		tweens: {},
		setTweens: function (tweens) {
			_.each(tweens, function (type, tween) {
				if (typeof tween === 'function') {
					pandora.dom.Animation.tweens[type] = tween;
				}
				else if ((typeof tween === 'string') && pandora.dom.Animation.tweens[tween]) {
					pandora.dom.Animation.tweens[type] = pandora.dom.Animation.tweens[tween];
				};
			});
		},
		getTween: function (tweenName) {
			if (tweenName && pandora.dom.Animation.tweens[tweenName]) {
				return pandora.dom.Animation.tweens[tweenName];
			}
			return function (t, b, c, d) {
				return c * t/d + b;
			};
		}
	});
	var animator = pandora.dom.animator = function (elem, options) {
		if (elem) {
			var elemStorage = pandora.storage.get(pandora.dom.cache(elem));
			if (elemStorage.Animation) {
				var Animation = elemStorage.Animation;
			}
			else {
				var Animation = new pandora.dom.Animation(elem);
				elemStorage.Animation = Animation;
			}
			if (options) {
				var last = options.duration || 5000;
				Animation.loop = options.loop || 1;
				Animation.callback = options.callback || null;
				Animation.data = options.data || null;
				if (options.keyframes) {
					var h = 0;
					for (var i in options.keyframes) {
						if (i > 0 && i <= 100) {
							var from = options.keyframes[h] || null;
							var to = options.keyframes[i];
							var duration = (i - h)/100 * last;
							var callback = (options.callbacks && options.callbacks[i]) ? options.callbacks[i]: null;
							var tween = options.tween ? pandora.dom.Animation.getTween(options.tween): null;
							Animation.push({
								duration: duration,
								from: from,
								to: to,
								over: to,
								callback: callback,
								tween: tween
							});
						}
						h = i;
					}
				}
				options.autoplay && Animation.play();
			}
		}
		return Animation;
	}
	pandora.ns('dom.animator', {
		play: function (elem, style, duration, easing, callback) {
			var Animation = animator(elem);
			Animation.push({
				to: style,
				over: style,
				duration: duration,
				tween: pandora.dom.Animation.getTween(easing),
				callback: callback
			});
			Animation.play(1);
		},
		stop: function (elem, stopAll, goToEnd) {
			var Animation = animator(elem);
			if (stopAll && goToEnd) {
				Animation.stop();
				var sc = Animation.length - 1;
				if (sc >= 0) {
					Animation.gotoAndStop(sc, 0);
					var fs = Animation.frames;
					Animation.gotoAndStop(sc, fs);
					Animation.playback = true;
				}
				Animation.length = 0;
				Animation.curScene = 0;
			}
			else if (stopAll) {
				Animation.stop();
				Animation.length = 0;
				Animation.curScene = 0;
				Animation.playback = true;
			}
			else {
				Animation.stop();
				var scm = Animation.length - 1;
				var scn = Animation.curScene + 1;
				if (scn <= scm) {
					Animation.gotoAndPlay(scn, 0);
				}
				else {
					Animation.length = 0;
					Animation.curScene = 0;
					Animation.playback = true;
				}
			};
		},
		remove: function (elem, sceneNumber) {
			if (elem && elem.YangramKey && pandora.storage.set(elem.YangramKey).Animation) {};
		}
	});
	module.exports = {
		Animation: pandora.dom.Animation,
		animation: pandora.dom.animation
	};
});
//# sourceMappingURL=Animation.js.map