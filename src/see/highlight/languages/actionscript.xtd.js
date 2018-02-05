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
    '$_/see/highlight/languages/javascript.xtd'
], function(_, global, undefined) {
    var highlight = _.see.highlight;
    highlight.languages.actionscript = highlight.languages.extend('javascript', {
        'keyword': /\b(?:as|break|case|catch|class|const|default|delete|do|else|extends|finally|for|function|if|implements|import|in|instanceof|interface|internal|is|native|new|null|package|private|protected|public|return|super|switch|this|throw|try|typeof|use|var|void|while|with|dynamic|each|final|get|include|namespace|native|override|set|static)\b/,
        'operator': /\+\+|--|(?:[+\-*\/%^]|&&?|\|\|?|<<?|>>?>?|[!=]=?)=?|[~?@]/
    });
    highlight.languages.actionscript['class-name'].alias = 'function';

    if (highlight.languages.markup) {
        highlight.languages.insertBefore('actionscript', 'string', {
            'xml': {
                pattern: /(^|[^.])<\/?\w+(?:\s+[^\s>\/=]+=("|')(?:\\\1|\\?(?!\1)[\w\W])*\2)*\s*\/?>/,
                lookbehind: true,
                inside: {
                    rest: highlight.languages.markup
                }
            }
        });
    };
});