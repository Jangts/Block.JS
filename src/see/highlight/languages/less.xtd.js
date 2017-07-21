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
    '$_/see/highlight/languages/css.xtd'
], function(_, global, undefined) {
    var highlight = _.see.highlight;
    /* FIXME :
 :extend() is not handled specifically : its highlighting is buggy.
 Mixin usage must be inside a ruleset to be highlighted.
 At-rules (e.g. import) containing interpolations are buggy.
 Detached rulesets are highlighted as at-rules.
 A comment before a mixin usage prevents the latter to be properly highlighted.
 */

    highlight.languages.less = highlight.languages.extend('css', {
        'comment': [/\/\*[\w\W]*?\*\//, {
            pattern: /(^|[^\\])\/\/.*/,
            lookbehind: true
        }],
        'atrule': {
            pattern: /@[\w-]+?(?:\([^{}]+\)|[^(){};])*?(?=\s*\{)/i,
            inside: {
                'punctuation': /[:()]/
            }
        },
        // selectors and mixins are considered the same
        'selector': {
            pattern: /(?:@\{[\w-]+\}|[^{};\s@])(?:@\{[\w-]+\}|\([^{}]*\)|[^{};@])*?(?=\s*\{)/,
            inside: {
                // mixin parameters
                'variable': /@+[\w-]+/
            }
        },

        'property': /(?:@\{[\w-]+\}|[\w-])+(?:\+_?)?(?=\s*:)/i,
        'punctuation': /[{}();:,]/,
        'operator': /[+\-*\/]/
    });

    // Invert function and punctuation positions
    highlight.languages.insertBefore('less', 'punctuation', {
        'function': highlight.languages.less.
        function
    });

    highlight.languages.insertBefore('less', 'property', {
        'variable': [
            // Variable declaration (the colon must be consumed!)
            {
                pattern: /@[\w-]+\s*:/,
                inside: {
                    "punctuation": /:/
                }
            },

            // Variable usage
            / @@ ? [\w - ] + /
        ],
        'mixin-usage': {
            pattern: / ([{;]\s * )[.#]( ? !\d)[\w - ] + . * ?( ? =[(;]) /,
            lookbehind: true,
            alias: 'function'
        }
    });
});