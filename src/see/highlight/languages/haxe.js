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
    highlight.languages.haxe = highlight.languages.extend('clike', {
        // Strings can be multi-line
        'string': {
            pattern: /(["'])(?:(?!\1)[^\\]|\\[\s\S])*\1/,
            inside: {
                'interpolation': {
                    pattern: /(^|[^\\])\$(?:\w+|\{[^}]+\})/,
                    lookbehind: true,
                    inside: {
                        'interpolation': {
                            pattern: /^\$\w*/,
                            alias: 'variable'
                        }
                        // See rest below
                    }
                }
            }
        },
        // The final look-ahead prevents highlighting of keywords if expressions such as "haxe.macro.Expr"
        'keyword': /\bthis\b|\b(?:abstract|as|break|case|cast|catch|class|continue|default|do|dynamic|else|enum|extends|extern|from|for|function|if|implements|import|in|inline|interface|macro|new|null|override|public|private|return|static|super|switch|throw|to|try|typedef|using|var|while)(?!\.)\b/,
        'operator': /\.{3}|\+\+?|-[->]?|[=!]=?|&&?|\|\|?|<[<=]?|>[>=]?|[*\/%~^]/
    });
    highlight.languages.insertBefore('haxe', 'class-name', {
        'regex': {
            pattern: /~\/(?:[^\/\\\r\n]|\\.)+\/[igmsu]*/
        }
    });
    highlight.languages.insertBefore('haxe', 'keyword', {
        'preprocessor': {
            pattern: /#\w+/,
            alias: 'builtin'
        },
        'metadata': {
            pattern: /@:?\w+/,
            alias: 'symbol'
        },
        'reification': {
            pattern: /\$(?:\w+|(?=\{))/,
            alias: 'variable'
        }
    });
    highlight.languages.haxe['string'].inside['interpolation'].inside.rest = _.copy(highlight.languages.haxe);
    delete highlight.languages.haxe['class-name'];
});