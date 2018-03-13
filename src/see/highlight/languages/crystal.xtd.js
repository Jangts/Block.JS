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
    '$_/see/highlight/languages/ruby.xtd'
], function(_, global, undefined) {
    var highlight = _.see.highlight;
    highlight.languages.crystal = highlight.languages.extend('ruby', {
        keyword: [/\b(?:abstract|alias|as|asm|begin|break|case|class|def|do|else|elsif|end|ensure|enum|extend|for|fun|if|ifdef|include|instance_sizeof|lib|macro|module|next|of|out|pointerof|private|protected|rescue|return|require|self|sizeof|struct|super|then|type|typeof|union|unless|until|when|while|with|yield|__DIR__|__FILE__|__LINE__)\b/, {
            pattern: /(\.\s*)(?:is_a|responds_to)\?/,
            lookbehind: true
        }],

        number: /\b(?:0b[01_]*[01]|0o[0-7_]*[0-7]|0x[0-9a-fA-F_]*[0-9a-fA-F]|(?:[0-9](?:[0-9_]*[0-9])?)(?:\.[0-9_]*[0-9])?(?:[eE][+-]?[0-9_]*[0-9])?)(?:_(?:[uif](?:8|16|32|64))?)?\b/,
    });

    var rest = _.copy(highlight.languages.crystal);

    highlight.languages.insertBefore('crystal', 'string', {
        attribute: {
            pattern: /@\[.+?\]/,
            alias: 'attr-name',
            inside: {
                delimiter: {
                    pattern: /^@\[|\]$/,
                    alias: 'tag'
                },
                rest: rest
            }
        },

        expansion: [{
                pattern: /\{\{.+?\}\}/,
                inside: {
                    delimiter: {
                        pattern: /^\{\{|\}\}$/,
                        alias: 'tag'
                    },
                    rest: rest
                }
            },
            {
                pattern: /\{%.+?%\}/,
                inside: {
                    delimiter: {
                        pattern: /^\{%|%\}$/,
                        alias: 'tag'
                    },
                    rest: rest
                }
            }
        ]
    });
});