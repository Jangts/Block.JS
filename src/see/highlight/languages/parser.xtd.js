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
    '$_/see/highlight/languages/markup.xtd'
], function(_, global, undefined) {
    var highlight = _.see.highlight;
    highlight.languages.parser = highlight.languages.extend('markup', {
        'keyword': {
            pattern: /(^|[^^])(?:\^(?:case|eval|for|if|switch|throw)\b|@(?:BASE|CLASS|GET(?:_DEFAULT)?|OPTIONS|SET_DEFAULT|USE)\b)/,
            lookbehind: true
        },
        'variable': {
            pattern: /(^|[^^])\B\$(?:\w+|(?=[.\{]))(?:(?:\.|::?)\w+)*(?:\.|::?)?/,
            lookbehind: true,
            inside: {
                'punctuation': /\.|:+/
            }
        },
        'function': {
            pattern: /(^|[^^])\B[@^]\w+(?:(?:\.|::?)\w+)*(?:\.|::?)?/,
            lookbehind: true,
            inside: {
                'keyword': {
                    pattern: /(^@)(?:GET_|SET_)/,
                    lookbehind: true
                },
                'punctuation': /\.|:+/
            }
        },
        'escape': {
            pattern: /\^(?:[$^;@()\[\]{}"':]|#[a-f\d]*)/i,
            alias: 'builtin'
        },
        'punctuation': /[\[\](){};]/
    });
    highlight.languages.insertBefore('parser', 'keyword', {
        'parser-comment': {
            pattern: /(\s)#.*/,
            lookbehind: true,
            alias: 'comment'
        },
        'expression': {
            // Allow for 3 levels of depth
            pattern: /(^|[^^])\((?:[^()]|\((?:[^()]|\((?:[^()])*\))*\))*\)/,
            lookbehind: true,
            inside: {
                'string': {
                    pattern: /(^|[^^])(["'])(?:(?!\2)[^^]|\^[\s\S])*\2/,
                    lookbehind: true
                },
                'keyword': highlight.languages.parser.keyword,
                'variable': highlight.languages.parser.variable,
                'function': highlight.languages.parser.
                function,
                'boolean': /\b(?:true|false)\b/,
                'number': /\b(?:0x[a-f\d]+|\d+\.?\d*(?:e[+-]?\d+)?)\b/i,
                'escape': highlight.languages.parser.escape,
                'operator': /[~+*\/\\%]|!(?:\|\|?|=)?|&&?|\|\|?|==|<[<=]?|>[>=]?|-[fd]?|\b(?:def|eq|ge|gt|in|is|le|lt|ne)\b/,
                'punctuation': highlight.languages.parser.punctuation
            }
        }
    });
    highlight.languages.insertBefore('inside', 'punctuation', {
            'expression': highlight.languages.parser.expression,
            'keyword': highlight.languages.parser.keyword,
            'variable': highlight.languages.parser.variable,
            'function': highlight.languages.parser.
            function,
            'escape': highlight.languages.parser.escape,
            'parser-punctuation': {
                pattern: highlight.languages.parser.punctuation,
                alias: 'punctuation'
            }
        },
        highlight.languages.parser['tag'].inside['attr-value']);
});