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
    var zero2z = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''), namingExpr = /^[A-Z_\$][\w\$]*(\.[A-Z_\$][\w\$]*)*$/i, reservedWords = ['if', 'for', 'while', 'switch', 'with', 'catch'], replaceExpr = {
        use: /\s*use\s+.[\$\w\.\s\/\\]+?[;\r\n]+/g,
        import: /^\s*use\s+/g,
        return: /[\s;\r\n]+$/g,
        include: /\s*@include\s+.[\$\w\.\s\/\\]+?[;\r\n]+/g,
        class: /class\s+((pandora)?\.)?([\$\w\.]+\s+)?(extends\s+([\$\w\.]+)\s*)?\{([^\{\}]*?)\}/g,
        define: /(reg|extends)\s+([\$\w\.]+)\s*\{([^\{\}]*?)\}/g,
        function: /(var\s+)?([\$\w]*)\s*\(([^\(\)]*)\)[\s\t]*\{([^\{\}]*?)\}/g,
        array: /\[[^\[\]]*?\]/g,
        call: /([\$\w]+)([\s\t]*\([^\(\)]*?\))\s*([^\$\w\s\{]|[\r\n].)/g,
        closure: /([\$\w]+|\))?([\s\t]*\{[^\{\}]*?\})/g
    }, matchExpr = {
        string: /(\/|\#|`|"|')([\*\/\=])?/,
        strings: {
            '/': /(\/.+?\/[img]*)\s*?([\r\n]|.|$)/,
            '`': /(`[^`]*`)\s*?([\r\n]|.|$)/,
            '"': /(".*?")\s*?([\r\n]|.|$)/,
            "'": /('.*?')\s*?([\r\n]|.|$)/
        },
        index: /(\d+)_as_([a-z]+)/,
        index3: /^_(\d+)_as_([a-z]+)___([\s\S]*)$/,
        class: /class\s+((pandora)?\.)?([\$\w\.]+\s+)?(extends\s+([\$\w\.]+)\s*)?\{([^\{\}]*?)\}/,
        classelement: /^\s*((static)\s+)?([\$\w]*)\s*(\=*)([\s\S]*)$/,
        objectattr: /^\s*((([\$\w]+)))\s*(\:*)([\s\S]*)$/,
        define: /(reg|extends)\s+([\$\w\.]+)\s*\{([^\{\}]*?)\}/,
        function: /(var\s+)?([\$\w]*)\s*\(([^\(\)]*)\)[\s\t]*\{([^\{\}]*?)\}/,
        call: /([\$\w]+|\])([\s\t]*\([^\(\)]*?\))\s*([^\$\w\s\{]|[\r\n].)/g
    }, stringas = {
        '/': '_as_pattern___',
        '`': '_as_template___',
        '"': '_as_string___',
        "'": '_as_string___'
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
        function Sugar(input, run) {
            this.isMainBlock = true;
            this.stringReplaceTimes = 65536;
            this.replacements = ['{}', '/=', '/'];
            this.imports = [];
            this.import_alias = {};
            this.ast = {};
            this.uid = boundaryMaker();
            this.markPattern = new RegExp('___boundary_(\\\d+)_as_(mark|preoperator|operator|aftoperator)___', 'g');
            this.lastPattern = new RegExp('(___boundary_' + this.uid + '_(\\\d+)_as_(string|pattern|template)___|___boundary_(\\\d+)_as_(propname|preoperator|operator|aftoperator)___)', 'g');
            this.input = input;
            this.output = undefined;
            if (run) {
                this.run();
            }
        }
        Sugar.prototype.compile = function () {
            // console.log(this.input);
            this.buildAST(this.getReplacePosis(this.getSentences(this.encode(this.input))));
            this.output = 'console.log("Hello, world!");';
            // this.generate();
            // console.log(this.replacements);
            return this;
        };
        Sugar.prototype.decode = function (string) {
            return string;
        };
        Sugar.prototype.encode = function (string) {
            var _this = this;
            string = string.replace(/^\s*"await"\s*/, function (match) {
                _this.isMainBlock = false;
                // console.log('This is not a main block.');
                return '';
            });
            string = this.replaceImports(string);
            string = this.replaceStrings(string);
            while (string.indexOf('@include') >= 0) {
                string = this.replaceIncludes(string);
            }
            string = string.replace(/___boundary_\w+_(\d+)_as_string___\s*(\:|\(|\=)/g, '___boundary_$1_as_propname___$2');
            // console.log(string);
            // console.log(this.replacements);
            var left = string.indexOf('[');
            var right = string.indexOf(']');
            while ((left >= 0) || (right >= 0)) {
                // console.log('[]');
                if ((left >= 0) && (left < right)) {
                    string = this.replaceArray(string);
                    left = string.indexOf('[');
                    right = string.indexOf(']');
                }
                else {
                    throw 'tangram.js sugar Error: Unexpected `{` or `}`';
                }
            }
            // console.log(string);
            left = string.indexOf('{');
            right = string.indexOf('}');
            while ((left >= 0) || (right >= 0)) {
                // console.log('{}');
                if ((left >= 0) && (left < right)) {
                    string = this.replaceCodeSegments(string);
                    left = string.indexOf('{');
                    right = string.indexOf('}');
                }
                else {
                    throw 'tangram.js sugar Error: Unexpected `{` or `}`';
                }
            }
            while (string.match(matchExpr.call)) {
                string = this.replaceCalls(string);
            }
            // console.log(string);
            return string;
        };
        Sugar.prototype.replaceImports = function (string) {
            var _this = this;
            return string.replace(replaceExpr.use, function (match) {
                var index = _this.replacements.length;
                _this.replacements.push(match);
                return '___boundary_' + _this.uid + '_' + index + '_as_import___';
            });
        };
        Sugar.prototype.replaceStrings = function (string) {
            var _this = this;
            string = string.replace(/\\+(`|")/g, function (match) {
                var index = _this.replacements.length;
                _this.replacements.push(match);
                return '___boundary_' + index + '_as_mark___';
            }).replace(/\\[^\r\n]/g, function (match) {
                var index = _this.replacements.length;
                _this.replacements.push(match);
                return '___boundary_' + index + '_as_mark___';
            });
            var count = 0;
            var matches = string.match(matchExpr.string);
            while ((count < this.stringReplaceTimes) && matches) {
                count++;
                // console.log(count);
                // console.log(matches);
                var index_1 = this.replacements.length;
                switch (matches[1]) {
                    case '#':
                        string = string.replace(/(\S*)\s*\#.+/, "$1");
                        matches = string.match(matchExpr.string);
                        continue;
                    case '/':
                        switch (matches[2]) {
                            case '*':
                                string = string.replace(/\/\*{1,2}[\s\S]*?(\*\/|$)/, "");
                                matches = string.match(matchExpr.string);
                                continue;
                            case '/':
                                string = string.replace(/(\S*)\s*\/\/.+/, "$1");
                                matches = string.match(matchExpr.string);
                                continue;
                            case '=':
                                string = string.replace(matches[0], '___boundary_1_as_operator___');
                                matches = string.match(matchExpr.string);
                                continue;
                        }
                        break;
                }
                var match = string.match(matchExpr.strings[matches[1]]);
                if (match && (matches.index === match.index) && (!match[2].match(/[\$\w\{]/))) {
                    // console.log(matches, match);
                    this.replacements.push(match[1]);
                    string = string.replace(match[1], '___boundary_' + this.uid + '_' + index_1 + stringas[matches[1]]);
                }
                else if (matches[0] === '/') {
                    string = string.replace(matches[0], '___boundary_2_as_operator___');
                }
                else {
                    var index_2 = void 0;
                    if (matches.index > 128) {
                        index_2 = matches.index - 128;
                    }
                    else {
                        index_2 = 0;
                    }
                    // console.log(matches.index, string);
                    throw 'tangram.js sugar Error: Unexpected `' + matches[1] + '` in `' + string.substr(index_2, 256) + '`';
                }
                matches = string.match(matchExpr.string);
            }
            // console.log(string);
            // console.log(this.replacements);
            return this.replaceOperators(string);
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
        Sugar.prototype.replaceOperators = function (string) {
            var _this = this;
            // '++ ', '-- ',
            // ' !', ' ~', ' +', ' -', ' ++', ' --',
            // ' ** ', ' * ', ' / ', ' % ', ' + ', ' - ',
            // ' << ', ' >> ', ' >>> ',
            // ' < ', ' <= ', ' > ', ' >= ',
            // ' == ', ' != ', ' === ', ' !== ',
            // ' & ', ' ^ ', ' | ', ' && ', ' || ',
            // ' = ', ' += ', ' -= ', ' *= ', ' /= ', ' %= ', ' <<= ', ' >>= ', ' >>>= ', ' &= ', ' ^= ', ' |= '
            var operators = {
                mixed: /([\$\w\)\}\]])\s*(\=\=|\!\=|\=|\!|\+|\-|\*|\/|\%|<<|>>|>>>|\&|\^|\||<|>)=\s*([\$\w\(\{\[])/g,
                bool: /([\$\w\)\}\]])\s*(\&\&|\|\||\<|\<\<|\>\>\>|\>\>|\>)\s*([\$\w\(\{\[])/g,
                op: /([\$\w\)\}\]])\s*(\+|\-|\*\*|\*|\/|\%)\s*([\$\w\(\{\[])/g,
                sign: /\s*(\+|\-)(\.*\d)/g,
                before: /(\+\+|\-\-|\!|\~)\s*([\$\w\(\{\[])/g,
                after: /([\$\w\)\]])\s*(\+\+|\-\-)/g,
                error: /(.*)(\+\+|\-\-|\+|\-)(.*)/g
            };
            var on = true;
            while (on) {
                on = false;
                string = string.replace(operators.mixed, function (match, left, op, right) {
                    // console.log(match);
                    on = true;
                    var index = _this.replacements.length;
                    _this.replacements.push(' ' + op + '= ');
                    return left + '___boundary_' + index + '_as_operator___' + right;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.bool, function (match, left, op, right) {
                    // console.log(match);
                    on = true;
                    var index = _this.replacements.length;
                    _this.replacements.push(' ' + op + ' ');
                    return left + '___boundary_' + index + '_as_operator___' + right;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.op, function (match, left, op, right) {
                    // console.log(match);
                    on = true;
                    var index = _this.replacements.length;
                    _this.replacements.push(' ' + op + ' ');
                    return left + '___boundary_' + index + '_as_operator___' + right;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.sign, function (match, sign, number) {
                    on = true;
                    var index = _this.replacements.length;
                    _this.replacements.push(' ' + sign);
                    return '___boundary_' + index + '_as_preoperator___' + number;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.before, function (match, op, number) {
                    on = true;
                    var index = _this.replacements.length;
                    _this.replacements.push(op);
                    return '___boundary_' + index + '_as_preoperator___' + number;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.after, function (match, number, op) {
                    on = true;
                    var index = _this.replacements.length;
                    _this.replacements.push(op);
                    return number + '___boundary_' + index + '_as_aftoperator___';
                });
            }
            return string.replace(operators.error, function (match, before, op, after) {
                // console.log(this.replacements);
                throw 'tangram.js sugar Error: Unexpected `' + op + '` in `' + match + '`';
            });
        };
        Sugar.prototype.replaceArray = function (string) {
            var _this = this;
            return string.replace(replaceExpr.array, function (match) {
                var left = match.indexOf('{');
                var right = match.indexOf('}');
                while ((left >= 0) || (right >= 0)) {
                    // console.log('{}');
                    if ((left >= 0) && (left < right)) {
                        match = _this.replaceCodeSegments(match);
                        left = match.indexOf('{');
                        right = match.indexOf('}');
                    }
                    else {
                        throw 'tangram.js sugar Error: Unexpected `{` or `}`';
                    }
                }
                var index = _this.replacements.length;
                _this.replacements.push(match);
                return '___boundary_' + _this.uid + '_' + index + '_as_array___';
            });
        };
        Sugar.prototype.replaceCodeSegments = function (string) {
            var _this = this;
            if (string.match(matchExpr.class)) {
                return string.replace(replaceExpr.class, function (match) {
                    var index = _this.replacements.length;
                    _this.replacements.push(match);
                    return '___boundary_' + _this.uid + '_' + index + '_as_class___';
                });
            }
            if (string.match(matchExpr.define)) {
                return string.replace(replaceExpr.define, function (match) {
                    var index = _this.replacements.length;
                    _this.replacements.push(match);
                    return '___boundary_' + _this.uid + '_' + index + '_as_define___';
                });
            }
            if (string.match(matchExpr.function)) {
                return string.replace(replaceExpr.function, function (match) {
                    while (match.match(matchExpr.call)) {
                        match = _this.replaceCalls(match);
                    }
                    var index = _this.replacements.length;
                    _this.replacements.push(match);
                    return '___boundary_' + _this.uid + '_' + index + '_as_function___';
                });
            }
            return string.replace(replaceExpr.closure, function (match, word, closure) {
                // console.log(match);
                if (!word && match.match(/\{\s*\}/)) {
                    return '___boundary_0_as_mark___';
                }
                var index = _this.replacements.length;
                if (word === 'return') {
                    _this.replacements.push(match.replace(/^return[\s\t]*/, ''));
                    return 'return ' + '___boundary_' + _this.uid + '_' + index + '_as_object___';
                }
                if ((match.indexOf(';') >= 0) || (word && (word != 'return'))) {
                    _this.replacements.push(closure);
                    return (word || '') + '___boundary_' + _this.uid + '_' + index + '_as_closure___';
                }
                _this.replacements.push(match);
                return '___boundary_' + _this.uid + '_' + index + '_as_object___';
            });
        };
        Sugar.prototype.replaceCalls = function (string) {
            var _this = this;
            return string.replace(replaceExpr.call, function (match, callname, args, after) {
                // console.log(match);
                var index = _this.replacements.length;
                _this.replacements.push(callname + args);
                return '___boundary_' + _this.uid + '_' + index + '_as_call___' + after;
            });
        };
        Sugar.prototype.getSentences = function (string, isFnBody) {
            if (isFnBody === void 0) { isFnBody = false; }
            var array = string.split(/\s*;+\s*/);
            var lines = [];
            for (var index_3 = 0; index_3 < array.length; index_3++) {
                var sentence = array[index_3].trim();
                if (sentence) {
                    var sublines = sentence.split(/(^|[^,\s][\r\n])\s*(var)\s+/);
                    // console.log(sublines);
                    for (var i = 0; i < sublines.length; i++) {
                        var element = sublines[i];
                        // console.log(element);
                        if (element === 'var') {
                            this.pushVariables(lines, sublines[++i] + (sublines[++i] || ''), isFnBody);
                        }
                        else {
                            // console.log(element);
                            this.pushLines(lines, element + (sublines[++i] || ''));
                        }
                    }
                }
            }
            // console.log(lines);
            return lines;
        };
        Sugar.prototype.pushVariables = function (lines, string, isFnBody) {
            if (isFnBody === void 0) { isFnBody = false; }
            // console.log(string);
            var array = string.split(/\s*,\s*/);
            // console.log(array);
            for (var index_4 = 0; index_4 < array.length; index_4++) {
                var element = array[index_4].trim();
                ;
                if (element) {
                    var array_1 = element.split(/\s*[\r\n]+\s*/);
                    if (array_1.length) {
                        for (var index_5 = 0; index_5 < array_1.length; index_5++) {
                            var line = array_1[index_5];
                            if (index_5) {
                                lines.push({
                                    type: 'line',
                                    value: line + ';'
                                });
                            }
                            else {
                                if (line.match(/^[\$\w]+\s*(=|$)/)) {
                                    lines.push({
                                        type: 'line',
                                        value: 'var ' + line + ';'
                                    });
                                }
                                else {
                                    throw 'tangram.js sugar Error: Unexpected Variable definition `var ' + this.decode(line) + '`' + (isFnBody ? ' in `' + string + '`' : '');
                                }
                            }
                        }
                    }
                    else {
                        if (element.match(/^[\$\w]\s*(=.+|\s*)$/)) {
                            lines.push({
                                type: 'line',
                                value: 'var ' + element + ';'
                            });
                        }
                        else {
                            throw 'tangram.js sugar Error: Unexpected Variable definition `var ' + this.decode(element) + '`' + '`' + (isFnBody ? ' in `' + string + '`' : '');
                        }
                    }
                }
            }
        };
        Sugar.prototype.pushLines = function (lines, string) {
            var array = string.split(/\s*[\r\n]+\s*/);
            for (var index_6 = 0; index_6 < array.length; index_6++) {
                var element = array[index_6];
                // console.log(element);
                if (element.match(/g/)) {
                    lines.push({
                        type: 'line',
                        value: element
                    });
                }
                else if (element.match(/___boundary_[A-Z0-9_]{36}_\d+_as_function___/)) {
                    lines.push({
                        type: 'line',
                        value: element
                    });
                }
                else if (element) {
                    lines.push({
                        type: 'line',
                        value: element + ';'
                    });
                }
            }
        };
        Sugar.prototype.getReplacePosis = function (lines) {
            var imports = [], import_alias = {}, midast = [];
            for (var index_7 = 0; index_7 < lines.length; index_7++) {
                var line = lines[index_7].value.trim();
                if (line) {
                    var inline = [];
                    var array = line.split('___boundary_' + this.uid);
                    // console.log(array)
                    for (var index_8 = 0; index_8 < array.length; index_8++) {
                        var element = array[index_8].trim();
                        if (element) {
                            var matches = element.match(matchExpr.index3);
                            if (matches) {
                                if (matches[2] === 'import') {
                                    var src = this.replacements[matches[1]].replace(replaceExpr.import, '').replace(replaceExpr.return, '');
                                    imports.push(src);
                                    var srcArr = src.split(/\s+as\s+/);
                                    if (srcArr[1] && srcArr[1].trim()) {
                                        import_alias[srcArr[1].trim()] = srcArr[0].trim();
                                    }
                                }
                                else {
                                    inline.push({
                                        posi: matches[1],
                                        type: matches[2]
                                    });
                                }
                                var m3 = matches[3].trim();
                                if (m3) {
                                    inline.push({
                                        type: 'code',
                                        value: m3
                                    });
                                }
                            }
                            else {
                                inline.push({
                                    type: 'code',
                                    value: element
                                });
                            }
                        }
                    }
                    midast.push(inline);
                }
            }
            this.imports = imports;
            this.import_alias = import_alias;
            console.log(imports, midast);
            return midast;
        };
        Sugar.prototype.buildAST = function (midast) {
            var ast = {
                type: 'codes',
                body: new Array
            };
            for (var index_9 = 0; index_9 < midast.length; index_9++) {
                var block = midast[index_9];
                if (block.length === 1) {
                    var element = block[0];
                    if (element.type === 'code') {
                        // this.pushCodeElements(ast.body, element.value);
                        ast.body.push({
                            type: 'code',
                            value: element
                        });
                    }
                    else {
                        console.log(element);
                        ast.body.push(this.walk(element));
                    }
                }
                else {
                    var codes = {
                        type: 'codes',
                        body: new Array
                    };
                    for (var index_10 = 0; index_10 < block.length; index_10++) {
                        var element = block[index_10];
                        if (element.type === 'code') {
                            codes.body.push({
                                type: 'code',
                                stype: 'inline',
                                value: element
                            });
                        }
                        else {
                            codes.body.push(this.walk(element));
                        }
                    }
                    ast.body.push(codes);
                }
            }
            console.log(ast);
            this.ast = {
                type: 'codes',
                body: new Array
            };
            return this;
            // console.log(ast, this.replacements);
            this.ast = ast;
            return this;
        };
        Sugar.prototype.walk = function (element) {
            switch (element.type) {
                case 'string':
                case 'pattern':
                case 'template':
                    var that_1 = this;
                    return {
                        type: 'codes',
                        body: {
                            type: 'code',
                            stype: 'inline',
                            value: this.replacements[element.posi].replace(this.markPattern, function () {
                                return that_1.replacements[arguments[1]];
                            })
                        }
                    };
                case 'class':
                    return this.walkClass(element.posi);
                case 'define':
                    return this.walkDefine(element.posi);
                case 'function':
                    return this.walkFuntion(element.posi, 'def');
                case 'array':
                    return this.walkArray(element.posi);
                case 'object':
                    return this.walkObject(element.posi);
                case 'closure':
                    return this.walkClosure(element.posi);
                default:
                    return {
                        'type': 'code',
                        'value': ''
                    };
            }
        };
        Sugar.prototype.walkClass = function (posi) {
            // console.log(this.replacements[posi]);
            var matches = this.replacements[posi].match(matchExpr.class);
            // console.log(matches);
            return {
                type: matches[1] ? 'stdClass' : 'anonClass',
                cname: matches[3],
                base: matches[5],
                body: this.checkClassBody(matches[6] || '')
            };
        };
        Sugar.prototype.walkDefine = function (posi) {
            // console.log(this.replacements[posi]);
            var matches = this.replacements[posi].match(matchExpr.define);
            var subtype = 'ext';
            var objname = matches[2];
            if (matches[1] === 'reg') {
                subtype = 'reg';
            }
            else {
                var m2 = matches[2].match(/^(pandora)?.([\$a-zA-Z_][\$\w\.]+$)/);
                if (m2) {
                    subtype = 'reg';
                    objname = m2[2];
                }
            }
            // console.log(matches);
            return {
                type: 'define',
                stype: subtype,
                oname: objname,
                body: this.checkProp(matches[3])
            };
        };
        Sugar.prototype.walkFuntion = function (posi, type) {
            // console.log(this.replacements[posi]);
            var matches = this.replacements[posi].match(matchExpr.function);
            // if (!matches){
            //     console.log(posi, this.replacements);
            // }
            if (matches[1] == null && type === 'def') {
                if (reservedWords['includes'](matches[2])) {
                    // console.log(matches);
                    return {
                        type: 'exp',
                        expression: matches[2],
                        head: this.checkBody(matches[3], true),
                        body: this.checkBody(matches[4])
                    };
                }
                if (matches[2] === 'each') {
                    var m3 = matches[3].match(/^([\$a-zA-Z_][\$\w\.-]+)\s+as\s+([\$\w]+)(\s*,\s*([\$\w]*))?/);
                    // console.log(matches, m3);
                    if (m3) {
                        var iterator = [], array = m3[1].split('___boundary_' + this.uid);
                        for (var index_11 = 0; index_11 < array.length; index_11++) {
                            this.pushReplacements(iterator, array[index_11], true);
                        }
                        var agrs = [];
                        if (m3[3]) {
                            if (m3[4]) {
                                agrs = [m3[2], m3[4]];
                            }
                            else {
                                agrs = [m3[2]];
                            }
                        }
                        else {
                            agrs = ['_index', m3[2]];
                        }
                        return {
                            type: 'travel',
                            iterator: iterator,
                            callback: {
                                type: 'def',
                                fname: '',
                                args: agrs,
                                body: this.checkBody(matches[4])
                            }
                        };
                    }
                }
            }
            // console.log(this.replacements[posi], type, matches);
            var args = this.checkArgs(matches[3]);
            // if (posi == 98) {
            // console.log(matches[4]);
            // }
            return {
                type: type,
                stype: matches[1] ? 'var' : 'fn',
                fname: matches[2] !== 'function' ? matches[2] : '',
                args: args.keys,
                body: this.checkFnBody(args, matches[4])
            };
            // console.log(matches);
        };
        Sugar.prototype.walkArray = function (posi) {
            var body = [], array = this.replacements[posi].replace(/([\[\s\]])/g, '').split(',');
            for (var index_12 = 0; index_12 < array.length; index_12++) {
                var eleArr = array[index_12].split('___boundary_' + this.uid);
                var eleBody = [];
                for (var i = 0; i < eleArr.length; i++) {
                    this.pushReplacements(eleBody, eleArr[i]);
                }
                body.push({
                    type: 'element',
                    body: eleBody
                });
            }
            return {
                type: 'array',
                body: body
            };
        };
        Sugar.prototype.walkObject = function (posi) {
            return {
                type: 'object',
                body: this.checkProp(this.replacements[posi])
            };
        };
        Sugar.prototype.walkClosure = function (posi) {
            var array = this.replacements[posi].split(/\s*(\{|\})\s*/);
            var body = this.checkBody(array[2]);
            if (array[0].trim() === ')') {
                body.unshift({
                    type: 'code',
                    stype: 'inline',
                    value: ') {'
                });
            }
            else {
                body.unshift({
                    type: 'code',
                    stype: 'break',
                    value: array[0] + ' {'
                });
            }
            body.push({
                type: 'code',
                stype: 'closer',
                value: '}'
            });
            return {
                type: 'codes',
                body: body
            };
        };
        Sugar.prototype.walkProp = function (type, attr, array) {
            // console.log(array);
            if (array.length > 1) {
                var body = [];
                if (attr[5]) {
                    body.push({
                        type: 'code',
                        stype: 'inline',
                        value: attr[5]
                    });
                }
                for (var index_13 = 1; index_13 < array.length; index_13++) {
                    var element = array[index_13];
                    var matches = element.trim().match(matchExpr.index3);
                    if (matches) {
                        body.push(this.walk({
                            posi: matches[1],
                            type: matches[2]
                        }));
                        if (matches[3]) {
                            body.push({
                                type: 'code',
                                stype: 'inline',
                                value: matches[3]
                            });
                        }
                    }
                    else {
                        body.push({
                            type: 'code',
                            stype: 'inline',
                            value: element
                        });
                    }
                }
                return {
                    type: type,
                    pname: attr[3] || 'myAttribute',
                    body: body
                };
            }
            return {
                type: type,
                pname: attr[3] || 'myAttribute',
                body: [
                    {
                        type: 'code',
                        stype: 'inline',
                        value: attr[5]
                    }
                ]
            };
        };
        Sugar.prototype.checkBody = function (code, codeInline) {
            if (codeInline === void 0) { codeInline = false; }
            var body = [], array = code.split('___boundary_' + this.uid);
            for (var index_14 = 0; index_14 < array.length; index_14++) {
                this.pushReplacements(body, array[index_14], codeInline);
            }
            return body;
        };
        Sugar.prototype.checkClassBody = function (code) {
            var body = [], array = code.split(/[;\r\n]+/);
            for (var index_15 = 0; index_15 < array.length; index_15++) {
                var element = array[index_15].trim();
                var type = 'method';
                // console.log(element);
                if (element) {
                    var elArr = element.split('___boundary_' + this.uid);
                    if (elArr[0] && elArr[0].trim()) {
                        var m0 = elArr[0].match(matchExpr.classelement);
                        if (m0) {
                            // console.log(m0);
                            if (m0[3].trim()) {
                                if (m0[1]) {
                                    type = 'staticProp';
                                }
                                else {
                                    type = 'prop';
                                }
                                if (m0[4] != '=') {
                                    if ((elArr.length === 1)) {
                                        m0[5] = 'undefined';
                                    }
                                    else {
                                        continue;
                                    }
                                }
                                body.push(this.walkProp(type, m0, elArr));
                                continue;
                            }
                            else {
                                if (m0[1]) {
                                    m0[3] = 'static';
                                    if (m0[4] === '=') {
                                        body.push(this.walkProp('prop', m0, elArr));
                                        continue;
                                    }
                                    else {
                                        if ((elArr.length === 1)) {
                                            m0[5] = 'undefined';
                                            body.push(this.walkProp('prop', m0, elArr));
                                            continue;
                                        }
                                        type = 'staticMethod';
                                    }
                                }
                            }
                        }
                    }
                    if (elArr[1] && elArr[1].trim()) {
                        var m1 = elArr[1].trim().match(matchExpr.index);
                        if (m1[2] === 'function') {
                            body.push(this.walkFuntion(parseInt(m1[1]), type));
                        }
                    }
                }
            }
            return body;
        };
        Sugar.prototype.checkProp = function (code) {
            var that = this, body = [], bodyIndex = -1, lastIndex = 0, array = code.split(/\s*[\{,\}]\s*/);
            // console.log(code, array);
            for (var index_16 = 0; index_16 < array.length; index_16++) {
                var element = array[index_16].trim();
                if (element) {
                    var elArr = element.split('___boundary_' + this.uid);
                    if (elArr[0] && elArr[0].trim()) {
                        var m0 = elArr[0].trim().match(matchExpr.objectattr);
                        if (m0) {
                            if (m0[4] != ':') {
                                if ((elArr.length === 1)) {
                                    m0[5] = m0[3];
                                }
                                else {
                                    // console.log(elArr);
                                    continue;
                                }
                            }
                            // console.log(elArr);
                            body.push(this.walkProp('objProp', m0, elArr));
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
                            var m = elArr[i].trim().match(matchExpr.index3);
                            switch (m[2]) {
                                case 'string':
                                case 'pattern':
                                case 'tamplate':
                                    body[bodyIndex].body.push({
                                        type: 'code',
                                        stype: 'inline',
                                        value: ',' + this.replacements[parseInt(m[1])].replace(this.markPattern, function () {
                                            return that.replacements[arguments[1]];
                                        })
                                    });
                                    if (m[3]) {
                                        body[bodyIndex].body.push({
                                            type: 'code',
                                            stype: 'inline',
                                            value: m[3]
                                        });
                                    }
                                    break;
                                case 'function':
                                    if (elArr.length === 2) {
                                        body.push(this.walkFuntion(parseInt(m[1]), 'method'));
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
        Sugar.prototype.checkFnBody = function (args, code) {
            console.log(code);
            var body = [], lines = this.getSentences(code, true), array = code.split('___boundary_' + this.uid);
            // console.log(args, lines);
            for (var index_17 = 0; index_17 < args.vals.length; index_17++) {
                if (args.vals[index_17] !== undefined) {
                    var valArr = args.vals[index_17].split('___boundary_' + this.uid);
                    if (valArr[1]) {
                        var codes = {
                            type: 'codes',
                            body: new Array
                        };
                        codes.body.push({
                            type: 'code',
                            stype: 'inline',
                            value: 'if (' + args.keys[index_17] + ' === void 0) { ' + args.keys[index_17] + ' = ' + valArr[0]
                        });
                        this.pushReplacements(codes.body, valArr[1], true);
                        codes.body.push({
                            type: 'code',
                            stype: 'inline',
                            value: '; }'
                        });
                        body.push({
                            type: 'codes',
                            value: codes
                        });
                    }
                    else {
                        body.push({
                            type: 'code',
                            value: 'if (' + args.keys[index_17] + ' === void 0) { ' + args.keys[index_17] + ' = ' + valArr[0] + '; }'
                        });
                    }
                }
            }
            // for (let index = 0; index < array.length; index++) {
            //     // console.log(array[index]);
            //     this.pushReplacements(body, array[index]);
            // }
            for (var index_18 = 0; index_18 < lines.length; index_18++) {
                var line = lines[index_18].value.trim();
                if (line) {
                    var inline = [];
                    var array_2 = line.split('___boundary_' + this.uid);
                    // console.log(array)
                    for (var index_19 = 0; index_19 < array_2.length; index_19++) {
                        this.pushReplacements(inline, array_2[index_19]);
                    }
                    body.push(inline);
                }
            }
            return body;
        };
        Sugar.prototype.checkArgs = function (code) {
            var args = code.split(/\s*,\s*/), keys = [], vals = [];
            for (var index_20 = 0; index_20 < args.length; index_20++) {
                var array = args[index_20].split(/\s*=\s*/);
                if (array[0].match(namingExpr)) {
                    keys.push(array[0]);
                    vals.push(array[1]);
                }
            }
            return {
                keys: keys,
                vals: vals
            };
        };
        Sugar.prototype.pushReplacements = function (body, code, codeInline) {
            if (codeInline === void 0) { codeInline = false; }
            code = code.trim();
            if (code) {
                var matches = code.match(matchExpr.index3);
                if (matches) {
                    body.push(this.walk({
                        posi: matches[1],
                        type: matches[2]
                    }));
                    var m3 = matches[3].trim();
                    if (m3) {
                        this.pushCodeElements(body, m3, codeInline);
                    }
                    // if (matches[1]==94) {
                    // console.log(body);
                    // }
                }
                else {
                    this.pushCodeElements(body, code, codeInline);
                }
            }
            return body;
        };
        Sugar.prototype.pushCodeElements = function (body, code, codeInline) {
            if (codeInline === void 0) { codeInline = false; }
            var array = code.split(/([;\r\n]+)/);
            // console.log(array);
            for (var index_21 = 0; index_21 < array.length; index_21++) {
                var element = array[index_21].trim();
                if (element) {
                    body.push({
                        type: codeInline ? 'code-inline' : (element === ';' ? 'code-inline' : 'code'),
                        value: element
                    });
                }
            }
            return body;
        };
        Sugar.prototype.generate = function () {
            // console.log(this.replacements);
            // console.log(this.ast);
            var head = [];
            var body = [];
            var foot = [];
            this.pushHeader(head, this.imports);
            this.pushAlias(body, this.import_alias);
            this.pushCodes(body, this.ast.body, 1);
            this.pushFooter(foot);
            this.output = head.join('') + this.trim(body.join('')) + foot.join('');
            // console.log(this.output);
            return this;
        };
        Sugar.prototype.pushHeader = function (codes, array) {
            codes.push('/*!');
            codes.push("\r\n" + ' * tangram.js framework sugar compiled code');
            codes.push("\r\n" + ' *');
            codes.push("\r\n" + ' * Datetime: ' + (new Date()).toUTCString());
            codes.push("\r\n" + ' */');
            codes.push("\r\n" + ';');
            codes.push("\r\n" + 'tangram.block([');
            if (this.imports.length) {
                codes.push("\r\n\t'" + this.imports.join("',\r\n\t'") + "'\r\n");
            }
            codes.push('], function (pandora, global, imports, undefined) {');
            return codes;
        };
        Sugar.prototype.pushAlias = function (codes, alias) {
            for (var key in alias) {
                codes.push("\r\n\tvar " + key);
                codes.push("=imports['" + alias[key]);
                codes.push("']&&imports['" + alias[key]);
                codes.push("'][0];");
            }
            return codes;
        };
        Sugar.prototype.pushCodes = function (codes, array, layer, asAttr) {
            if (asAttr === void 0) { asAttr = false; }
            var indent = "\r\n" + stringRepeat("\t", layer);
            // console.log(codes, array);
            for (var index_22 = 0; index_22 < array.length; index_22++) {
                var element = array[index_22];
                // console.log(element);
                switch (element.type) {
                    case 'code':
                        codes.push(indent + element.value);
                        break;
                    case 'code-break':
                    case 'code-closer':
                        codes.push(indent.replace("\t", '') + element.value);
                        break;
                    case 'code-inline':
                        codes.push(element.value);
                        break;
                    case 'anonClass':
                    case 'stdClass':
                        this.pushClassCodes(codes, element, layer);
                        break;
                    case 'array':
                        this.pushArrayCodes(codes, element, layer, asAttr);
                        break;
                    case 'codes':
                        // console.log(element);
                        this.pushCodes(codes, element.body, layer + 1);
                        break;
                    case 'def':
                        this.pushFunctionCodes(codes, element, layer);
                        break;
                    case 'define':
                        this.pushDefineCodes(codes, element, layer);
                        break;
                    case 'exp':
                        this.pushExpressionCodes(codes, element, layer);
                        break;
                    case 'object':
                        // console.log(element);
                        this.pushObjCodes(codes, element, layer);
                        break;
                    case 'travel':
                        this.pushTravelCodes(codes, element, layer);
                        break;
                }
            }
            return codes;
        };
        Sugar.prototype.pushClassCodes = function (codes, element, layer) {
            var indent1 = "\r\n" + stringRepeat("\t", layer);
            var indent2 = "\r\n" + stringRepeat("\t", layer + 1);
            var elements = [];
            var static_elements = [];
            var cname = '';
            if (element.type === 'stdClass') {
                cname = 'pandora.' + element.cname.trim();
                codes.push(indent1 + 'pandora.declareClass(\'' + element.cname.trim() + '\', ');
            }
            else {
                if (element.cname && element.cname.trim()) {
                    cname = element.cname.trim();
                    if (cname.match(/^[\$\w]+$/)) {
                        codes.push(indent1 + 'var ' + cname + ' = pandora.declareClass(, ');
                    }
                    else {
                        codes.push(indent1 + cname + ' = pandora.declareClass(, ');
                    }
                }
                else {
                    codes.push('pandora.declareClass(');
                }
            }
            if (element.base) {
                codes.push(element.base.trim() + ', ');
            }
            codes.push('{');
            // console.log(element);
            for (var index_23 = 0; index_23 < element.body.length; index_23++) {
                var member = element.body[index_23];
                var elem = [];
                // console.log(member);
                switch (member.type) {
                    case 'method':
                        elem.push(indent2 + member.fname + ': ');
                        this.pushFunctionCodes(elem, member, layer + 1);
                        elements.push(elem.join(''));
                        break;
                    case 'prop':
                        elem.push(indent2 + member.pname + ': ');
                        this.pushCodes(elem, member.body, layer + 1, true);
                        elements.push(elem.join(''));
                        break;
                    case 'staticMethod':
                        elem.push(indent2 + member.fname + ': ');
                        this.pushFunctionCodes(elem, member, layer + 1);
                        static_elements.push(elem.join(''));
                        break;
                    case 'staticProp':
                        elem.push(indent2 + member.pname + ': ');
                        this.pushCodes(elem, member.body, layer + 1, true);
                        static_elements.push(elem.join(''));
                        break;
                }
            }
            codes.push(elements.join(','));
            codes.push(indent1 + '})');
            if (cname) {
                if (static_elements.length) {
                    codes.push(';' + indent1 + 'pandora.extend(' + cname + ', {');
                    codes.push(static_elements.join(','));
                    codes.push('});');
                }
                else {
                    codes.push(';');
                }
            }
            return codes;
        };
        Sugar.prototype.pushArrayCodes = function (codes, element, layer, asAttr) {
            var elements = [];
            codes.push('[');
            for (var index_24 = 0; index_24 < element.body.length; index_24++) {
                var body = element.body[index_24].body;
                var elemCodes = this.pushCodes([], body, layer + 1, true);
                // let elem:string[] = this.pushCodes([], body, layer + 1);
                elements.push(elemCodes.join('').trim());
            }
            codes.push(elements.join(', '));
            if (asAttr) {
                codes.push(']');
            }
            else {
                codes.push('];');
            }
            return codes;
        };
        Sugar.prototype.pushTravelCodes = function (codes, element, layer) {
            var indent = "\r\n" + stringRepeat("\t", layer);
            // console.log(element);
            codes.push(indent + 'pandora.each(');
            this.pushCodes(codes, element.iterator, layer);
            codes.push(', ');
            this.pushFunctionCodes(codes, element.callback, layer);
            codes.push(indent + ', this);');
            return codes;
        };
        Sugar.prototype.pushFunctionCodes = function (codes, element, layer) {
            var indent = "\r\n" + stringRepeat("\t", layer);
            if (element.type === 'def' && element.fname) {
                if (element.stype === 'var') {
                    codes.push(indent + 'var ' + element.fname + ' = function (');
                }
                else {
                    codes.push(indent + 'function ' + element.fname + ' (');
                }
            }
            else {
                codes.push('function (');
            }
            if (element.args.length) {
                codes.push(element.args.join(', '));
            }
            codes.push(') {');
            // console.log(element.body);
            this.pushCodes(codes, element.body, layer + 1);
            if (element.type === 'def' && !element.fname) {
                codes.push(indent + '};');
            }
            else if (element.stype === 'var') {
                codes.push(indent + '};');
            }
            else {
                codes.push(indent + '}');
            }
            return codes;
        };
        Sugar.prototype.pushExpressionCodes = function (codes, element, layer) {
            var indent = "\r\n" + stringRepeat("\t", layer);
            codes.push(indent + element.expression + ' (');
            // console.log(element.head);
            this.pushCodes(codes, element.head, layer);
            codes.push(') {');
            // console.log(element.body);
            this.pushCodes(codes, element.body, layer + 1);
            codes.push(indent + '}');
            return codes;
        };
        Sugar.prototype.pushDefineCodes = function (codes, element, layer) {
            var indent = "\r\n" + stringRepeat("\t", layer);
            if (element.stype === 'reg') {
                codes.push(indent + 'pandora(\'' + element.oname.trim() + '\', ');
            }
            else {
                codes.push(indent + 'pandora.extend(' + element.oname + ', ');
            }
            this.pushObjCodes(codes, element, layer);
            codes.push(');');
            return codes;
        };
        Sugar.prototype.pushObjCodes = function (codes, element, layer) {
            var indent1 = "\r\n" + stringRepeat("\t", layer);
            var indent2 = "\r\n" + stringRepeat("\t", layer + 1);
            var elements = [];
            codes.push('{');
            // console.log(element);
            for (var index_25 = 0; index_25 < element.body.length; index_25++) {
                var member = element.body[index_25];
                var elem = [];
                // console.log(member);
                switch (member.type) {
                    case 'method':
                        elem.push(indent2 + member.fname + ': ');
                        this.pushFunctionCodes(elem, member, layer + 1);
                        break;
                    case 'objProp':
                        elem.push(indent2 + member.pname + ': ');
                        this.pushCodes(elem, member.body, layer + 1, true);
                        // console.log(elem, member);
                        break;
                }
                elements.push(elem.join(''));
            }
            // console.log(elements);
            codes.push(elements.join(','));
            codes.push(indent1 + '}');
            return codes;
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
        Sugar.prototype.trim = function (string) {
            string = this.restoreStrings(string);
            return string;
            // 此处的replace在整理完成后，将进行分析归纳，最后改写为callback形式的
            string = this.replaceStrings(string);
            console.log(string);
            // 关键字处理
            string = string.replace(/function\s+function\s+/g, 'function ');
            // string = string.replace(/[;\r\n]+?(\s*)if\s*\(([\s\S]+?)\)/g, ";\r\n$1if ($2) ");
            // string = string.replace(/if\s*\(([\s\S]+?)\)[\s,;]*{/g, "if ($1) {");
            string = string.replace(/;+\s*(instanceof)\s+/g, " $1 ");
            string = string.replace(/(var|else|delete)(;|\s)+[;\s]*/g, "$1 ");
            string = string.replace(/[;\r\n]+(\s*)(var|delete|return)\s+/g, ";\r\n$1$2 ");
            //前置运算符处理
            string = string.replace(/[,\s]*(___boundary_\d+_as_preoperator___)[,;\s]*/g, "$1");
            string = string.replace(/((\<|\!|\>)\=*)\s+(\+|\-)\s+(\d)/g, '$1 $3$4');
            // 中置运算符前后不能结非标量
            string = string.replace(/[,;\s]*(___boundary_\d+_as_operator___)[,;\s]*/g, "$1");
            string = string.replace(/[,;\s]*(\=|\!|\+|\-|\*|\/|\%|\&|\^|\||<|>)[,;\s]*/g, " $1 ");
            // string = string.replace(/\s*;+\s*(<+|\+|\-|\*|\/|>+)\s+/g, " $1 ");
            // string = string.replace(/\s+(<+|\+|\-|\*|\/|>+)\s*;+\s*/g, " $1 ");
            string = string.replace(/[,;\s]*(\?)[,;\s]*/g, " $1 ");
            // 后置运算符前面必须有内容
            string = string.replace(/[,;\s]*(___boundary_\d+_as_aftoperator___)/g, "$1");
            string = string.replace(/[,;\s]*(\(|\))/g, "$1");
            //去除多余符号
            string = string.replace(/\s*;+/g, "; ");
            string = string.replace(/[,;\s]*,[,;]*/g, ',');
            string = string.replace(/(\{|\[|\(|\.|\:)\s*;+/g, "$1");
            string = string.replace(/\s*,+\s*(\.|\:|\)|\]|\})/g, "$1");
            string = string.replace(/(\{|\[|\(|\.|\:)\s*,+(\s*)/g, "$1$2");
            string = string.replace(/[;\s]+(\{|\[|\(|\.|\:|\)|\])/g, "$1");
            // 删除多余换行
            string = string.replace(/(,|;)[\r\n]+/g, "$1\r\n");
            // 删除多余空白
            string = string.replace(/\{\s+\}/g, '{}');
            string = string.replace(/\[\s+\]/g, '[]');
            string = string.replace(/\(\s+\)/g, '()');
            // 删除多余头部
            string = string.replace(/^[,;\s]+/g, "");
            string = string.replace(/[\r\n]+(\s+)\}\s*([\$\w+]+)/g, "\r\n$1}\r\n$1$2");
            string = this.restoreStrings(string);
            return string;
        };
        Sugar.prototype.restoreStrings = function (string) {
            var that = this;
            return string.replace(this.lastPattern, function () {
                // console.log(arguments[1]);
                return that.replacements[arguments[2] || arguments[4]];
            }).replace(this.markPattern, function () {
                return that.replacements[arguments[1]];
            });
        };
        Sugar.prototype.run = function () {
            if (!this.output) {
                this.compile();
            }
            eval(this.output);
        };
        return Sugar;
    }());
    return function (input, run) {
        return new Sugar(input, run);
    };
}));
//# sourceMappingURL=sugar.js.map