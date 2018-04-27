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
            mixed: /([\$\w])\s*(@\d+L\d+P\d+O*\d*::)?(\=\=|\!\=|\=|\!|\+|\-|\*|\/|\%|<<|>>|>>>|\&|\^|\||<|>)=\s*((\+|\-)?[\$\w\.])/g,
            bool: /([\$\w])\s*(@\d+L\d+P\d+O*\d*::)?(\&\&|\|\||\<|\<\<|\>\>\>|\>\>|\>)\s*((\+|\-)?[\$\w\.])/g,
            op: /([\$\w])\s*(@\d+L\d+P\d+O*\d*::)?(\+|\-|\*\*|\*|\/|\%)\s*((\s+(\+|\-))?[\$\w\.])/g,
            owords: /\s+(in|of)\s+/g,
            sign: /(^|\s*[^\+\-])(@\d+L\d+P\d+O*\d*::)?(\+|\-)([\$\w\.])/g,
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
            use: /(@\d+L\d+P\d+O*\d*::)\s*use\s+([\$\w\.\s\/\\]+(,(@\d+L\d+P\d+O*\d*::)?[\$\w\.\s\/\\]+)?(\[\])?)[;\r\n]/g,
            include: /\s*@include\s+[\$\w\.\s\/\\]+?[;\r\n]+/g,
            
            return: /[\s;\r\n]+$/g,
            extends: /(@\d+L\d+P\d+O*\d*::)?((ns|namespace|stroe|extends)\s+[\$\w\.]+\s*\{[^\{\}]*?\})/g,
            class: /(@\d+L\d+P\d+O*\d*::)?((class|expands)\s+([\$\w\.]+\s+)?(extends\s+[\$\w\.]+\s*)?\{[^\{\}]*?\})/g,
            fnlike: /(@\d+L\d+P\d+O*\d*::)?(^|(var|public|let|function|def)\s+)?([\$\w]*\s*\([^\(\)]*\))\s*\{([^\{\}]*?)\}/g,
            parentheses: /(@\d+L\d+P\d+O*\d*::)?\(\s*([^\(\)]*?)\s*\)/g,
            arraylike: /(@\d+L\d+P\d+O*\d*::)?\[(\s*[^\[\]]*?)\s*\]/g,
            call: /(@\d+L\d+P\d+O*\d*::)?((new)\s+([\$\w\.]+)|(\.)?([\$\w]+))\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*([^\$\w\s\{]|[\r\n].|\s*___boundary_[A-Z0-9_]{36}_\d+_as_array___|\s*___boundary_\d+_as_operator___|$)/g,
            arrowfn: /(@\d+L\d+P\d+O*\d*::)?(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*(@\d+L\d+P\d+O*\d*::)?(->|=>)\s*([^,;\r\n]+)\s*(,|;|\r|\n|$)/g,
            closure: /((@\d+L\d+P\d+O*\d*::)?@*[\$\w]+|\)(@\d+L\d+P\d+O*\d*::)?)?\s*\{(\s*[^\{\}]*?)\s*\}/g            
        },
        matchExpr = {
            string: /(\/|\#|`|"|')([\*\/\=])?/,
            strings: {
                // 位置是在replace usings 和 strings 之后才tidy的，所以还存在后接空格
                '/': /(\s*@\d+L\d+P\d+O?\d*::\s*)?(\/[^\/\r\n]+\/[img]*)\s*(\sin\s|___boundary_\d+_as_(propname|preoperator|operator|aftoperator|comments)___|([\$\w])|[^\$\w]|$)/,
                '`': /(\s*@\d+L\d+P\d+O*\d*::\s*)?(`[^`]*`)\s*(\sin\s|___boundary_\d+_as_(propname|preoperator|operator|aftoperator|comments)___|([\$\w])|[^\$\w]|$|$)/,
                '"': /(\s*@\d+L\d+P\d+O*\d*::\s*)?("[^\"\r\n]*")\s*(\sin\s|___boundary_\d+_as_(propname|preoperator|operator|aftoperator|comments)___|([\$\w])|[^\$\w]|$)/,
                "'": /(\s*@\d+L\d+P\d+O*\d*::\s*)?('[^\'\r\n]*')\s*(\sin\s|___boundary_\d+_as_(propname|preoperator|operator|aftoperator|comments)___|([\$\w])|[^\$\w]|$)/
            },
            index: /(\d+)_as_([a-z]+)/,
            index3: /^_(\d+)_as_([a-z]+)___([\s\S]*)$/,
                     
            extends: /(ns|namespace|store|extends)\s+(\.)?([\$\w\.]+)\s*\{([^\{\}]*?)\}/,
            class: /(class|dec|expands)\s+(\.)?([\$\w\.]+\s+)?(extends\s+([\$\w\.]+)\s*)?\{([^\{\}]*?)\}/,
            fnlike: /(^|(var|public|let|function|def)\s+)?([\$\w]*)\s*\(([^\(\)]*)\)\s*\{([^\{\}]*?)\}/,
            call: /([\$\w][\$\w\.]*)\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___/,
            arrowfn: /(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*(->|=>)\s*([^,;\r\n]+)/,

            objectattr: /^\s*((([\$\w]+)))\s*(\:*)([\s\S]*)$/,
            classelement: /^\s*((public|static|set|get|om)\s+)?([\$\w]*)\s*(\=*)([\s\S]*)$/,
            travelargs: /^((@\d+L\d+P\d+O*\d*::)?[\$a-zA-Z_][\$\w\.-]+)\s+as\s+([\$\w]+)(\s*,((@\d+L\d+P\d+O*\d*::)?([\$\w]*)))?/
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
        constructor(input: string, toES6: boolean = false, run: boolean = false) {
            this.uid = boundaryMaker();
            this.markPattern = new RegExp('___boundary_(\\\d+)_as_(mark)___', 'g');
            this.trimPattern = new RegExp('(___boundary_' + this.uid + '_(\\\d+)_as_(string|pattern|template)___|___boundary_(\\\d+)_as_(propname)___)', 'g');
            this.lastPattern = new RegExp('(___boundary_' + this.uid + '_(\\\d+)_as_(string|pattern|template)___|___boundary_(\\\d+)_as_(propname|preoperator|operator|aftoperator|comments)___)', 'g');
            this.input = input;
            this.output = undefined;
            this.replacements = [['{}'], ['/='], ['/'], [' +'], [' -'], ['return ']];
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
                const elements = lines[line].split(/(,|;|\{|\(|\)|\})/);
                // console.log(elements);
                let newline = []; 
                for (let posi = 0, length = 0; posi < elements.length; posi++) {
                    const element = elements[posi];
                    if(posi === 0){
                        length = 0;
                    }
                    if (element === ',' || element === ';' || element === '{' || element === '(' || element === ')' || element === '}'){
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
                string = string.replace(/(@\d+L\d+P)0::(\s+)/g, (match, pre, space) => {
                    // console.log(pre, space);
                    on = true;
                    return pre + space.length + 'O0::';
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
            string = this.replaceStrings(string);
            string = this.tidy(string);

            while (string.indexOf('@include') >= 0) {
                string = this.replaceIncludes(string);
            }

            string = string.replace(/(@\d+L\d+P\d+O?\d*::)?___boundary_[A-Z0-9_]{36}_(\d+)_as_string___\s*(\:|\(|\=)/g, (match, posi, index, after)=>{
                // console.log(match, posi, index, after, this.replacements[index]);
                return '___boundary_'+index+'_as_propname___'+after;
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
                .replace(/\s*[\r\n]+\s*___boundary_/g, "\r\n___boundary_")
                .replace(/\s+___boundary_/g, ' ___boundary_')
                .replace(/(@\d+L\d+P\d+O?\d*::\s*)?return(\s|___boundary_)/g, (match, posi, after) => {
                    let index = this.replacements.length;
                    this.replacements.push(['return ', posi]);
                    return ('___boundary_' + index + '_as_preoperator___ ' + after).replace(/\s+/, '');
                })
                .replace(/@\d+L\d+P\d+O?\d*::(___boundary_|$)/g, "$1")
                .replace(/\s*(,|;)\s*/g, "$1\r\n");
            // console.log(string);
            // console.log(this.replacements);
            return string;
        }
        replaceUsing(string: string): string {
            // console.log(string);
            return string.replace(replaceExpr.use, (match: string, posi, url) => {
                // console.log(match, posi, url);
                let index = this.replacements.length;
                this.replacements.push([url, posi]);
                return '___boundary_' + this.uid + '_' + index + '_as_using___;' + "\r\n";
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
                if (match && (matches.index >= match.index) && !match[5]) {
                    // console.log(matches, match);
                    if (match[1]){
                        this.replacements.push([match[2].replace(/@\d+L\d+P\d+O?\d*::/g, ''), match[1].trim()]);
                    }else{
                        this.replacements.push([match[2].replace(/@\d+L\d+P\d+O?\d*::/g, '')]);
                    }
                    string = string.replace(match[0], '___boundary_' + this.uid + '_' + index + stringas[matches[1]] + match[3]);
                } else if (matches[0] === '/') {
                    string = string.replace(matches[0], '___boundary_2_as_operator___');
                } else {
                    console.log(string, matches, match);
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
                    match = match
                        .replace(/\s*[\r\n]+\s*___boundary_/, "\r\n___boundary_")
                        .replace(/\s+___boundary_/, ' ___boundary_')
                        .replace(/(@\d+L\d+P\d+O?\d*::\s*)?return(\s|___boundary_)/, (match, posi, after) => {
                            let index = this.replacements.length;
                            this.replacements.push(['return ', posi]);
                            return ('___boundary_' + index + '_as_preoperator___ ' + after).replace(/\s+/, '');
                        });
                    let index = this.replacements.length;
                    // console.log(match);
                    this.replacements.push([match, posi && posi.trim()]);
                    return '___boundary_' + this.uid + '_' + index + '_as_function___';
                });
            }

            return string.replace(replaceExpr.closure, (match: string, word: string, posi2, posi3, closure: string) => {
                // console.log(match, word, closure);
                if (!word && match.match(/\s*\{\s*\}/)) {
                    return '___boundary_0_as_mark___';
                }
                closure = this.replaceParentheses(closure);
                // closure = this.replaceOperators(closure, false);
                // console.log(closure);
                if(posi2){
                    word = word.replace(posi2, '');
                    var posi = posi2.trim();
                } else if (posi3) {
                    word = word.replace(posi3, '');
                    var posi = posi3.trim();
                }else{
                    var posi = void 0;
                }
                let index = this.replacements.length;
                if (word === '@config') {
                    if (this.configinfo === '{}') {
                        this.configinfo_posi = posi;
                        this.configinfo = this.decode(match.replace('@config', ''));
                    }
                    return '';
                }
                if (word === 'return') {
                    this.replacements.push(['{' + closure + '}']);
                    return '___boundary_5_as_preoperator___ ___boundary_' + this.uid + '_' + index + '_as_object___';
                }
            if (
                (word && (word != 'return')) || 
                (closure.indexOf(';') >= 0) || 
                // !closure.match(/^\s*\{\s*(public|static|set|get|om)\s+)?(___boundary_[A-Z0-9_]{36}_(\d+)_as_function___|\|)(,|$)/)) {
                closure.match(/^\s*___boundary_[A-Z0-9_]{36}_\d+_as_[^f]\w+___/)) {
                // console.log(closure);
                    closure = closure
                        .replace(/\s*[\r\n]+\s*___boundary_/, "\r\n___boundary_")
                        .replace(/\s+___boundary_/, ' ___boundary_')
                        .replace(/(@\d+L\d+P\d+O?\d*::\s*)?return(\s|___boundary_)/, (match, posi, after) => {
                            let index = this.replacements.length;
                            this.replacements.push(['return ', posi]);
                            return ('___boundary_' + index + '_as_preoperator___ ' + after).replace(/\s+/, '');
                        });
                    this.replacements.push(['{' + closure + '}', posi]);
                    return (word || '') + ' ___boundary_' + this.uid + '_' + index + '_as_closure___;';
                }
                // console.log(closure);
                this.replacements.push(['{' + closure + '}']);
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
                    return (dot ? dot : '') + '___boundary_' + this.uid + '_' + index + '_as_call___' + after;
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
                    return string.replace(replaceExpr.arrowfn, (match: string, posi1, params: string, paramsindex: string, posi2, arrow: string, body: string, end: string) => {
                        // console.log(match);
                        // console.log(body);
                        let matches = body.match(/^\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_(parentheses|object|closure)___\s*$/);
                        // console.log(matches);
                        if (matches) {
                            let code = this.replacements[matches[1]][0];
                            if (matches[2] === 'parentheses') {
                                body = code.replace(/^\(\s*(.*?)\s*\)$/, (match: string, code: string) => {
                                    return '___boundary_5_as_preoperator___ ' + code;
                                });
                            } else {
                                // console.log(code);
                                body = code.replace(/(^\{|\}$)/g, '');
                            }
                        } else {
                            let index = this.replacements.length;
                            this.replacements.push();
                            body = '___boundary_5_as_preoperator___ ' + body;
                        }
                        let index = this.replacements.length;
                        // console.log(body);
                        if (posi1===void 0){
                            if (posi2 === void 0) {
                                var posi = undefined;
                            }else{
                                var posi = posi2.trim();
                            }
                        } else {
                            var posi = posi1.trim();
                        }
                        this.replacements.push([params + arrow + body, posi]);
                        return '___boundary_' + this.uid + '_' + index + '_as_arrowfn___' + end;
                    });
                } else {
                    if (arrow.index > 64) {
                        index = - 64;
                    } else {
                        index = 0;
                    }
                    // console.log(string);
                    throw 'tangram.js sugar Error: Unexpected `' + arrow[0] + '` in `' + this.decode(string.substr(index, 256)) + '`';
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
            string = string.replace(/::(var|let|public)\s+(@\d+L\d+P(\d+O)?0::)/g, '::$1 ').replace(/([^,;\s])\s*(@\d+L\d+P(\d+O)?0::)/g, '$1;$2');
            const array: string[] = string.split(/\s*;+\s*/);
            let lines: object[] = [];
            // console.log(string, array);
            // console.log(array);
            for (let index = 0; index < array.length; index++) {
                const line = array[index].trim();
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
                            this.pushSentencesToLines(lines, line);
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
        pushSentencesToLines(lines: any[], string: string) {
            if (string) {
                let match = string.trim().match(/^___boundary_[A-Z0-9_]{36}_(\d+)_as_([a-z]+)___$/);
                var value = string + ';';
                if (match) {
                    lines.push({
                        type: 'line',
                        subtype: match[2],
                        index: match[1],
                        value: value
                    });
                } else {
                    let strings = string.split(',');
                    for (let index = 0; index < strings.length; index++) {
                        let element = strings[index];
                        let position = this.getPosition(string);
                        // console.log(position, string)
                        if (position) {
                            position.head = true;
                            var value = element.replace(position.match, '') + ';';
                        }
                        lines.push({
                            type: 'line',
                            subtype: 'sentence',
                            posi: position,
                            value: value
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
                                value: _symbol + ' ' + element + ' = ' + value + ';'
                            });
                        }else{
                            lines.push({
                                type: 'line',
                                subtype: 'variable',
                                posi: position,
                                value: _symbol + ' ' + element + ' = ';
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
                        console.log(element);
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
                        const line = lines[index].value.trim();
                        if (line) {
                            let inline = [];
                            const array: string[] = line.split('___boundary_' + this.uid);
                            while (!array[0].trim()) {
                                array.shift();
                            }
                            console.log(array)
                            for (let i = 0; i < array.length; i++) {
                                let element = array[i].trim();
                                let matches: any;
                                let match_3: string;
                                let max = array.length - 1;
                                if (element && (matches = element.match(matchExpr.index3))) {
                                    // console.log(matches);
                                     inline.push({
                                        posi: matches[1],
                                        type: matches[2]
                                    });
                                    if (match_3 = matches[3].trim()) {
                                        if(i===max){
                                            var display = 'block';
                                        }else{
                                            var display = 'inline';
                                        }
                                        var position = void 0;
                                        var value = match_3;
                                    } else {
                                        continue;
                                    }
                                } else {
                                    var display = 'inline';
                                    var position = lines[index].posi;
                                    var value = array[i];
                                }
                                inline.push({
                                    type: 'code',
                                    posi: position,
                                    display: display,
                                    vars: vars,
                                    value: value
                                });
                            }
                            preast.push(inline);
                        }
                        break;

                    case 'variable':
                        preast.push([{
                            type: 'code',
                            posi: lines[index].posi,
                            display: 'block',
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
                                    if (element.match(/^[\$\w]+\[\]$/)) {
                                        let alias = element.replace('[]', '');
                                        using_as[alias] = [src];
                                        var varname = alias;
                                        break;
                                    } else {
                                        using_as[element] = [src, index];
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
                    case 'function':
                    case 'closure':
                        let inline = [{
                            posi: lines[index].index,
                            type: lines[index].subtype
                        }];
                        inline.push();
                        preast.push(inline);
                        break;
                    default:
                        preast.push([{
                            posi: lines[index].index,
                            type: lines[index].subtype
                        }, {
                            type: 'code',
                            posi: lines[index].index,
                            display: 'block',
                            vars: vars,
                            value: ';'
                        }]);
                        break;
                }
            }
            this.imports = imports;
            this.using_as = using_as;
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
                        // this.pushCodesToAST(ast.body, element.value);
                        // console.log(element);
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
                    return this.walkArray(element.posi, vars/*, codeInline*/);
                case 'arrowfn':
                    return this.walkArrowFn(element.posi, vars, codeInline);
                case 'call':
                case 'construct':
                    return this.walkCall(element.posi, vars, element.type, codeInline);
                case 'class':
                    return this.walkClass(element.posi, vars, codeInline);
                case 'closure':
                    return this.walkClosure(element.posi, vars);
                case 'extends':
                    return this.walkExtends(element.posi, vars, codeInline);
                case 'function':
                    return this.walkFnLike(element.posi, vars, 'def', codeInline);
                case 'object':
                    return this.walkObject(element.posi, vars, codeInline);
                case 'parentheses':
                    return this.walkParentheses(element.posi, vars, codeInline);
                case 'pattern':
                case 'string':
                case 'template':
                    let that = this;
                    let position = this.getPosition(this.replacements[element.posi][1]);
                    return {
                        type: 'code',
                        stype: (position && position.head) ? 'block' : 'inline',
                        posi: position,
                        vars: vars,
                        value: this.replacements[element.posi][0].replace(this.markPattern, function () {
                            return that.replacements[arguments[1]][0];
                        })
                    }
                default:
                    return {
                        type: 'code',
                        stype: codeInline ? 'inline' : 'block',
                        vars: vars,
                        value: "\r\n"
                    }
            }
        }
        walkArray(posi: number, vars: any/*, codeInline: boolean*/): object {
            let body = [],
                array = this.replacements[posi][0].replace(/([\[\s\]])/g, '').split(',');
            // console.log(this.replacements[posi]);
            for (let index = 0; index < array.length; index++) {
                let line = array[index].split('___boundary_' + this.uid);
                let inline: object[] = [];
                for (let i = 0; i < line.length; i++) {
                    this.pushReplacementsToAST(inline, vars, line[i], true);
                }
                // console.log(array[index], inline);
                body.push({
                    type: 'element',
                    vars: vars,
                    body: inline
                });
            }
            let position = this.getPosition(this.replacements[posi][1]);
            return {
                type: 'array',
                posi: position,
                // stype: codeInline ? 'inline' : 'block',
                vars: vars,
                body: body
            };
        }
        walkArrowFn(posi: number, vars: any, codeInline: boolean) {
            let matches: any = this.replacements[posi][0].match(matchExpr.arrowfn);
            // console.log(this.replacements[posi], matches);
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
                posi: this.getPosition(this.replacements[posi][1]),
                // stype: codeInline ? 'inline' : 'block',
                subtype: subtype,
                args: args.keys,
                defaults: args.vals,
                body: this.checkFnBody(localvars, args, matches[4])
            }
        }
        walkCall(posi: number, vars: any, type: string, codeInline: boolean): object {
            let name = [],
                params = [],
                matches: any = this.replacements[posi][0].match(matchExpr.call),
                nameArr: string[] = matches[1].split('___boundary_' + this.uid),
                paramArr = this.replacements[matches[2]][0].split(/([\(\r\n,\)])/),
                last: string = '';
            // console.log(this.replacements[posi], matches);
            for (let i = 0; i < nameArr.length; i++) {
                const element = nameArr[i];
                if (element) {
                    this.pushReplacementsToAST(name, vars, nameArr[i], true);
                }
            }
            for (let index = 0; index < paramArr.length; index++) {
                const element = paramArr[index].trim();
                let line: string[] = element.split('___boundary_' + this.uid);
                if (element && element != '(' && element != ')' && element != ',') {
                    let inline: object[] = [];
                    for (let i = 0; i < line.length; i++) {
                        this.pushReplacementsToAST(inline, vars, line[i], true);
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
            // console.log(this.replacements[posi]);
            return {
                type: type,
                posi: this.getPosition(this.replacements[posi][1]),
                // stype: codeInline ? 'inline' : 'block',
                name: name,
                vars: vars,
                params: params
            };
        }
        walkClass(posi: number, vars: any, codeInline: boolean = true) {
            // console.log(this.replacements[posi]);
            let matches: any = this.replacements[posi][0].match(matchExpr.class);
            // console.log(matches);
            var type = matches[1];
            // let stype = 'block';
            if (matches[2]){
                var subtype = 'stdClass';
            }else{
                if (type==='dec'){
                    var subtype = 'stdClass';
                }else{
                    var subtype = 'anonClass';
                }
            }
            let cname = matches[3];
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
                posi: this.getPosition(this.replacements[posi][1]),
                // stype: stype,
                subtype: subtype,
                cname: cname,
                base: matches[5],
                vars: vars,
                body: this.checkClassBody(vars, matches[6] || '')
            }
        }
        walkExtends(posi: number, vars: any, codeInline: boolean) {
            // console.log(this.replacements[posi]);
            let matches: any = this.replacements[posi][0].match(matchExpr.extends);
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
                stype: codeInline ? 'inline' : 'block',
                subtype: subtype,
                oname: objname,
                vars: vars,
                body: body
            }
        }
        walkFnLike(posi: number, vars: any, type: string, codeInline: boolean) {
            // console.log(this.replacements[posi]);
            let matches: any = this.replacements[posi][0].match(matchExpr.fnlike);
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
                        let head = this.pushLineToBody([], localvars, headline, true);
                        let body = this.pushToBody([], localvars, matches[5]);
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
                            stype: 'block',
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
                            let iterator = [], array = condition[1].split('___boundary_' + this.uid);
                            let self = {
                                this: 'var',
                                arguments: 'var',
                            }, agrs: any[] = [];
                            if (condition[4]) {
                                if (condition[7]) {
                                    self[condition[3]] = 'var';
                                    self[condition[7]] = 'var';
                                    agrs = [[condition[3], condition[2]], [condition[7], condition[6]]];
                                } else {
                                    self[condition[3]] = 'var';
                                    agrs = [[condition[3], condition[2]]];
                                }
                            } else {
                                self['_index'] = 'var';
                                self[condition[3]] = 'var';
                                agrs = [['_index', undefined], [condition[3], condition[2]]];
                            }

                            let localvars = {
                                parent: vars,
                                self: self,
                                fixed: [],
                                fix_map: {},
                                type: 'travel'
                            };
                            for (let index = 0; index < array.length; index++) {
                                this.pushReplacementsToAST(iterator, localvars, array[index], true);
                            }

                            return {
                                type: 'travel',
                                stype: 'block',
                                iterator: iterator,
                                vars: localvars,
                                callback: {
                                    type: 'def',
                                    stype: 'inline',
                                    fname: '',
                                    args: agrs,
                                    body: this.pushToBody([], localvars, matches[5])
                                }
                            }
                        }
                    }
                }
                var subtype = matches[2] === 'def' ? 'def' : 'fn';
                // console.log(matches);
                if (fname && !codeInline) {
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
                        var stype = 'block';
                    }
                } else { 
                    if (matches[2] === 'public') {
                        subtype = 'public';
                        stype = 'block';
                        // console.log(matches[5]);
                    }else{
                        var stype = codeInline ? 'inline' : 'block';
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
                posi: this.getPosition(this.replacements[posi][1]),
                // stype: stype,
                subtype: subtype,
                fname: fname,
                args: args.keys,
                defaults: args.vals,
                body: this.checkFnBody(localvars, args, matches[5])
            }
        } 
        walkParentheses(posi: number, vars: any, codeInline: boolean): object {
            let body = [],
                array = this.replacements[posi][0].replace(/([\[\s\]])/g, '').split(/\s*([,\r\n]+)/);
            for (let index = 0; index < array.length; index++) {
                let line = array[index].split('___boundary_' + this.uid);
                // let inline: object[] = [];
                for (let i = 0; i < line.length; i++) {
                    this.pushReplacementsToAST(body, vars, line[i], true);
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
                body: this.checkObjMember(vars, this.replacements[posi][0])
            };
        }
        walkClosure(posi: number, vars: any) {
            // console.log(this.replacements[posi]);
            let localvars = {
                parent: vars,
                self: {},
                fixed: [],
                fix_map: {},
                type: 'codes'
            };
            let array = this.replacements[posi][0].split(/\s*(\{|\})\s*/);
            let body = this.pushToBody([], localvars, array[2]);
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
            body.unshift({
                type: 'code',
                stype: 'inline',
                vars: localvars,
                value: array[0] ? (array[0] + ' {') : '{'
            });
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
                                        throw 'tangram.js sugar Error: Cannot use `' + match_0[2] + '` on property `' + match_0[3] + '`';
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
                                    console.log(body, bodyIndex);
                                    body[bodyIndex].body.push({
                                        type: 'code',
                                        stype: 'inline',
                                        vars: vars,
                                        value: ',' + this.replacements[parseInt(m[1])][0].replace(this.markPattern, function () {
                                            return that.replacements[arguments[1]][0];
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
                            stype: 'block',
                            posi: args.keys[index][1],
                            value: 'if (' + args.keys[index][0] + ' === void 0) { ' + args.keys[index][0] + ' = ' + valArr[0]
                        });
                        this.pushReplacementsToAST(body, vars, valArr[1], true);
                        body.push({
                            type: 'code',
                            stype: 'inline',
                            value: '; }'
                        });
                    } else {
                        body.push({
                            type: 'code',
                            posi: args.keys[index][1],
                            value: 'if (' + args.keys[index][0] + ' === void 0) { ' + args.keys[index][0] + ' = ' + valArr[0] + '; }'
                        });
                    }
                }
            }

            if (args.keysArray) {
                body.push({
                    type: 'code',
                    posi: args.keysArray[1],
                    value: 'var ' + args.keysArray[0].replace('...', '') + ' = Array.prototype.slice.call(arguments, ' + args.keys.length + ');'
                });
            }
            
            this.pushToBody(body, vars, code);
            // console.log(code, body);
            return body;
        }
        pushToBody(body: object[] = [], vars: any, code: string): object[] {
            let lines: any = code ? this.getLines(code, vars) : [];
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
                    this.pushReplacementsToAST(inline, vars, array[index], lineInLine || !!index);
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
        pushReplacementsToAST(body: object[], vars: any, code: string, codeInline: boolean): object[] {
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
                        this.pushCodesToAST(body, vars, match_3, true);
                    }
                    // if (matches[1]==94) {
                    // console.log(body);
                    // }
                } else {
                    // console.log(code, codeInline);
                    this.pushCodesToAST(body, vars, code, codeInline);
                }
            }
            return body;
        }
        pushCodesToAST(body: object[], vars: any, code: string, codeInline: boolean): object[] {
            if(code===';'){
                body.push({
                    type: 'code',
                    posi: undefined,
                    vars: vars,
                    stype: 'inline',
                    value: ';'
                });
            }else{
                let array = code.split(/(\s*[\r\n]+)\s*/);
                if (array.length>1){
                    console.log(code, array);
                }else{
                    let position = this.getPosition(code);
                    if(position){
                        var element = code.replace(position.match, '');
                    }else{
                        var element = code;
                    }
                    if (element) {
                        body.push({
                            type: 'code',
                            posi: position,
                            vars: vars,
                            stype: codeInline ? 'inline' : 'block',
                            value: element
                        });
                    }
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
            this.fixVariables(this.ast.vars);
            this.pushHeader(head, this.imports);
            this.pushAlias(body, this.using_as);
            this.pushCodes(body, this.ast.vars, this.ast.body, 1, false, this.namespace);
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
            for (const key in alias) {
                codes.push("\r\n\tvar " + key);
                codes.push("=imports['" + alias[key][0]);
                codes.push("']&&imports['" + alias[key][0]);
                if (alias[key][1] !== undefined) {
                    codes.push("'][" + alias[key][1] + "];");
                } else {
                    codes.push("'];");
                }
            }
            return codes;
        }
        pushCodes(codes: string[], vars: any, array: any[], layer: number, codeInline: boolean = false, namespace: string = this.namespace): string[] {
            let indent = "\r\n" + stringRepeat("\t", layer);
            // console.log(codes, array);
            // console.log(array);
            // console.log(layer, array);
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                // console.log(element);
                switch (element.type) {
                    case 'array':
                        this.pushArrayCodes(codes, element, layer, codeInline, namespace);
                        break;
                    case 'call':
                    case 'construct':
                        // console.log(layer);
                        this.pushCallCodes(codes, element, layer, namespace);
                        break;
                    case 'class':
                    case 'dec':
                        this.pushClassCodes(codes, element, layer, namespace);
                        break;
                    case 'code':
                        if (element.value){
                            var code: string = this.patchVariables(element.value, vars);
                            switch (element.stype) {
                                case 'break':
                                case 'closer':
                                    codes.push(indent.replace("\t", '') + this.pushPostionsToMap(element.posi) + code);
                                    break;
                                case 'inline':
                                    if (element.posi&&element.posi.head){
                                        console.log(element);
                                    }
                                    codes.push(code);
                                    break;
                                default:
                                    if (element.posi) {
                                        console.log(codeInline, element);
                                    }
                                    if (codeInline) {
                                        codes.push(code);
                                    } else {
                                        codes.push(indent + code);
                                    }
                                    break;
                            }
                            break;
                        }
                        break;
                    case 'codes':
                        // console.log(element);
                        this.pushCodes(codes, element.vars, element.body, layer + ((element.stype === 'local') ? 1 : 0), codeInline, namespace);
                        break;
                    case 'def':
                        this.pushFunctionCodes(codes, element, layer, namespace);
                        break;
                    case 'extends':
                        this.pushExtendsCodes(codes, element, layer, namespace);
                        break;
                    case 'exp':
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
            }
            // this.fixVariables(vars);
            return codes;
        }
        pushArrayCodes(codes: string[], element: any, layer: number, codeInline: boolean, namespace: string): string[] {
            let elements: string[] = [];
            if(element.posi){
                this.pushPostionsToMap(element.posi, codes);
            }
            codes.push('[');
            if (element.body.length) {
                let _layer = layer;
                let indent2;
                let _break = false;
                // console.log(element.params[0]);
                if (element.body[0].posi && element.body[0].posi.head) {
                    _layer++;
                    indent2 = "\r\n" + stringRepeat("\t", _layer);
                    codes.push(indent2);
                    _break = true;
                }
                for (let index = 0; index < element.body.length; index++) {
                    const body = element.body[index].body;
                    let elemCodes: string[] = [];
                    this.pushPostionsToMap(element.body[index].posi, elemCodes)
                    this.pushCodes(elemCodes, element.vars, body, _layer, true, namespace);
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
            return codes;
        }
        pushCallCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let naming: string[] = this.pushCodes([], element.vars, element.name, layer, true, namespace);
            if (element.posi) {
                this.pushPostionsToMap(element, codes);
                if (element.posi.head) {
                    var indent = "\r\n" + stringRepeat("\t", layer);
                    codes.push(indent);
                }
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
                if (element.params[0].posi && element.params[0].posi.head) {
                    _layer++;
                    indent2 = "\r\n" + stringRepeat("\t", _layer);
                    codes.push(indent2);
                    _break = true;
                }
                for (let index = 0; index < element.params.length; index++) {
                    const param = element.params[index].body;
                    let paramCodes: string[] = [];
                    this.pushPostionsToMap(element.params[index].posi, paramCodes)
                    this.pushCodes(paramCodes, element.vars, param, _layer, true, namespace);
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
                            this.pushCodes(elem, member.vars, member.body, layer + 1, true, namespace);
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
                            this.pushCodes(elem, member.vars, member.body, layer + 1, true, namespace);
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
                            this.pushCodes(elem, member.vars, member.body, layer + 1, true, namespace);
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
                            this.pushCodes(elem, member.vars, member.body, layer + 1, true, namespace);
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
                this.pushPostionsToMap(element, codes);
            }
            if (element.type === 'def' && element.fname) {
                if ((element.subtype === 'var') || (element.subtype === 'let')) {
                    codes.push(indent + element.subtype + ' ' + element.fname + ' = function (');
                } else if ((element.subtype === 'public')) {
                    codes.push(indent + 'pandora.' + namespace + element.fname + ' = function (');
                } else {
                    codes.push(indent + 'function ' + element.fname + ' (');
                }
            } else {
                if (element.posi && element.posi.head){
                    codes.push(indent);
                }
                codes.push('function (');
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
                this.pushCodes(codes, element.vars, element.body, layer + 1, false, namespace);
            } else {
                indent = '';
            }
            if ((element.subtype === 'var') || (element.subtype === 'let')) {
                codes.push(indent + '};');
                codes.push(indent);
            } else {
                codes.push(indent + '}');
            }
            return codes;
        }
        pushExpandClassCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let indent1 = "\r\n" + stringRepeat("\t", layer);
            let indent2 = "\r\n" + stringRepeat("\t", layer + 1);
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
            codes.push(indent1 + 'pandora.extend(' + cname + '.prototype, ');
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
                        this.pushCodes(elem, member.vars, member.body, layer + 1, true, namespace);
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
                        this.pushCodes(elem, member.vars, member.body, layer + 1, true, namespace);
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
            codes.push(indent1);
            // console.log(elements, static_elements); 
            return codes;
        }
        pushOverrideMethod(elements, overrides, indent2, indent3) {
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
        pushTravelCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let indent = "\r\n" + stringRepeat("\t", layer);
            // console.log(element);
            codes.push(indent + 'pandora.each(');
            this.pushCodes(codes, element.vars, element.iterator, layer, true, namespace);
            codes.push(', ');
            this.pushFunctionCodes(codes, element.callback, layer, namespace);
            codes.push(', this);');
            codes.push(indent);
            return codes;
        }
        pushExpressionCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let indent = "\r\n" + stringRepeat("\t", layer);
            codes.push(indent + element.expression + ' (');
            // console.log(element.head);
            this.pushCodes(codes, element.vars.parent, element.head, layer, true, namespace);
            codes.push(') {');
            codes.push(indent);
            // console.log(element.body);
            this.pushCodes(codes, element.vars, element.body, layer + 1, false, namespace);
            // if (element.stype === 'block') {
            //     codes.push(indent + '};');
            //     codes.push(indent);
            // } else {
                
            // }
            codes.push(indent + '}');
            return codes;
        }
        pushExtendsCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let indent1  = "\r\n" + stringRepeat("\t", layer);
            let indent2 = "\r\n" + stringRepeat("\t", layer);
            if (element.subtype === 'ns') {
                codes.push(indent2 + 'pandora.ns(\'' + namespace + element.oname.trim() + '\', function () {');
                this.pushCodes(codes, element.vars, element.body, layer + 1, false, namespace + element.oname.trim() + '.');
                // console.log(element.body);
                codes.push(indent2 + '}');
            } else if (element.subtype === 'extns') {
                codes.push(indent1 + 'pandora.ns(\'' + namespace + element.oname.trim() + '\', ');
                this.pushObjCodes(codes, element, layer, namespace);
            } else {
                codes.push(indent1 + 'pandora.extend(' + element.oname + ', ');
                this.pushObjCodes(codes, element, layer, namespace);
            }
            codes.push(');');
            codes.push(indent1);
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
                            this.pushCodes(elem, member.vars, member.body, layer + 1, true, namespace);
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
            if (element.stype === 'block') {
                codes.push('};');
                codes.push(indent1);
            } else {
                codes.push('}');
            }
            return codes;
        }
        closurecount : number = 0;
        fixVariables(vars: any) {
            this.closurecount++;
            console.log(vars.type, vars);
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

            string = this.replaceStrings(string, true);
            string = this.replaceOperators(string, false);
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

            string = this.restoreStrings(string, true);

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
        restoreStrings(string: string, last:boolean): string {
            let that = this;
            if(last){
                var pattern = this.lastPattern;
            } else {
                var pattern = this.trimPattern;
            }
            return string.replace(pattern, function () {
                // console.log(pattern, arguments[2] || arguments[4], that.replacements, that.replacements[arguments[2] || arguments[4]]);
                return that.replacements[arguments[2] || arguments[4]][0];
            }).replace(this.markPattern, function () {
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