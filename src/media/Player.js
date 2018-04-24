/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Tue, 24 Apr 2018 15:55:03 GMT
 */
;
// tangram.config({});
tangram.block([
	'$_/dom/Events'
], function (pandora, global, imports, undefined) {
	var _ = pandora;
	var doc = global.document;
	var console = global.console;
	pandora.declareClass('media.Player', {
		type: 'AUDIO',
		protectTime: 100,
		lastActionTime: Date.now(),
		_init: function (elem, sheet) {
			if(_.util.bool.isEl(elem) && _.uitl.bool.inArr(elem.tagName, ['AUDIO', 'VIDEO'])) {
				this.Element = elem;
				this.type = this.Element.tagName;
			}else {
				this.Element = new Audio;
				this.type = 'AUDIO';
				sheet = elem;
			}
			this.sheet = {};
			this.register(sheet);
		},
		setSource: function (sources) {
			if(sources && (typeofsources === 'object')) {
				var that = this;
				for (var i in sources) {
					if(this.canPlay(i) == 'maybe') {
						try {
							that.Element.src = sources[i];
						}
						catch (e) {
							this.stop(function () {
								that.Element.src = sources[i];
							});
						}
						break;
					};
				};
			}
			return this;
		},
		register: function (sheet, sources) {
			if(sheet && (typeofsheet === 'object')) {
				for (var code in sheet) {
					if(sheet[code] && (typeofsheet[code] === 'object')) {
						this.sheet[code] = sheet[code];
					};
				};
			}else if(sheet && sources && (typeofsheet === 'string') && (typeofsources === 'object')) {
				this.sheet[code] = sheet[code];
			}
			return this;
		},
		clear: function (sheet, sources) {
			this.sheet = [];
		},
		play: function (code) {
			if (code && this.sheet[code]) {
				this.setSource(this.sheet[code]);
			}
			var that = this;
			var duration = Date.now() - this.lastActionTime;
			if (duration > this.protectTime) {
				this.Element.play();
				this.lastActionTime = Date.now();
			}else {
				this.timer && clearTimeout(this.timer);
				this.timer = setTimeout(function () {
					that.Element.play();
					that.lastActionTime = Date.now();
				}, this.protectTime - duration);
			}
			return this;
		},
		canPlay: function (mime) {
			return this.Element.canPlayType(mime);
		},
		pause: function (onpause) {
			var that = this;
			var duration = Date.now() - this.lastActionTime;
			if (duration > this.protectTime) {
				this.Element.pause();
				this.lastActionTime = Date.now();
				_.util.bool.isFn(onpause) && onpause.call(this);
			}else {
				this.timer && clearTimeout(this.timer);
				this.timer = setTimeout(function () {
					that.Element.pause();
					that.lastActionTime = Date.now();
					_.util.bool.isFn(onpause) && onpause.call(this);
				}, this.protectTime - duration);
			}
			return this;
		},
		stop: function (onstop) {
			this.pause(function () {
				this.Element.currentTime = 0;
				_.util.bool.isFn(onstop) && onstop.call(this);
			});
			return this;
		},
		volume: function (vol) {
			switch(typeof vol) {
				case 'string': if (vol == 'up') {
					var volume = this.Element.volume + 0.1;
					if (volume >= 1) {
						volume = 1;
					}
					this.Element.volume = volume;
				}else
				if (vol == 'down') {
					var volume = this.Element.volume - 0.1;
					if (volume <= 0) {
						volume = 0;
					}
					this.Element.volume = volume;
				}
				break;
				case 'number': if (vol >= 0 && vol <= 1) {
					this.Element.volume = vol;
				}
				break;
			};
		}
	});
	return _.media.Player;
});