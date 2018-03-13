/*!
 * tangram.js framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tangram.block('$_/see/highlight/highlight.xtd', function(_, global, undefined) {
    _.see.languages.smalltalk = {
        'comment': /"(?:""|[^"])+"/,
        'string': /'(?:''|[^'])+'/,
        'symbol': /#[\da-z]+|#(?:-|([+\/\\*~<>=@%|&?!])\1?)|#(?=\()/i,
        'block-arguments': {
            pattern: /(\[\s*):[^\[|]*?\|/,
            lookbehind: true,
            inside: {
                'variable': /:[\da-z]+/i,
                'punctuation': /\|/
            }
        },
        'temporary-variables': {
            pattern: /\|[^|]+\|/,
            inside: {
                'variable': /[\da-z]+/i,
                'punctuation': /\|/
            }
        },
        'keyword': /\b(?:nil|true|false|self|super|new)\b/,
        'character': {
            pattern: /\$./,
            alias: 'string'
        },
        'number': [
            /\d+r-?[\dA-Z]+(?:\.[\dA-Z]+)?(?:e-?\d+)?/,
            /(?:\B-|\b)\d+(?:\.\d+)?(?:e-?\d+)?/
        ],
        'operator': /[<=]=?|:=|~[~=]|\/\/?|\\\\|>[>=]?|[!^+\-*&|,@]/,
        'punctuation': /[.;:?\[\](){}]/
    };
});