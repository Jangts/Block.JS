/*!
 * Block.JS Framework Source Code
 *
 * class dom.HTMLClose
 *
 * Date 2017-04-06
 */
;
block(['$_/util/bool.xtd', '$_/util/str.xtd', '$_/dom/'], function(
    pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document;

    // 注册_.dom命名空间到pandora
    _('dom');

    var lexicalanAlysis = function(body) {
            var midast = {
                    'tags': [],
                    'text': []
                },
                strlen = body.length,
                strsum = '',
                f, i, tagnum, tagname, htmtxt, ord_var_c;

            for (var i = 0; i < strlen; ++i) {
                var current = body.substr(i, 1);
                if (current == '<') {
                    // html 代码开始
                    tagnum = 1;
                    htmtxt = '';
                } else if (tagnum == 1) {
                    // 一段 html 代码结束
                    if (current == '>') {
                        htmtxt = _.util.str.trim(htmtxt);
                        if (htmtxt.substr(-1) != '/') {
                            f = htmtxt.substr(0, 1);
                            if (f == '/') {
                                midast['tags'].push({
                                    'is_open': false,
                                    'tagname': htmtxt.replace('/', '')
                                });
                                midast['text'].push(strsum);
                                strsum = '';
                            } else if (f != '?') {
                                if (htmtxt.indexOf(' ') !== -1) {
                                    tagname = htmtxt.split(' ', 2)[0].toLowerCase();
                                } else {
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

                        // 字符串重置
                        htmtxt = '';
                        tagnum = 0;
                    } else {
                        /**
                         * 将< >之间的字符组成一个字符串
                         * 用于提取 html 标签
                         */
                        htmtxt += current;
                    }
                }

                ord_var_c = body[i].charCodeAt();

                switch (true) {
                    case ((ord_var_c & 0xE0) == 0xC0):
                        // 2 字节
                        strsum += body.substr(i, 2);
                        i += 1;
                        break;

                    case ((ord_var_c & 0xF0) == 0xE0):
                        // 3 字节
                        strsum += body.substr(i, 3);
                        i += 2;
                        break;

                    case ((ord_var_c & 0xF8) == 0xF0):
                        // 4 字节
                        strsum += body.substr(i, 4);
                        i += 3;
                        break;

                    case ((ord_var_c & 0xFC) == 0xF8):
                        // 5 字节
                        strsum += body.substr(i, 5);
                        i += 4;
                        break;

                    case ((ord_var_c & 0xFE) == 0xFC):
                        // 6 字节
                        strsum += body.substr(i, 6);
                        i += 5;
                        break;
                    default:
                        // 1 字节
                        strsum += current;
                }
            }
            midast['text'].push(strsum);
            return midast;
        },
        syntacticAnalyzer = function(midast) {
            var tags = midast['tags'],
                text = midast['text'],
                opens = [],
                tagname, posi, max;
            _.each(tags, function(index, tag) {
                tagname = tag['tagname'];
                if (tag['is_open']) {
                    if (_.util.arr.has(['img', 'input', 'br', 'link', 'meta'], tagname) === false) {
                        opens.push(tagname);
                        opens = _.util.arr.merge(opens);
                    }
                } else {
                    if (opens.length) {
                        max = opens.length - 1;
                        if (opens[max] === tagname) {
                            opens = _.util.arr.removeByIndex(opens, max);
                        } else {
                            posi = _.util.arr.search(tagname, opens);
                            if (posi !== -1) {
                                for (max; max > posi; max--) {
                                    text[index] = '></' + opens[max] + text[index];
                                    opens = _.util.arr.removeByIndex(opens, max);
                                }
                                opens = _.util.arr.removeByIndex(opens, posi);
                            } else {
                                text[index] = '><' + tagname + text[index];
                            }
                        }
                    } else {
                        if (index) {
                            text[index] = '><' + tagname + text[index];
                        } else {
                            text[index] = '<' + tagname + '>' + text[index];
                        }
                    }
                }
            });
            if (opens.length) {
                max = opens.length - 1;
                for (max; max >= 0; max--) {
                    text.push('</' + opens[max] + '>');
                }
            }
            return text;
        };

    declare('dom.HTMLClose', {
        body: '',
        strlen: 0,
        midast: [],
        $ast: [],
        compile(body) {
            this.body = body;
            if (body.indexOf('<') === -1) {
                this.ast = [body];
                return body;
            }
            this.midast = lexicalanAlysis(body);
            this.ast = syntacticAnalyzer(this.midast);
            return this.ast.join('');
        }
    });

    _.extend(_.dom.HTMLClose, {
        compile: function(input) {
            obj = new _.dom.HTMLClose();
            return obj.compile(input);
        }
    });
});