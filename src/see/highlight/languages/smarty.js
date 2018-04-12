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
    '$_/see/highlight/languages/markup'
], function(_, global, undefined) {
    var highlight = _.see.highlight;
    var smarty_pattern = /\{\*[\w\W]+?\*\}|\{[\w\W]+?\}/g;
    var smarty_litteral_start = '{literal}';
    var smarty_litteral_end = '{/literal}';
    var smarty_litteral_mode = false;

    highlight.languages.smarty = highlight.languages.extend('markup', {
        'smarty': {
            pattern: smarty_pattern,
            inside: {
                'delimiter': {
                    pattern: /^\{|\}$/i,
                    alias: 'punctuation'
                },
                'string': /(["'])(?:\\?.)*?\1/,
                'number': /\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee][-+]?\d+)?)\b/,
                'variable': [
                    /\$(?!\d)\w+/,
                    /#(?!\d)\w+#/,
                    {
                        pattern: /(\.|->)(?!\d)\w+/,
                        lookbehind: true
                    },
                    {
                        pattern: /(\[)(?!\d)\w+(?=\])/,
                        lookbehind: true
                    }
                ],
                'function': [{
                        pattern: /(\|\s*)@?(?!\d)\w+/,
                        lookbehind: true
                    },
                    /^\/?(?!\d)\w+/,
                    /(?!\d)\w+(?=\()/
                ],
                'attr-name': {
                    // Value is made optional because it may have already been tokenized
                    pattern: /\w+\s*=\s*(?:(?!\d)\w+)?/,
                    inside: {
                        "variable": {
                            pattern: /(=\s*)(?!\d)\w+/,
                            lookbehind: true
                        },
                        "operator": /=/
                    }
                },
                'punctuation': [
                    /[\[\]().,:`]|\->/
                ],
                'operator': [
                    /[+\-*\/%]|==?=?|[!<>]=?|&&|\|\|?/,
                    /\bis\s+(?:not\s+)?(?:div|even|odd)(?:\s+by)?\b/,
                    /\b(?:eq|neq?|gt|lt|gt?e|lt?e|not|mod|or|and)\b/
                ],
                'keyword': /\b(?:false|off|on|no|true|yes)\b/
            }
        }
    });

    // Comments are inserted at top so that they can
    // surround markup
    highlight.languages.insertBefore('smarty', 'tag', {
        'smarty-comment': {
            pattern: /\{\*[\w\W]*?\*\}/,
            alias: ['smarty', 'comment']
        }
    });

    // Tokenize all inline Smarty expressions
    highlight.hooks.add('before-highlight', function(env) {
        if (env.language !== 'smarty') {
            return;
        }

        env.tokenStack = [];

        env.backupCode = env.code;
        env.code = env.code.replace(smarty_pattern, function(match) {

            // Smarty tags inside {literal} block are ignored
            if (match === smarty_litteral_end) {
                smarty_litteral_mode = false;
            }

            if (!smarty_litteral_mode) {
                if (match === smarty_litteral_start) {
                    smarty_litteral_mode = true;
                }
                env.tokenStack.push(match);

                return '___SMARTY' + env.tokenStack.length + '___';
            }
            return match;
        });
    });

    // Restore env.code for other plugins (e.g. line-numbers)
    highlight.hooks.add('before-insert', function(env) {
        if (env.language === 'smarty') {
            env.code = env.backupCode;
            delete env.backupCode;
        }
    });

    // Re-insert the tokens after highlighting
    // and highlight them with defined grammar
    highlight.hooks.add('after-highlight', function(env) {
        if (env.language !== 'smarty') {
            return;
        }

        for (var i = 0, t; t = env.tokenStack[i]; i++) {
            // The replace prevents $$, $&, $`, $', $n, $nn from being interpreted as special patterns
            env.highlightedCode = env.highlightedCode.replace('___SMARTY' + (i + 1) + '___', highlight.highlight(t, env.grammar, 'smarty').replace(/\$/g, '$$$$'));
        }

        env.element.innerHTML = env.highlightedCode;
    });
});