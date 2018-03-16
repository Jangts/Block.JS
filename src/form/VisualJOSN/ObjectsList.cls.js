/*!
 * tangram.js framework source code
 *
 * class forms/VisualJOSN
 * 
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/form/VisualJOSN/style.css',
    '$_/util/bool.xtd',
    '$_/dom/HTMLClose.cls',
    '$_/dom/Events.cls',
    '$_/data/',
    '$_/form/VisualJOSN/Selection.cls',
    '$_/form/VisualJOSN/parameters.tmp',
    '$_/form/VisualJOSN/builders.tmp',
    '$_/form/VisualJOSN/events.tmp',
    '$_/form/VisualJOSN/checks.tmp'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    //Define NameSpace 'form'
    _('form');

    //Declare Class 'form.VisualJOSN'
    /**
     * forms inspection and submission and ect.
     * @class 'VisualJOSN'
     * @constructor
     * @param {Mix, Object }
     */

    declare('form.VisualJOSN', {
        textarea: null,
        toolbar: null,
    });

    _.extend(_.form.VisualJOSN, {
        extends: function(object, rewrite) {
            _.extend(_.form.VisualJOSN.prototype, rewrite, object);
        }
    });

    //console.log(dialogs);
});