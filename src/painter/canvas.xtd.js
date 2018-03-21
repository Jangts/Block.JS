/*!
 * tangram.js framework source code
 * Date: 2015-09-04
 */

tangram.block('$_/util/bool.xtd', function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console,
        location = global.location;

    var getBeveling = function(x, y) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }

    _('painter.canvas', {
        clear: function(ctx, width, height) {
            ctx.clearRect(0, 0, width, height);
        },
        fontString: function(pixelSize, fontStyle, fontFamily) {
            return fontStyle + " " + pixelSize + "px " + fontFamily;
        },
        longestText: function(ctx, font, arrayOfStrings) {
            ctx.font = font;
            var longest = 0;
            _.each(arrayOfStrings, function(index, string) {
                var textWidth = ctx.measureText(string).width;
                longest = (textWidth > longest) ? textWidth : longest;
            });
            return longest;
        },
        drawRoundedRectangle: function(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        },
        drawDashLine: function(ctx, x1, y1, x2, y2, dashLen) {
            dashLen = dashLen === undefined ? 5 : dashLen;
            //得到斜边的总长度  
            var beveling = getBeveling(x2 - x1, y2 - y1);
            //计算有多少个线段  
            var num = Math.floor(beveling / dashLen);

            for (var i = 0; i < num; i++) {
                ctx[i % 2 == 0 ? 'moveTo' : 'lineTo'](x1 + (x2 - x1) / num * i, y1 + (y2 - y1) / num * i);
            }
            ctx.stroke();
        },
        urlToBase64: function(url, callback, mime) {
            var canvas = document.createElement('CANVAS'),
                ctx = canvas.getctx('2d'),
                img = new Image;
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL(mime || 'image/png');
                callback.call(this, dataURL);
                canvas = null;
            };
            img.src = url;
        },
        fileToBlob: function(file) {
            return global.URL.createObjectURL(file);
        },
        fileToBase64: function(file, callback) {
            var reader = new FileReader();
            reader.onload = function(e) {
                Base64URL = reader.result;
                _.util.bool.isFn(callback) && callback.call(reader, Base64URL);
            };
            reader.readAsDataURL(file);
            return 0;
        }
    });
});