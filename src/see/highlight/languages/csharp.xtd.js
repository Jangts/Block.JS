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
    '$_/see/highlight/languages/clike.xtd'
], function(_, global, undefined) {
    var highlight = _.see.highlight;
    highlight.languages.csharp = highlight.languages.extend('clike', {
        'keyword': /\b(abstract|as|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|virtual|void|volatile|while|add|alias|ascending|async|await|descending|dynamic|from|get|global|group|into|join|let|orderby|partial|remove|select|set|value|var|where|yield)\b/,
        'string': [/@("|')(\1\1|\\\1|\\?(?!\1)[\s\S])*\1/, /("|')(\\?.)*?\1/],
        'number': /\b-?(0x[\da-f]+|\d*\.?\d+f?)\b/i
    });

    highlight.languages.insertBefore('csharp', 'keyword', {
        'preprocessor': {
            pattern: /(^\s*)#.*/m,
            lookbehind: true,
            alias: 'property',
            inside: {
                // highlight preprocessor directives as keywords
                'directive': {
                    pattern: /(\s*#)\b(define|elif|else|endif|endregion|error|if|line|pragma|region|undef|warning)\b/,
                    lookbehind: true,
                    alias: 'keyword'
                }
            }
        }
    });
});