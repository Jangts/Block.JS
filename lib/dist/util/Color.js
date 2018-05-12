/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Sat, 12 May 2018 18:29:36 GMT
 */
;
// tangram.config({});
tangram.init().block([], function (pandora, root, imports, undefined) {
	var module = this.module;
	var _ = pandora;
	var doc = root.document;
	var console = root.console;
	var names = {
		aliceblue: "#f0f8ff",
		antiquewhite: "#faebd7",
		aqua: "#00ffff",
		aquamarine: "#7fffd4",
		azure: "#f0ffff",
		beige: "#f5f5dc",
		bisque: "#ffe4c4",
		black: "#000000",
		blanchedalmond: "#ffebcd",
		blue: "#0000ff",
		blueviolet: "#8a2be2",
		brown: "#a52a2a",
		burlywood: "#deb887",
		cadetblue: "#5f9ea0",
		chartreuse: "#7fff00",
		chocolate: "#d2691e",
		coral: "#ff7f50",
		cornflowerblue: "#6495ed",
		cornsilk: "#fff8dc",
		crimson: "#dc143c",
		cyan: "#00ffff",
		darkblue: "#00008b",
		darkcyan: "#008b8b",
		darkgoldenrod: "#b8860b",
		darkgray: "#a9a9a9",
		darkgreen: "#006400",
		darkkhaki: "#bdb76b",
		darkmagenta: "#8b008b",
		darkolivegreen: "#556b2f",
		darkorange: "#ff8c00",
		darkorchid: "#9932cc",
		darkred: "#8b0000",
		darksalmon: "#e9967a",
		darkseagreen: "#8fbc8f",
		darkslateblue: "#483d8b",
		darkslategray: "#314f4f",
		darkturquoise: "#00ced1",
		darkviolet: "#9400d3",
		deeppink: "#ff1493",
		deepskyblue: "#00bfff",
		dimgray: "#696969",
		dodgerblue: "#1e90ff",
		firebrick: "#b22222",
		floralwhite: "#fffaf0",
		forestgreen: "#228b22",
		fuchsia: "#ff00ff",
		gainsboro: "#dcdcdc",
		ghostwhite: "#f8f8ff",
		gold: "#ffd700",
		goldenrod: "#daa520",
		gray: "#808080",
		green: "#008000",
		greenyellow: "#adff2f",
		honeydew: "#f0fff0",
		hotpink: "#ff69b4",
		indianred: "#cd5c5c",
		indigo: "#4b0082",
		ivory: "#fffff0",
		khaki: "#f0e68c",
		lavender: "#e6e6fa",
		lavenderblush: "#fff0f5",
		lawngreen: "#7cfc00",
		lemonchiffon: "#fffacd",
		lightblue: "#add8e6",
		lightcoral: "#f08080",
		lightcyan: "#e0ffff",
		lightgoldenrodyellow: "#fafad2",
		lightgray: "#d3d3d3",
		lightgreen: "#90ee90",
		lightpink: "#ffb6c1",
		lightsalmon: "#ffa07a",
		lightseagreen: "#20b2aa",
		lightskyblue: "#87cefa",
		lightslategray: "#778899",
		lightsteelblue: "#b0c4de",
		lightyellow: "#ffffe0",
		lime: "#00ff00",
		limegreen: "#32cd32",
		linen: "#faf0e6",
		magenta: "#ff00ff",
		maroon: "#800000",
		mediumaquamarine: "#66cdaa",
		mediumblue: "#0000cd",
		mediumorchid: "#ba55d3",
		mediumpurple: "#9370d8",
		mediumseagreen: "#3cb371",
		mediumslateblue: "#7b68ee",
		mediumspringgreen: "#00fa9a",
		mediumturquoise: "#48d1cc",
		mediumvioletred: "#c71585",
		midnightblue: "#191970",
		mintcream: "#f5fffa",
		mistyrose: "#ffe4e1",
		moccasin: "#ffe4b5",
		navajowhite: "#ffdead",
		navy: "#000080",
		oldlace: "#fdf5e6",
		olive: "#808000",
		olivedrab: "#6b8e23",
		orange: "#ffa500",
		orangered: "#ff4500",
		orchid: "#da70d6",
		palegoldenrod: "#eee8aa",
		palegreen: "#98fb98",
		paleturquoise: "#afeeee",
		palevioletred: "#d87093",
		papayawhip: "#ffefd5",
		peachpuff: "#ffdab9",
		peru: "#cd853f",
		pink: "#ffc0cb",
		plum: "#dda0dd",
		powderblue: "#b0e0e6",
		purple: "#800080",
		red: "#ff0000",
		rosybrown: "#bc8f8f",
		royalblue: "#4169e1",
		saddlebrown: "#8b4513",
		salmon: "#fa8072",
		sandybrown: "#f4a460",
		seagreen: "#2e8b57",
		seashell: "#fff5ee",
		sienna: "#a0522d",
		silver: "#c0c0c0",
		skyblue: "#87ceeb",
		slateblue: "#6a5acd",
		slategray: "#708090",
		snow: "#fffafa",
		springgreen: "#00ff7f",
		steelblue: "#4682b4",
		tan: "#d2b48c",
		teal: "#008080",
		thistle: "#d8bfd8",
		tomato: "#ff6347",
		turquoise: "#40e0d0",
		violet: "#ee82ee",
		wheat: "#f5deb3",
		white: "#ffffff",
		whitesmoke: "#f5f5f5",
		yellow: "#ffff00",
		yellowgreen: "#9acd32"
	};
	var hsb2HSL = function (h, s, b) {
		s/=100
		b/=100;
		var _s = void 0;
		var l = void 0;
		if (s === 0 && b === 1) {
			return [h, 100, 100];
		}
		if (b === 0) {
			return [h, s * 100, 0];
		}
		l = (2 - s) * b/2;
		_s = (s * b)/(1 - Math.abs(l * 2 - 1));
		return [h, _s * 100, l * 100];
	}
	var hue2rgb = function (p, q, t) {
		if(t < 0) t += 1;
		if(t > 1) t -= 1;
		if(t < 1/6)return p + (q - p) * 6 * t;
		if(t < 1/2)return q;
		if(t < 2/3)return p + (q - p) * (2/3 - t) * 6;
		return p;
	}
	var hsl2BaseRGB = function (h, s, l) {
		h/=360
		s/=100
		l/=100;
		var r = void 0;
		var g = void 0;
		var b = void 0;
		if (s == 0) {
			r = g = b = l;
		}
		else {
			var q = l < 0.5 ? l * (1 + s): l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
		return [r, g, b];
	}
	var hsl2RGB = function (h, s, l) {
		var base = hsl2BaseRGB(h, s, l);
		return [Math.round(base[0] * 255), Math.round(base[1] * 255), Math.round(base[2] * 255)];
	}
	var hsl2SafeRGB = function (h, s, l) {
		var base = hsl2BaseRGB(h, s, l);
		return [Math.round(base[0] * 10) * 25.5, Math.round(base[1] * 10) * 25.5, Math.round(base[2] * 10) * 25.5];
	}
	var hsl2HSB = function (h, s, l) {
		s/=100
		l/=100;
		var _s = void 0;
		var b = void 0;
		if (l === 0) {
			return [h, s * 100, 0];
		}
		b = ((1 - Math.abs(l * 2 - 1)) * s + l * 2)/2;
		_s = (b - l) * 2/b;
		return [h, s, b];
	}
	var rgb2HSB = function (r, g, b) {
		r/=255
		g/=255
		b/=255;
		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
		var h = void 0;
		var s = void 0;
		var b = max;
		if (max == min) {
			h = s = 0;
		}
		else {
			var d = max - min;
			s = d/b;
			switch (max) {
				case r:
				h = (g - b)/d + (g < b ? 6:0);
				break;;
				case g:
				h = (b - r)/d + 2;
				break;;
				case b:
				h = (r - g)/d + 4;
				break;;
			}
			h/=6;
		}
		return [h, s, b];
	}
	var rgb2HSL = function (r, g, b) {
		r/=255
		g/=255
		b/=255;
		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
		var h = void 0;
		var s = void 0;
		var l = (max + min)/2;
		if (max == min) {
			h = s = 0;
		}
		else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d /(max + min);
			switch (max) {
				case r:
				h = (g - b)/d + (g < b ? 6:0);
				break;;
				case g:
				h = (b - r)/d + 2;
				break;;
				case b:
				h = (r - g)/d + 4;
				break;;
			}
			h/=6;
		}
		return [h, s, l];
	}
	var hex = function (num) {
		var hex = void 0;
		num = (num >= 0 && num <= 255) ? num : 0;
		hex = num.toString(16);
		return hex.length === 2 ? hex : '0' + hex;
	}
	var convs = {
		rgb: function (arr) {
			return 'rgb(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ')';
		},
		rgba: function (arr) {
			return 'rgb(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ',' + arr[3] + ')';
		},
		hex6: function (arr) {
			return '#' + hex(arr[0]) + hex(arr[1]) + hex(arr[2]);
		},
		hex8: function (arr) {
			return '#' + hex(arr[0]) + hex(arr[1]) + hex(arr[2]) + hex(arr[3] * 255);
		},
		hsl: function (rgb) {
			var arr = rgb2HSL(rgb[0], rgb[1], rgb[2]);
			return 'hsl(' + arr[0] + ',' + arr[1] + '%,' + arr[2] + '%)';
		},
		name: function (arr) {
			var hex6 = '#' + hex(arr[0]) + hex(arr[1]) + hex(arr[2]);
			var name = void 0;
			_.loop(names, function (n, v) {
				if (v === hex6) {
					name = n;
					_.loop.out();
				};
			});
			return name;
		}
	};
	var toArray = function (value) {
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
			arr[3] = parseInt(value.substr(0, 2), 16)/255;
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
	}
	pandora.declareClass('util.Color', {
		_init: function (color) {
			color = color && color.toLowerCase && color.toLowerCase() || 'black';
			if (names[color]) {
				color = names[color];
			}
			this.data = toArray(color) || [0, 0, 0, 1];
		},
		rgb: function () {
			return convs.rgb(this.data);
		},
		rgba: function () {
			return convs.rgba(this.data);
		},
		hex6: function () {
			return convs.hex6(this.data);
		},
		hex8: function () {
			return convs.hex8(this.data);
		},
		hsl: function () {
			return convs.hsl(this.data);
		},
		name: function () {
			return convs.name(this.data);
		}
	});
	pandora.extend(pandora.util.Color, {
		toArray: toArray,
		regColor: function (name, val) {
			var _arguments = arguments;
			var arr = void 0;
			switch (typeof name) {
				case 'string':
				arr = toArray(val);
				if (arr) {
					name = name.toLowerCase();
					names[name] = names[name] || convs.hex6(arr).toLowerCase();
				}
				break;;
				case 'object':
				pandora.each(name, function (n, v) {
					arr = toArray(val);
					if (arr) {
						n = n.toLowerCase();
						names[n] = names[n] || convs.hex6(arr).toLowerCase();
					};
				}, this);
				break;;
			};
		},
		rgbFormat: function (value, type) {
			value = value && value.toLowerCase && value.toLowerCase() || 'black';
			if (names[value]) {
				value = names[value];
			}
			var arr = toArray(value);
			if (convs[type]) {
				return convs[type](arr);
			}
			else {
				return convs.rgba(arr);
			};
		},
		hsb2HSL: hsb2HSL,
		hsl2RGB: hsl2RGB,
		hsl2SafeRGB: hsl2SafeRGB,
		hsl2HSB: hsl2HSB,
		rgb2HSB: rgb2HSB,
		rgb2HSB: rgb2HSB
	});
	pandora.extend(pandora.util.Color, names);
	this.module.exports = pandora.util.Color;
});
//# sourceMappingURL=Color.js.map