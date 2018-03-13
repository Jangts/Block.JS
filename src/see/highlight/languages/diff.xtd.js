/*!
 * tangram.js framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tangram.block('$_/see/highlight/highlight.xtd', function(_, global, undefined) {
    var highlight = _.see.highlight;
    highlight.languages.diff = {
        'coord': [
            // Match all kinds of coord lines (prefixed by "+++", "---" or "***").
            /^(?:\*{3}|-{3}|\+{3}).*$/m,
            // Match "@@ ... @@" coord lines in unified diff.
            /^@@.*@@$/m,
            // Match coord lines in normal diff (starts with a number).
            /^\d+.*$/m
        ],

        // Match inserted and deleted lines. Support both +/- and >/< styles.
        'deleted': /^[-<].+$/m,
        'inserted': /^[+>].+$/m,

        // Match "different" lines (prefixed with "!") in context diff.
        'diff': {
            'pattern': /^!(?!!).+$/m,
            'alias': 'important'
        }
    };
});