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
        reservedWords = ['if', 'for', 'while', 'switch'],
        replaceExpr = {
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
        },
        matchExpr = {
            index: /(\d+)_as_([a-z]+)/,
            index3: /^_(\d+)_as_([a-z]+)___([\s\S]*)$/,
            class: /class\s+((pandora)?\.)?([\$\w\.]+\s+)?(extends\s+([\$\w\.]+)\s*)?\{([^\{\}]*?)\}/,
            classelement: /^\s*(static\s+)?([\$\w]*)\s*(\=*)([\s\S]*)$/,
            objectattr: /^\s*(([\$\w]+))\s*(\:*)([\s\S]*)$/,
            defind: /(reg|extends)\s+([\$\w\.]+)\s*\{([^\{\}]*?)\}/,
            function: /(var\s+)?([\$\w]*)\s*\(([^\(\)]*)\)[\s\r\n\t]*\{([^\{\}]*?)\}/,
            localcode: /([\$\w]+|\))[\s\r\n\t]*\{[^\{\}]*?\}/,
            object: /\{[^\{\}]*?\}/
        },
        boundaryMaker = (): string => {
            let radix = 36;
            let uid = new Array(36);
            for (let i = 0; i < 36; i++) {
                uid[i] = zero2z[Math.floor(Math.random() * radix)];
            }
            uid[8] = uid[13] = uid[18] = uid[23] = '-';
            return uid.join('');
        },
        stringRepeat = (string: string, number: number): string => {
            return new Array(number + 1).join(string);
        };

    class Sugar {
        uid: string
        input: string
        isMainBlock: boolean = true
        replacements: string[] = ['\\"', '\\\'']
        imports: string[] = []
        import_alias: object = {}
        ast: any = {}
        output: string | undefined
        constructor(input: string, run: boolean) {
            this.uid = boundaryMaker();
            this.input = input;
            this.output = undefined;
            if (run) {
                this.run();
            }
        }
        compile(): Sugar {
            this.buildAST(this.buildMiddleAST(this.encode()));
            this.generate();
            // console.log(this.replacements);
            return this;
        }
        encode(): string {
            // console.log(this.input);
            let string = this.input.replace(/^[\s\r\n]*"await"[\s\r\n]*/, (match: string) => {
                this.isMainBlock = false;
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
        }
        replaceStrings(string: string): string {
            string = string.replace(/\s*\/\/.+/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace('\\"', this.uid + '_0=mark;').replace('\\\'', this.uid + '_1=mark;');
            // console.log(string:string);

            let matches: any = string.match(/('|")/);
            // console.log(match);
            while (matches) {
                if (matches[0] === '"') {
                    string = this.replaceDoubleQuotationMark(string);
                } else {
                    string = this.replaceSingleQuotationMark(string);
                }
                matches = string.match(/('|")/);
            }
            return string;
        }
        replaceSingleQuotationMark(string: string): string {
            return string.replace(/'[^']*'/, (match: string) => {
                let index = this.replacements.length;
                this.replacements.push(match);
                return this.uid + '_' + index + '_as_string___';
            });
        }
        replaceDoubleQuotationMark(string: string): string {
            return string.replace(/"[^"]*"/, (match: string) => {
                let index = this.replacements.length;
                this.replacements.push(match);
                return this.uid + '_' + index + '_as_string___';
            });
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
        replaceImports(string: string): string {
            return string.replace(replaceExpr.use, (match: string) => {
                let index = this.replacements.length;
                this.replacements.push(match);
                return this.uid + '_' + index + '_as_import___';
            });
        }
        replaceArray(string: string): string {
            return string.replace(replaceExpr.array, (match: string) => {
                while (match.indexOf('{') >= 0) {
                    match = this.replaceCodeSegments(match);
                }
                let index = this.replacements.length;
                this.replacements.push(match);
                return this.uid + '_' + index + '_as_array___';
            });
        }
        replaceCodeSegments(string: string): string {
            if (string.match(matchExpr.class)) {
                return string.replace(replaceExpr.class, (match: string) => {
                    let index = this.replacements.length;
                    this.replacements.push(match);
                    return this.uid + '_' + index + '_as_class___';
                })
            }

            if (string.match(matchExpr.defind)) {
                return string.replace(replaceExpr.defind, (match: string) => {
                    var index = this.replacements.length;
                    this.replacements.push(match);
                    return this.uid + '_' + index + '_as_defind___';
                });
            }

            if (string.match(matchExpr.function)) {
                return string.replace(replaceExpr.function, (match: string) => {
                    let index = this.replacements.length;
                    this.replacements.push(match);
                    return this.uid + '_' + index + '_as_function___';
                })
            }

            let matches: any = string.match(matchExpr.localcode);
            if (matches) {
                return string.replace(replaceExpr.localcode, (match: string) => {
                    let index = this.replacements.length;
                    if (matches[1] === 'return') {
                        this.replacements.push(match.replace(/^return[\s\r\n\t]*/, ''));
                        return matches[1] + ' ' + this.uid + '_' + index + '_as_object___';
                    }
                    this.replacements.push(match);
                    return this.uid + '_' + index + '_as_localcode___';
                })
            }

            if (string.match(matchExpr.object)) {
                return string.replace(replaceExpr.object, (match: string) => {
                    let index = this.replacements.length;
                    this.replacements.push(match);
                    return this.uid + '_' + index + '_as_object___';
                })
            }
            return string;
        }
        buildMiddleAST(string: string): object[] {
            let imports: string[] = [],
                import_alias: any = {},
                midast: object[] = [],
                array: string[] = string.split(this.uid);
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
                            midast.push({
                                posi: matches[1],
                                type: matches[2]
                            });
                        }
                        let m3: string = matches[3].trim()
                        if (m3) {
                            midast.push({
                                type: 'code',
                                value: m3
                            });
                        }
                    } else {
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
        }
        buildAST(midast: object[]): Sugar {
            let ast = {
                type: 'codes',
                body: new Array
            };
            for (let index = 0; index < midast.length; index++) {
                let element: any = midast[index];
                if (element.type === 'code') {
                    this.pushCodeElements(ast.body, element.value);
                    // ast.body.push(element);
                } else {
                    ast.body.push(this.walk(element));
                }
            }
            this.ast = ast;
            return this;
            // console.log(ast, this.replacements);
        }
        walk(element: any): object {
            switch (element.type) {
                case 'string':
                    return {
                        'type': 'code-inline',
                        'value': this.replacements[element.posi].replace(this.uid + '_0=mark;', '\\"').replace(this.uid + '_1=mark;', '\\\'')
                    }

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
                    }
            }
        }
        walkClass(posi: number) {
            // console.log(this.replacements[posi]);
            let matches: any = this.replacements[posi].match(matchExpr.class);
            // console.log(matches);
            // let clasjs = /class\s+((pandora)?\.)?([\$\w\.]+\s+)?(extends\s+([\$\w\.]+)\s*)?\{([^\{\}]*?)\}/g;
            return {
                type: matches[1] ? 'stdClass' : 'anonClass',
                cname: matches[3],
                base: matches[5],
                body: this.checkClassBody(matches[6] || '')
            }
        }
        walkDefine(posi: number) {
            // console.log(this.replacements[posi]);
            let matches: any = this.replacements[posi].match(matchExpr.defind);
            let subtype: string = 'ext';
            let objname: string = matches[2];

            if (matches[1] === 'reg') {
                subtype = 'reg';
            } else {
                let m2 = matches[2].match(/^(pandora)?.([\$a-zA-Z_][\$\w\.]+$)/);
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
            }
        }
        walkFuntion(posi: number, type: string) {
            // console.log(this.replacements[posi]);
            let matches: any = this.replacements[posi].match(matchExpr.function);
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
                    let m3 = matches[3].match(/^([\$a-zA-Z_][\$\w\.-]+)\s+as\s+([\$\w]+,)?\s*([\$\w]+)/);
                    // console.log(matches, m3);
                    if (m3) {
                        let iterator = [], array = m3[1].split(this.uid);
                        for (let index = 0; index < array.length; index++) {
                            this.pushReplacements(iterator, array[index], true);
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
                        }
                    }
                }
            }
            // console.log(this.replacements[posi], type, matches);
            let args: any = this.checkArgs(matches[3]);
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
            }
            // console.log(matches);
        }
        walkArray(posi: number): object {
            let body = [],
                array = this.replacements[posi].replace(/([\[\s\r\n\]])/g, '').split(',');
            for (let index = 0; index < array.length; index++) {
                let eleArr = array[index].split(this.uid);
                let eleBody: object[] = [];
                for (let i = 0; i < eleArr.length; i++) {
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
        }
        walkObject(posi: number) {
            // if (posi == 82) {
            //     console.log(this.replacements[posi]);
            // }
            return {
                type: 'object',
                body: this.checkProp(this.replacements[posi])
            };
        }
        walkLocalCode(posi: number) {
            // if (posi == 90) {
            //     console.log(this.replacements[posi]);
            // }
            let array = this.replacements[posi].split(/[\s\r\n]*(\{|\})[\s\r\n]*/);
            let body = this.checkBody(array[2]);
            if (array[0].trim() === ')') {
                body.unshift({
                    type: 'code-inline',
                    value: ') {'
                });
            } else {
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
            }
        }
        walkProp(type: string, attr: string[], array: string[]): object {
            // console.log(array);
            if (array.length > 1) {
                let body = [];
                if (attr[4]) {
                    body.push({
                        type: 'code-inline',
                        value: attr[4]
                    });
                }
                for (let index = 1; index < array.length; index++) {
                    const element = array[index];
                    const matches: any = element.trim().match(matchExpr.index3);
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
                    } else {
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
        }
        checkBody(code: string, codeInline: boolean = false): object[] {
            let body: object[] = [],
                array = code.split(this.uid);
            for (let index = 0; index < array.length; index++) {
                this.pushReplacements(body, array[index], codeInline);
            }
            return body;
        }
        checkClassBody(code: string): object[] {
            let body = [],
                array = code.split(/[;\r\n]+/);
            for (let index = 0; index < array.length; index++) {
                let element = array[index].trim();
                let type: string = 'method';
                // console.log(element);
                // continue;
                if (element) {
                    let elArr = element.split(this.uid);
                    if (elArr[0] && elArr[0].trim()) {
                        let m0 = elArr[0].trim().match(matchExpr.classelement);
                        if (m0) {
                            if (m0[1] && (m0[1].trim() === 'static')) {
                                // console.log(m0, m1);
                                if (m0[3] && m0[3].trim() === '=') {
                                    if (m0[2].trim()) {
                                        body.push(this.walkProp('staticProp', m0, elArr));
                                    } else {
                                        m0[2] = 'static';
                                        body.push(this.walkProp('prop', m0, elArr));
                                    }
                                    continue;
                                } else {
                                    if (m0[2].trim()) {
                                        continue;
                                    }
                                    type = 'staticMethod';
                                }
                            } else {
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
                        let m1: any = elArr[1].trim().match(matchExpr.index);
                        body.push(this.walkFuntion(parseInt(m1[1]), type));
                    }
                }
            }
            return body;
        }
        checkProp(code: string): object[] {
            let body = [],
                array = code.split(/[\s\r\n]*[\{;,\}]+[\s\r\n]*/);
            // console.log(code, array);
            for (let index = 0; index < array.length; index++) {
                let element = array[index].trim();
                if (element) {
                    let elArr = element.split(this.uid);
                    if (elArr[0] && elArr[0].trim()) {
                        let m0 = elArr[0].trim().match(matchExpr.objectattr);
                        if (m0) {
                            body.push(this.walkProp('objProp', m0, elArr));
                            continue;
                        }
                    }
                    if (elArr[1] && elArr[1].trim()) {
                        let m1: any = elArr[1].trim().match(matchExpr.index);
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
                    } else {
                        // console.log(elArr);
                    }
                }
            }
            return body;
        }
        checkFnBody(args: any, code: string): object[] {
            let body = [],
                array = code.split(this.uid);
            for (let index = 0; index < args.vals.length; index++) {
                if (args.vals[index] !== undefined) {
                    let valArr = args.vals[index].split(this.uid);
                    if (valArr[1]) {
                        body.push({
                            type: 'code',
                            value: 'if (' + args.keys[index] + ' === void 0) { ' + args.keys[index] + ' = ' + valArr[0]
                        });
                        this.pushReplacements(body, valArr[1]);
                        body.push({
                            type: 'code-inline',
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

            for (let index = 0; index < array.length; index++) {
                // console.log(array[index]);
                this.pushReplacements(body, array[index]);
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
        pushReplacements(body: object[], code: string, codeInline: boolean = false): object[] {
            code = code.trim();
            if (code) {
                let matches: any = code.match(matchExpr.index3);
                if (matches) {
                    body.push(this.walk({
                        posi: matches[1],
                        type: matches[2]
                    }));
                    let m3 = matches[3].trim();
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
                } else {
                    this.pushCodeElements(body, code, codeInline);
                }
            }
            return body;
        }
        pushCodeElements(body: object[], code: string, codeInline: boolean = false): object[] {
            let array = code.split(/[;\r\n]+/);
            // console.log(array);
            for (let index = 0; index < array.length; index++) {
                let element = array[index].trim();
                if (element) {
                    if (!codeInline && (index === (array.length - 1))) {
                        body.push({
                            type: 'code',
                            value: element
                        });
                    } else {
                        body.push({
                            type: codeInline ? 'code-inline' : 'code',
                            value: element + ';'
                        });
                    }
                } else {
                    if (!codeInline && (index === (array.length - 1))) {
                        body.push({
                            type: 'code-inline',
                            value: ';'
                        });
                    }
                }
            }
            return body;
        }
        generate(): Sugar {
            // console.log(this.replacements);
            // console.log(this.imports);
            // console.log(this.import_alias);
            // console.log(this.ast);
            let head: string[] = [];
            let body: string[] = [];
            let foot: string[] = [];
            this.pushHeader(head, this.imports);
            this.pushAlias(body, this.import_alias);
            this.pushCodes(body, this.ast.body, 1);
            this.pushFooter(foot);
            // console.log(JSON.stringify(this.ast));
            this.output = head.join('') + this.trim(body.join('')) + foot.join('');
            // console.log(this.output);
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
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
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
                        codes.push(indent1 + 'var ' + cname + ' = pandora.declareClass(, ');
                    } else {
                        codes.push(indent1 + cname + ' = pandora.declareClass(, ');
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
            codes.push(elements.join(','));
            codes.push(indent1 + '})');
            if (cname) {
                if (static_elements.length) {
                    codes.push(';' + indent1 + 'pandora.extend(' + cname + ', {');
                    codes.push(static_elements.join(','));
                    codes.push('});');
                } else {
                    codes.push(';');
                }
            }
            return codes;
        }
        pushArrayCodes(codes: string[], element: any, layer: number, asAttr: boolean): string[] {
            let elements: string[] = [];
            codes.push('[');
            for (let index = 0; index < element.body.length; index++) {
                const body = element.body[index].body;
                let elemCodes: string[] = this.pushCodes([], body, layer + 1, true);
                // let elem:string[] = this.pushCodes([], body, layer + 1);
                elements.push(elemCodes.join('').trim());
            }
            codes.push(elements.join(', '));
            if (asAttr) {
                codes.push(']');
            } else {
                codes.push('];');
            }
            return codes;
        }
        pushTravelCodes(codes: string[], element: any, layer: number): string[] {
            let indent = "\r\n" + stringRepeat("\t", layer);
            // console.log(element);
            codes.push(indent + 'pandora.each(');
            this.pushCodes(codes, element.iterator, layer);
            codes.push(', ');
            this.pushFunctionCodes(codes, element.callback, layer);
            codes.push(indent + ', this);');
            return codes;
        }
        pushFunctionCodes(codes: string[], element: any, layer: number): string[] {
            let indent = "\r\n" + stringRepeat("\t", layer);
            if (element.type === 'def' && element.fname) {
                if (element.stype === 'var') {
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
            this.pushCodes(codes, element.body, layer + 1);

            if (element.type === 'def' && !element.fname) {
                codes.push(indent + '};');
            } else if (element.stype === 'var') {
                codes.push(indent + '};');
            } else {
                codes.push(indent + '}');
            }
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
            if (element.stype === 'reg') {
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
        }
        restoreStrings(string: string): string {
            let boundary = this.uid.replace(/-/g, ' - ');
            let pattern = new RegExp(boundary + '_(\\\d+)_' + boundary);
            let matches: any = string.match(pattern);
            // console.log(pattern);
            // console.log(matches);
            while (matches) {
                string = string.replace(matches[0], this.replacements[matches[1]]);
                matches = string.match(pattern);
            }
            return string.replace(this.uid + '_0=mark;', '\\"').replace(this.uid + '_1=mark;', '\\\'')
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