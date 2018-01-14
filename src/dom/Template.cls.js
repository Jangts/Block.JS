/*!
 * Block.JS Framework Source Code
 *
 * class dom.Template
 *
 * Author By Cyrus
 * Date 2015-03-11
 * Contact xiaodpro@gmail.com
 */
;
block(['$_/util/str.xtd'], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document;

    var esc = _.util.str.escape,
        startTag = '<%',
        endTag = '%>',
        spliter = new RegExp("(" + startTag + "|" + endTag + ")"),
        regExp = /^[\s\r\n]*=(.+?)[\s\r\n]*$/,
        delimiters = ['{@', '}'],
        compilers = {
            expression: [{
                pattern: /\{\@\@([\w\.\[\]\'\"]+)\}/ig,
                handler: function(match, pattern) {
                    return match.replace(pattern, "<%include($1)%>");
                }
            }],
            echo: [{
                    pattern: /\{\@([\w\.\[\]]+)\,\s*\g\s*\}/ig,
                    handler: function(match, pattern) {
                        return match.replace(pattern, "<%echo($1)%>");
                    }
                },
                {
                    pattern: /\{\@([\w\.\[\]\'\"]+)\}/ig,
                    handler: function(match, pattern) {
                        return match.replace(pattern, "<%echo(this.data.$1)%>");
                    }
                },
                {
                    pattern: /\{\@([\w\.\[\]\s\?\:\'\"\&]+)\}/ig,
                    handler: function(match, pattern) {
                        return match.replace(pattern, "<%echo(this.data.$1)%>");
                    }
                },
                {
                    pattern: /<\s*if\s*\(/ig,
                    handler: function(match, pattern) {
                        return match.replace(pattern, "<%if(");
                    }
                },
                {
                    pattern: /<\s*for\s*\(/ig,
                    handler: function(match, pattern) {
                        return match.replace(pattern, "<%for(");
                    }
                },
                {
                    pattern: /\)\s*>/ig,
                    handler: function(match, pattern) {
                        return match.replace(pattern, ") {%>");
                    }
                },
                {
                    pattern: /<\}>/ig,
                    handler: function(match, pattern) {
                        return match.replace(pattern, "<%}%>");
                    }
                }
            ]
        },
        filters = {
            repeat: function(str, times) {
                times = typeof times === 'number' ? times : 2;
                var _str = '';
                while (times) {
                    _str += str;
                    times--;
                }
                return _str
            }
        },
        order = ['expression', 'echo'],
        escap = function(str) {
            return str.replace(/\$/g, '\\\$').replace(/\{/g, '\\\{').replace(/\}/g, '\\\}');
        },
        compile = function(source) {
            _.each(filters, function(filter, handler) {
                var pattern = new RegExp(escap(delimiters[0]) + '\\\s*([\\\w\\\.\\\[\\\]\\\'\\\"]+)' + '\\\s*\\\|\\\s*' + filter.replace('.', '\\\.') + '\\\s*,' + '([\\\s\\\w\\\.\\\[\\\]\\\'\\\,\\\"]+?)' + escap(delimiters[1]), 'g'),
                    matches = source.match(pattern);
                if (matches) {
                    _.each(matches, function(i, match) {
                        source = source.replace(pattern, "<%echo(filters." + filter + "(this.data.$1,$2))%>");
                    });
                }

            });
            _.each(order, function(i, group) {
                _.each(compilers[group], function(j, type) {
                    var matches = source.match(type.pattern);
                    if (matches) {
                        _.each(matches, function(k, match) {
                            source = source.replace(match, type.handler(match, type.pattern));
                        });
                    }
                });
            });
            return source;
        },
        allcodes = {};

    declare('dom.Template', {
        _init: function(source, data, includes) {
            this.uid = new _.Identifier().toString();
            this.intermediate = compile(source);
            var string = this.intermediate.split(spliter),
                codes = [],
                rs = this.results = [];
            include = function(name) {
                if (name && includes[name] && (typeof includes[name].echo === 'function')) {
                    rs.push(includes[name].echo());
                }
            };
            for (var i = 0; i < string.length; i++) {
                var code = string[i];
                if (code === endTag) {
                    continue;
                }
                if (code === startTag) {
                    code = string[++i];
                    if (regExp.test(code)) {
                        codes.push(code.replace(regExp, "echo($1);"));
                        continue;
                    }
                    codes.push(code);
                } else {
                    codes.push(esc(code));
                }
            }
            allcodes[this.uid] = codes;
            this.source = source;
            this.includes = {};
            this.data = {};
            if (data) {
                this.complie(data, includes);
            }
        },
        complie: function(data, includes) {
            data = typeof data === 'object' ? data : {};
            includes = typeof includes === 'object' ? includes : {};
            this.includes = includes;
            this.data = data;
            var rs = this.results,
                echo = function(str) {
                    rs.push(str);
                };
            eval(allcodes[this.uid].join("\r\n"));
            return this;
        },
        echo: function(clear) {
            return this.results.join('');
        },
        clear: function() {
            this.results = [];
        }
    });

    _.extend(_.dom.Template, {
        config: function(settings) {
            settings = settings || {};

            if (settings.mainUrl) {
                global.block.config({
                    mainUrl: settings.mainUrl
                });
            }

            mainUrl = _.mainUrl();
        }
    });
});