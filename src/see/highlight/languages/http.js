/*!
 * tangram.js framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tangram.block('$_/see/highlight/highlight', function(_, global, undefined) {
    _.see.highlight.languages.http = {
        'request-line': {
            pattern: /^(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b\shttps?:\/\/\S+\sHTTP\/[0-9.]+/m,
            inside: {
                // HTTP Verb
                property: /^(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b/,
                // Path or query argument
                'attr-name': /:\w+/
            }
        },
        'response-status': {
            pattern: /^HTTP\/1.[01] [0-9]+.*/m,
            inside: {
                // Status, e.g. 200 OK
                property: {
                    pattern: /(^HTTP\/1.[01] )[0-9]+.*/i,
                    lookbehind: true
                }
            }
        },
        // HTTP header name
        'header-name': {
            pattern: /^[\w-]+:(?=.)/m,
            alias: 'keyword'
        }
    };

    // Create a mapping of Content-Type headers to language definitions
    var httpLanguages = {
        'application/json': highlight.languages.javascript,
        'application/xml': highlight.languages.markup,
        'text/xml': highlight.languages.markup,
        'text/html': highlight.languages.markup
    };

    // Insert each content type parser that has its associated language
    // currently loaded.
    for (var contentType in httpLanguages) {
        if (httpLanguages[contentType]) {
            var options = {};
            options[contentType] = {
                pattern: new RegExp('(content-type:\\s*' + contentType + '[\\w\\W]*?)(?:\\r?\\n|\\r){2}[\\w\\W]*', 'i'),
                lookbehind: true,
                inside: {
                    rest: httpLanguages[contentType]
                }
            };
            highlight.languages.insertBefore('http', 'header-name', options);
        }
    };
});