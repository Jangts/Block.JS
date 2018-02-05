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
    '$_/see/highlight/languages/javascript.xtd',
    '$_/see/highlight/languages/markup.xtd'
], function(_, global, undefined) {
    var highlight = _.see.highlight;
    var javascript = _.copy(highlight.languages.javascript);

    highlight.languages.jsx = highlight.languages.extend('markup', javascript);
    highlight.languages.jsx.tag.pattern = /<\/?[\w\.:-]+\s*(?:\s+[\w\.:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+|(\{[\w\W]*?\})))?\s*)*\/?>/i;

    highlight.languages.jsx.tag.inside['attr-value'].pattern = /=[^\{](?:('|")[\w\W]*?(\1)|[^\s>]+)/i;

    var jsxExpression = _.copy(highlight.languages.jsx);

    delete jsxExpression.punctuation

    jsxExpression = highlight.languages.insertBefore('jsx', 'operator', {
        'punctuation': /=(?={)|[{}[\];(),.:]/
    }, {
        jsx: jsxExpression
    });

    highlight.languages.insertBefore('inside', 'attr-value', {
            'script': {
                // Allow for one level of nesting
                pattern: /=(\{(?:\{[^}]*\}|[^}])+\})/i,
                inside: jsxExpression,
                'alias': 'language-javascript'
            }
        },
        highlight.languages.jsx.tag);

});