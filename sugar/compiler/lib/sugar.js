/*!
 * tangram.js framework syntactic sugar
 * Core Code
 *
 * Written and Designed By Jang Ts
 * http://tangram.js.cn
 */
;
(function (global, factory) {
    if (typeof exports === 'object') {
        exports = factory(global);
        if (typeof module === 'object') {
            module.exports = exports;
        }
    }
    else if (typeof global.define === 'function' && global.define.amd) {
        // AMD
        global.define('tangram_js_sugar', [], function () {
            return factory(global);
        });
    }
    else {
        global.tangram_js_sugar = factory(global);
    }
}(this, function (global) {
    var _this = this;
    if (Array.prototype['includes'] == undefined) {
        Array.prototype['includes'] = function (searchElement, fromIndex) {
            fromIndex = parseInt(fromIndex) || 0;
            for (fromIndex; fromIndex < _this.length; fromIndex++) {
                if (_this[fromIndex] === searchElement) {
                    return true;
                }
            }
            return false;
        };
    }
    var zero2z = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''), namingExpr = /^[A-Z_\$][\w\$]*(\.[A-Z_\$][\w\$]*)*$/i, argsExpr = /^...[A-Z_\$][\w\$]*(\.[A-Z_\$][\w\$]*)*$/i, reservedWords = ['if', 'for', 'while', 'switch', 'with', 'catch'], stringas = {
        '/': '_as_pattern___',
        '`': '_as_template___',
        '"': '_as_string___',
        "'": '_as_string___'
    }, 
    // '++ ', '-- ',
    // ' !', ' ~', ' +', ' -', ' ++', ' --',
    // ' ** ', ' * ', ' / ', ' % ', ' + ', ' - ',
    // ' << ', ' >> ', ' >>> ',
    // ' < ', ' <= ', ' > ', ' >= ',
    // ' == ', ' != ', ' === ', ' !== ',
    // ' & ', ' ^ ', ' | ', ' && ', ' || ',
    // ' = ', ' += ', ' -= ', ' *= ', ' /= ', ' %= ', ' <<= ', ' >>= ', ' >>>= ', ' &= ', ' ^= ', ' |= '
    operators = {
        // 因为打开所有括号后还有检查一次符号，所以运算量还是会带有括号
        mixed: /([\$\w]\s*(@\d+L\d+P\d+O*\d*::)?)(\=\=|\!\=|\=|\!|\+|\-|\*|\/|\%|<<|>>|>>>|\&|\^|\||<|>)=\s*((\+|\-)?[\$\w\.])/g,
        bool: /([\$\w]\s*(@\d+L\d+P\d+O*\d*::)?)(\&\&|\|\||\<|\<\<|\>\>\>|\>\>|\>)\s*((\+|\-)?[\$\w\.])/g,
        op: /([\$\w]\s*(@\d+L\d+P\d+O*\d*::)?)(\+|\-|\*\*|\*|\/|\%)\s*((\s+(\+|\-))?[\$\w\.])/g,
        owords: /\s+(in|of)\s+/g,
        sign: /(^|\s*[^\+\-](@\d+L\d+P\d+O*\d*::)?)(\+|\-)([\$\w\.])/g,
        swords: /(^|[^\$\w])(typeof|instanceof|void|delete)\s+(\+*\-*[\$\w\.])/g,
        before: /(\+\+|\-\-|\!|\~)\s*([\$\w])/g,
        after: /([\$\w\.])\s*(\+\+|\-\-)/g,
        error: /(.*)(\+\+|\-\-|\+|\-)(.*)/g
    }, replaceExpr = {
        await: /^((\s*@\d+L\d+P0::)*\s*(@\d+L\d+P0*)::(\s*))?"await"\s*/,
        using: /^\s*use\s+/g,
        namespace: /((@\d+L\d+P0)::)?(\s*)namespace\s+([\$\w\.]+)\s*;*/g,
        // 位置是在replace usings 和 strings 之后才tidy的，所以还存在后接空格
        use: /(@\d+L\d+P\d+::)\s*use\s+([\$\w\.\/\\]+(\s+as\s+@\d+L\d+P\d+::\s*[\$\w]+)?(\s*,@\d+L\d+P\d+::\s*[\$\w]+)*(\[@\d+L\d+P\d+::\s*\]\s*)?)[;\r\n]/g,
        include: /\s*@include\s+[\$\w\.\s\/\\]+?[;\r\n]+/g,
        return: /[\s;\r\n]+$/g,
        extends: /(@\d+L\d+P\d+O*\d*::)?((ns|namespace|stroe|extends)\s+[\$\w\.]+\s*\{[^\{\}]*?\})/g,
        class: /(@\d+L\d+P\d+O*\d*::)?((class|expands)\s+([\$\w\.]+\s+)?(extends\s+[\$\w\.]+\s*)?\{[^\{\}]*?\})/g,
        fnlike: /(@\d+L\d+P\d+O*\d*::)?(^|(var|public|let|function|def)\s+)?([\$\w]*\s*\([^\(\)]*\))\s*\{([^\{\}]*?)\}/g,
        parentheses: /(@\d+L\d+P\d+O*\d*::)?\(\s*([^\(\)]*?)\s*\)/g,
        arraylike: /(@\d+L\d+P\d+O*\d*::)?\[(\s*[^\[\]]*?)\s*\]/g,
        call: /(@\d+L\d+P\d+O*\d*::)?((new)\s+([\$\w\.]+)|(\.)?([\$\w]+))\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*([^\$\w\s\{]|[\r\n].|\s*___boundary_[A-Z0-9_]{36}_\d+_as_array___|\s*___boundary_\d+_as_operator___|$)/g,
        arrowfn: /(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*(->|=>)\s*([^,;\r\n]+)\s*(,|;|\r|\n|$)/g,
        closure: /((@\d+L\d+P\d+O*\d*::)?@*[\$\w]+|\))?(@\d+L\d+P\d+O*\d*::)?\s*\{(\s*[^\{\}]*?)\s*\}/g
    }, matchExpr = {
        string: /(\/|\#|`|"|')([\*\/\=])?/,
        strings: {
            // 位置是在replace usings 和 strings 之后才tidy的，所以还存在后接空格
            '/': /(\s*@\d+L\d+P\d+O?\d*::\s*)?(\/[^\/\r\n]+\/[img]*)(\s*)(\sin\s|___boundary_\d+_as_(propname|preoperator|operator|aftoperator|comments)___|([\$\w])|[^\$\w]|$)/,
            '`': /(\s*@\d+L\d+P\d+O*\d*::\s*)?(`[^`]*`)(\s*)(\sin\s|___boundary_\d+_as_(propname|preoperator|operator|aftoperator|comments)___|([\$\w])|[^\$\w]|$|$)/,
            '"': /(\s*@\d+L\d+P\d+O*\d*::\s*)?("[^\"\r\n]*")(\s*)(\sin\s|___boundary_\d+_as_(propname|preoperator|operator|aftoperator|comments)___|([\$\w])|[^\$\w]|$)/,
            "'": /(\s*@\d+L\d+P\d+O*\d*::\s*)?('[^\'\r\n]*')(\s*)(\sin\s|___boundary_\d+_as_(propname|preoperator|operator|aftoperator|comments)___|([\$\w])|[^\$\w]|$)/
        },
        index: /(\d+)_as_([a-z]+)/,
        index3: /^_(\d+)_as_([a-z]+)___([\s\S]*)$/,
        extends: /(ns|namespace|store|extends)\s+(\.)?([\$\w\.]+)\s*\{([^\{\}]*?)\}/,
        class: /(class|dec|expands)\s+(\.)?([\$\w\.]+\s+)?(extends\s+([\$\w\.]+)\s*)?\{([^\{\}]*?)\}/,
        fnlike: /(^|(var|public|let|function|def)\s+)?([\$\w]*)\s*\(([^\(\)]*)\)\s*\{([^\{\}]*?)\}/,
        call: /([\$\w][\$\w\.]*)\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___/,
        arrowfn: /(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*(->|=>)\s*([^,;\r\n]+)/,
        objectattr: /^\s*(@\d+L\d+P\d+O?\d*::)?((([\$\w]+)))\s*(\:*)([\s\S]*)$/,
        classelement: /^\s*(@\d+L\d+P\d+O?\d*::)?((public|static|set|get|om)\s+)?([\$\w]*)\s*(\=*)([\s\S]*)$/,
        travelargs: /^((@\d+L\d+P\d+O*\d*::)?[\$a-zA-Z_][\$\w\.-]+)\s+as\s(@\d+L\d+P\d+O*\d*::)([\$\w]+)(\s*,((@\d+L\d+P\d+O*\d*::)([\$\w]*)))?/
    }, boundaryMaker = function () {
        var radix = 36;
        var uid = new Array(36);
        for (var i = 0; i < 36; i++) {
            uid[i] = zero2z[Math.floor(Math.random() * radix)];
        }
        uid[8] = uid[13] = uid[18] = uid[23] = '_';
        return uid.join('');
    }, stringRepeat = function (string, number) {
        return new Array(number + 1).join(string);
    };
    var Sugar = /** @class */ (function () {
        function Sugar(input, toES6, run) {
            if (toES6 === void 0) { toES6 = false; }
            if (run === void 0) { run = false; }
            this.isMainBlock = true;
            this.namespace = '';
            this.stringReplaceTimes = 65536;
            this.positions = [];
            this.imports = [];
            this.using_as = {};
            this.ast = {};
            this.configinfo = '{}';
            this.toES6 = false;
            this.posimap = [];
            this.tess = {};
            this.closurecount = 0;
            this.uid = boundaryMaker();
            this.markPattern = new RegExp('___boundary_(\\\d+)_as_(mark)___', 'g');
            this.trimPattern = new RegExp('(___boundary_' + this.uid + '_(\\\d+)_as_(string|pattern|template)___|___boundary_(\\\d+)_as_(propname)___)', 'g');
            this.lastPattern = new RegExp('(___boundary_' + this.uid + '_(\\\d+)_as_(string|pattern|template)___|___boundary_(\\\d+)_as_(propname|preoperator|operator|aftoperator|comments)___)', 'g');
            this.input = input;
            this.output = undefined;
            this.replacements = [['{}'], ['/='], ['/'], [' +'], [' -']];
            this.mappings = [];
            if (toES6) {
                this.toES6 = true;
            }
            if (run) {
                this.run();
            }
        }
        Sugar.prototype.compile = function () {
            // console.log(this.input);
            var vars = {
                parent: {
                    fixed: ['window'],
                    fix_map: {}
                },
                self: {
                    this: 'var',
                    arguments: 'var'
                },
                fixed: [],
                fix_map: {},
                type: 'block'
            };
            var lines = this.input.split(/\r{0,1}\n/);
            // console.log(lines);
            var positions = [];
            for (var line = 0; line < lines.length; line++) {
                var elements = lines[line].split(/(,|;|\{|\[|\(|\}|\sas\s|->|=>)/);
                // console.log(elements);
                var newline = [];
                for (var posi = 0, length_1 = 0; posi < elements.length; posi++) {
                    var element = elements[posi];
                    if (posi === 0) {
                        length_1 = 0;
                    }
                    if (element === ',' || element === ';' || element === '{' || element === '[' || element === '(' || element === '}' || element === ' as ' || element === '->' || element === '=>') {
                        newline.push(element);
                    }
                    else {
                        newline.push('@0L' + line + 'P' + length_1 + '::' + element);
                    }
                    length_1 += element.length;
                }
                positions.push(newline);
            }
            // positions[0][0] = positions[0][0].replace('@0L0P0::', '');
            var newlines = positions.map(function (line) {
                return line.join("");
            });
            this.positions.push(positions);
            var newcontent = newlines.join("\r\n");
            // console.log(this.positions);
            this.buildAST(this.pickReplacePosis(this.getLines(this.encode(newcontent), vars), vars), vars);
            // this.output = 'console.log("Hello, world!");';
            this.generate();
            // console.log(this.replacements);
            return this;
        };
        Sugar.prototype.tidy = function (string) {
            var on = true;
            while (on) {
                on = false;
                string = string.replace(/(@\d+L\d+P\d+O?\d*::\s*)+(@\d+L\d+P0::)/g, function (match, last, newline) {
                    // console.log(match);
                    on = true;
                    return "\r\n" + newline;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/[\r\n]*(@\d+L\d+P)0::(\s+)/g, function (match, pre, space) {
                    // console.log(pre, space);
                    on = true;
                    return "\r\n" + pre + space.length + 'O0::';
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(@\d+L\d+P)(\d+)::(\s+)/g, function (match, pre, num, space) {
                    // console.log(pre, num, space);
                    on = true;
                    return pre + (parseInt(num) + space.length) + 'O' + num + '::';
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(\{|\[|\(|\)|\]|\})\s*@\d+L\d+P\d+O?\d*::\s*(\{|\)|\]|\})/g, function (match, before, atfer) {
                    // console.log(match);
                    on = true;
                    return before + atfer;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/@\d+L\d+P([1-9]|\d\d+)::\s*(\)|\]|\})/g, function (match, posi, panbrackets) {
                    // console.log(match);
                    on = true;
                    return panbrackets;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(\s*@\d+L\d+P\d+O?\d*::)+(,|;)/g, function (match, posi, panstop) {
                    // console.log(match);
                    on = true;
                    return panstop;
                });
            }
            return string;
        };
        Sugar.prototype.encode = function (string) {
            var _this = this;
            // console.log(string);
            string = string
                .replace(replaceExpr.await, function (match, gaps, preline, posi, gap) {
                _this.isMainBlock = false;
                if (gaps) {
                    _this.maintag_posi = posi;
                    if (!!gap) {
                        _this.maintag_posi += 'O' + gap.length;
                    }
                }
                else {
                    _this.maintag_posi = '@0L0P0';
                }
                // console.log(gaps, preline, posi, !!gap, gap.length);
                // console.log('This is not a main block.', this.maintag_posi);
                return '';
            })
                .replace(replaceExpr.namespace, function (match, posi, at, gap, namespace) {
                if (_this.namespace === '') {
                    _this.namespace += namespace + '.';
                    _this.namespace_posi = at;
                    if (gap) {
                        _this.namespace_posi += 'O' + gap.length;
                    }
                    // console.log('namespace:' + namespace, this.namespace_posi);
                }
                return '';
            });
            // console.log(string);
            string = this.replaceUsing(string);
            // console.log(string);
            string = this.replaceStrings(string);
            while (string.indexOf('@include') >= 0) {
                string = this.replaceIncludes(string);
            }
            string = this.tidy(string);
            // console.log(string);
            string = string.replace(/(@\d+L\d+P\d+O?\d*::)?((public|static|set|get|om)\s+)?___boundary_[A-Z0-9_]{36}_(\d+)_as_string___\s*(\:|\(|\=)/g, function (match, posi, desc, type, index, after) {
                // console.log(posi, desc, this.replacements[index][1]);
                if (_this.replacements[index][1]) {
                    return /*"\r\n" + */ _this.replacements[index][1] + '___boundary_' + index + '_as_propname___' + after;
                }
                if (desc) {
                    return /*"\r\n" + */ posi + desc + '___boundary_' + index + '_as_propname___' + after;
                }
                return /*"\r\n" + */ '___boundary_' + index + '_as_propname___' + after;
            });
            string = string.replace(/([\$\w]+)\s*(->|=>)/g, "($1)$2");
            // console.log(string);
            // console.log(this.replacements);
            string = this.replaceBrackets(string);
            // console.log(string);
            string = this.replaceBraces(string);
            // console.log(string);
            string = this.replaceParentheses(string);
            // console.log(string);
            string = string
                .replace(/@\d+L\d+P\d+O?\d*::(___boundary_|$)/g, "$1")
                .replace(/\s*(,|;)\s*/g, "$1\r\n");
            // console.log(string);
            // console.log(this.replacements);
            return string;
        };
        Sugar.prototype.replaceUsing = function (string) {
            var _this = this;
            // console.log(string);
            return string.replace(replaceExpr.use, function (match, posi, url, as, more, array) {
                // console.log(match, posi, url, as, more, array);
                var index = _this.replacements.length;
                if (array) {
                    url = url.replace(array, '[]');
                }
                _this.replacements.push([url, posi]);
                return '___boundary_' + _this.uid + '_' + index + '_as_using___;';
            });
        };
        Sugar.prototype.replaceStrings = function (string, ignoreComments) {
            var _this = this;
            if (ignoreComments === void 0) { ignoreComments = false; }
            string = string.replace(/\\+(`|")/g, function (match) {
                var index = _this.replacements.length;
                _this.replacements.push([match]);
                return '___boundary_' + index + '_as_mark___';
            }).replace(/\\[^\r\n](@\d+L\d+P\d+O?\d*::)*/g, function (match) {
                var index = _this.replacements.length;
                _this.replacements.push([match]);
                return '___boundary_' + index + '_as_mark___';
            });
            var count = 0;
            var matches = string.match(matchExpr.string);
            var _loop_1 = function () {
                count++;
                // console.log(count, matches );
                // console.log(matches);
                var index_1 = this_1.replacements.length;
                switch (matches[1]) {
                    case '#':
                        string = string.replace(/(\S*)\s*\#.+/, "$1");
                        matches = string.match(matchExpr.string);
                        return "continue";
                    case '/':
                        switch (matches[2]) {
                            case '*':
                                if (ignoreComments) {
                                    // console.log(true);
                                    string = string.replace(/\/\*{1,2}[\s\S]*?(\*\/|$)/, function (match) {
                                        _this.replacements.push([match]);
                                        return '___boundary_' + index_1 + '_as_comments___';
                                    });
                                }
                                else {
                                    string = string.replace(/\/\*{1,2}[\s\S]*?(\*\/|$)/, "");
                                }
                                matches = string.match(matchExpr.string);
                                return "continue";
                            case '/':
                                string = string.replace(/(\S*)\s*\/\/.*/, "$1");
                                matches = string.match(matchExpr.string);
                                return "continue";
                            case '=':
                                string = string.replace(matches[0], '___boundary_1_as_operator___');
                                matches = string.match(matchExpr.string);
                                return "continue";
                        }
                        break;
                }
                var match = string.match(matchExpr.strings[matches[1]]);
                if (match && (matches.index >= match.index) && !match[6]) {
                    // console.log(matches, match);
                    if (match[1]) {
                        this_1.replacements.push([match[2].replace(/@\d+L\d+P\d+O?\d*::/g, ''), match[1].trim(), match[4]]);
                    }
                    else {
                        this_1.replacements.push([match[2].replace(/@\d+L\d+P\d+O?\d*::/g, ''), void 0, match[4]]);
                    }
                    string = string.replace(match[0], '___boundary_' + this_1.uid + '_' + index_1 + stringas[matches[1]] + match[3] + match[4]);
                }
                else if (matches[0] === '/') {
                    string = string.replace(matches[0], '___boundary_2_as_operator___');
                }
                else {
                    // console.log(string, matches, match);
                    console.log(matches, match);
                    throw 'tangram.js sugar Error: Unexpected `' + matches[1] + '` in `' + this_1.decode(string.substr(matches.index, 256)) + '`';
                }
                matches = string.match(matchExpr.string);
            };
            var this_1 = this;
            while ((count < this.stringReplaceTimes) && matches) {
                _loop_1();
            }
            // console.log(string);
            // console.log(this.replacements);
            return string;
        };
        Sugar.prototype.replaceIncludes = function (string) {
            var _this = this;
            string = string.replace(replaceExpr.include, function (match) {
                return _this.onReadFile(match);
            });
            return this.replaceStrings(this.input);
        };
        Sugar.prototype.onReadFile = function (match) {
            return '';
        };
        Sugar.prototype.replaceBrackets = function (string) {
            var _this = this;
            var left = string.indexOf('[');
            var right = string.indexOf(']');
            var count = 0;
            while ((count < this.stringReplaceTimes) && (left >= 0)) {
                count++;
                // console.log(left, right);
                if (left < right) {
                    string = string.replace(replaceExpr.arraylike, function (match, posi, elements) {
                        // console.log(match);
                        elements = _this.replaceBraces(elements);
                        elements = _this.replaceParentheses(elements);
                        // match = this.replaceOperators(match, false);
                        var index = _this.replacements.length;
                        _this.replacements.push(['[' + elements + ']', posi && posi.trim()]);
                        return '___boundary_' + _this.uid + '_' + index + '_as_array___';
                    });
                    left = string.indexOf('[');
                    right = string.indexOf(']');
                }
                else {
                    if (right >= 0) {
                        var index = right;
                    }
                    else {
                        var index = left;
                    }
                    throw 'tangram.js sugar Error: Unexpected `' + (right >= 0 ? ']' : '[') + '` in `' + this.decode(string.substr(index, 256)) + '`';
                }
            }
            if (right >= 0) {
                var index = right;
                throw 'tangram.js sugar Error: Unexpected `]` in `' + this.decode(string.substr(index, 256)) + '`';
            }
            return string;
        };
        Sugar.prototype.replaceBraces = function (string) {
            var left = string.indexOf('{');
            var right = string.indexOf('}');
            var count = 0;
            while ((count < this.stringReplaceTimes) && (left >= 0)) {
                count++;
                // console.log(left, right);
                if (left < right) {
                    string = this.replaceCodeSegments(string);
                    left = string.indexOf('{');
                    right = string.indexOf('}');
                }
                else {
                    if (right >= 0) {
                        var index = right;
                    }
                    else {
                        var index = left;
                    }
                    throw 'tangram.js sugar Error: Unexpected `' + (right >= 0 ? '}' : '{') + '` in `' + this.decode(string.substr(index, 256)) + '`';
                }
            }
            if (right >= 0) {
                var index = right;
                throw 'tangram.js sugar Error: Unexpected `}` in `' + this.decode(string.substr(index, 256)) + '`';
            }
            return string;
        };
        Sugar.prototype.replaceCodeSegments = function (string) {
            var _this = this;
            if (string.match(replaceExpr.class)) {
                return string.replace(replaceExpr.class, function (match, posi, body) {
                    body = _this.replaceParentheses(body);
                    // body = this.replaceOperators(body, false);
                    var index = _this.replacements.length;
                    _this.replacements.push([body, posi && posi.trim()]);
                    return '___boundary_' + _this.uid + '_' + index + '_as_class___';
                });
            }
            if (string.match(replaceExpr.extends)) {
                return string.replace(replaceExpr.extends, function (match, posi, body) {
                    body = _this.replaceParentheses(body);
                    // body = this.replaceOperators(body, false);
                    var index = _this.replacements.length;
                    _this.replacements.push([body, posi && posi.trim()]);
                    return '___boundary_' + _this.uid + '_' + index + '_as_extends___';
                });
            }
            if (string.match(replaceExpr.fnlike)) {
                return string.replace(replaceExpr.fnlike, function (match, posi, typewithgap, type, call, closure) {
                    // console.log(match);
                    closure = _this.replaceParentheses(closure);
                    call = _this.replaceOperators(call, false);
                    match = (typewithgap || '') + call + ' {' + closure + '}';
                    var index = _this.replacements.length;
                    // console.log(match);
                    _this.replacements.push([match, posi && posi.trim()]);
                    return '___boundary_' + _this.uid + '_' + index + '_as_function___';
                });
            }
            return string.replace(replaceExpr.closure, function (match, word, posi2, posi3, closure) {
                // console.log(match, '|', word, '|', posi2, '|', posi3, '|', closure);
                if (!word && match.match(/\s*\{\s*\}/)) {
                    return '___boundary_0_as_mark___';
                }
                closure = _this.replaceParentheses(closure);
                // closure = this.replaceOperators(closure, false);
                // console.log(closure);
                if (posi2) {
                    word = word.replace(posi2, '');
                    posi2 = posi2.trim();
                }
                else {
                    posi2 = '';
                }
                if (posi3) {
                    posi3 = posi3.trim();
                }
                else {
                    posi3 = '';
                }
                var index = _this.replacements.length;
                if (word === '@config') {
                    if (_this.configinfo === '{}') {
                        _this.configinfo_posi = posi2 || posi3;
                        _this.configinfo = _this.decode(match.replace('@config', ''));
                    }
                    return '';
                }
                if (word === 'return') {
                    _this.replacements.push(['{' + closure + '}']);
                    // console.log(posi2, posi3);
                    var index2 = _this.replacements.length;
                    _this.replacements.push(['return ', posi2]);
                    return '___boundary_' + index2 + '_as_preoperator___ ___boundary_' + _this.uid + '_' + index + '_as_object___';
                }
                if ((word && (word != 'return')) ||
                    (closure.indexOf(';') >= 0) ||
                    // !closure.match(/^\s*\{\s*(public|static|set|get|om)\s+)?(___boundary_[A-Z0-9_]{36}_(\d+)_as_function___|\|)(,|$)/)) {
                    closure.match(/^\s*___boundary_[A-Z0-9_]{36}_\d+_as_[^f]\w+___/)) {
                    // console.log(closure);
                    _this.replacements.push(['{' + closure + '}', posi3]);
                    return posi2 + (word || '') + posi3 + ' ___boundary_' + _this.uid + '_' + index + '_as_closure___;';
                }
                // console.log(closure);
                _this.replacements.push(['{' + closure + '}', posi3]);
                return '___boundary_' + _this.uid + '_' + index + '_as_object___';
            });
        };
        Sugar.prototype.replaceParentheses = function (string) {
            var _this = this;
            var left = string.indexOf('(');
            var right = string.indexOf(')');
            var count = 0;
            while ((count < this.stringReplaceTimes) && (left >= 0)) {
                count++;
                // console.log(left, right);
                if (left < right) {
                    string = string.replace(replaceExpr.parentheses, function (match, posi, paramslike) {
                        // console.log(match, '=>', paramslike);
                        paramslike = _this.replaceCalls(paramslike);
                        paramslike = _this.replaceOperators(paramslike, false);
                        paramslike = _this.replaceArrowFunctions(paramslike);
                        var index = _this.replacements.length;
                        _this.replacements.push(['(' + paramslike + ')', posi && posi.trim()]);
                        return '___boundary_' + _this.uid + '_' + index + '_as_parentheses___';
                    });
                    // console.log(string);
                    left = string.indexOf('(');
                    right = string.indexOf(')');
                }
                else {
                    if (right >= 0) {
                        var index = right;
                    }
                    else {
                        var index = left;
                    }
                    // console.log(string);
                    throw 'tangram.js sugar Error: Unexpected `' + (right >= 0 ? ')' : '(') + '` in `' + this.decode(string.substr(index, 256)) + '`';
                }
            }
            if (right >= 0) {
                var index = right;
                throw 'tangram.js sugar Error: Unexpected `)` in `' + this.decode(string.substr(index, 256)) + '`';
            }
            string = this.replaceCalls(string);
            string = this.replaceOperators(string, false);
            string = this.replaceArrowFunctions(string);
            return string;
        };
        Sugar.prototype.replaceCalls = function (string) {
            var _this = this;
            // console.log(string);
            return string.replace(replaceExpr.call, function (match, posi, fullname, constructor, methodname, dot, callname, args, argindex, after) {
                if (fullname.match(replaceExpr.call)) {
                    fullname = _this.replaceCalls(fullname);
                }
                var index = _this.replacements.length;
                if (constructor) {
                    _this.replacements.push([fullname + args, posi && posi.trim()]);
                    return '___boundary_' + _this.uid + '_' + index + '_as_construct___' + after;
                }
                else {
                    _this.replacements.push([callname + args, posi && posi.trim()]);
                    if (dot) {
                        return '.___boundary_' + _this.uid + '_' + index + '_as_method___' + after;
                    }
                    return '___boundary_' + _this.uid + '_' + index + '_as_call___' + after;
                }
            });
        };
        Sugar.prototype.replaceOperators = function (string, toMin) {
            var _this = this;
            if (toMin === void 0) { toMin = false; }
            var on = true;
            while (on) {
                on = false;
                string = string.replace(operators.owords, function (match, word) {
                    // console.log(match);
                    on = true;
                    var index = _this.replacements.length;
                    _this.replacements.push([' ' + word + ' ']);
                    return '___boundary_' + index + '_as_operator___';
                });
            }
            // console.log(string);
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.swords, function (match, before, word, right) {
                    // console.log(match, before, word);
                    on = true;
                    var index = _this.replacements.length;
                    if ((word === 'typeof') || (word === 'instanceof')) {
                        // console.log(match, before, word)
                        _this.replacements.push([' ' + word + ' ']);
                        before = before.trim();
                    }
                    else {
                        _this.replacements.push([word + ' ']);
                    }
                    return before + '___boundary_' + index + '_as_preoperator___' + right;
                });
            }
            on = true;
            while (on) {
                // console.log(string);
                on = false;
                string = string.replace(operators.mixed, function (match, left, posi, op, right, sign) {
                    // console.log(string);
                    // console.log(match, left, op, right, sign);
                    on = true;
                    if (sign) {
                        var _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '___boundary_' + _index + '_as_preoperator___');
                    }
                    var index = _this.replacements.length;
                    if (toMin) {
                        _this.replacements.push([op + '=']);
                    }
                    else {
                        _this.replacements.push([' ' + op + '= ']);
                    }
                    return left + '___boundary_' + index + '_as_operator___' + right;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.bool, function (match, left, posi, op, right, sign) {
                    // console.log(match);
                    on = true;
                    if (sign) {
                        var _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '___boundary_' + _index + '_as_preoperator___');
                    }
                    var index = _this.replacements.length;
                    if (toMin) {
                        _this.replacements.push([op]);
                    }
                    else {
                        _this.replacements.push([' ' + op + ' ']);
                    }
                    return left + '___boundary_' + index + '_as_operator___' + right;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.op, function (match, left, posi, op, right, sign) {
                    // console.log(match);
                    on = true;
                    if (sign) {
                        var _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '___boundary_' + _index + '_as_preoperator___');
                    }
                    var index = _this.replacements.length;
                    if (toMin) {
                        _this.replacements.push([op]);
                    }
                    else {
                        _this.replacements.push([' ' + op + ' ']);
                    }
                    return left + '___boundary_' + index + '_as_operator___' + right;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.sign, function (match, before, posi, sign, number) {
                    on = true;
                    // let index = this.replacements.length;
                    // this.replacements.push(' ' + sign);
                    var index = sign === '+' ? 3 : 4;
                    return before + '___boundary_' + index + '_as_preoperator___' + number;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.before, function (match, op, number) {
                    on = true;
                    var index = _this.replacements.length;
                    _this.replacements.push([op]);
                    return '___boundary_' + index + '_as_preoperator___' + number;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.after, function (match, number, op) {
                    on = true;
                    var index = _this.replacements.length;
                    _this.replacements.push([op]);
                    return number + '___boundary_' + index + '_as_aftoperator___';
                });
            }
            return string.replace(operators.error, function (match, before, op, after) {
                console.log(match, string);
                throw 'tangram.js sugar Error: Unexpected `' + op + '` in `' + _this.decode(match) + '`';
            });
        };
        Sugar.prototype.replaceArrowFunctions = function (string) {
            var _this = this;
            var arrow = string.match(/(->|=>)/);
            // console.log(arrow);
            if (arrow) {
                if (string.match(replaceExpr.arrowfn)) {
                    // console.log(string.match(matchExpr.arrowfn));
                    return string.replace(replaceExpr.arrowfn, function (match, params, paramsindex, arrow, body, end) {
                        // console.log(match, params, paramsindex, arrow, body, end);
                        // console.log(body);
                        var posi = _this.replacements[paramsindex][1];
                        // console.log(match);
                        // console.log(body);
                        var matches = body.match(/^\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_(parentheses|object|closure)___\s*$/);
                        // console.log(matches);
                        if (matches) {
                            var code = _this.replacements[matches[1]][0];
                            var posi_1 = _this.replacements[matches[1]][1];
                            if (matches[2] === 'parentheses') {
                                body = code.replace(/^\(\s*(.*?)\s*\)$/, function (match, code) {
                                    var index = _this.replacements.length;
                                    _this.replacements.push(['return ', posi_1]);
                                    return '___boundary_' + index + '_as_preoperator___ ' + code;
                                });
                            }
                            else {
                                // console.log(code);
                                body = code.replace(/(^\{|\}$)/g, '');
                            }
                        }
                        else {
                            var index_2 = _this.replacements.length;
                            _this.replacements.push(['return ', void 0]);
                            body = '___boundary_' + index_2 + '_as_preoperator___ ' + body;
                            // console.log(body);
                        }
                        var index = _this.replacements.length;
                        _this.replacements.push([params + arrow + body, posi]);
                        return '___boundary_' + _this.uid + '_' + index + '_as_arrowfn___' + end;
                    });
                }
                else {
                    // console.log(string);
                    throw 'tangram.js sugar Error: Unexpected `' + arrow[0] + '` in `' + this.decode(string.substr(arrow.index, 256)) + '`';
                }
            }
            return string;
        };
        Sugar.prototype.getPosition = function (string) {
            if (string) {
                var match = string.match(/@(\d+)L(\d+)P(\d+)(O*)(\d*):*/);
                if (match) {
                    if (match[4]) {
                        var ocol = parseInt(match[5]);
                    }
                    else {
                        var ocol = parseInt(match[3]);
                    }
                    return {
                        match: match[0],
                        head: !ocol,
                        file: parseInt(match[1]),
                        line: parseInt(match[2]) + 1,
                        col: parseInt(match[3]) + 1,
                        o: [parseInt(match[1]), parseInt(match[2]), ocol]
                    };
                }
            }
            return void 0;
        };
        Sugar.prototype.getLines = function (string, vars) {
            string = string
                .replace(/::(var|let|public)\s+(@\d+L\d+P(\d+O)?0::)/g, '::$1 ')
                .replace(/([^,;\s])\s*(@\d+L\d+P(\d+O)?0::)/g, '$1;$2')
                .replace(/(___boundary_[A-Z0-9_]{36}_\d+_as_(class)___)([\r\n]+)/, "$1;\r\n");
            var array = string.split(/\s*;+\s*/);
            var lines = [];
            // console.log(array);
            for (var index_3 = 0; index_3 < array.length; index_3++) {
                var line = array[index_3].trim();
                // console.log(line);
                if (line) {
                    var spilitarray = line.split(/::(var|let|public)\s+/);
                    // console.log(spilitarray);
                    // continue;
                    if (spilitarray.length === 1) {
                        var errsymbol = line.match(/(^|\s+)(var|let|public)(\s+|$)/);
                        if (errsymbol) {
                            // console.log(line);
                            throw 'tangram.js sugar Error: Unexpected `' + errsymbol + '` in `' + this.decode(line) + '`.';
                        }
                        else {
                            // console.log(line);
                            this.pushSentenceToLines(lines, line);
                        }
                    }
                    else if (spilitarray.length === 3) {
                        var sentences = spilitarray[2].split(/,\s*(@\d+L\d+P\d+O?\d*::)/);
                        sentences.unshift(spilitarray[0]);
                        for (var p = 0; p < sentences.length; p += 2) {
                            this.pushVariablesToLine(lines, vars, sentences[p], sentences[p + 1], spilitarray[1]);
                        }
                        // console.log(spilitarray, sentences);
                    }
                    else {
                        // console.log(spilitarray[3], spilitarray);
                        var position = this.getPosition(spilitarray[2]);
                        throw 'tangram.js sugar Error: Unexpected `' + spilitarray[3] + '` at char ' + position.col + ' on line ' + position.line + '， near ' + this.decode(spilitarray[2]) + '.';
                    }
                }
            }
            // console.log(lines);
            return lines;
        };
        Sugar.prototype.pushSentenceToLines = function (lines, string) {
            string = string.trim();
            if (string && !string.match(/^@\d+L\d+P\d+O?\d*::$/)) {
                var match = string.match(/^___boundary_[A-Z0-9_]{36}_(\d+)_as_([a-z]+)___([\r\n]+|$)/);
                if (match) {
                    lines.push({
                        type: 'line',
                        subtype: match[2],
                        index: match[1],
                        value: string
                    });
                }
                else {
                    // console.log(string)
                    // string += ';';
                    var strings = string.split(',');
                    // console.log(strings);
                    for (var index_4 = 0; index_4 < strings.length; index_4++) {
                        var element = strings[index_4];
                        var position = this.getPosition(string);
                        // console.log(position, string)
                        if (position) {
                            position.head = true;
                            var value = element.replace(position.match, '');
                        }
                        else {
                            var value = string.trim();
                            var match_2 = value.match(/^___boundary_(\d+)_as_([a-z]+)___/);
                            // console.log(value, match, this.getPosition(this.replacements[match[1]][1]));
                            if (match_2 && this.replacements[match_2[1]][1]) {
                                position = this.getPosition(this.replacements[match_2[1]][1]);
                                if (position) {
                                    position.head = true;
                                }
                            }
                        }
                        lines.push({
                            type: 'line',
                            subtype: 'sentence',
                            posi: position,
                            value: value + ';'
                        });
                    }
                }
            }
        };
        Sugar.prototype.pushVariablesToLine = function (lines, vars, posi, line, symbol) {
            if (line) {
                if (this.toES6 && symbol !== 'public') {
                    var _symbol = symbol;
                }
                else {
                    var _symbol = 'var';
                }
                var position = this.getPosition(posi);
                var array = line.split(/\s*=\s*/);
                // console.log(array);
                if (array.length === 1) {
                    var value = 'void 0';
                }
                else {
                    var value = array.pop();
                }
                for (var index_5 = 0; index_5 < array.length; index_5++) {
                    var element = array[index_5].trim();
                    if (element.match(/^[\$\w]+$/)) {
                        // console.log(element);
                        if (vars.self[element] === void 0) {
                            vars.self[element] = symbol;
                        }
                        else if (vars.self[element] === 'let' || symbol === 'let') {
                            throw 'tangram.js sugar Error:  Variable `' + element + '` has already been declared at char ' + position.col + ' on line ' + position.line + '.';
                        }
                        position.head = true;
                        if (index_5) {
                            lines.push({
                                type: 'line',
                                subtype: 'variable',
                                posi: position,
                                display: 'block',
                                value: _symbol + ' ' + element + ' = ' + value + ';'
                            });
                        }
                        else {
                            lines.push({
                                type: 'line',
                                subtype: 'variable',
                                posi: position,
                                display: 'inline',
                                value: _symbol + ' ' + element + ' = '
                            });
                            lines.push({
                                type: 'line',
                                subtype: 'sentence',
                                posi: void 0,
                                value: value + ';'
                            });
                        }
                        value = element;
                    }
                    else {
                        // console.log(element);
                        throw 'tangram.js sugar Error: Unexpected Definition `' + symbol + ' at char ' + position.col + ' on line ' + position.line + '.';
                    }
                }
            }
        };
        Sugar.prototype.pickReplacePosis = function (lines, vars) {
            var imports = [], using_as = {}, preast = [];
            for (var index_6 = 0; index_6 < lines.length; index_6++) {
                // console.log(lines[index]);
                switch (lines[index_6].subtype) {
                    case 'sentence':
                        // console.log(lines[index]);
                        var line = lines[index_6].value.trim();
                        if (line) {
                            var inline = [];
                            var array = line.split('___boundary_' + this.uid);
                            while (!array[0].trim()) {
                                // console.log(true, array[0])
                                array.shift();
                            }
                            // console.log(array)
                            for (var i = 0; i < array.length; i++) {
                                var element = array[i].trim();
                                if (element) {
                                    var matches = element.match(matchExpr.index3);
                                    // console.log(matches);
                                    if (matches) {
                                        var match_3 = matches[3].trim();
                                        if (match_3) {
                                            inline.push({
                                                index: matches[1],
                                                type: matches[2]
                                            });
                                            var splits = match_3.split(/[\r\n]+/);
                                            for (var l = 0; l < splits.length; l++) {
                                                var element_1 = splits[l].trim();
                                                if (element_1) {
                                                    this.pushCodeToAST(inline, vars, element_1, undefined, false);
                                                }
                                            }
                                        }
                                        else {
                                            if (array.length === 1) {
                                                inline.push({
                                                    index: matches[1],
                                                    display: 'blcok',
                                                    type: matches[2]
                                                });
                                            }
                                            else {
                                                inline.push({
                                                    index: matches[1],
                                                    type: matches[2]
                                                });
                                            }
                                        }
                                    }
                                    else {
                                        // console.log(array[0], lines[index].posi);
                                        var splits = array[0].split(/[\r\n]+/);
                                        // console.log(splits, array.length);
                                        for (var l = 0; l < splits.length; l++) {
                                            var element_2 = splits[l].trim();
                                            if (element_2) {
                                                this.pushCodeToAST(inline, vars, element_2, (l === 0) && lines[index_6].posi, (array.length === 1));
                                            }
                                        }
                                    }
                                }
                            }
                            preast.push(inline);
                        }
                        break;
                    case 'variable':
                        preast.push([{
                                type: 'code',
                                posi: lines[index_6].posi,
                                display: lines[index_6].display,
                                vars: vars,
                                value: lines[index_6].value.trim()
                            }]);
                        break;
                    case 'using':
                        // console.log(lines[index]);
                        var src = this.replacements[lines[index_6].index][0].replace(replaceExpr.using, '').replace(replaceExpr.return, '');
                        var posi = this.replacements[lines[index_6].index][1];
                        var srcArr = src.split(/\s+as\s+/);
                        // console.log(srcArr);
                        if (srcArr[1] && srcArr[1].trim()) {
                            src = srcArr[0].trim();
                            if (!imports['includes'](src)) {
                                imports.push(src);
                                imports.push(posi);
                            }
                            var array = srcArr[1].split(',');
                            // console.log(array);
                            for (var index_7 = 0; index_7 < array.length; index_7++) {
                                var element = array[index_7].trim();
                                if (element) {
                                    // console.log(element);
                                    var match = element.match(/^(@\d+L\d+P\d+::)\s*([\$\w]+)(\[\])?$/);
                                    var position = this.getPosition(match[1]);
                                    if (match[3]) {
                                        var alias = element.replace(match[0], match[2]);
                                        using_as[alias] = [src, position];
                                        var varname = alias;
                                        break;
                                    }
                                    else {
                                        var alias = element.replace(match[1], '');
                                        using_as[element] = [src, position, index_7];
                                        var varname = element;
                                    }
                                    if (vars.self[varname] === void 0) {
                                        vars.self[varname] = 'var';
                                    }
                                    else if (vars.self[varname] === 'let') {
                                        throw 'tangram.js sugar Error:  Variable `' + varname + '` has already been declared.';
                                    }
                                }
                            }
                        }
                        else {
                            imports.push(src);
                            imports.push(posi);
                        }
                        break;
                    default:
                        preast.push([{
                                index: lines[index_6].index,
                                display: 'block',
                                type: lines[index_6].subtype
                            }]);
                        break;
                }
            }
            this.imports = imports;
            this.using_as = using_as;
            console.log(using_as);
            // console.log(imports, preast);
            return preast;
        };
        Sugar.prototype.buildAST = function (preast, vars) {
            console.log(preast);
            var ast = {
                type: 'codes',
                vars: vars,
                body: []
            };
            for (var index_8 = 0; index_8 < preast.length; index_8++) {
                var block = preast[index_8];
                if (block.length === 1) {
                    var element = block[0];
                    if (element.type === 'code') {
                        ast.body.push(element);
                    }
                    else {
                        ast.body.push(this.walk(element, vars));
                    }
                }
                else {
                    var codes = {
                        type: 'codes',
                        vars: vars,
                        body: []
                    };
                    for (var index_9 = 0; index_9 < block.length; index_9++) {
                        var element = block[index_9];
                        if (element.type === 'code') {
                            // console.log(index, element);
                            // element.display = index ? 'inline' : 'block';
                            codes.body.push(element);
                        }
                        else {
                            codes.body.push(this.walk(element, vars));
                        }
                    }
                    ast.body.push(codes);
                }
            }
            // console.log(ast, this.replacements);
            this.ast = ast;
            return this;
        };
        Sugar.prototype.pushBodyToAST = function (body, vars, code) {
            if (body === void 0) { body = []; }
            var lines = code ? this.getLines(code, vars) : [];
            // console.log(lines);
            for (var index_10 = 0; index_10 < lines.length; index_10++) {
                switch (lines[index_10].subtype) {
                    case 'sentence':
                        var line = lines[index_10].value.trim();
                        this.pushSentencesToAST(body, vars, line, lines[index_10].posi);
                        break;
                    case 'variable':
                        body.push([{
                                type: 'code',
                                posi: lines[index_10].posi,
                                display: lines[index_10].display,
                                vars: vars,
                                value: lines[index_10].value.trim()
                            }]);
                        break;
                    default:
                        body.push(this.walk({
                            index: lines[index_10].index,
                            display: 'block',
                            type: lines[index_10].subtype
                        }, vars));
                        break;
                }
            }
            return body;
        };
        Sugar.prototype.pushSentencesToAST = function (body, vars, code, position, isFullLine) {
            if (body === void 0) { body = []; }
            if (isFullLine === void 0) { isFullLine = true; }
            if (code) {
                var inline = [];
                var array = code.split('___boundary_' + this.uid);
                // console.log(array);
                while (array.length && !array[0].trim()) {
                    array.shift();
                }
                // console.log(array);
                if (array.length === 1) {
                    this.pushReplacementsToAST(body, vars, array[0], position, isFullLine);
                }
                else {
                    for (var index_11 = 0; index_11 < array.length; index_11++) {
                        this.pushReplacementsToAST(inline, vars, array[index_11], position, false);
                    }
                    body.push({
                        type: 'codes',
                        vars: vars,
                        body: inline
                    });
                }
            }
            return body;
        };
        Sugar.prototype.pushReplacementsToAST = function (body, vars, code, position, onlyone) {
            // console.log(code);
            code = code.trim();
            if (code) {
                var matches = code.match(matchExpr.index3);
                // console.log(code, matches);
                if (matches) {
                    var match_3 = matches[3].trim();
                    if (match_3) {
                        body.push(this.walk({
                            index: matches[1],
                            type: matches[2]
                        }, vars));
                        var array = match_3.split(/[\r\n]+/);
                        for (var index_12 = 0; index_12 < array.length; index_12++) {
                            var element = array[index_12].trim();
                            if (element) {
                                this.pushCodeToAST(body, vars, element, undefined, onlyone);
                            }
                        }
                    }
                    else {
                        if (onlyone) {
                            body.push(this.walk({
                                index: matches[1],
                                display: 'block',
                                type: matches[2]
                            }, vars));
                        }
                        else {
                            body.push(this.walk({
                                index: matches[1],
                                type: matches[2]
                            }, vars));
                        }
                    }
                }
                else {
                    var array = code.split(/[\r\n]+/);
                    // console.log(array);
                    for (var index_13 = 0; index_13 < array.length; index_13++) {
                        var element = array[index_13].trim();
                        if (element) {
                            this.pushCodeToAST(body, vars, element, (index_13 === 0) && position, onlyone);
                        }
                    }
                }
            }
            return body;
        };
        Sugar.prototype.pushCodeToAST = function (body, vars, code, position, onlyone) {
            var display = 'inline';
            // console.log(code, position);
            position = position || this.getPosition(code);
            // console.log(code, position);
            if (position) {
                var element = code.replace(position.match, '').trim();
                if (position.head) {
                    if (element.indexOf('.') === 0) {
                        display = 'member';
                    }
                    else if (onlyone) {
                        display = 'blcok';
                    }
                }
            }
            else {
                var element = code;
            }
            // console.log(position);
            if (element) {
                body.push({
                    type: 'code',
                    posi: position,
                    vars: vars,
                    display: display,
                    value: element
                });
            }
            return body;
        };
        Sugar.prototype.walk = function (element, vars) {
            if (vars === void 0) { vars = false; }
            // console.log(element);
            switch (element.type) {
                case 'array':
                    return this.walkArray(element.index, undefined, vars);
                case 'arrowfn':
                    return this.walkArrowFn(element.index, undefined, vars);
                case 'call':
                case 'method':
                case 'construct':
                    return this.walkCall(element.index, element.display, vars, element.type);
                case 'class':
                    return this.walkClass(element.index, element.display, vars);
                case 'closure':
                    return this.walkClosure(element.index, element.display, vars);
                case 'extends':
                    return this.walkExtends(element.index, element.display, vars);
                case 'function':
                    return this.walkFnLike(element.index, element.display, vars, 'def');
                case 'object':
                    return this.walkObject(element.index, undefined, vars);
                case 'parentheses':
                    return this.walkParentheses(element.index, undefined, vars);
                case 'pattern':
                case 'string':
                case 'template':
                    var that_1 = this;
                    var position = this.getPosition(this.replacements[element.index][1]);
                    // console.log(position);
                    return {
                        type: 'code',
                        posi: position,
                        display: 'inline',
                        vars: vars,
                        value: this.replacements[element.index][0].replace(this.markPattern, function () {
                            return that_1.replacements[arguments[1]][0];
                        })
                    };
                default:
                    return {
                        type: 'code',
                        posi: void 0,
                        display: 'hidden',
                        vars: vars,
                        value: ""
                    };
            }
        };
        Sugar.prototype.walkArray = function (index, display, vars) {
            var body = [], position = this.getPosition(this.replacements[index][1]), array = this.replacements[index][0].replace(/([\[\s\]])/g, '').split(',');
            // console.log(this.replacements[index]);
            for (var index_14 = 0; index_14 < array.length; index_14++) {
                this.pushSentencesToAST(body, vars, array[index_14], this.getPosition(array[index_14]), false);
            }
            return {
                type: 'array',
                posi: position,
                display: 'inline',
                vars: vars,
                body: body
            };
        };
        Sugar.prototype.walkArrowFn = function (index, display, vars) {
            var matches = this.replacements[index][0].match(matchExpr.arrowfn);
            // console.log(this.replacements[index], matches);
            var subtype = 'fn';
            var selfvas = {
                this: 'var',
                arguments: 'var'
            };
            if (matches[3] === '=>') {
                subtype = '=>';
                selfvas = {
                    this: 'let',
                    arguments: 'let'
                };
            }
            var localvars = {
                parent: vars,
                self: selfvas,
                fixed: [],
                fix_map: {},
                type: 'fnbody'
            };
            var args = this.checkArgs(this.replacements[matches[2]][0].replace(/(^\(|\)$)/g, ''), localvars);
            return {
                type: 'def',
                posi: this.getPosition(this.replacements[index][1]),
                display: 'inline',
                subtype: subtype,
                args: args.keys,
                defaults: args.vals,
                body: this.checkFnBody(localvars, args, matches[4])
            };
        };
        Sugar.prototype.walkCall = function (index, display, vars, type) {
            var name = [], params = [], matches = this.replacements[index][0].match(matchExpr.call), nameArr = matches[1].split('___boundary_' + this.uid), paramArr = this.replacements[matches[2]][0].split(/([\(,\)])/);
            // console.log(this.getLines(this.replacements[matches[2]][0], vars));
            // console.log(this.replacements[index], matches);
            for (var i = 0; i < nameArr.length; i++) {
                var element_3 = nameArr[i];
                if (element_3) {
                    this.pushReplacementsToAST(name, vars, nameArr[i], undefined, false);
                }
            }
            // console.log(matches, paramArr);
            for (var index_15 = 0; index_15 < paramArr.length; index_15++) {
                var position = this.getPosition(paramArr[index_15]);
                if (position) {
                    var element = paramArr[index_15].replace(position.match, '').trim();
                }
                else {
                    var element = paramArr[index_15].trim();
                }
                var line = element.split('___boundary_' + this.uid);
                if (element && element != '(' && element != ')' && element != ',') {
                    // console.log(index, element, position);
                    var inline = [];
                    for (var i = 0; i < line.length; i++) {
                        this.pushReplacementsToAST(inline, vars, line[i], (i === 0) && position, false);
                    }
                    params.push({
                        type: 'parameter',
                        posi: position,
                        vars: vars,
                        body: inline
                    });
                }
            }
            // console.log(this.replacements[index]);
            return {
                type: type,
                posi: this.getPosition(this.replacements[index][1]),
                display: display || 'inline',
                name: name,
                vars: vars,
                params: params
            };
        };
        Sugar.prototype.walkClass = function (index, display, vars) {
            if (vars === void 0) { vars = true; }
            // console.log(this.replacements[index]);
            var matches = this.replacements[index][0].match(matchExpr.class);
            // console.log(matches);
            var type = matches[1];
            if (matches[2]) {
                var subtype = 'stdClass';
            }
            else {
                if (type === 'dec') {
                    var subtype = 'stdClass';
                }
                else {
                    var subtype = 'anonClass';
                }
            }
            var cname = matches[3] && matches[3].trim();
            if (type === 'class') {
                if (subtype === 'anonClass') {
                    if (cname) {
                        if (vars.self[cname] === void 0) {
                            vars.self[cname] = 'var';
                        }
                        else if (vars.self[cname] === 'let') {
                            throw 'tangram.js sugar Error:  Variable `' + cname + '` has already been declared.';
                        }
                        // vars.self.push('var ' + cname);
                    }
                }
                // 标准类必须是块元素，否则无地方拓展静态属性和方法
            }
            return {
                type: type,
                posi: this.getPosition(this.replacements[index][1]),
                display: display,
                subtype: subtype,
                cname: cname,
                base: matches[5],
                vars: vars,
                body: this.checkClassBody(vars, matches[6] || '')
            };
        };
        Sugar.prototype.walkClosure = function (index, display, vars) {
            // console.log(this.replacements[index]);
            var localvars = {
                parent: vars,
                self: {},
                fixed: [],
                fix_map: {},
                type: 'codes'
            };
            var array = this.replacements[index][0].split(/\s*(\{|\})\s*/);
            var position = this.getPosition(this.replacements[index][1]);
            var body = this.pushBodyToAST([], localvars, array[2]);
            for (var varname in localvars.self) {
                if (localvars.self.hasOwnProperty(varname)) {
                    if (vars.self[varname] === void 0) {
                        vars.self[varname] = 'var';
                    }
                    else if (vars.self[varname] === 'let') {
                        throw 'tangram.js sugar Error:  Variable `' + varname + '` has already been declared.';
                    }
                }
            }
            // console.log(array);
            return {
                type: 'closure',
                posi: position,
                display: display,
                vars: localvars,
                body: body
            };
        };
        Sugar.prototype.walkExtends = function (index, display, vars) {
            // console.log(this.replacements[index]);
            var matches = this.replacements[index][0].match(matchExpr.extends);
            var position = this.getPosition(this.replacements[index][1]);
            var subtype = 'ext';
            var objname = matches[3];
            // console.log(matches);
            if ((matches[1] === 'ns') || (matches[1] === 'namespace')) {
                subtype = 'ns';
                var localvars = {
                    parent: vars,
                    self: {
                        this: 'var',
                        arguments: 'var'
                    },
                    fixed: [],
                    fix_map: {},
                    type: 'fnbody'
                };
                vars = localvars;
                var body = this.checkFnBody(localvars, {
                    keys: [],
                    keysArray: void 0,
                    vals: []
                }, matches[4]);
            }
            else {
                if (matches[2]) {
                    subtype = 'extns';
                }
                var body = this.checkObjMember(vars, matches[4]);
            }
            // console.log(matches);
            return {
                type: 'extends',
                posi: position,
                display: display,
                subtype: subtype,
                oname: objname,
                vars: vars,
                body: body
            };
        };
        Sugar.prototype.walkFnLike = function (index, display, vars, type) {
            // console.log(this.replacements[index]);
            var matches = this.replacements[index][0].match(matchExpr.fnlike);
            var fname = matches[3] !== 'function' ? matches[3] : '';
            // if (!matches) {
            //     console.log(posi, this.replacements);
            // } else {
            //     console.log((matches);
            // }
            if (type === 'def') {
                if (matches[1] == null) {
                    if (reservedWords['includes'](fname)) {
                        var headline = matches[4];
                        var localvars_1 = {
                            parent: vars,
                            self: {},
                            fixed: [],
                            fix_map: {},
                            type: 'codes'
                        };
                        if (fname === 'for') {
                            // console.log(matches);
                            var firstSentence = headline.split(/\s*;\s*/)[0];
                            var match = firstSentence.match(/^\s*(var|let)\s+([\$\w]+\s*=.+)$/);
                            // console.log(firstSentence, match);
                            if (match) {
                                this.pushVariablesToLine([], localvars_1, '', match[2], match[1]);
                            }
                            // console.log(localvars);
                        }
                        var head = this.pushSentencesToAST([], localvars_1, headline, this.getPosition(headline), false);
                        // let head = [], array = headline.split('___boundary_' + this.uid);
                        // for (let index = 0; index < array.length; index++) {
                        //     this.pushReplacementsToAST(head, localvars, array[index], this.getPosition(headline), false);
                        // }
                        var body = this.pushBodyToAST([], localvars_1, matches[5]);
                        for (var varname in localvars_1.self) {
                            if (localvars_1.self.hasOwnProperty(varname)) {
                                if (vars.self[varname] === void 0) {
                                    vars.self[varname] = 'var';
                                }
                                else if (vars.self[varname] === 'let') {
                                    throw 'tangram.js sugar Error:  Variable `' + varname + '` has already been declared.';
                                }
                            }
                        }
                        return {
                            type: 'exp',
                            display: 'block',
                            vars: localvars_1,
                            expression: fname,
                            head: head,
                            body: body
                        };
                    }
                    if (fname === 'each') {
                        var condition = matches[4].match(matchExpr.travelargs);
                        // console.log(matches, condition);
                        if (condition) {
                            var self_1 = {
                                this: 'var',
                                arguments: 'var',
                            }, agrs = [];
                            if (condition[5]) {
                                if (condition[8]) {
                                    self_1[condition[4]] = 'var';
                                    self_1[condition[8]] = 'var';
                                    agrs = [[condition[4], condition[3]], [condition[8], condition[7]]];
                                }
                                else {
                                    self_1[condition[4]] = 'var';
                                    agrs = [[condition[4], condition[3]]];
                                }
                            }
                            else {
                                self_1['_index'] = 'var';
                                self_1[condition[4]] = 'var';
                                agrs = [['_index', undefined], [condition[4], condition[3]]];
                            }
                            var localvars_2 = {
                                parent: vars,
                                self: self_1,
                                fixed: [],
                                fix_map: {},
                                type: 'travel'
                            };
                            var iterator = this.pushSentencesToAST([], localvars_2, condition[1], this.getPosition(condition[2]), false);
                            // let iterator = [], array = condition[1].split('___boundary_' + this.uid);
                            // for (let index = 0; index < array.length; index++) {
                            //     this.pushReplacementsToAST(iterator, localvars, array[index], this.getPosition(condition[1]), false);
                            // }
                            return {
                                type: 'travel',
                                display: 'block',
                                iterator: iterator,
                                vars: localvars_2,
                                callback: {
                                    type: 'def',
                                    display: 'inline',
                                    fname: '',
                                    args: agrs,
                                    body: this.pushBodyToAST([], localvars_2, matches[5])
                                }
                            };
                        }
                    }
                }
                var subtype = matches[2] === 'def' ? 'def' : 'fn';
                var position = this.getPosition(this.replacements[index][1]);
                // console.log(matches);
                if (fname && display === 'block') {
                    if (matches[2]) {
                        if ((matches[2] === 'var') || (matches[2] === 'let')) {
                            if (vars.self[fname] === void 0) {
                                vars.self[fname] = 'var';
                            }
                            else if (vars.self[fname] === 'let' || matches[2] === 'let') {
                                throw 'tangram.js sugar Error:  Variable `' + fname + '` has already been declared.';
                            }
                            subtype = this.toES6 ? matches[2] : 'var';
                        }
                        else if (matches[2] === 'public') {
                            subtype = 'public';
                            // console.log(matches[5]);
                        }
                    }
                }
                else {
                    if (matches[2] === 'public') {
                        subtype = 'public';
                        display = 'block';
                        // console.log(matches[5]);
                    }
                }
            }
            var localvars = {
                parent: vars,
                self: {
                    this: 'var',
                    arguments: 'var'
                },
                fixed: [],
                fix_map: {},
                type: 'fnbody'
            };
            var args = this.checkArgs(matches[4], localvars);
            return {
                type: type,
                vars: localvars,
                posi: this.getPosition(this.replacements[index][1]),
                display: display,
                subtype: subtype,
                fname: fname,
                args: args.keys,
                defaults: args.vals,
                body: this.checkFnBody(localvars, args, matches[5])
            };
        };
        Sugar.prototype.walkParentheses = function (index, display, vars) {
            var body = [], array = this.replacements[index][0].replace(/([\[\s\]])/g, '').split(/\s*([,\r\n]+)/);
            for (var index_16 = 0; index_16 < array.length; index_16++) {
                this.pushSentencesToAST(body, vars, array[index_16], this.getPosition(array[index_16]), false);
                // let line = array[index].split('___boundary_' + this.uid);
                // // let inline: object[] = [];
                // for (let i = 0; i < line.length; i++) {
                //     this.pushReplacementsToAST(body, vars, line[i], this.getPosition(array[index]), false);
                // }
            }
            return {
                type: 'codes',
                display: 'inline',
                vars: vars,
                body: body
            };
        };
        Sugar.prototype.walkObject = function (index, display, vars) {
            if (vars === void 0) { vars = true; }
            return {
                type: 'object',
                posi: this.getPosition(this.replacements[index][1]),
                vars: vars,
                body: this.checkObjMember(vars, this.replacements[index][0])
            };
        };
        Sugar.prototype.checkProp = function (vars, posi, type, attr, array) {
            // console.log(posi);
            // console.log(type, posi, attr, array);
            var position = this.getPosition(posi);
            position.head = true;
            // console.log(position);
            if (array.length > 1) {
                var body = [];
                if (attr[6]) {
                    body.push({
                        type: 'code',
                        posi: void 0,
                        display: 'inline',
                        vars: vars,
                        value: attr[6].trim()
                    });
                }
                for (var index_17 = 1; index_17 < array.length; index_17++) {
                    var element = array[index_17];
                    var matches = element.trim().match(matchExpr.index3);
                    // console.log(matches);
                    if (matches) {
                        body.push(this.walk({
                            index: matches[1],
                            type: matches[2]
                        }, vars));
                        if (matches[3]) {
                            body.push({
                                type: 'code',
                                posi: void 0,
                                display: 'inline',
                                vars: vars,
                                value: matches[3].trim()
                            });
                        }
                    }
                    else {
                        // console.log(element);
                        body.push({
                            type: 'code',
                            posi: void 0,
                            display: 'inline',
                            vars: vars,
                            value: element.trim()
                        });
                    }
                }
                return {
                    type: type,
                    posi: position,
                    pname: attr[4].trim() || 'myAttribute',
                    vars: vars,
                    body: body
                };
            }
            return {
                type: type,
                posi: position,
                pname: attr[4].trim() || 'myAttribute',
                vars: vars,
                body: [
                    {
                        type: 'code',
                        posi: void 0,
                        display: 'inline',
                        vars: vars,
                        value: attr[6].trim()
                    }
                ]
            };
        };
        Sugar.prototype.checkClassBody = function (vars, code) {
            // console.log(code);
            var body = [], array = code.replace('_as_function___', '_as_function___;').split(/[;,\r\n]+/);
            // console.log(code);
            for (var index_18 = 0; index_18 < array.length; index_18++) {
                var element = array[index_18].trim();
                var type = 'method';
                // console.log(element);
                if (element) {
                    var elArr = element.split('___boundary_' + this.uid);
                    // console.log(elArr);
                    if (elArr[0] && elArr[0].trim()) {
                        var match_0 = elArr[0].match(matchExpr.classelement);
                        // console.log(match_0[4].trim(), match_0, elArr);
                        if (match_0) {
                            if (match_0[4].trim()) {
                                switch (match_0[3]) {
                                    case undefined:
                                    case 'public':
                                        type = 'prop';
                                        break;
                                    case 'static':
                                        type = 'staticProp';
                                        break;
                                    default:
                                        throw 'tangram.js sugar Error: Cannot use `' + match_0[3] + '` on property `' + match_0[4] + '`';
                                }
                                if (match_0[5] != '=') {
                                    if ((elArr.length === 1)) {
                                        match_0[6] = 'undefined';
                                    }
                                    else {
                                        continue;
                                    }
                                }
                                body.push(this.checkProp(vars, match_0[1], type, match_0, elArr));
                                continue;
                            }
                            switch (match_0[3]) {
                                case 'om':
                                    type = 'overrideMethod';
                                    break;
                                case 'get':
                                    type = 'getPropMethod';
                                    break;
                                case 'set':
                                    type = 'setPropMethod';
                                    break;
                                case 'static':
                                    // console.log(match_0[5], elArr);
                                    if (match_0[5] === '=') {
                                        match_0[4] = 'static';
                                        if ((elArr.length === 1)) {
                                            match_0[6] = 'undefined';
                                        }
                                        body.push(this.checkProp(vars, match_0[1], 'prop', match_0, elArr));
                                        continue;
                                    }
                                    type = 'staticMethod';
                                    break;
                            }
                        }
                    }
                    if (elArr[1] && elArr[1].trim()) {
                        var match_1 = elArr[1].trim().match(matchExpr.index);
                        if (match_1[2] === 'function') {
                            body.push(this.walkFnLike(parseInt(match_1[1]), 'inline', vars, type));
                        }
                    }
                }
            }
            return body;
        };
        Sugar.prototype.checkObjMember = function (vars, code) {
            var that = this, body = [], bodyIndex = -1, lastIndex = 0, array = code.split(/\s*[\{,\}]\s*/);
            // console.log(code, array);
            for (var index_19 = 0; index_19 < array.length; index_19++) {
                var element = array[index_19].trim();
                if (element) {
                    var elArr = element.split('___boundary_' + this.uid);
                    if (elArr[0] && elArr[0].trim()) {
                        var match_0 = elArr[0].trim().match(matchExpr.objectattr);
                        if (match_0) {
                            if (match_0[5] != ':') {
                                if ((elArr.length === 1)) {
                                    match_0[6] = match_0[4];
                                }
                                else {
                                    // console.log(elArr);
                                    continue;
                                }
                            }
                            // console.log(elArr);
                            body.push(this.checkProp(vars, match_0[1], 'objProp', match_0, elArr));
                            bodyIndex++;
                            continue;
                        }
                        else {
                            // console.log(elArr);
                        }
                    }
                    else {
                        // console.log(elArr);
                        for (var i = 1; i < elArr.length; i++) {
                            var match = elArr[i].trim().match(matchExpr.index3);
                            switch (match[2]) {
                                case 'string':
                                case 'pattern':
                                case 'tamplate':
                                    console.log(body, bodyIndex);
                                    body[bodyIndex].body.push({
                                        type: 'code',
                                        posi: void 0,
                                        display: 'inline',
                                        vars: vars,
                                        value: ',' + this.replacements[parseInt(match[1])][0].replace(this.markPattern, function () {
                                            return that.replacements[arguments[1]][0];
                                        })
                                    });
                                    if (match[3]) {
                                        body[bodyIndex].body.push({
                                            type: 'code',
                                            posi: void 0,
                                            display: 'inline',
                                            vars: vars,
                                            value: match[3]
                                        });
                                    }
                                    break;
                                case 'function':
                                    if (elArr.length === 2) {
                                        body.push(this.walkFnLike(parseInt(match[1]), 'inline', vars, 'method'));
                                        bodyIndex++;
                                    }
                                    break;
                            }
                        }
                    }
                }
            }
            return body;
        };
        Sugar.prototype.checkArgs = function (code, localvars) {
            var args = code.split(/\s*,\s*/), keys = [], keysArray = void 0, vals = [];
            // console.log(code, args);
            for (var index_20 = 0; index_20 < args.length; index_20++) {
                var arg = args[index_20];
                if (arg) {
                    var array = arg.split(/\s*=\s*/);
                    var position = this.getPosition(array[0]);
                    if (position) {
                        var varname = array[0].replace(position.match, '');
                    }
                    else {
                        var varname = array[0];
                    }
                    // console.log(arg, array, position, varname);
                    if (varname.match(namingExpr)) {
                        keys.push([varname, position]);
                        vals.push(array[1]);
                        localvars.self[varname] = 'var';
                    }
                    else if (varname.match(argsExpr)) {
                        keysArray = [varname, position];
                        localvars.self[varname] = 'var';
                        break;
                    }
                }
            }
            return {
                keys: keys,
                keysArray: keysArray,
                vals: vals
            };
        };
        Sugar.prototype.checkFnBody = function (vars, args, code) {
            code = code.trim();
            // console.log(code);
            var body = [];
            // console.log(args, lines);
            for (var index_21 = 0; index_21 < args.vals.length; index_21++) {
                if (args.vals[index_21] !== undefined) {
                    var valArr = args.vals[index_21].split('___boundary_' + this.uid);
                    if (valArr[1]) {
                        body.push({
                            type: 'code',
                            posi: args.keys[index_21][1],
                            display: 'block',
                            value: 'if (' + args.keys[index_21][0] + ' === void 0) { ' + args.keys[index_21][0] + ' = ' + valArr[0]
                        });
                        this.pushReplacementsToAST(body, vars, valArr[1], this.getPosition(args.vals[index_21]), false);
                        body.push({
                            type: 'code',
                            posi: void 0,
                            display: 'inline',
                            value: '; }'
                        });
                    }
                    else {
                        body.push({
                            type: 'code',
                            posi: args.keys[index_21][1],
                            display: 'block',
                            value: 'if (' + args.keys[index_21][0] + ' === void 0) { ' + args.keys[index_21][0] + ' = ' + valArr[0] + '; }'
                        });
                    }
                }
            }
            if (args.keysArray) {
                body.push({
                    type: 'code',
                    posi: args.keys[index][1],
                    display: 'block',
                    value: 'var ' + args.keysArray[0].replace('...', '') + ' = Array.prototype.slice.call(arguments, ' + args.keys.length + ');'
                });
            }
            this.pushBodyToAST(body, vars, code);
            // console.log(code, body);
            return body;
        };
        Sugar.prototype.generate = function () {
            // console.log(this.replacements);
            // console.log(this.ast.body);
            var head = [];
            var body = [];
            var foot = [];
            this.fixVariables(this.ast.vars);
            this.pushHeader(head, this.imports);
            this.pushAlias(body, this.using_as);
            this.pushCodes(body, this.ast.vars, this.ast.body, 1, this.namespace);
            this.pushFooter(foot);
            this.output = head.join('') + this.trim(body.join('')) + foot.join('');
            // console.log(this.output);
            return this;
        };
        Sugar.prototype.pushPostionsToMap = function (position, codes) {
            if (codes === void 0) { codes = undefined; }
            if (position) {
                var index_22 = this.posimap.length;
                this.posimap.push(position);
                var replace = '/* @posi' + index_22 + ' */';
                if (codes) {
                    codes.push(replace);
                }
                return replace;
            }
            return '';
        };
        Sugar.prototype.pushHeader = function (codes, array) {
            codes.push('/*!');
            codes.push("\r\n" + ' * tangram.js framework sugar compiled code');
            codes.push("\r\n" + ' *');
            codes.push("\r\n" + ' * Datetime: ' + (new Date()).toUTCString());
            codes.push("\r\n" + ' */');
            codes.push("\r\n" + ';');
            codes.push("\r\n");
            if (this.configinfo === '{}') {
                codes.push("// ");
            }
            else {
                this.pushPostionsToMap(this.getPosition(this.configinfo_posi), codes);
            }
            codes.push('tangram.config(' + this.configinfo + ');');
            codes.push("\r\n" + 'tangram.block([');
            if (this.imports.length) {
                var imports = [];
                for (var index_23 = 0; index_23 < this.imports.length; index_23 += 2) {
                    imports.push(this.pushPostionsToMap(this.getPosition(this.imports[index_23 + 1])) + "'" + this.imports[index_23] + "'");
                }
                // console.log(this.imports, imports);
                codes.push("\r\n\t" + imports.join(",\r\n\t") + "\r\n");
            }
            codes.push('], function (pandora, global, imports, undefined) {');
            return codes;
        };
        Sugar.prototype.pushAlias = function (codes, alias) {
            // console.log(alias);
            for (var key in alias) {
                // let position = this.getPosition(key);
                // let _key = key.replace(position.match, '').trim();
                codes.push("\r\n\t" + this.pushPostionsToMap(alias[key][0]) + "var " + key);
                codes.push(" = imports['" + alias[key][0]);
                codes.push("']&&imports['" + alias[key][0]);
                if (alias[key][2] !== undefined) {
                    codes.push("'][" + alias[key][2] + "];");
                }
                else {
                    codes.push("'];");
                }
            }
            return codes;
        };
        Sugar.prototype.pushCodes = function (codes, vars, array, layer, namespace) {
            if (namespace === void 0) { namespace = this.namespace; }
            // console.log(codes, array);
            // console.log(array);
            // console.log(layer, array);
            for (var index_24 = 0; index_24 < array.length; index_24++) {
                var element = array[index_24];
                // console.log(element);
                this.pushElement(codes, vars, element, layer, namespace);
            }
            // this.fixVariables(vars);
            return codes;
        };
        Sugar.prototype.pushElement = function (codes, vars, element, layer, namespace) {
            if (namespace === void 0) { namespace = this.namespace; }
            var indent = "\r\n" + stringRepeat("\t", layer);
            switch (element.type) {
                case 'array':
                    this.pushArrayCodes(codes, element, layer, namespace);
                    break;
                case 'call':
                case 'method':
                case 'construct':
                    // console.log(layer);
                    this.pushCallCodes(codes, element, layer, namespace);
                    break;
                case 'class':
                case 'dec':
                    this.pushClassCodes(codes, element, layer, namespace);
                    break;
                case 'code':
                    if (element.value) {
                        // console.log(element.posi&&element.posi.head, element.display, element.value);
                        var code = this.patchVariables(element.value, vars);
                        if (element.display === 'block') {
                            codes.push(indent + this.pushPostionsToMap(element.posi) + code);
                        }
                        else {
                            if (element.posi) {
                                if (element.posi.head) {
                                    codes.push(indent);
                                    if (element.display === 'member') {
                                        codes.push("\t");
                                    }
                                }
                                this.pushPostionsToMap(element.posi, codes);
                            }
                            codes.push(code);
                        }
                        break;
                    }
                    break;
                case 'codes':
                    // console.log(element);
                    this.pushCodes(codes, element.vars, element.body, layer + ((element.posi && element.posi.head) ? 1 : 0), namespace);
                    break;
                case 'def':
                    this.pushFunctionCodes(codes, element, layer, namespace);
                    break;
                case 'extends':
                    this.pushExtendsCodes(codes, element, layer, namespace);
                    break;
                case 'exp':
                case 'closure':
                    this.pushExpressionCodes(codes, element, layer, namespace);
                    break;
                case 'expands':
                    this.pushExpandClassCodes(codes, element, layer, namespace);
                    break;
                case 'object':
                    // console.log(element);
                    this.pushObjCodes(codes, element, layer, namespace);
                    break;
                case 'travel':
                    this.pushTravelCodes(codes, element, layer, namespace);
                    break;
            }
            // this.fixVariables(vars);
            return codes;
        };
        Sugar.prototype.pushArrayCodes = function (codes, element, layer, namespace) {
            var elements = [];
            if (element.posi) {
                this.pushPostionsToMap(element.posi, codes);
            }
            codes.push('[');
            if (element.body.length) {
                var _layer = layer;
                var indent2 = void 0;
                var _break = false;
                // console.log(element.body[0]);
                if (element.body[0].posi && element.body[0].posi.head) {
                    _layer++;
                    indent2 = "\r\n" + stringRepeat("\t", _layer);
                    codes.push(indent2);
                    _break = true;
                }
                // console.log(element.body);
                for (var index_25 = 0; index_25 < element.body.length; index_25++) {
                    if (element.body[index_25].value) {
                        elements.push(this.pushPostionsToMap(element.body[index_25].posi) + element.body[index_25].value);
                    }
                    else {
                        var elemCodes = [];
                        this.pushPostionsToMap(element.body[index_25].posi, elemCodes);
                        this.pushElement(elemCodes, element.vars, element.body[index_25], _layer, namespace);
                        if (elemCodes.length) {
                            elements.push(elemCodes.join('').trim());
                        }
                    }
                }
                while (elements.length && !elements[0].trim()) {
                    elements.shift();
                }
                if (elements.length) {
                    if (_break) {
                        console.log('foooooo');
                        codes.push(elements.join(',' + indent2));
                    }
                    else {
                        codes.push(elements.join(', '));
                    }
                }
            }
            codes.push(']');
            return codes;
        };
        Sugar.prototype.pushCallCodes = function (codes, element, layer, namespace) {
            var naming = this.pushCodes([], element.vars, element.name, layer, namespace);
            // console.log(element);
            if (element.posi) {
                if (element.type === 'method') {
                    element.posi.head = false;
                }
                if (element.posi.head) {
                    var indent = "\r\n" + stringRepeat("\t", layer);
                    codes.push(indent);
                }
                this.pushPostionsToMap(element.posi, codes);
            }
            var name = naming.join('');
            if (name === 'new') {
                codes.push('new (');
            }
            else {
                if (element.type === 'construct') {
                    codes.push('new ');
                }
                codes.push(name + '(');
            }
            var parameters = [];
            if (element.params.length) {
                var _layer = layer;
                var indent2 = void 0;
                var _break = false;
                // console.log(element.params[0]);
                if ((element.params.length > 1) && element.params[0].posi && element.params[0].posi.head) {
                    // console.log(true);
                    _layer++;
                    indent2 = "\r\n" + stringRepeat("\t", _layer);
                    // codes.push(indent2);
                    _break = true;
                }
                for (var index_26 = 0; index_26 < element.params.length; index_26++) {
                    var param = element.params[index_26].body;
                    var paramCodes = [];
                    this.pushPostionsToMap(element.params[index_26].posi, paramCodes);
                    this.pushCodes(paramCodes, element.vars, param, _layer, namespace);
                    if (paramCodes.length) {
                        parameters.push(paramCodes.join('').trim());
                    }
                }
                while (parameters.length && !parameters[0].trim()) {
                    parameters.shift();
                }
                if (parameters.length) {
                    if (_break) {
                        codes.push(indent2 + parameters.join(',' + indent2));
                        // console.log(codes);
                    }
                    else {
                        codes.push(parameters.join(', '));
                    }
                }
            }
            // console.log(element.display);
            if (element.display === 'block') {
                codes.push(');');
            }
            else {
                codes.push(')');
            }
            return codes;
        };
        Sugar.prototype.pushClassCodes = function (codes, element, layer, namespace) {
            var indent1 = "\r\n" + stringRepeat("\t", layer);
            var indent2 = "\r\n" + stringRepeat("\t", layer + 1);
            var elements = [];
            var static_elements = [];
            var cname = '';
            var toES6 = false;
            if (element.subtype === 'stdClass') {
                cname = 'pandora.' + namespace + element.cname.trim();
                codes.push(indent1 + this.pushPostionsToMap(element.posi) + 'pandora.declareClass(\'' + namespace + element.cname.trim() + '\', ');
            }
            else {
                if (element.cname && element.cname.trim()) {
                    cname = element.cname.trim();
                    if (cname.match(/^[\$\w]+$/)) {
                        if (this.toES6) {
                            codes.push(indent1 + this.pushPostionsToMap(element.posi) + 'class ' + cname + ' ');
                            toES6 = true;
                        }
                        else {
                            codes.push(indent1 + 'var ' + this.pushPostionsToMap(element.posi) + cname + ' = ' + 'pandora.declareClass(');
                        }
                    }
                    else {
                        codes.push(indent1 + this.pushPostionsToMap(element.posi) + cname + ' = ' + 'pandora.declareClass(');
                    }
                }
                else {
                    this.pushPostionsToMap(element.posi, codes);
                    if (this.toES6) {
                        codes.push('class ');
                        toES6 = true;
                    }
                    else {
                        codes.push('pandora.declareClass(');
                    }
                }
            }
            if (element.base) {
                if (toES6) {
                    codes.push('extends ' + element.base.trim() + ' ');
                }
                else {
                    codes.push(element.base.trim() + ', ');
                }
            }
            codes.push('{');
            // console.log(element);
            if (toES6) {
                for (var index_27 = 0; index_27 < element.body.length; index_27++) {
                    var member = element.body[index_27];
                    var elem = [];
                    // console.log(member);
                    switch (member.type) {
                        case 'method':
                            if (member.fname === '_init') {
                                member.fname === 'constructor';
                            }
                            elem.push(indent2 + member.fname + ' ');
                            this.pushFunctionCodes(elem, member, layer + 1, namespace);
                            // console.log(member.fname, elem);
                            elements.push(elem.join('').replace(/\s*function\s*\(/, '('));
                            break;
                        case 'prop':
                            elem.push(indent2 + member.pname + ' = ');
                            this.pushCodes(elem, member.vars, member.body, layer + 1, namespace);
                            static_elements.push(elem.join('') + ';');
                            break;
                        case 'setPropMethod':
                            elem.push(indent2 + 'set ' + member.fname + ' ');
                            this.pushFunctionCodes(elem, member, layer + 1, namespace);
                            elements.push(elem.join('').replace(/\s*function\s*\(/, '('));
                            break;
                        case 'getPropMethod':
                            elem.push(indent2 + 'get ' + member.fname + ' ');
                            this.pushFunctionCodes(elem, member, layer + 1, namespace);
                            elements.push(elem.join('').replace(/\s*function\s*\(/, '('));
                            break;
                        case 'staticMethod':
                            elem.push(indent2 + 'static ' + member.fname + ' ');
                            this.pushFunctionCodes(elem, member, layer + 1, namespace);
                            elements.push(elem.join('').replace(/\s*function\s*\(/, '('));
                            break;
                        case 'staticProp':
                            elem.push(indent2 + 'static ' + member.fname + ' = ');
                            this.pushCodes(elem, member.vars, member.body, layer + 1, namespace);
                            static_elements.push(elem.join('') + ';');
                            break;
                    }
                }
            }
            else {
                var overrides = {};
                var setters = [];
                var getters = [];
                var indent3 = "\r\n" + stringRepeat("\t", layer + 2);
                for (var index_28 = 0; index_28 < element.body.length; index_28++) {
                    var member = element.body[index_28];
                    var elem = [];
                    // console.log(member);
                    switch (member.type) {
                        case 'method':
                            elem.push(indent2 + member.fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 1, namespace);
                            if (this.toES6) {
                                elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            }
                            else {
                                elements.push(elem.join(''));
                            }
                            break;
                        case 'overrideMethod':
                            overrides[member.fname] = overrides[member.fname] || {};
                            var argslen = member.args.length;
                            if (!overrides[member.fname][argslen]) {
                                var fname = overrides[member.fname][argslen] = '___override_method_' + member.fname + '_' + argslen;
                                elem.push(indent2 + fname + ': ');
                                this.pushFunctionCodes(elem, member, layer + 1, namespace);
                                if (this.toES6) {
                                    elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                                }
                                else {
                                    elements.push(elem.join(''));
                                }
                            }
                            break;
                        case 'prop':
                            elem.push(indent2 + member.pname + ': ');
                            this.pushCodes(elem, member.vars, member.body, layer + 1, namespace);
                            elements.push(elem.join(''));
                            break;
                        case 'setPropMethod':
                            elem.push(indent3 + member.fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 2, namespace);
                            if (this.toES6) {
                                setters.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            }
                            else {
                                setters.push(elem.join(''));
                            }
                            break;
                        case 'getPropMethod':
                            elem.push(indent3 + member.fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 2, namespace);
                            if (this.toES6) {
                                getters.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            }
                            else {
                                getters.push(elem.join(''));
                            }
                            break;
                        case 'staticMethod':
                            elem.push(indent2 + member.fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 1, namespace);
                            if (this.toES6) {
                                static_elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            }
                            else {
                                static_elements.push(elem.join(''));
                            }
                            break;
                        case 'staticProp':
                            elem.push(indent2 + member.pname + ': ');
                            this.pushCodes(elem, member.vars, member.body, layer + 1, namespace);
                            static_elements.push(elem.join(''));
                            break;
                    }
                }
                this.pushOverrideMethod(elements, overrides, indent2, indent3);
                if (setters.length) {
                    elements.push(indent2 + '_setters: {' + setters.join(',') + '}');
                }
                if (getters.length) {
                    elements.push(indent2 + '_getters: {' + getters.join(',') + '}');
                }
            }
            if (toES6) {
                if (elements.length) {
                    codes.push(elements.join(''));
                }
                codes.push(indent1 + '}');
                codes.push(indent1);
            }
            else {
                if (elements.length) {
                    codes.push(elements.join(','));
                }
                codes.push(indent1 + '})');
                if (cname) {
                    if (static_elements.length) {
                        codes.push(';' + indent1 + 'pandora.extend(' + cname + ', {');
                        codes.push(static_elements.join(','));
                        codes.push(indent1 + '});');
                    }
                    else {
                        codes.push(';');
                    }
                    codes.push(indent1);
                }
            }
            return codes;
        };
        Sugar.prototype.pushFunctionCodes = function (codes, element, layer, namespace) {
            var indent = "\r\n" + stringRepeat("\t", layer);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            }
            else {
                var posi = '';
            }
            if (element.type === 'def' && element.fname) {
                if ((element.subtype === 'var') || (element.subtype === 'let')) {
                    codes.push(indent + posi + element.subtype + ' ' + element.fname + ' = function (');
                }
                else if ((element.subtype === 'public')) {
                    codes.push(indent + posi + 'pandora.' + namespace + element.fname + ' = function (');
                }
                else {
                    codes.push(indent + posi + 'function ' + element.fname + ' (');
                }
            }
            else {
                codes.push(posi + 'function (');
            }
            if (element.args.length) {
                var args = [];
                for (var index_29 = 0; index_29 < element.args.length; index_29++) {
                    args.push(this.pushPostionsToMap(element.args[index_29][1]) + element.args[index_29][0]);
                }
                codes.push(args.join(', '));
            }
            codes.push(') {');
            // console.log(element.body);
            if (element.body.length) {
                // console.log(element.body);
                this.pushCodes(codes, element.vars, element.body, layer + 1, namespace);
            }
            else {
                indent = '';
            }
            // console.log(element.display, element.subtype);
            if ((element.subtype === 'var') || (element.subtype === 'let')) {
                codes.push(indent + '};');
                codes.push(indent);
            }
            else {
                codes.push(indent + '}');
            }
            return codes;
        };
        Sugar.prototype.pushExtendsCodes = function (codes, element, layer, namespace) {
            var indent1 = "\r\n" + stringRepeat("\t", layer);
            var indent2 = "\r\n" + stringRepeat("\t", layer);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            }
            else {
                var posi = '';
            }
            if (element.subtype === 'ns') {
                codes.push(indent2 + posi + 'pandora.ns(\'' + namespace + element.oname.trim() + '\', function () {');
                this.pushCodes(codes, element.vars, element.body, layer + 1, namespace + element.oname.trim() + '.');
                // console.log(element.body);
                codes.push(indent2 + '}');
            }
            else if (element.subtype === 'extns') {
                codes.push(indent1 + posi + 'pandora.ns(\'' + namespace + element.oname.trim() + '\', ');
                this.pushObjCodes(codes, element, layer, namespace);
            }
            else {
                codes.push(indent1 + posi + 'pandora.extend(' + element.oname + ', ');
                this.pushObjCodes(codes, element, layer, namespace);
            }
            codes.push(');');
            codes.push(indent1);
            return codes;
        };
        Sugar.prototype.pushExpressionCodes = function (codes, element, layer, namespace) {
            var indent1 = "\r\n" + stringRepeat("\t", layer);
            var indent2 = "\r\n" + stringRepeat("\t", layer);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            }
            else {
                var posi = '';
            }
            if (element.type === 'closure') {
                codes.push(' {');
            }
            else {
                codes.push(indent1 + posi + element.expression + '(');
                // console.log(element.head);
                this.pushCodes(codes, element.vars.parent, element.head, layer, namespace);
                codes.push(') {');
            }
            codes.push(indent2);
            // console.log(element.body);
            this.pushCodes(codes, element.vars, element.body, layer + 1, namespace);
            codes.push(indent1 + '}');
            return codes;
        };
        Sugar.prototype.pushExpandClassCodes = function (codes, element, layer, namespace) {
            var indent1 = "\r\n" + stringRepeat("\t", layer);
            var indent2 = "\r\n" + stringRepeat("\t", layer + 1);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            }
            else {
                var posi = '';
            }
            var elements = [];
            var static_elements = [];
            var cname = '';
            if (element.subtype === 'stdClass') {
                cname = 'pandora.' + namespace + element.cname.trim();
            }
            else {
                if (element.cname && element.cname.trim()) {
                    cname = element.cname.trim();
                }
                else {
                    return codes;
                }
            }
            codes.push(indent1 + posi + 'pandora.extend(' + cname + '.prototype, ');
            // if (element.base) {
            //     codes.push(element.base.trim() + ', ');
            // }
            codes.push('{');
            // console.log(element);
            var overrides = {};
            var indent3 = "\r\n" + stringRepeat("\t", layer + 2);
            for (var index_30 = 0; index_30 < element.body.length; index_30++) {
                var member = element.body[index_30];
                var elem = [];
                // console.log(member);
                switch (member.type) {
                    case 'method':
                        elem.push(indent2 + member.fname + ': ');
                        this.pushFunctionCodes(elem, member, layer + 1, namespace);
                        if (this.toES6) {
                            elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                        }
                        else {
                            elements.push(elem.join(''));
                        }
                        break;
                    case 'overrideMethod':
                        overrides[member.fname] = overrides[member.fname] || {};
                        var argslen = member.args.length;
                        if (!overrides[member.fname][argslen]) {
                            var fname = overrides[member.fname][argslen] = '___override_method_' + member.fname + '_' + argslen;
                            elem.push(indent2 + fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 1, namespace);
                            if (this.toES6) {
                                elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            }
                            else {
                                elements.push(elem.join(''));
                            }
                        }
                        break;
                    case 'prop':
                        elem.push(indent2 + member.pname + ': ');
                        this.pushCodes(elem, member.vars, member.body, layer + 1, namespace);
                        elements.push(elem.join(''));
                        break;
                    case 'staticMethod':
                        elem.push(indent2 + member.fname + ': ');
                        this.pushFunctionCodes(elem, member, layer + 1, namespace);
                        if (this.toES6) {
                            static_elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                        }
                        else {
                            static_elements.push(elem.join(''));
                        }
                        break;
                    case 'staticProp':
                        elem.push(indent2 + member.pname + ': ');
                        this.pushCodes(elem, member.vars, member.body, layer + 1, namespace);
                        static_elements.push(elem.join(''));
                        break;
                }
            }
            this.pushOverrideMethod(elements, overrides, indent2, indent3);
            if (elements.length) {
                codes.push(elements.join(','));
            }
            codes.push(indent1 + '})');
            console.log(element.display);
            if (static_elements.length) {
                codes.push(';' + indent1 + 'pandora.extend(' + cname + ', {');
                codes.push(static_elements.join(','));
                codes.push(indent1 + '});');
            }
            else {
                codes.push(';');
            }
            codes.push(indent1);
            // console.log(elements, static_elements); 
            return codes;
        };
        Sugar.prototype.pushOverrideMethod = function (elements, overrides, indent2, indent3) {
            for (var fname in overrides) {
                if (overrides.hasOwnProperty(fname)) {
                    console.log(overrides[fname]);
                    var elem = [];
                    elem.push(indent2 + fname + ': ');
                    if (this.toES6) {
                        elem.push('(){');
                    }
                    else {
                        elem.push('function(){');
                    }
                    var element = overrides[fname];
                    for (var args in element) {
                        if (element.hasOwnProperty(args)) {
                            elem.push(indent3 + 'if (arguments.length === ' + args + ') { return this.' + element[args] + '.apply(this, arguments); }');
                        }
                    }
                    elem.push(indent3 + 'return this.' + element[args] + '.apply(this, arguments);');
                    elem.push(indent2 + '}');
                    elements.push(elem.join(''));
                }
            }
        };
        Sugar.prototype.pushTravelCodes = function (codes, element, layer, namespace) {
            var indent = "\r\n" + stringRepeat("\t", layer);
            // console.log(element);
            codes.push(indent + 'pandora.each(');
            this.pushCodes(codes, element.vars, element.iterator, layer, namespace);
            codes.push(', ');
            this.pushFunctionCodes(codes, element.callback, layer, namespace);
            codes.push(', this);');
            codes.push(indent);
            return codes;
        };
        Sugar.prototype.pushObjCodes = function (codes, element, layer, namespace) {
            var indent1 = "\r\n" + stringRepeat("\t", layer);
            var indent2 = "\r\n" + stringRepeat("\t", layer + 1);
            codes.push('{');
            if (element.body.length) {
                var elements = [];
                // console.log(element);
                for (var index_31 = 0; index_31 < element.body.length; index_31++) {
                    var member = element.body[index_31];
                    var elem = [];
                    // console.log(member);
                    switch (member.type) {
                        case 'method':
                            elem.push(indent2 + member.fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 1, namespace);
                            if (this.toES6) {
                                elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            }
                            else {
                                elements.push(elem.join(''));
                            }
                            break;
                        case 'objProp':
                            elem.push(indent2 + member.pname + ': ');
                            this.pushCodes(elem, member.vars, member.body, layer + 1, namespace);
                            elements.push(elem.join(''));
                            break;
                    }
                }
                if (elements.length) {
                    codes.push(elements.join(','));
                    codes.push(indent1);
                }
                codes.push(indent1);
            }
            codes.push(indent1);
            codes.push('}');
            return codes;
        };
        Sugar.prototype.fixVariables = function (vars) {
            this.closurecount++;
            // console.log(vars.type, vars);
            if (1) {
                for (var index_32 = 0; index_32 < vars.self.length; index_32++) {
                    var element = vars.self[index_32].split(/\s+/)[1];
                    if (['pandora', 'global', 'imports', 'undefined']['includes'](element)) {
                        if (!vars.fix_map[element]) {
                            var i = 1;
                            var newname = element + '_' + i;
                            while (vars.fixed['includes'](newname)) {
                                i++;
                                newname = element + '_' + i;
                            }
                            vars.fixed.push(newname);
                            vars.fix_map[element] = newname;
                        }
                    }
                }
                switch (vars.type) {
                    case 'block':
                        break;
                }
                return;
            }
            switch (vars.type) {
                case 'block':
                    vars.fixed = vars.parent;
                    for (var index_33 = 0; index_33 < vars.self.length; index_33++) {
                        var element = vars.self[index_33].split(/\s+/)[1];
                        while (!vars.fixed['includes'](element)) {
                            vars.fixed.push(element);
                        }
                    }
                    for (var index_34 = 0; index_34 < vars.self.length; index_34++) {
                        var element = vars.self[index_34].split(/\s+/)[1];
                        if (['pandora', 'global', 'imports', 'undefined']['includes'](element)) {
                            while (!vars.fixed['includes'](element)) {
                                vars.fixed.push(element);
                            }
                            var newname = element + '_1';
                            if (!vars.fix_map[newname]) {
                                vars.fixed.push(newname);
                                vars.fix_map[newname] = element;
                            }
                        }
                        else {
                            if (vars.fix_map[element]) {
                                var newname = element + '_fixed';
                                vars.fixed.push(newname);
                                vars.fix_map[newname] = element;
                            }
                            else {
                                // console.log(vars.fixed);
                                if (vars.fixed['includes'](element)) {
                                    vars.fixed.push(element);
                                }
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            console.log(vars);
        };
        Sugar.prototype.patchVariables = function (code, vars) {
            var _this = this;
            // console.log(code, vars);
            if (code) {
                // console.log(code);
                return code.replace(/(^|[^\$\w\.]\s*)([\$a-z_][\$\w]*)(\*[\$\w]|$)/i, function (match, before, varname, after) {
                    // console.log(match, before, varname, after);
                    return before + _this.patchVariable(varname, vars) + after;
                });
            }
            // console.log(code);
            return '';
        };
        Sugar.prototype.patchVariable = function (varname, vars) {
            // console.log(varname, vars);
            return varname;
        };
        Sugar.prototype.pushFooter = function (codes) {
            if (this.isMainBlock) {
                codes.push("\r\n" + '}, true);');
            }
            else {
                codes.push("\r\n" + '});');
            }
            return codes;
        };
        Sugar.prototype.decode = function (string) {
            string = string.replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
            var matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
            while (matches) {
                // console.log(matches, this.replacements[matches[2]]);
                string = string.replace(matches[0], this.replacements[matches[2]]).replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
                matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
            }
            // console.log(string);
            return string.replace(/(@\d+L\d+P\d+O?\d*::)/g, '');
        };
        Sugar.prototype.trim = function (string) {
            // 此处的replace在整理完成后，将进行分析归纳，最后改写为callback形式的
            // console.log(string);
            string = this.restoreStrings(string, false);
            // return string;
            // this.replacements = [['{}'], ['/='], ['/'], [' +'], [' -'], ['return ']];
            // console.log(string);
            string = this.replaceStrings(string, false);
            // console.log(string);
            string = this.replaceOperators(string, false);
            // console.log(string);
            // return '';
            // 删除多余头部
            // string = string.replace(/^[,;\s]+[\r\n]+/g, "\r\n");
            string = string.replace(/^[,;\s]+/g, "\r\n\t");
            //去除多余符号
            // string = string.replace(/\s*;(\s*;)+/g, ";");
            string = string.replace(/\s*;([^\s])/g, "; $1");
            string = string.replace(/(\{|\[|\(|\.|\:)\s*[,;]+/g, "$1");
            string = string.replace(/\s*[,;]+(\s*)(\.|\:|\)|\])/g, "$1$2");
            string = string.replace(/\s+(\=|\?|\:)[,;\s]*/g, " $1 ");
            string = string.replace(/([\r\n]*\s*[\$\w])\s+(\:)/g, "$1$2");
            // // 关键字处理
            string = string.replace(/if\s*\(([^\)]+)\)\s*[,;]+/g, "if ($1)");
            string = string.replace(/([^\$\w])else\s*[,;]+/g, "$1else");
            // string = string.replace(/([^\s])\s*(instanceof)\s+/g, " $1 ");
            string = string.replace(/(,|;)?[\r\n]+(\s*)(var|delete|return)\s+/g, "$1\r\n$2$3 ");
            // string = string.replace(/(\s*)(return)\s*([\{\(}])/g, "$1$2 $3");
            // 删除多余换行
            string = string.replace(/\s*[\r\n]+([\r\n])?/g, "\r\n$1");
            // console.log(string);
            string = this.restoreStrings(string, true);
            // console.log(string);
            // 删除多余空白
            string = string.replace(/\{\s+\}/g, '{}');
            string = string.replace(/\[\s+\]/g, '[]');
            string = string.replace(/\(\s+\)/g, '()');
            // string = string.replace(/(\(|\[)\s+([\r\n]+)/g, "$1$2");
            // string = string.replace(/([^\r\n])\s+(\)|\])/g, "$1$2");
            // console.log(string);
            return string;
            {
                // string = string.replace(/[;\r\n]+?(\s*)if\s*\(([\s\S]+?)\)/g, ";\r\n$1if ($2) ");
                // string = string.replace(/if\s*\(([\s\S]+?)\)[\s,;]*{/g, "if ($1) {");
                // string = string.replace(/;+\s*(instanceof)\s+/g, " $1 ");
                // string = string.replace(/(var|else|delete)(;|\s)+[;\s]*/g, "$1 ");
                // string = string.replace(/[;\r\n]+(\s*)(var|delete|return)\s+/g, ";\r\n$1$2 ");
                //前置运算符处理
                // string = string.replace(/[,\s]*(___boundary_\d+_as_preoperator___)[,;\s]*/g, "$1");
                // string = string.replace(/((\<|\!|\>)\=*)\s+(\+|\-)\s+(\d)/g, '$1 $3$4');
                // 中置运算符前后不能结非标量
                // string = string.replace(/[,;\s]*(___boundary_\d+_as_operator___)[,;\s]*/g, "$1");
                // string = string.replace(/[,;\s]*(\=|\!|\+|\-|\*|\/|\%|\&|\^|\||<|>)[,;\s]*/g, " $1 ");
                // string = string.replace(/\s*;+\s*(<+|\+|\-|\*|\/|>+)\s+/g, " $1 ");
                // string = string.replace(/\s+(<+|\+|\-|\*|\/|>+)\s*;+\s*/g, " $1 ");
                // string = string.replace(/[,;\s]*(\?)[,;\s]*/g, " $1 ");
                // 后置运算符前面必须有内容
                // string = string.replace(/[,;\s]*(___boundary_\d+_as_aftoperator___)/g, "$1");
                // string = string.replace(/[,;\s]*(\(|\))/g, "$1");
                //去除多余符号
                // string = string.replace(/\s*;+/g, "; ");
                // string = string.replace(/[,;\s]*,[,;]*/g, ',');
                // string = string.replace(/(\{|\[|\(|\.|\:)\s*;+/g, "$1");
                // string = string.replace(/\s*,+\s*(\.|\:|\)|\]|\})/g, "$1");
                // string = string.replace(/(\{|\[|\(|\.|\:)\s*,+(\s*)/g, "$1$2");
                // string = string.replace(/[;\s]+(\{|\[|\(|\.|\:|\)|\])/g, "$1");
                // 删除多余换行
                // string = string.replace(/(,|;)[\r\n]+/g, "$1\r\n");
                // 删除多余空白
                // string = string.replace(/\{\s+\}/g, '{}');
                // string = string.replace(/\[\s+\]/g, '[]');
                // string = string.replace(/\(\s+\)/g, '()');
                // 删除多余头部
                // string = string.replace(/^[,;\s]+/g, "");
                // string = string.replace(/[\r\n]+(\s+)\}\s*([\$\w+]+)/g, "\r\n$1}\r\n$1$2");
                // string = this.restoreStrings(string);
            }
            // return string;
        };
        Sugar.prototype.restoreStrings = function (string, last) {
            var that = this;
            if (last) {
                var pattern = this.lastPattern;
            }
            else {
                var pattern = this.trimPattern;
            }
            return string.replace(pattern, function () {
                // console.log(arguments[0]);
                // console.log(pattern, arguments[2] || arguments[4], that.replacements, that.replacements[arguments[2] || arguments[4]]);
                return that.replacements[arguments[2] || arguments[4]][0];
            }).replace(this.markPattern, function () {
                // console.log(arguments[0], that.replacements[arguments[1]][1]);
                return that.replacements[arguments[1]][0];
            }).replace(/(@\d+L\d+P\d+O?\d*::)/g, '');
        };
        Sugar.prototype.min = function () {
            this.replacements = [['{}'], ['/='], ['/'], [' +'], [' -'], ['return ']];
            var string = this.replaceStrings(this.output);
            string = this.replaceOperators(string, true);
            // console.log(string);
            string = string.replace(/\s*(,|;|:|=|\?)\s+/g, "$1");
            string = string.replace(/([^\s])\s+([^\s])/g, "$1 $2");
            string = string.replace(/[;\s]*(\{|\[|\(|\]|\})\s*/g, "$1");
            string = string.replace(/;*\};+\s*/g, "}");
            string = string.replace(/\}([\$\w\.])\s*/g, "};$1");
            string = string.replace(/\};(else|catch)(\s|\{|\()/g, "}$1$2");
            string = string.replace(/\s*(___boundary_\d+_as_operator___)\s*/g, "$1");
            // console.log(string);
            string = this.restoreStrings(string, false);
            return string;
        };
        Sugar.prototype.run = function (precall, callback) {
            if (precall === void 0) { precall = null; }
            if (callback === void 0) { callback = function (content) { }; }
            if (!this.output) {
                this.compile();
            }
            precall && precall.call(this, this.output);
            eval(this.output);
            callback.call(this);
        };
        return Sugar;
    }());
    return function (input, run) {
        return new Sugar(input, run);
    };
}));
//# sourceMappingURL=sugar.js.map