/*!
 * tangram.js framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tangram.block('$_/see/highlight/highlight', function(_, global, undefined) {
    _.see.highlight.languages.ini = {
        'comment': /^[ \t]*;.*$/m,
        'important': /\[.*?\]/,
        'constant': /^[ \t]*[^\s=]+?(?=[ \t]*=)/m,
        'attr-value': {
            pattern: /=.*/,
            inside: {
                'punctuation': /^[=]/
            }
        }
    };
});