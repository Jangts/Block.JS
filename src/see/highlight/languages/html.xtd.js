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
    _.see.highlight.languages.html = _.see.highlight.languages.markup;
});