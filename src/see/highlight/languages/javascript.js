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
    '$_/see/highlight/languages/clike'
], function(_, global, undefined) {
    var highlight = _.see.highlight;
    highlight.languages.javascript = highlight.languages.extend('clike', {
        'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
        'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
        // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
        'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i
    });

    highlight.languages.insertBefore('javascript', 'keyword', {
        'regex': {
            pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
            lookbehind: true,
            greedy: true
        }
    });

    highlight.languages.insertBefore('javascript', 'class-name', {
        'template-string': {
            pattern: /`(?:\\\\|\\?[^\\])*?`/,
            greedy: true,
            inside: {
                'interpolation': {
                    pattern: /\$\{[^}]+\}/,
                    inside: {
                        'interpolation-punctuation': {
                            pattern: /^\$\{|\}$/,
                            alias: 'punctuation'
                        },
                        rest: highlight.languages.javascript
                    }
                },
                'string': /[\s\S]+/
            }
        }
    });

    if (highlight.languages.markup) {
        highlight.languages.insertBefore('markup', 'tag', {
            'script': {
                pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
                lookbehind: true,
                inside: highlight.languages.javascript,
                alias: 'language-javascript'
            }
        });
    }

    highlight.languages.js = highlight.languages.javascript;
});