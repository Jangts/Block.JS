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
    highlight.languages.c = highlight.languages.extend('clike', {
        'keyword': /\b(asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/,
        'operator': /\-[>-]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|?\||[~^%?*\/]/,
        'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)[ful]*\b/i
    });

    highlight.languages.insertBefore('c', 'string', {
        'macro': {
            // allow for multiline macro definitions
            // spaces after the # character compile fine with gcc
            pattern: /(^\s*)#\s*[a-z]+([^\r\n\\]|\\.|\\(?:\r\n?|\n))*/im,
            lookbehind: true,
            alias: 'property',
            inside: {
                // highlight the path of the include statement as a string
                'string': {
                    pattern: /(#\s*include\s*)(<.+?>|("|')(\\?.)+?\3)/,
                    lookbehind: true
                },
                // highlight macro directives as keywords
                'directive': {
                    pattern: /(#\s*)\b(define|elif|else|endif|error|ifdef|ifndef|if|import|include|line|pragma|undef|using)\b/,
                    lookbehind: true,
                    alias: 'keyword'
                }
            }
        },
        // highlight predefined macros as constants
        'constant': /\b(__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|stdin|stdout|stderr)\b/
    });

    delete highlight.languages.c['class-name'];
    delete highlight.languages.c['boolean'];
});