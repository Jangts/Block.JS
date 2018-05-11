/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Fri, 11 May 2018 04:49:02 GMT
 */
;
// tangram.config({});
tangram.init().block([
	'$_/str/'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var dom = pandora.ns('dom', {});
	var _ = pandora;
	var doc = root.document;
	var esc = _.str.escape;
	var startTag = '<%';
	var endTag = '%>';
	var spliter = new RegExp("(" + startTag + "|" + endTag + ")");
	var regExp = /^[\s\r\n]*=(.+?)[\s\r\n]*$/;
	var delimiters = ['{@', '}'];
	var compilers = {
		expression: [{
			pattern: /\{\@\@([\w\.\[\]\'\"]+)\}/ig,
			handler: function (match, pattern) {
				return match.replace(pattern, "<%include($1)%>");
			}
		}],
		echo: [{
			pattern: /\{\@([\w\.\[\]]+)\,\s*\g\s*\}/ig,
			handler: function (match, pattern) {
				return match.replace(pattern, "<%echo($1)%>");
			}
		}, {
			pattern: /\{\@([\w\.\[\]\'\"]+)\}/ig,
			handler: function (match, pattern) {
				return match.replace(pattern, "<%echo(this.data.$1)%>");
			}
		}, {
			pattern: /\{\@([\w\.\[\]\s\?\:\'\"\&]+)\}/ig,
			handler: function (match, pattern) {
				return match.replace(pattern, "<%echo(this.data.$1)%>");
			}
		}, {
			pattern: /<\s*if\s*\(/ig,
			handler: function (match, pattern) {
				return match.replace(pattern, "<%if(");
			}
		}, {
			pattern: /<\s*for\s*\(/ig,
			handler: function (match, pattern) {
				return match.replace(pattern, "<%for(");
			}
		}, {
			pattern: /\)\s*>/ig,
			handler: function (match, pattern) {
				return match.replace(pattern, ") {%>");
			}
		}, {
			pattern: /<\}>/ig,
			handler: function (match, pattern) {
				return match.replace(pattern, "<%}%>");
			}
		}]
	};
	var filters = {
		repeat: function (str, times) {
			times = typeof times === 'number' ? times : 2;
			var _str = '';
			while (times) {
				_str += str;
				times--;
			}
			return _str;
		}
	};
	var order = ['expression', 'echo'];
	var escap = function (str) {
		return str.replace(/\$/g, '\\\$').replace(/\{/g, '\\\{').replace(/\}/g, '\\\}');
	}
	var compile = function (source) {
		_.each(filters, function (filter, handler) {
			var pattern = new RegExp(escap(delimiters[0]) + '\\\s*([\\\w\\\.\\\[\\\]\\\'\\\"]+)' + '\\\s*\\\|\\\s*' + filter.replace('.', '\\\.') + '\\\s*,' + '([\\\s\\\w\\\.\\\[\\\]\\\'\\\,\\\"]+?)' + escap(delimiters[1]), 'g');
			var matches = source.match(pattern);
			if (matches) {
				_.each(matches, function (i, match) {
					source = source.replace(pattern, "<%echo(filters." + filter + "(this.data.$1,$2))%>");
				});
			};
		});
		_.each(order, function (i, group) {
			_.each(compilers[group], function (j, type) {
				var matches = source.match(type.pattern);
				if (matches) {
					_.each(matches, function (k, match) {
						source = source.replace(match, type.handler(match, type.pattern));
					});
				};
			});
		});
		return source;
	}
	var allcodes = {};
	pandora.declareClass('dom.Template', {
		_init: function (source, data, includes) {
			this.uid = new _.Identifier().toString();
			this.intermediate = compile(source);
			var string = this.intermediate.split(spliter);
			var codes = [];
			var rs = [];
			include = function (name) {
				if (name && includes[name] && (typeof includes[name].echo === '')) {
					rs.push(includes[name].echo());
				};
			}
			for (var i = 0;i < string.length;i++) {
				var code = string[i];
				if (code === endTag) {
					continue;;
				}
				if (code === startTag) {
					code = string[++i];
					if (regExp.test(code)) {
						codes.push(code.replace(regExp, "echo($1);"));
						continue;;
					}
					codes.push(code);
				}
				else {
					codes.push(esc(code));
				}
			}
			allcodes[this.uid] = codes;
			this.source = source;
			this.includes = {};
			this.data = {};
			if (data) {
				this.complie(data, includes);
			};
		},
		complie: function (data, includes) {
			data = typeof data === 'object' ? data : {}
			includes = typeof includes === 'object' ? includes : {}
			this.includes = includes;
			this.data = data;
			var rs = this.results;
			var echo = function (str) {
				rs.push(str);
			}
			eval(allcodes[this.uid].join("\r\n"));
			return this;
		},
		echo: function (clear) {
			return this.results.join('');
		},
		clear: function () {
			this.results = [];
		}
	});
	pandora.extend(pandora.dom.Template, {
		config: function (options) {
			options = options || {}
			if (options.mainUrl) {
				root.config({
					mainUrl: options.mainUrl
				});
			}
			mainUrl = _.mainUrl();
		}
	});
	module.exports = pandora.dom.Template;
});
//# sourceMappingURL=Template.js.map