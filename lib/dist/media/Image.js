/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Fri, 11 May 2018 04:49:03 GMT
 */
;
// tangram.config({});
tangram.init().block([
	'$_/util/bool',
	'$_/async/Request'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var _ = pandora;
	var doc = root.document;
	var Image = root.Image;
	var console = root.console;
	var isStr = _.util.bool.isStr;
	var isObj = _.util.bool.isObj;
	var isFn = _.util.bool.isFn;
	var isEl = _.util.bool.isEl;
	var load = function (img, src, doneCallback, failCallback) {
		img.src = src;
		img.onload = doneCallback;
		img.onerror = failCallback;
	}
	pandora.declareClass('media.Image', {
		_init: function (option) {
			var that = this;
			if (isStr(option)) {
				var callback = function () {
					if (isEl(that.context)) {
						that.context.appendChild(that.image);
					};
				}
				this.src = option;
				this.preview = null;
				this.onload = callback;
				this.onerror = callback;
			}
			else if (isObj(option)) {
				this.src = option.src;
				this.previewsrc = option.preview;
				var doneCallback = function () {
					if (isEl(that.context)) {
						that.context.appendChild(that.image);
						isFn(option.onload) && option.onload.call(this, that);
					};
				}
				var failCallback = function () {
					if (isEl(that.context)) {
						that.context.appendChild(that.image);
						isFn(option.onerror) && option.onerror.call(this, that);
					};
				}
				this.onload = doneCallback;
				this.onerror = failCallback;
			}
			else {
				return;;
			}
			this.image = new Image();
			if (option.width) {
				this.image.width = option.width;
			}
			if (option.height) {
				this.image.height = option.height;
			}
			if (option.context) {
				this.appendTo(option.context);
			};
		},
		preview: function () {
			var that = this;
			var onload = function () {
				that.context.appendChild(that.image);
				load(that.image, that.src, function () {
					that.previewsrc = null;
					that.onload.call(this);
				}, function () {
					that.image.src = that.previewsrc;
					that.onerror.call(this);
				});
			}
			var onerror = function () {
				load(that.image, that.src, that.onload, that.onerror);
			}
			load(this.image, this.previewsrc, onload, onerror);
		},
		appendTo: function (context) {
			if (isEl(context)) {
				this.context = context;
				if (this.previewsrc) {
					this.preview();
				}
				else {
					load(this.image, this.src, this.onload, this.onerror);
				}
			};
		},
		toString: function () {
			var div = doc.createElement('div');
			div.appendChild(this.image);
			var html = div.innerHTML;
			div = null;
			delete div;
			return html;
		},
		toBase: function (callback, mime) {
			var img = this.image;
			var canvas = doc.createElement('CANVAS');
			var ctx = canvas.getctx('2d');
			img.crossOrigin = 'Anonymous';
			img.onload = function () {
				canvas.height = img.height;
				canvas.width = img.width;
				ctx.drawImage(img, 0, 0);
				var dataURL = canvas.toDataURL(mime || 'image/png');
				callback.call(this, dataURL);
				canvas = null;
			}
			img.src = this.src;
		}
	});
	this.module.exports = _.media.Image;
});
//# sourceMappingURL=Image.js.map