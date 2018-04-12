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
    '$_/see/highlight/languages/markup'
], function(_, global, undefined) {
    _.see.highlight.xml = _.see.highlight.languages.markup;
});