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
    '$_/see/highlight/languages/css'
], function(_, global, undefined) {
    var highlight = _.see.highlight;
    highlight.languages.scss = highlight.languages.extend('css', {
        'comment': {
            pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,
            lookbehind: true
        },
        'atrule': {
            pattern: /@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,
            inside: {
                'rule': /@[\w-]+/
                    // See rest below
            }
        },
        // url, compassified
        'url': /(?:[-a-z]+-)*url(?=\()/i,
        // CSS selector regex is not appropriate for Sass
        // since there can be lot more things (var, @ directive, nesting..)
        // a selector must start at the end of a property or after a brace (end of other rules or nesting)
        // it can contain some characters that aren't used for defining rules or end of selector, & (parent selector), or interpolated variable
        // the end of a selector is found when there is no rules in it ( {} or {\s}) or if there is a property (because an interpolated var
        // can "pass" as a selector- e.g: proper#{$erty})
        // this one was hard to do, so please be careful if you edit this one :)
        'selector': {
            // Initial look-ahead is used to prevent matching of blank selectors
            pattern: /(?=\S)[^@;\{\}\(\)]?([^@;\{\}\(\)]|&|#\{\$[-_\w]+\})+(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/m,
            inside: {
                'placeholder': /%[-_\w]+/
            }
        }
    });

    highlight.languages.insertBefore('scss', 'atrule', {
        'keyword': [/@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i, {
            pattern: /( +)(?:from|through)(?= )/,
            lookbehind: true
        }]
    });

    highlight.languages.insertBefore('scss', 'property', {
        // var and interpolated vars
        'variable': /\$[-_\w]+|#\{\$[-_\w]+\}/
    });

    highlight.languages.insertBefore('scss', 'function', {
        'placeholder': {
            pattern: /%[-_\w]+/,
            alias: 'selector'
        },
        'statement': /\B!(?:default|optional)\b/i,
        'boolean': /\b(?:true|false)\b/,
        'null': /\bnull\b/,
        'operator': {
            pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,
            lookbehind: true
        }
    });

    highlight.languages.scss['atrule'].inside.rest = _.copy(highlight.languages.scss);
    highlight.languages.scala = highlight.languages.extend('java', {
        'keyword': /<-|=>|\b(?:abstract|case|catch|class|def|do|else|extends|final|finally|for|forSome|if|implicit|import|lazy|match|new|null|object|override|package|private|protected|return|sealed|self|super|this|throw|trait|try|type|val|var|while|with|yield)\b/,
        'string': /"""[\W\w]*?"""|"(?:[^"\\\r\n]|\\.)*"|'(?:[^\\\r\n']|\\.[^\\']*)'/,
        'builtin': /\b(?:String|Int|Long|Short|Byte|Boolean|Double|Float|Char|Any|AnyRef|AnyVal|Unit|Nothing)\b/,
        'number': /\b(?:0x[\da-f]*\.?[\da-f]+|\d*\.?\d+e?\d*[dfl]?)\b/i,
        'symbol': /'[^\d\s\\]\w*/
    });
    delete highlight.languages.scala['class-name'];
    delete highlight.languages.scala['function'];
});