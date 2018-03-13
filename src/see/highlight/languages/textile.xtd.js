/*!
 * tangram.js framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tangram.block([
    '$_/see/highlight/highlight.xtd',
    '$_/see/highlight/languages/css.xtd',
    '$_/see/highlight/languages/markup.xtd'
], function(_, global, undefined) {
    var highlight = _.see.highlight;
    // We don't allow for pipes inside parentheses
    // to not break table pattern |(. foo |). bar |
    var modifierRegex = '(?:\\([^|)]+\\)|\\[[^\\]]+\\]|\\{[^}]+\\})+';
    var modifierTokens = {
        'css': {
            pattern: /\{[^}]+\}/,
            inside: {
                rest: highlight.languages.css
            }
        },
        'class-id': {
            pattern: /(\()[^)]+(?=\))/,
            lookbehind: true,
            alias: 'attr-value'
        },
        'lang': {
            pattern: /(\[)[^\]]+(?=\])/,
            lookbehind: true,
            alias: 'attr-value'
        },
        // Anything else is punctuation (the first pattern is for row/col spans inside tables)
        'punctuation': /[\\\/]\d+|\S/
    };


    highlight.languages.textile = highlight.languages.extend('markup', {
        'phrase': {
            pattern: /(^|\r|\n)\S[\s\S]*?(?=$|\r?\n\r?\n|\r\r)/,
            lookbehind: true,
            inside: {

                // h1. Header 1
                'block-tag': {
                    pattern: RegExp('^[a-z]\\w*(?:' + modifierRegex + '|[<>=()])*\\.'),
                    inside: {
                        'modifier': {
                            pattern: RegExp('(^[a-z]\\w*)(?:' + modifierRegex + '|[<>=()])+(?=\\.)'),
                            lookbehind: true,
                            inside: _.copy(modifierTokens)
                        },
                        'tag': /^[a-z]\w*/,
                        'punctuation': /\.$/
                    }
                },

                // # List item
                // * List item
                'list': {
                    pattern: RegExp('^[*#]+(?:' + modifierRegex + ')?\\s+.+', 'm'),
                    inside: {
                        'modifier': {
                            pattern: RegExp('(^[*#]+)' + modifierRegex),
                            lookbehind: true,
                            inside: _.copy(modifierTokens)
                        },
                        'punctuation': /^[*#]+/
                    }
                },

                // | cell | cell | cell |
                'table': {
                    // Modifiers can be applied to the row: {color:red}.|1|2|3|
                    // or the cell: |{color:red}.1|2|3|
                    pattern: RegExp('^(?:(?:' + modifierRegex + '|[<>=()^~])+\\.\\s*)?(?:\\|(?:(?:' + modifierRegex + '|[<>=()^~_]|[\\\\/]\\d+)+\\.)?[^|]*)+\\|', 'm'),
                    inside: {
                        'modifier': {
                            // Modifiers for rows after the first one are
                            // preceded by a pipe and a line feed
                            pattern: RegExp('(^|\\|(?:\\r?\\n|\\r)?)(?:' + modifierRegex + '|[<>=()^~_]|[\\\\/]\\d+)+(?=\\.)'),
                            lookbehind: true,
                            inside: _.copy(modifierTokens)
                        },
                        'punctuation': /\||^\./
                    }
                },

                'inline': {
                    pattern: RegExp('(\\*\\*|__|\\?\\?|[*_%@+\\-^~])(?:' + modifierRegex + ')?.+?\\1'),
                    inside: {
                        // Note: superscripts and subscripts are not handled specifically

                        // *bold*, **bold**
                        'bold': {
                            pattern: RegExp('((^\\*\\*?)(?:' + modifierRegex + ')?).+?(?=\\2)'),
                            lookbehind: true
                        },

                        // _italic_, __italic__
                        'italic': {
                            pattern: RegExp('((^__?)(?:' + modifierRegex + ')?).+?(?=\\2)'),
                            lookbehind: true
                        },

                        // ??cite??
                        'cite': {
                            pattern: RegExp('(^\\?\\?(?:' + modifierRegex + ')?).+?(?=\\?\\?)'),
                            lookbehind: true,
                            alias: 'string'
                        },

                        // @code@
                        'code': {
                            pattern: RegExp('(^@(?:' + modifierRegex + ')?).+?(?=@)'),
                            lookbehind: true,
                            alias: 'keyword'
                        },

                        // +inserted+
                        'inserted': {
                            pattern: RegExp('(^\\+(?:' + modifierRegex + ')?).+?(?=\\+)'),
                            lookbehind: true
                        },

                        // -deleted-
                        'deleted': {
                            pattern: RegExp('(^-(?:' + modifierRegex + ')?).+?(?=-)'),
                            lookbehind: true
                        },

                        // %span%
                        'span': {
                            pattern: RegExp('(^%(?:' + modifierRegex + ')?).+?(?=%)'),
                            lookbehind: true
                        },

                        'modifier': {
                            pattern: RegExp('(^\\*\\*|__|\\?\\?|[*_%@+\\-^~])' + modifierRegex),
                            lookbehind: true,
                            inside: _.copy(modifierTokens)
                        },
                        'punctuation': /[*_%?@+\-^~]+/
                    }
                },

                // [alias]http://example.com
                'link-ref': {
                    pattern: /^\[[^\]]+\]\S+$/m,
                    inside: {
                        'string': {
                            pattern: /(\[)[^\]]+(?=\])/,
                            lookbehind: true
                        },
                        'url': {
                            pattern: /(\])\S+$/,
                            lookbehind: true
                        },
                        'punctuation': /[\[\]]/
                    }
                },

                // "text":http://example.com
                // "text":link-ref
                'link': {
                    pattern: RegExp('"(?:' + modifierRegex + ')?[^"]+":.+?(?=[^\\w/]?(?:\\s|$))'),
                    inside: {
                        'text': {
                            pattern: RegExp('(^"(?:' + modifierRegex + ')?)[^"]+(?=")'),
                            lookbehind: true
                        },
                        'modifier': {
                            pattern: RegExp('(^")' + modifierRegex),
                            lookbehind: true,
                            inside: _.copy(modifierTokens)
                        },
                        'url': {
                            pattern: /(:).+/,
                            lookbehind: true
                        },
                        'punctuation': /[":]/
                    }
                },

                // !image.jpg!
                // !image.jpg(Title)!:http://example.com
                'image': {
                    pattern: RegExp('!(?:' + modifierRegex + '|[<>=()])*[^!\\s()]+(?:\\([^)]+\\))?!(?::.+?(?=[^\\w/]?(?:\\s|$)))?'),
                    inside: {
                        'source': {
                            pattern: RegExp('(^!(?:' + modifierRegex + '|[<>=()])*)[^!\\s()]+(?:\\([^)]+\\))?(?=!)'),
                            lookbehind: true,
                            alias: 'url'
                        },
                        'modifier': {
                            pattern: RegExp('(^!)(?:' + modifierRegex + '|[<>=()])+'),
                            lookbehind: true,
                            inside: _.copy(modifierTokens)
                        },
                        'url': {
                            pattern: /(:).+/,
                            lookbehind: true
                        },
                        'punctuation': /[!:]/
                    }
                },

                // Footnote[1]
                'footnote': {
                    pattern: /\b\[\d+\]/,
                    alias: 'comment',
                    inside: {
                        'punctuation': /\[|\]/
                    }
                },

                // CSS(Cascading Style Sheet)
                'acronym': {
                    pattern: /\b[A-Z\d]+\([^)]+\)/,
                    inside: {
                        'comment': {
                            pattern: /(\()[^)]+(?=\))/,
                            lookbehind: true
                        },
                        'punctuation': /[()]/
                    }
                },

                // highlight(C)
                'mark': {
                    pattern: /\b\((TM|R|C)\)/,
                    alias: 'comment',
                    inside: {
                        'punctuation': /[()]/
                    }
                }
            }
        }
    });

    var nestedPatterns = {
        'inline': _.copy(highlight.languages.textile['phrase'].inside['inline']),
        'link': _.copy(highlight.languages.textile['phrase'].inside['link']),
        'image': _.copy(highlight.languages.textile['phrase'].inside['image']),
        'footnote': _.copy(highlight.languages.textile['phrase'].inside['footnote']),
        'acronym': _.copy(highlight.languages.textile['phrase'].inside['acronym']),
        'mark': _.copy(highlight.languages.textile['phrase'].inside['mark'])
    };

    // Allow some nesting
    highlight.languages.textile['phrase'].inside['inline'].inside['bold'].inside = nestedPatterns;
    highlight.languages.textile['phrase'].inside['inline'].inside['italic'].inside = nestedPatterns;
    highlight.languages.textile['phrase'].inside['inline'].inside['inserted'].inside = nestedPatterns;
    highlight.languages.textile['phrase'].inside['inline'].inside['deleted'].inside = nestedPatterns;
    highlight.languages.textile['phrase'].inside['inline'].inside['span'].inside = nestedPatterns;

    // Allow some styles inside table cells
    highlight.languages.textile['phrase'].inside['table'].inside['inline'] = nestedPatterns['inline'];
    highlight.languages.textile['phrase'].inside['table'].inside['link'] = nestedPatterns['link'];
    highlight.languages.textile['phrase'].inside['table'].inside['image'] = nestedPatterns['image'];
    highlight.languages.textile['phrase'].inside['table'].inside['footnote'] = nestedPatterns['footnote'];
    highlight.languages.textile['phrase'].inside['table'].inside['acronym'] = nestedPatterns['acronym'];
    highlight.languages.textile['phrase'].inside['table'].inside['mark'] = nestedPatterns['mark'];
});