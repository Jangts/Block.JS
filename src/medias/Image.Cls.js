/*!
 * Block.JS Framework Source Code
 *
 * class medias.Image
 *
 * Date: 2017-04-06
 */
;
block([
    '$_/util/bool.xtd',
    '$_/data/XHR.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        Image = global.Image,
        console = global.console;

    var isStr = _.util.bool.isStr,
        isObj = _.util.bool.isObj,
        isFn = _.util.bool.isFn,
        isEl = _.util.bool.isEl,
        load = function(img, src, doneCallback, failCallback) {
            img.src = src;
            img.onload = doneCallback;
            img.onerror = failCallback;
        };

    declare('medias.Image', {
        _init: function(option) {
            var that = this;
            if (isStr(option)) {
                var callback = function() {
                    if (isEl(that.context)) {
                        that.context.appendChild(that.image);
                    }
                }
                this.src = option;
                this.preview = null;
                this.onload = callback;
                this.onerror = callback;
            } else if (isObj(option)) {
                this.src = option.src;
                this.previewsrc = option.preview;
                var doneCallback = function() {
                        if (isEl(that.context)) {
                            that.context.appendChild(that.image);
                            isFn(option.onload) && option.onload.call(this, that)
                        }
                    },
                    failCallback = function() {
                        if (isEl(that.context)) {
                            that.context.appendChild(that.image);
                            isFn(option.onerror) && option.onerror.call(this, that)
                        }
                    };
                this.onload = doneCallback;
                this.onerror = failCallback;
            } else {
                return;
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
            }
        },
        preview: function() {
            var that = this,
                onload = function() {
                    that.context.appendChild(that.image);
                    load(that.image, that.src, function() {
                        that.previewsrc = null;
                        that.onload.call(this);
                    }, function() {
                        that.image.src = that.previewsrc;
                        that.onerror.call(this);
                    });
                },
                onerror = function() {
                    load(that.image, that.src, that.onload, that.onerror);
                };
            load(this.image, this.previewsrc, onload, onerror);
        },
        appendTo: function(context) {
            if (isEl(context)) {
                this.context = context;
                if (this.previewsrc) {
                    this.preview();
                } else {
                    load(this.image, this.src, this.onload, this.onerror);
                }
            }
        },
        toString: function() {
            var div = document.createElement('div');
            div.appendChild(this.image);
            var html = div.innerHTML;
            div = null;
            delete div;
            return html;
        },
        toBase: function(callback, mime) {
            var img = this.image,
                canvas = document.createElement('CANVAS'),
                ctx = canvas.getctx('2d');
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL(mime || 'image/png');
                callback.call(this, dataURL);
                canvas = null;
            };
            img.src = this.src;
        }
    });
});