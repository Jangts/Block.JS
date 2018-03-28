/*!
 * tangram.js framework source code
 *
 * class forms/VisualJOSN
 * 
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/dom/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    //Define NameSpace 'form.VisualJOSN'
    _('form.VisualJOSN');

    var buildTextarea = function(textarea) {
        var text;
        _.dom.setStyle(textarea, 'display', 'none');
        return {
            Element: textarea,
            getText: function() {
                if (textarea.value) {
                    text = JSON.stringify(JSON.parse(textarea.value) || {});
                } else {
                    text = JSON.stringify(JSON.parse(textarea.innerHTML) || {});
                }
                if (!text) {
                    text = '{}';
                }
                return text;
            },
            setText: function(value) {
                if (textarea.value) {
                    text = textarea.value = JSON.stringify(JSON.parse(value) || {});
                } else {
                    text = textarea.innerHTML = JSON.stringify(JSON.parse(value) || {});
                }
                return text;
            }
        };
    }

    declare('form.VisualJOSN.Object', {
        Element: null,
        textarea: null,
        _init: function(elem, textarea) {
            if (_.util.bool.isEl(elem)) {
                this.Element = elem;
                _.dom.addClass(this.Element, 'tangram visual-json visual-json-obj');
                this.bindInput(textarea);
            } else {
                return _.error('"textarea" must be an element!');
            }

        },
        bindInput: function (textarea){
            if (_.util.bool.isEl(textarea)) {
                this.textarea = buildTextarea(textarea);
                this.loadJSON(this.textarea.getText());
            }
            return this;
        },
        loadJSON: function(string) {
            var inputs = [],
                obj = JSON.parse(string) || {};

            _.each(obj, function(prop, value) {
                inputs.push('<input data-prop-name="' + prop + '" value="' + value + '" />');
            });
            this.Element.innerHTML = inputs.join('');
            return this;
        },
        getJSON: function() {
            var json, prop, obj = {};

            _.each(_.query('[data-prop-name]', this.Element), function() {
                prop = _.dom.getAttr(this, 'data-prop-name');
                obj[prop] = this.value;
            });
            json = JSON.stringify(obj);
            if (this.textarea) {
                this.textarea.setText(json);
            }
            return json;
        }
    });
});