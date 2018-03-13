/*!
 * tangram.js framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tangram.block('$_/see/highlight/highlight.xtd', function(_, global, undefined) {
    _.see.highlight.languages.makefile = {
        'comment': {
            pattern: /(^|[^\\])#(?:\\(?:\r\n|[\s\S])|.)*/,
            lookbehind: true
        },
        'string': /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,

        // Built-in target names
        'builtin': /\.[A-Z][^:#=\s]+(?=\s*:(?!=))/,

        // Targets
        'symbol': {
            pattern: /^[^:=\r\n]+(?=\s*:(?!=))/m,
            inside: {
                'variable': /\$+(?:[^(){}:#=\s]+|(?=[({]))/
            }
        },
        'variable': /\$+(?:[^(){}:#=\s]+|\([@*%<^+?][DF]\)|(?=[({]))/,

        'keyword': [
            // Directives
            /-include\b|\b(?:define|else|endef|endif|export|ifn?def|ifn?eq|include|override|private|sinclude|undefine|unexport|vpath)\b/,
            // Functions
            {
                pattern: /(\()(?:addsuffix|abspath|and|basename|call|dir|error|eval|file|filter(?:-out)?|findstring|firstword|flavor|foreach|guile|if|info|join|lastword|load|notdir|or|origin|patsubst|realpath|shell|sort|strip|subst|suffix|value|warning|wildcard|word(?:s|list)?)(?=[ \t])/,
                lookbehind: true
            }
        ],
        'operator': /(?:::|[?:+!])?=|[|@]/,
        'punctuation': /[:;(){}]/
    };
});