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
    if (Array.prototype['includes'] == undefined) {
        Array.prototype['includes'] = (searchElement: any, fromIndex: any): boolean => {
            fromIndex = parseInt(fromIndex) || 0;
            for (fromIndex; fromIndex < this.length; fromIndex++) {
                if (this[fromIndex] === searchElement) {
                    return true;
                }
            }
            return false;
        }
    }

    const zero2z: string[] = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
        namingExpr: RegExp = /^[A-Z_\$][\w\$]*(\.[A-Z_\$][\w\$]*)*$/i,
        reservedWords = ['if', 'for', 'while', 'switch', 'with', 'catch'],
        replaceExpr = {
            use: /\s*use\s+.[\$\w\.\s\/\\]+?[;\r\n]+/g,
            import: /^\s*use\s+/g,
            return: /[\s;\r\n]+$/g,
            include: /\s*@include\s+.[\$\w\.\s\/\\]+?[;\r\n]+/g,
            class: /class\s+((pandora)?\.)?([\$\w\.]+\s+)?(extends\s+([\$\w\.]+)\s*)?\{([^\{\}]*?)\}/g,
            define: /(reg|extends)\s+([\$\w\.]+)\s*\{([^\{\}]*?)\}/g,
            function: /((var|let|function|def)\s+)?([\$\w]*)\s*\(([^\(\)]*)\)[\s\t]*\{([^\{\}]*?)\}/g,
            array: /\[[^\[\]]*?\]/g,
            call: /([\$\w]+)([\s\t]*\([^\(\)]*?\))\s*([^\$\w\s\{]|[\r\n].)/g,
            closure: /([\$\w]+|\))?([\s\t]*\{[^\{\}]*?\})/g
        },
        matchExpr = {
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
            classelement: /^\s*((public|static)\s+)?([\$\w]*)\s*(\=*)([\s\S]*)$/,
            objectattr: /^\s*((([\$\w]+)))\s*(\:*)([\s\S]*)$/,
            define: /(reg|extends)\s+([\$\w\.]+)\s*\{([^\{\}]*?)\}/,
            function: /((var|let|function|def)\s+)?([\$\w]*)\s*\(([^\(\)]*)\)[\s\t]*\{([^\{\}]*?)\}/,
            call: /([\$\w]+|\])([\s\t]*\([^\(\)]*?\))\s*([^\$\w\s\{]|[\r\n].)/g
        },
        stringas: any = {
            '/': '_as_pattern___',
            '`': '_as_template___',
            '"': '_as_string___',
            "'": '_as_string___'
        },
        boundaryMaker = (): string => {
            let radix = 36;
            let uid = new Array(36);
            for (let i = 0; i < 36; i++) {
                uid[i] = zero2z[Math.floor(Math.random() * radix)];
            }
            uid[8] = uid[13] = uid[18] = uid[23] = '_';
            return uid.join('');
        },
        stringRepeat = (string: string, number: number): string => {
            return new Array(number + 1).join(string);
        };

    class Sugar {
        uid: string
        input: string
        isMainBlock: boolean = true
        markPattern: RegExp;
        lastPattern: RegExp;
        stringReplaceTimes: number = 65536;
        replacements: string[] = ['{}', '/=', '/']
        imports: string[] = []
        import_alias: object = {}
        ast: any = {}
        output: string | undefined
        constructor(input: string, run: boolean) {
            this.uid = boundaryMaker();
            this.markPattern = new RegExp('___boundary_(\\\d+)_as_(mark|preoperator|operator|aftoperator)___', 'g');
            this.lastPattern = new RegExp('(___boundary_' + this.uid + '_(\\\d+)_as_(string|pattern|template)___|___boundary_(\\\d+)_as_(propname|preoperator|operator|aftoperator)___)', 'g');
            this.input = input;
            this.output = undefined;
            if (run) {
                this.run();
            }
        }
        compile(): Sugar {
            // console.log(this.input);
            this.buildAST(this.getReplacePosis(this.getSentences(this.encode(this.input))));
            // this.output = 'console.log("Hello, world!");';
            this.generate();
            // console.log(this.replacements);
            return this;
        }
        decode(string: string): string {
            let matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
            while (matches) {
                // console.log(matches, this.replacements[matches[2]]);
                string = string.replace(matches[0], this.replacements[matches[2]]);
                matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
            } 
            // console.log(string);
            return string;
        }
        encode(string: string): string {
            string = string.replace(/^\s*"await"\s*/, (match: string) => {
                this.isMainBlock = false;
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

            let left = string.indexOf('[');
            let right = string.indexOf(']');
            while ((left >= 0) || (right >= 0)) {
                // console.log('[]');
                if ((left >= 0) && (left < right)) {
                    string = this.replaceArray(string);
                    left = string.indexOf('[');
                    right = string.indexOf(']');
                } else {
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
                } else {
                    throw 'tangram.js sugar Error: Unexpected `{` or `}`';
                }
            }

            while (string.match(matchExpr.call)) {
                string = this.replaceCalls(string);
            }
            // console.log(string);
            // console.log(this.replacements);
            return string;
        }
        replaceImports(string: string): string {
            return string.replace(replaceExpr.use, (match: string) => {
                let index = this.replacements.length;
                this.replacements.push(match);
                return '___boundary_' + this.uid + '_' + index + '_as_import___';
            });
        }
        replaceStrings(string: string): string {
            string = string.replace(/\\+(`|")/g, (match: string) => {
                let index = this.replacements.length;
                this.replacements.push(match);
                return '___boundary_' + index + '_as_mark___';
            }).replace(/\\[^\r\n]/g, (match: string) => {
                let index = this.replacements.length;
                this.replacements.push(match);
                return '___boundary_' + index + '_as_mark___';
            });

            let count: number = 0;
            let matches: any = string.match(matchExpr.string);

            while ((count < this.stringReplaceTimes) && matches) {
                count++;
                // console.log(count);
                // console.log(matches);
                const index = this.replacements.length;
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
                let match: any = string.match(matchExpr.strings[matches[1]]);
                if (match && (matches.index === match.index) && (!match[2].match(/[\$\w\{]/))) {
                    // console.log(matches, match);
                    this.replacements.push(match[1]);
                    string = string.replace(match[1], '___boundary_' + this.uid + '_' + index + stringas[matches[1]]);
                } else if (matches[0] === '/') {
                    string = string.replace(matches[0], '___boundary_2_as_operator___');
                } else {
                    let index;
                    if (matches.index > 128) {
                        index = matches.index - 128;
                    } else {
                        index = 0;
                    }
                    // console.log(matches.index, match);
                    throw 'tangram.js sugar Error: Unexpected `' + matches[1] + '` in `' + this.decode(string.substr(index, 256)) + '`';
                }
                matches = string.match(matchExpr.string);
            }
            // console.log(string);
            // console.log(this.replacements);
            return this.replaceOperators(string);
        }
        replaceIncludes(string: string): string {
            string = string.replace(replaceExpr.include, (match: string) => {
                return this.onReadFile(match);
            });
            return this.replaceStrings(this.input);
        }
        onReadFile(match: string): string {
            return '';
        }
        replaceOperators(string: string): string {
            // '++ ', '-- ',
            // ' !', ' ~', ' +', ' -', ' ++', ' --',
            // ' ** ', ' * ', ' / ', ' % ', ' + ', ' - ',
            // ' << ', ' >> ', ' >>> ',
            // ' < ', ' <= ', ' > ', ' >= ',
            // ' == ', ' != ', ' === ', ' !== ',
            // ' & ', ' ^ ', ' | ', ' && ', ' || ',
            // ' = ', ' += ', ' -= ', ' *= ', ' /= ', ' %= ', ' <<= ', ' >>= ', ' >>>= ', ' &= ', ' ^= ', ' |= '
            const operators: any = {
                mixed: /([\$\w\)\}\]])\s*(\=\=|\!\=|\=|\!|\+|\-|\*|\/|\%|<<|>>|>>>|\&|\^|\||<|>)=\s*([\$\w\(\{\[])/g,
                bool: /([\$\w\)\}\]])\s*(\&\&|\|\||\<|\<\<|\>\>\>|\>\>|\>)\s*([\$\w\(\{\[])/g,
                op: /([\$\w\)\}\]])\s*(\+|\-|\*\*|\*|\/|\%)\s*([\$\w\(\{\[])/g,
                sign: /\s*(\+|\-)(\.*\d)/g,
                before: /(\+\+|\-\-|\!|\~)\s*([\$\w\(\{\[])/g,
                after: /([\$\w\)\]])\s*(\+\+|\-\-)/g,
                error: /(.*)(\+\+|\-\-|\+|\-)(.*)/g
            }
            let on = true;
            while (on) {
                on = false;
                string = string.replace(operators.mixed, (match: string, left: string, op: string, right: string) => {
                    // console.log(match);
                    on = true;
                    let index = this.replacements.length;
                    this.replacements.push(' ' + op + '= ');
                    return left + '___boundary_' + index + '_as_operator___' + right;
                });
            }

            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.bool, (match: string, left: string, op: string, right: string) => {
                    // console.log(match);
                    on = true;
                    let index = this.replacements.length;
                    this.replacements.push(' ' + op + ' ');
                    return left + '___boundary_' + index + '_as_operator___' + right;
                });
            }

            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.op, (match: string, left: string, op: string, right: string) => {
                    // console.log(match);
                    on = true;
                    let index = this.replacements.length;
                    this.replacements.push(' ' + op + ' ');
                    return left + '___boundary_' + index + '_as_operator___' + right;
                });
            }

            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.sign, (match: string, sign: string, number: string) => {
                    on = true;
                    let index = this.replacements.length;
                    this.replacements.push(' ' + sign);
                    return '___boundary_' + index + '_as_preoperator___' + number;
                });
            }

            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.before, (match: string, op: string, number: string) => {
                    on = true;
                    let index = this.replacements.length;
                    this.replacements.push(op);
                    return '___boundary_' + index + '_as_preoperator___' + number;
                });
            }

            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.after, (match: string, number: string, op: string) => {
                    on = true;
                    let index = this.replacements.length;
                    this.replacements.push(op);
                    return number + '___boundary_' + index + '_as_aftoperator___';
                });
            }
            return string.replace(operators.error, (match: string, before: string, op: string, after: string) => {
                // console.log(this.replacements);
                throw 'tangram.js sugar Error: Unexpected `' + op + '` in `' + match + '`';
            });
        }
        replaceArray(string: string): string {
            return string.replace(replaceExpr.array, (match: string) => {
                let left = match.indexOf('{');
                let right = match.indexOf('}');
                while ((left >= 0) || (right >= 0)) {
                    // console.log('{}');
                    if ((left >= 0) && (left < right)) {
                        match = this.replaceCodeSegments(match);
                        left = match.indexOf('{');
                        right = match.indexOf('}');
                    } else {
                        throw 'tangram.js sugar Error: Unexpected `{` or `}`';
                    }
                }
                let index = this.replacements.length;
                this.replacements.push(match);
                return '___boundary_' + this.uid + '_' + index + '_as_array___';
            });
        }
        replaceCodeSegments(string: string): string {
            if (string.match(matchExpr.class)) {
                return string.replace(replaceExpr.class, (match: string) => {
                    let index = this.replacements.length;
                    this.replacements.push(match);
                    return '___boundary_' + this.uid + '_' + index + '_as_class___';
                });
            }

            if (string.match(matchExpr.define)) {
                return string.replace(replaceExpr.define, (match: string) => {
                    var index = this.replacements.length;
                    this.replacements.push(match);
                    return '___boundary_' + this.uid + '_' + index + '_as_define___';
                });
            }

            if (string.match(matchExpr.function)) {
                return string.replace(replaceExpr.function, (match: string) => {
                    while (match.match(matchExpr.call)) {
                        match = this.replaceCalls(match);
                    }
                    let index = this.replacements.length;
                    this.replacements.push(match);
                    return '___boundary_' + this.uid + '_' + index + '_as_function___';
                });
            }

            return string.replace(replaceExpr.closure, (match: string, word: string, closure: string) => {
                // console.log(match);

                if (!word && match.match(/\{\s*\}/)) {
                    return '___boundary_0_as_mark___';
                }
                let index = this.replacements.length;
                if (word === 'return') {
                    this.replacements.push(match.replace(/^return[\s\t]*/, ''));
                    return 'return ' + '___boundary_' + this.uid + '_' + index + '_as_object___';
                }
                if ((match.indexOf(';') >= 0) || (word && (word != 'return'))) {
                    while (closure.match(matchExpr.call)) {
                        closure = this.replaceCalls(closure);
                    }
                    let index = this.replacements.length;
                    this.replacements.push(closure);
                    return (word || '') + '___boundary_' + this.uid + '_' + index + '_as_closure___';
                }
                this.replacements.push(match);
                return '___boundary_' + this.uid + '_' + index + '_as_object___';
            });
        }
        replaceCalls(string: string): string {
            return string.replace(replaceExpr.call, (match: string, callname, args, after) => {
                // console.log(match);
                let index = this.replacements.length;
                this.replacements.push(callname + args);
                return '___boundary_' + this.uid + '_' + index + '_as_call___' + after;
            });
        }
        getSentences(string: string, isFnBody: boolean = false): object[] {
            const array: string[] = string.split(/\s*;+\s*/);
            let lines: object[] = [];
            // console.log(array);
            for (let index = 0; index < array.length; index++) {
                const sentence = array[index].trim();
                if (sentence) {
                    if(index){
                        lines.push({
                            type: 'line',
                            stype: 'newline',
                            value: ''
                        });
                    }
                    const sublines = sentence.split(/(^|[^,\s][\r\n]|[^,]\s+[\r\n])\s*(var|let)\s+/);
                    // console.log(sublines);
                    for (let i = 0; i < sublines.length; i++) {
                        const element = sublines[i];
                        // console.log(element);
                        if (element === 'var') {
                            this.pushVariables(lines, sublines[++i] + (sublines[++i] || ''), isFnBody);
                        } else {
                            if (element.match(/(|[^,\s][\r\n])\s*(var)\s+/)){                        
                                throw 'tangram.js sugar Error: Unexpected Variable definition `' + this.decode(element) + '`' + (isFnBody ? ' in `' + this.decode(string) + '`' : '');   
                            }else{
                                // console.log(element);
                                this.pushLines(lines, element + (sublines[++i] || ''));
                            }
                        }
                    }
                }
            }
            // console.log(lines);
            return lines;
        }
        pushVariables(lines, string: string, isFnBody: boolean = false) {
            // console.log(string);
            const array: string[] = string.split(/\s*,\s*/);
            // console.log(array);
            for (let index = 0; index < array.length; index++) {
                const element = array[index].trim();;
                if (element) {
                    let array: string[] = element.split(/\s*[\r\n]+\s*/);
                    if (array.length) {
                        for (let index = 0; index < array.length; index++) {
                            const line = array[index];
                            if (index) {
                                lines.push({
                                    type: 'line',
                                    value: line + ';'
                                });
                            } else {
                                if (line.match(/^[\$\w]+\s*(=|$)/)) {
                                    lines.push({
                                        type: 'line',
                                        value: 'var ' + line + ';'
                                    });
                                } else {
                                    console.log(array);
                                    throw 'tangram.js sugar Error: Unexpected Variable definition `var ' + this.decode(line) + '`' + (isFnBody ? ' in `' + this.decode(string) + '`' : '');
                                }
                            }
                        }
                    } else {
                        if (element.match(/^[\$\w]\s*(=.+|\s*)$/)) {
                            lines.push({
                                type: 'line',
                                value: 'var ' + element + ';'
                            });
                        } else {
                            throw 'tangram.js sugar Error: Unexpected Variable definition `var ' + this.decode(element) + '`' + '`' + (isFnBody ? ' in `' + this.decode(string) + '`' : '');
                        }
                    }
                }
            }
        }
        pushLines(lines, string: string) {
            const array: string[] = string.split(/\s*[\r\n]+\s*/);
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                // console.log(element);
                if (element.match(/g/)) {
                    lines.push({
                        type: 'line',
                        value: element
                    });
                } else if (element.match(/___boundary_[A-Z0-9_]{36}_\d+_as_function___/)) {
                    lines.push({
                        type: 'line',
                        value: element
                    });
                } else if (element) {
                    lines.push({
                        type: 'line',
                        value: element + ';'
                    });
                }
            }
        }
        getReplacePosis(lines: any[]): object[] {
            let imports: string[] = [],
                import_alias: any = {},
                midast: object[] = [];

            for (let index = 0; index < lines.length; index++) {
                // console.log(lines[index]);
                const line = lines[index].value.trim();
                if (line) {
                    let inline = [];
                    const array: string[] = line.split('___boundary_' + this.uid);
                    // console.log(array)
                    for (let index = 0; index < array.length; index++) {
                        let element = array[index].trim();
                        if (element) {
                            let matches: any = element.match(matchExpr.index3);
                            if (matches) {
                                if (matches[2] === 'import') {
                                    let src = this.replacements[matches[1]].replace(replaceExpr.import, '').replace(replaceExpr.return, '');
                                    imports.push(src);
                                    let srcArr = src.split(/\s+as\s+/);
                                    if (srcArr[1] && srcArr[1].trim()) {
                                        import_alias[srcArr[1].trim()] = srcArr[0].trim();
                                    }
                                } else {
                                    inline.push({
                                        posi: matches[1],
                                        type: matches[2]
                                    });
                                }
                                let match_3: string = matches[3].trim()
                                if (match_3) {
                                    inline.push({
                                        type: 'code',
                                        value: match_3
                                    });
                                }
                            } else {
                                inline.push({
                                    type: 'code',
                                    value: element
                                });
                            }
                        }
                    }
                    midast.push(inline);
                }else{
                    // console.log(lines[index].stype);
                    if (lines[index].stype==='newline'){
                        midast.push([{
                            type: 'code',
                            stype: 'newline'
                        }]);
                    }
                }
            }
            this.imports = imports;
            this.import_alias = import_alias;
            // console.log(imports, midast);
            return midast;
        }
        buildAST(midast: object[]): Sugar {
            let ast = {
                type: 'codes',
                body: new Array
            };
            for (let index = 0; index < midast.length; index++) {
                let block: any = midast[index];
                if (block.length === 1) {
                    const element = block[0];
                    if (element.type === 'code') {
                        // this.pushCodeElements(ast.body, element.value);
                        ast.body.push(element);
                    } else {
                        // console.log(element);
                        ast.body.push(this.walk(element, false));
                    }
                } else {
                    let codes = {
                        type: 'codes',
                        body: new Array
                    };
                    for (let index = 0; index < block.length; index++) {
                        const element = block[index];
                        if (element.type === 'code') {
                            element.stype = index ? 'inline' : 'block';
                            codes.body.push(element);
                        } else {
                            codes.body.push(this.walk(element, !!index));
                        }
                    }
                    ast.body.push(codes);
                }
            }
            // console.log(ast, this.replacements);
            this.ast = ast;
            return this;
        }
        walk(element: any, codeInline: boolean): object {
            switch (element.type) {
                case 'string':
                case 'pattern':
                case 'template':
                    let that = this;
                    return {
                        type: 'code',
                        stype: codeInline ? 'inline' : 'block',
                        value: this.replacements[element.posi].replace(this.markPattern, function () {
                            return that.replacements[arguments[1]];
                        })
                    }

                case 'class':
                    return this.walkClass(element.posi, codeInline);

                case 'define':
                    return this.walkDefine(element.posi, codeInline);

                case 'function':
                    return this.walkFuntion(element.posi, 'def', codeInline);

                case 'call':
                    return this.walkCall(element.posi, codeInline);

                case 'array':
                    return this.walkArray(element.posi, codeInline);

                case 'object':
                    return this.walkObject(element.posi, codeInline);

                case 'closure':
                    return this.walkClosure(element.posi);

                default:
                    return {
                        type: 'code',
                        stype: codeInline ? 'inline' : 'block',
                        value: '// Unidentified Code'
                    }
            }
        }
        walkClass(posi: number, codeInline: boolean = true) {
            // console.log(this.replacements[posi]);
            let matches: any = this.replacements[posi].match(matchExpr.class);
            // console.log(matches);
            return {
                type: matches[1] ? 'stdClass' : 'anonClass',
                stype: codeInline ? 'inline' : 'block',
                cname: matches[3],
                base: matches[5],
                body: this.checkClassBody(matches[6] || '')
            }
        }
        walkDefine(posi: number, codeInline: boolean) {
            // console.log(this.replacements[posi]);
            let matches: any = this.replacements[posi].match(matchExpr.define);
            let subtype: string = 'ext';
            let objname: string = matches[2];

            if (matches[1] === 'reg') {
                subtype = 'reg';
            } else {
                let match_2 = matches[2].match(/^(pandora)?.([\$a-zA-Z_][\$\w\.]+$)/);
                // console.log(matches[2], match_2);
                if (match_2) {
                    subtype = 'reg';
                    objname = match_2[2];
                }
            }
            // console.log(matches);
            return {
                type: 'define',
                stype: codeInline ? 'inline' : 'block',
                subtype: subtype,
                oname: objname,
                body: this.checkProp(matches[3])
            }
        }
        walkFuntion(posi: number, type: string, codeInline: boolean) {
            // console.log(this.replacements[posi]);
            let matches: any = this.replacements[posi].match(matchExpr.function);
            // if (!matches) {
            //     console.log(posi, this.replacements);
            // } else {
            //     console.log((matches);
            // }

            if (matches[1] == null && type === 'def') {
                if (reservedWords['includes'](matches[3])) {
                    // console.log(matches);
                    return {
                        type: 'exp',
                        expression: matches[3],
                        head: this.pushLineToBody([], matches[4], true),
                        body: this.pushToBody([], matches[5])
                    };
                }
                if (matches[3] === 'each') {
                    let match_4 = matches[4].match(/^([\$a-zA-Z_][\$\w\.-]+)\s+as\s+([\$\w]+)(\s*,\s*([\$\w]*))?/);
                    // console.log(matches, match_3);
                    if (match_4) {
                        let iterator = [], array = match_4[1].split('___boundary_' + this.uid);
                        for (let index = 0; index < array.length; index++) {
                            this.pushReplacements(iterator, array[index], true);
                        }
                        let agrs: string[] = [];
                        if (match_4[3]) {
                            if (match_4[4]) {
                                agrs = [match_4[2], match_4[4]];
                            } else {
                                agrs = [match_4[2]];
                            }
                        } else {
                            agrs = ['_index', match_4[2]];
                        }
                        return {
                            type: 'travel',
                            iterator: iterator,
                            callback: {
                                type: 'def',
                                stype: 'inline',
                                fname: '',
                                args: agrs,
                                body: this.pushToBody([], matches[5])
                            }
                        }
                    }
                }
            }
            // console.log(this.replacements[posi], type, matches);
            let args: any = this.checkArgs(matches[4]);
            // if (posi == 98) {
            // console.log(matches[4]);
            // }
            return {
                type: type,
                stype: codeInline ? 'inline' : 'block',
                subtype: (matches[2] && ((matches[2] === 'var') || (matches[2] === 'let') )&&!codeInline) ? 'var' : 'fn',
                fname: matches[3] !== 'function' ? matches[3] : '',
                args: args.keys,
                defaults: args.vals,
                body: this.checkFnBody(args, matches[5])
            }
            // console.log(matches);
        }
        walkCall(posi: number, codeInline: boolean): object {
            let name = [],
                params = [],
                array = this.replacements[posi].split(/([\(\r\n,\)])/);
                // console.log(array);
            let last:string = '';
            for (let index = 0; index < array.length; index++) {
                const element = array[index].trim();
                let line: string[] = element.split('___boundary_' + this.uid);
                if (index) {
                    if (element && element != '(' && element != ')' && element != ',') {
                        let inline: object[] = [];
                        for (let i = 0; i < line.length; i++) {
                            this.pushReplacements(inline, line[i], true);
                        }
                        // console.log(last, last === "\r", last === "\n");
                        params.push({
                            type: 'parameter',
                            stype: (last === "\n" || last === "\r") ? 'block' : 'inline',
                            body: inline
                        });
                    }
                } else {
                    let inline: object[] = [];
                    for (let i = 0; i < line.length; i++) {
                        const element = line[i].trim();
                        if (element) {
                            this.pushReplacements(name, line[i], true);
                        }
                    }
                }
                last = array[index];
            }
            return {
                type: 'call',
                stype: codeInline ? 'inline' : 'block',
                name: name,
                params: params
            };
        }
        walkArray(posi: number, codeInline: boolean): object {
            let body = [],
                array = this.replacements[posi].replace(/([\[\s\]])/g, '').split(',');
            for (let index = 0; index < array.length; index++) {
                let line = array[index].split('___boundary_' + this.uid);
                let inline: object[] = [];
                for (let i = 0; i < line.length; i++) {
                    this.pushReplacements(inline, line[i], true);
                }
                body.push({
                    type: 'element',
                    body: inline
                });
            }
            return {
                type: 'array',
                stype: codeInline ? 'inline' : 'block',
                body: body
            };
        }
        walkObject(posi: number, codeInline: boolean = true) {
            return {
                type: 'object',
                body: this.checkProp(this.replacements[posi])
            };
        }
        walkClosure(posi: number) {
            // console.log(this.replacements[posi]);
            let array = this.replacements[posi].split(/\s*(\{|\})\s*/);
            let body = this.pushToBody([], array[2]);
            // console.log(array);
            body.unshift({
                type: 'code',
                stype: 'inline',
                value: array[0] + ' {'
            });
            // if (array[0].trim() === ')') {
            //     body.unshift({
            //         type: 'code',
            //         stype: 'inline',
            //         value: ') {'
            //     });
            // } else {
            //     body.unshift({
            //         type: 'code',
            //         stype: 'break',
            //         value: array[0] + ' {'
            //     });
            // }
            body.push({
                type: 'code',
                stype: 'closer',
                value: '}'
            });

            return {
                type: 'codes',
                stype: 'local',
                body: body
            }
        }
        walkProp(type: string, attr: string[], array: string[]): object {
            // console.log(array);
            if (array.length > 1) {
                let body = [];
                if (attr[5]) {
                    body.push({
                        type: 'code',
                        stype: 'inline',
                        value: attr[5]
                    });
                }
                for (let index = 1; index < array.length; index++) {
                    const element = array[index];
                    const matches: any = element.trim().match(matchExpr.index3);
                    if (matches) {
                        body.push(this.walk({
                            posi: matches[1],
                            type: matches[2]
                        }, true));
                        if (matches[3]) {
                            body.push({
                                type: 'code',
                                stype: 'inline',
                                value: matches[3]
                            });
                        }
                    } else {
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
        }
        checkClassBody(code: string): object[] {
            let body = [],
                array = code.split(/[;,\r\n]+/);
            for (let index = 0; index < array.length; index++) {
                let element = array[index].trim();
                let type: string = 'method';
                // console.log(element);
                if (element) {
                    let elArr = element.split('___boundary_' + this.uid);

                    if (elArr[0] && elArr[0].trim()) {
                        let m0 = elArr[0].match(matchExpr.classelement);
                        if (m0) {
                            // console.log(m0);
                            if (m0[3].trim()) {
                                if (m0[1]) {
                                    type = 'staticProp';
                                } else {
                                    type = 'prop';
                                }
                                if (m0[4] != '=') {
                                    if ((elArr.length === 1)) {
                                        m0[5] = 'undefined';
                                    } else {
                                        continue;
                                    }
                                }
                                body.push(this.walkProp(type, m0, elArr));
                                continue;
                            } else {
                                if (m0[1]) {
                                    m0[3] = 'static';
                                    if (m0[4] === '=') {
                                        body.push(this.walkProp('prop', m0, elArr));
                                        continue;
                                    } else {
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
                        let m1: any = elArr[1].trim().match(matchExpr.index);
                        if (m1[2] === 'function') {
                            body.push(this.walkFuntion(parseInt(m1[1]), type, true));
                        }
                    }
                }
            }
            return body;
        }
        checkProp(code: string): object[] {
            let that = this, body = [],
                bodyIndex = -1,
                lastIndex: number = 0,
                array = code.split(/\s*[\{,\}]\s*/);
            // console.log(code, array);
            for (let index = 0; index < array.length; index++) {
                let element = array[index].trim();
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
                        } else {
                            // console.log(elArr);
                        }
                    } else {
                        // console.log(elArr);
                        for (let i = 1; i < elArr.length; i++) {
                            const m = elArr[i].trim().match(matchExpr.index3);
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
                                        body.push(this.walkFuntion(parseInt(m[1]), 'method', true));
                                        bodyIndex++;
                                    }
                                    break;
                            }
                        }
                    }
                }
            }
            return body;
        }
        checkFnBody(args: any, code: string): object[] {
            code = code.trim()
            // console.log(code);
            let body = [];
            // console.log(args, lines);
            for (let index = 0; index < args.vals.length; index++) {
                if (args.vals[index] !== undefined) {
                    let valArr = args.vals[index].split('___boundary_' + this.uid);
                    if (valArr[1]) {
                        body.push({
                            type: 'code',
                            stype: 'block',
                            value: 'if (' + args.keys[index] + ' === void 0) { ' + args.keys[index] + ' = ' + valArr[0]
                        });
                        this.pushReplacements(body, valArr[1], true);
                        body.push({
                            type: 'code',
                            stype: 'inline',
                            value: '; }'
                        });
                    } else {
                        body.push({
                            type: 'code',
                            value: 'if (' + args.keys[index] + ' === void 0) { ' + args.keys[index] + ' = ' + valArr[0] + '; }'
                        });
                    }
                }
            }
            // console.log(code);
            this.pushToBody(body, code);
            return body;
        }
        pushToBody(body: object[] = [], code: string): object[] {
            let lines: any = code ? this.getSentences(code, true) : [];
            // console.log(lines);
            for (let index = 0; index < lines.length; index++) {
                const line = lines[index].value.trim();
                this.pushLineToBody(body, line, [',',';']['includes'](line))
            }
            return body;
        }
        pushLineToBody(body: object[] = [], line: string, lineInLine:boolean): object[] {
            if (line) {
                let inline = [];
                const array: string[] = line.split('___boundary_' + this.uid);
                // console.log(array);
                if (!array[0].trim()){
                    array.shift();
                }
                for (let index = 0; index < array.length; index++) {
                    // console.log(index, array[index]);
                    this.pushReplacements(inline, array[index], !!index||lineInLine);
                }
                if (inline.length === 1) {
                    body.push(inline[0]);
                } else {
                    body.push({
                        type: 'codes',
                        body: inline
                    });
                }

            }
            return body;
        }
        checkArgs(code: string): object {
            let args = code.split(/\s*,\s*/),
                keys = [],
                vals = [];
            for (let index = 0; index < args.length; index++) {
                let array = args[index].split(/\s*=\s*/);
                if (array[0].match(namingExpr)) {
                    keys.push(array[0]);
                    vals.push(array[1]);
                }
            }
            return {
                keys: keys,
                vals: vals
            }
        }
        pushReplacements(body: object[], code: string, codeInline: boolean): object[] {
            // console.log(code, codeInline);
            code = code.trim();
            if (code) {
                let matches: any = code.match(matchExpr.index3);
                if (matches) {
                    body.push(this.walk({
                        posi: matches[1],
                        type: matches[2]
                    }, codeInline));
                    let match_3 = matches[3].trim();
                    if (match_3) {
                        this.pushCodeElements(body, match_3, true);
                    }
                    // if (matches[1]==94) {
                    // console.log(body);
                    // }
                } else {
                    // console.log(code, codeInline);
                    this.pushCodeElements(body, code, codeInline);
                }
            }
            return body;
        }
        pushCodeElements(body: object[], code: string, codeInline: boolean): object[] {
            let array = code.split(/(\s*[;\r\n]+)\s*/);
            // console.log(array);
            for (let index = 0; index < array.length; index++) {
                let element = array[index].trim();
                if (element) {
                    body.push({
                        type: 'code',
                        stype: (codeInline && !index) ? 'inline' : (element === ';' ? 'inline' : 'block'),
                        value: element
                    });
                }
            }
            return body;
        }
        generate(): Sugar {
            // console.log(this.replacements);
            console.log(this.ast.body);
            let head: string[] = [];
            let body: string[] = [];
            let foot: string[] = [];
            this.pushHeader(head, this.imports);
            this.pushAlias(body, this.import_alias);
            this.pushCodes(body, this.ast.body, 1);
            this.pushFooter(foot);
            this.output = head.join('') + this.trim(body.join('')) + foot.join('');
            console.log(this.output);
            return this;
        }
        pushHeader(codes: string[], array: any[]): string[] {
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
        }
        pushAlias(codes: string[], alias: any): string[] {
            for (const key in alias) {
                codes.push("\r\n\tvar " + key);
                codes.push("=imports['" + alias[key]);
                codes.push("']&&imports['" + alias[key]);
                codes.push("'][0];");
            }
            return codes;
        }
        pushCodes(codes: string[], array: any[], layer: number, asAttr: boolean = false): string[] {
            let indent = "\r\n" + stringRepeat("\t", layer);
            // console.log(codes, array);
            // console.log(array);
            // console.log(layer, array);
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                // console.log(element);
                switch (element.type) {
                    case 'code': 
                    // console.log(element);
                        switch (element.stype){
                            case 'break':
                            case 'closer':
                                codes.push(indent.replace("\t", '') + element.value);
                                break;
                            case 'inline':
                                codes.push(element.value);
                                break;
                            case 'newline':
                                codes.push(indent);
                                break;
                            default:
                                codes.push(indent + element.value);
                                break;
                        }
                        break;
                    case 'anonClass':
                    case 'stdClass':
                        this.pushClassCodes(codes, element, layer);
                        break;
                    case 'call':
                        // console.log(layer);
                        this.pushCallCodes(codes, element, layer);
                        break;
                    case 'array':
                        this.pushArrayCodes(codes, element, layer, asAttr);
                        break;
                    case 'codes':
                        // console.log(element);
                        this.pushCodes(codes, element.body, layer + ((element.stype === 'local') ? 1 : 0));
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
        }
        pushClassCodes(codes: string[], element: any, layer: number): string[] {
            let indent1 = "\r\n" + stringRepeat("\t", layer);
            let indent2 = "\r\n" + stringRepeat("\t", layer + 1);
            let elements: string[] = [];
            let static_elements: string[] = [];
            let cname: string = '';
            if (element.type === 'stdClass') {
                cname = 'pandora.' + element.cname.trim();
                codes.push(indent1 + 'pandora.declareClass(\'' + element.cname.trim() + '\', ');
            } else {
                if (element.cname && element.cname.trim()) {
                    cname = element.cname.trim();
                    if (cname.match(/^[\$\w]+$/)) {
                        codes.push(indent1 + 'var ' + cname + ' = pandora.declareClass(');
                    } else {
                        codes.push(indent1 + cname + ' = pandora.declareClass(');
                    }
                } else {
                    codes.push('pandora.declareClass(');
                }
            }
            if (element.base) {
                codes.push(element.base.trim() + ', ');
            }
            codes.push('{');
            // console.log(element);
            for (let index = 0; index < element.body.length; index++) {
                const member = element.body[index];
                let elem: string[] = [];
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
            // console.log(elements, static_elements);
            codes.push(elements.join(','));
            codes.push(indent1 + '})');
            if (cname) {
                if (static_elements.length) {
                    codes.push(';' + indent1 + 'pandora.extend(' + cname + ', {');
                    codes.push(static_elements.join(','));
                    codes.push(indent1 + '});');
                } else {
                    codes.push(';');
                }
            }
            return codes;
        }
        pushCallCodes(codes: string[], element: any, layer: number): string[] {
            let naming: string[] = this.pushCodes([], element.name, layer, true);
            // console.log(naming);
            // console.log(element);
            if (element.stype === 'block') {
                // console.log(naming.join(''), layer);
                let indent = "\r\n" + stringRepeat("\t", layer);
                codes.push(indent);
            }
            codes.push(naming.join(''));
            codes.push('(');

            let parameters: string[] = [];
            if (element.params.length){
                let _layer = layer;
                let indent2;
                let _break = false;
                // console.log(element.params[0]);
                if (element.params[0].stype=="block"){
                    _layer++;
                    indent2 = "\r\n" + stringRepeat("\t", _layer);
                    codes.push(indent2);
                    _break = true;
                }
                for (let index = 0; index < element.params.length; index++) {
                    const param = element.params[index].body;
                    let paramCodes: string[] = this.pushCodes([], param, _layer, true);
                    if (paramCodes.length) {
                        parameters.push(paramCodes.join('').trim());
                    }
                }
                // console.log(parameters);
                if (_break){
                    codes.push(parameters.join(',' + indent2));
                }else{
                    codes.push(parameters.join(', '));
                }
            }
            codes.push(')');
            // console.log(codes);
            return codes;
        }
        pushArrayCodes(codes: string[], element: any, layer: number, asAttr: boolean): string[] {
            let elements: string[] = [];
            codes.push('[');
            if (element.body.length) {
                let _layer = layer;
                let indent2;
                let _break = false;
                // console.log(element.params[0]);
                if (element.body[0].stype == "block") {
                    _layer++;
                    indent2 = "\r\n" + stringRepeat("\t", _layer);
                    codes.push(indent2);
                    _break = true;
                }
                for (let index = 0; index < element.body.length; index++) {
                    const body = element.body[index].body;
                    let elemCodes: string[] = this.pushCodes([], body, _layer, true);
                    // let elem:string[] = this.pushCodes([], body, layer + 1);
                    if (elemCodes.length){
                        elements.push(elemCodes.join('').trim());
                    }
                    
                }
                if (_break) {
                    codes.push(elements.join(',' + indent2));
                } else {
                    codes.push(elements.join(', '));
                }
            }
            codes.push(']');
            // if (asAttr) {
            //     codes.push(']');
            // } else {
            //     codes.push('];');
            // }
            return codes;
        }
        pushTravelCodes(codes: string[], element: any, layer: number): string[] {
            let indent = "\r\n" + stringRepeat("\t", layer);
            // console.log(element);
            codes.push(indent + 'pandora.each(');
            this.pushCodes(codes, element.iterator, layer);
            codes.push(', ');
            this.pushFunctionCodes(codes, element.callback, layer);
            codes.push(', this);');
            codes.push(indent);
            return codes;
        }
        pushFunctionCodes(codes: string[], element: any, layer: number): string[] {
            let indent = "\r\n" + stringRepeat("\t", layer);
            if (element.type === 'def' && element.fname) {
                if (element.subtype === 'var') {
                    codes.push(indent + 'var ' + element.fname + ' = function (');
                } else {
                    codes.push(indent + 'function ' + element.fname + ' (');
                }
            } else {
                codes.push('function (');
            }

            if (element.args.length) {
                codes.push(element.args.join(', '));
            }

            codes.push(') {');
            // console.log(element.body);
            if (element.body.length){
                this.pushCodes(codes, element.body, layer + 1);
            }else{
                indent = '';
            }
            codes.push(indent + '}');

            // if (element.type === 'def' && !element.fname) {
            //     codes.push(indent + '};');
            // } else if (element.stype === 'var') {
            //     codes.push(indent + '};');
            // } else {
                
            // }
            return codes;
        }
        pushExpressionCodes(codes: string[], element: any, layer: number): string[] {
            let indent = "\r\n" + stringRepeat("\t", layer);
            codes.push(indent + element.expression + ' (');
            // console.log(element.head);
            this.pushCodes(codes, element.head, layer);
            codes.push(') {');
            // console.log(element.body);
            this.pushCodes(codes, element.body, layer + 1);
            codes.push(indent + '}');
            return codes;
        }
        pushDefineCodes(codes: string[], element: any, layer: number): string[] {
            let indent = "\r\n" + stringRepeat("\t", layer);
            if (element.subtype === 'reg') {
                codes.push(indent + 'pandora(\'' + element.oname.trim() + '\', ');
            } else {
                codes.push(indent + 'pandora.extend(' + element.oname + ', ');
            }
            this.pushObjCodes(codes, element, layer);
            codes.push(');');
            return codes;
        }
        pushObjCodes(codes: string[], element: any, layer: number) {
            let indent1 = "\r\n" + stringRepeat("\t", layer);
            let indent2 = "\r\n" + stringRepeat("\t", layer + 1);
            let elements: string[] = [];
            codes.push('{');
            // console.log(element);
            for (let index = 0; index < element.body.length; index++) {
                const member = element.body[index];
                let elem: string[] = [];
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
        }
        pushFooter(codes: string[]): string[] {
            if (this.isMainBlock) {
                codes.push("\r\n" + '}, true);');
            } else {
                codes.push("\r\n" + '});');
            }
            return codes;
        }
        trim(string: string): string {
            // 此处的replace在整理完成后，将进行分析归纳，最后改写为callback形式的
            // console.log(string);
            string = this.restoreStrings(string);
            this.replacements = ['{}', '/=', '/'];
            string = this.replaceStrings(string);
            // console.log(string);
            // return '';
            // // 关键字处理
            // string = string.replace(/function\s+function\s+/g, 'function ');

            //去除多余符号
            string = string.replace(/\s*;+/g, "; ");

            // 删除多余换行
            string = string.replace(/(,|;)[\r\n]+/g, "$1\r\n");
            string = this.restoreStrings(string);
            return string;
            
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
        }
        restoreStrings(string: string): string {

            let that = this;
            return string.replace(this.lastPattern, function () {
                // console.log(arguments[1]);
                return that.replacements[arguments[2] || arguments[4]];
            }).replace(this.markPattern, function () {
                return that.replacements[arguments[1]];
            });
        }
        run() {
            if (!this.output) {
                this.compile();
            }
            eval(this.output);
        }
    }

    return function (input, run) {
        return new Sugar(input, run);
    };

}));