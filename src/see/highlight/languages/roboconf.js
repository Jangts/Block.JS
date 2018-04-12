/*!
 * tangram.js framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tangram.block('$_/see/highlight/highlight', function(_, global, undefined) {
    _.see.highlight.languages.roboconf = {
        'comment': /#.*/,
        'keyword': {
            'pattern': /(^|\s)(?:(?:facet|instance of)(?=[ \t]+[\w-]+[ \t]*\{)|(?:external|import)\b)/,
            lookbehind: true
        },
        'component': {
            pattern: /[\w-]+(?=[ \t]*\{)/,
            alias: 'variable'
        },
        'property': /[\w.-]+(?=[ \t]*:)/,
        'value': {
            pattern: /(=[ \t]*)[^,;]+/,
            lookbehind: true,
            alias: 'attr-value'
        },
        'optional': {
            pattern: /\(optional\)/,
            alias: 'builtin'
        },
        'wildcard': {
            pattern: /(\.)\*/,
            lookbehind: true,
            alias: 'operator'
        },
        'punctuation': /[{},.;:=]/
    };

});