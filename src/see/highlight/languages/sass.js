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
    highlight.languages.sass = highlight.languages.extend('css', {
        // Sass comments don't need to be closed, only indented
        'comment': {
            pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t]+.+)*/m,
            lookbehind: true
        }
    });

    highlight.languages.insertBefore('sass', 'atrule', {
        // We want to consume the whole line
        'atrule-line': {
            // Includes support for = and + shortcuts
            pattern: /^(?:[ \t]*)[@+=].+/m,
            inside: {
                'atrule': /(?:@[\w-]+|[+=])/m
            }
        }
    });
    delete highlight.languages.sass.atrule;


    var variable = /((\$[-_\w]+)|(#\{\$[-_\w]+\}))/i;
    var operator = [
        /[+*\/%]|[=!]=|<=?|>=?|\b(?:and|or|not)\b/,
        {
            pattern: /(\s+)-(?=\s)/,
            lookbehind: true
        }
    ];

    highlight.languages.insertBefore('sass', 'property', {
        // We want to consume the whole line
        'variable-line': {
            pattern: /^[ \t]*\$.+/m,
            inside: {
                'punctuation': /:/,
                'variable': variable,
                'operator': operator
            }
        },
        // We want to consume the whole line
        'property-line': {
            pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s]+.*)/m,
            inside: {
                'property': [
                    /[^:\s]+(?=\s*:)/,
                    {
                        pattern: /(:)[^:\s]+/,
                        lookbehind: true
                    }
                ],
                'punctuation': /:/,
                'variable': variable,
                'operator': operator,
                'important': highlight.languages.sass.important
            }
        }
    });
    delete highlight.languages.sass.property;
    delete highlight.languages.sass.important;

    // Now that whole lines for other patterns are consumed,
    // what's left should be selectors
    delete highlight.languages.sass.selector;
    highlight.languages.insertBefore('sass', 'punctuation', {
        'selector': {
            pattern: /([ \t]*)\S(?:,?[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,?[^,\r\n]+)*)*/,
            lookbehind: true
        }
    });
});