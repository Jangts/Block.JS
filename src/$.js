/*!
 * tangram.js framework source code
 *
 * http://www.yangram.net/tangram.js/
 *
 * Date: 2017-04-06
 */
;
tangram.block([
    '$_/dom/Elements/animation.clsx',
    '$_/dom/Elements/form.clsx'
], function(pandora, global, undefined) {
    global.$ = pandora.$ = pandora.dom.select;
});