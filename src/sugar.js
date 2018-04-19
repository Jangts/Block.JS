/*!
 * tangram.js framework source code
 *
 * syntactic sugars for tangram.js
 *
 * Date 2017-04-06
 */
;
(function (global, factory) {
    if (typeof exports === 'object') {
        exports = factory(global);
        if (typeof module === 'object') {
            module.exports = exports;
        }
    }
    else if (typeof define === 'function' && define.amd) {
        // AMD
        define('tangram_js_sugar', [], function () {
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
    var zero2z = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''), namingExpr = /^[A-Z_\$][\w\$]*(\.[A-Z_\$][\w\$]*)*$/i, reservedWords = ['if', 'for', 'while', 'switch'], replaceExpr = {
        use: /\s*use\s+.[\$\w\.\s\/\\]+?[;\r\n]+/g,
        import: /^\s*use\s+/g,
        return: /[\s;\r\n]+$/g,
        include: /\s*@include\s+.[\$\w\.\s\/\\]+?[;\r\n]+/g,
        class: /class\s+((pandora)?\.)?([\$\w\.]+\s+)?(extends\s+([\$\w\.]+)\s*)?\{([^\{\}]*?)\}/g,
        defind: /(reg|extends)\s+([\$\w\.]+)\s*\{([^\{\}]*?)\}/g,
        function: /(var\s+)?([\$\w]*)\s*\(([^\(\)]*)\)[\s\r\n\t]*\{([^\{\}]*?)\}/g,
        localcode: /([\$\w]+|\))[\s\r\n\t]*\{[^\{\}]*?\}/g,
        array: /\[[^\[\]]*?\]/g,
        object: /\{[^\{\}]*?\}/g
    }, matchExpr = {
        index: /(\d+)_as_([a-z]+)/,
        index3: /^_(\d+)_as_([a-z]+)___([\s\S]*)$/,
        class: /class\s+((pandora)?\.)?([\$\w\.]+\s+)?(extends\s+([\$\w\.]+)\s*)?\{([^\{\}]*?)\}/,
        classelement: /^\s*(static\s+)?([\$\w]*)\s*(\=*)([\s\S]*)$/,
        objectattr: /^\s*(([\$\w]+))\s*(\:*)([\s\S]*)$/,
        defind: /(reg|extends)\s+([\$\w\.]+)\s*\{([^\{\}]*?)\}/,
        function: /(var\s+)?([\$\w]*)\s*\(([^\(\)]*)\)[\s\r\n\t]*\{([^\{\}]*?)\}/,
        localcode: /([\$\w]+|\))[\s\r\n\t]*\{[^\{\}]*?\}/,
        object: /\{[^\{\}]*?\}/
    }, boundaryMaker = function () {
        var radix = 36;
        var uid = new Array(36);
        for (var i = 0; i < 36; i++) {
            uid[i] = zero2z[Math.floor(Math.random() * radix)];
        }
        uid[8] = uid[13] = uid[18] = uid[23] = '-';
        return uid.join('');
    }, stringRepeat = function (string, number) {
        return new Array(number + 1).join(string);
    };
    var Sugar = /** @class */ (function () {
        function Sugar(input, run) {
            this.isMainBlock = true;
            this.replacements = ['\\"', '\\\''];
            this.imports = [];
            this.import_alias = {};
            this.ast = {};
            this.uid = boundaryMaker();
            this.input = input;
            this.output = undefined;
            if (run) {
                this.run();
            }
        }
        Sugar.prototype.compile = function () {
            this.buildAST(this.buildMiddleAST(this.encode()));
            this.generate();
            // console.log(this.replacements);
            return this;
        };
        Sugar.prototype.encode = function () {
            var _this = this;
            // console.log(this.input);
            var string = this.input.replace(/^[\s\r\n]*"await"[\s\r\n]*/, function (match) {
                _this.isMainBlock = false;
                // console.log('This is not a main block.');
                return '';
            });
            string = this.replaceStrings(string);
            while (string.indexOf('@include') >= 0) {
                string = this.replaceIncludes(string);
            }
            while (string.indexOf('[') >= 0) {
                string = this.replaceArray(string);
            }
            while (string.indexOf('{') >= 0) {
                string = this.replaceCodeSegments(string);
            }
            string = this.replaceImports(string);
            // console.log(string:string);
            return string.replace(/;+/, ';');
        };
        Sugar.prototype.replaceStrings = function (string) {
            string = string.replace(/\s*\/\/.+/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace('\\"', this.uid + '_0=mark;').replace('\\\'', this.uid + '_1=mark;');
            // console.log(string:string);
            var matches = string.match(/('|")/);
            // console.log(match);
            while (matches) {
                if (matches[0] === '"') {
                    string = this.replaceDoubleQuotationMark(string);
                }
                else {
                    string = this.replaceSingleQuotationMark(string);
                }
                matches = string.match(/('|")/);
            }
            return string;
        };
        Sugar.prototype.replaceSingleQuotationMark = function (string) {
            var _this = this;
            return string.replace(/'[^']*'/, function (match) {
                var index = _this.replacements.length;
                _this.replacements.push(match);
                return _this.uid + '_' + index + '_as_string___';
            });
        };
        Sugar.prototype.replaceDoubleQuotationMark = function (string) {
            var _this = this;
            return string.replace(/"[^"]*"/, function (match) {
                var index = _this.replacements.length;
                _this.replacements.push(match);
                return _this.uid + '_' + index + '_as_string___';
            });
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
        Sugar.prototype.replaceImports = function (string) {
            var _this = this;
            return string.replace(replaceExpr.use, function (match) {
                var index = _this.replacements.length;
                _this.replacements.push(match);
                return _this.uid + '_' + index + '_as_import___';
            });
        };
        Sugar.prototype.replaceArray = function (string) {
            var _this = this;
            return string.replace(replaceExpr.array, function (match) {
                while (match.indexOf('{') >= 0) {
                    match = _this.replaceCodeSegments(match);
                }
                var index = _this.replacements.length;
                _this.replacements.push(match);
                return _this.uid + '_' + index + '_as_array___';
            });
        };
        Sugar.prototype.replaceCodeSegments = function (string) {
            var _this = this;
            if (string.match(matchExpr.class)) {
                return string.replace(replaceExpr.class, function (match) {
                    var index = _this.replacements.length;
                    _this.replacements.push(match);
                    return _this.uid + '_' + index + '_as_class___';
                });
            }
            if (string.match(matchExpr.defind)) {
                return string.replace(replaceExpr.defind, function (match) {
                    var index = _this.replacements.length;
                    _this.replacements.push(match);
                    return _this.uid + '_' + index + '_as_defind___';
                });
            }
            if (string.match(matchExpr.function)) {
                return string.replace(replaceExpr.function, function (match) {
                    var index = _this.replacements.length;
                    _this.replacements.push(match);
                    return _this.uid + '_' + index + '_as_function___';
                });
            }
            var matches = string.match(matchExpr.localcode);
            if (matches) {
                return string.replace(replaceExpr.localcode, function (match) {
                    var index = _this.replacements.length;
                    if (matches[1] === 'return') {
                        _this.replacements.push(match.replace(/^return[\s\r\n\t]*/, ''));
                        return matches[1] + ' ' + _this.uid + '_' + index + '_as_object___';
                    }
                    _this.replacements.push(match);
                    return _this.uid + '_' + index + '_as_localcode___';
                });
            }
            if (string.match(matchExpr.object)) {
                return string.replace(replaceExpr.object, function (match) {
                    var index = _this.replacements.length;
                    _this.replacements.push(match);
                    return _this.uid + '_' + index + '_as_object___';
                });
            }
            return string;
        };
        Sugar.prototype.buildMiddleAST = function (string) {
            var imports = [], import_alias = {}, midast = [], array = string.split(this.uid);
            // console.log(array)
            for (var index_1 = 0; index_1 < array.length; index_1++) {
                var element = array[index_1].trim();
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
                            midast.push({
                                posi: matches[1],
                                type: matches[2]
                            });
                        }
                        var m3 = matches[3].trim();
                        if (m3) {
                            midast.push({
                                type: 'code',
                                value: m3
                            });
                        }
                    }
                    else {
                        midast.push({
                            type: 'code',
                            value: element
                        });
                    }
                }
            }
            this.imports = imports;
            this.import_alias = import_alias;
            return midast;
        };
        Sugar.prototype.buildAST = function (midast) {
            var ast = {
                type: 'codes',
                body: new Array
            };
            for (var index_2 = 0; index_2 < midast.length; index_2++) {
                var element = midast[index_2];
                if (element.type === 'code') {
                    this.pushCodeElements(ast.body, element.value);
                    // ast.body.push(element);
                }
                else {
                    ast.body.push(this.walk(element));
                }
            }
            this.ast = ast;
            return this;
            // console.log(ast, this.replacements);
        };
        Sugar.prototype.walk = function (element) {
            switch (element.type) {
                case 'string':
                    return {
                        'type': 'code-inline',
                        'value': this.replacements[element.posi].replace(this.uid + '_0=mark;', '\\"').replace(this.uid + '_1=mark;', '\\\'')
                    };
                case 'class':
                    return this.walkClass(element.posi);
                case 'defind':
                    return this.walkDefine(element.posi);
                case 'function':
                    return this.walkFuntion(element.posi, 'def');
                case 'array':
                    return this.walkArray(element.posi);
                case 'object':
                    return this.walkObject(element.posi);
                case 'localcode':
                    return this.walkLocalCode(element.posi);
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
            // let clasjs = /class\s+((pandora)?\.)?([\$\w\.]+\s+)?(extends\s+([\$\w\.]+)\s*)?\{([^\{\}]*?)\}/g;
            return {
                type: matches[1] ? 'stdClass' : 'anonClass',
                cname: matches[3],
                base: matches[5],
                body: this.checkClassBody(matches[6] || '')
            };
        };
        Sugar.prototype.walkDefine = function (posi) {
            // console.log(this.replacements[posi]);
            var matches = this.replacements[posi].match(matchExpr.defind);
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
                type: 'defind',
                stype: subtype,
                oname: objname,
                body: this.checkProp(matches[3])
            };
        };
        Sugar.prototype.walkFuntion = function (posi, type) {
            // console.log(this.replacements[posi]);
            var matches = this.replacements[posi].match(matchExpr.function);
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
                    var m3 = matches[3].match(/^([\$a-zA-Z_][\$\w\.-]+)\s+as\s+([\$\w]+,)?\s*([\$\w]+)/);
                    // console.log(matches, m3);
                    if (m3) {
                        var iterator = [], array = m3[1].split(this.uid);
                        for (var index_3 = 0; index_3 < array.length; index_3++) {
                            this.pushReplacements(iterator, array[index_3], true);
                        }
                        return {
                            type: 'travel',
                            iterator: iterator,
                            callback: {
                                type: 'def',
                                fname: '',
                                args: [m3[2] || '_index', m3[3]],
                                body: this.checkBody(matches[4])
                            }
                        };
                    }
                }
            }
            // console.log(this.replacements[posi], type, matches);
            var args = this.checkArgs(matches[3]);
            // if (posi == 98) {
            //     console.log(matches[4]);
            // }
            // if (posi == 94) {
            //     console.log(matches[4]);
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
            var body = [], array = this.replacements[posi].replace(/([\[\s\r\n\]])/g, '').split(',');
            for (var index_4 = 0; index_4 < array.length; index_4++) {
                var eleArr = array[index_4].split(this.uid);
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
            // if (posi == 82) {
            //     console.log(this.replacements[posi]);
            // }
            return {
                type: 'object',
                body: this.checkProp(this.replacements[posi])
            };
        };
        Sugar.prototype.walkLocalCode = function (posi) {
            // if (posi == 90) {
            //     console.log(this.replacements[posi]);
            // }
            var array = this.replacements[posi].split(/[\s\r\n]*(\{|\})[\s\r\n]*/);
            var body = this.checkBody(array[2]);
            if (array[0].trim() === ')') {
                body.unshift({
                    type: 'code-inline',
                    value: ') {'
                });
            }
            else {
                body.unshift({
                    type: 'code-break',
                    value: array[0] + ' {'
                });
            }
            body.push({
                type: 'code-closer',
                value: '}'
            });
            // console.log(array);
            return {
                type: 'codes',
                body: body
            };
        };
        Sugar.prototype.walkProp = function (type, attr, array) {
            // console.log(array);
            if (array.length > 1) {
                var body = [];
                if (attr[4]) {
                    body.push({
                        type: 'code-inline',
                        value: attr[4]
                    });
                }
                for (var index_5 = 1; index_5 < array.length; index_5++) {
                    var element = array[index_5];
                    var matches = element.trim().match(matchExpr.index3);
                    if (matches) {
                        body.push(this.walk({
                            posi: matches[1],
                            type: matches[2]
                        }));
                        if (matches[3]) {
                            body.push({
                                type: 'code-inline',
                                value: matches[3]
                            });
                        }
                    }
                    else {
                        body.push({
                            type: 'code-inline',
                            value: element
                        });
                    }
                }
                return {
                    type: type,
                    pname: attr[2] || 'myAttribute',
                    body: body
                };
            }
            return {
                type: type,
                pname: attr[2] || 'myAttribute',
                body: [
                    {
                        type: 'code-inline',
                        value: attr[4] || attr[2]
                    }
                ]
            };
        };
        Sugar.prototype.checkBody = function (code, codeInline) {
            if (codeInline === void 0) { codeInline = false; }
            var body = [], array = code.split(this.uid);
            for (var index_6 = 0; index_6 < array.length; index_6++) {
                this.pushReplacements(body, array[index_6], codeInline);
            }
            return body;
        };
        Sugar.prototype.checkClassBody = function (code) {
            var body = [], array = code.split(/[;\r\n]+/);
            for (var index_7 = 0; index_7 < array.length; index_7++) {
                var element = array[index_7].trim();
                var type = 'method';
                // console.log(element);
                // continue;
                if (element) {
                    var elArr = element.split(this.uid);
                    if (elArr[0] && elArr[0].trim()) {
                        var m0 = elArr[0].trim().match(matchExpr.classelement);
                        if (m0) {
                            if (m0[1] && (m0[1].trim() === 'static')) {
                                // console.log(m0, m1);
                                if (m0[3] && m0[3].trim() === '=') {
                                    if (m0[2].trim()) {
                                        body.push(this.walkProp('staticProp', m0, elArr));
                                    }
                                    else {
                                        m0[2] = 'static';
                                        body.push(this.walkProp('prop', m0, elArr));
                                    }
                                    continue;
                                }
                                else {
                                    if (m0[2].trim()) {
                                        continue;
                                    }
                                    type = 'staticMethod';
                                }
                            }
                            else {
                                if (m0[2].trim()) {
                                    if (m0[3] && m0[3].trim() === '=') {
                                        body.push(this.walkProp('prop', m0, elArr));
                                    }
                                    continue;
                                }
                            }
                        }
                    }
                    if (elArr[1] && elArr[1].trim()) {
                        var m1 = elArr[1].trim().match(matchExpr.index);
                        body.push(this.walkFuntion(parseInt(m1[1]), type));
                    }
                }
            }
            return body;
        };
        Sugar.prototype.checkProp = function (code) {
            var body = [], array = code.split(/[\s\r\n]*[\{;,\}]+[\s\r\n]*/);
            // console.log(code, array);
            for (var index_8 = 0; index_8 < array.length; index_8++) {
                var element = array[index_8].trim();
                if (element) {
                    var elArr = element.split(this.uid);
                    if (elArr[0] && elArr[0].trim()) {
                        var m0 = elArr[0].trim().match(matchExpr.objectattr);
                        if (m0) {
                            body.push(this.walkProp('objProp', m0, elArr));
                            continue;
                        }
                    }
                    if (elArr[1] && elArr[1].trim()) {
                        var m1 = elArr[1].trim().match(matchExpr.index);
                        // console.log(m1);
                        switch (m1[2]) {
                            case 'function':
                                body.push(this.walkFuntion(parseInt(m1[1]), 'method'));
                                break;
                            case 'array':
                                body.push(this.walkArray(parseInt(m1[1])));
                                break;
                            default:
                                // console.log(body, elArr, m1);
                                body[body.length - 1].body.push({
                                    'type': 'code-inline',
                                    'value': elArr[0]
                                });
                                body[body.length - 1].body.push({
                                    'type': 'code-inline',
                                    'value': this.replacements[parseInt(m1[1])].replace(this.uid + '_0=mark;', '\\"').replace(this.uid + '_1=mark;', '\\\'')
                                });
                                break;
                        }
                    }
                    else {
                        // console.log(elArr);
                    }
                }
            }
            return body;
        };
        Sugar.prototype.checkFnBody = function (args, code) {
            var body = [], array = code.split(this.uid);
            for (var index_9 = 0; index_9 < args.vals.length; index_9++) {
                if (args.vals[index_9] !== undefined) {
                    var valArr = args.vals[index_9].split(this.uid);
                    if (valArr[1]) {
                        body.push({
                            type: 'code',
                            value: 'if (' + args.keys[index_9] + ' === void 0) { ' + args.keys[index_9] + ' = ' + valArr[0]
                        });
                        this.pushReplacements(body, valArr[1]);
                        body.push({
                            type: 'code-inline',
                            value: '; }'
                        });
                    }
                    else {
                        body.push({
                            type: 'code',
                            value: 'if (' + args.keys[index_9] + ' === void 0) { ' + args.keys[index_9] + ' = ' + valArr[0] + '; }'
                        });
                    }
                }
            }
            for (var index_10 = 0; index_10 < array.length; index_10++) {
                // console.log(array[index]);
                this.pushReplacements(body, array[index_10]);
            }
            return body;
        };
        Sugar.prototype.checkArgs = function (code) {
            var args = code.split(/\s*,\s*/), keys = [], vals = [];
            for (var index_11 = 0; index_11 < args.length; index_11++) {
                var array = args[index_11].split(/\s*=\s*/);
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
                    //     console.log(body);
                    // }
                    // if (matches[1]==90) {
                    //     console.log(body);
                    // }
                    // if (matches[1]==82) {
                    //     console.log(body);
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
            var array = code.split(/[;\r\n]+/);
            // console.log(array);
            for (var index_12 = 0; index_12 < array.length; index_12++) {
                var element = array[index_12].trim();
                if (element) {
                    if (!codeInline && (index_12 === (array.length - 1))) {
                        body.push({
                            type: 'code',
                            value: element
                        });
                    }
                    else {
                        body.push({
                            type: codeInline ? 'code-inline' : 'code',
                            value: element + ';'
                        });
                    }
                }
                else {
                    if (!codeInline && (index_12 === (array.length - 1))) {
                        body.push({
                            type: 'code-inline',
                            value: ';'
                        });
                    }
                }
            }
            return body;
        };
        Sugar.prototype.generate = function () {
            // console.log(this.replacements);
            // console.log(this.imports);
            // console.log(this.import_alias);
            // console.log(this.ast);
            var head = [];
            var body = [];
            var foot = [];
            this.pushHeader(head, this.imports);
            this.pushAlias(body, this.import_alias);
            this.pushCodes(body, this.ast.body, 1);
            this.pushFooter(foot);
            // console.log(JSON.stringify(this.ast));
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
            for (var index_13 = 0; index_13 < array.length; index_13++) {
                var element = array[index_13];
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
                    case 'defind':
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
            for (var index_14 = 0; index_14 < element.body.length; index_14++) {
                var member = element.body[index_14];
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
            for (var index_15 = 0; index_15 < element.body.length; index_15++) {
                var body = element.body[index_15].body;
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
            for (var index_16 = 0; index_16 < element.body.length; index_16++) {
                var member = element.body[index_16];
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
            // 此处的replace在整理完成后，将进行分析归纳，最后改写为callback形式的
            string = this.replaceStrings(string);
            string = string.replace(/_as_string___/g, '_' + this.uid);
            string = string.replace(/function[\s\r\n]+function[\s\r\n]+/g, 'function ');
            string = string.replace(/[,;\s\r\n]*,[,;]*/g, ',');
            string = string.replace(/,[\r\n]+/g, ",\r\n");
            string = string.replace(/[\s\r\n]*,+[\s\r\n]*(\+|\-|\&|\||\=|\.|\:|\)|\]|\})/g, "$1");
            string = string.replace(/(\{|\[|\(|\+|\-|\&|\||\=|\.|\:)[\s\r\n]*,+[\s\r\n]*/g, "$1");
            string = string.replace(/;*[\s\r\n]*[\r\n]+(\s+)(var|return)\s+/g, ";\r\n$1$2 ");
            string = string.replace(/;+[\s\r\n]*(instanceof)\s+/g, " $1 ");
            string = string.replace(/[\s\r\n]*;+[\s\r\n]*(\{|\[|\(|\=|\&|\||\.|\:|\)|\])/g, "$1");
            string = string.replace(/(\{|\[|\(|\=|\&|\||\.|\:)[\s\r\n]*;+/g, "$1");
            string = string.replace(/[\s\r\n]*(\<|\+|\-|\&|\||\=|\:|\?|\>)[\s\r\n]*/g, " $1 ");
            string = string.replace(/[\s\r\n]*(\(|\))/g, "$1");
            string = string.replace(/(\<|\!|\+|\-|\=|\>)[\s\r\n]+\=/g, '$1=');
            string = string.replace(/((\<|\!|\>)\=*)[\s\r\n]+(\+|\-)[\s\r\n]+(\d)/g, '$1 $3$4');
            string = string.replace(/(\<|\!|\+|\-|\=|\>)[\s\r\n]+\=/g, '$1=');
            string = string.replace(/[\s\r\n]*\=[\s\r\n]+\=[\s\r\n]*/g, '==');
            string = string.replace(/[\s\r\n]*\+[\s\r\n]+\+[\s\r\n]*/g, '++');
            string = string.replace(/[\s\r\n]*\-[\s\r\n]+\-[\s\r\n]*/g, '--');
            string = string.replace(/[\s\r\n]*\&[\s\r\n]+\&[\s\r\n]*/g, ' && ');
            string = string.replace(/[\s\r\n]*\|[\s\r\n]+\|[\s\r\n]*/g, ' || ');
            string = string.replace(/\{[\s\r\n]+\}/g, '{}');
            string = string.replace(/\[[\s\r\n]+\]/g, '[]');
            string = string.replace(/\([\s\r\n]+\)/g, '()');
            string = string.replace(/[\s\r\n]*;+/g, "; ");
            string = string.replace(/^;/g, "");
            string = string.replace(/[\r\n]+(\s+)\}\s*([\$\w+]+)/g, "\r\n$1}\r\n$1$2");
            string = this.restoreStrings(string);
            return string;
        };
        Sugar.prototype.restoreStrings = function (string) {
            var boundary = this.uid.replace(/-/g, ' - ');
            var pattern = new RegExp(boundary + '_(\\\d+)_' + boundary);
            var matches = string.match(pattern);
            // console.log(pattern);
            // console.log(matches);
            while (matches) {
                string = string.replace(matches[0], this.replacements[matches[1]]);
                matches = string.match(pattern);
            }
            return string.replace(this.uid + '_0=mark;', '\\"').replace(this.uid + '_1=mark;', '\\\'');
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
