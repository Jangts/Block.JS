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
        },
        replaceExpr = {
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
        },
        matchExpr = {
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
        maintag_posi: string
        namespace:string= ''
        namespace_posi: string
        markPattern: RegExp;
        trimPattern: RegExp;
        lastPattern: RegExp;
        stringReplaceTimes: number = 65536;
        positions: Array<string>[] = []
        replacements: Array<string>[]
        imports: any[] = []
        using_as: object = {}
        ast: any = {}
        mappings: Array<any>[]
        configinfo = '{}'
        configinfo_posi: string
        toES6 = false
        posimap:any[] = [];
        output: string | undefined
        tess = {}
        constructor(input: string, toES6: boolean = false, run: boolean = false) {
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
        compile(): Sugar {
            // console.log(this.input);
            let vars = {
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
            let lines = this.input.split(/\r{0,1}\n/);
            // console.log(lines);
            let positions = [];
            for (let line = 0; line < lines.length; line++) {
                const elements = lines[line].split(/(,|;|\{|\[|\(|\}|\sas\s|->|=>)/);
                // console.log(elements);
                let newline = []; 
                for (let posi = 0, length = 0; posi < elements.length; posi++) {
                    const element = elements[posi];
                    if(posi === 0){
                        length = 0;
                    }
                    if (element === ',' || element === ';' || element === '{' || element === '[' || element === '(' || element === '}' || element === ' as ' || element === '->' || element === '=>'){
                        newline.push(element);
                    }else{
                        newline.push('@0L' + line + 'P' + length + '::' + element);
                    }
                    length += element.length;
                }
                positions.push(newline);          
            }
            // positions[0][0] = positions[0][0].replace('@0L0P0::', '');
            let newlines = positions.map((line)=>{
                return line.join("");
            })
            this.positions.push(positions);
            let newcontent = newlines.join("\r\n");
            // console.log(this.positions);
            this.buildAST(this.pickReplacePosis(this.getLines(this.encode(newcontent), vars), vars), vars);
            // this.output = 'console.log("Hello, world!");';
            this.generate();
            // console.log(this.replacements);
            return this;
        }
        tidy(string){
            let on = true;
            while (on) {
                on = false;
                string = string.replace(/(@\d+L\d+P\d+O?\d*::\s*)+(@\d+L\d+P0::)/g, (match: string, last: string, newline: string) => {
                    // console.log(match);
                    on = true;
                    return "\r\n" + newline;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/[\r\n]*(@\d+L\d+P)0::(\s+)/g, (match, pre, space) => {
                    // console.log(pre, space);
                    on = true;
                    return "\r\n" + pre + space.length + 'O0::';
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(@\d+L\d+P)(\d+)::(\s+)/g, (match, pre, num, space) => {
                    // console.log(pre, num, space);
                    on = true;
                    return pre + (parseInt(num) + space.length) + 'O' + num + '::';
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(\{|\[|\(|\)|\]|\})\s*@\d+L\d+P\d+O?\d*::\s*(\{|\)|\]|\})/g, (match: string, before: string, atfer: string) => {
                    // console.log(match);
                    on = true;
                    return before + atfer;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/@\d+L\d+P([1-9]|\d\d+)::\s*(\)|\]|\})/g, (match: string, posi: string, panbrackets: string) => {
                    // console.log(match);
                    on = true;
                    return panbrackets;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(\s*@\d+L\d+P\d+O?\d*::)+(,|;)/g, (match: string, posi: string, panstop: string) => {
                    // console.log(match);
                    on = true;
                    return panstop;
                });
            }
            return string;
        }
        encode(string: string): string {
            // console.log(string);
            string = string
                .replace(replaceExpr.await, (match: string, gaps, preline, posi, gap) => {
                    this.isMainBlock = false;
                    if (gaps){
                        this.maintag_posi = posi;
                        if (!!gap) {
                            this.maintag_posi += 'O' + gap.length;
                        }
                    }else{
                        this.maintag_posi = '@0L0P0';
                    }
                    // console.log(gaps, preline, posi, !!gap, gap.length);
                    // console.log('This is not a main block.', this.maintag_posi);
                    return '';
                })
                .replace(replaceExpr.namespace, (match: string, posi, at, gap:string, namespace:string) => {
                    if (this.namespace===''){
                        this.namespace += namespace + '.';
                        this.namespace_posi = at;
                        if (gap) {
                            this.namespace_posi += 'O' + gap.length;
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
            string = string.replace(/(@\d+L\d+P\d+O?\d*::)?((public|static|set|get|om)\s+)?___boundary_[A-Z0-9_]{36}_(\d+)_as_string___\s*(\:|\(|\=)/g, (match, posi, desc, type, index, after)=>{
                // console.log(posi, desc, this.replacements[index][1]);
                if (this.replacements[index][1]){
                    return /*"\r\n" + */this.replacements[index][1] + '___boundary_' + index + '_as_propname___' + after;
                }
                if (desc){
                    return /*"\r\n" + */posi + desc + '___boundary_' + index + '_as_propname___' + after;
                }
                return /*"\r\n" + */'___boundary_' + index + '_as_propname___' + after;
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
        }
        replaceUsing(string: string): string {
            // console.log(string);
            return string.replace(replaceExpr.use, (match: string, posi, url, as, more, array) => {
                // console.log(match, posi, url, as, more, array);
                let index = this.replacements.length;
                if (array){
                    url = url.replace(array, '[]');
                }
                this.replacements.push([url, posi]);
                return '___boundary_' + this.uid + '_' + index + '_as_using___;';
            });
        }
        replaceStrings(string: string, ignoreComments:boolean = false): string {
            string = string.replace(/\\+(`|")/g, (match: string) => {
                let index = this.replacements.length;
                this.replacements.push([match]);
                return '___boundary_' + index + '_as_mark___';
            }).replace(/\\[^\r\n](@\d+L\d+P\d+O?\d*::)*/g, (match: string) => {
                let index = this.replacements.length;
                this.replacements.push([match]);
                return '___boundary_' + index + '_as_mark___';
            });

            let count: number = 0;
            let matches: any = string.match(matchExpr.string);

            while ((count < this.stringReplaceTimes) && matches) {
                count++;
                // console.log(count, matches );
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
                                if(ignoreComments){
                                    // console.log(true);
                                    string = string.replace(/\/\*{1,2}[\s\S]*?(\*\/|$)/, (match)=>{
                                        this.replacements.push([match]);
                                        return '___boundary_' + index + '_as_comments___';
                                    });
                                }else{
                                    string = string.replace(/\/\*{1,2}[\s\S]*?(\*\/|$)/, "");
                                }
                                matches = string.match(matchExpr.string);
                                continue;
                            case '/':
                                string = string.replace(/(\S*)\s*\/\/.*/, "$1");
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
                if (match && (matches.index >= match.index) && !match[6]) {
                    // console.log(matches, match);
                    if (match[1]){
                        this.replacements.push([match[2].replace(/@\d+L\d+P\d+O?\d*::/g, ''), match[1].trim(), match[4]]);
                    }else{
                        this.replacements.push([match[2].replace(/@\d+L\d+P\d+O?\d*::/g, ''), void 0, match[4]]);
                    }
                    string = string.replace(match[0], '___boundary_' + this.uid + '_' + index + stringas[matches[1]] + match[3] + match[4]);
                } else if (matches[0] === '/') {
                    string = string.replace(matches[0], '___boundary_2_as_operator___');
                } else {
                    // console.log(string, matches, match);
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
                    string = string.replace(replaceExpr.arraylike, (match: string, posi: string, elements: string) => {
                        // console.log(match);
                        elements = this.replaceBraces(elements);
                        elements = this.replaceParentheses(elements);
                        // match = this.replaceOperators(match, false);
                        let index = this.replacements.length;
                        this.replacements.push(['[' + elements + ']', posi && posi.trim()]);
                        return '___boundary_' + this.uid + '_' + index + '_as_array___';
                    });
                    left = string.indexOf('[');
                    right = string.indexOf(']');
                } else {
                    if (right >= 0) {
                        var index = right;
                    } else {
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
            if (string.match(replaceExpr.class)) {
                return string.replace(replaceExpr.class, (match: string, posi, body) => {
                    body = this.replaceParentheses(body);
                    // body = this.replaceOperators(body, false);
                    let index = this.replacements.length;
                    this.replacements.push([body, posi && posi.trim()]);
                    return '___boundary_' + this.uid + '_' + index + '_as_class___';
                });
            }

            if (string.match(replaceExpr.extends)) {
                return string.replace(replaceExpr.extends, (match: string, posi, body) => {
                    body = this.replaceParentheses(body);
                    // body = this.replaceOperators(body, false);
                    let index = this.replacements.length;
                    this.replacements.push([body, posi && posi.trim()]);
                    return '___boundary_' + this.uid + '_' + index + '_as_extends___';
                });
            }

            if (string.match(replaceExpr.fnlike)) {
                return string.replace(replaceExpr.fnlike, (match: string, posi, typewithgap, type, call, closure) => {
                    // console.log(match);
                    closure = this.replaceParentheses(closure);
                    call = this.replaceOperators(call, false);
                    match = (typewithgap || '')+ call + ' {' + closure + '}';
                    let index = this.replacements.length;
                    // console.log(match);
                    this.replacements.push([match, posi && posi.trim()]);
                    return '___boundary_' + this.uid + '_' + index + '_as_function___';
                });
            }

            return string.replace(replaceExpr.closure, (match: string, word: string, posi2, posi3, closure: string) => {
                // console.log(match, '|', word, '|', posi2, '|', posi3, '|', closure);
                if (!word && match.match(/\s*\{\s*\}/)) {
                    return '___boundary_0_as_mark___';
                }
                closure = this.replaceParentheses(closure);
                // closure = this.replaceOperators(closure, false);
                // console.log(closure);
                if (posi2) {
                    word = word.replace(posi2, '');
                    posi2 = posi2.trim();
                } else {
                    posi2 = '';
                }
                if (posi3) {
                    posi3 = posi3.trim();
                } else {
                    posi3 = '';
                }
                let index = this.replacements.length;
                if (word === '@config') {
                    if (this.configinfo === '{}') {
                        this.configinfo_posi = posi2 || posi3;
                        this.configinfo = this.decode(match.replace('@config', ''));
                    }
                    return '';
                }
                if (word === 'return') {
                    this.replacements.push(['{' + closure + '}']);
                    // console.log(posi2, posi3);
                    let index2 = this.replacements.length;
                    this.replacements.push(['return ', posi2]);
                    return '___boundary_' + index2 + '_as_preoperator___ ___boundary_' + this.uid + '_' + index + '_as_object___';
                }
                if (
                    (word && (word != 'return')) ||
                    (closure.indexOf(';') >= 0) ||
                    // !closure.match(/^\s*\{\s*(public|static|set|get|om)\s+)?(___boundary_[A-Z0-9_]{36}_(\d+)_as_function___|\|)(,|$)/)) {
                    closure.match(/^\s*___boundary_[A-Z0-9_]{36}_\d+_as_[^f]\w+___/)) {
                    // console.log(closure);
                    this.replacements.push(['{' + closure + '}', posi3]);
                    return posi2 + (word || '') + posi3 + ' ___boundary_' + this.uid + '_' + index + '_as_closure___;';
                }
                // console.log(closure);
                this.replacements.push(['{' + closure + '}', posi3]);
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
                    string = string.replace(replaceExpr.parentheses, (match, posi, paramslike: string) => {
                        // console.log(match, '=>', paramslike);
                        paramslike = this.replaceCalls(paramslike);
                        paramslike = this.replaceOperators(paramslike, false);
                        paramslike = this.replaceArrowFunctions(paramslike);
                        let index = this.replacements.length;
                        this.replacements.push(['(' + paramslike + ')', posi && posi.trim()]);
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
            // console.log(string);
            return string.replace(replaceExpr.call, (match: string, posi, fullname: string, constructor: string, methodname: string, dot, callname, args: string, argindex: string, after: string) => {
                if (fullname.match(replaceExpr.call)){
                    fullname = this.replaceCalls(fullname);
                }
                let index = this.replacements.length;
                if (constructor) {
                    this.replacements.push([fullname + args, posi && posi.trim()]);
                    return '___boundary_' + this.uid + '_' + index + '_as_construct___' + after;
                }else{
                    this.replacements.push([callname + args, posi && posi.trim()]);
                    if (dot){
                        return '.___boundary_' + this.uid + '_' + index + '_as_method___' + after;
                    }
                    return '___boundary_' + this.uid + '_' + index + '_as_call___' + after;
                }
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
                    this.replacements.push([' ' + word + ' ']);
                    return '___boundary_' + index + '_as_operator___';
                });
            }
            
            // console.log(string);
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.swords, (match: string, before: string, word: string, right: string) => {
                    // console.log(match, before, word);
                    on = true;
                    let index = this.replacements.length;
                    if ((word === 'typeof') || (word === 'instanceof')) {
                        // console.log(match, before, word)
                        this.replacements.push([' ' + word + ' ']);
                        before = before.trim()
                    } else {
                        this.replacements.push([word + ' ']);
                    }
                    return before + '___boundary_' + index + '_as_preoperator___' + right;
                });
            }

            on = true;
            while (on) {
                // console.log(string);
                on = false;
                string = string.replace(operators.mixed, (match: string, left: string, posi: string, op: string, right: string, sign: string) => {
                    // console.log(string);
                    // console.log(match, left, op, right, sign);
                    on = true;
                    if (sign) {
                        let _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '___boundary_' + _index + '_as_preoperator___');
                    }
                    let index = this.replacements.length;
                    if (toMin) {
                        this.replacements.push([op + '=']);
                    } else {
                        this.replacements.push([' ' + op + '= ']);
                    }
                    return left + '___boundary_' + index + '_as_operator___' + right;
                });
            }
            
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.bool, (match: string, left: string, posi: string, op: string, right: string, sign: string) => {
                    // console.log(match);
                    on = true;
                    if (sign) {
                        let _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '___boundary_' + _index + '_as_preoperator___');
                    }
                    let index = this.replacements.length;
                    if (toMin) {
                        this.replacements.push([op]);
                    } else {
                        this.replacements.push([' ' + op + ' ']);
                    }
                    return left + '___boundary_' + index + '_as_operator___' + right;
                });
            }
            
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.op, (match: string, left: string, posi: string, op: string, right: string, sign: string) => {
                    // console.log(match);
                    on = true;
                    if (sign) {
                        let _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '___boundary_' + _index + '_as_preoperator___');
                    }
                    let index = this.replacements.length;
                    if (toMin) {
                        this.replacements.push([op]);
                    } else {
                        this.replacements.push([' ' + op + ' ']);
                    }
                    return left + '___boundary_' + index + '_as_operator___' + right;
                });
            }

            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.sign, (match: string, before: string, posi: string, sign: string, number: string) => {
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
                    this.replacements.push([op]);
                    return '___boundary_' + index + '_as_preoperator___' + number;
                });
            }
            
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.after, (match: string, number: string, op: string) => {
                    on = true;
                    let index = this.replacements.length;
                    this.replacements.push([op]);
                    return number + '___boundary_' + index + '_as_aftoperator___';
                });
            }
            return string.replace(operators.error, (match: string, before: string, op: string, after: string) => {
                console.log(match, string);
                throw 'tangram.js sugar Error: Unexpected `' + op + '` in `' + this.decode(match) + '`';
            });
        }
        replaceArrowFunctions(string: string): string {
            let arrow = string.match(/(->|=>)/);
            // console.log(arrow);
            if (arrow) {
                if (string.match(replaceExpr.arrowfn)) {
                    // console.log(string.match(matchExpr.arrowfn));
                    return string.replace(replaceExpr.arrowfn, (match: string, params: string, paramsindex: string, arrow: string, body: string, end: string) => {
                        // console.log(match, params, paramsindex, arrow, body, end);
                        // console.log(body);
                        let posi = this.replacements[paramsindex][1];
                        // console.log(match);
                        // console.log(body);
                        let matches = body.match(/^\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_(parentheses|object|closure)___\s*$/);
                        // console.log(matches);
                        if (matches) {
                            let code = this.replacements[matches[1]][0];
                            let posi = this.replacements[matches[1]][1];
                            if (matches[2] === 'parentheses') {
                                body = code.replace(/^\(\s*(.*?)\s*\)$/, (match: string, code: string) => {
                                    let index = this.replacements.length;
                                    this.replacements.push(['return ', posi]);
                                    return '___boundary_' + index + '_as_preoperator___ ' + code;
                                });
                            } else {
                                // console.log(code);
                                body = code.replace(/(^\{|\}$)/g, '');
                            }
                        } else {
                            let index = this.replacements.length;
                            this.replacements.push(['return ', void 0]);
                            body = '___boundary_' + index + '_as_preoperator___ ' + body;
                            // console.log(body);
                        }
                        let index = this.replacements.length;
                        this.replacements.push([params + arrow + body, posi]);
                        return '___boundary_' + this.uid + '_' + index + '_as_arrowfn___' + end;
                    });
                } else {
                    // console.log(string);
                    throw 'tangram.js sugar Error: Unexpected `' + arrow[0] + '` in `' + this.decode(string.substr(arrow.index, 256)) + '`';
                }
            }
            return string;
        }
        getPosition(string:string){
            if (string){
                let match = string.match(/@(\d+)L(\d+)P(\d+)(O*)(\d*):*/);
                if (match) {
                    if (match[4]){
                        var ocol = parseInt(match[5]);
                    }else{
                        var ocol = parseInt(match[3]);
                    }
                    return {
                        match: match[0],
                        head: !ocol,
                        file: parseInt(match[1]),
                        line: parseInt(match[2]) + 1,
                        col: parseInt(match[3]) + 1,
                        o: [parseInt(match[1]), parseInt(match[2]), ocol]
                    }
                }
            }
            return void 0;
        }
        getLines(string: string, vars: any): object[] {
            string = string
                .replace(/::(var|let|public)\s+(@\d+L\d+P(\d+O)?0::)/g, '::$1 ')
                .replace(/([^,;\s])\s*(@\d+L\d+P(\d+O)?0::)/g, '$1;$2')
                .replace(/(___boundary_[A-Z0-9_]{36}_\d+_as_(class)___)([\r\n]+)/, "$1;\r\n");
            const array: string[] = string.split(/\s*;+\s*/);
            let lines: object[] = [];
            // console.log(array);
            for (let index = 0; index < array.length; index++) {
                const line = array[index].trim();
                // console.log(line);
                if (line) {
                    const spilitarray = line.split(/::(var|let|public)\s+/);
                    // console.log(spilitarray);
                    // continue;
                    if (spilitarray.length === 1) {
                        let errsymbol = line.match(/(^|\s+)(var|let|public)(\s+|$)/);
                        if (errsymbol) {
                            // console.log(line);
                            throw 'tangram.js sugar Error: Unexpected `' + errsymbol + '` in `' + this.decode(line) + '`.';
                        } else {
                            // console.log(line);
                            this.pushSentenceToLines(lines, line);
                        }
                    } else if (spilitarray.length === 3) {
                        var sentences = spilitarray[2].split(/,\s*(@\d+L\d+P\d+O?\d*::)/);
                        sentences.unshift(spilitarray[0]);
                        for (let p = 0; p < sentences.length; p+=2) {
                            this.pushVariablesToLine(lines, vars, sentences[p], sentences[p + 1], spilitarray[1]);
                        }
                        // console.log(spilitarray, sentences);
                    }else{
                        // console.log(spilitarray[3], spilitarray);
                        var position = this.getPosition(spilitarray[2]);
                        throw 'tangram.js sugar Error: Unexpected `' + spilitarray[3] + '` at char ' + position.col + ' on line ' + position.line + '， near ' + this.decode(spilitarray[2]) + '.';
                    }       
                }
            }
            // console.log(lines);
            return lines;
        }
        pushSentenceToLines(lines: any[], string: string) {
            string = string.trim();
            if (string && !string.match(/^@\d+L\d+P\d+O?\d*::$/)) {
                let match = string.match(/^___boundary_[A-Z0-9_]{36}_(\d+)_as_([a-z]+)___([\r\n]+|$)/);
                if (match) {
                    lines.push({
                        type: 'line',
                        subtype: match[2],
                        index: match[1],
                        value: string
                    });
                } else {
                    // console.log(string)
                    // string += ';';
                    let strings = string.split(',');
                    // console.log(strings);
                    for (let index = 0; index < strings.length; index++) {
                        let element = strings[index];
                        let position = this.getPosition(string) ;
                        // console.log(position, string)
                        if (position) {
                            position.head = true;
                            var value = element.replace(position.match, '');
                        }else{
                            var value = string.trim();
                            let match = value.match(/^___boundary_(\d+)_as_([a-z]+)___/);
                            // console.log(value, match, this.getPosition(this.replacements[match[1]][1]));
                            if(match&&this.replacements[match[1]][1]){
                                position = this.getPosition(this.replacements[match[1]][1]);
                                if (position){
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
        }
        pushVariablesToLine(lines: any, vars: any, posi: string, line: string, symbol: string) {
            if (line){   
                if (this.toES6 && symbol !== 'public') {
                    var _symbol = symbol;
                } else {
                    var _symbol = 'var';
                }
                let position = this.getPosition(posi);
                let array = line.split(/\s*=\s*/);
                // console.log(array);
                if (array.length === 1) {
                    var value = 'void 0';
                } else {
                    var value = array.pop();
                }
                for (let index = 0; index < array.length; index++) {
                    const element = array[index].trim();
                    if (element.match(/^[\$\w]+$/)) {
                        // console.log(element);
                        if (vars.self[element] === void 0) {
                            vars.self[element] = symbol;
                        } else if (vars.self[element] === 'let' || symbol === 'let') {
                            throw 'tangram.js sugar Error:  Variable `' + element + '` has already been declared at char ' + position.col + ' on line ' + position.line + '.';
                        }
                        position.head = true;
                        if(index){
                            lines.push({
                                type: 'line',
                                subtype: 'variable',
                                posi: position,
                                display: 'block',
                                value: _symbol + ' ' + element + ' = ' + value + ';'
                            });
                        }else{
                            lines.push({
                                type: 'line',
                                subtype: 'variable',
                                posi: position,
                                display:'inline',
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
                    } else {
                        // console.log(element);
                        throw 'tangram.js sugar Error: Unexpected Definition `' + symbol + ' at char ' + position.col + ' on line ' + position.line + '.';
                    }
                }
            }
        }
        pickReplacePosis(lines: any[], vars: any): object[] {
            let imports: any[] = [],
                using_as: any = {},
                preast: object[] = [];

            for (let index = 0; index < lines.length; index++) {
                // console.log(lines[index]);
                switch (lines[index].subtype) {
                    case 'sentence':
                        // console.log(lines[index]);
                        const line = lines[index].value.trim();
                        if (line) {
                            let inline = [];
                            const array: string[] = line.split('___boundary_' + this.uid);
                            while (!array[0].trim()) {
                                // console.log(true, array[0])
                                array.shift();
                            }
                            // console.log(array)
                            for (let i = 0; i < array.length; i++) {
                                let element = array[i].trim();
                                if (element){
                                    let matches: any = element.match(matchExpr.index3);
                                    // console.log(matches);
                                    if (matches) {
                                        let match_3: string = matches[3].trim();
                                        if (match_3) {
                                            inline.push({
                                                index: matches[1],
                                                type: matches[2]
                                            });
                                            var splits = match_3.split(/[\r\n]+/);
                                            for (let l = 0; l < splits.length; l++) {
                                                const element = splits[l].trim();
                                                if (element) {
                                                    this.pushCodeToAST(inline, vars, element, undefined, false);
                                                }
                                            }
                                        }else{
                                            if (array.length === 1){
                                                inline.push({
                                                    index: matches[1],
                                                    display: 'blcok',
                                                    type: matches[2]
                                                });
                                            }else{
                                                inline.push({
                                                    index: matches[1],
                                                    type: matches[2]
                                                });
                                            }
                                        }
                                    }else{
                                        // console.log(array[0], lines[index].posi);
                                        var splits = array[0].split(/[\r\n]+/);
                                        // console.log(splits, array.length);
                                        for (let l = 0; l < splits.length; l++) {
                                            const element = splits[l].trim();
                                            if (element) {
                                                this.pushCodeToAST(inline, vars, element, (l === 0) && lines[index].posi, (array.length === 1));
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
                            posi: lines[index].posi,
                            display: lines[index].display,
                            vars: vars,
                            value: lines[index].value.trim()
                        }]);
                        break;
                    case 'using':
                        // console.log(lines[index]);
                        let src = this.replacements[lines[index].index][0].replace(replaceExpr.using, '').replace(replaceExpr.return, '');
                        let posi = this.replacements[lines[index].index][1];
                        let srcArr = src.split(/\s+as\s+/);
                        // console.log(srcArr);
                        if (srcArr[1] && srcArr[1].trim()) {
                            src = srcArr[0].trim();
                            if (!imports['includes'](src)) {
                                imports.push(src);
                                imports.push(posi);
                            }
                            const array = srcArr[1].split(',');
                            // console.log(array);
                            for (let index = 0; index < array.length; index++) {
                                const element = array[index].trim();
                                if (element) {
                                    // console.log(element);
                                    let match = element.match(/^(@\d+L\d+P\d+::)\s*([\$\w]+)(\[\])?$/);
                                    let position = this.getPosition(match[1]);
                                    if (match[3]) {
                                        let alias = element.replace(match[0], match[2]);
                                        using_as[alias] = [src, position];
                                        var varname = alias;
                                        break;
                                    } else {
                                        let alias = element.replace(match[1], '');
                                        using_as[element] = [src, position, index];
                                        var varname = element;
                                    }
                                    if (vars.self[varname] === void 0) {
                                        vars.self[varname] = 'var';
                                    } else if (vars.self[varname] === 'let') {
                                        throw 'tangram.js sugar Error:  Variable `' + varname + '` has already been declared.';
                                    }
                                }
                            }
                        } else {
                            imports.push(src);
                            imports.push(posi);
                        }
                    break;
                    default:
                        preast.push([{
                            index: lines[index].index,
                            display: 'block',
                            type: lines[index].subtype
                        }]);
                        break;
                }
            }
            this.imports = imports;
            this.using_as = using_as;
            console.log(using_as);
            // console.log(imports, preast);
            return preast;
        }
        buildAST(preast: object[], vars: any): Sugar {
            console.log(preast);
            let ast = {
                type: 'codes',
                vars: vars,
                body: []
            };
            for (let index = 0; index < preast.length; index++) {
                let block: any = preast[index];
                if (block.length === 1) {
                    const element = block[0];
                    if (element.type === 'code') {
                        ast.body.push(element);
                    } else {
                        ast.body.push(this.walk(element, vars));
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
                            // console.log(index, element);
                            // element.display = index ? 'inline' : 'block';
                            codes.body.push(element);
                        } else {
                            codes.body.push(this.walk(element, vars));
                        }
                    }
                    ast.body.push(codes);
                }
            }
            // console.log(ast, this.replacements);
            this.ast = ast;
            return this;
        }
        pushBodyToAST(body: object[] = [], vars: any, code: string): object[] {
            let lines: any = code ? this.getLines(code, vars) : [];
            // console.log(lines);
            for (let index = 0; index < lines.length; index++) {
                switch (lines[index].subtype) {
                    case 'sentence':
                        const line = lines[index].value.trim();
                        this.pushSentencesToAST(body, vars, line, lines[index].posi);
                        break;

                    case 'variable':
                        body.push([{
                            type: 'code',
                            posi: lines[index].posi,
                            display: lines[index].display,
                            vars: vars,
                            value: lines[index].value.trim()
                        }]);
                        break;
                    default:
                        body.push(this.walk({
                            index: lines[index].index,
                            display: 'block',
                            type: lines[index].subtype
                        }, vars));
                        break;
                }
            }
            return body;
        }
        pushSentencesToAST(body: object[] = [], vars: any, code: string, position, isFullLine:boolean = true): object[] {
            if (code) {
                let inline = [];
                const array: string[] = code.split('___boundary_' + this.uid);
                // console.log(array);
                while (array.length && !array[0].trim()) {
                    array.shift();
                }
                // console.log(array);
                if (array.length === 1) {
                    this.pushReplacementsToAST(body, vars, array[0], position, isFullLine);
                } else {
                    for (let index = 0; index < array.length; index++) {
                        this.pushReplacementsToAST(inline, vars, array[index], position, false);
                    }
                    body.push({
                        type: 'codes',
                        vars: vars,
                        body: inline
                    });
                }
            }
            return body;
        }
        pushReplacementsToAST(body: object[], vars: any, code: string, position, onlyone: boolean): object[] {
            // console.log(code);
            code = code.trim();
            if (code) {
                let matches: any = code.match(matchExpr.index3);
                // console.log(code, matches);
                if (matches) {
                    let match_3: string = matches[3].trim();
                    if (match_3) {
                        body.push(this.walk({
                            index: matches[1],
                            type: matches[2]
                        }, vars));
                        var array = match_3.split(/[\r\n]+/);
                        for (let index = 0; index < array.length; index++) {
                            const element = array[index].trim();
                            if (element) {
                                this.pushCodeToAST(body, vars, element, undefined, onlyone);
                            }
                        }
                    }else{
                        if (onlyone){
                            body.push(this.walk({
                                index: matches[1],
                                display: 'block',
                                type: matches[2]
                            }, vars));
                        }else{
                            body.push(this.walk({
                                index: matches[1],
                                type: matches[2]
                            }, vars));
                        }
                    }
                } else {
                    var array = code.split(/[\r\n]+/);
                    // console.log(array);
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index].trim();
                        if (element) {
                            this.pushCodeToAST(body, vars, element, (index === 0) && position, onlyone);
                        }
                    }
                }
            }
            return body;
        }
        pushCodeToAST(body: object[], vars: any, code: string, position, onlyone: boolean): object[] {
            let display = 'inline';
            // console.log(code, position);
            position = position || this.getPosition(code);
            // console.log(code, position);
            if (position) {
                var element = code.replace(position.match, '').trim();
                if (position.head){
                    if (element.indexOf('.')===0) {
                        display = 'member';
                    } else if (onlyone) {
                        display = 'blcok';
                    }
                }
            } else {
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
        }
        walk(element: any, vars: any = false): object {
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
                    let that = this;
                    let position = this.getPosition(this.replacements[element.index][1]);
                    // console.log(position);
                    return {
                        type: 'code',
                        posi: position,
                        display: 'inline',
                        vars: vars,
                        value: this.replacements[element.index][0].replace(this.markPattern, function () {
                            return that.replacements[arguments[1]][0];
                        })
                    }
                default:
                    return {
                        type: 'code',
                        posi: void 0,
                        display: 'hidden',
                        vars: vars,
                        value: ""
                    }
            }
        }
        walkArray(index: number, display:any, vars: any): object {
            let body = [],
                position = this.getPosition(this.replacements[index][1]),
                array = this.replacements[index][0].replace(/([\[\s\]])/g, '').split(',');
            // console.log(this.replacements[index]);
            for (let index = 0; index < array.length; index++) {
                this.pushSentencesToAST(body, vars, array[index], this.getPosition(array[index]), false);
            }
            return {
                type: 'array',
                posi: position,
                display: 'inline',
                vars: vars,
                body: body
            };
        }
        walkArrowFn(index: number, display:any, vars: any) {
            let matches: any = this.replacements[index][0].match(matchExpr.arrowfn);
            // console.log(this.replacements[index], matches);
            let subtype = 'fn';
            let selfvas = {
                this: 'var',
                arguments: 'var'
            };
            if (matches[3] === '=>') {
                subtype = '=>';
                selfvas = {
                    this: 'let',
                    arguments: 'let'
                }
            }
            let localvars = {
                parent: vars,
                self: selfvas,
                fixed: [],
                fix_map: {},
                type: 'fnbody'
            };
            let args: any = this.checkArgs(this.replacements[matches[2]][0].replace(/(^\(|\)$)/g, ''), localvars);
            return {
                type: 'def',
                posi: this.getPosition(this.replacements[index][1]),
                display: 'inline',
                subtype: subtype,
                args: args.keys,
                defaults: args.vals,
                body: this.checkFnBody(localvars, args, matches[4])
            }
        }
        walkCall(index: number, display:any, vars: any, type: string): object {
            let name = [],
                params = [],
                matches: any = this.replacements[index][0].match(matchExpr.call),
                nameArr: string[] = matches[1].split('___boundary_' + this.uid),
                paramArr = this.replacements[matches[2]][0].split(/([\(,\)])/);
            // console.log(this.getLines(this.replacements[matches[2]][0], vars));
            // console.log(this.replacements[index], matches);
            for (let i = 0; i < nameArr.length; i++) {
                const element = nameArr[i];
                if (element) {
                    this.pushReplacementsToAST(name, vars, nameArr[i], undefined, false);
                }
            }
            // console.log(matches, paramArr);
            for (let index = 0; index < paramArr.length; index++) {
                const position = this.getPosition(paramArr[index]);
                if (position){
                    var element = paramArr[index].replace(position.match, '').trim();
                }else{
                    var element = paramArr[index].trim();
                }
                
                let line: string[] = element.split('___boundary_' + this.uid);
                if (element && element != '(' && element != ')' && element != ',') {
                    // console.log(index, element, position);
                    let inline: object[] = [];
                    for (let i = 0; i < line.length; i++) {
                        this.pushReplacementsToAST(inline, vars, line[i], (i===0)&&position, false);
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
        }
        walkClass(index: number, display:any, vars: any = true) {
            // console.log(this.replacements[index]);
            let matches: any = this.replacements[index][0].match(matchExpr.class);
            // console.log(matches);
            var type = matches[1];
            if (matches[2]){
                var subtype = 'stdClass';
            }else{
                if (type==='dec'){
                    var subtype = 'stdClass';
                }else{
                    var subtype = 'anonClass';
                }
            }
            let cname = matches[3] && matches[3].trim();
            if (type === 'class') {
                if (subtype === 'anonClass') {
                    if (cname){
                        if (vars.self[cname] === void 0) {
                            vars.self[cname] = 'var';
                        } else if (vars.self[cname] === 'let') {
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
            }
        }
        walkClosure(index: number, display:any, vars: any) {
            // console.log(this.replacements[index]);
            let localvars = {
                parent: vars,
                self: {},
                fixed: [],
                fix_map: {},
                type: 'codes'
            };
            let array = this.replacements[index][0].split(/\s*(\{|\})\s*/);
            let position = this.getPosition(this.replacements[index][1]);
            let body = this.pushBodyToAST([], localvars, array[2]);
            for (const varname in localvars.self) {
                if (localvars.self.hasOwnProperty(varname)) {
                    if (vars.self[varname] === void 0) {
                        vars.self[varname] = 'var';
                    } else if (vars.self[varname] === 'let') {
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
            }
        }
        walkExtends(index: number, display:any, vars: any) {
            // console.log(this.replacements[index]);
            let matches: any = this.replacements[index][0].match(matchExpr.extends);
            let position = this.getPosition(this.replacements[index][1]);
            let subtype: string = 'ext';
            let objname: string = matches[3];
            // console.log(matches);
            if ((matches[1] === 'ns') || (matches[1] === 'namespace')) {
                subtype = 'ns';
                let localvars = {
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
            }else{
                if (matches[2]){
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
            }
        }
        walkFnLike(index: number, display:any, vars: any, type: string) {
            // console.log(this.replacements[index]);
            let matches: any = this.replacements[index][0].match(matchExpr.fnlike);
            let fname = matches[3] !== 'function' ? matches[3] : '';
            // if (!matches) {
            //     console.log(posi, this.replacements);
            // } else {
            //     console.log((matches);
            // }
            if (type === 'def') {
                if (matches[1] == null){
                    if (reservedWords['includes'](fname)) {
                        const headline = matches[4];
                        let localvars = {
                            parent: vars,
                            self: {},
                            fixed: [],
                            fix_map: {},
                            type: 'codes'
                        };
                        if (fname === 'for') {
                            // console.log(matches);
                            const firstSentence = headline.split(/\s*;\s*/)[0];
                            const match = firstSentence.match(/^\s*(var|let)\s+([\$\w]+\s*=.+)$/);
                            // console.log(firstSentence, match);
                            if (match) {
                                this.pushVariablesToLine([], localvars, '', match[2], match[1]);
                            }
                            // console.log(localvars);
                        }
                        let head = this.pushSentencesToAST([], localvars, headline, this.getPosition(headline), false);
                        // let head = [], array = headline.split('___boundary_' + this.uid);
                        // for (let index = 0; index < array.length; index++) {
                        //     this.pushReplacementsToAST(head, localvars, array[index], this.getPosition(headline), false);
                        // }
                        let body = this.pushBodyToAST([], localvars, matches[5]);
                        for (const varname in localvars.self) {
                            if (localvars.self.hasOwnProperty(varname)) {
                                if (vars.self[varname] === void 0) {
                                    vars.self[varname] = 'var';
                                } else if (vars.self[varname] === 'let') {
                                    throw 'tangram.js sugar Error:  Variable `' + varname + '` has already been declared.';
                                }
                            }
                        }
                        return {
                            type: 'exp',
                            display: 'block',
                            vars: localvars,
                            expression: fname,
                            head: head,
                            body: body
                        };
                    }
                    if (fname === 'each') {
                        const condition = matches[4].match(matchExpr.travelargs);
                        // console.log(matches, condition);
                        if (condition) {
                            
                            let self = {
                                this: 'var',
                                arguments: 'var',
                            }, agrs: any[] = [];
                            if (condition[5]) {
                                if (condition[8]) {
                                    self[condition[4]] = 'var';
                                    self[condition[8]] = 'var';
                                    agrs = [[condition[4], condition[3]], [condition[8], condition[7]]];
                                } else {
                                    self[condition[4]] = 'var';
                                    agrs = [[condition[4], condition[3]]];
                                }
                            } else {
                                self['_index'] = 'var';
                                self[condition[4]] = 'var';
                                agrs = [['_index', undefined], [condition[4], condition[3]]];
                            }

                            let localvars = {
                                parent: vars,
                                self: self,
                                fixed: [],
                                fix_map: {},
                                type: 'travel'
                            };
                            let iterator = this.pushSentencesToAST([], localvars, condition[1], this.getPosition(condition[2]), false);
                            // let iterator = [], array = condition[1].split('___boundary_' + this.uid);
                            // for (let index = 0; index < array.length; index++) {
                            //     this.pushReplacementsToAST(iterator, localvars, array[index], this.getPosition(condition[1]), false);
                            // }

                            return {
                                type: 'travel',
                                display: 'block',
                                iterator: iterator,
                                vars: localvars,
                                callback: {
                                    type: 'def',
                                    display: 'inline',
                                    fname: '',
                                    args: agrs,
                                    body: this.pushBodyToAST([], localvars, matches[5])
                                }
                            }
                        }
                    }
                }
                var subtype = matches[2] === 'def' ? 'def' : 'fn';
                var position =  this.getPosition(this.replacements[index][1]);
                // console.log(matches);
                if (fname && display==='block') {
                    if (matches[2]) {
                        if ((matches[2] === 'var') || (matches[2] === 'let')) {
                            if (vars.self[fname] === void 0) {
                                vars.self[fname] = 'var';
                            } else if (vars.self[fname] === 'let' || matches[2] === 'let') {
                                throw 'tangram.js sugar Error:  Variable `' + fname + '` has already been declared.';
                            }
                            subtype = this.toES6 ? matches[2] : 'var';
                        } else if (matches[2] === 'public') {
                            subtype = 'public'
                            // console.log(matches[5]);
                        }
                    }
                } else { 
                    if (matches[2] === 'public') {
                        subtype = 'public';
                        display = 'block';
                        // console.log(matches[5]);
                    }
                }
            }
            
            let localvars = {
                parent: vars,
                self: {
                    this: 'var',
                    arguments: 'var'
                },
                fixed: [],
                fix_map: {},
                type: 'fnbody'
            };
            let args: any = this.checkArgs(matches[4], localvars);
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
            }
        } 
        walkParentheses(index: number, display:undefined, vars: any): object {
            let body = [],
                array = this.replacements[index][0].replace(/([\[\s\]])/g, '').split(/\s*([,\r\n]+)/);
            for (let index = 0; index < array.length; index++) {
                this.pushSentencesToAST(body, vars, array[index], this.getPosition(array[index]), false);
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
        }
        walkObject(index: number, display:any, vars: any = true) {
            return {
                type: 'object',
                posi: this.getPosition(this.replacements[index][1]),
                vars: vars,
                body: this.checkObjMember(vars, this.replacements[index][0])
            };
        }
        checkProp(vars: any, posi, type: string, attr: string[], array: string[]): object {
            // console.log(posi);
            // console.log(type, posi, attr, array);
            let position = this.getPosition(posi);
            position.head = true;
            // console.log(position);
            if (array.length > 1) {
                let body = [];
                if (attr[6]) {
                    body.push({
                        type: 'code',
                        posi: void 0,
                        display: 'inline',
                        vars: vars,
                        value: attr[6].trim()
                    });
                }
                for (let index = 1; index < array.length; index++) {
                    const element = array[index];
                    const matches: any = element.trim().match(matchExpr.index3);
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
                    } else {
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
        }
        checkClassBody(vars: any, code: string): object[] {
            // console.log(code);
            let body = [],
                array = code.replace('_as_function___', '_as_function___;').split(/[;,\r\n]+/);
                // console.log(code);
            for (let index = 0; index < array.length; index++) {
                let element = array[index].trim();
                let type: string = 'method';
                // console.log(element);
                if (element) {
                    let elArr = element.split('___boundary_' + this.uid);
                    // console.log(elArr);
                    if (elArr[0] && elArr[0].trim()) {
                        let match_0 = elArr[0].match(matchExpr.classelement);
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
                                    } else {
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
                        let match_1: any = elArr[1].trim().match(matchExpr.index);
                        if (match_1[2] === 'function') {
                            body.push(this.walkFnLike(parseInt(match_1[1]), 'inline', vars, type));
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
                        } else {
                            // console.log(elArr);
                        }
                    } else {
                        // console.log(elArr);
                        for (let i = 1; i < elArr.length; i++) {
                            const match = elArr[i].trim().match(matchExpr.index3);
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
        }
        checkArgs(code: string, localvars): object {
            let args = code.split(/\s*,\s*/),
                keys = [],
                keysArray = void 0,
                vals = [];
            // console.log(code, args);
            for (let index = 0; index < args.length; index++) {
                let arg = args[index];
                if (arg) {
                    let array = arg.split(/\s*=\s*/);
                    let position = this.getPosition(array[0]);
                    if (position) {
                        var varname = array[0].replace(position.match, '');
                    } else {
                        var varname = array[0];
                    }
                    // console.log(arg, array, position, varname);
                    if (varname.match(namingExpr)) {
                        keys.push([varname, position]);
                        vals.push(array[1]);
                        localvars.self[varname] = 'var';
                    } else if (varname.match(argsExpr)) {
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
            }
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
                            posi: args.keys[index][1],
                            display: 'block',
                            value: 'if (' + args.keys[index][0] + ' === void 0) { ' + args.keys[index][0] + ' = ' + valArr[0]
                        });
                        this.pushReplacementsToAST(body, vars, valArr[1], this.getPosition(args.vals[index]), false);
                        body.push({
                            type: 'code',
                            posi: void 0,
                            display: 'inline',
                            value: '; }'
                        });
                    } else {
                        body.push({
                            type: 'code',
                            posi: args.keys[index][1],
                            display: 'block',
                            value: 'if (' + args.keys[index][0] + ' === void 0) { ' + args.keys[index][0] + ' = ' + valArr[0] + '; }'
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
        }
        generate(): Sugar {
            // console.log(this.replacements);
            // console.log(this.ast.body);
            let head: string[] = [];
            let body: string[] = [];
            let foot: string[] = [];
            this.fixVariables(this.ast.vars);
            this.pushHeader(head, this.imports);
            this.pushAlias(body, this.using_as);
            this.pushCodes(body, this.ast.vars, this.ast.body, 1, this.namespace);
            this.pushFooter(foot);
            this.output = head.join('') + this.trim(body.join('')) + foot.join('');
            // console.log(this.output);
            return this;
        }
        pushPostionsToMap(position, codes: string[]|undefined=undefined){
            if (position){
                let index = this.posimap.length;
                this.posimap.push(position);
                let replace = '/* @posi' + index + ' */';
                if (codes){
                    codes.push(replace);
                }
                return replace;
            }
            return '';
        }
        pushHeader(codes: string[], array: any[]): string[] {
            codes.push('/*!');
            codes.push("\r\n" + ' * tangram.js framework sugar compiled code');
            codes.push("\r\n" + ' *');
            codes.push("\r\n" + ' * Datetime: ' + (new Date()).toUTCString());
            codes.push("\r\n" + ' */');
            codes.push("\r\n" + ';');

            codes.push("\r\n");
            if (this.configinfo === '{}') {
                codes.push("// ");
            }else{
                this.pushPostionsToMap(this.getPosition(this.configinfo_posi), codes);
            }
            codes.push('tangram.config(' + this.configinfo + ');');
            codes.push("\r\n" + 'tangram.block([');
            if (this.imports.length) {
                let imports:string[] = [];
                for (let index = 0; index < this.imports.length; index+=2) {
                    imports.push(this.pushPostionsToMap(this.getPosition(this.imports[index + 1])) + "'" + this.imports[index] + "'");
                }
                // console.log(this.imports, imports);
                codes.push("\r\n\t" + imports.join(",\r\n\t") + "\r\n");
            }
            codes.push('], function (pandora, global, imports, undefined) {');
            return codes;
        }
        pushAlias(codes: string[], alias: any): string[] {
            // console.log(alias);
            for (const key in alias) {
                // let position = this.getPosition(key);
                // let _key = key.replace(position.match, '').trim();
                codes.push("\r\n\t" + this.pushPostionsToMap(alias[key][0]) + "var " + key);
                codes.push(" = imports['" + alias[key][0]);
                codes.push("']&&imports['" + alias[key][0]);
                if (alias[key][2] !== undefined) {
                    codes.push("'][" + alias[key][2] + "];");
                } else {
                    codes.push("'];");
                }
            }
            return codes;
        }
        pushCodes(codes: string[], vars: any, array: any[], layer: number, namespace: string = this.namespace): string[] {
            // console.log(codes, array);
            // console.log(array);
            // console.log(layer, array);
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                // console.log(element);
                this.pushElement(codes, vars, element, layer, namespace);
            }
            // this.fixVariables(vars);
            return codes;
        }
        pushElement(codes: string[], vars: any, element:any, layer: number, namespace: string = this.namespace): string[] {
            let indent = "\r\n" + stringRepeat("\t", layer);
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
                        var code: string = this.patchVariables(element.value, vars);
                        if (element.display === 'block') {
                            codes.push(indent + this.pushPostionsToMap(element.posi) + code);
                        } else {
                            if (element.posi) {
                                if (element.posi.head) {
                                    codes.push(indent);
                                    if(element.display==='member'){
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
        }
        pushArrayCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let elements: string[] = [];
            if(element.posi){
                this.pushPostionsToMap(element.posi, codes);
            }
            codes.push('[');
            if (element.body.length) {
                let _layer = layer;
                let indent2;
                let _break = false;
                // console.log(element.body[0]);
                if (element.body[0].posi && element.body[0].posi.head) {
                    _layer++;
                    indent2 = "\r\n" + stringRepeat("\t", _layer);
                    codes.push(indent2);
                    _break = true;
                }
                // console.log(element.body);
                for (let index = 0; index < element.body.length; index++) {
                    if (element.body[index].value){
                        elements.push(this.pushPostionsToMap(element.body[index].posi) + element.body[index].value);
                    }else{
                        let elemCodes: string[] = [];
                        this.pushPostionsToMap(element.body[index].posi, elemCodes)
                        this.pushElement(elemCodes, element.vars, element.body[index], _layer, namespace);
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
                    } else {
                        codes.push(elements.join(', '));
                    }
                }
            }
            codes.push(']');
            return codes;
        }
        pushCallCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let naming: string[] = this.pushCodes([], element.vars, element.name, layer, namespace);
            // console.log(element);
            if (element.posi) {
                if(element.type==='method'){
                    element.posi.head = false;
                }
                if (element.posi.head) {
                    var indent = "\r\n" + stringRepeat("\t", layer);
                    codes.push(indent);
                }
                this.pushPostionsToMap(element.posi, codes);
            }
            let name = naming.join('');
            if (name === 'new') {
                codes.push('new (');
            } else {
                if (element.type === 'construct') {
                    codes.push('new ');
                }
                codes.push(name + '(');
            }

            let parameters: string[] = [];
            if (element.params.length) {
                let _layer = layer;
                let indent2;
                let _break = false;
                // console.log(element.params[0]);
                if ((element.params.length > 1) && element.params[0].posi && element.params[0].posi.head) {
                    // console.log(true);
                    _layer++;
                    indent2 = "\r\n" + stringRepeat("\t", _layer);
                    // codes.push(indent2);
                    _break = true;
                }
                for (let index = 0; index < element.params.length; index++) {
                    const param = element.params[index].body;
                    let paramCodes: string[] = [];
                    this.pushPostionsToMap(element.params[index].posi, paramCodes)
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
                    } else {
                        codes.push(parameters.join(', '));
                    }
                }
            }
            // console.log(element.display);
            if(element.display==='block'){
                codes.push(');');
            }else{
                codes.push(')');
            }
            return codes;
        }
        pushClassCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let indent1 = "\r\n" + stringRepeat("\t", layer);
            let indent2 = "\r\n" + stringRepeat("\t", layer + 1);
            let elements: string[] = [];
            let static_elements: string[] = [];
            let cname: string = '';
            let toES6: boolean = false;
            if (element.subtype === 'stdClass') {
                cname = 'pandora.' + namespace + element.cname.trim();
                codes.push(indent1 + this.pushPostionsToMap(element.posi) + 'pandora.declareClass(\'' + namespace + element.cname.trim() + '\', ');
            } else {
                if (element.cname && element.cname.trim()) {
                    cname = element.cname.trim();
                    if (cname.match(/^[\$\w]+$/)) {
                        if (this.toES6) {
                            codes.push(indent1 + this.pushPostionsToMap(element.posi) + 'class ' + cname + ' ');
                            toES6 = true;
                        } else {
                            codes.push(indent1 + 'var ' + this.pushPostionsToMap(element.posi) + cname + ' = ' + 'pandora.declareClass(');
                        }
                    } else {
                        codes.push(indent1 + this.pushPostionsToMap(element.posi) + cname + ' = ' + 'pandora.declareClass(');
                    }
                } else {
                    this.pushPostionsToMap(element.posi, codes)
                    if (this.toES6) {
                        codes.push('class ');
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
                            this.pushFunctionCodes(elem, member, layer + 1, namespace);
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
                                this.pushFunctionCodes(elem, member, layer + 1, namespace);
                                if (this.toES6) {
                                    elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                                } else {
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
                            } else {
                                setters.push(elem.join(''));
                            }
                            break;

                        case 'getPropMethod':
                            elem.push(indent3 + member.fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 2, namespace);
                            if (this.toES6) {
                                getters.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            } else {
                                getters.push(elem.join(''));
                            }
                            break;

                        case 'staticMethod':
                            elem.push(indent2 + member.fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 1, namespace);
                            if (this.toES6) {
                                static_elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            } else {
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
            } else {
                if (elements.length) {
                    codes.push(elements.join(','));
                }
                codes.push(indent1 + '})');
                if (cname) {
                    if (static_elements.length) {
                        codes.push(';' + indent1 + 'pandora.extend(' + cname + ', {');
                        codes.push(static_elements.join(','));
                        codes.push(indent1 + '});');
                    } else {
                        codes.push(';');
                    }
                    codes.push(indent1);
                }
            }
            return codes;
        }
        pushFunctionCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let indent = "\r\n" + stringRepeat("\t", layer);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            }else{
                var posi = '';
            }
            if (element.type === 'def' && element.fname) {
                if ((element.subtype === 'var') || (element.subtype === 'let')) {
                    codes.push(indent + posi + element.subtype + ' ' + element.fname + ' = function (');
                } else if ((element.subtype === 'public')) {
                    codes.push(indent + posi + 'pandora.' + namespace + element.fname + ' = function (');
                } else {
                    codes.push(indent + posi + 'function ' + element.fname + ' (');
                }
            } else {
                codes.push(posi + 'function (');
            }

            if (element.args.length) {
                let args: string[] = [];
                for (let index = 0; index < element.args.length; index++) {
                    args.push(this.pushPostionsToMap(element.args[index][1]) + element.args[index][0]);
                }
                codes.push(args.join(', '));
            }

            codes.push(') {');
            // console.log(element.body);
            if (element.body.length) {
                // console.log(element.body);
                this.pushCodes(codes, element.vars, element.body, layer + 1, namespace);
            } else {
                indent = '';
            }
            // console.log(element.display, element.subtype);
            if ((element.subtype === 'var') || (element.subtype === 'let')) {
                codes.push(indent + '};');
                codes.push(indent);
            } else {
                codes.push(indent + '}');
            }
            return codes;
        }
        pushExtendsCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let indent1 = "\r\n" + stringRepeat("\t", layer);
            let indent2 = "\r\n" + stringRepeat("\t", layer);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            } else {
                var posi = '';
            }
            if (element.subtype === 'ns') {
                codes.push(indent2 + posi + 'pandora.ns(\'' + namespace + element.oname.trim() + '\', function () {');
                this.pushCodes(codes, element.vars, element.body, layer + 1, namespace + element.oname.trim() + '.');
                // console.log(element.body);
                codes.push(indent2 + '}');
            } else if (element.subtype === 'extns') {
                codes.push(indent1 + posi + 'pandora.ns(\'' + namespace + element.oname.trim() + '\', ');
                this.pushObjCodes(codes, element, layer, namespace);
            } else {
                codes.push(indent1 + posi + 'pandora.extend(' + element.oname + ', ');
                this.pushObjCodes(codes, element, layer, namespace);
            }
            codes.push(');');
            codes.push(indent1);
            return codes;
        }
        pushExpressionCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let indent1 = "\r\n" + stringRepeat("\t", layer);
            let indent2 = "\r\n" + stringRepeat("\t", layer);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            } else {
                var posi = '';
            }
            if (element.type === 'closure') {
                codes.push(' {');
            }else{
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
        }
        pushExpandClassCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let indent1 = "\r\n" + stringRepeat("\t", layer);
            let indent2 = "\r\n" + stringRepeat("\t", layer + 1);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            } else {
                var posi = '';
            }
            let elements: string[] = [];
            let static_elements: string[] = [];
            let cname: string = '';
            if (element.subtype === 'stdClass') {
                cname = 'pandora.' + namespace + element.cname.trim();
            } else {
                if (element.cname && element.cname.trim()) {
                    cname = element.cname.trim();
                } else {
                    return codes;
                }
            }
            codes.push(indent1 + posi + 'pandora.extend(' + cname + '.prototype, ');
            // if (element.base) {
            //     codes.push(element.base.trim() + ', ');
            // }
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
                        this.pushFunctionCodes(elem, member, layer + 1, namespace);
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
                            this.pushFunctionCodes(elem, member, layer + 1, namespace);
                            if (this.toES6) {
                                elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            } else {
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
                        } else {
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
            } else {
                codes.push(';');
            }
            codes.push(indent1);
            // console.log(elements, static_elements); 
            return codes;
        }
        pushOverrideMethod(elements, overrides, indent2, indent3) {
            for (const fname in overrides) {
                if (overrides.hasOwnProperty(fname)) {
                    console.log(overrides[fname]);
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
        pushTravelCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let indent = "\r\n" + stringRepeat("\t", layer);
            // console.log(element);
            codes.push(indent + 'pandora.each(');
            this.pushCodes(codes, element.vars, element.iterator, layer, namespace);
            codes.push(', ');
            this.pushFunctionCodes(codes, element.callback, layer, namespace);
            codes.push(', this);');
            codes.push(indent);
            return codes;
        }
        pushObjCodes(codes: string[], element: any, layer: number, namespace:string) {
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
                            this.pushFunctionCodes(elem, member, layer + 1, namespace);
                            if (this.toES6) {
                                elements.push(elem.join('').replace(/\:\s+function\s*\(/, '('));
                            } else {
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
        }
        closurecount : number = 0;
        fixVariables(vars: any) {
            this.closurecount++;
            // console.log(vars.type, vars);
            if(1){
                for (let index = 0; index < vars.self.length; index++) {
                    const element = vars.self[index].split(/\s+/)[1];
                    if (['pandora', 'global', 'imports', 'undefined']['includes'](element)) {
                        if (!vars.fix_map[element]){
                            let i = 1;
                            let newname = element + '_' + i;
                            while (vars.fixed['includes'](newname)){
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
        patchVariables(code: string, vars: any): string {
            // console.log(code, vars);
            if (code){
                // console.log(code);
                return code.replace(/(^|[^\$\w\.]\s*)([\$a-z_][\$\w]*)(\*[\$\w]|$)/i, (match, before, varname, after) => {
                    // console.log(match, before, varname, after);
                    return before + this.patchVariable(varname, vars) + after;
                });
            }
            // console.log(code);
            return '';
        }
        patchVariable(varname: string, vars: any): string {
            // console.log(varname, vars);
            return varname;
        }
        pushFooter(codes: string[]): string[] {
            if (this.isMainBlock) {
                codes.push("\r\n" + '}, true);');
            } else {
                codes.push("\r\n" + '});');
            }
            return codes;
        }
        decode(string: string): string {
            string = string.replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
            let matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
            while (matches) {
                // console.log(matches, this.replacements[matches[2]]);
                string = string.replace(matches[0], this.replacements[matches[2]]).replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
                matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
            }
            // console.log(string);
            return string.replace(/(@\d+L\d+P\d+O?\d*::)/g, '');
        }
        trim(string: string): string {
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
        }
        restoreStrings(string: string, last:boolean): string {
            let that = this;
            if(last){
                var pattern = this.lastPattern;
            } else {
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
        }
        min(): string {
            this.replacements = [['{}'], ['/='], ['/'], [' +'], [' -'], ['return ']];
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
            string = this.restoreStrings(string, false);

            return string;
        }
        run(precall = null, callback = (content) => { }) {
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