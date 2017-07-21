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
    '$_/see/highlight/languages/markup.xtd'
], function(_, global, undefined) {
    _.see.highlight.languages.twig = {
        'comment': /\{#[\s\S]*?#\}/,
        'tag': {
            pattern: /\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}/,
            inside: {
                'ld': {
                    pattern: /^(?:\{\{\-?|\{%\-?\s*\w+)/,
                    inside: {
                        'punctuation': /^(?:\{\{|\{%)\-?/,
                        'keyword': /\w+/
                    }
                },
                'rd': {
                    pattern: /\-?(?:%\}|\}\})$/,
                    inside: {
                        'punctuation': /.*/
                    }
                },
                'string': {
                    pattern: /("|')(?:\\?.)*?\1/,
                    inside: {
                        'punctuation': /^['"]|['"]$/
                    }
                },
                'keyword': /\b(?:even|if|odd)\b/,
                'boolean': /\b(?:true|false|null)\b/,
                'number': /\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+([Ee][-+]?\d+)?)\b/,
                'operator': [{
                        pattern: /(\s)(?:and|b\-and|b\-xor|b\-or|ends with|in|is|matches|not|or|same as|starts with)(?=\s)/,
                        lookbehind: true
                    },
                    /[=<>]=?|!=|\*\*?|\/\/?|\?:?|[-+~%|]/
                ],
                'property': /\b[a-zA-Z_][a-zA-Z0-9_]*\b/,
                'punctuation': /[()\[\]{}:.,]/
            }
        },

        // The rest can be parsed as HTML
        'other': {
            // We want non-blank matches
            pattern: /\S(?:[\s\S]*\S)?/,
            inside: highlight.languages.markup
        }
    };
});