/*!
 * tangram.js framework source code
 *
 * class util.Color
 *
 * Date 2017-04-06
 */
;
tangram.block([], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console;

    var names = {
        aliceblue: "#f0f8ff", // rgb(240, 248, 255)	爱丽丝蓝
        antiquewhite: "#faebd7", // rgb(250, 235, 215)	古董白
        aqua: "#00ffff", // rgb(0, 255, 255)	青　色
        aquamarine: "#7fffd4", // rgb(127, 255, 212)	碧　绿
        azure: "#f0ffff", // rgb(240, 255, 255)	青白色
        beige: "#f5f5dc", // rgb(245, 245, 220)	米　色
        bisque: "#ffe4c4", // rgb(255, 228, 196)	陶坯黄
        black: "#000000", // rgb(0, 0, 0)		黑　色
        blanchedalmond: "#ffebcd", // rgb(255, 235, 205)	杏仁白
        blue: "#0000ff", // rgb(0, 0, 255)		蓝　色
        blueviolet: "#8a2be2", // rgb(138, 43, 226)	蓝紫色
        brown: "#a52a2a", // rgb(165, 42, 42)	褐　色
        burlywood: "#deb887", // rgb(222, 184, 135)	硬木褐
        cadetblue: "#5f9ea0", // rgb(95, 158, 160)	军服蓝
        chartreuse: "#7fff00", // rgb(127, 255, 0)	查特酒绿
        chocolate: "#d2691e", // rgb(210, 105, 30)	巧克力色
        coral: "#ff7f50", // rgb(255, 127, 80)	珊瑚红
        cornflowerblue: "#6495ed", // rgb(100, 149, 237)	矢车菊蓝
        cornsilk: "#fff8dc", // rgb(255, 248, 220)	玉米穗黄
        crimson: "#dc143c", // rgb(220,20,60)		绯　红
        cyan: "#00ffff", // rgb(0, 255, 255)	青　色
        darkblue: "#00008b", // rgb(0, 0, 139)		深　蓝
        darkcyan: "#008b8b", // rgb(0, 139, 139)	深　青
        darkgoldenrod: "#b8860b", // rgb(184, 134, 11)	深金菊黄
        darkgray: "#a9a9a9", // rgb(169, 169, 169)	暗　灰
        darkgreen: "#006400", // rgb(0, 100, 0)		深　绿
        darkkhaki: "#bdb76b", // rgb(189, 183, 107)	深卡其色
        darkmagenta: "#8b008b", // rgb(139, 0, 139)	深品红
        darkolivegreen: "#556b2f", // rgb(85, 107, 47)	深橄榄绿
        darkorange: "#ff8c00", // rgb(255, 140, 0)	深　橙
        darkorchid: "#9932cc", // rgb(153, 50, 204)	深洋兰紫
        darkred: "#8b0000", // rgb(139, 0, 0)	深　红
        darksalmon: "#e9967a", // rgb(233, 150, 122)	深鲑红
        darkseagreen: "#8fbc8f", // rgb(143, 188, 143)	深海藻绿
        darkslateblue: "#483d8b", // rgb(72, 61, 139)	深岩蓝
        darkslategray: "#314f4f", // rgb(47,79,79)		深岩灰
        darkturquoise: "#00ced1", // rgb(0, 206, 209)	深松石绿
        darkviolet: "#9400d3", // rgb(148, 0, 211)	深　紫
        deeppink: "#ff1493", // rgb(255, 20, 147)	深　粉
        deepskyblue: "#00bfff", // rgb(0, 191, 255)	深天蓝
        dimgray: "#696969", // rgb(105, 105, 105)	昏　灰
        dodgerblue: "#1e90ff", // rgb(30, 144, 255)	湖　蓝
        firebrick: "#b22222", // rgb(178, 34, 34)	火砖红
        floralwhite: "#fffaf0", // rgb(255, 250, 240)	花卉白
        forestgreen: "#228b22", // rgb(34, 139, 34)	森林绿
        fuchsia: "#ff00ff", // rgb(255, 0, 255)	洋　红
        gainsboro: "#dcdcdc", // rgb(220, 220, 220)	庚氏灰
        ghostwhite: "#f8f8ff", // rgb(248, 248, 255)	幽灵白
        gold: "#ffd700", // rgb(255, 215, 0)	金　色
        goldenrod: "#daa520", // rgb(218, 165, 32)	金菊黄
        gray: "#808080", // rgb(128, 128, 128)	灰　色
        green: "#008000", // rgb(0, 128, 0)		调和绿
        greenyellow: "#adff2f", // rgb(173, 255, 47)	黄绿色
        honeydew: "#f0fff0", // rgb(240, 255, 240)	蜜瓜绿
        hotpink: "#ff69b4", // rgb(255, 105, 180)	艳　粉
        indianred: "#cd5c5c", // rgb(205, 92, 92)	印度红
        indigo: "#4b0082", // rgb(75, 0, 130)		靛　蓝
        ivory: "#fffff0", // rgb(255, 255, 240)	象牙白
        khaki: "#f0e68c", // rgb(240, 230, 140)	卡其色
        lavender: "#e6e6fa", // rgb(230, 230, 250)	薰衣草紫
        lavenderblush: "#fff0f5", // rgb(255, 240, 245)	薰衣草红
        lawngreen: "#7cfc00", // rgb(124, 252, 0)	草坪绿
        lemonchiffon: "#fffacd", // rgb(255, 250, 205)	柠檬绸黄
        lightblue: "#add8e6", // rgb(173, 216, 230)	浅　蓝
        lightcoral: "#f08080", // rgb(240, 128, 128)	浅珊瑚红
        lightcyan: "#e0ffff", // rgb(224, 255, 255)	浅　青
        lightgoldenrodyellow: "#fafad2", // rgb(250, 250, 210)	浅金菊黄
        lightgray: "#d3d3d3", // rgb(211, 211, 211)	亮　灰
        lightgreen: "#90ee90", // rgb(144, 238, 144)	浅　绿
        lightpink: "#ffb6c1", // rgb(255, 182, 193)	浅　粉
        lightsalmon: "#ffa07a", // rgb(255, 160, 122)	浅鲑红
        lightseagreen: "#20b2aa", // rgb(32, 178, 170)	浅海藻绿
        lightskyblue: "#87cefa", // rgb(135, 206, 250)	浅天蓝
        lightslategray: "#778899", // rgb(119, 136, 153)	浅岩灰
        lightsteelblue: "#b0c4de", // rgb(176, 196, 222)	浅钢青
        lightyellow: "#ffffe0", // rgb(255, 255, 224)	浅　黄
        lime: "#00ff00", // rgb(0, 255, 0)		绿　色
        limegreen: "#32cd32", // rgb(50, 205, 50)	青柠绿
        linen: "#faf0e6", // rgb(250, 240, 230)	亚麻色
        magenta: "#ff00ff", // rgb(255, 0, 255)	洋　红
        maroon: "#800000", // rgb(128, 0, 0)		栗　色
        mediumaquamarine: "#66cdaa", // rgb(102, 205, 170)	中碧绿
        mediumblue: "#0000cd", // rgb(0, 0, 205)		中　蓝
        mediumorchid: "#ba55d3", // rgb(186, 85, 211)	中洋兰紫
        mediumpurple: "#9370d8", // rgb(147, 112, 219)	中　紫
        mediumseagreen: "#3cb371", // rgb(60, 179, 113)	中海藻绿
        mediumslateblue: "#7b68ee", // rgb(123, 104, 238)	中岩蓝
        mediumspringgreen: "#00fa9a", // rgb(0, 250, 154)	中嫩绿
        mediumturquoise: "#48d1cc", // rgb(72, 209, 204)	中松石绿
        mediumvioletred: "#c71585", // rgb(199, 21, 133)	中紫红
        midnightblue: "#191970", // rgb(25, 25, 112)	午夜蓝
        mintcream: "#f5fffa", // rgb(245, 255, 250)	薄荷乳白
        mistyrose: "#ffe4e1", // rgb(255, 228, 225)	雾玫瑰红
        moccasin: "#ffe4b5", // rgb(255, 228, 181)	鹿皮色
        navajowhite: "#ffdead", // rgb(255, 222, 173)	土著白
        navy: "#000080", // rgb(0, 0, 128)		藏　青
        oldlace: "#fdf5e6", // rgb(253, 245, 230)	旧蕾丝白
        olive: "#808000", // rgb(128, 128, 0)	橄榄色
        olivedrab: "#6b8e23", // rgb(107, 142, 35)	橄榄绿
        orange: "#ffa500", // rgb(255, 165, 0)	橙　色
        orangered: "#ff4500", // rgb(255, 69, 0)		橘　红
        orchid: "#da70d6", // rgb(218, 112, 214)	洋兰紫
        palegoldenrod: "#eee8aa", // rgb(238, 232, 170)	白金菊黄
        palegreen: "#98fb98", // rgb(152, 251, 152)	白绿色
        paleturquoise: "#afeeee", // rgb(175, 238, 238)	白松石绿
        palevioletred: "#d87093", // rgb(219, 112, 147)	白紫红
        papayawhip: "#ffefd5", // rgb(255, 239, 213)	番木瓜橙
        peachpuff: "#ffdab9", // rgb(255, 218, 185)	粉扑桃色
        peru: "#cd853f", // rgb(205, 133, 63)	秘鲁红
        pink: "#ffc0cb", // rgb(255, 192, 203)	粉　色
        plum: "#dda0dd", // rgb(221, 160, 221)	李　紫
        powderblue: "#b0e0e6", // rgb(176, 224, 230)	粉末蓝
        purple: "#800080", // rgb(128, 0, 128)	紫　色
        red: "#ff0000", // rgb(255, 0, 0)		红　色
        rosybrown: "#bc8f8f", // rgb(188, 143, 143)	玫瑰褐
        royalblue: "#4169e1", // rgb(65, 105, 225)	品　蓝
        saddlebrown: "#8b4513", // rgb(139, 69, 19)	鞍　褐
        salmon: "#fa8072", // rgb(250, 128, 114)	鲑　红
        sandybrown: "#f4a460", // rgb(244, 164, 96)	沙　褐
        seagreen: "#2e8b57", // rgb(46, 139, 87)	海藻绿
        seashell: "#fff5ee", // rgb(255, 245, 238)	贝壳白
        sienna: "#a0522d", // rgb(160, 82, 45)	土黄赭
        silver: "#c0c0c0", // rgb(192, 192, 192)	银　色
        skyblue: "#87ceeb", // rgb(135, 206, 235)	天　蓝
        slateblue: "#6a5acd", // rgb(106, 90, 205)	岩　蓝
        slategray: "#708090", // rgb(112, 128, 144)	岩　灰
        snow: "#fffafa", // rgb(255, 250, 250)	雪　白
        springgreen: "#00ff7f", // rgb(0, 255, 127)	春　绿
        steelblue: "#4682b4", // rgb(70, 130, 180)	钢　青
        tan: "#d2b48c", // rgb(210, 180, 140)	日晒褐
        teal: "#008080", // rgb(0, 128, 128)	鸭翅绿
        thistle: "#d8bfd8", // rgb(216, 191, 216)	蓟　紫
        tomato: "#ff6347", // rgb(255, 99, 71)	番茄红
        turquoise: "#40e0d0", // rgb(64, 224, 208)	松石绿
        violet: "#ee82ee", // rgb(238, 130, 238)	紫罗兰色
        wheat: "#f5deb3", // rgb(245, 222, 179)	麦　色
        white: "#ffffff", // rgb(255, 255, 255)	白　色
        whitesmoke: "#f5f5f5", // rgb(245, 245, 245)	烟雾白
        yellow: "#ffff00", // rgb(255, 255, 0)	黄　色
        yellowgreen: "#9acd32" // rgb(154, 205, 50)	暗黄绿色
    },

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
    }, names);
});