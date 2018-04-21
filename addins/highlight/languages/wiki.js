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
], function(_, global, imports, undefined) {
    var highlight = _.see.highlight;
    highlight.languages.wiki = highlight.languages.extend('markup', {
        'block-comment': {
            pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
            lookbehind: true,
            alias: 'comment'
        },
        'heading': {
            pattern: /^(=+).+?\1/m,
            inside: {
                'punctuation': /^=+|=+$/,
                'important': /.+/
            }
        },
        'emphasis': {
            // TODO Multi-line
            pattern: /('{2,5}).+?\1/,
            inside: {
                'bold italic': {
                    pattern: /(''''').+?(?=\1)/,
                    lookbehind: true
                },
                'bold': {
                    pattern: /(''')[^'](?:.*?[^'])?(?=\1)/,
                    lookbehind: true
                },
                'italic': {
                    pattern: /('')[^'](?:.*?[^'])?(?=\1)/,
                    lookbehind: true
                },
                'punctuation': /^''+|''+$/
            }
        },
        'hr': {
            pattern: /^-{4,}/m,
            alias: 'punctuation'
        },
        'url': [/ISBN +(?:97[89][ -]?)?(?:\d[ -]?){9}[\dx]\b|(?:RFC|PMID) +\d+/i, /\[\[.+?\]\]|\[.+?\]/],
        'variable': [/__[A-Z]+__/,
            // FIXME Nested structures should be handled
            // {{formatnum:{{#expr:{{{3}}}}}}}
            /\{{3}.+?\}{3}/,
            /\{\{.+?}}/
        ],
        'symbol': [
            /^#redirect/im,
            /~{3,5}/
        ],
        // Handle table attrs:
        // {|
        // ! style="text-align:left;"| Item
        // |}
        'table-tag': {
            pattern: /((?:^|[|!])[|!])[^|\r\n]+\|(?!\|)/m,
            lookbehind: true,
            inside: {
                'table-bar': {
                    pattern: /\|$/,
                    alias: 'punctuation'
                },
                rest: highlight.languages.markup['tag'].inside
            }
        },
        'punctuation': /^(?:\{\||\|\}|\|-|[*#:;!|])|\|\||!!/m
    });

    highlight.languages.insertBefore('wiki', 'tag', {
        // Prevent highlighting inside <nowiki>, <source> and <pre> tags
        'nowiki': {
            pattern: /<(nowiki|pre|source)\b[\w\W]*?>[\w\W]*?<\/\1>/i,
            inside: {
                'tag': {
                    pattern: /<(?:nowiki|pre|source)\b[\w\W]*?>|<\/(?:nowiki|pre|source)>/i,
                    inside: highlight.languages.markup['tag'].inside
                }
            }
        }
    });

});