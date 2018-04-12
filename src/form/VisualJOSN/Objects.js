/*!
 * tangram.js framework source code
 *
 * class forms/VisualJOSN
 * 
 * Date: 2015-09-04
 */
;
tangram.block([

], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
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