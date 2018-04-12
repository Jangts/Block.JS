/*!
 * tangram.js framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tangram.block('$_/see/highlight/highlight', function(_, global, undefined) {
    var highlight = _.see.highlight;
    // We don't allow for pipes inside parentheses
    // to not break table pattern |(. foo |). bar |
    var attributes = {
        pattern: /(^[ \t]*)\[(?!\[)(?:(["'$`])(?:(?!\2)[^\\]|\\.)*\2|\[(?:[^\]\\]|\\.)*\]|[^\]\\]|\\.)*\]/m,
        lookbehind: true,
        inside: {
            'quoted': {
                pattern: /([$`])(?:(?!\1)[^\\]|\\.)*\1/,
                inside: {
                    'punctuation': /^[$`]|[$`]$/
                }
            },
            'interpreted': {
                pattern: /'(?:[^'\\]|\\.)*'/,
                inside: {
                    'punctuation': /^'|'$/
                        // See rest below
                }
            },
            'string': /"(?:[^"\\]|\\.)*"/,
            'variable': /\w+(?==)/,
            'punctuation': /^\[|\]$|,/,
            'operator': /=/,
            // The negative look-ahead prevents blank matches
            'attr-value': /(?!^\s+$).+/
        }
    };
    highlight.languages.asciidoc = {
        'comment-block': {
            pattern: /^(\/{4,})(?:\r?\n|\r)(?:.*(?:\r?\n|\r))*?\1/m,
            alias: 'comment'
        },
        'table': {
            pattern: /^\|={3,}(?:(?:\r?\n|\r).*)*?(?:\r?\n|\r)\|={3,}$/m,
            inside: {
                'specifiers': {
                    pattern: /(?!\|)(?:(?:(?:\d+(?:\.\d+)?|\.\d+)[+*])?(?:[<^>](?:\.[<^>])?|\.[<^>])?[a-z]*)(?=\|)/,
                    alias: 'attr-value'
                },
                'punctuation': {
                    pattern: /(^|[^\\])[|!]=*/,
                    lookbehind: true
                }
                // See rest below
            }
        },

        'passthrough-block': {
            pattern: /^(\+{4,})(?:\r?\n|\r)(?:.*(?:\r?\n|\r))*?\1$/m,
            inside: {
                'punctuation': /^\++|\++$/
                    // See rest below
            }
        },
        // Literal blocks and listing blocks
        'literal-block': {
            pattern: /^(-{4,}|\.{4,})(?:\r?\n|\r)(?:.*(?:\r?\n|\r))*?\1$/m,
            inside: {
                'punctuation': /^(?:-+|\.+)|(?:-+|\.+)$/
                    // See rest below
            }
        },
        // Sidebar blocks, quote blocks, example blocks and open blocks
        'other-block': {
            pattern: /^(--|\*{4,}|_{4,}|={4,})(?:\r?\n|\r)(?:.*(?:\r?\n|\r))*?\1$/m,
            inside: {
                'punctuation': /^(?:-+|\*+|_+|=+)|(?:-+|\*+|_+|=+)$/
                    // See rest below
            }
        },

        // list-punctuation and list-label must appear before indented-block
        'list-punctuation': {
            pattern: /(^[ \t]*)(?:-|\*{1,5}|\.{1,5}|(?:[a-z]|\d+)\.|[xvi]+\))(?= )/im,
            lookbehind: true,
            alias: 'punctuation'
        },
        'list-label': {
            pattern: /(^[ \t]*)[a-z\d].+(?::{2,4}|;;)(?=\s)/im,
            lookbehind: true,
            alias: 'symbol'
        },
        'indented-block': {
            pattern: /((\r?\n|\r)\2)([ \t]+)\S.*(?:(?:\r?\n|\r)\3.+)*(?=\2{2}|$)/,
            lookbehind: true
        },

        'comment': /^\/\/.*/m,
        'title': {
            pattern: /^.+(?:\r?\n|\r)(?:={3,}|-{3,}|~{3,}|\^{3,}|\+{3,})$|^={1,5} +.+|^\.(?![\s.]).*/m,
            alias: 'important',
            inside: {
                'punctuation': /^(?:\.|=+)|(?:=+|-+|~+|\^+|\++)$/
                    // See rest below
            }
        },
        'attribute-entry': {
            pattern: /^:[^:\r\n]+:(?: .*?(?: \+(?:\r?\n|\r).*?)*)?$/m,
            alias: 'tag'
        },
        'attributes': attributes,
        'hr': {
            pattern: /^'{3,}$/m,
            alias: 'punctuation'
        },
        'page-break': {
            pattern: /^<{3,}$/m,
            alias: 'punctuation'
        },
        'admonition': {
            pattern: /^(?:TIP|NOTE|IMPORTANT|WARNING|CAUTION):/m,
            alias: 'keyword'
        },
        'callout': [{
                pattern: /(^[ \t]*)<?\d*>/m,
                lookbehind: true,
                alias: 'symbol'
            },
            {
                pattern: /<\d+>/,
                alias: 'symbol'
            }
        ],
        'macro': {
            pattern: /\b[a-z\d][a-z\d-]*::?(?:(?:\S+)??\[(?:[^\]\\"]|(["'])(?:(?!\1)[^\\]|\\.)*\1|\\.)*\])/,
            inside: {
                'function': /^[a-z\d-]+(?=:)/,
                'punctuation': /^::?/,
                'attributes': {
                    pattern: /(?:\[(?:[^\]\\"]|(["'])(?:(?!\1)[^\\]|\\.)*\1|\\.)*\])/,
                    inside: attributes.inside
                }
            }
        },
        'inline': {
            /*
            The initial look-behind prevents the highlighting of escaped quoted text.

            Quoted text can be multi-line but cannot span an empty line.
            All quoted text can have attributes before [foobar, 'foobar', baz="bar"].

            First, we handle the constrained quotes.
            Those must be bounded by non-word chars and cannot have spaces between the delimiter and the first char.
            They are, in order: _emphasis_, ``double quotes'', `single quotes', `monospace`, 'emphasis', *strong*, +monospace+ and #unquoted#

            Then we handle the unconstrained quotes.
            Those do not have the restrictions of the constrained quotes.
            They are, in order: __emphasis__, **strong**, ++monospace++, +++passthrough+++, ##unquoted##, $$passthrough$$, ~subscript~, ^superscript^, {attribute-reference}, [[anchor]], [[[bibliography anchor]]], <<xref>>, (((indexes))) and ((indexes))
             */
            pattern: /(^|[^\\])(?:(?:\B\[(?:[^\]\\"]|(["'])(?:(?!\2)[^\\]|\\.)*\2|\\.)*\])?(?:\b_(?!\s)(?: _|[^_\\\r\n]|\\.)+(?:(?:\r?\n|\r)(?: _|[^_\\\r\n]|\\.)+)*_\b|\B``(?!\s).+?(?:(?:\r?\n|\r).+?)*''\B|\B`(?!\s)(?: ['`]|.)+?(?:(?:\r?\n|\r)(?: ['`]|.)+?)*['`]\B|\B(['*+#])(?!\s)(?: \3|(?!\3)[^\\\r\n]|\\.)+(?:(?:\r?\n|\r)(?: \3|(?!\3)[^\\\r\n]|\\.)+)*\3\B)|(?:\[(?:[^\]\\"]|(["'])(?:(?!\4)[^\\]|\\.)*\4|\\.)*\])?(?:(__|\*\*|\+\+\+?|##|\$\$|[~^]).+?(?:(?:\r?\n|\r).+?)*\5|\{[^}\r\n]+\}|\[\[\[?.+?(?:(?:\r?\n|\r).+?)*\]?\]\]|<<.+?(?:(?:\r?\n|\r).+?)*>>|\(\(\(?.+?(?:(?:\r?\n|\r).+?)*\)?\)\)))/m,
            lookbehind: true,
            inside: {
                'attributes': attributes,
                'url': {
                    pattern: /^(?:\[\[\[?.+?\]?\]\]|<<.+?>>)$/,
                    inside: {
                        'punctuation': /^(?:\[\[\[?|<<)|(?:\]\]\]?|>>)$/
                    }
                },
                'attribute-ref': {
                    pattern: /^\{.+\}$/,
                    inside: {
                        'variable': {
                            pattern: /(^\{)[a-z\d,+_-]+/,
                            lookbehind: true
                        },
                        'operator': /^[=?!#%@$]|!(?=[:}])/,
                        'punctuation': /^\{|\}$|::?/
                    }
                },
                'italic': {
                    pattern: /^(['_])[\s\S]+\1$/,
                    inside: {
                        'punctuation': /^(?:''?|__?)|(?:''?|__?)$/
                    }
                },
                'bold': {
                    pattern: /^\*[\s\S]+\*$/,
                    inside: {
                        punctuation: /^\*\*?|\*\*?$/
                    }
                },
                'punctuation': /^(?:``?|\+{1,3}|##?|\$\$|[~^]|\(\(\(?)|(?:''?|\+{1,3}|##?|\$\$|[~^`]|\)?\)\))$/
            }
        },
        'replacement': {
            pattern: /\((?:C|TM|R)\)/,
            alias: 'builtin'
        },
        'entity': /&#?[\da-z]{1,8};/i,
        'line-continuation': {
            pattern: /(^| )\+$/m,
            lookbehind: true,
            alias: 'punctuation'
        }
    };


    // Allow some nesting. There is no recursion though, so cloning should not be needed.

    attributes.inside['interpreted'].inside.rest = {
        'macro': highlight.languages.asciidoc['macro'],
        'inline': highlight.languages.asciidoc['inline'],
        'replacement': highlight.languages.asciidoc['replacement'],
        'entity': highlight.languages.asciidoc['entity']
    };

    highlight.languages.asciidoc['passthrough-block'].inside.rest = {
        'macro': highlight.languages.asciidoc['macro']
    };

    highlight.languages.asciidoc['literal-block'].inside.rest = {
        'callout': highlight.languages.asciidoc['callout']
    };

    highlight.languages.asciidoc['table'].inside.rest = {
        'comment-block': highlight.languages.asciidoc['comment-block'],
        'passthrough-block': highlight.languages.asciidoc['passthrough-block'],
        'literal-block': highlight.languages.asciidoc['literal-block'],
        'other-block': highlight.languages.asciidoc['other-block'],
        'list-punctuation': highlight.languages.asciidoc['list-punctuation'],
        'indented-block': highlight.languages.asciidoc['indented-block'],
        'comment': highlight.languages.asciidoc['comment'],
        'title': highlight.languages.asciidoc['title'],
        'attribute-entry': highlight.languages.asciidoc['attribute-entry'],
        'attributes': highlight.languages.asciidoc['attributes'],
        'hr': highlight.languages.asciidoc['hr'],
        'page-break': highlight.languages.asciidoc['page-break'],
        'admonition': highlight.languages.asciidoc['admonition'],
        'list-label': highlight.languages.asciidoc['list-label'],
        'callout': highlight.languages.asciidoc['callout'],
        'macro': highlight.languages.asciidoc['macro'],
        'inline': highlight.languages.asciidoc['inline'],
        'replacement': highlight.languages.asciidoc['replacement'],
        'entity': highlight.languages.asciidoc['entity'],
        'line-continuation': highlight.languages.asciidoc['line-continuation']
    };

    highlight.languages.asciidoc['other-block'].inside.rest = {
        'table': highlight.languages.asciidoc['table'],
        'list-punctuation': highlight.languages.asciidoc['list-punctuation'],
        'indented-block': highlight.languages.asciidoc['indented-block'],
        'comment': highlight.languages.asciidoc['comment'],
        'attribute-entry': highlight.languages.asciidoc['attribute-entry'],
        'attributes': highlight.languages.asciidoc['attributes'],
        'hr': highlight.languages.asciidoc['hr'],
        'page-break': highlight.languages.asciidoc['page-break'],
        'admonition': highlight.languages.asciidoc['admonition'],
        'list-label': highlight.languages.asciidoc['list-label'],
        'macro': highlight.languages.asciidoc['macro'],
        'inline': highlight.languages.asciidoc['inline'],
        'replacement': highlight.languages.asciidoc['replacement'],
        'entity': highlight.languages.asciidoc['entity'],
        'line-continuation': highlight.languages.asciidoc['line-continuation']
    };

    highlight.languages.asciidoc['title'].inside.rest = {
        'macro': highlight.languages.asciidoc['macro'],
        'inline': highlight.languages.asciidoc['inline'],
        'replacement': highlight.languages.asciidoc['replacement'],
        'entity': highlight.languages.asciidoc['entity']
    };

    // Plugin to make entity title show the real entity, idea by Roman Komarov
    highlight.hooks.add('wrap', function(env) {
        if (env.type === 'entity') {
            env.attributes['title'] = env.content.replace(/&amp;/, '&');
        }
    });
});