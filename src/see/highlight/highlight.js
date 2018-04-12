/*!
 * tangram.js framework source code
 *
 * static see.highlight
 *
 * Date: 2017-04-06
 */
;
tangram.block([
    '$_/util/bool',
    '$_/util/type',
    '$_/dom/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console,
        location = global.location,
        query = _.dom.sizzle || _.dom.query,
        uniqueId = 0,

        Token = declare({
            _init: function(type, content, alias, matchedStr, greedy) {
                this.type = type;
                this.content = content;
                this.alias = alias;
                // Copy of the full string this token was created from
                this.matchedStr = matchedStr || null;
                this.greedy = !!greedy;
            }
        });

    Token.stringify = function(o, language, parent) {
        if (_.util.bool.isStr(o)) {
            return o;
        }
        if (_.util.type.Obj.native(o) === 'Array') {
            return o.map(function(element) {
                return Token.stringify(element, language, o);
            }).join('');
        }
        var env = {
            type: o.type,
            content: Token.stringify(o.content, language, parent),
            tag: 'span',
            classes: ['ib-hl', o.type],
            attributes: {},
            language: language,
            parent: parent
        };
        if (env.type == 'comment') {
            env.attributes['spellcheck'] = 'true';
        }
        if (o.alias) {
            var aliases = _.util.type.Obj.native(o.alias) === 'Array' ? o.alias : [o.alias];
            Array.prototype.push.apply(env.classes, aliases);
        }
        _.see.highlight.hooks.run('wrap', env);
        var attributes = '';
        _.each(env.attributes,
            function(name) {
                attributes += (attributes ? ' ' : '') + name + '="' + (env.attributes[name] || '') + '"';
            });
        return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';

    };

    _('see.highlight', {
        util: {
            encode: function(tokens) {
                if (tokens instanceof Token) {
                    return new Token(tokens.type, _.see.highlight.util.encode(tokens.content), tokens.alias);
                }
                if (_.util.type.Obj.native(tokens) === 'Array') {
                    return tokens.map(_.see.highlight.util.encode);
                }
                return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
            },
            objId: function(obj) {
                if (!obj['__id']) {
                    Object.defineProperty(obj, '__id', {
                        value: ++uniqueId
                    });
                }
                return obj['__id'];
            }
        },
        languages: {
            extend: function(id, redef) {
                var lang = _.copy(_.see.highlight.languages[id]);
                _.each(redef,
                    function(key, val) {
                        lang[key] = val;
                    });
                return lang;
            },

            /**
             * Insert a token before another token in a language literal
             * As this needs to recreate the object (we cannot actually insert before keys in object literals),
             * we cannot just provide an object, we need anobject and a key.
             * @param inside The key (or language id) of the parent
             * @param before The key to insert before. If not provided, the function appends instead.
             * @param insert Object with the key/value pairs to insert
             * @param root The object that contains `inside`. If equal to view/highlight.languages, it can be omitted.
             */
            insertBefore: function(inside, before, insert, root) {
                root = root || _.see.highlight.languages;
                var grammar = root[inside];
                if (arguments.length == 2) {
                    insert = arguments[1];
                    _.each(insert,
                        function(newToken, val) {
                            if (insert.hasOwnProperty(newToken)) {
                                grammar[newToken] = val;
                            }
                        });
                    return grammar;
                }
                var ret = {};
                _.each(grammar,
                    function(token) {
                        if (grammar.hasOwnProperty(token)) {
                            if (token == before) {
                                _.each(insert,
                                    function(newToken, val) {
                                        if (insert.hasOwnProperty(newToken)) {
                                            ret[newToken] = val;
                                        }
                                    });
                            }
                            ret[token] = grammar[token];
                        }
                    });
                // Update references in other language definitions
                _.see.highlight.languages.DFS(_.see.highlight.languages,
                    function(key, value) {
                        if (value === root[inside] && key != inside) {
                            this[key] = ret;
                        }
                    });
                return root[inside] = ret;
            },
            // Traverse a language definition with Depth First Search
            DFS: function(o, callback, type, visited) {
                visited = visited || {};
                for (var i in o) {
                    if (o.hasOwnProperty(i)) {
                        callback.call(o, i, o[i], type || i);
                        if (_.util.type.Obj.native(o[i]) === 'Object' && !visited[_.see.highlight.objId(o[i])]) {
                            visited[_.see.highlight.objId(o[i])] = true;
                            _.see.highlight.languages.DFS(o[i], callback, null, visited);
                        } else if (_.util.type.Obj.native(o[i]) === 'Array' && !visited[_.see.highlight.objId(o[i])]) {
                            visited[_.see.highlight.objId(o[i])] = true;
                            _.see.highlight.languages.DFS(o[i], callback, i, visited);
                        }
                    }
                }
            }
        },
        plugins: {},
        renderAll: function(callback) {
            var env = {
                callback: callback,
                selector: 'code[data-language], [data-language] code, code[data-lang], [data-lang] code'
            };

            _.see.highlight.hooks.run("before-highlightall", env);

            var elements = env.elements || query(env.selector);

            for (var i = 0,
                    element; element = elements[i++];) {
                _.see.highlight.renderElement(element, env.callback);
            }
        },
        renderElement: function(element, callback) {
            // Find language
            var language, grammar, parent = element;

            while (parent && parent.hasAttribute && !(parent.hasAttribute('data-language') || parent.hasAttribute('data-lang'))) {
                parent = parent.parentNode;
            }

            if (parent) {
                language = _.dom.getData(parent, 'language') || _.dom.getData(parent, 'lang') || '';
                grammar = _.see.highlight.languages[language];
            }
            // Set language on the element, if not present
            _.dom.setData(element, 'language', language);
            // element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
            // Set language on the parent, for styling
            parent = element.parentNode;

            if (parent && /pre/i.test(parent.nodeName)) {
                _.dom.setData(parent, 'language', language);
            }
            var code = element.textContent;
            var env = {
                element: element,
                language: language,
                grammar: grammar,
                code: code
            };
            if (!code || !grammar) {
                _.see.highlight.hooks.run('complete', env);
                return;
            }
            _.see.highlight.hooks.run('before-highlight', env);
            env.highlightedCode = _.see.highlight.highlight(env.code, env.grammar, env.language);
            _.see.highlight.hooks.run('before-insert', env);
            env.element.innerHTML = env.highlightedCode;
            (typeof callback === 'function') && callback.call(element);
            _.see.highlight.hooks.run('after-highlight', env);
            _.see.highlight.hooks.run('complete', env);
        },
        render: function(element, callback) {
            if (_.util.type(element) === 'Element') {
                _.see.highlight.renderElement(element, callback);
            } else {
                _.see.highlight.renderAll(element);
            }
        },
        highlight: function(text, grammar, language) {
            var tokens = _.see.highlight.tokenize(text, grammar);
            return Token.stringify(_.see.highlight.util.encode(tokens), language);
        },
        tokenize: function(text, grammar, language) {
            var _Token = Token;
            var strarr = [text];
            var rest = grammar.rest;
            if (rest) {
                for (var token in rest) {
                    grammar[token] = rest[token];
                }
                delete grammar.rest;
            }
            tokenloop: for (var token in grammar) {
                if (!grammar.hasOwnProperty(token) || !grammar[token]) {
                    continue;
                }
                var patterns = grammar[token];
                patterns = (_.util.type.Obj.native(patterns) === "Array") ? patterns : [patterns];
                for (var j = 0; j < patterns.length; ++j) {
                    var pattern = patterns[j],
                        inside = pattern.inside,
                        lookbehind = !!pattern.lookbehind,
                        greedy = !!pattern.greedy,
                        lookbehindLength = 0,
                        alias = pattern.alias;
                    pattern = pattern.pattern || pattern;
                    for (var i = 0; i < strarr.length; i++) { // Don’t cache length as it changes during the loop
                        var str = strarr[i];
                        if (strarr.length > text.length) {
                            // Something went terribly wrong, ABORT, ABORT!
                            break tokenloop;
                        }
                        if (str instanceof _Token) {
                            continue;
                        }
                        pattern.lastIndex = 0;
                        var match = pattern.exec(str),
                            delNum = 1;
                        // Greedy patterns can override/remove up to two previously matched tokens
                        if (!match && greedy && i != strarr.length - 1) {
                            // Reconstruct the original text using the next two tokens
                            var nextToken = strarr[i + 1].matchedStr || strarr[i + 1],
                                combStr = str + nextToken;
                            if (i < strarr.length - 2) {
                                combStr += strarr[i + 2].matchedStr || strarr[i + 2];
                            }
                            // Try the pattern again on the reconstructed text
                            pattern.lastIndex = 0;
                            match = pattern.exec(combStr);
                            if (!match) {
                                continue;
                            }
                            var from = match.index + (lookbehind ? match[1].length : 0);
                            // To be a valid candidate, the new match has to start inside of str
                            if (from >= str.length) {
                                continue;
                            }
                            var to = match.index + match[0].length,
                                len = str.length + nextToken.length;
                            // Number of tokens to delete and replace with the new match
                            delNum = 3;
                            if (to <= len) {
                                if (strarr[i + 1].greedy) {
                                    continue;
                                }
                                delNum = 2;
                                combStr = combStr.slice(0, len);
                            }
                            str = combStr;
                        }
                        if (!match) {
                            continue;
                        }
                        if (lookbehind) {
                            lookbehindLength = match[1].length;
                        }
                        var from = match.index + lookbehindLength,
                            match = match[0].slice(lookbehindLength),
                            to = from + match.length,
                            before = str.slice(0, from),
                            after = str.slice(to);
                        var args = [i, delNum];
                        if (before) {
                            args.push(before);
                        }
                        var wrapped = new _Token(token, inside ? _.see.highlight.tokenize(match, inside) : match, alias, match, greedy);
                        args.push(wrapped);
                        if (after) {
                            args.push(after);
                        }
                        Array.prototype.splice.apply(strarr, args);
                    }
                }
            }
            return strarr;
        },
        hooks: {
            all: {},
            add: function(name, callback) {
                var hooks = _.see.highlight.hooks.all;
                hooks[name] = hooks[name] || [];
                hooks[name].push(callback);
            },
            run: function(name, env) {
                var callbacks = _.see.highlight.hooks.all[name];
                if (!callbacks || !callbacks.length) {
                    return;
                }
                for (var i = 0,
                        callback; callback = callbacks[i++];) {
                    callback(env);
                }
            }
        }
    });
});