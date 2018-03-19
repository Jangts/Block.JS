/*!
 * tangram.js framework source code
 *
 * class forms/VisualJOSN
 * 
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/data/Model.cls',
    '$_/form/VisualJOSN/Object.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var models = {

        },
        declareModel = function(options) {
            return {};
            return new _.data.Model(options);
        };

    //Define NameSpace 'form'
    _('form');

    declare('form.VisualJOSN.ClassObject', _.form.VisualJOSN.Object, {
        Element: null,
        model: null,
        textarea: null,
        _init: function(elem, $class, textarea) {
            this._parent._init.call(this, elem, textarea);
            if (_.util.bool.isStr($class) && /\w+/.test($class)) {
                if (models[$class]) {
                    this.model = models[$class];
                } else {
                    return _.error('class [' + classname + '] not declared.');
                }
            } else if (_.util.bool.isObj($class)) {
                this.model = declareModel($class);
            } else {
                return _.error('params error');
            }
        },
        loadJSON: function(string) {
            var inputs = [],
                obj = JSON.parse(string) || {};

            _.each(obj, function(prop, value) {
                inputs.push('<input data-prop-name="' + prop + '" value="' + value + '" />');
            });
            this.Element.innerHTML = inputs.join('');
        },
        getJSON: function(string) {
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

    _.extend(_.form.VisualJOSN.ClassObject, true, {
        declare: function(classname, options) {
            if (_.util.bool.isStr(classname) && /\w+/.test(classname) && _.util.bool.isObj(options)) {
                var _i = 0,
                    _classname = classname;
                while (models[classname]) {
                    _i++;
                    classname = _classname + '_' + _i;
                }
                models[classname] = declareModel(options);
                return classname;
            }
            return _.error('params error');
        }
    });
});