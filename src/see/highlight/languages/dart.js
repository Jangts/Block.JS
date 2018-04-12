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
    highlight.languages.dart = highlight.languages.extend('clike', {
        'string': [/r?("""|''')[\s\S]*?\1/, /r?("|')(\\?.)*?\1/],
        'keyword': [/\b(?:async|sync|yield)\*/, /\b(?:abstract|assert|async|await|break|case|catch|class|const|continue|default|deferred|do|dynamic|else|enum|export|external|extends|factory|final|finally|for|get|if|implements|import|in|library|new|null|operator|part|rethrow|return|set|static|super|switch|this|throw|try|typedef|var|void|while|with|yield)\b/],
        'operator': /\bis!|\b(?:as|is)\b|\+\+|--|&&|\|\||<<=?|>>=?|~(?:\/=?)?|[+\-*\/%&^|=!<>]=?|\?/
    });

    highlight.languages.insertBefore('dart', 'function', {
        'metadata': {
            pattern: /@\w+/,
            alias: 'symbol'
        }
    });
});