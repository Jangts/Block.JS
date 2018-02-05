/*!
 * Block.JS Framework Source Code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
block([
    '$_/see/highlight/highlight.xtd',
    '$_/see/highlight/languages/c.xtd'
], function(_, global, undefined) {
    _.see.highlight.languages.bison = _.see.highlight.languages.extend('c', {});
    _.see.highlight.languages.insertBefore('bison', 'comment', {
        'bison': {
            // This should match all the beginning of the file
            // including the prologue(s), the bison declarations and
            // the grammar rules.
            pattern: /^[\s\S]*?%%[\s\S]*?%%/,
            inside: {
                'c': {
                    // Allow for one level of nested braces
                    pattern: /%\{[\s\S]*?%\}|\{(?:\{[^}]*\}|[^{}])*\}/,
                    inside: {
                        'delimiter': {
                            pattern: /^%?\{|%?\}$/,
                            alias: 'punctuation'
                        },
                        'bison-variable': {
                            pattern: /[$@](?:<[^\s>]+>)?[\w$]+/,
                            alias: 'variable',
                            inside: {
                                'punctuation': /<|>/
                            }
                        },
                        rest: highlight.languages.c
                    }
                },
                'comment': highlight.languages.c.comment,
                'string': highlight.languages.c.string,
                'property': /\S+(?=:)/,
                'keyword': /%\w+/,
                'number': {
                    pattern: /(^|[^@])\b(?:0x[\da-f]+|\d+)/i,
                    lookbehind: true
                },
                'punctuation': /%[%?]|[|:;\[\]<>]/
            }
        }
    });
});