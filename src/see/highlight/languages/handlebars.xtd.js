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
    var handlebars_pattern = /\{\{\{[\w\W]+?\}\}\}|\{\{[\w\W]+?\}\}/g;

    highlight.languages.handlebars = highlight.languages.extend('markup', {
        'handlebars': {
            pattern: handlebars_pattern,
            inside: {
                'delimiter': {
                    pattern: /^\{\{\{?|\}\}\}?$/i,
                    alias: 'punctuation'
                },
                'string': /(["'])(\\?.)*?\1/,
                'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?)\b/,
                'boolean': /\b(true|false)\b/,
                'block': {
                    pattern: /^(\s*~?\s*)[#\/]\S+?(?=\s*~?\s*$|\s)/i,
                    lookbehind: true,
                    alias: 'keyword'
                },
                'brackets': {
                    pattern: /\[[^\]]+\]/,
                    inside: {
                        punctuation: /\[|\]/,
                        variable: /[\w\W]+/
                    }
                },
                'punctuation': /[!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]/,
                'variable': /[^!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~\s]+/
            }
        }
    });

    // Comments are inserted at top so that they can
    // surround markup
    highlight.languages.insertBefore('handlebars', 'tag', {
        'handlebars-comment': {
            pattern: /\{\{![\w\W]*?\}\}/,
            alias: ['handlebars', 'comment']
        }
    });

    // Tokenize all inline Handlebars expressions that are wrapped in {{ }} or {{{ }}}
    // This allows for easy Handlebars + markup highlighting
    highlight.hooks.add('before-highlight', function(env) {
        if (env.language !== 'handlebars') {
            return;
        }

        env.tokenStack = [];

        env.backupCode = env.code;
        env.code = env.code.replace(handlebars_pattern, function(match) {
            env.tokenStack.push(match);

            return '___HANDLEBARS' + env.tokenStack.length + '___';
        });
    });

    // Restore env.code for other plugins (e.g. line-numbers)
    highlight.hooks.add('before-insert', function(env) {
        if (env.language === 'handlebars') {
            env.code = env.backupCode;
            delete env.backupCode;
        }
    });

    // Re-insert the tokens after highlighting
    // and highlight them with defined grammar
    highlight.hooks.add('after-highlight', function(env) {
        if (env.language !== 'handlebars') {
            return;
        }

        for (var i = 0, t; t = env.tokenStack[i]; i++) {
            // The replace prevents $$, $&, $`, $', $n, $nn from being interpreted as special patterns
            env.highlightedCode = env.highlightedCode.replace('___HANDLEBARS' + (i + 1) + '___', highlight.highlight(t, env.grammar, 'handlebars').replace(/\$/g, '$$$$'));
        }

        env.element.innerHTML = env.highlightedCode;
    });
});