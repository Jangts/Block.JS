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
    
    const 
        zero2z: string[] = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
        namingExpr: RegExp = /^[A-Z_\$][\w\$]*(\.[A-Z_\$][\w\$]*)*$/i,
        argsExpr: RegExp = /^...[A-Z_\$][\w\$]*(\.[A-Z_\$][\w\$]*)*$/i,
        reservedWords = ['if', 'for', 'while', 'switch', 'with', 'catch'],
        stringas: any = {
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
        operators: any = {
            mixed: /([\$\w\)\}\]])\s*(\=\=|\!\=|\=|\!|\+|\-|\*|\/|\%|<<|>>|>>>|\&|\^|\||<|>)=\s*((\+|\-)?[\$\w\(\{\[]|\.*\d)/g,
            bool: /([\$\w\)\}\]])\s*(\&\&|\|\||\<|\<\<|\>\>\>|\>\>|\>)\s*((\+|\-)?[\$\w\(\{\[]|\.*\d)/g,
            op: /([\$\w\)\}\]])\s*(\+|\-|\*\*|\*|\/|\%)\s*((\s+(\+|\-))?[\$\w\(\{\[]|\.*\d)/g,
            owords: /\s+(in|of)\s+/g,
            sign: /(^|\s*[^\+\-])(\+|\-)(\.*\d|[\$\w_\(\[\{)])/g,
            swords: /([^\$\w_\.]+)(new|typeof|instanceof|delete)\s+(\.*\d|[\$\w\(\[\{)])/g,
            before: /(\+\+|\-\-|\!|\~)\s*([\$\w\(\{\[])/g,
            after: /([\$\w\)\]])\s*(\+\+|\-\-)/g,
            error: /(.*)(\+\+|\-\-|\+|\-)(.*)/g
        },
        replaceExpr = {
            use: /\s*use\s+.[\$\w\.,\s\/\\]+?(\[\])?[;\r\n]+/g,
            using: /^\s*use\s+/g,
            return: /[\s;\r\n]+$/g,
            include: /\s*@include\s+.[\$\w\.\s\/\\]+?[;\r\n]+/g,
            class: /(class|dec|expands)\s+((pandora)?\.)?([\$\w\.]+\s+)?(extends\s+([\$\w\.]+)\s*)?\{([^\{\}]*?)\}/g,
            define: /(ns|namespace|extends)\s+([\$\w\.]+)\s*\{([^\{\}]*?)\}/g,
            fnlike: /((var|let|function|def)\s+)?([\$\w]*)\s*\(([^\(\)]*)\)\s*\{([^\{\}]*?)\}/g,
            arraylike: /\s*\[\s*([^\[\]]*?)\s*\]/g,
            call: /([\$\w]+)\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*([^\$\w\s\{]|[\r\n].|\s*___boundary_[A-Z0-9_]{36}_\d+_as_array___|\s*___boundary_\d+_as_operator___|$)/g,
            closure: /(@*[\$\w]+|\))?\s*\{(\s*[^\{\}]*?)\s*\}/g,
            arrowfn: /\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*(->|=>)\s*([^,;\r\n]+)\s*(,|;|\r|\n|$)/g
        },
        matchExpr = {
            string: /(\/|\#|`|"|')([\*\/\=])?/,
            strings: {
                '/': /(\/.+?\/[img]*)\s*?(\sin|[\r\n\.,;\)\]\}]|\/\/|$)/,
                '`': /(`[^`]*`)\s*?(\sin|[\r\n]|[^\$\w\s\*\/]|\/\/|$)/,
                '"': /(".*?")\s*?(\sin|[\r\n]|[^\$\w\s\*\/]|\/\/|$)/,
                "'": /('.*?')\s*?(\sin|[\r\n]|[^\$\w\s\*\/]|\/\/|$)/
            },
            index: /(\d+)_as_([a-z]+)/,
            index3: /^_(\d+)_as_([a-z]+)___([\s\S]*)$/,
            class: /(class|dec|expands)\s+((pandora)?\.)?([\$\w\.]+\s+)?(extends\s+([\$\w\.]+)\s*)?\{([^\{\}]*?)\}/,
            classelement: /^\s*((public|static|set|get|om)\s+)?([\$\w]*)\s*(\=*)([\s\S]*)$/,
            objectattr: /^\s*((([\$\w]+)))\s*(\:*)([\s\S]*)$/,
            define: /(ns|namespace|extends)\s+([\$\w\.]+)\s*\{([^\{\}]*?)\}/,
            fnlike: /((var|let|function|def)\s+)?([\$\w]*)\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*\{([^\{\}]*?)\}/,
            call: /([\$\w]+|\])\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)/,
            arrowfn: /(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*(->|=>)\s*([^,;\r\n]+)/
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
        replacements: string[] = ['{}', '/=', '/', ' +', ' -', 'return ']
        imports: string[] = []
        using_as: object = {}
        ast: any = {}
        configinfo = '{}'
        toES6 = false
        output: string | undefined
        constructor(input: string, toES6: boolean = false, run: boolean = false) {
            this.uid = boundaryMaker();
            this.markPattern = new RegExp('___boundary_(\\\d+)_as_(mark|preoperator|operator|aftoperator)___', 'g');
            this.lastPattern = new RegExp('(___boundary_' + this.uid + '_(\\\d+)_as_(string|pattern|template)___|___boundary_(\\\d+)_as_(propname|preoperator|operator|aftoperator)___)', 'g');
            this.input = input;
            this.output = undefined;
            if (toES6) {
                this.toES6 = true;
            }
            if (run) {
                this.run();
            }
        }
        compile(): Sugar {
            // console.log(this.input);
            let vars = {
                parent: {
                    fixed: [],
                    fix_map: {}
                },
                self: ['var this', 'var arguments'],
                fixed: [],
                fix_map: {},
                type: 'block'
            };
            this.buildAST(this.getReplacePosis(this.getSentences(this.encode(this.input), vars), vars), vars);
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
            // console.log(string);
            string = this.replaceUsing(string);
            string = this.replaceStrings(string);
            // console.log(string);

            while (string.indexOf('@include') >= 0) {
                string = this.replaceIncludes(string);
            }

            string = string.replace(/___boundary_[A-Z0-9_]{36}_(\d+)_as_string___\s*(\:|\(|\=)/g, '___boundary_$1_as_propname___$2');
            string = string.replace(/([\$\w]+)\s*(->|=>)/g, "($1)$2");
            // console.log(string);
            // console.log(this.replacements);

            string = this.replaceBrackets(string);
            string = this.replaceBraces(string);
            string = this.replaceParentheses(string);
            
            // console.log(string);
            // console.log(this.replacements);
            return string;
        }
        replaceUsing(string: string): string {
            return string.replace(replaceExpr.use, (match: string) => {
                let index = this.replacements.length;
                this.replacements.push(match);
                return '___boundary_' + this.uid + '_' + index + '_as_using___;' + "\r\n";
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
                // if (match && (matches.index === match.index) && ((match[2] === 'i') || !match[2].match(/[\$\w\{]/))) {
                if (match && (matches.index === match.index) && ((match[2]===' in')||!match[2].match(/[\$\w\{]/))) {
                    // console.log(matches, match);
                    this.replacements.push(match[1]);
                    string = string.replace(match[1], '___boundary_' + this.uid + '_' + index + stringas[matches[1]]);
                } else if (matches[0] === '/') {
                    string = string.replace(matches[0], '___boundary_2_as_operator___');
                } else {
                    console.log(matches, match);
                    throw 'tangram.js sugar Error: Unexpected `' + matches[1] + '` in `' + this.decode(string.substr(matches.index, 256)) + '`';
                }
                matches = string.match(matchExpr.string);
            }
            // console.log(string);
            // console.log(this.replacements);
            return string;
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
        replaceBrackets(string: string): string {
            let left = string.indexOf('[');
            let right = string.indexOf(']');
            let count: number = 0;
            while ((count < this.stringReplaceTimes) && (left >= 0)) {
                count++;
                // console.log(left, right);
                if (left < right) {
                    string = string.replace(replaceExpr.arraylike, (match: string, elements: string) => {
                        // console.log(match);
                        elements = this.replaceBraces(elements);
                        elements = this.replaceParentheses(elements);
                        // match = this.replaceOperators(match, false);
                        let index = this.replacements.length;
                        this.replacements.push('[' + elements + ']');
                        return '___boundary_' + this.uid + '_' + index + '_as_array___';
                    });
                    left = string.indexOf('[');
                    right = string.indexOf(']');
                } else {
                    if (right >= 0) {
                        var index = right;
                    }else{
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
        }
        replaceBraces(string: string): string {
            let left = string.indexOf('{');
            let right = string.indexOf('}');
            let count: number = 0;
            while ((count < this.stringReplaceTimes) && (left >= 0)) {
                count++;
                // console.log(left, right);
                if (left < right) {
                    string = this.replaceCodeSegments(string);
                    left = string.indexOf('{');
                    right = string.indexOf('}');
                } else {
                    if (right >= 0) {
                        var index = right;
                    } else {
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
        }
        replaceCodeSegments(string: string): string {
            if (string.match(matchExpr.class)) {
                return string.replace(replaceExpr.class, (match: string) => {
                    match = this.replaceParentheses(match);
                    // match = this.replaceOperators(match, false);
                    let index = this.replacements.length;
                    this.replacements.push(match);
                    return '___boundary_' + this.uid + '_' + index + '_as_class___';
                });
            }

            if (string.match(matchExpr.define)) {
                return string.replace(replaceExpr.define, (match: string) => {
                    match = this.replaceParentheses(match);
                    // match = this.replaceOperators(match, false);
                    var index = this.replacements.length;
                    this.replacements.push(match);
                    return '___boundary_' + this.uid + '_' + index + '_as_define___';
                });
            }

            if (string.match(replaceExpr.fnlike)) {
                return string.replace(replaceExpr.fnlike, (match: string) => {
                    // console.log(match);
                    match = this.replaceParentheses(match);
                    // match = this.replaceOperators(match, false);
                    let index = this.replacements.length;
                    this.replacements.push(match);
                    return '___boundary_' + this.uid + '_' + index + '_as_function___';
                });
            }

            return string.replace(replaceExpr.closure, (match: string, word: string, closure: string) => {
                // console.log(match, word, closure);
                if (!word && match.match(/\{\s*\}/)) {
                    return '___boundary_0_as_mark___';
                }
                closure = this.replaceParentheses(closure);
                // closure = this.replaceOperators(closure, false);
                let index = this.replacements.length;
                if (word === '@config') {
                    this.configinfo = this.decode(match.replace('@config', ''));
                    return '';
                }
                if (word === 'return') {
                    this.replacements.push('{' + closure + '}');
                    return '___boundary_5_as_preoperator___ ___boundary_' + this.uid + '_' + index + '_as_object___';
                }
                if ((word && (word != 'return')||(closure.indexOf(';') >= 0))) {
                    this.replacements.push('{' + closure + '}');
                    return (word || '') + ' ___boundary_' + this.uid + '_' + index + '_as_closure___';
                }
                this.replacements.push('{' + closure + '}');
                return '___boundary_' + this.uid + '_' + index + '_as_object___';
            });
        }
        replaceParentheses(string: string): string {
            let left = string.indexOf('(');
            let right = string.indexOf(')');
            let count: number = 0;
            while ((count < this.stringReplaceTimes) && (left >= 0)) {
                count++;
                // console.log(left, right);
                if (left < right) {
                    string = string.replace(/\s*\(\s*([^\(\)]*?)\s*\)/g, (match, paramslike: string)=>{
                        // console.log(match, paramslike);
                        paramslike = this.replaceCalls(paramslike);
                        paramslike = this.replaceOperators(paramslike, false);
                        paramslike = this.replaceArrowFunctions(paramslike);
                        let index = this.replacements.length;
                        this.replacements.push('(' + paramslike + ')');
                        return '___boundary_' + this.uid + '_' + index + '_as_parentheses___';
                    });
                    // console.log(string);
                    left = string.indexOf('(');
                    right = string.indexOf(')');
                } else {
                    if (right >= 0) {
                        var index = right;
                    } else {
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
        }
        replaceCalls(string: string): string {
            return string.replace(replaceExpr.call, (match: string, callname: string, args: string, argsposi: string, after: string) => {
                // console.log(match);
                let index = this.replacements.length;
                this.replacements.push(callname + args);
                return '___boundary_' + this.uid + '_' + index + '_as_call___' + after;
            });
        }
        replaceOperators(string: string, toMin: boolean = false): string {
            let on = true;
            while (on) {
                on = false;
                string = string.replace(operators.owords, (match: string, word: string) => {
                    // console.log(match);
                    on = true;
                    let index = this.replacements.length;
                    this.replacements.push(' ' + word + ' ');
                    return '___boundary_' + index + '_as_operator___';
                });
            }

            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.swords, (match: string, before: string, word: string, right: string) => {
                    // console.log(match, before);
                    on = true;
                    let index = this.replacements.length;
                    if ((word === 'typeof') || (word === 'instanceof')){
                        this.replacements.push(' ' + word + ' ');
                        before = before.trim()
                    }else{
                        this.replacements.push(word + ' ');
                    }
                    return before + '___boundary_' + index + '_as_preoperator___' + right;
                });
            }

            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.mixed, (match: string, left: string, op: string, right: string, sign: string) => {
                    // console.log(match);
                    on = true;
                    if (sign) {
                        let _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '___boundary_' + _index + '_as_preoperator___');
                    }
                    let index = this.replacements.length;
                    if (toMin) {
                        this.replacements.push(op + '=');
                    } else {
                        this.replacements.push(' ' + op + '= ');
                    }
                    return left + '___boundary_' + index + '_as_operator___' + right;
                });
            }

            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.bool, (match: string, left: string, op: string, right: string, sign: string) => {
                    // console.log(match);
                    on = true;
                    if (sign) {
                        let _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '___boundary_' + _index + '_as_preoperator___');
                    }
                    let index = this.replacements.length;
                    if (toMin) {
                        this.replacements.push(op);
                    } else {
                        this.replacements.push(' ' + op + ' ');
                    }
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
                    if (toMin) {
                        this.replacements.push(op);
                    } else {
                        this.replacements.push(' ' + op + ' ');
                    }
                    return left + '___boundary_' + index + '_as_operator___' + right;
                });
            }

            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.sign, (match: string, before: string, sign: string, number: string) => {
                    on = true;
                    // let index = this.replacements.length;
                    // this.replacements.push(' ' + sign);
                    let index = sign === '+' ? 3 : 4;
                    return before + '___boundary_' + index + '_as_preoperator___' + number;
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
                throw 'tangram.js sugar Error: Unexpected `' + op + '` in `' + this.decode(match) + '`';
            });
        }
        replaceArrowFunctions(string: string): string {
            let arrow = string.match(/(->|=>)/);
            // console.log(arrow);
            if (arrow) {
                if (string.match(matchExpr.arrowfn)) {
                    // console.log(string.match(matchExpr.arrowfn));
                    return string.replace(replaceExpr.arrowfn, (match: string, params: string, paramsposi: string, arrow: string, body: string, end: string) => {
                        // console.log(match);
                        // console.log(body);
                        let matches = body.match(/^\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_(parentheses|object|closure)___\s*$/);
                        // console.log(matches);
                        if (matches){
                            let code = this.replacements[matches[1]];
                            if (matches[2]==='parentheses'){
                                body = code.replace(/^\(\s*(.*?)\s*\)$/, (match: string, code: string) => {
                                    return '___boundary_5_as_preoperator___ ' + code;
                                });
                            }else{
                                // console.log(code);
                                body = code.replace(/(^\{|\}$)/g, '');
                            }
                        }else{
                            let index = this.replacements.length;
                            this.replacements.push();
                            body = '___boundary_5_as_preoperator___ ' + body;
                        }
                        let index = this.replacements.length;
                        // console.log(body);
                        this.replacements.push(params + arrow + body);
                        return '___boundary_' + this.uid + '_' + index + '_as_arrowfn___' + end;
                    });
                } else {
                    if (arrow.index > 64) {
                        index =  - 64;
                    } else {
                        index = 0;
                    }
                    throw 'tangram.js sugar Error: Unexpected `' + arrow[0] + '` in `' + this.decode(string.substr(index, 256)) + '`';
                }
            }
            return string;
        }
        getSentences(string: string, vars: any): object[] {
            const array: string[] = string.split(/\s*;+\s*/);
            let lines: object[] = [];
            // console.log(array);
            for (let index = 0; index < array.length; index++) {
                const sentence = array[index].trim();
                if (sentence) {
                    if (index) {
                        lines.push({
                            type: 'line',
                            stype: 'newline',
                            value: ''
                        });
                    }
                    const sublines = sentence.split(/(^|[^,\s][\r\n]|[^,]\s+[\r\n]|else\s)\s*(var|let)\s+/);
                    // console.log(sublines);
                    for (let i = 0; i < sublines.length; i++) {
                        let element = sublines[i];
                        // console.log(element);
                        if ((element === 'var' || (element === 'let'))) {
                            if(!this.toES6){
                                element = 'var';
                            }
                            this.pushVariables(lines, vars, sublines[++i] + (sublines[++i] || ''), element);
                        } else {
                            if (element.match(/(|[^,;\s][\r\n])\s*(var)\s+/)) {
                                // console.log(element);
                                throw 'tangram.js sugar Error: Unexpected Variable definition `' + this.decode(element) + '`' + (((vars.type === 'fnbody') || (vars.type === 'codesbody')) ? ' in `' + this.decode(string) + '`' : '');
                            } else {
                                // console.log(element);
                                this.pushLines(lines, element + (sublines[++i] || ''));
                            }
                        }
                    }
                }
            }
            // this.fixVariables(vars);
            // console.log(lines);
            return lines;
        }
        pushVariables(lines: any, vars: any, string: string, symbol: string) {
            // console.log(matchExpr.call.test(string), string);
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
                                    this.checkVariables(lines, vars, line, string, symbol);
                                } else {
                                    // console.log(array);
                                    throw 'tangram.js sugar Error: Unexpected Variable definition `'+ symbol + ' ' + this.decode(line) + '`' + (((vars.type === 'fnbody') || (vars.type === 'codesbody')) ? ' in `' + this.decode(string) + '`' : '');
                                }
                            }
                        }
                    } else {
                        if (element.match(/^[\$\w]\s*(=.+|\s*)$/)) {
                            this.checkVariables(lines, vars, element, string, symbol);
                        } else {
                            throw 'tangram.js sugar Error: Unexpected Variable definition `' + symbol + ' ' + this.decode(element) + '`' + '`' + (((vars.type === 'fnbody') || (vars.type === 'codesbody')) ? ' in `' + this.decode(string) + '`' : '');
                        }
                    }
                }
            }
        }
        checkVariables(lines: any, vars: any, line: string, string: string, symbol: string) {
            let array = line.split(/\s*=\s*/);
            let value = array.pop();
            if (array.length){
                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    if (element.match(/[\$\w]+/)) {
                        vars.self.push(symbol + ' ' + element);
                        if (index){
                            lines.push({
                                type: 'line',
                                value: symbol + ' ' + element + ' = ' + array[0] + ';'
                            });
                        }else{
                            lines.push({
                                type: 'line',
                                value: symbol + ' ' + element + ' = ' + value + ';'
                            });
                        }
                    } else {
                        throw 'tangram.js sugar Error: Unexpected Variable definition `' + symbol + ' ' + this.decode(line) + '`' + (((vars.type === 'fnbody') || (vars.type === 'codesbody')) ? ' in `' + this.decode(string) + '`' : '');
                    }
                }
            }else{
                if (value.match(/[\$\w]+/)){
                    vars.self.push(symbol + ' ' + value);
                    lines.push({
                        type: 'line',
                        value: symbol + ' ' + value + ';'
                    });
                }else{
                    throw 'tangram.js sugar Error: Unexpected Variable definition `' + symbol + ' ' + this.decode(line) + '`' + (((vars.type === 'fnbody') || (vars.type === 'codesbody')) ? ' in `' + this.decode(string) + '`' : '');
                }
            }
            // console.log(array);   
        }
        pushLines(lines: any, string: string) {
            const array: string[] = string.split(/\s*[\r\n]+\s*/);
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                // console.log(element);
                // if (element.match(/g/)) {
                //     lines.push({
                //         type: 'line',
                //         value: element
                //     });
                // } else 
                if (element.match(/___boundary_[A-Z0-9_]{36}_\d+_as_(function|closure)___/)) {
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
        getReplacePosis(lines: any[], vars: any): object[] {
            let imports: string[] = [],
                using_as: any = {},
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
                                if (matches[2] === 'using') {
                                    let src = this.replacements[matches[1]].replace(replaceExpr.using, '').replace(replaceExpr.return, '');
                                    let srcArr = src.split(/\s+as\s+/);
                                    // console.log(srcArr);
                                    if (srcArr[1] && srcArr[1].trim()) {
                                        src = srcArr[0].trim();
                                        if (!imports['includes'](src)){
                                            imports.push(src);
                                        }
                                        const array = srcArr[1].split(',');
                                        // console.log(array);
                                        for (let index = 0; index < array.length; index++) {
                                            const element = array[index].trim();
                                            if (element){
                                                if(element.match(/^[\$\w]+\[\]$/)){
                                                    let alias = element.replace('[]', '');
                                                    using_as[alias] = [src];
                                                    vars.self.push(alias);
                                                    break;
                                                }else{
                                                    using_as[element] = [src, index];
                                                    vars.self.push(element);
                                                }
                                            }
                                        } 
                                    }else{
                                        imports.push(src);
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
                                        vars: vars,
                                        value: match_3
                                    });
                                }
                            } else {
                                inline.push({
                                    type: 'code',
                                    vars: vars,
                                    value: element
                                });
                            }
                        }
                    }
                    midast.push(inline);
                } else {
                    // console.log(lines[index].stype);
                    if (lines[index].stype === 'newline') {
                        midast.push([{
                            type: 'code',
                            vars: vars,
                            stype: 'newline'
                        }]);
                    }
                }
            }
            this.imports = imports;
            this.using_as = using_as;
            // console.log(imports, midast);
            return midast;
        }
        buildAST(midast: object[], vars: any): Sugar {
            let ast = {
                type: 'codes',
                vars: vars,
                body: []
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
                        ast.body.push(this.walk(element, vars, false));
                    }
                } else {
                    let codes = {
                        type: 'codes',
                        vars: vars,
                        body: []
                    };
                    for (let index = 0; index < block.length; index++) {
                        const element = block[index];
                        if (element.type === 'code') {
                            element.stype = index ? 'inline' : 'block';
                            codes.body.push(element);
                        } else {
                            codes.body.push(this.walk(element, vars, !!index));
                        }
                    }
                    ast.body.push(codes);
                }
            }
            // console.log(ast, this.replacements);
            this.ast = ast;
            return this;
        }
        walk(element: any, vars: any, codeInline: boolean): object {
            switch (element.type) {
                case 'array':
                    return this.walkArray(element.posi, vars, codeInline);
                case 'arrowfn':
                    return this.walkArrowFn(element.posi, vars, codeInline);
                case 'call':
                    return this.walkCall(element.posi, vars, codeInline);
                case 'class':
                    return this.walkClass(element.posi, vars, codeInline);
                case 'closure':
                    return this.walkClosure(element.posi, vars);
                case 'define':
                    return this.walkNamespace(element.posi, vars, codeInline);
                case 'function':
                    return this.walkFnLike(element.posi, vars,'def', codeInline);
                case 'object':
                    return this.walkObject(element.posi, vars, codeInline);
                case 'parentheses':
                    return this.walkParentheses(element.posi, vars, codeInline);
                case 'pattern':
                case 'string':
                case 'template':
                    let that = this;
                    return {
                        type: 'code',
                        stype: codeInline ? 'inline' : 'block',
                        vars: vars,
                        value: this.replacements[element.posi].replace(this.markPattern, function () {
                            return that.replacements[arguments[1]];
                        })
                    }
                default:
                    return {
                        type: 'code',
                        stype: codeInline ? 'inline' : 'block',
                        vars: vars,
                        value: '// Unidentified Code'
                    }
            }
        }
        walkClass(posi: number, vars: any, codeInline: boolean = true) {
            // console.log(this.replacements[posi]);
            let matches: any = this.replacements[posi].match(matchExpr.class);
            // console.log(matches);
            return {
                type: (matches[1] === 'expands') ? 'expands' : 'class',
                stype: codeInline ? 'inline' : 'block',
                subtype: matches[2] ? 'stdClass' : 'anonClass',
                cname: matches[4],
                base: matches[6],
                vars: vars,
                body: this.checkClassBody(vars, matches[7] || '')
            }
        }
        walkNamespace(posi: number, vars: any, codeInline: boolean) {
            // console.log(this.replacements[posi]);
            let matches: any = this.replacements[posi].match(matchExpr.define);
            let subtype: string = 'ext';
            let objname: string = matches[2];

            if ((matches[1] === 'ns') || (matches[1] === 'namespace')) {
                subtype = 'namespace';
            } else {
                let match_2 = matches[2].match(/^(pandora)?.([\$a-zA-Z_][\$\w\.]+$)/);
                // console.log(matches[2], match_2);
                if (match_2) {
                    subtype = 'namespace';
                    objname = match_2[2];
                }
            }
            // console.log(matches);
            return {
                type: 'define',
                stype: codeInline ? 'inline' : 'block',
                subtype: subtype,
                oname: objname,
                vars: vars,
                body: this.checkObjMember(vars, matches[3])
            }
        }
        walkFnLike(posi: number, vars: any, type: string, codeInline: boolean) {
            // console.log(this.replacements[posi]);
            let matches: any = this.replacements[posi].match(matchExpr.fnlike);
            // if (!matches) {
            //     console.log(posi, this.replacements);
            // } else {
            //     console.log((matches);
            // }

            if (matches[1] == null && type === 'def') {
                if (reservedWords['includes'](matches[3])) {
                    const headline = this.replacements[matches[5]].replace(/(^\(|\)$)/g, '');
                    let localvars = {
                        parent: vars,
                        self: [],
                        fixed: [],
                        fix_map: {},
                        type: 'codes'
                    };
                    if (matches[3] === 'for') {
                        // console.log(matches);
                        const firstSentence = headline.split(/\s*;\s*/)[0];
                        const match = firstSentence.match(/^\s*(var|let)\s+([\$\w]+\s*=.+)$/);
                        // console.log(firstSentence, match);
                        if (match) {
                            this.pushVariables([], localvars, match[2], match[1]);
                        }
                        // console.log(localvars);
                    }
                    return {
                        type: 'exp',
                        vars: localvars,
                        expression: matches[3],
                        head: this.pushLineToBody([], localvars, headline, true),
                        body: this.pushToBody([], localvars, matches[6])
                    };
                }
                if (matches[3] === 'each') {
                    const condition = this.replacements[matches[5]].replace(/(^\(|\)$)/g,'').match(/^([\$a-zA-Z_][\$\w\.-]+)\s+as\s+([\$\w]+)(\s*,\s*([\$\w]*))?/);
                    // console.log(matches, condition);
                    if (condition) {
                        let iterator = [], array = condition[1].split('___boundary_' + this.uid);
                        let self:string[], agrs: string[] = [];
                        if (condition[3]) {
                            if (condition[4]) {
                                self = ['var this', 'var arguments', 'var ' + condition[2], 'var ' + condition[4]];
                                agrs = [condition[2], condition[4]];
                            } else {
                                self = ['var this', 'var arguments', 'var ' + condition[2]];
                                agrs = [condition[2]];
                            }
                        } else {
                            self = ['var this', 'var arguments', 'var _index', 'var ' + condition[2]];
                            agrs = ['_index', condition[2]];
                        }

                        let localvars = {
                            parent: vars,
                            self: self,
                            fixed: [],
                            fix_map: {},
                            type: 'travel'
                        };
                        for (let index = 0; index < array.length; index++) {
                            this.pushReplacements(iterator, localvars, array[index], true);
                        }
                        
                        return {
                            type: 'travel',
                            iterator: iterator,
                            vars: localvars,
                            callback: {
                                type: 'def',
                                stype: 'inline',
                                fname: '',
                                args: agrs,
                                body: this.pushToBody([], localvars, matches[6])
                            }
                        }
                    }
                }
            }
            // console.log(this.replacements[posi], type, matches);
            
            // if (posi == 98) {
            // console.log(matches[4]);
            // }

            let subtype = 'fn';
            let fname = matches[3] !== 'function' ? matches[3] : ''
            if (fname && matches[2] && ((matches[2] === 'var') || (matches[2] === 'let')) && !codeInline) {
                subtype = this.toES6 ? matches[2] : 'var';
                vars.self.push(subtype + ' ' + fname);
            }
            let localvars = {
                parent: vars,
                self: ['var this', 'var arguments'],
                fixed: [],
                fix_map: {},
                type: 'fnbody'
            };
            let args: any = this.walkArgs(parseInt(matches[5]), localvars);
            return {
                type: type,
                vars: localvars,
                stype: codeInline ? 'inline' : 'block',
                subtype: subtype,
                fname: fname,
                args: args.keys,
                defaults: args.vals,
                body: this.checkFnBody(vars, args, matches[6])
            }
        }
        walkArrowFn(posi: number, vars: any, codeInline: boolean) {
            let matches: any = this.replacements[posi].match(matchExpr.arrowfn);
            // console.log(this.replacements[posi], matches);
            
            let subtype = 'fn';
            let selfvas = ['var this', 'var arguments']
            if (matches[3] === '=>'){
                subtype = '=>';
                selfvas = ['let this', 'let arguments']
            }
            let localvars = {
                parent: vars,
                self: selfvas,
                fixed: [],
                fix_map: {},
                type: 'fnbody'
            };
            let args: any = this.walkArgs(parseInt(matches[2]), localvars);
            return {
                type: 'def',
                stype: codeInline ? 'inline' : 'block',
                subtype: subtype,
                args: args.keys,
                defaults: args.vals,
                body: this.checkFnBody(localvars, args, matches[4])
            }
        }
        walkArgs(posi: number, localvars): object {
            let code = this.replacements[posi].replace(/(^\(|\)$)/g, '');
            let args = code.split(/\s*,\s*/),
                keys = [],
                keysArray = void 0,
                vals = [];
            for (let index = 0; index < args.length; index++) {
                let array = args[index].split(/\s*=\s*/);
                if (array[0].match(namingExpr)) {
                    keys.push(array[0]);
                    vals.push(array[1]);
                    localvars.self.push(array[0]);
                } else if (array[0].match(argsExpr)){
                    keysArray = array[0];
                    localvars.self.push(array[0]);
                    break;
                }
            }
            return {
                keys: keys,
                keysArray: keysArray,
                vals: vals
            }
        }
        walkCall(posi: number, vars: any, codeInline: boolean): object {
            let name = [],
                params = [],
                matches: any = this.replacements[posi].match(matchExpr.call),
                nameArr: string[] = matches[1].split('___boundary_' + this.uid),
                paramArr = this.replacements[matches[3]].split(/([\(\r\n,\)])/),
                last: string = '';
            // console.log(this.replacements[posi], matches);
            for (let i = 0; i < nameArr.length; i++) {
                const element = nameArr[i].trim();
                if (element) {
                    this.pushReplacements(name, vars, nameArr[i], true);
                }
            }
            for (let index = 0; index < paramArr.length; index++) {
                const element = paramArr[index].trim();
                let line: string[] = element.split('___boundary_' + this.uid);
                if (element && element != '(' && element != ')' && element != ',') {
                    let inline: object[] = [];
                    for (let i = 0; i < line.length; i++) {
                        this.pushReplacements(inline, vars, line[i], true);
                    }
                    // console.log(last, last === "\r", last === "\n");
                    params.push({
                        type: 'parameter',
                        vars: vars,
                        stype: (last === "\n" || last === "\r") ? 'block' : 'inline',
                        body: inline
                    });
                }
                last = paramArr[index];
            }
            return {
                type: 'call',
                stype: codeInline ? 'inline' : 'block',
                name: name,
                vars: vars,
                params: params
            };
        }
        walkArray(posi: number, vars: any, codeInline: boolean): object {
            let body = [],
                array = this.replacements[posi].replace(/([\[\s\]])/g, '').split(',');
            for (let index = 0; index < array.length; index++) {
                let line = array[index].split('___boundary_' + this.uid);
                let inline: object[] = [];
                for (let i = 0; i < line.length; i++) {
                    this.pushReplacements(inline, vars, line[i], true);
                }
                body.push({
                    type: 'element',
                    vars: vars,
                    body: inline
                });
            }
            return {
                type: 'array',
                stype: codeInline ? 'inline' : 'block',
                vars: vars,
                body: body
            };
        }
        walkParentheses(posi: number, vars: any, codeInline: boolean): object {
            let body = [],
            array = this.replacements[posi].replace(/([\[\s\]])/g, '').split(/\s*([,\r\n]+)/);
            for (let index = 0; index < array.length; index++) {
                let line = array[index].split('___boundary_' + this.uid);
                // let inline: object[] = [];
                for (let i = 0; i < line.length; i++) {
                    this.pushReplacements(body, vars, line[i], true);
                }
                // body.push({
                //     type: 'element',
                //     body: inline
                // });
            }
            return {
                type: 'codes',
                // stype: codeInline ? 'inline' : 'block',
                vars: vars,
                body: body
            };
        }
        walkObject(posi: number, vars: any, codeInline: boolean = true) {
            return {
                type: 'object',
                vars: vars,
                body: this.checkObjMember(vars, this.replacements[posi])
            };
        }
        walkClosure(posi: number, vars: any) {
            // console.log(this.replacements[posi]);
            let localvars = {
                parent: vars,
                self: [],
                fixed: [],
                fix_map: {},
                type: 'codes'
            };
            let array = this.replacements[posi].split(/\s*(\{|\})\s*/);
            let body = this.pushToBody([], localvars, array[2]);
            for (let index = 0; index < localvars.self.length; index++) {
                const element = localvars.self[index];
                if(element.substr(0,4)==='var '){
                    vars.self.push(element);
                }
            }
            // console.log(array);
            body.unshift({
                type: 'code',
                stype: 'inline',
                vars: localvars,
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
                vars: localvars,
                value: '}'
            });

            return {
                type: 'codes',
                stype: 'local',
                vars: localvars,
                body: body
            }
        }
        checkProp(vars: any, type: string, attr: string[], array: string[]): object {
            // console.log(array);
            if (array.length > 1) {
                let body = [];
                if (attr[5]) {
                    body.push({
                        type: 'code',
                        stype: 'inline',
                        vars: vars,
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
                        }, vars, true));
                        if (matches[3]) {
                            body.push({
                                type: 'code',
                                stype: 'inline',
                                vars: vars,
                                value: matches[3]
                            });
                        }
                    } else {
                        body.push({
                            type: 'code',
                            stype: 'inline',
                            vars: vars,
                            value: element
                        });
                    }
                }
                return {
                    type: type,
                    pname: attr[3] || 'myAttribute',
                    vars: vars,
                    body: body
                };
            }
            return {
                type: type,
                pname: attr[3] || 'myAttribute',
                vars: vars,
                body: [
                    {
                        type: 'code',
                        stype: 'inline',
                        vars: vars,
                        value: attr[5]
                    }
                ]
            };
        }
        checkClassBody(vars: any, code: string): object[] {
            let body = [],
                array = code.split(/[;,\r\n]+/);
            for (let index = 0; index < array.length; index++) {
                let element = array[index].trim();
                let type: string = 'method';
                // console.log(element);
                if (element) {
                    let elArr = element.split('___boundary_' + this.uid);

                    if (elArr[0] && elArr[0].trim()) {
                        let match_0 = elArr[0].match(matchExpr.classelement);
                        if (match_0) {
                            if (match_0[3].trim()) {
                                switch (match_0[2]) {
                                    case undefined:
                                    case 'public':
                                        type = 'prop';
                                        break;
                                    case 'static':
                                        type = 'staticProp';
                                        break;
                                        default:
                                        throw 'tangram.js sugar Error: Cannot use `' + match_0[2] +'` on property `' + match_0[3] + '`';
                                }
                                if (match_0[4] != '=') {
                                    if ((elArr.length === 1)) {
                                        match_0[5] = 'undefined';
                                    } else {
                                        continue;
                                    }
                                }
                                body.push(this.checkProp(vars, type, match_0, elArr));
                                continue;
                            } 
                            switch (match_0[2]) {
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
                                    match_0[3] = 'static';
                                    if (match_0[4] === '=') {
                                        body.push(this.checkProp(vars, 'prop', match_0, elArr));
                                        continue;
                                    }
                                    if ((elArr.length === 1)) {
                                        match_0[5] = 'undefined';
                                        body.push(this.checkProp(vars, 'prop', match_0, elArr));
                                        continue;
                                    }
                                    type = 'staticMethod';
                                    break;
                            }
                        }
                    }
                    if (elArr[1] && elArr[1].trim()) {
                        let m1: any = elArr[1].trim().match(matchExpr.index);
                        if (m1[2] === 'function') {
                            body.push(this.walkFnLike(parseInt(m1[1]), vars, type, true));
                        }
                    }
                }
            }
            return body;
        }
        checkObjMember(vars: any, code: string): object[] {
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
                        var match_0 = elArr[0].trim().match(matchExpr.objectattr);
                        if (match_0) {
                            if (match_0[4] != ':') {
                                if ((elArr.length === 1)) {
                                    match_0[5] = match_0[3];
                                }
                                else {
                                    // console.log(elArr);
                                    continue;
                                }
                            }
                            // console.log(elArr);
                            body.push(this.checkProp(vars, 'objProp', match_0, elArr));
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
                                        vars: vars,
                                        value: ',' + this.replacements[parseInt(m[1])].replace(this.markPattern, function () {
                                            return that.replacements[arguments[1]];
                                        })
                                    });
                                    if (m[3]) {
                                        body[bodyIndex].body.push({
                                            type: 'code',
                                            stype: 'inline',
                                            vars: vars,
                                            value: m[3]
                                        });
                                    }
                                    break;

                                case 'function':
                                    if (elArr.length === 2) {
                                        body.push(this.walkFnLike(parseInt(m[1]), vars, 'method', true));
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
        checkFnBody(vars: any, args: any, code: string): object[] {
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
                        this.pushReplacements(body, vars, valArr[1], true);
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
            
            if(args.keysArray){
                body.push({
                    type: 'code',
                    value: 'var ' + args.keysArray.replace('...', '') + ' = Array.prototype.slice.call(arguments, ' + args.keys.length + ');'
                });
            }
            // console.log(code);
            this.pushToBody(body, vars, code);
            return body;
        }
        pushToBody(body: object[] = [], vars: any, code: string): object[] {
            let lines: any = code ? this.getSentences(code, vars) : [];
            // console.log(lines);
            for (let index = 0; index < lines.length; index++) {
                const line = lines[index].value.trim();
                this.pushLineToBody(body, vars, line, [',', ';']['includes'](line))
            }

            if (body.length) {
                body.push({
                    type: 'code',
                    stype: 'inline',
                    vars: vars,
                    value: ';'
                });
            }
            return body;
        }
        pushLineToBody(body: object[] = [], vars: any, line: string, lineInLine: boolean): object[] {
            if (line) {
                let inline = [];
                const array: string[] = line.split('___boundary_' + this.uid);
                // console.log(array);
                while (array.length && !array[0].trim()) {
                    array.shift();
                }
                for (let index = 0; index < array.length; index++) {
                    // console.log(index, array[index]);
                    // console.log(lineInLine || !!index);
                    this.pushReplacements(inline, vars, array[index], lineInLine || !!index);
                }
                if (inline.length === 1) {
                    body.push(inline[0]);
                } else {
                    body.push({
                        type: 'codes',
                        vars: vars,
                        body: inline
                    });
                }

            }
            return body;
        }
        pushReplacements(body: object[], vars: any, code: string, codeInline: boolean): object[] {
            // console.log(code, codeInline);
            code = code.trim();
            if (code) {
                let matches: any = code.match(matchExpr.index3);
                if (matches) {
                    body.push(this.walk({
                        posi: matches[1],
                        type: matches[2]
                    }, vars, codeInline));
                    let match_3 = matches[3].trim();
                    if (match_3) {
                        this.pushCodeElements(body, vars, match_3, true);
                    }
                    // if (matches[1]==94) {
                    // console.log(body);
                    // }
                } else {
                    // console.log(code, codeInline);
                    this.pushCodeElements(body, vars, code, codeInline);
                }
            }
            return body;
        }
        pushCodeElements(body: object[], vars: any,code: string, codeInline: boolean): object[] {
            let array = code.split(/(\s*[;\r\n]+)\s*/);
            while (array.length && !array[0].trim()) {
                array.shift();
            }
            for (let index = 0; index < array.length; index++) {
                let element = array[index].trim();
                if (element) {
                    body.push({
                        type: 'code',
                        vars: vars,
                        stype: (codeInline && !index) ? 'inline' : (element === ';' ? 'inline' : 'block'),
                        value: element
                    });
                }
            }
            return body;
        }
        generate(): Sugar {
            // console.log(this.replacements);
            // console.log(this.ast.body);
            let head: string[] = [];
            let body: string[] = [];
            let foot: string[] = [];
            this.pushHeader(head, this.imports);
            this.pushAlias(body, this.using_as);
            this.pushCodes(body, this.ast.vars, this.ast.body, 1);
            this.pushFooter(foot);
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
            codes.push("\r\n");
            if (this.configinfo==='{}'){
                codes.push("// ");
            }
            codes.push('tangram.config('+this.configinfo+');');
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
                codes.push("=imports['" + alias[key][0]);
                codes.push("']&&imports['" + alias[key][0]);
                if (alias[key][1]!==undefined){
                    codes.push("'][" + alias[key][1]+"];");
                }else{
                    codes.push("'];");
                }
            }
            return codes;
        }
        pushCodes(codes: string[], vars: any, array: any[], layer: number, codeInline: boolean = false): string[] {
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
                        switch (element.stype) {
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
                                if (codeInline) {
                                    codes.push(element.value);
                                } else {
                                    codes.push(indent + element.value);
                                }
                                break;
                        }
                        break;
                    case 'class':
                        this.pushClassCodes(codes, element, layer);
                        break;
                    case 'call':
                        // console.log(layer);
                        this.pushCallCodes(codes, element, layer);
                        break;
                    case 'array':
                        this.pushArrayCodes(codes, element, layer, codeInline);
                        break;
                    case 'codes':
                        // console.log(element);
                        this.pushCodes(codes, element.vars, element.body, layer + ((element.stype === 'local') ? 1 : 0), codeInline);
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
                    case 'expands':
                        this.pushExpandClassCodes(codes, element, layer);
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
            let toES6: boolean = false;
            if (element.subtype === 'stdClass') {
                cname = 'pandora.' + element.cname.trim();
                codes.push(indent1 + 'pandora.declareClass(\'' + element.cname.trim() + '\', ');
            } else {
                if (element.cname && element.cname.trim()) {
                    cname = element.cname.trim();
                    if (cname.match(/^[\$\w]+$/)) {
                        if (this.toES6) {
                            codes.push(indent1 + 'class ' + cname + ' ');
                            toES6 = true;
                        } else {
                            codes.push(indent1 + 'var ' + cname + ' = pandora.declareClass(');
                        }
                    } else {
                        codes.push(indent1 + cname + ' = pandora.declareClass(');
                    }
                } else {
                    if (this.toES6) {
                        codes.push(indent1 + 'class ');
                        toES6 = true;
                    } else {
                        codes.push('pandora.declareClass(');
                    }
                }
            }
            if (element.base) {
                if (toES6) {
                    codes.push('extends ' + element.base.trim() + ' ');
                } else {
                    codes.push(element.base.trim() + ', ');
                }
            }
            codes.push('{');
            // console.log(element);
            if (toES6) {
                for (let index = 0; index < element.body.length; index++) {
                    const member = element.body[index];
                    let elem: string[] = [];
                    // console.log(member);
                    switch (member.type) {
                        case 'method':
                            if (member.fname === '_init') {
                                member.fname === 'constructor'
                            }
                            elem.push(indent2 + member.fname + ' ');
                            this.pushFunctionCodes(elem, member, layer + 1);
                            // console.log(member.fname, elem);
                            elements.push(elem.join('').replace(/\s*function\s*\(/, '('));
                            break;

                        case 'prop':
                            elem.push(indent2 + member.pname + ' = ');
                            this.pushCodes(elem, member.vars, member.body, layer + 1, true);
                            static_elements.push(elem.join('') + ';');
                            break;

                        case 'setPropMethod':
                            elem.push(indent2 + 'set ' + member.fname + ' ');
                            this.pushFunctionCodes(elem, member, layer + 1);
                            elements.push(elem.join('').replace(/\s*function\s*\(/, '('));
                            break;

                        case 'getPropMethod':
                            elem.push(indent2 + 'get ' + member.fname + ' ');
                            this.pushFunctionCodes(elem, member, layer + 1);
                            elements.push(elem.join('').replace(/\s*function\s*\(/, '('));
                            break;

                        case 'staticMethod':
                            elem.push(indent2 + 'static ' + member.fname + ' ');
                            this.pushFunctionCodes(elem, member, layer + 1);
                            elements.push(elem.join('').replace(/\s*function\s*\(/, '('));
                            break;

                        case 'staticProp':
                            elem.push(indent2 + 'static ' + member.fname + ' = ');
                            this.pushCodes(elem, member.vars, member.body, layer + 1, true);
                            static_elements.push(elem.join('') + ';');
                            break;
                    }
                }
            } else {
                let overrides = {};
                let setters = [];
                let getters = [];
                let indent3 = "\r\n" + stringRepeat("\t", layer + 2);
                for (let index = 0; index < element.body.length; index++) {
                    const member = element.body[index];
                    let elem: string[] = [];
                    // console.log(member);
                    switch (member.type) {
                        case 'method':
                            elem.push(indent2 + member.fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 1);
                            if (this.toES6) {
                                elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            } else {
                                elements.push(elem.join(''));
                            }
                            break;

                        case 'overrideMethod':
                            overrides[member.fname] = overrides[member.fname] || {};
                            let argslen = member.args.length;
                            if (!overrides[member.fname][argslen]) {
                                let fname = overrides[member.fname][argslen] = '___override_method_' + member.fname + '_' + argslen;
                                elem.push(indent2 + fname + ': ');
                                this.pushFunctionCodes(elem, member, layer + 1);
                                if (this.toES6) {
                                    elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                                } else {
                                    elements.push(elem.join(''));
                                }
                            }
                            break;

                        case 'prop':
                            elem.push(indent2 + member.pname + ': ');
                            this.pushCodes(elem, member.vars, member.body, layer + 1, true);
                            elements.push(elem.join(''));
                            break;

                        case 'setPropMethod':
                            elem.push(indent3 + member.fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 2);
                            if (this.toES6) {
                                setters.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            } else {
                                setters.push(elem.join(''));
                            }
                            break;

                        case 'getPropMethod':
                            elem.push(indent3 + member.fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 2);
                            if (this.toES6) {
                                getters.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            } else {
                                getters.push(elem.join(''));
                            }
                            break;

                        case 'staticMethod':
                            elem.push(indent2 + member.fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 1);
                            if (this.toES6) {
                                static_elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            } else {
                                static_elements.push(elem.join(''));
                            }
                            break;

                        case 'staticProp':
                            elem.push(indent2 + member.pname + ': ');
                            this.pushCodes(elem, member.vars, member.body, layer + 1, true);
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

            // while (elements.length && !elements[0].trim()) {
            //     elements.shift();
            // }

            if (toES6) {
                if (elements.length) {
                    codes.push(elements.join(''));
                }
                codes.push(indent1 + '}');
            } else {
                if (elements.length) {
                    codes.push(elements.join(','));
                }
                codes.push(indent1 + '})');
                if (cname) {
                    // while (static_elements.length && !static_elements[0].trim()) {
                    //     static_elements.shift();
                    // }
                    if (static_elements.length) {
                        codes.push(';' + indent1 + 'pandora.extend(' + cname + ', {');
                        codes.push(static_elements.join(','));
                        codes.push(indent1 + '});');
                    } else {
                        codes.push(';');
                    }
                }
            }
            // console.log(elements, static_elements); 
            return codes;
        }
        pushExpandClassCodes(codes: string[], element: any, layer: number): string[] {
            let indent1 = "\r\n" + stringRepeat("\t", layer);
            let indent2 = "\r\n" + stringRepeat("\t", layer + 1);
            let elements: string[] = [];
            let static_elements: string[] = [];
            let cname: string = '';
            if (element.subtype === 'stdClass') {
                cname = 'pandora.' + element.cname.trim();
            } else {
                if (element.cname && element.cname.trim()) {
                    cname = element.cname.trim();
                } else {
                    return codes;
                }
            }
            codes.push(indent1 + 'pandora.extend(' + cname + '.prototype, ');
            if (element.base) {
                codes.push(element.base.trim() + ', ');
            }
            codes.push('{');
            // console.log(element);
            let overrides = {};
            let indent3 = "\r\n" + stringRepeat("\t", layer + 2);
            for (let index = 0; index < element.body.length; index++) {
                const member = element.body[index];
                let elem: string[] = [];
                // console.log(member);
                switch (member.type) {
                    case 'method':
                        elem.push(indent2 + member.fname + ': ');
                        this.pushFunctionCodes(elem, member, layer + 1);
                        if (this.toES6) {
                            elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                        } else {
                            elements.push(elem.join(''));
                        }
                        break;
                        
                    case 'overrideMethod':
                        overrides[member.fname] = overrides[member.fname] || {};
                        let argslen = member.args.length;
                        if (!overrides[member.fname][argslen]) {
                            let fname = overrides[member.fname][argslen] = '___override_method_' + member.fname + '_' + argslen;
                            elem.push(indent2 + fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 1);
                            if (this.toES6) {
                                elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            } else {
                                elements.push(elem.join(''));
                            }
                        }
                        break;

                    case 'prop':
                        elem.push(indent2 + member.pname + ': ');
                        this.pushCodes(elem, member.vars, member.body, layer + 1, true);
                        elements.push(elem.join(''));
                        break;

                    case 'staticMethod':
                        elem.push(indent2 + member.fname + ': ');
                        this.pushFunctionCodes(elem, member, layer + 1);
                        if (this.toES6) {
                            static_elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                        } else {
                            static_elements.push(elem.join(''));
                        }
                        break;

                    case 'staticProp':
                        elem.push(indent2 + member.pname + ': ');
                        this.pushCodes(elem, member.vars, member.body, layer + 1, true);
                        static_elements.push(elem.join(''));
                        break;
                }
            }
            this.pushOverrideMethod(elements, overrides, indent2, indent3);
            if (elements.length) {
                codes.push(elements.join(','));
            }
            codes.push(indent1 + '})');
            if (static_elements.length) {
                codes.push(';' + indent1 + 'pandora.extend(' + cname + ', {');
                codes.push(static_elements.join(','));
                codes.push(indent1 + '});');
            } else {
                codes.push(';');
            }
            // console.log(elements, static_elements); 
            return codes;
        }
        pushOverrideMethod(elements, overrides, indent2, indent3){
            for (const fname in overrides) {
                if (overrides.hasOwnProperty(fname)) {
                    let elem = [];
                    elem.push(indent2 + fname + ': ');
                    if (this.toES6) {
                        elem.push('(){');
                    } else {
                        elem.push('function(){');
                    }
                    const element = overrides[fname];
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
        }
        pushCallCodes(codes: string[], element: any, layer: number): string[] {
            let naming: string[] = this.pushCodes([], element.vars, element.name, layer, true);
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
            if (element.params.length) {
                let _layer = layer;
                let indent2;
                let _break = false;
                // console.log(element.params[0]);
                if (element.params[0].stype == "block") {
                    _layer++;
                    indent2 = "\r\n" + stringRepeat("\t", _layer);
                    codes.push(indent2);
                    _break = true;
                }
                for (let index = 0; index < element.params.length; index++) {
                    const param = element.params[index].body;
                    let paramCodes: string[] = this.pushCodes([], element.vars, param, _layer, true);
                    if (paramCodes.length) {
                        parameters.push(paramCodes.join('').trim());
                    }
                }
                while (parameters.length && !parameters[0].trim()) {
                    parameters.shift();
                }
                if (parameters.length) {
                    if (_break) {
                        codes.push(parameters.join(',' + indent2));
                    } else {
                        codes.push(parameters.join(', '));
                    }
                }
                // console.log(parameters);  
            }
            codes.push(')');
            // console.log(codes);
            return codes;
        }
        pushArrayCodes(codes: string[], element: any, layer: number, codeInline: boolean): string[] {
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
                    let elemCodes: string[] = this.pushCodes([], element.vars, body, _layer, true);
                    // let elem:string[] = this.pushCodes([], body, layer + 1);
                    if (elemCodes.length) {
                        elements.push(elemCodes.join('').trim());
                    }

                }
                while (elements.length && !elements[0].trim()) {
                    elements.shift();
                }
                if (elements.length) {
                    if (_break) {
                        codes.push(elements.join(',' + indent2));
                    } else {
                        codes.push(elements.join(', '));
                    }
                }
            }
            codes.push(']');
            // if (codeInline) {
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
            this.pushCodes(codes, element.vars, element.iterator, layer);
            codes.push(', ');
            this.pushFunctionCodes(codes, element.callback, layer);
            codes.push(', this);');
            codes.push(indent);
            return codes;
        }
        pushFunctionCodes(codes: string[], element: any, layer: number): string[] {
            let indent = "\r\n" + stringRepeat("\t", layer);
            if (element.type === 'def' && element.fname) {
                if ((element.subtype === 'var') || (element.subtype === 'let')) {
                    codes.push(indent + element.subtype + ' ' + element.fname + ' = function (');
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
            if (element.body.length) {
                this.pushCodes(codes, element.vars, element.body, layer + 1);
            } else {
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
            this.pushCodes(codes, element.vars.parent, element.head, layer, true);
            codes.push(') {');
            // console.log(element.body);
            this.pushCodes(codes, element.vars, element.body, layer + 1);
            codes.push(indent + '}');
            return codes;
        }
        pushDefineCodes(codes: string[], element: any, layer: number): string[] {
            let indent = "\r\n" + stringRepeat("\t", layer);
            if (element.subtype === 'namespace') {
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
            codes.push('{');
            if (element.body.length) {
                let elements: string[] = [];
                // console.log(element);
                for (let index = 0; index < element.body.length; index++) {
                    const member = element.body[index];
                    let elem: string[] = [];
                    // console.log(member);
                    switch (member.type) {
                        case 'method':
                            elem.push(indent2 + member.fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 1);
                            if (this.toES6) {
                                elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            } else {
                                elements.push(elem.join(''));
                            }
                            break;

                        case 'objProp':
                            elem.push(indent2 + member.pname + ': ');
                            this.pushCodes(elem, member.vars, member.body, layer + 1, true);
                            elements.push(elem.join(''));
                            break;
                    }
                }
                // while (elements.length && !elements[0].trim()) {
                //     elements.shift();
                // }
                if (elements.length) {
                    codes.push(elements.join(','));
                    codes.push(indent1);
                }
            }
            codes.push('}');
            return codes;
        }
        fixVariables(vars: any) {
            if (1) return;
            switch (vars.type) {
                case 'block':
                    vars.fixed = vars.parent;
                    for (let index = 0; index < vars.self.length; index++) {
                        const element = vars.self[index].split(/\s+/)[1];
                        while (!vars.fixed['includes'](element)) {
                            vars.fixed.push(element);
                        }
                    }

                    for (let index = 0; index < vars.self.length; index++) {
                        const element = vars.self[index].split(/\s+/)[1];
                        if (['pandora', 'global', 'imports', 'undefined']['includes'](element)) {
                            while (!vars.fixed['includes'](element)) {
                                vars.fixed.push(element);
                            }
                            let newname = element + '_1';
                            if (!vars.fix_map[newname]) {
                                vars.fixed.push(newname);
                                vars.fix_map[newname] = element;
                            }
                        } else {
                            if (vars.fix_map[element]) {
                                let newname = element + '_fixed';
                                vars.fixed.push(newname);
                                vars.fix_map[newname] = element;
                            } else {
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
            this.replacements = ['{}', '/=', '/', ' +', ' -', 'return'];
            string = this.replaceStrings(string);
            string = this.replaceOperators(string);
            // console.log(string);
            // return '';

            // 删除多余头部
            // string = string.replace(/^[,;\s]+[\r\n]+/g, "\r\n");
            string = string.replace(/^[,;\s]+/g, "\r\n\t");

            //去除多余符号
            string = string.replace(/\s*;(\s*;)+/g, ";");
            string = string.replace(/\s*;([^\s])/g, "; $1");

            string = string.replace(/(\{|\[|\(|\.|\:)\s*[,;]+/g, "$1");
            string = string.replace(/\s*[,;]+(\s*)(\.|\:|\)|\])/g, "$1$2");
            string = string.replace(/[,;\s]*(\=|\?|\:)[,;\s]*/g, " $1 ");
            string = string.replace(/([\r\n]*\s*[\$\w_])\s+(\:)/g, "$1$2");

            // // 关键字处理
            string = string.replace(/if\s*\(([^\)]+)\)\s*[,;]+/g, "if ($1)");
            string = string.replace(/([^\$\w])else\s*[,;]+/g, "$1else");
            // string = string.replace(/([^\s])\s*(instanceof)\s+/g, " $1 ");
            string = string.replace(/(,|;)?[\r\n]+(\s*)(var|delete|return)\s+/g, "$1\r\n$2$3 ");
            // string = string.replace(/(\s*)(return)\s*([\{\(}])/g, "$1$2 $3");

            // 删除多余换行
            string = string.replace(/\s*[\r\n]+([\r\n])?/g, "\r\n$1");

            string = this.restoreStrings(string);

            // 删除多余空白
            string = string.replace(/\{\s+\}/g, '{}');
            string = string.replace(/\[\s+\]/g, '[]');
            string = string.replace(/\(\s+\)/g, '()');
            string = string.replace(/(\(|\[)\s+([^\r\n])/g, "$1$2");
            string = string.replace(/([^\r\n])\s+(\)|\])/g, "$1$2");

            return string;

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
            // return string;
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
        min(): string {
            this.replacements = ['{}', '/=', '/', ' +', ' -', 'return'];
            let string = this.replaceStrings(this.output);
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
            string = this.restoreStrings(string);

            return string;
        }
        run(precall = null, callback = (content)=>{}) {
            if (!this.output) {
                this.compile();
            }
            precall && precall.call(this, this.output);
            eval(this.output);
            callback.call(this);
        }
    }

    return function (input, run) {
        return new Sugar(input, run);
    };
}));