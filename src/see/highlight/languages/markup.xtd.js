/*!
 * tangram.js framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tangram.block('$_/see/highlight/highlight.xtd', function(_, global, undefined) {
    var doc = global.document,
        location = global.location,
        highlight = _.see.highlight;
    highlight.languages.markup = {
        'comment': /<!--[\w\W]*?-->/,
        'prolog': /<\?[\w\W]+?\?>/,
        'doctype': /<!DOCTYPE[\w\W]+?>/,
        'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
        'tag': {
            pattern: /<\/?(?!\d)[^\s>\/=.$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
            inside: {
                'tag': {
                    pattern: /^<\/?[^\s>\/]+/i,
                    inside: {
                        'punctuation': /^<\/?/,
                        'namespace': /^[^\s>\/:]+:/
                    }
                },
                'attr-value': {
                    pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
                    inside: {
                        'punctuation': /[=>"']/
                    }
                },
                'punctuation': /\/?>/,
                'attr-name': {
                    pattern: /[^\s>\/]+/,
                    inside: {
                        'namespace': /^[^\s>\/:]+:/
                    }
                }

            }
        },
        'entity': /&#?[\da-z]{1,8};/i
    };
    // Plugin to make entity title show the real entity, idea by Roman Komarov
    highlight.hooks.add('wrap', function(env) {
        if (env.type === 'entity') {
            env.attributes['title'] = env.content.replace(/&amp;/, '&');
        }
    });
    highlight.languages.css = {
        'comment': /\/\*[\w\W]*?\*\//,
        'atrule': {
            pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
            inside: {
                'rule': /@[\w-]+/
                    // See rest below
            }
        },
        'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
        'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
        'string': /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
        'property': /(\b|\B)[\w-]+(?=\s*:)/i,
        'important': /\B!important\b/i,
        'function': /[-a-z0-9]+(?=\()/i,
        'punctuation': /[(){};:]/
    };

    highlight.languages.css['atrule'].inside.rest = _.copy(highlight.languages.css);

    if (highlight.languages.markup) {
        highlight.languages.insertBefore('markup', 'tag', {
            'style': {
                pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
                lookbehind: true,
                inside: highlight.languages.css,
                alias: 'language-css'
            }
        });

        highlight.languages.insertBefore('inside', 'attr-value', {
            'style-attr': {
                pattern: /\s*style=("|').*?\1/i,
                inside: {
                    'attr-name': {
                        pattern: /^\s*style/i,
                        inside: highlight.languages.markup.tag.inside
                    },
                    'punctuation': /^\s*=\s*['"]|['"]\s*$/,
                    'attr-value': {
                        pattern: /.+/i,
                        inside: highlight.languages.css
                    }
                },
                alias: 'language-css'
            }
        }, highlight.languages.markup.tag);
    };
});