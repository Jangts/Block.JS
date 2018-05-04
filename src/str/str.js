/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Fri, 04 May 2018 08:19:58 GMT
 */
;
// tangram.config({});
tangram.block([], function (pandora, root, imports, undefined) {
	var _ = pandora;
	var doc = root.document;
	var console = root.console;
	var location = root.location;
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var _utf8_encode = function (string) {
		string = string.replace(/\r\n/g, "\n")
		var utftext = ""
		for (var n = 0;n < string.length;n++) {
			var c = string.charCodeAt(n)
			if (c < 128) {
				utftext += String.fromCharCode(c)
			}
			else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6)| 192)
				utftext += String.fromCharCode((c & 63)| 128)
			}
			else {
				utftext += String.fromCharCode((c >> 12)| 224)
				utftext += String.fromCharCode(((c >> 6) & 63)| 128)
				utftext += String.fromCharCode((c & 63)| 128)
			}
		}
		return utftext;
	}
	var _utf8_decode = function (utftext) {
		var string = ""
		var i = 0;
		var c = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i)
			if (c < 128) {
				string += String.fromCharCode(c)
				i++;
			}
			else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1)
				string += String.fromCharCode(((c & 31) << 6)|(c2 & 63))
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i + 1)
				c3 = utftext.charCodeAt(i + 2)
				string += String.fromCharCode(((c & 15) << 12)|((c2 & 63) << 6)|(c3 & 63))
				i += 3;
			}
		}
		return string;
	}
	pandora.ns('str', function () {
		function trim (str) {
			return str.replace(/(^\s*)|(\s*$)/g, '')
		}
		function capital (str) {
			return str.replace(/(\w)/, function (v) {
				return v.toUpperCase()
			})
		}
		function toCamel (str) {
			return str.replace(/(-\w)/, function (v) {
				return v.replace('-', '').toUpperCase()
			})
		}
		function has (strs, str) {
			return RegExp("\\b" + str + "\\b").test(strs)
		};
		function charCode (code) {
			return String.fromCharCode(code)
		};
		function escape (str) {
			return "echo(\"" + str.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "\");"
		};
		function repeat (target, n) {
			var s = target;
			var total = ""
			while (n > 0) {
				if (n % 2 == 1) {
					total += s;
				}
				if (n == 1) {
					break
				}
				s += s;
				n = n >> 1;
			}
			return total;
		};
		function base64Encode (input) {
			input = typeof input === 'string'? input : ''
			var output = ""
			var chr1 = void 0;
			var chr2 = void 0;
			var chr3 = void 0;
			var enc1 = void 0;
			var enc2 = void 0;
			var enc3 = void 0;
			var enc4 = void 0;
			var i = 0;
			input = _utf8_encode(input)
			while (i < input.length) {
				chr1 = input.charCodeAt(i++)
				chr2 = input.charCodeAt(i++)
				chr3 = input.charCodeAt(i++)
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4)|(chr2 >> 4)
				enc3 = ((chr2 & 15) << 2)|(chr3 >> 6)
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				}
				else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4)
			}
			return output;
		};
		function base64Decode (input) {
			input = typeof input === 'string'? input : ''
			var output = ""
			var chr1 = void 0;
			var chr2 = void 0;
			var chr3 = void 0;
			var enc1 = void 0;
			var enc2 = void 0;
			var enc3 = void 0;
			var enc4 = void 0;
			var i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "")
			while (i < input.length) {
				enc1 = _keyStr.indexOf(input.charAt(i++))
				enc2 = _keyStr.indexOf(input.charAt(i++))
				enc3 = _keyStr.indexOf(input.charAt(i++))
				enc4 = _keyStr.indexOf(input.charAt(i++))
				chr1 = (enc1 << 2)|(enc2 >> 4)
				chr2 = ((enc2 & 15) << 4)|(enc3 >> 2)
				chr3 = ((enc3 & 3) << 6)| enc4;
				output = output + String.fromCharCode(chr1)
				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2)
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3)
				}
			}
			output = _utf8_decode(output)
			return output;
		}
		return {
		}
	});
	this.module.exports = _.str;
});
//# sourceMappingURL=./str.js.map