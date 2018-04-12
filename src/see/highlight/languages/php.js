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
    '$_/see/highlight/languages/clike'
], function(_, global, undefined) {
    var doc = global.document,
        location = global.location,
        highlight = _.see.highlight;

    /**
     * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
     * Modified by Miles Johnson: http://milesj.me
     *
     * Supports the following:
     * 		- Extends clike syntax
     * 		- Support for PHP 5.3+ (namespaces, traits, generators, etc)
     * 		- Smarter constant and function matching
     *
     * Adds the following new token classes:
     * 		constant, delimiter, variable, function, package
     */

    highlight.languages.php = highlight.languages.extend('clike', {
        'keyword': /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
        'constant': /\b[A-Z0-9_]{2,}\b/,
        'comment': {
            pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,
            lookbehind: true
        }
    });

    // Shell-like comments are matched after strings, because they are less
    // common than strings containing hashes...
    highlight.languages.insertBefore('php', 'class-name', {
        'shell-comment': {
            pattern: /(^|[^\\])#.*/,
            lookbehind: true,
            alias: 'comment'
        }
    });

    highlight.languages.insertBefore('php', 'keyword', {
        'delimiter': /\?>|<\?(?:php)?/i,
        'variable': /\$\w+\b/i,
        'package': {
            pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
            lookbehind: true,
            inside: {
                punctuation: /\\/
            }
        }
    });

    // Must be defined after the function pattern
    highlight.languages.insertBefore('php', 'operator', {
        'property': {
            pattern: /(->)[\w]+/,
            lookbehind: true
        }
    });

    // Add HTML support of the markup language exists
    if (highlight.languages.markup) {

        // Tokenize all inline PHP blocks that are wrapped in <?php ?>
        // This allows for easy PHP + markup highlighting
        highlight.hooks.add('before-highlight',
            function(env) {
                if (env.language !== 'php') {
                    return;
                }

                env.tokenStack = [];

                env.backupCode = env.code;
                env.code = env.code.replace(/(?:<\?php|<\?)[\w\W]*?(?:\?>)/ig,
                    function(match) {
                        env.tokenStack.push(match);

                        return '{{{PHP' + env.tokenStack.length + '}}}';
                    });
            });

        // Restore env.code for other plugins (e.g. line-numbers)
        highlight.hooks.add('before-insert',
            function(env) {
                if (env.language === 'php') {
                    env.code = env.backupCode;
                    delete env.backupCode;
                }
            });

        // Re-insert the tokens after highlighting
        highlight.hooks.add('after-highlight',
            function(env) {
                if (env.language !== 'php') {
                    return;
                }

                for (var i = 0,
                        t; t = env.tokenStack[i]; i++) {
                    // The replace prevents $$, $&, $`, $', $n, $nn from being interpreted as special patterns
                    env.highlightedCode = env.highlightedCode.replace('{{{PHP' + (i + 1) + '}}}', highlight.highlight(t, env.grammar, 'php').replace(/\$/g, '$$$$'));
                }

                env.element.innerHTML = env.highlightedCode;
            });

        // Wrap tokens in classes that are missing them
        highlight.hooks.add('wrap',
            function(env) {
                if (env.language === 'php' && env.type === 'markup') {
                    env.content = env.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g, "<span class=\"token php\">$1</span>");
                }
            });

        // Add the rules before all others
        highlight.languages.insertBefore('php', 'comment', {
            'markup': {
                pattern: /<[^?]\/?(.*?)>/,
                inside: highlight.languages.markup
            },
            'php': /\{\{\{PHP[0-9]+\}\}\}/
        });
    };
    highlight.languages.insertBefore('php', 'variable', {
        'this': /\$this\b/,
        'global': /\$(?:_(?:SERVER|GET|POST|FILES|REQUEST|SESSION|ENV|COOKIE)|GLOBALS|HTTP_RAW_POST_DATA|argc|argv|php_errormsg|http_response_header)/,
        'scope': {
            pattern: /\b[\w\\]+::/,
            inside: {
                keyword: /(static|self|parent)/,
                punctuation: /(::|\\)/
            }
        }
    });
});