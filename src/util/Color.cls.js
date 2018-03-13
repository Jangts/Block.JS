/*!
 * tangram.js framework source code
 *
 * class util.Color
 *
 * Date 2017-04-06
 */
;
tangram.block(['$_/util/colors.xtd'], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var names = _.util.colors,

        hsb2HSL = function(h, s, b) {
            s /= 100, b /= 100;
            var _s, l;
            if (s === 0 && b === 1) {
                return [h, 100, 100];
            }
            if (b === 0) {
                return [h, s * 100, 0];
            }
            l = (2 - s) * b / 2;
            _s = (s * b) / (1 - Math.abs(l * 2 - 1));
            //console.log(h, _s, l);
            return [h, _s * 100, l * 100];
        },
        hue2rgb = function(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        },
        hsl2BaseRGB = function(h, s, l) {
            h /= 360, s /= 100, l /= 100;
            var r, g, b;

            if (s == 0) {
                r = g = b = l; // achromatic
            } else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return [r, g, b];
        },
        hsl2RGB = function(h, s, l) {
            var base = hsl2BaseRGB(h, s, l);

            return [Math.round(base[0] * 255), Math.round(base[1] * 255), Math.round(base[2] * 255)];
        },
        hsl2SafeRGB = function(h, s, l) {
            var base = hsl2BaseRGB(h, s, l);
            return [
                Math.round(base[0] * 10) * 25.5,
                Math.round(base[1] * 10) * 25.5,
                Math.round(base[2] * 10) * 25.5
            ];
        },

        hsl2HSB = function(h, s, l) {
            s /= 100, l /= 100;
            var _s, b;
            if (l === 0) {
                return [h, s * 100, 0];
            }
            b = ((1 - Math.abs(l * 2 - 1)) * s + l * 2) / 2;
            _s = (b - l) * 2 / b
            return [h, s, b];
        },

        rgb2HSB = function(r, g, b) {
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            var h, s, b = max;

            if (max == min) {
                h = s = 0; // achromatic
            } else {
                var d = max - min;
                s = d / b;
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }
            return [h, s, b];
        },

        rgb2HSL = function(r, g, b) {
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;

            if (max == min) {
                h = s = 0; // achromatic
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }
            return [h, s, l];
        },

        hex = function(num) {
            var hex;
            num = (num >= 0 && num <= 255) ? num : 0;
            hex = num.toString(16);
            return hex.length === 2 ? hex : '0' + hex;
        },

        convs = {
            rgb: function(arr) {
                return 'rgb(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ')';
            },
            rgba: function(arr) {
                return 'rgb(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ',' + arr[3] + ')';
            },
            hex6: function(arr) {
                return '#' + hex(arr[0]) + hex(arr[1]) + hex(arr[2]);
            },
            hex8: function(arr) {
                return '#' + hex(arr[0]) + hex(arr[1]) + hex(arr[2]) + hex(arr[3] * 255);
            },
            hsl: function(rgb) {
                var arr = rgb2HSL(rgb[0], rgb[1], rgb[2]);
                return 'hsl(' + arr[0] + ',' + arr[1] + '%,' + arr[2] + '%)';
            },
            name: function(arr) {
                var hex6 = '#' + hex(arr[0]) + hex(arr[1]) + hex(arr[2]),
                    name;
                _.loop(names, function(n, v) {
                    if (v === hex6) {
                        name = n;
                        _.loop.out();
                    }
                });
                return name;
            },
        },

        toArray = function(value) {
            if (/^#[A-Za-z0-9]{3}$/.test(value)) {
                value = value.replace(/#/, "");
                var arr = [];
                arr[0] = parseInt(value.substr(0, 1) + value.substr(0, 1), 16);
                arr[1] = parseInt(value.substr(1, 1) + value.substr(1, 1), 16);
                arr[2] = parseInt(value.substr(2, 1) + value.substr(2, 1), 16);
                arr[3] = 1;
                return arr;
            }
            if (/^#[A-Za-z0-9]{6}$/.test(value)) {
                value = value.replace(/#/, "");
                var arr = [];
                arr[0] = parseInt(value.substr(0, 2), 16);
                arr[1] = parseInt(value.substr(2, 2), 16);
                arr[2] = parseInt(value.substr(4, 2), 16);
                arr[3] = parseInt(1);
                return arr;
            }
            if (/^#[A-Za-z0-9]{8}$/.test(value)) {
                value = value.replace(/#/, "");
                var arr = [];
                arr[0] = parseInt(value.substr(2, 2), 16);
                arr[1] = parseInt(value.substr(4, 2), 16);
                arr[2] = parseInt(value.substr(6, 2), 16);
                arr[3] = parseInt(value.substr(0, 2), 16) / 255;
                return arr;
            }
            if (/^rgb\([0-9,\.\s]+\)$/.test(value)) {
                var arr = value.replace(/(rgb\(|\))/gi, "").split(/,\s*/);
                arr[0] = parseInt(arr[0]);
                arr[1] = parseInt(arr[1]);
                arr[2] = parseInt(arr[2]);
                arr[3] = 1;
                return arr;
            }
            if (/^rgba\([0-9,\.\s]+\)$/.test(value)) {
                var arr = value.replace(/(rgb\(|\))/gi, "").split(/,\s*/);
                arr[0] = parseInt(arr[0]);
                arr[1] = parseInt(arr[1]);
                arr[2] = parseInt(arr[2]);
                arr[3] = parseInt(arr[3]);
                return arr;
            }
            return null;
        };

    declare('util.Color', {
        _init: function(color) {
            color = color && color.toLowerCase && color.toLowerCase() || 'black';
            if (names[color]) {
                color = names[color];
            }
            this.data = toArray(color) || [0, 0, 0, 1];
        },
        rgb: function() {
            return convs.rgb(this.data);
        },
        rgba: function() {
            return convs.rgba(this.data);
        },
        hex6: function() {
            return convs.hex6(this.data);
        },
        hex8: function() {
            return convs.hex8(this.data);
        },
        hsl: function() {
            return convs.hsl(this.data);
        },
        name: function() {
            return convs.name(this.data);
        }
    });

    _.extend(_.util.Color, {
        toArray: toArray,
        regColor: function(name, val) {
            var arr;
            switch (typeof name) {
                case 'string':
                    arr = toArray(val);
                    if (arr) {
                        name = name.toLowerCase();
                        names[name] = names[name] || convs.hex6(arr).toLowerCase();
                    }
                    break;
                case 'object':
                    _.each(name, function(n, v) {
                        arr = toArray(val);
                        if (arr) {
                            n = n.toLowerCase();
                            names[n] = names[n] || convs.hex6(arr).toLowerCase();
                        }
                    });
                    break;
            }
        },
        rgbFormat: function(value, type) {
            value = value && value.toLowerCase && value.toLowerCase() || 'black';
            if (names[value]) {
                value = names[value];
            }
            var arr = toArray(value);
            if (convs[type]) {
                return convs[type](arr);
            } else {
                return convs.rgba(arr);
            }
        },
        hsb2HSL: hsb2HSL,
        hsl2RGB: hsl2RGB,
        hsl2SafeRGB: hsl2SafeRGB,
        hsl2HSB: hsl2HSB,
        rgb2HSB: rgb2HSB,
        rgb2HSB: rgb2HSB
    });
});