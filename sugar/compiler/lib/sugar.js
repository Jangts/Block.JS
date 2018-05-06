/*!
 * tangram.js framework syntactic sugar
 * Core Code
 *
 * Written and Designed By Jang Ts
 * http://tangram.js.cn
 */
;
(function (root, factory) {
    // console.log(root.tangram, typeof root.tangram, typeof root.tangram.init)
    if (typeof exports === 'object') {
        exports = factory(root);
        if (typeof module === 'object') {
            module.exports = exports;
        }
    }
    else if (typeof root.define === 'function' && root.define.amd) {
        // AMD
        root.define('tangram_js_sugar', [], function () {
            return factory(root);
        });
    }
    else if (typeof root.tangram === 'object' && typeof root.tangram.init === 'function') {
        // TNS
        root.tangram.init();
        root.tangram.module.exports = factory(root);
        // console.log(root.tangram.module.exports);
    }
    else {
        root.tangram_js_sugar = factory(root);
    }
}(this, function (root) {
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
    var keywords = [
        'break',
        'case', 'catch', 'const', 'continue',
        'default', 'delete', 'do',
        'else',
        'finally', 'for', 'function',
        'if', 'in', 'instanceof',
        'let',
        'new',
        'return',
        'switch',
        'throw', 'try', 'typeof',
        'var', 'void',
        'while', 'with'
    ], reservedFname = ['if', 'for', 'while', 'switch', 'with', 'catch'], reserved = ['window', 'global', 'tangram', 'this', 'arguments'], blockreserved = ['pandora', 'root'], semicolon = {
        type: 'code',
        posi: undefined,
        display: 'inline',
        vars: {
            parent: null,
            root: {
                namespace: this.namespace,
                public: {},
                private: {},
                protected: {},
                fixed: [],
                fix_map: {}
            },
            locals: {},
            type: 'semicolon'
        },
        value: ';'
    };
    var zero2z = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''), namingExpr = /^[A-Z_\$][\w\$]*$/i, argsExpr = /^...[A-Z_\$][\w\$]*$/i, stringas = {
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
        mixed: /([\$\w]\s*(@\d+L\d+P\d+O*\d*:::)?)(\=\=|\!\=|\=|\!|\+|\-|\*|\/|\%|<<|>>|>>>|\&|\^|\||<|>)=\s*((@\d+L\d+P\d+O*\d*:::)?(\+|\-)?[\$\w\.])/g,
        bool: /([\$\w]\s*(@\d+L\d+P\d+O*\d*:::)?)(\&\&|\|\||\<|\<\<|\>\>\>|\>\>|\>)\s*((@\d+L\d+P\d+O*\d*:::)?(\+|\-)?[\$\w\.])/g,
        op: /([\$\w]\s*(@\d+L\d+P\d+O*\d*:::)?)(\+|\-|\*\*|\*|\/|\%|\&)\s*((@\d+L\d+P\d+O*\d*:::)?(\s+(\+|\-))?[\$\w\.])/g,
        owords: /\s+(@\d+L\d+P\d+O*\d*:::)?(in|of)\s+(@\d+L\d+P\d+O*\d*:::)?/g,
        sign: /(^|\s*[^\+\-])(\+|\-)([\$\w\.])/g,
        swords: /(^|[^\$\w])(typeof|instanceof|void|delete)\s+((@\d+L\d+P\d+O*\d*:::)?\+*\-*[\$\w\.])/g,
        before: /(\+\+|\-\-|\!|\~)\s*([\$\w\.])/g,
        after: /([\$\w\.])[ \t]*(@\d+L\d+P\d+O*\d*:::)?(\+\+|\-\-)/g,
        error: /(.*)(\+\+|\-\-|\+|\-)(.*)/g
    }, replaceWords = /(^|@\d+L\d+P\d+O?\d*:::|\s)(continue|return|throw|break|case|else)\s*(\s|;|___boundary_[A-Z0-9_]{36}_(\d+)_as_([a-z]+)___)/g, replaceExpRegPattern = {
        module: /^((\s*@\d+L\d+P0:::)*\s*(@\d+L\d+P0*):::(\s*))?@module[;\s]*/,
        namespace: /[\r\n]((@\d+L\d+P0):::)?(\s*)namespace\s+(\.{0,1}[\$a-zA-Z_][\$\w\.]*)\s*(;|\r|\n)/,
        // 位置是在replace usings 和 strings 之后才tidy的，所以还存在后接空格
        use: /(@\d+L\d+P\d+:::)\s*use(\s*\$)?\s+([\$\w\.\/\\\?\=\&]+)(\s+as(\s+(@\d+L\d+P\d+:::\s*[\$a-zA-Z_][\$\w]*)|\s*(@\d+L\d+P\d+:::\s*)?\{(@\d+L\d+P\d+:::\s*[\$a-zA-Z_][\$\w]*(\s*,@\d+L\d+P\d+:::\s*[\$a-zA-Z_][\$\w]*)*)\})(@\d+L\d+P\d+:::\s*)?)?\s*[;\r\n]/g,
        include: /\s*@include\s+___boundary_[A-Z0-9_]{36}_(\d+)_as_string___[;\r\n]+/g,
        extends: /(@\d+L\d+P\d+O*\d*:::)?(ns|namespace|extends)\s+((\.{0,3})[\$a-zA-Z_][\$\w\.]*)(\s+with)?\s*\{([^\{\}]*?)\}/g,
        class: /(@\d+L\d+P\d+O*\d*:::)?((class|expands)\s+(\.{0,3}[\$a-zA-Z_][\$\w\.]*)?(\s+extends\s+\.{0,3}[\$a-zA-Z_][\$\w\.]*|ignore)?\s*\{[^\{\}]*?\})/g,
        fnlike: /(@\d+L\d+P\d+O*\d*:::)?(^|(function|def|public)\s+)?(([\$a-zA-Z_][\$\w]*)?\s*\([^\(\)]*\))\s*\{([^\{\}]*?)\}/g,
        parentheses: /(@\d+L\d+P\d+O*\d*:::)?\(\s*([^\(\)]*?)\s*\)/g,
        arraylike: /(@\d+L\d+P\d+O*\d*:::)?\[(\s*[^\[\]]*?)\s*\]/g,
        call: /(@\d+L\d+P\d+O*\d*:::)?((new)\s+([\$a-zA-Z_\.][\$\w\.]*)|(\.)?([\$a-zA-Z_][\$\w]*))\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*([^\$\w\s\{]|[\r\n].|\s*___boundary_[A-Z0-9_]{36}_\d+_as_array___|\s*@boundary_\d+_as_operator::|$)/g,
        callschain: /\s*(@\d+L\d+P\d+O*\d*:::)?\.\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_(call|callmethod)___(\s*(@\d+L\d+P\d+O*\d*:::)?\.\s*___boundary_[A-Z0-9_]{36}_\d+_as_(call|callmethod)___)*/g,
        arrowfn: /(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*(->|=>)\s*([^,;\r\n]+)\s*(,|;|\r|\n|$)/g,
        closure: /(@\d+L\d+P\d+O*\d*:::)?(@*[\$a-zA-Z_][\$\w]*|\)|\=|\(\s)?(@\d+L\d+P\d+O*\d*:::)?\s*\{(\s*[^\{\}]*?)\s*\}/g,
        expression: /(@\d+L\d+P\d+O*\d*:::)?(if|for|while|switch|with|catch|each)\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*;*\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_(closure|objlike)___)/g,
        if: /(@\d+L\d+P\d+O*\d*:::)?if\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*/g,
        log: /(@\d+L\d+P\d+O*\d*:::)?log\s+(.+?)\s*([;\r\n]+|$)/g
    }, matchExpRegPattern = {
        string: /(\/|\#|`|"|')([\*\/\=])?/,
        strings: {
            // 位置是在replace usings 和 strings 之后才tidy的，所以还存在后接空格
            '/': /(\s*@\d+L\d+P\d+O?\d*:::\s*)?(\/[^\/\r\n]+\/[img]*)(\s+in\s|\s*@boundary_\d+_as_(preoperator|operator|aftoperator|comments)::|\s*[\r\n]|(\s*[\$\w])|\s*[^\$\w]|\s*$)/,
            '`': /(\s*@\d+L\d+P\d+O*\d*:::\s*)?(`[^`]*`)(\s+in\s|\s*@boundary_\d+_as_(preoperator|operator|aftoperator|comments)::|\s*[\r\n]|(\s*[\$\w])|\s*[^\$\w]|\s*$)/,
            '"': /(\s*@\d+L\d+P\d+O*\d*:::\s*)?("[^\"\r\n]*")(\s+in\s|\s*@boundary_\d+_as_(preoperator|operator|aftoperator|comments)::|\s*[\r\n]|(\s*[\$\w])|\s*[^\$\w]|\s*$)/,
            "'": /(\s*@\d+L\d+P\d+O*\d*:::\s*)?('[^\'\r\n]*')(\s+in\s|\s*@boundary_\d+_as_(preoperator|operator|aftoperator|comments)::|\s*[\r\n]|\s*([\$\w])|\s*[^\$\w]|\s*$)/
        },
        index: /(\d+)_as_([a-z]+)/,
        index3: /^_(\d+)_as_([a-z]+)___([\s\S]*)$/,
        extends: /(ns|nsassign|global|globalassign|extends)\s+([\$a-zA-Z_][\$\w\.]*)\s*\{([^\{\}]*?)\}/,
        class: /(class|dec|expands)\s+(\.{1,3})?([\$a-zA-Z_][\$\w\.]*)?(\s+extends\s+(\.{1,3})?([\$a-zA-Z_][\$\w\.]*)|ignore)?\s*\{([^\{\}]*?)\}/,
        fnlike: /(^|(function|def|public)\s+)?([\$a-zA-Z_][\$\w]*)?\s*\(([^\(\)]*)\)\s*\{([^\{\}]*?)\}/,
        call: /([\$a-zA-Z_\.][\$\w\.]*)\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___/,
        arrowfn: /(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*(->|=>)\s*([\s\S]+)\s*$/,
        objectattr: /^\s*(@\d+L\d+P\d+O?\d*:::)?((([\$a-zA-Z_][\$\w]*)))\s*(\:*)([\s\S]*)$/,
        classelement: /^\s*(@\d+L\d+P\d+O?\d*:::)?((public|static|set|get|om)\s+)?([\$\w]*)\s*(\=*)([\s\S]*)$/,
        travelargs: /^((@\d+L\d+P\d+O*\d*:::)?[\$a-zA-Z_][\$\w\.]*)\s+as\s(@\d+L\d+P\d+O*\d*:::)([\$a-zA-Z_][\$\w]*)(\s*,((@\d+L\d+P\d+O*\d*:::)([\$a-zA-Z_][\$\w]*)?)?)?/
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
        function Sugar(input, source, toES6, run) {
            if (source === void 0) { source = ''; }
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
            this.sources = [];
            this.tess = {};
            this.anonymous_function = 0;
            this.closurecount = 0;
            this.uid = boundaryMaker();
            this.markPattern = new RegExp('@boundary_(\\\d+)_as_(mark)::', 'g');
            this.trimPattern = new RegExp('(___boundary_' + this.uid + '_(\\\d+)_as_(string|pattern|template)___|___boundary_(\\\d+)_as_propname___)', 'g');
            this.lastPattern = new RegExp('(___boundary_' + this.uid + '_(\\\d+)_as_(string|pattern|template)___|___boundary_(\\\d+)_as_propname___|@boundary_(\\\d+)_as_(keyword|midword|preoperator|operator|aftoperator|comments)::)', 'g');
            this.input = input;
            this.output = undefined;
            this.replacements = [['{}'], ['/='], ['/'], [' +'], [' -'], [' === ']];
            this.mappings = [];
            if (toES6) {
                this.toES6 = true;
            }
            if (source) {
                this.sources.push({
                    id: 0,
                    src: source
                });
                this.sources[source] = true;
            }
            if (run) {
                this.run();
            }
        }
        Sugar.prototype.compile = function () {
            // console.log(this.input);
            var newcontent = this.markPosition(this.input, 0);
            var string = this.encode(newcontent);
            var vars = {
                parent: null,
                root: {
                    namespace: this.namespace,
                    public: {},
                    private: {},
                    protected: {},
                    fixed: [],
                    fix_map: {}
                },
                locals: {},
                type: 'root'
            };
            vars.self = vars.root.protected;
            this.buildAST(this.pickReplacePosis(this.getLines(string, vars), vars), vars);
            // this.output = 'console.log("Hello, world!");';
            this.generate();
            // console.log(this.replacements);
            return this;
        };
        Sugar.prototype.error = function (str) {
            throw 'tangram.js sugar Error: ' + str;
        };
        Sugar.prototype.markPosition = function (string, sourceid) {
            if (sourceid === void 0) { sourceid = 0; }
            var lines = string.split(/\r{0,1}\n/);
            // console.log(lines);
            var positions = [];
            for (var l = 0; l < lines.length; l++) {
                var elements = lines[l].split(/(,|;|\{|\[|\(|\}|\sas\s|->|=>)/);
                // console.log(elements);
                var newline = [];
                for (var c = 0, length_1 = 0; c < elements.length; c++) {
                    var element = elements[c];
                    if (c === 0) {
                        length_1 = 0;
                    }
                    if (element === ',' || element === ';' || element === '{' || element === '[' || element === '(' || element === '}' || element === ' as ' || element === '->' || element === '=>') {
                        newline.push(element);
                    }
                    else {
                        newline.push('@' + sourceid + 'L' + l + 'P' + length_1 + ':::' + element);
                    }
                    length_1 += element.length;
                }
                positions.push(newline);
            }
            var newlines = positions.map(function (line) {
                return line.join("");
            });
            this.positions.push(positions);
            // console.log(newlines.join("\r\n"));
            return newlines.join("\r\n");
        };
        Sugar.prototype.tidyPosition = function (string) {
            var on = true;
            while (on) {
                on = false;
                string = string.replace(/(@\d+L\d+P\d+O?\d*:::\s*)+(@\d+L\d+P0:::)/g, function (match, last, newline) {
                    // console.log(match);
                    on = true;
                    return "\r\n" + newline;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/[\r\n]*(@\d+L\d+P)0:::(\s+)/g, function (match, pre, space) {
                    // console.log(pre, space);
                    on = true;
                    return "\r\n" + pre + space.length + 'O0:::';
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(@\d+L\d+P)(\d+):::(\s+)/g, function (match, pre, num, space) {
                    // console.log(pre, num, space);
                    on = true;
                    return pre + (parseInt(num) + space.length) + 'O' + num + ':::';
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(\{|\[|\(|\)|\]|\})\s*@\d+L\d+P\d+O?\d*:::\s*(\)|\]|\})/g, function (match, before, atfer) {
                    // console.log(match);
                    on = true;
                    return before + atfer;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(@\d+L\d+P\d+O?\d*:::\s*)+(\)|\]|\})/g, function (match, posi, panbrackets) {
                    // console.log(match);
                    on = true;
                    return panbrackets;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(\s*@\d+L\d+P\d+O?\d*:::)+(,|;)/g, function (match, posi, panstop) {
                    // console.log(match);
                    on = true;
                    return panstop;
                });
            }
            string = string.replace(/::::/g, '::: :');
            return string;
        };
        Sugar.prototype.encode = function (string) {
            var _this = this;
            // console.log(string);
            string = string
                .replace(replaceExpRegPattern.module, function (match, gaps, preline, posi, gap) {
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
                blockreserved.push('module');
                // console.log(gaps, preline, posi, !!gap, gap.length);
                // console.log('This is not a main block.', this.maintag_posi);
                return '';
            })
                .replace(replaceExpRegPattern.namespace, function (match, posi, at, gap, namespace) {
                if (_this.namespace === '') {
                    _this.namespace += namespace + '.';
                    _this.namespace_posi = at;
                    if (gap) {
                        _this.namespace_posi += 'O' + gap.length;
                    }
                    _this.namespace.replace(/^\.+/, '').replace(/\.+/, '.');
                    // console.log('namespace:' + namespace, this.namespace_posi);
                }
                return '';
            });
            // console.log(string);
            string = this.replaceUsing(string);
            // console.log(string);
            string = this.replaceStrings(string);
            string = this.replaceIncludes(string);
            // console.log(string);
            string = this.tidyPosition(string);
            // console.log(string);
            string = string.replace(/(@\d+L\d+P\d+O?\d*:::)?((public|static|set|get|om)\s+)?___boundary_[A-Z0-9_]{36}_(\d+)_as_string___\s*(\:|\(|\=)/g, function (match, posi, desc, type, index, after) {
                // console.log(posi, desc, this.replacements[index][1]);
                if (_this.replacements[index][1]) {
                    return /*"\r\n" + */ _this.replacements[index][1] + '___boundary_' + index + '_as_propname___' + after;
                }
                if (desc) {
                    return /*"\r\n" + */ posi + desc + '___boundary_' + index + '_as_propname___' + after;
                }
                return /*"\r\n" + */ '___boundary_' + index + '_as_propname___' + after;
            });
            string = string
                .replace(/([\$a-zA-Z_][\$\w]*)\s*(->|=>)/g, "($1)$2")
                .replace(/\.\s*\(/g, "..storage.set(")
                .replace(/@\s*\(/g, "..storage.get(");
            // console.log(string);
            // console.log(this.replacements);
            string = this.replaceBrackets(string);
            // console.log(string);
            string = this.replaceBraces(string);
            // console.log(string);
            string = this.replaceParentheses(string);
            // console.log(string);
            string = string
                .replace(/@\d+L\d+P\d+O?\d*:::(___boundary_|$)/g, "$1")
                .replace(/@\d+L\d+P\d+O?\d*:::(___boundary_|$)/g, "$1")
                .replace(/\s*(,|;)\s*/g, "$1\r\n");
            // console.log(string);
            // console.log(this.replacements);
            return string;
        };
        Sugar.prototype.replaceUsing = function (string) {
            var _this = this;
            return string.replace(replaceExpRegPattern.use, function (match, posi, $, url, as, alias, variables, posimembers, members) {
                // console.log(arguments);
                // console.log(match, ':', posi, url, as, alias);
                var index = _this.replacements.length;
                if (members) {
                    // console.log(members);
                    // url = url.replace(array, '[]');
                    _this.replacements.push([url, members, posi]);
                    return '___boundary_' + _this.uid + '_' + index + '_as_usings___;';
                }
                if ($) {
                    url = '$_/' + url;
                }
                _this.replacements.push([url, variables, posi]);
                return '___boundary_' + _this.uid + '_' + index + '_as_using___;';
            });
        };
        Sugar.prototype.replaceStrings = function (string, ignoreComments) {
            var _this = this;
            if (ignoreComments === void 0) { ignoreComments = false; }
            string = string.replace(/\\+(`|")/g, function (match) {
                var index = _this.replacements.length;
                _this.replacements.push([match]);
                return '@boundary_' + index + '_as_mark::';
            }).replace(/\\[^\r\n](@\d+L\d+P\d+O?\d*:::)*/g, function (match) {
                var index = _this.replacements.length;
                _this.replacements.push([match]);
                return '@boundary_' + index + '_as_mark::';
            });
            // console.log(string);
            var count = 0;
            var matches = string.match(matchExpRegPattern.string);
            var _loop_1 = function () {
                count++;
                // console.log(count, matches );
                // console.log(matches);
                var index_1 = this_1.replacements.length;
                switch (matches[1]) {
                    case '#':
                        string = string.replace(/(\S*)\s*\#.+/, "$1");
                        matches = string.match(matchExpRegPattern.string);
                        return "continue";
                    case '/':
                        switch (matches[2]) {
                            case '*':
                                if (ignoreComments) {
                                    // console.log(true);
                                    string = string.replace(/\/\*{1,2}[\s\S]*?(\*\/|$)/, function (match) {
                                        _this.replacements.push([match]);
                                        return '@boundary_' + index_1 + '_as_comments::';
                                    });
                                }
                                else {
                                    string = string.replace(/\/\*{1,2}[\s\S]*?(\*\/|$)/, "");
                                }
                                matches = string.match(matchExpRegPattern.string);
                                return "continue";
                            case '/':
                                string = string.replace(/(\S*)\s*\/\/.*/, "$1");
                                matches = string.match(matchExpRegPattern.string);
                                return "continue";
                            case '=':
                                string = string.replace(matches[0], '@boundary_1_as_operator::');
                                matches = string.match(matchExpRegPattern.string);
                                return "continue";
                        }
                        break;
                }
                var match = string.match(matchExpRegPattern.strings[matches[1]]);
                if (match && (matches.index >= match.index) && !match[5]) {
                    // console.log(matches, match);
                    if (match[1]) {
                        this_1.replacements.push([match[2].replace(/@\d+L\d+P\d+O?\d*:::/g, ''), match[1].trim(), match[4]]);
                    }
                    else {
                        this_1.replacements.push([match[2].replace(/@\d+L\d+P\d+O?\d*:::/g, ''), void 0, match[4]]);
                    }
                    string = string.replace(match[0], '___boundary_' + this_1.uid + '_' + index_1 + stringas[matches[1]] + match[3]);
                }
                else if (matches[0] === '/') {
                    string = string.replace(matches[0], '@boundary_2_as_operator::');
                }
                else {
                    // console.log(string, matches, match);
                    // console.log(matches, match);
                    this_1.error('Unexpected `' + matches[1] + '` in `' + this_1.decode(string.substr(matches.index, 256)) + '`');
                }
                matches = string.match(matchExpRegPattern.string);
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
            if (this.sources.length) {
                var on_1 = true;
                var id_1 = this.sources.length - 1;
                while (on_1) {
                    on_1 = false;
                    string = string.replace(replaceExpRegPattern.include, function (match, index) {
                        // console.log(match, this.replacements[index][0]);
                        // console.log(this.sources);
                        // console.log(id, this.sources[id].src);
                        on_1 = true;
                        var str = _this.onReadFile(_this.replacements[index][0].replace(/('|"|`)/g, '').trim(), _this.sources[id_1].src.replace(/[^\/\\]+$/, ''));
                        str = _this.markPosition(str, _this.sources.length - 1);
                        // console.log(str);
                        str = _this.replaceStrings(str);
                        // console.log(str);
                        str = _this.replaceIncludes(str);
                        return str + "\r\n"; //this.onReadFile(match);
                    });
                }
            }
            else {
                var on_2 = true;
                while (on_2) {
                    on_2 = false;
                    string = string.replace(replaceExpRegPattern.include, function (match, index) {
                        // console.log(match);
                        on_2 = true;
                        return _this.onReadFile(_this.replacements[index][0].replace(/('|"|`)/g, '').trim());
                    });
                }
            }
            return string;
        };
        Sugar.prototype.onReadFile = function (match, source) {
            if (source === void 0) { source = void 0; }
            // console.log(match, source);
            return "/* include '" + match + "' not be supported. */\r\n";
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
                    string = string.replace(replaceExpRegPattern.arraylike, function (match, posi, elements) {
                        // console.log(match);
                        elements = _this.replaceBraces(elements);
                        elements = _this.replaceParentheses(elements);
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
                    this.error('Unexpected `' + (right >= 0 ? ']' : '[') + '` in `' + this.decode(string.substr(index, 256)) + '`');
                }
            }
            if (right >= 0) {
                var index = right;
                this.error('Unexpected `]` in `' + this.decode(string.substr(index, 256)) + '`');
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
                    string = this.recheckFnOrCallLikes(string);
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
                    this.error('Unexpected `' + (right >= 0 ? '}' : '{') + '` in `' + this.decode(string.substr(index, 256)) + '`');
                }
            }
            if (right >= 0) {
                var index = right;
                // console.log(string);
                this.error('Unexpected `}` in `' + this.decode(string.substr(index, 256)) + '`');
            }
            return string;
        };
        Sugar.prototype.replaceCodeSegments = function (string) {
            var _this = this;
            var matched = false;
            string = string.replace(replaceExpRegPattern.class, function (match, posi, body) {
                matched = true;
                body = _this.replaceParentheses(body);
                var index = _this.replacements.length;
                _this.replacements.push([body, posi && posi.trim()]);
                return '___boundary_' + _this.uid + '_' + index + '_as_class___';
            });
            if (matched)
                return string;
            string = string.replace(replaceExpRegPattern.extends, function (match, posi, exp, name, node, assign, closure) {
                matched = true;
                name = name.replace(/^\.+/, '');
                var body;
                if (assign) {
                    if (exp === 'extends') {
                        _this.error('Unexpected `extends`: extends ' + name + ' with');
                    }
                    else {
                        if (node && node.length === 2) {
                            body = 'globalassign ' + name + '{' + _this.replaceParentheses(closure) + '}';
                        }
                        else {
                            body = 'nsassign ' + name + '{' + _this.replaceParentheses(closure) + '}';
                        }
                    }
                }
                else {
                    if (exp === 'extends') {
                        if (node) {
                            if (node.length === 2) {
                                body = 'globalassign ' + name + '{' + _this.replaceParentheses(closure) + '}';
                            }
                            else {
                                body = 'nsassign ' + name + '{' + _this.replaceParentheses(closure) + '}';
                            }
                        }
                        else {
                            body = 'extends ' + name + '{' + _this.replaceParentheses(closure) + '}';
                        }
                    }
                    else {
                        if (node && node.length === 2) {
                            body = 'global ' + name + '{' + _this.replaceParentheses(closure) + '}';
                        }
                        else {
                            body = 'ns ' + name + '{' + _this.replaceParentheses(closure) + '}';
                        }
                    }
                }
                var index = _this.replacements.length;
                _this.replacements.push([body, posi && posi.trim()]);
                return '___boundary_' + _this.uid + '_' + index + '_as_extends___';
            });
            if (matched)
                return string;
            string = string.replace(replaceExpRegPattern.fnlike, function (match, posi, typewithgap, type, call, callname, closure) {
                matched = true;
                // console.log(match);
                closure = _this.replaceParentheses(closure);
                call = _this.replaceOperators(call);
                match = (typewithgap || '') + call + ' {' + closure + '}';
                var index = _this.replacements.length;
                // console.log(match);
                _this.replacements.push([match, posi && posi.trim()]);
                return '___boundary_' + _this.uid + '_' + index + '_as_function___';
            });
            if (matched)
                return string;
            return string.replace(replaceExpRegPattern.closure, function (match, posi1, word, posi3, closure) {
                // console.log(match, '|', word, '|', posi2, '|', posi3, '|', closure);
                // if (!word && match.match(/\s*\{\s*\}/)) {
                //     console.log(posi2, '|', posi3);
                //     return '@boundary_0_as_mark::';
                // }
                closure = _this.replaceParentheses(closure);
                // closure = this.replaceOperators(closure, false);
                // console.log(closure);
                posi1 = posi1 ? posi1.trim() : '';
                posi3 = posi3 ? posi3.trim() : '';
                var index = _this.replacements.length;
                var index2;
                switch (word) {
                    case undefined:
                        if ((closure.indexOf(';') >= 0) ||
                            !closure.match(/^\s*(@\d+L\d+P\d+O?\d*:::)?(___boundary_[A-Z0-9_]{36}_\d+_as_function___|[\$a-zA-Z_][\$\w]*\s*(,|:|$))/)) {
                            _this.replacements.push(['{' + closure + '}', posi3]);
                            return posi1 + (word || '') + posi3 + ' ___boundary_' + _this.uid + '_' + index + '_as_closure___';
                        }
                        if (closure.match(/^\s*___boundary_[A-Z0-9_]{36}_\d+_as_function___\s*$/)) {
                            _this.replacements.push(['{' + closure + '}', posi3]);
                            return posi1 + (word || '') + posi3 + ' ___boundary_' + _this.uid + '_' + index + '_as_objlike___';
                        }
                        // console.log(closure);
                        // console.log(word, '|', posi2, '|', posi3);
                        _this.replacements.push(['{' + closure + '}', posi3]);
                        return '___boundary_' + _this.uid + '_' + index + '_as_object___';
                    case '=':
                        _this.replacements.push(['{' + closure + '}']);
                        return '= ___boundary_' + _this.uid + '_' + index + '_as_object___';
                    case '@config':
                        if (_this.configinfo === '{}') {
                            _this.configinfo_posi = posi1 || posi3;
                            _this.configinfo = _this.decode(match.replace('@config', ''));
                        }
                        return '';
                    case 'return':
                    case 'typeof':
                        _this.replacements.push([word + ' ', posi1]);
                        index2 = _this.replacements.length;
                        _this.replacements.push(['{' + closure + '}']);
                        return '@boundary_' + index + '_as_preoperator::___boundary_' + _this.uid + '_' + index2 + '_as_object___';
                    case 'do':
                    case 'try':
                        _this.replacements.push([word + ' ', posi1]);
                        index2 = _this.replacements.length;
                        _this.replacements.push(['{' + closure + '}', posi3]);
                        return '; @boundary_' + index + '_as_keyword::___boundary_' + _this.uid + '_' + index2 + '_as_closure___;';
                    case 'else':
                    case 'finally':
                        _this.replacements.push([word + ' ', posi1]);
                        index2 = _this.replacements.length;
                        _this.replacements.push(['{' + closure + '}', posi3]);
                        return ";\r\n" + '@boundary_' + index + '_as_midword::___boundary_' + _this.uid + '_' + index2 + '_as_closure___';
                    default:
                        if (word.indexOf('(') === 0) {
                            // console.log(true, word);
                            _this.replacements.push(['{' + closure + '}', posi3]);
                            return word + '___boundary_' + _this.uid + '_' + index + '_as_object___';
                        }
                        // console.log(word, closure);
                        _this.replacements.push(['{' + closure + '}', posi3]);
                        return posi1 + word + ";\r\n" + posi3 + '___boundary_' + _this.uid + '_' + index + '_as_closure___;';
                }
            });
        };
        Sugar.prototype.replaceParentheses = function (string) {
            var _this = this;
            string = this.replaceWords(string);
            var left = string.indexOf('(');
            var right = string.indexOf(')');
            var count = 0;
            while ((count < this.stringReplaceTimes) && (left >= 0)) {
                count++;
                // console.log(left, right);
                if (left < right) {
                    string = string.replace(replaceExpRegPattern.parentheses, function (match, posi, paramslike) {
                        paramslike = _this.replaceOperators(paramslike);
                        paramslike = _this.replaceCalls(paramslike);
                        paramslike = _this.replaceArrowFunctions(paramslike);
                        var index = _this.replacements.length;
                        _this.replacements.push(['(' + paramslike + ')', posi && posi.trim()]);
                        return '___boundary_' + _this.uid + '_' + index + '_as_parentheses___';
                    });
                    // console.log(string);
                    string = this.recheckFnOrCallLikes(string);
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
                    this.error('Unexpected `' + (right >= 0 ? ')' : '(') + '` in `' + this.decode(string.substr(index, 256)) + '`');
                }
            }
            if (right >= 0) {
                var index = right;
                this.error('Unexpected `)` in `' + this.decode(string.substr(index, 256)) + '`');
            }
            string = this.replaceOperators(string);
            string = this.replaceCalls(string);
            string = this.replaceArrowFunctions(string);
            return string;
        };
        Sugar.prototype.replaceWords = function (string) {
            var _this = this;
            // console.log(string);
            return string.replace(replaceWords, function (match, posi, word, after) {
                var index = _this.replacements.length;
                // console.log(word, after);
                if (word === 'else') {
                    _this.replacements.push([word + ' ', posi && posi.trim()]);
                    return ";\r\n" + '@boundary_' + index + '_as_midword::' + after;
                }
                if (after === ';' || word === 'continue' || word === 'break') {
                    _this.replacements.push([word + ';', posi && posi.trim()]);
                    return ";\r\n" + '@boundary_' + index + '_as_keyword::;';
                }
                _this.replacements.push([word + ' ', posi && posi.trim()]);
                return ";\r\n" + '@boundary_' + index + '_as_keyword::' + after;
            });
        };
        Sugar.prototype.recheckFnOrCallLikes = function (string) {
            var _this = this;
            string = string.replace(replaceExpRegPattern.expression, function (match, posi, expname, exp, expindex, closure, closureindex) {
                // console.log(match, posi, expname, exp, expindex, closure, closureindex);
                // console.log(expindex, closureindex);
                // on = true;
                var expressioncontent = _this.replacements[expindex][0];
                var body = _this.replacements[closureindex][0];
                var index = _this.replacements.length;
                // console.log(index, match, expname + '(' + expressioncontent + ')' + body);
                // console.log(expressioncontent, body);
                _this.replacements.push([expname + expressioncontent + body, posi]);
                return '___boundary_' + _this.uid + '_' + index + '_as_expression___';
            }).replace(replaceExpRegPattern.if, function (match, posi, parentheses) {
                // on = true;
                var index = _this.replacements.length;
                _this.replacements.push(['if ' + parentheses, posi]);
                return '___boundary_' + _this.uid + '_' + index + '_as_if___';
            });
            return string;
        };
        Sugar.prototype.replaceOperators = function (string) {
            var _this = this;
            var on = true;
            while (on) {
                on = false;
                string = string.replace(operators.owords, function (match, posi, word) {
                    // console.log(match);
                    on = true;
                    var index = _this.replacements.length;
                    _this.replacements.push([' ' + word + ' ']);
                    return '@boundary_' + index + '_as_operator::';
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
                    if (word === 'instanceof') {
                        // console.log(match, before, word)
                        _this.replacements.push([' ' + word + ' ']);
                        before = before.trim();
                        return before + '@boundary_' + index + '_as_operator::' + right;
                    }
                    else {
                        _this.replacements.push([word + ' ']);
                    }
                    return before + '@boundary_' + index + '_as_preoperator::' + right;
                });
            }
            on = true;
            while (on) {
                // console.log(string);
                on = false;
                string = string.replace(operators.mixed, function (match, left, posi, op, right, posir, sign) {
                    // console.log(string);
                    // console.log(match, left, op, right, sign);
                    on = true;
                    if (sign) {
                        var _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '@boundary_' + _index + '_as_preoperator::');
                    }
                    var index = _this.replacements.length;
                    _this.replacements.push([' ' + op + '= ', posi]);
                    return left + '@boundary_' + index + '_as_operator::' + right;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.bool, function (match, left, posi, op, right, posir, sign) {
                    // console.log(match);
                    on = true;
                    if (sign) {
                        var _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '@boundary_' + _index + '_as_preoperator::');
                    }
                    var index = _this.replacements.length;
                    _this.replacements.push([' ' + op + ' ', posi]);
                    return left + '@boundary_' + index + '_as_operator::' + right;
                });
            }
            on = true;
            while (on) {
                on = false;
                // console.log(string);
                string = string.replace(operators.op, function (match, left, posi, op, right, posir, sign) {
                    // console.log(match);
                    on = true;
                    if (sign) {
                        var _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '@boundary_' + _index + '_as_preoperator::');
                    }
                    var index = _this.replacements.length;
                    _this.replacements.push([' ' + op + ' ', posi]);
                    // console.log(left + '@boundary_' + index + '_as_operator::' + right);
                    return left + '@boundary_' + index + '_as_operator::' + right;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.sign, function (match, before, sign, number) {
                    on = true;
                    // let index = this.replacements.length;
                    // this.replacements.push(' ' + sign);
                    var index = sign === '+' ? 3 : 4;
                    return before + '@boundary_' + index + '_as_preoperator::' + number;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.before, function (match, op, number) {
                    on = true;
                    var index = _this.replacements.length;
                    _this.replacements.push([op]);
                    return '@boundary_' + index + '_as_preoperator::' + number;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.after, function (match, number, posi, op) {
                    on = true;
                    var index = _this.replacements.length;
                    _this.replacements.push([op]);
                    return number + (posi || '') + '@boundary_' + index + '_as_aftoperator::';
                });
            }
            return string.replace(operators.error, function (match, before, op, after) {
                // console.log(string, match);
                if (after && after.indexOf('>') === 0) {
                    return match;
                }
                _this.error('Unexpected `' + op + '` in `' + _this.decode(match) + '`');
                return '';
            });
        };
        Sugar.prototype.replaceCalls = function (string) {
            var _this = this;
            // console.log(string);
            string = string.replace(replaceExpRegPattern.log, function (match, posi, params) {
                // console.log(match, params);
                var index1 = _this.replacements.length;
                _this.replacements.push(['(' + params + ')', undefined]);
                var index2 = _this.replacements.length;
                _this.replacements.push(['log___boundary_' + _this.uid + '_' + index1 + '_as_parentheses___', undefined]);
                var index3 = _this.replacements.length;
                _this.replacements.push(['.___boundary_' + _this.uid + '_' + index2 + '_as_callmethod___', posi]);
                return '___boundary_' + _this.uid + '_' + index3 + '_as_log___;';
            });
            return this.replaceCallsChain(string.replace(replaceExpRegPattern.call, function (match, posi, fullname, constructor, methodname, dot, callname, args, argindex, after) {
                // console.log(fullname);
                if (fullname.match(/^___boundary_[A-Z0-9_]{36}_\d+_as_(if|class|object|closure)___/)) {
                    return match;
                }
                var index = _this.replacements.length;
                if (constructor) {
                    // console.log(fullname);
                    _this.replacements.push([fullname + args, posi && posi.trim()]);
                    return '___boundary_' + _this.uid + '_' + index + '_as_construct___' + after;
                }
                else {
                    _this.replacements.push([callname + args, posi && posi.trim()]);
                    if (dot) {
                        return '.___boundary_' + _this.uid + '_' + index + '_as_callmethod___' + after;
                    }
                    else if (callname === 'if') {
                        return '___boundary_' + _this.uid + '_' + index + '_as_if___' + after;
                    }
                    return '___boundary_' + _this.uid + '_' + index + '_as_call___' + after;
                }
            }));
        };
        Sugar.prototype.replaceCallsChain = function (string) {
            var _this = this;
            // console.log(string);
            return string.replace(replaceExpRegPattern.callschain, function (match, posi, _index) {
                var index = _this.replacements.length;
                match = match.replace(/_as_call___/g, '_as_callmethod___');
                _this.replacements.push([match, posi || _this.replacements[_index][1]]);
                return '___boundary_' + _this.uid + '_' + index + '_as_callschain___';
            });
        };
        Sugar.prototype.replaceArrowFunctions = function (string) {
            var _this = this;
            var arrow = string.match(/(->|=>)/);
            // console.log(arrow);
            if (arrow) {
                if (string.match(replaceExpRegPattern.arrowfn)) {
                    // console.log(string.match(matchExpRegPattern.arrowfn));
                    return string.replace(replaceExpRegPattern.arrowfn, function (match, params, paramsindex, arrow, body, end) {
                        // console.log(match, params, paramsindex, arrow, body, end);
                        // console.log(body);
                        var posi = _this.replacements[paramsindex][1];
                        // console.log(match);
                        // console.log(body);
                        var matches = body.match(/^(@\d+L\d+P\d+O*\d*:::)?\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_(parentheses|object|closure)___\s*$/);
                        // console.log(matches);
                        if (matches) {
                            var code = _this.replacements[matches[2]][0];
                            var posi_1 = _this.replacements[matches[2]][1];
                            if (matches[3] === 'parentheses') {
                                body = code.replace(/^\(\s*(.*?)\s*\)$/, function (match, code) {
                                    var index = _this.replacements.length;
                                    _this.replacements.push(['return ', posi_1]);
                                    return '@boundary_' + index + '_as_preoperator:: ' + code;
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
                            body = '@boundary_' + index_2 + '_as_preoperator:: ' + body;
                            // console.log(body);
                        }
                        var index = _this.replacements.length;
                        _this.replacements.push([params + arrow + body, posi]);
                        return '___boundary_' + _this.uid + '_' + index + '_as_arrowfn___' + end;
                    });
                }
                else {
                    // console.log(string);
                    this.error('Unexpected `' + arrow[0] + '` in `' + this.decode(string.substr(arrow.index, 256)) + '`');
                }
            }
            return string;
        };
        Sugar.prototype.getPosition = function (string) {
            if (string) {
                // console.log(string);
                var match = string.match(/@(\d+)L(\d+)P(\d+)(O*)(\d*):{0,3}/);
                if (match) {
                    if (match[4]) {
                        var index = parseInt(match[5]);
                    }
                    else {
                        var index = parseInt(match[3]);
                    }
                    return {
                        match: match[0],
                        head: !index,
                        file: parseInt(match[1]),
                        line: parseInt(match[2]) + 1,
                        col: parseInt(match[3]) + 1,
                        o: [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), index],
                    };
                }
            }
            return void 0;
        };
        Sugar.prototype.getLines = function (string, vars, inOrder) {
            if (inOrder === void 0) { inOrder = false; }
            // console.log(string);
            string = string
                .replace(/:::(var|let|public)\s+(@\d+L\d+P(\d+O)?0:::)/g, ':::$1 ')
                .replace(/([^,;\s])\s*(@\d+L\d+P(\d+O)?0:::[^\.\(\[)])/g, '$1;$2')
                .replace(/[;\r\n]+(___boundary_[A-Z0-9_]{36}_\d+_as_(if|class|function|extends|call|log|object|objlike|closure|parentheses)___)/g, ";$1")
                .replace(/(___boundary_[A-Z0-9_]{36}_\d+_as_(log|closure)___)[;\r\n]+/g, "$1;\r\n")
                .replace(/[;\r\n]+((@\d+L\d+P\d+O?\d*:::)?___boundary_[A-Z0-9_]{36}_\d+_as_(callschain)___)/g, "$1")
                .replace(/(___boundary_[A-Z0-9_]{36}_\d+_as_(if)___)[;\s]*/g, "$1 ")
                .trim();
            var sentences = string.split(/\s*;+\s*/);
            var lines = [];
            // console.log(string, sentences);
            for (var s = 0; s < sentences.length; s++) {
                var sentence = sentences[s].trim();
                // console.log(sentence);
                if (sentence) {
                    var array = sentence.split(/:::(var|let|public)\s+/);
                    // console.log(array, sentence);
                    if (array.length === 1) {
                        var definition = sentence.match(/(^|\s+)(var|let|public)(\s+|$)/);
                        if (definition) {
                            var definitions = sentence.match(/(@boundary_\d+_as_midword::|(@boundary_\d+_as_midword::\s*)?___boundary_[A-Z0-9_]{36}_\d+_as_(if|closure)___)\s*(var|let|public)\s+([\s\S]+)/);
                            // console.log(definitions);
                            if (definitions) {
                                this.pushSentenceToLines(lines, definitions[1], 'inline');
                                this.pushVariablesToLines(lines, vars, undefined, definitions[5], definitions[4], true);
                                continue;
                            }
                            // console.log(sentence);
                            this.error('Unexpected `' + definition[1] + '` in `' + this.decode(sentence) + '`.');
                        }
                        else {
                            // console.log(sentence);
                            this.pushSentenceToLines(lines, sentence, 'block');
                        }
                    }
                    else if (array.length === 3) {
                        this.pushVariablesToLines(lines, vars, array[0], array[2], array[1], inOrder);
                        // console.log(spilitarray, sentences);
                    }
                    else {
                        // console.log(spilitarray[3], spilitarray);
                        var position = this.getPosition(array[2]);
                        this.error('Unexpected `' + array[3] + '` at char ' + position.col + ' on line ' + position.line + '， near ' + this.decode(array[2]) + '.');
                    }
                }
            }
            // console.log(lines);
            return lines;
        };
        Sugar.prototype.checkTretOfMatch = function (match_as_statement) {
            var tret_of_match = match_as_statement[3].trim();
            if (tret_of_match && !(tret_of_match === ';' && ['class', 'function', 'closure', 'if']['includes'](match_as_statement[2]))) {
                return [{
                        index: match_as_statement[1],
                        display: 'inline',
                        type: match_as_statement[2]
                    }, tret_of_match];
            }
            else {
                return null;
            }
        };
        Sugar.prototype.pushSentenceToLines = function (lines, code, display) {
            value = code.trim();
            if (value && !value.match(/^@\d+L\d+P\d+O?\d*:::$/)) {
                var match_as_statement = value.match(/^___boundary_[A-Z0-9_]{36}_(\d+)_as_([a-z]+)___([\r\n]+|$)/);
                // console.log(match_as_statement, display);
                if (match_as_statement) {
                    if (display === 'block' && !['class', 'function', 'closure', 'if']['includes'](match_as_statement[2])) {
                        // console.log(match_as_statement[2]);
                        value = value + ';';
                    }
                    // console.log(this.replacements[match_as_statement[1]]);
                    lines.push({
                        type: 'line',
                        subtype: match_as_statement[2],
                        posi: this.replacements[match_as_statement[1]][1],
                        display: display,
                        index: match_as_statement[1],
                        value: value
                    });
                }
                else {
                    // console.log(value, display === 'block');
                    if ((display === 'block') && !/_as_closure___$/.test(value)) {
                        value += ';';
                    }
                    else if (/_as_aftoperator::$/.test(value)) {
                        value += ';';
                        display === 'block';
                    }
                    // console.log(value);
                    var clauses = value.split(',');
                    // console.log(clauses);
                    for (var c = 0; c < clauses.length; c++) {
                        var element = clauses[c];
                        var position = this.getPosition(element);
                        // console.log(position, value)
                        if (position) {
                            if (display === 'block') {
                                position.head = true;
                            }
                            var value = element.replace(position.match, '');
                        }
                        else {
                            var value = element.trim();
                            var match_as_mark = value.match(/^@boundary_(\d+)_as_([a-z]+)::/);
                            if (match_as_mark && this.replacements[match_as_mark[1]][1]) {
                                position = this.getPosition(this.replacements[match_as_mark[1]][1]);
                                if (position && (display === 'block')) {
                                    position.head = true;
                                }
                            }
                        }
                        // if (display === 'block') {
                        //     value = value + ';';
                        // }
                        lines.push({
                            type: 'line',
                            subtype: 'sentence',
                            display: display,
                            posi: position,
                            value: value
                        });
                    }
                }
            }
        };
        Sugar.prototype.pushVariablesToLines = function (lines, vars, posi, code, symbol, inOrder) {
            if (inOrder === void 0) { inOrder = false; }
            var display;
            var clauses = code.split(/,\s*(@\d+L\d+P\d+O?\d*:::)/);
            clauses.unshift(posi);
            // console.log(array, clauses);
            for (var c = 0; c < clauses.length; c += 2) {
                if (inOrder) {
                    if (c) {
                        if (c === clauses.length - 2) {
                            display = 'last';
                        }
                        else {
                            display = 'inline';
                        }
                    }
                    else {
                        if (c === clauses.length - 2) {
                            display = 'block';
                        }
                        else {
                            display = 'first';
                        }
                    }
                }
                else {
                    display = 'block';
                }
                // console.log(display);
                this.pushVariableToLines(lines, vars, clauses[c], clauses[c + 1], symbol, display);
            }
        };
        Sugar.prototype.pushVariableToLines = function (lines, vars, posi, code, symbol, display) {
            if (display === void 0) { display = 'block'; }
            if (code) {
                if (this.toES6 && symbol !== 'public') {
                    var _symbol = symbol;
                }
                else {
                    var _symbol = 'var';
                }
                switch (display) {
                    case 'first':
                        return this.pushVariableToLine(lines, vars, code, symbol, posi, 'inline', _symbol, ',');
                    case 'last':
                        return this.pushVariableToLine(lines, vars, code, symbol, posi, 'inline', '', ';');
                    case 'block':
                        return this.pushVariableToLine(lines, vars, code, symbol, posi, 'block', _symbol, ';');
                    default:
                        return this.pushVariableToLine(lines, vars, code, symbol, posi, 'inline', '', ',');
                }
            }
        };
        Sugar.prototype.pushVariableToLine = function (lines, vars, code, symbol, posi, display, _symbol, endmark) {
            if (posi === void 0) { posi = ''; }
            if (display === void 0) { display = 'inline'; }
            if (_symbol === void 0) { _symbol = ''; }
            if (endmark === void 0) { endmark = ','; }
            if (code) {
                var position = this.getPosition(posi);
                var match = code.match(/^([\$\a-zA-Z_][\$\w]*)@boundary_(\d+)_as_operator::/);
                // console.log(code);
                if (match && ['in', 'of']['includes'](this.replacements[match[2]][0].trim())) {
                    var element = match[1];
                    lines.push({
                        type: 'line',
                        subtype: 'sentence',
                        display: 'inline',
                        posi: void 0,
                        value: symbol + ' ' + code
                    });
                    if (vars.self[element] === void 0) {
                        vars.self[element] = symbol;
                    }
                    else if (vars.self[element] === 'let' || symbol === 'let') {
                        this.error(' Variable `' + element + '` has already been declared at char ' + position.col + ' on line ' + position.line + '.');
                    }
                }
                else {
                    var array = code.split(/\s*=\s*/);
                    // console.log(array);
                    if (array.length === 1) {
                        var value = 'void 0';
                    }
                    else {
                        var value = array.pop();
                    }
                    for (var index_3 = 0; index_3 < array.length; index_3++) {
                        var element = array[index_3].trim();
                        if (position && display === 'block')
                            position.head = true;
                        if (index_3) {
                            lines.push({
                                type: 'line',
                                subtype: 'assignment',
                                posi: position,
                                display: display,
                                value: element + ' = ' + value + endmark
                            });
                        }
                        else {
                            if (element.match(/^[\$a-zA-Z_][\$\w]*$/)) {
                                // console.log(element);                    
                                this.pushVariableToVars(vars, symbol, element, position);
                                lines.push({
                                    type: 'line',
                                    subtype: 'variable',
                                    display: 'inline',
                                    posi: position,
                                    value: _symbol + ' ' + element + ' = '
                                });
                                lines.push({
                                    type: 'line',
                                    subtype: 'sentence',
                                    display: 'inline',
                                    posi: void 0,
                                    value: value + endmark
                                });
                                value = element;
                            }
                            else {
                                // console.log(element);
                                if (this.sources[position.file]) {
                                    this.error('Unexpected Definition `' + symbol + '` at char ' + position.col + ' on line ' + position.line + ' in file [' + position.file + '][' + this.sources[position.file].src + '].');
                                }
                                else {
                                    // console.log(element);
                                    this.error('Unexpected Definition `' + symbol + '` at char ' + position.col + ' on line ' + position.line + '.');
                                }
                            }
                        }
                    }
                }
            }
        };
        Sugar.prototype.pushVariableToVars = function (vars, symbol, variable, position) {
            if (vars.self[variable] !== void 0) {
                if (vars.self[variable] === 'let' || symbol === 'let') {
                    this.error(' Variable `' + variable + '` has already been declared at char ' + position.col + ' on line ' + position.line + '.');
                }
            }
            else {
                vars.self[variable] = symbol;
            }
            if (symbol === 'public' && (vars.root.namespace !== null)) {
                vars.root.public[variable] = variable;
            }
        };
        Sugar.prototype.pickReplacePosis = function (lines, vars) {
            var imports = [], using_as = {}, preast = [];
            for (var index_4 = 0; index_4 < lines.length; index_4++) {
                // console.log(lines[index]);
                switch (lines[index_4].subtype) {
                    case 'sentence':
                        // console.log(lines[index]);
                        var code = lines[index_4].value.trim();
                        this.pushSentencesToPREAST(preast, vars, code, lines[index_4].display, lines[index_4].posi);
                        break;
                    case 'variable':
                    case 'assignment':
                        preast.push([{
                                type: 'code',
                                posi: lines[index_4].posi,
                                display: lines[index_4].display,
                                vars: vars,
                                value: lines[index_4].value
                            }]);
                        break;
                    case 'using':
                    case 'usings':
                        // console.log(lines[index]);.return
                        var posi = this.replacements[lines[index_4].index][2];
                        var src = this.replacements[lines[index_4].index][0].trim();
                        // let alias = .trim();
                        if (!imports['includes'](src)) {
                            imports.push(src);
                            imports.push(posi);
                        }
                        if (this.replacements[lines[index_4].index][1]) {
                            var position = void 0;
                            var alias = void 0;
                            if (lines[index_4].subtype === 'usings') {
                                var members = this.replacements[lines[index_4].index][1].split(',');
                                for (var m = 0; m < members.length; m++) {
                                    position = this.getPosition(members[m]);
                                    alias = members[m].replace(position.match, '').trim();
                                    using_as[alias] = [src, alias, position];
                                }
                                // console.log(this.replacements[lines[index].index][1]);
                            }
                            else {
                                position = this.getPosition(this.replacements[lines[index_4].index][1]);
                                alias = this.replacements[lines[index_4].index][1].replace(position.match, '').trim();
                                // console.log(alias);
                                using_as[alias] = [src, '*', position];
                            }
                            if (vars.self[alias] === void 0) {
                                vars.self[alias] = 'var';
                            }
                            else if (vars.self[alias] === 'let') {
                                this.error(' Variable `' + alias + '` has already been declared at char ' + position.col + ' on line ' + position.line + '.');
                            }
                        }
                        break;
                    default:
                        preast.push([{
                                index: lines[index_4].index,
                                display: lines[index_4].display,
                                type: lines[index_4].subtype
                            }]);
                        break;
                }
            }
            this.imports = imports;
            this.using_as = using_as;
            // console.log(using_as);
            // console.log(imports, preast);
            return preast;
        };
        Sugar.prototype.pushSentencesToPREAST = function (preast, vars, code, display, lineposi) {
            if (preast === void 0) { preast = []; }
            if (display === void 0) { display = 'block'; }
            if (code) {
                var inline = [];
                var statements = code.split('___boundary_' + this.uid);
                while (!statements[0].trim()) {
                    statements.shift();
                }
                // console.log(statements)
                for (var s = 0; s < statements.length; s++) {
                    var statement = statements[s];
                    if (statement.trim()) {
                        var match_as_statement = statement.match(matchExpRegPattern.index3);
                        // console.log(match_as_statement);
                        if (match_as_statement) {
                            var array = this.checkTretOfMatch(match_as_statement);
                            if (array) {
                                inline.push(array[0]);
                                this.pushRowsToAST(inline, vars, array[1], false, undefined);
                            }
                            else {
                                // console.log(lines[index].display);
                                inline.push({
                                    index: match_as_statement[1],
                                    display: (statements.length === 1) ? display : 'inline',
                                    type: match_as_statement[2]
                                });
                            }
                        }
                        else {
                            if ((statements.length === 1) && (display === 'block')) {
                                this.pushRowsToAST(inline, vars, statements[0], true, lineposi);
                            }
                            else {
                                this.pushRowsToAST(inline, vars, statements[0], false, lineposi);
                            }
                        }
                    }
                }
                preast.push(inline);
                return preast;
            }
        };
        Sugar.prototype.buildAST = function (preast, vars) {
            // console.log(preast);
            var ast = {
                type: 'codes',
                vars: vars,
                body: []
            };
            for (var index_5 = 0; index_5 < preast.length; index_5++) {
                var block = preast[index_5];
                if (block.length === 1) {
                    var element = block[0];
                    if (element.type === 'code') {
                        ast.body.push(element);
                    }
                    else {
                        ast.body.push(this.walk(element, vars, false));
                    }
                }
                else {
                    var codes = {
                        type: 'codes',
                        vars: vars,
                        body: []
                    };
                    for (var b = 0; b < block.length; b++) {
                        var element = block[b];
                        if (element.type === 'code') {
                            codes.body.push(element);
                        }
                        else {
                            codes.body.push(this.walk(element, vars, true));
                        }
                    }
                    ast.body.push(codes);
                }
            }
            this.ast = ast;
            return this;
        };
        Sugar.prototype.pushBodyToAST = function (body, vars, code, inOrder) {
            if (body === void 0) { body = []; }
            if (inOrder === void 0) { inOrder = false; }
            var lines = code ? this.getLines(code, vars, inOrder) : [];
            // console.log(code, lines);
            for (var index_6 = 0; index_6 < lines.length; index_6++) {
                switch (lines[index_6].subtype) {
                    case 'sentence':
                        var code_1 = lines[index_6].value.trim();
                        // console.log(lines[index].display === 'block', line);
                        // console.log(lines[index]);
                        this.pushSentencesToAST(body, vars, code_1, !inOrder && (lines[index_6].display === 'block'), lines[index_6].posi);
                        break;
                    case 'variable':
                        body.push({
                            type: 'code',
                            posi: lines[index_6].posi,
                            display: inOrder ? 'inline' : lines[index_6].display,
                            vars: vars,
                            value: lines[index_6].value
                        });
                        break;
                    default:
                        body.push(this.walk({
                            index: lines[index_6].index,
                            display: inOrder ? 'inline' : 'block',
                            type: lines[index_6].subtype
                        }, vars, inOrder));
                        break;
                }
            }
            // console.log(body);
            return body;
        };
        Sugar.prototype.pushSentencesToAST = function (body, vars, code, isblock, lineposi) {
            if (body === void 0) { body = []; }
            if (isblock === void 0) { isblock = true; }
            if (code) {
                // console.log(isblock, lineposi);
                var inline = [];
                var statements = code.split('___boundary_' + this.uid);
                while (!statements[0].trim()) {
                    statements.shift();
                }
                // console.log(statements)
                if (statements.length === 1) {
                    this.pushReplacementsToAST(inline, vars, statements[0], isblock, lineposi);
                }
                else {
                    for (var s = 0; s < statements.length; s++) {
                        this.pushReplacementsToAST(inline, vars, statements[s], false, (s === 0) && lineposi);
                    }
                }
                if (inline.length === 1) {
                    body.push(inline[0]);
                }
                else {
                    body.push({
                        type: 'codes',
                        vars: vars,
                        body: inline
                    });
                }
            }
            return body;
        };
        Sugar.prototype.pushReplacementsToAST = function (body, vars, code, isblock, lineposi) {
            // console.log(code);
            // code = code.trim();
            if (code.trim()) {
                var match_as_statement = code.match(matchExpRegPattern.index3);
                // console.log(match_as_statement);
                // console.log(code, match_as_statement, isblock, lineposi);
                if (match_as_statement) {
                    var array = this.checkTretOfMatch(match_as_statement);
                    if (array) {
                        body.push(this.walk(array[0], vars, true));
                        this.pushRowsToAST(body, vars, array[1], false, undefined);
                    }
                    else {
                        body.push(this.walk({
                            index: match_as_statement[1],
                            display: isblock ? 'block' : 'inline',
                            type: match_as_statement[2]
                        }, vars, true));
                    }
                }
                else {
                    this.pushRowsToAST(body, vars, code, isblock, lineposi);
                }
            }
            return body;
        };
        Sugar.prototype.pushRowsToAST = function (body, vars, code, isblock, lineposi) {
            var rows = code.split(/[\r\n]+/);
            // console.log(array);
            for (var r = 0; r < rows.length; r++) {
                var row = rows[r];
                if (row.trim()) {
                    this.pushCodeToAST(body, vars, row, isblock, (r === 0) && lineposi);
                }
            }
            return body;
        };
        Sugar.prototype.pushCodeToAST = function (body, vars, code, isblock, lineposi) {
            var display = isblock ? 'block' : 'inline';
            var position = this.getPosition(code) || lineposi;
            if (position) {
                var element = code.replace(position.match, '');
            }
            else {
                var element = code;
            }
            // console.log(element, position);
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
        Sugar.prototype.walk = function (element, vars, inOrder) {
            if (vars === void 0) { vars = false; }
            // console.log(element);
            switch (element.type) {
                case 'array':
                    return this.walkArray(element.index, element.display, vars);
                case 'arrowfn':
                    return this.walkArrowFn(element.index, element.display, vars);
                case 'if':
                // console.log(element);
                case 'call':
                case 'callmethod':
                case 'construct':
                    return this.walkCall(element.index, element.display, vars, element.type);
                case 'log':
                case 'callschain':
                    return this.walkCallsChain(element.index, element.display, vars, element.type);
                case 'class':
                    return this.walkClass(element.index, element.display, vars);
                case 'objlike':
                    if (inOrder) {
                        // console.log(true, element);
                        element.type = 'object';
                        return this.walkObject(element.index, element.display, vars);
                    }
                case 'closure':
                    return this.walkClosure(element.index, element.display, vars);
                case 'expression':
                    return this.walkFnLike(element.index, element.display, vars, 'exp');
                case 'extends':
                    return this.walkExtends(element.index, element.display, vars);
                case 'function':
                    // console.log(element.index, element.display, vars, 'def');
                    return this.walkFnLike(element.index, element.display, vars, 'def');
                case 'object':
                    return this.walkObject(element.index, element.display, vars);
                case 'parentheses':
                    return this.walkParentheses(element.index, element.display, vars);
                case 'pattern':
                case 'string':
                case 'template':
                    var that_1 = this;
                    var position = this.getPosition(this.replacements[element.index][1]);
                    // console.log(position);
                    return {
                        type: 'code',
                        posi: position,
                        display: element.display || 'inline',
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
            var body = [], position = this.getPosition(this.replacements[index][1]), clauses = this.replacements[index][0].replace(/([\[\s\]])/g, '').split(',');
            // console.log(this.replacements[index], clauses);
            for (var c = 0; c < clauses.length; c++) {
                if (c) {
                    var posi = this.getPosition(clauses[c]);
                }
                else {
                    var posi = this.getPosition(clauses[c]) || position;
                }
                this.pushSentencesToAST(body, vars, clauses[c], false, posi);
            }
            // console.log(body);
            return {
                type: 'array',
                posi: position,
                display: display,
                vars: vars,
                body: body
            };
        };
        Sugar.prototype.walkArrowFn = function (index, display, vars) {
            var matches = this.replacements[index][0].match(matchExpRegPattern.arrowfn);
            // console.log(this.replacements[index], matches);
            var subtype = 'fn';
            var selfvas = {};
            if (matches[3] === '=>') {
                subtype = '=>';
                vars.locals['this'] = null;
                vars.locals['arguments'] = null;
                var locals = vars.locals;
                var varstype = 'arrowfn';
            }
            else {
                var locals = {};
                var varstype = 'root';
            }
            var localvars = {
                parent: vars,
                root: {
                    namespace: null,
                    public: {},
                    private: {},
                    protected: {},
                    fixed: [],
                    fix_map: {}
                },
                locals: locals,
                type: varstype
            };
            localvars.self = localvars.root.protected;
            var args = this.checkArgs(this.replacements[matches[2]][0].replace(/(^\(|\)$)/g, ''), localvars);
            // console.log(matches);
            return {
                type: 'def',
                posi: this.getPosition(this.replacements[index][1]),
                display: 'inline',
                vars: localvars,
                subtype: subtype,
                args: args.keys,
                defaults: args.vals,
                body: this.checkFnBody(localvars, args, matches[4])
            };
        };
        Sugar.prototype.walkCall = function (index, display, vars, type) {
            // console.log(this.replacements[index]);
            var name = [], params = [], matches = this.replacements[index][0].match(matchExpRegPattern.call), position = this.getPosition(this.replacements[index][1]), nameArr = matches[1].split('___boundary_' + this.uid), paramArr = this.replacements[matches[2]][0].split(/([\(,\)])/);
            // console.log(this.getLines(this.replacements[matches[2]][0], vars));
            // console.log(this.replacements[index], matches);
            for (var n = 0; n < nameArr.length; n++) {
                var element = nameArr[n];
                if (element) {
                    if (type === 'construct') {
                        // console.log(name, nameArr);
                        this.pushReplacementsToAST(name, vars, element, false, undefined);
                    }
                    else {
                        this.pushReplacementsToAST(name, vars, element, false, (n === 0) && position);
                    }
                }
            }
            // console.log(matches, paramArr);
            for (var p = 0; p < paramArr.length; p++) {
                var paramPosi = this.getPosition(paramArr[p]);
                if (paramPosi) {
                    var param = paramArr[p].replace(paramPosi.match, '').trim();
                }
                else {
                    var param = paramArr[p].trim();
                }
                // console.log(paramPosi);
                if (param && param != '(' && param != ')' && param != ',') {
                    // console.log(p, param, paramPosi);
                    var statements = param.split('___boundary_' + this.uid);
                    var inline = [];
                    for (var s = 0; s < statements.length; s++) {
                        this.pushReplacementsToAST(inline, vars, statements[s], false, (s === 0) && paramPosi);
                    }
                    // console.log(inline);
                    if (inline.length) {
                        params.push({
                            type: 'parameter',
                            posi: inline[0].posi || paramPosi,
                            display: 'inline',
                            vars: vars,
                            body: inline
                        });
                    }
                    else {
                        params.push({
                            type: 'parameter',
                            posi: paramPosi,
                            display: 'inline',
                            vars: vars,
                            body: [{
                                    type: 'code',
                                    posi: paramPosi,
                                    display: 'inline',
                                    vars: vars,
                                    value: 'void 0'
                                }]
                        });
                    }
                }
            }
            if (type === 'callmethod') {
                if (position)
                    position.head = false;
                display = 'inline';
            }
            // console.log(this.replacements[index]);
            return {
                type: type,
                posi: position,
                display: display,
                name: name,
                vars: vars,
                params: params
            };
        };
        Sugar.prototype.walkCallsChain = function (index, display, vars, type) {
            var _this = this;
            var code = this.replacements[index][0], position = this.getPosition(this.replacements[index][1]), calls = [];
            code.replace(/(@\d+L\d+P\d+O*\d*:::)?\.___boundary_[A-Z0-9_]{36}_(\d+)_as_callmethod___/g, function (match, posi, _index) {
                // console.log(match, posi, _index);
                if (posi) {
                    _this.replacements[_index][1] = posi;
                }
                calls.push(_this.walkCall(_index, 'inline', vars, 'callmethod'));
                return '';
            });
            // console.log(code, calls, position);
            if (type === 'log' && position) {
                position.head = true;
            }
            return {
                type: type,
                posi: position,
                display: (position && position.head) ? 'blocks' : 'inline',
                vars: vars,
                calls: calls
            };
        };
        Sugar.prototype.walkClass = function (index, display, vars) {
            if (vars === void 0) { vars = true; }
            // console.log(this.replacements[index]);
            var matches = this.replacements[index][0].match(matchExpRegPattern.class);
            // console.log(matches);
            var type = matches[1];
            var namespace = vars.root.namespace || this.namespace;
            var cname = matches[3];
            var subtype = 'stdClass';
            if (matches[2]) {
                if (matches[2].length !== 2) {
                    cname = namespace + cname;
                }
            }
            else {
                if (type === 'dec') {
                    if (cname) {
                        cname = namespace + cname;
                    }
                    else if (namespace) {
                        cname = namespace.replace(/\.$/, '');
                    }
                    else {
                        subtype = 'anonClass';
                    }
                }
                else {
                    subtype = 'anonClass';
                }
            }
            var basename = matches[6];
            var position = this.getPosition(this.replacements[index][1]);
            if (type === 'class') {
                if ((subtype === 'anonClass') && cname && cname.match(namingExpr)) {
                    this.pushVariableToVars(vars, 'var', cname, position);
                }
                if (matches[5]) {
                    if (matches[5].length === 2) {
                        basename = 'pandora.' + basename;
                    }
                    else {
                        basename = 'pandora.' + namespace + basename;
                    }
                }
            }
            else {
                if (matches[4] === 'ignore') {
                    basename = true;
                }
                else {
                    basename = false;
                }
            }
            return {
                type: type,
                posi: position,
                display: display,
                subtype: subtype,
                cname: cname,
                base: basename,
                vars: vars,
                body: this.checkClassBody(vars, matches[7] || '')
            };
        };
        Sugar.prototype.walkClosure = function (index, display, vars) {
            // console.log(this.replacements[index]);
            var localvars = {
                parent: vars,
                root: vars.root,
                self: {},
                locals: vars.locals,
                fixed: [],
                fix_map: {},
                type: 'local'
            };
            var array = this.replacements[index][0].split(/\s*(\{|\})\s*/);
            var position = this.getPosition(this.replacements[index][1]);
            var body = this.pushBodyToAST([], localvars, array[2]);
            this.resetVarsRoot(localvars);
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
            var matches = this.replacements[index][0].match(matchExpRegPattern.extends);
            var position = this.getPosition(this.replacements[index][1]);
            var subtype = 'ext';
            var objname = matches[2];
            var localvars = vars;
            var namespace;
            var body;
            // console.log(matches);
            if ((matches[1] === 'ns') || (matches[1] === 'global')) {
                subtype = matches[1];
                if (matches[1] === 'ns') {
                    namespace = this.namespace + objname + '.';
                }
                else {
                    namespace = objname + '.';
                }
                localvars = {
                    parent: vars,
                    root: {
                        namespace: namespace,
                        public: {},
                        private: {},
                        protected: {},
                        fixed: [],
                        fix_map: {}
                    },
                    locals: {},
                    type: 'root'
                };
                localvars.self = localvars.root.protected;
                body = this.pushBodyToAST([], localvars, matches[3]);
            }
            else {
                if ((matches[1] === 'nsassign') || (matches[1] === 'globalassign')) {
                    subtype = matches[1];
                }
                body = this.checkObjMember(localvars, matches[3]);
            }
            return {
                type: 'extends',
                posi: position,
                display: display,
                subtype: subtype,
                oname: objname,
                vars: localvars,
                body: body
            };
        };
        Sugar.prototype.walkFnLike = function (index, display, vars, type) {
            var _this = this;
            // console.log(index, this.replacements[index]);
            var tem = {
                fnlike: /(^|(function|def|public|method)\s+)?([\$a-zA-Z_][\$\w]*)?\s*\(([^\(\)]*)\)\s*\{([^\{\}]*?)\}/
            };
            var matches = this.replacements[index][0].match(matchExpRegPattern.fnlike);
            // console.log(matches);
            var subtype = matches[2] || 'function';
            var fname = matches[3] !== 'function' ? matches[3] : '';
            if ((type === 'def' && subtype === 'function') || type === 'exp') {
                if (reservedFname['includes'](fname)) {
                    var headline = matches[4];
                    var localvars_1 = {
                        parent: vars,
                        root: vars.root,
                        self: {},
                        locals: vars.locals,
                        fixed: [],
                        fix_map: {},
                        type: 'local'
                    };
                    if (fname === 'for') {
                        var head = {
                            type: 'codes',
                            vars: localvars_1,
                            display: 'inline',
                            body: []
                        };
                        var lines = this.pushBodyToAST([], localvars_1, headline, true);
                        for (var index_7 = 0; index_7 < lines.length; index_7++) {
                            if (lines[index_7].posi)
                                lines[index_7].posi.head = false;
                            if ((index_7 === lines.length - 1) && lines[index_7].value) {
                                lines[index_7].value = lines[index_7].value.replace(/;$/, '');
                            }
                            head.body.push(lines[index_7]);
                        }
                    }
                    else {
                        var head = this.pushSentencesToAST([], localvars_1, headline, false, this.getPosition(headline))[0] || (function () {
                            _this.error(' Must have statements in head of ' + fname + ' expreesion.');
                        })();
                        // console.log(localvars, head);
                    }
                    var body = this.pushBodyToAST([], localvars_1, matches[5]);
                    this.resetVarsRoot(localvars_1);
                    // console.log(body);
                    return {
                        type: 'exp',
                        posi: this.getPosition(this.replacements[index][1]),
                        display: 'block',
                        vars: localvars_1,
                        expression: fname,
                        head: head,
                        body: body
                    };
                }
                if (fname === 'each') {
                    var condition = matches[4].match(matchExpRegPattern.travelargs);
                    // console.log(matches, condition);
                    if (condition) {
                        var self_1 = {}, agrs = [];
                        if (condition[5]) {
                            if (condition[8]) {
                                if (condition[4] !== condition[8]) {
                                    self_1[condition[4]] = 'var';
                                    self_1[condition[8]] = 'var';
                                    agrs = [[condition[4], this.getPosition(condition[3])], [condition[8], this.getPosition(condition[7])]];
                                }
                                else {
                                    this.error('indexname cannot same to the itemname');
                                }
                            }
                            else {
                                self_1[condition[4]] = 'var';
                                agrs = [[condition[4], condition[3]]];
                            }
                        }
                        else {
                            if (condition[4] !== '_index') {
                                self_1['_index'] = 'var';
                                self_1[condition[4]] = 'var';
                                agrs = [['_index', undefined], [condition[4], this.getPosition(condition[3])]];
                            }
                            else {
                                this.error('itemname cannot same to the default indexname');
                            }
                        }
                        var localvars_2 = {
                            parent: vars,
                            root: {
                                namespace: null,
                                public: {},
                                private: {},
                                protected: {},
                                fixed: [],
                                fix_map: {},
                                break: false
                            },
                            locals: vars.locals,
                            type: 'travel'
                        };
                        localvars_2.self = localvars_2.root.protected;
                        localvars_2.locals['arguments'] = null;
                        var iterator = this.pushSentencesToAST([], localvars_2, condition[1], false, this.getPosition(condition[2]))[0] || (function () {
                            _this.error(' Must have statements in head of each expreesion.');
                        })();
                        var subtype_1 = 'allprop';
                        var code = matches[5].replace(/@ownprop[;\s]*/g, function () {
                            subtype_1 = 'ownprop';
                            return '';
                        });
                        return {
                            type: 'travel',
                            posi: this.getPosition(this.replacements[index][1]),
                            display: 'block',
                            subtype: subtype_1,
                            iterator: iterator,
                            vars: localvars_2,
                            callback: {
                                type: 'def',
                                display: 'inline',
                                vars: localvars_2,
                                fname: '',
                                args: agrs,
                                body: this.pushBodyToAST([], localvars_2, code)
                            }
                        };
                    }
                }
            }
            var position = this.getPosition(this.replacements[index][1]);
            if (type === 'def') {
                if (fname) {
                    if (fname !== 'return') {
                        this.pushVariableToVars(vars, 'var', fname, position);
                    }
                }
                else {
                    if (subtype === 'function') {
                        if (display === 'block') {
                            fname = '_anonymous_function_' + this.anonymous_function;
                            this.anonymous_function++;
                        }
                    }
                    else {
                        display = 'block';
                        fname = subtype;
                        subtype = 'function';
                    }
                    this.pushVariableToVars(vars, 'var', fname, position);
                }
            }
            var localvars = {
                parent: vars,
                root: {
                    namespace: null,
                    public: {},
                    private: {},
                    protected: {},
                    fixed: [],
                    fix_map: {}
                },
                locals: {},
                type: 'root'
            };
            localvars.self = localvars.root.protected;
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
            var body = [], clauses = this.replacements[index][0].replace(/([\[\s\]])/g, '').split(/\s*(,)/), position = this.getPosition(this.replacements[index][1]);
            for (var c = 0; c < clauses.length; c++) {
                if (c) {
                    var posi = this.getPosition(clauses[c]);
                }
                else {
                    var posi = this.getPosition(clauses[c]) || position;
                }
                this.pushSentencesToAST(body, vars, clauses[c], false, posi);
            }
            // console.log(body);
            if (body.length === 1) {
                return body[0];
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
                display: display || 'inline',
                posi: this.getPosition(this.replacements[index][1]),
                vars: vars,
                body: this.checkObjMember(vars, this.replacements[index][0])
            };
        };
        Sugar.prototype.checkProp = function (vars, posi, type, attr, array) {
            // console.log(posi);
            // console.log(type, posi, attr, array);
            var position = this.getPosition(posi);
            // position.head = false;
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
                for (var index_8 = 1; index_8 < array.length; index_8++) {
                    var element = array[index_8];
                    var match_as_statement = element.trim().match(matchExpRegPattern.index3);
                    // console.log(matches);
                    if (match_as_statement) {
                        body.push(this.walk({
                            index: match_as_statement[1],
                            type: match_as_statement[2]
                        }, vars, true));
                        if (match_as_statement[3]) {
                            body.push({
                                type: 'code',
                                posi: void 0,
                                display: 'inline',
                                vars: vars,
                                value: match_as_statement[3].trim()
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
                    display: 'inline',
                    pname: attr[4].trim() || 'myAttribute',
                    vars: vars,
                    body: body
                };
            }
            return {
                type: type,
                posi: position,
                display: 'inline',
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
            for (var index_9 = 0; index_9 < array.length; index_9++) {
                var element = array[index_9].trim();
                var type = 'method';
                // console.log(element);
                if (element) {
                    var elArr = element.split('___boundary_' + this.uid);
                    // console.log(elArr);
                    if (elArr[0] && elArr[0].trim()) {
                        var match_0 = elArr[0].match(matchExpRegPattern.classelement);
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
                                        this.error('Cannot use `' + match_0[3] + '` on property `' + match_0[4] + '`');
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
                        var match_1 = elArr[1].trim().match(matchExpRegPattern.index);
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
            for (var index_10 = 0; index_10 < array.length; index_10++) {
                var element = array[index_10].trim();
                if (element) {
                    var elArr = element.split('___boundary_' + this.uid);
                    if (elArr[0] && elArr[0].trim()) {
                        var match_0 = elArr[0].match(matchExpRegPattern.objectattr);
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
                            var match_as_statement = elArr[i].trim().match(matchExpRegPattern.index3);
                            switch (match_as_statement[2]) {
                                case 'string':
                                case 'pattern':
                                case 'tamplate':
                                    console.log(body, bodyIndex);
                                    body[bodyIndex].body.push({
                                        type: 'code',
                                        posi: void 0,
                                        display: 'inline',
                                        vars: vars,
                                        value: ',' + this.replacements[parseInt(match_as_statement[1])][0].replace(this.markPattern, function () {
                                            return that.replacements[arguments[1]][0];
                                        })
                                    });
                                    if (match_as_statement[3]) {
                                        body[bodyIndex].body.push({
                                            type: 'code',
                                            posi: void 0,
                                            display: 'inline',
                                            vars: vars,
                                            value: match_as_statement[3]
                                        });
                                    }
                                    break;
                                case 'function':
                                    if (elArr.length === 2) {
                                        body.push(this.walkFnLike(parseInt(match_as_statement[1]), 'inline', vars, 'method'));
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
            for (var index_11 = 0; index_11 < args.length; index_11++) {
                var arg = args[index_11];
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
            for (var index_12 = 0; index_12 < args.vals.length; index_12++) {
                if (args.vals[index_12] !== undefined) {
                    var valArr = args.vals[index_12].split('___boundary_' + this.uid);
                    if (valArr[1]) {
                        body.push({
                            type: 'code',
                            posi: args.keys[index_12][1],
                            display: 'block',
                            value: 'if (' + args.keys[index_12][0] + '@boundary_5_as_operator::void 0) { ' + args.keys[index_12][0] + ' = ' + valArr[0]
                        });
                        this.pushReplacementsToAST(body, vars, valArr[1], false, this.getPosition(args.vals[index_12]));
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
                            posi: args.keys[index_12][1],
                            display: 'block',
                            value: 'if (' + args.keys[index_12][0] + '@boundary_5_as_operator::void 0) { ' + args.keys[index_12][0] + ' = ' + valArr[0] + '; }'
                        });
                    }
                }
            }
            if (args.keysArray) {
                body.push({
                    type: 'code',
                    posi: args.keysArray[1],
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
            this.pushHeader(head, this.imports);
            this.fixVariables(this.ast.vars);
            this.pushAlias(body, this.ast.vars, this.using_as);
            this.pushCodes(body, this.ast.vars, this.ast.body, 1, this.namespace);
            this.pushFooter(foot, this.ast.vars);
            this.preoutput = head.join('') + this.trim(body.join('')) + foot.join('');
            this.output = this.pickUpMap(this.restoreStrings(this.preoutput, true));
            // console.log(this.output);
            return this;
        };
        Sugar.prototype.pushPostionsToMap = function (position, codes) {
            if (codes === void 0) { codes = undefined; }
            if (position && (typeof position === 'object')) {
                var index_13 = this.posimap.length;
                this.posimap.push(position);
                var replace = '/* @posi' + index_13 + ' */';
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
            if (this.isMainBlock) {
                codes.push("\r\n" + 'tangram.block([');
            }
            else {
                codes.push("\r\n" + 'tangram.init().block([');
            }
            if (this.imports.length) {
                var imports = [];
                for (var index_14 = 0; index_14 < this.imports.length; index_14 += 2) {
                    imports.push(this.pushPostionsToMap(this.getPosition(this.imports[index_14 + 1])) + "'" + this.imports[index_14] + "'");
                }
                // console.log(this.imports, imports);
                codes.push("\r\n\t" + imports.join(",\r\n\t") + "\r\n");
            }
            if (this.isMainBlock) {
                codes.push('], function (pandora, root, imports, undefined) {');
            }
            else {
                codes.push('], function (pandora, root, imports, undefined) {');
                codes.push("\r\n\tvar module = this.module;");
            }
            if (this.namespace) {
                var namespace = this.namespace.replace(/\.$/, "");
                var name_1 = namespace.replace(/^(.*\.)?([\$a-zA-Z_][\$\w]*)$/, "$2");
                codes.push("\r\n\tvar " + name_1 + " = pandora.ns('" + namespace + "', {});");
            }
            return codes;
        };
        Sugar.prototype.pushAlias = function (codes, vars, alias) {
            for (var key in vars.locals) {
                codes.push("\r\n\tvar " + vars.locals[key] + ' = ' + key + ';');
            }
            for (var key_1 in alias) {
                // console.log(key);
                // let position = this.getPosition(key);
                // let _key = key.replace(position.match, '').trim();
                codes.push("\r\n\t" + this.pushPostionsToMap(alias[key_1][2]) + "var " + this.patchVariables(key_1, vars));
                codes.push(" = imports['" + alias[key_1][0]);
                codes.push("'] && imports['" + alias[key_1][0]);
                if (alias[key_1][1] === '*') {
                    codes.push("'];");
                }
                else {
                    codes.push("']['" + key_1 + "'];");
                }
            }
            return codes;
        };
        Sugar.prototype.pushCodes = function (codes, vars, array, layer, namespace) {
            if (namespace === void 0) { namespace = this.namespace; }
            // console.log(codes, array);
            // console.log(array);
            // console.log(layer, array);
            for (var index_15 = 0; index_15 < array.length; index_15++) {
                var element = array[index_15];
                // console.log(element);
                this.pushElement(codes, vars, element, layer, namespace);
            }
            return codes;
        };
        Sugar.prototype.pushElement = function (codes, vars, element, layer, namespace) {
            if (namespace === void 0) { namespace = this.namespace; }
            var indent = "\r\n" + stringRepeat("\t", layer);
            switch (element.type) {
                case 'array':
                    this.pushArrayCodes(codes, element, layer, namespace);
                    break;
                case 'if':
                case 'call':
                case 'callmethod':
                case 'construct':
                    // console.log(layer);
                    this.pushCallCodes(codes, element, layer, namespace);
                    break;
                case 'log':
                case 'callschain':
                    this.pushCallsCodes(codes, element, layer, namespace);
                    break;
                case 'class':
                case 'dec':
                    this.pushClassCodes(codes, element, layer, namespace);
                    break;
                case 'code':
                    if (element.value) {
                        // console.log(element.posi&&element.posi.head, element.display, element.value);
                        var code = this.patchVariables(element.value, vars);
                        if (vars.root.break !== undefined) {
                            code = code.replace(/@return;*/g, function () {
                                vars.root.break = true;
                                return 'pandora.loop.out();' + indent + 'return;';
                            });
                        }
                        // console.log(code);
                        if (element.display === 'block') {
                            codes.push(indent + this.pushPostionsToMap(element.posi) + code);
                        }
                        else {
                            if (element.posi) {
                                if (element.posi.head) {
                                    codes.push(indent);
                                }
                                this.pushPostionsToMap(element.posi, codes);
                            }
                            codes.push(code);
                        }
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
                var indent1 = void 0, indent2 = void 0;
                var _break = false;
                // console.log(element.body[0]);
                if (element.body[0].posi && element.body[0].posi.head) {
                    indent1 = "\r\n" + stringRepeat("\t", _layer);
                    _layer++;
                    indent2 = "\r\n" + stringRepeat("\t", _layer);
                    codes.push(indent2);
                    _break = true;
                }
                // console.log(element.body);
                for (var index_16 = 0; index_16 < element.body.length; index_16++) {
                    if (element.body[index_16].value) {
                        elements.push(this.pushPostionsToMap(element.body[index_16].posi) + element.body[index_16].value);
                    }
                    else {
                        var elemCodes = [];
                        this.pushPostionsToMap(element.body[index_16].posi, elemCodes);
                        this.pushElement(elemCodes, element.vars, element.body[index_16], _layer, namespace);
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
                        codes.push(elements.join(',' + indent2) + indent1);
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
            // console.log(element.name.length, element.name[0], naming);
            if (element.posi) {
                if (element.type === 'callmethod') {
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
                // console.log(element.name[0].value, element.params.length, element.params[0]);
                for (var index_17 = 0; index_17 < element.params.length; index_17++) {
                    var param = element.params[index_17].body;
                    var paramCodes = [];
                    this.pushPostionsToMap(element.params[index_17].posi, paramCodes);
                    this.pushCodes(paramCodes, element.vars, param, _layer, namespace);
                    if (paramCodes.length) {
                        parameters.push(paramCodes.join('').trim());
                    }
                    // console.log(element.name[0].value, param, paramCodes);
                }
                // console.log(parameters);
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
            if (element.type === 'if') {
                codes.push(') ');
            }
            else if (element.display === 'block') {
                codes.push(');');
            }
            else {
                codes.push(')');
            }
            return codes;
        };
        Sugar.prototype.pushCallsCodes = function (codes, element, layer, namespace) {
            var elements = [];
            var _layer = layer;
            var indent;
            var _break = false;
            // console.log(element);
            if (element.type === 'log') {
                indent = "\r\n" + stringRepeat("\t", _layer);
                codes.push(indent + this.pushPostionsToMap(element.posi) + 'root.console');
            }
            else if (element.posi && element.posi.head) {
                _layer++;
                _break = true;
                indent = "\r\n" + stringRepeat("\t", _layer);
            }
            for (var index_18 = 0; index_18 < element.calls.length; index_18++) {
                var method = element.calls[index_18];
                // console.log(method);
                elements.push(this.pushElement([], element.vars, method, _layer, namespace).join(''));
            }
            // console.log(elements);
            if (_break) {
                codes.push(indent + '.' + elements.join(indent + '.'));
            }
            else {
                codes.push('.' + elements.join('.'));
                if (element.type === 'log') {
                    codes.push(';');
                }
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
                cname = 'pandora.' + element.cname.trim();
                codes.push(indent1 + this.pushPostionsToMap(element.posi) + 'pandora.declareClass(\'' + element.cname.trim() + '\', ');
            }
            else {
                if (element.cname && element.cname.trim()) {
                    cname = element.cname.trim();
                    if (cname.match(/^[\$a-zA-Z_][\$\w]*$/)) {
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
                    codes.push('extends ' + element.base);
                }
                else {
                    codes.push(element.base + ',');
                }
            }
            codes.push('{');
            // console.log(element);
            if (toES6) {
                for (var index_19 = 0; index_19 < element.body.length; index_19++) {
                    var member = element.body[index_19];
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
                for (var index_20 = 0; index_20 < element.body.length; index_20++) {
                    var member = element.body[index_20];
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
            this.fixVariables(element.vars);
            if (element.type === 'def' && element.fname) {
                if (element.fname === 'return') {
                    codes.push(indent + posi + 'return function (');
                }
                else {
                    var fname = this.patchVariable(element.fname, element.vars.parent);
                    switch (element.subtype) {
                        case 'def':
                            codes.push(indent + posi + 'pandora.' + namespace + element.fname + ' = function (');
                            break;
                        case 'public':
                            codes.push(indent + posi + 'var ' + fname + ' = pandora.' + namespace + element.fname + ' = function (');
                            break;
                        default:
                            if (element.display === 'block') {
                                codes.push(indent + posi + 'function ' + fname + ' (');
                            }
                            else {
                                codes.push(posi + 'function ' + fname + ' (');
                            }
                    }
                }
            }
            else {
                codes.push(posi + 'function (');
            }
            if (element.args.length) {
                var args = [];
                for (var index_21 = 0; index_21 < element.args.length; index_21++) {
                    args.push(this.pushPostionsToMap(element.args[index_21][1]) + element.args[index_21][0]);
                }
                codes.push(args.join(', '));
            }
            codes.push(') {');
            // console.log(element.body);
            if (element.body.length) {
                // console.log(element);
                if (element.vars.type === 'root') {
                    for (var key in element.vars.locals) {
                        codes.push(indent + "\tvar " + element.vars.locals[key] + ' = ' + key + ';');
                    }
                }
                element.body.push(semicolon);
                this.pushCodes(codes, element.vars, element.body, layer + 1, namespace);
            }
            else {
                indent = '';
            }
            // console.log(element.display, element.subtype);
            codes.push(indent + '}');
            return codes;
        };
        Sugar.prototype.pushExtendsCodes = function (codes, element, layer, namespace) {
            var indent1 = "\r\n" + stringRepeat("\t", layer);
            var indent2 = "\r\n" + stringRepeat("\t", layer + 1);
            var indent3 = "\r\n" + stringRepeat("\t", layer + 2);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            }
            else {
                var posi = '';
            }
            if (element.subtype === 'global' || element.subtype === 'globalassign') {
                namespace = '';
            }
            if (element.subtype === 'ns' || element.subtype === 'global') {
                this.fixVariables(element.vars);
                codes.push(indent1 + posi + 'pandora.ns(\'' + namespace + element.oname.trim() + '\', function () {');
                this.pushCodes(codes, element.vars, element.body, layer + 1, namespace + element.oname.trim() + '.');
                // console.log(element.body);
                var exports_1 = [];
                // console.log(element.vars.root.public);
                codes.push(indent2 + 'return {');
                for (var name_2 in element.vars.root.public) {
                    exports_1.push(name_2 + ': ' + element.vars.root.public[name_2]);
                }
                if (exports_1.length) {
                    codes.push(indent3 + exports_1.join(',' + indent3));
                }
                codes.push(indent2 + '}');
                codes.push(indent1 + '}');
            }
            else if (element.subtype === 'nsassign' || element.subtype === 'globalassign') {
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
            this.fixVariables(element.vars);
            if (element.type === 'closure') {
                if (element.posi) {
                    codes.push(indent1 + posi + '{');
                }
                else {
                    codes.push(' {');
                }
            }
            else {
                codes.push(indent1 + posi + element.expression + ' (');
                // console.log(element.head);
                this.pushElement(codes, element.vars.parent, element.head, layer, namespace);
                codes.push(') {');
            }
            if (element.body.length) {
                codes.push(indent2);
                // console.log(element.body);
                this.pushCodes(codes, element.vars, element.body, layer + 1, namespace);
                codes.push(indent1 + '}');
            }
            else {
                codes.push('}');
            }
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
                cname = 'pandora.' + element.cname.trim();
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
            if (element.base === false) {
                codes.push('true, ');
            }
            codes.push('{');
            // console.log(element);
            var overrides = {};
            var indent3 = "\r\n" + stringRepeat("\t", layer + 2);
            for (var index_22 = 0; index_22 < element.body.length; index_22++) {
                var member = element.body[index_22];
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
            // console.log(element.display);
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
                    // console.log(overrides[fname]);
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
                            elem.push(indent3 + 'if (arguments.length@boundary_5_as_operator::' + args + ') { return this.' + element[args] + '.apply(this, arguments); }');
                        }
                    }
                    elem.push(indent3 + 'return this.' + element[args] + '.apply(this, arguments);');
                    elem.push(indent2 + '}');
                    elements.push(elem.join(''));
                }
            }
        };
        Sugar.prototype.pushTravelCodes = function (codes, element, layer, namespace) {
            var index = codes.length, indent = "\r\n" + stringRepeat("\t", layer);
            // console.log(element);
            codes.push(indent + 'pandora.each(');
            this.pushElement(codes, element.vars, element.iterator, layer, namespace);
            codes.push(', ');
            this.pushFunctionCodes(codes, element.callback, layer, namespace);
            if (element.vars.root.break === true) {
                codes[index] = indent + 'pandora.loop(';
            }
            if (element.subtype === 'ownprop') {
                codes.push(', this, true);');
            }
            else {
                codes.push(', this);');
            }
            codes.push(indent);
            return codes;
        };
        Sugar.prototype.pushObjCodes = function (codes, element, layer, namespace) {
            var indent1 = "\r\n" + stringRepeat("\t", layer);
            var indent2 = "\r\n" + stringRepeat("\t", layer + 1);
            // console.log(element);
            if (element.type === 'object' && element.display === 'block') {
                codes.push(indent1 + this.pushPostionsToMap(element.posi) + '{');
            }
            else {
                codes.push('{');
            }
            if (element.body.length) {
                var elements = [];
                var _layer = layer;
                var _break = false;
                // console.log(element.body[0]);
                if ((element.body.length > 1) || (element.body[0].posi && element.body[0].posi.head)) {
                    _layer++;
                    codes.push(indent2);
                    _break = true;
                }
                // console.log(_break, element);
                for (var index_23 = 0; index_23 < element.body.length; index_23++) {
                    var member = element.body[index_23];
                    var elem = [];
                    // console.log(member);
                    switch (member.type) {
                        case 'method':
                            elem.push(member.fname + ': ');
                            this.pushFunctionCodes(elem, member, _layer, namespace);
                            if (this.toES6) {
                                elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            }
                            else {
                                elements.push(elem.join(''));
                            }
                            break;
                        case 'objProp':
                            elem.push(member.pname + ': ');
                            this.pushCodes(elem, member.vars, member.body, _layer, namespace);
                            elements.push(elem.join(''));
                            break;
                    }
                }
                if (_break) {
                    codes.push(elements.join(',' + indent2));
                    codes.push(indent1);
                }
                else {
                    codes.push(elements.join(','));
                }
            }
            codes.push('}');
            return codes;
        };
        Sugar.prototype.pushFooter = function (codes, vars) {
            // console.log(vars.root.public);
            for (var name_3 in vars.root.public) {
                codes.push("\r\n\tpandora." + this.namespace + name_3 + ' = ' + vars.root.public[name_3] + ';');
            }
            if (this.isMainBlock) {
                codes.push("\r\n" + '}, true);');
            }
            else {
                codes.push("\r\n" + '});');
            }
            return codes;
        };
        Sugar.prototype.resetVarsRoot = function (vars) {
            var root = vars.root;
            for (var varname in vars.self) {
                if (vars.self.hasOwnProperty(varname)) {
                    if (vars.self[varname] === 'let') {
                        // console.log(vars);
                        if (!root.protected.hasOwnProperty(varname) && (!root.private.hasOwnProperty(varname) || (root.private[varname].parent === vars))) {
                            root.private[varname] = vars;
                        }
                    }
                    else {
                        if (!root.protected.hasOwnProperty(varname)) {
                            root.protected[varname] = 'var';
                            // delete vars.self[varname];
                        }
                        else if (root.protected[varname] === 'let') {
                            this.error(' Variable `' + varname + '` has already been declared.');
                        }
                    }
                }
            }
        };
        Sugar.prototype.fixVariables = function (vars) {
            vars.index = this.closurecount;
            // console.log(vars);
            // console.log(vars.type, vars);
            switch (vars.type) {
                case 'arrowfn':
                    vars.root.fix_map['this'] = vars.locals['this'];
                    vars.root.fixed.push(vars.locals['this']);
                case 'travel':
                    if (vars.type === 'travel') {
                        vars.root.fixed.push('this');
                    }
                    vars.root.fix_map['arguments'] = vars.locals['arguments'];
                    vars.root.fixed.push(vars.locals['arguments']);
                case 'root':
                    for (var element in vars.self) {
                        var varname = element;
                        if (keywords['includes'](element) || reserved['includes'](element)) {
                            console.log(vars);
                            this.error('keywords `' + element + '` cannot be a variable name.');
                        }
                        if (blockreserved['includes'](element)) {
                            varname = element + '_' + vars.index;
                            while (vars.self[varname]) {
                                varname = varname + '_' + vars.index;
                            }
                        }
                        if (varname !== element) {
                            // console.log(varname);
                            vars.root.fix_map[element] = varname;
                            if (vars.root.public.hasOwnProperty(element)) {
                                vars.root.public[element] = varname;
                            }
                        }
                        vars.root.fixed.push(varname);
                    }
                    if (vars.type === 'root') {
                        for (var key in vars.locals) {
                            if (vars.locals.hasOwnProperty(key)) {
                                var varname = '_' + key;
                                while (vars.self[varname]) {
                                    varname = varname + '_' + vars.index;
                                }
                                vars.locals[key] = varname;
                            }
                        }
                    }
                    // console.log(vars);
                    break;
                case 'local':
                    for (var element in vars.self) {
                        if (vars.self[element] === 'let') {
                            var varname = element;
                            // console.log(vars.index, varname); 
                            if (keywords['includes'](element) || reserved['includes'](element)) {
                                this.error('keywords `' + element + '` cannot be a variable name.');
                            }
                            if (blockreserved['includes'](element)) {
                                varname = element + '_' + vars.index;
                                while (vars.self[varname]) {
                                    // console.log(varname);
                                    varname = varname + '_' + vars.index;
                                }
                                // console.log(varname);
                            }
                            while (vars.root.fixed['includes'](varname) || (vars.root.private[varname] && (vars.root.private[varname] !== vars))) {
                                // console.log(varname);
                                varname = varname + '_' + vars.index;
                            }
                            if (varname !== element) {
                                // console.log(varname);
                                vars.fix_map[element] = varname;
                            }
                            vars.fixed.push(varname);
                            vars.root.fixed.push(varname);
                        }
                    }
            }
            // console.log(vars);
            this.closurecount++;
        };
        Sugar.prototype.patchVariables = function (code, vars) {
            var _this = this;
            // console.log(code, vars);
            if (code) {
                // console.log(code);
                return code.replace(/(^|[^\$\w\.])((let|var)\s+)?([\$a-zA-Z_][\$\w]*)(\s+|\s*[^\$\w]|\s*$)/g, function (match, before, typewithgap, type, varname, after) {
                    // console.log(match, "\r\n", before, '[', varname, '](', type, ')', after);
                    return before + (typewithgap || '') + _this.patchVariable(varname, vars) + after || '';
                }).replace(/(^|[\?\:\=]\s*)(\.\.|\.)(\.[\$a-zA-Z_][\$\w]*|$)/g, function (match, before, node, member) {
                    // console.log(match, "\r\n", before, '[', node, ']', member, vars);
                    return before + _this.patchNamespace(node, vars) + member;
                });
            }
            // console.log(code);
            return '';
        };
        Sugar.prototype.patchVariable = function (varname, vars) {
            // console.log('before:', varname, vars);
            if (vars.fix_map && vars.fix_map.hasOwnProperty(varname)) {
                // console.log(varname, vars.fix_map[varname]);
                return vars.fix_map[varname];
            }
            if (vars.root.fix_map.hasOwnProperty(varname)) {
                // console.log(varname, vars.root.fix_map[varname]);
                return vars.root.fix_map[varname];
            }
            else if (!vars.root.fixed['includes'](varname)) {
                // console.log(varname);
                if (vars.root.private.hasOwnProperty(varname)) {
                    // console.log(varname, vars.root.private);
                    var _varname = varname;
                    // console.log(vars);
                    while (vars.root.private.hasOwnProperty(varname)) {
                        varname = varname + '_' + vars.index;
                    }
                    while (vars.root.fixed['includes'](varname)) {
                        varname = varname + '_' + vars.index;
                    }
                    vars.root.fix_map[_varname] = varname;
                }
                else {
                    for (var key in vars.locals) {
                        if (vars.locals.hasOwnProperty(key)) {
                            var _key = vars.locals[key];
                            // console.log(_key);
                            if (varname === _key) {
                                varname = varname + '_' + vars.index;
                                while (vars.root.private[varname]) {
                                    varname = varname + '_' + vars.index;
                                }
                                while (vars.root.fixed['includes'](varname)) {
                                    varname = varname + '_' + vars.index;
                                }
                                vars.fix_map[_key] = varname;
                            }
                        }
                    }
                }
            }
            // console.log('after:', varname);
            return varname;
        };
        Sugar.prototype.patchNamespace = function (node, vars) {
            if (node === '.') {
                return 'pandora';
            }
            if (vars.root.namespace) {
                return ('pandora.' + vars.root.namespace).replace(/\.+$/, '');
            }
            // console.log(this.namespace);
            return ('pandora.' + this.namespace).replace(/\.+$/, '');
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
                if (arguments[5]) {
                    return that.replacements[arguments[5]][0];
                }
                return that.replacements[arguments[2] || arguments[4]][0];
            }).replace(this.markPattern, function () {
                return that.replacements[arguments[1]][0];
            }).replace(/(@\d+L\d+P\d+O?\d*:::)/g, '');
        };
        Sugar.prototype.decode = function (string) {
            string = string.replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
            var matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
            while (matches) {
                // console.log(matches, this.replacements[matches[2]]);
                string = string.replace(matches[0], this.replacements[matches[2]][0]).replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
                matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
            }
            // console.log(string);
            return string.replace(/(@\d+L\d+P\d+O?\d*:::)/g, '');
        };
        Sugar.prototype.trim = function (string) {
            var _this = this;
            // 此处的replace在整理完成后，将进行分析归纳，最后改写为callback形式的
            // console.log(string);
            string = this.replaceStrings(string, true);
            // console.log(string);
            // 去除多余标注
            string = string.replace(/\s*(@boundary_\d+_as_comments::)?@(ownprop|return)[; \t]*/g, function () {
                return '';
            });
            string = string.replace(/((@boundary_\d+_as_comments::)\s*)+(@boundary_\d+_as_comments::)/g, "$3");
            // 去除多余符号
            string = string.replace(/\s*;(\s*;)*[\t \x0B]*/g, ";");
            string = string.replace(/(.)(\{|\[|\(|\.|\:)\s*[,;]+/g, function (match, before, mark) {
                if ((before === mark) && (before === ':')) {
                    return match;
                }
                return before + mark;
            });
            // console.log(string);
            string = string.replace(/[;\s]*[\r\n]+(\t*)[ ]*(@boundary_\d+_as_comments::)(@boundary_\d+_as_operator::)\s*/g, "\r\n$1   $2$3");
            string = string.replace(/\s*(@boundary_\d+_as_operator::)[;\s]*[\r\n]+(\t*)[ ]*(@boundary_\d+_as_comments::)/g, "\r\n$2   $3 $1 ");
            string = string.replace(/[;\s]*[\r\n]+(\t*)[ ]*(@boundary_\d+_as_comments::)(@boundary_\d+_as_midword::)\s*/g, "\r\n$1$2$3");
            // 格式化相应符号
            string = string.replace(/\s*(\=|\?)\s*/g, " $1 ");
            string = string.replace(/\s+(\:)[\s]*/g, " $1 ");
            // 删除多余空白与换行
            // string = string.replace(/[ ]+/g, " ");
            string = string.replace(/\s+[\r\n]([ \t])/g, "\r\n$1");
            string = string.replace(/\{\s+\}/g, '{}');
            string = string.replace(/\[\s+\]/g, '[]');
            string = string.replace(/\(\s+\)/g, '()');
            // 运算符处理
            string = string.replace(/(\s*)(@boundary_(\d+)_as_(operator|aftoperator|keyword|midword)::)\s*/g, function (match, pregap, operator, index) {
                // console.log(this.replacements[index]);
                if (_this.replacements[index][1]) {
                    // console.log(this.replacements[index]);
                    return pregap + operator;
                }
                return operator;
            });
            string = string.replace(/(@boundary_\d+_as_(preoperator)::)(\s*;+|(\s+([^;])))/g, function (match, operator, word, right, afterwithgap, after) {
                if (after) {
                    return operator + after;
                }
                return operator;
            });
            return string;
        };
        Sugar.prototype.pickUpMap = function (string) {
            var lines = string.split(/\r{0,1}\n/);
            var _lines = [];
            var mappings = [];
            for (var l = 0; l < lines.length; l++) {
                var line = lines[l];
                var mapping = [];
                var match = void 0;
                while (match = line.match(/\/\*\s@posi(\d+)\s\*\//)) {
                    var index_24 = match.index;
                    var position = this.posimap[match[1]];
                    // console.log(position);
                    mapping.push([index_24, position.o[0], position.o[1], position.o[2], 0]);
                    line = line.replace(match[0], '');
                }
                // while (match = line.match(/\/\*\s@posi(\d+)\s\*\//)) {
                //     let index = match.index;
                //     let position = this.posimap[match[1]];
                //     // console.log(position);
                //     mapping.push([index, position.o[0], position.o[1], position.o[2], 0]);
                //     line = line.replace(match[0], '/* ' + position.o.join() +' */');
                // }
                _lines.push(line);
                mappings.push(mapping);
            }
            this.mappings = mappings;
            // console.log(mappings)
            return _lines.join("\r\n");
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