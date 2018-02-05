/*!
 * Block.JS Framework Source Code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
block('$_/see/highlight/highlight.xtd', function(_, global, undefined) {
    _.see.highlight.languages.r = {
        'comment': /#.*/,
        'string': /(['"])(?:\\?.)*?\1/,
        'percent-operator': {
            // Includes user-defined operators
            // and %%, %*%, %/%, %in%, %o%, %x%
            pattern: /%[^%\s]*%/,
            alias: 'operator'
        },
        'boolean': /\b(?:TRUE|FALSE)\b/,
        'ellipsis': /\.\.(?:\.|\d+)/,
        'number': [
            /\b(?:NaN|Inf)\b/,
            /\b(?:0x[\dA-Fa-f]+(?:\.\d*)?|\d*\.?\d+)(?:[EePp][+-]?\d+)?[iL]?\b/
        ],
        'keyword': /\b(?:if|else|repeat|while|function|for|in|next|break|NULL|NA|NA_integer_|NA_real_|NA_complex_|NA_character_)\b/,
        'operator': /->?>?|<(?:=|<?-)?|[>=!]=?|::?|&&?|\|\|?|[+*\/^$@~]/,
        'punctuation': /[(){}\[\],;]/
    };
});