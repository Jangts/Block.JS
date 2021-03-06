/*!
 * tangram.js framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tangram.block('$_/see/highlight/highlight.xtd', function(_, global, undefined) {
    _.see.highlight.languages.lua = {
        'comment': /^#!.+|--(?:\[(=*)\[[\s\S]*?\]\1\]|.*)/m,
        // \z may be used to skip the following space
        'string': /(["'])(?:(?!\1)[^\\\r\n]|\\z(?:\r\n|\s)|\\(?:\r\n|[\s\S]))*\1|\[(=*)\[[\s\S]*?\]\2\]/,
        'number': /\b0x[a-f\d]+\.?[a-f\d]*(?:p[+-]?\d+)?\b|\b\d+(?:\.\B|\.?\d*(?:e[+-]?\d+)?\b)|\B\.\d+(?:e[+-]?\d+)?\b/i,
        'keyword': /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,
        'function': /(?!\d)\w+(?=\s*(?:[({]))/,
        'operator': [
            /[-+*%^&|#]|\/\/?|<[<=]?|>[>=]?|[=~]=?/, {
                // Match ".." but don't break "..."
                pattern: /(^|[^.])\.\.(?!\.)/,
                lookbehind: true
            }
        ],
        'punctuation': /[\[\](){},;]|\.+|:+/
    };
});