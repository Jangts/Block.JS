/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Sat, 12 May 2018 17:51:09 GMT
 */
;
// tangram.config({});
tangram.init().block([
	'$_/util/bool',
	'$_/str/',
	'$_/dom/'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var dom = pandora.ns('dom', {});
	var _ = pandora;
	var doc = root.document;
	function lexicalanAlysis (body) {
		var midast = {
			'tags': [],
			'text': []
		};
		var strlen = body.length;
		var strsum = '';
		var f = void 0;
		var i = void 0;
		var tagnum = void 0;
		var tagname = void 0;
		var htmtxt = void 0;
		var ord_var_c = void 0;
		for (var i = 0;i < strlen;++i) {
			var current = body.substr(i, 1);
			if (current == '<') {
				tagnum = 1;
				htmtxt = '';
			}
			else if (tagnum == 1) {
				if (current == '>') {
					htmtxt = _.str.trim(htmtxt);
					if (htmtxt.substr( -1) != '/') {
						f = htmtxt.substr(0, 1);
						if (f == '/') {
							midast['tags'].push({
								'is_open': false,
								'tagname': htmtxt.replace('/', '')
							});
							midast['text'].push(strsum);
							strsum = '';
						}
						else if (f != '?') {
							if (htmtxt.indexOf(' ') !==  -1) {
								tagname = htmtxt.split(' ',2)[0].toLowerCase();
							}
							else {
								tagname = htmtxt.toLowerCase();
							}
							midast['tags'].push({
								'is_open': true,
								'tagname': tagname,
								'tagtext': htmtxt
							});
							midast['text'].push(strsum);
							strsum = '';
						}
					}
					htmtxt = '';
					tagnum = 0;
				}
				else {
					htmtxt += current;
				}
			}
			ord_var_c = body[i].charCodeAt();
			switch (true) {
				case ((ord_var_c & 0xE0) == 0xC0):
				strsum += body.substr(i, 2);
				i += 1;
				break;;
				case ((ord_var_c & 0xF0) == 0xE0):
				strsum += body.substr(i, 3);
				i += 2;
				break;;
				case ((ord_var_c & 0xF8) == 0xF0):
				strsum += body.substr(i, 4);
				i += 3;
				break;;
				case ((ord_var_c & 0xFC) == 0xF8):
				strsum += body.substr(i, 5);
				i += 4;
				break;;
				case ((ord_var_c & 0xFE) == 0xFC):
				strsum += body.substr(i, 6);
				i += 5;
				break;;
				default:
				strsum += current;
			}
		}
		midast['text'].push(strsum);
		return midast;
	}
	function syntacticAnalyzer (midast) {
		var tags = midast['tags'];
		var text = midast['text'];
		var opens = [];
		var tagname = void 0;
		var posi = void 0;
		var max = void 0;
		_.each(tags, function (index, tag) {
			tagname = tag['tagname'];
			if (tag['is_open']) {
				if (_.arr.has(['img', 'input', 'br', 'link', 'meta'], tagname) === false) {
					opens.push(tagname);
					opens = _.arr.merge(opens);
				}
			}
			else {
				if (opens.length) {
					max = opens.length - 1;
					if (opens[max] === tagname) {
						opens = _.arr.removeByIndex(opens, max);
					}
					else {
						posi = _.arr.search(tagname, opens);
						if (posi !==  -1) {
							for (max;max > posi;max--) {
								text[index] = '></' + opens[max] + text[index];
								opens = _.arr.removeByIndex(opens, max);
							}
							opens = _.arr.removeByIndex(opens, posi);
						}
						else {
							text[index] = '><' + tagname + text[index];
						}
					}
				}
				else {
					if (index) {
						text[index] = '><' + tagname + text[index];
					}
					else {
						text[index] = '<' + tagname + '>' + text[index];
					}
				}
			};
		});
		if (opens.length) {
			max = opens.length - 1;
			for (max;max >= 0;max--) {
				text.push('</' + opens[max] + '>');
			}
		}
		return text;
	}
	pandora.declareClass('dom.HTMLCloser', {
		body: '',
		strlen: 0,
		midast: [],
		$ast: [],
		compile: function (body) {
			this.body = body;
			if (body.indexOf('<') ===  -1) {
				this.ast = [body];
				return body;
			}
			this.midast = lexicalanAlysis(body);
			this.ast = syntacticAnalyzer(this.midast);
			return this.ast.join('');
		}
	});
	pandora.extend(pandora.dom.HTMLCloser, {
		compile: function (input) {
			obj = new _.dom.HTMLCloser();
			return obj.compile(input);
		}
	});
	module.exports = pandora.dom.HTMLCloser;
});
//# sourceMappingURL=HTMLCloser.js.map