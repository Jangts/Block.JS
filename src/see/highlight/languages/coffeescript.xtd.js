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
    '$_/see/highlight/languages/javascript.xtd'
], function(_, global, undefined) {
    var highlight = _.see.highlight;
    // Ignore comments starting with { to privilege string interpolation highlighting
    var comment = /#(?!\{).+/,
        interpolation = {
            pattern: /#\{[^}]+\}/,
            alias: 'variable'
        };

    highlight.languages.coffeescript = highlight.languages.extend('javascript', {
        'comment': comment,
        'string': [

            // Strings are multiline
            / '(?:\\?[^\\])*?' /,

            {
                // Strings are multiline
                pattern: /"(?:\\?[^\\])*?"/,
                inside: {
                    'interpolation': interpolation
                }
            }
        ],
        'keyword': /\b(and|break|by|catch|class|continue|debugger|delete|do|each|else|extend|extends|false|finally|for|if|in|instanceof|is|isnt|let|loop|namespace|new|no|not|null|of|off|on|or|own|return|super|switch|then|this|throw|true|try|typeof|undefined|unless|until|when|while|window|with|yes|yield)\b/,
        'class-member': {
            pattern: /@(?!\d)\w+/,
            alias: 'variable'
        }
    });

    highlight.languages.insertBefore('coffeescript', 'comment', {
        'multiline-comment': {
            pattern: /###[\s\S]+?###/,
            alias: 'comment'
        },

        // Block regexp can contain comments and interpolation
        'block-regex': {
            pattern: /\/{3}[\s\S]*?\/{3}/,
            alias: 'regex',
            inside: {
                'comment': comment,
                'interpolation': interpolation
            }
        }
    });

    highlight.languages.insertBefore('coffeescript', 'string', {
        'inline-javascript': {
            pattern: /`(?:\\?[\s\S])*?`/,
            inside: {
                'delimiter': {
                    pattern: /^`|`$/,
                    alias: 'punctuation'
                },
                rest: highlight.languages.javascript
            }
        },

        // Block strings
        'multiline-string': [{
                pattern: /'''[\s\S]*?'''/,
                alias: 'string'
            },
            {
                pattern: /"""[\s\S]*?"""/,
                alias: 'string',
                inside: {
                    interpolation: interpolation
                }
            }
        ]

    });

    highlight.languages.insertBefore('coffeescript', 'keyword', {
        // Object property
        'property': /(?!\d)\w+(?=\s*:(?!:))/
    });
});