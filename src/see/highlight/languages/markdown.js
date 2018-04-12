/*!
 * tangram.js framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tangram.block([
    '$_/see/highlight/highlight',
    '$_/see/highlight/languages/markup'
], function(_, global, undefined) {
    var highlight = _.view.highlight;
    highlight.languages.markdown = highlight.languages.extend('markup', {});
    highlight.languages.insertBefore('markdown', 'prolog', {
        'blockquote': {
            // > ...
            pattern: /^>(?:[\t ]*>)*/m,
            alias: 'punctuation'
        },
        'code': [{
                // Prefixed by 4 spaces or 1 tab
                pattern: /^(?: {4}|\t).+/m,
                alias: 'keyword'
            },
            {
                // `code`
                // ``code``
                pattern: /``.+?``|`[^`\n]+`/,
                alias: 'keyword'
            }
        ],
        'title': [{
                // title 1
                // =======
                // title 2
                // -------
                pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
                alias: 'important',
                inside: {
                    punctuation: /==+$|--+$/
                }
            },
            {
                // # title 1
                // ###### title 6
                pattern: /(^\s*)#+.+/m,
                lookbehind: true,
                alias: 'important',
                inside: {
                    punctuation: /^#+|#+$/
                }
            }
        ],
        'hr': {
            // ***
            // ---
            // * * *
            // -----------
            pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
            lookbehind: true,
            alias: 'punctuation'
        },
        'list': {
            // * item
            // + item
            // - item
            // 1. item
            pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
            lookbehind: true,
            alias: 'punctuation'
        },
        'url-reference': {
            // [id]: http://example.com "Optional title"
            // [id]: http://example.com 'Optional title'
            // [id]: http://example.com (Optional title)
            // [id]: <http://example.com> "Optional title"
            pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
            inside: {
                'variable': {
                    pattern: /^(!?\[)[^\]]+/,
                    lookbehind: true
                },
                'string': /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
                'punctuation': /^[\[\]!:]|[<>]/
            },
            alias: 'url'
        },
        'bold': {
            // **strong**
            // __strong__
            // Allow only one line break
            pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
            lookbehind: true,
            inside: {
                'punctuation': /^\*\*|^__|\*\*$|__$/
            }
        },
        'italic': {
            // *em*
            // _em_
            // Allow only one line break
            pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
            lookbehind: true,
            inside: {
                'punctuation': /^[*_]|[*_]$/
            }
        },
        'url': {
            // [example](http://example.com "Optional title")
            // [example] [id]
            pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
            inside: {
                'variable': {
                    pattern: /(!?\[)[^\]]+(?=\]$)/,
                    lookbehind: true
                },
                'string': {
                    pattern: /"(?:\\.|[^"\\])*"(?=\)$)/
                }
            }
        }
    });

    highlight.languages.markdown['bold'].inside['url'] = _.copy(highlight.languages.markdown['url']);
    highlight.languages.markdown['italic'].inside['url'] = _.copy(highlight.languages.markdown['url']);
    highlight.languages.markdown['bold'].inside['italic'] = _.copy(highlight.languages.markdown['italic']);
    highlight.languages.markdown['italic'].inside['bold'] = _.copy(highlight.languages.markdown['bold']);
});