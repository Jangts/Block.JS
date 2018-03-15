/*!
 * tangram.js framework source code
 *
 * class forms/VisualJOSN
 * 
 * Date: 2015-09-04
 */
;
tangram.block([], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    //Define NameSpace 'form.VisualJOSN'
    _('form.VisualJOSN');

    //Declare Class 'form.VisualJOSN'
    /**
     * forms inspection and submission and ect.
     * @class 'VisualJOSN'
     * @constructor
     * @param {Mix, Object }
     */

    declare('form.VisualJOSN.Object', {
        _init: function(elem) {
            if (_.util.bool.isEl(elem)) {
                var commonNode, text, width, height,
                    htmlclose = new _.dom.HTMLClose();

                if (textarea.tagName.toUpperCase() === 'TEXTAREA') {
                    commonNode = textarea.parentNode;
                    width = textarea.offsetWidth;
                    height = textarea.offsetHeight;
                } else {
                    commonNode = textarea;
                    width = commonNode.offsetWidth - 2;
                    height = commonNode.offsetHeight - 2;
                    var selects = _.dom.selector('input, textarea', textarea);
                    if (selects.length) {
                        textarea = selects[0];
                    } else {
                        text = commonNode.innerHTML;
                        commonNode.innerHTML = '';
                        textarea = _.dom.create('textarea', commonNode, {
                            className: 'tangram simpleeditor',
                            value: text
                        });
                    }
                }
            }
            return _.error('"textarea" must be an element!');
        }
    });
});