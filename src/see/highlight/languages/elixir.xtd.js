/*!
 * Block.JS Framework Source Code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
block('$_/see/highlight/highlight.xtd', function(_, global, undefined) {
    var highlight = _.see.highlight;
    highlight.languages.elixir = {
        // Negative look-ahead is needed for string interpolation
        // Negative look-behind is needed to avoid highlighting markdown headers in
        // multi-line doc strings
        'comment': {
            pattern: /(^|[^#])#(?![{#]).*/m,
            lookbehind: true
        },
        // ~r"""foo""", ~r'''foo''', ~r/foo/, ~r|foo|, ~r"foo", ~r'foo', ~r(foo), ~r[foo], ~r{foo}, ~r<foo>
        'regex': /~[rR](?:("""|'''|[\/|"'])(?:\\.|(?!\1)[^\\])+\1|\((?:\\\)|[^)])+\)|\[(?:\\\]|[^\]])+\]|\{(?:\\\}|[^}])+\}|<(?:\\>|[^>])+>)[uismxfr]*/,
        'string': [{
                // ~s"""foo""", ~s'''foo''', ~s/foo/, ~s|foo|, ~s"foo", ~s'foo', ~s(foo), ~s[foo], ~s{foo}, ~s<foo>
                pattern: /~[cCsSwW](?:("""|'''|[\/|"'])(?:\\.|(?!\1)[^\\])+\1|\((?:\\\)|[^)])+\)|\[(?:\\\]|[^\]])+\]|\{(?:\\\}|#\{[^}]+\}|[^}])+\}|<(?:\\>|[^>])+>)[csa]?/,
                inside: {
                    // See interpolation below
                }
            },
            {
                pattern: /("""|''')[\s\S]*?\1/,
                inside: {
                    // See interpolation below
                }
            },
            {
                // Multi-line strings are allowed
                pattern: /("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/,
                inside: {
                    // See interpolation below
                }
            }
        ],
        'atom': {
            // Look-behind prevents bad highlighting of the :: operator
            pattern: /(^|[^:]):\w+/,
            lookbehind: true,
            alias: 'symbol'
        },
        // Look-ahead prevents bad highlighting of the :: operator
        'attr-name': /\w+:(?!:)/,
        'capture': {
            // Look-behind prevents bad highlighting of the && operator
            pattern: /(^|[^&])&(?:[^&\s\d()][^\s()]*|(?=\())/,
            lookbehind: true,
            alias: 'function'
        },
        'argument': {
            // Look-behind prevents bad highlighting of the && operator
            pattern: /(^|[^&])&\d+/,
            lookbehind: true,
            alias: 'variable'
        },
        'attribute': {
            pattern: /@[\S]+/,
            alias: 'variable'
        },
        'number': /\b(?:0[box][a-f\d_]+|\d[\d_]*)(?:\.[\d_]+)?(?:e[+-]?[\d_]+)?\b/i,
        'keyword': /\b(?:after|alias|and|case|catch|cond|def(?:callback|exception|impl|module|p|protocol|struct)?|do|else|end|fn|for|if|import|not|or|require|rescue|try|unless|use|when)\b/,
        'boolean': /\b(?:true|false|nil)\b/,
        'operator': [
            /\bin\b|&&?|\|[|>]?|\\\\|::|\.\.\.?|\+\+?|-[->]?|<[-=>]|>=|!==?|\B!|=(?:==?|[>~])?|[*\/^]/,
            {
                // We don't want to match <<
                pattern: /([^<])<(?!<)/,
                lookbehind: true
            },
            {
                // We don't want to match >>
                pattern: /([^>])>(?!>)/,
                lookbehind: true
            }
        ],
        'punctuation': /<<|>>|[.,%\[\]{}()]/
    };

    highlight.languages.elixir.string.forEach(function(o) {
        o.inside = {
            'interpolation': {
                pattern: /#\{[^}]+\}/,
                inside: {
                    'delimiter': {
                        pattern: /^#\{|\}$/,
                        alias: 'punctuation'
                    },
                    rest: _.copy(highlight.languages.elixir)
                }
            }
        };
    });
});