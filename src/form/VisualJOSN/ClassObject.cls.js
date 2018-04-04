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
        doc = global.document,
        console = global.console;

    var types = {
            color: 'string',
            date: 'fulldate',
            datetime: 'datetime',
            dayofweek: 'int not null',
            email: 'string',
            hourminute: 'hourminute',
            month: 'month',
            number: 'int not null',
            password: 'string',
            range: 'int not null',
            tel: 'string',
            text: 'string',
            time: 'timeofday',
            url: 'string'
        },
        classes = [],
        models = {},
        declareModel = function(options, name) {
            var fields = [],
                props = {};
            _.each(options, function(i, option) {
                if (_.util.bool.isArr(option) && option.length > 0) {
                    if (option.length > 1) {
                        if (option.length > 2) {
                            if (_.util.bool.isNumeric(option[2])) {
                                var length = parseInt(option[2]) || 0;
                                if (option.length > 3) {
                                    if (_.util.bool.isArr(option[3])) {
                                        if (option[3].length > 0) {
                                            var defaultValue = option[3][0],
                                                range = option[3];
                                        } else {
                                            var defaultValue = '',
                                                range = null,
                                                select = null;
                                        }
                                    } else {
                                        if (option.length > 4 && _.util.bool.isArr(option[4]) && option[4].length > 0) {
                                            if (_.util.arr.has(option[4], option[3])) {
                                                var defaultValue = option[3],
                                                    range = option[4];
                                            } else {
                                                var defaultValue = option[4][0],
                                                    range = option[4];
                                            }
                                            if (option.length > 5 && _.util.bool.isArr(option[5]) && option[5].length >= option[4].length) {
                                                var select = option[5];
                                            } else {
                                                var select = range;
                                            }
                                        } else {
                                            var defaultValue = option[3],
                                                range = null,
                                                select = null;
                                        }
                                    }
                                } else {
                                    var defaultValue = '',
                                        range = null,
                                        select = null;
                                }
                            } else if (_.util.bool.isArr(option[2])) {
                                var length = 0;
                                if (option[2].length > 0) {
                                    var defaultValue = option[2][0],
                                        range = option[2];
                                    if (option.length > 3 && _.util.bool.isArr(option[3]) && option[3].length >= option[2].length) {
                                        var select = option[3];
                                    } else {
                                        var select = range;
                                    }
                                } else {
                                    var defaultValue = '',
                                        range = null,
                                        select = null;
                                }
                            } else {
                                var length = 0;
                                if (option.length > 3 && _.util.bool.isArr(option[3]) && option[3].length > 0) {
                                    if (_.util.arr.has(option[3], option[2])) {
                                        var defaultValue = option[2],
                                            range = option[3];
                                    } else {
                                        var defaultValue = option[3][0],
                                            range = option[3];
                                    }
                                    if (option.length > 4 && _.util.bool.isArr(option[4]) && option[4].length >= option[3].length) {
                                        var select = option[4];
                                    } else {
                                        var select = range;
                                    }
                                } else {
                                    var defaultValue = option[2],
                                        range = null,
                                        select = null;
                                }
                            }
                        } else {
                            var length = 0,
                                defaultValue = '',
                                range = null,
                                select = null;
                        }
                    } else {
                        var length = 0,
                            defaultValue = '',
                            range = null,
                            select = null;
                    }
                    props[option[0]] = {
                        type: types[option[1]] || 'string',
                        length: length,
                        default: defaultValue,
                        range: range
                    };
                    if (range) {
                        fields.push({
                            name: option[0],
                            type: 'select',
                            options: [range, select]
                        });
                    } else {
                        fields.push({
                            name: option[0],
                            type: option[1] || 'text',
                            maxLength: length
                        });
                    }
                }
            });
            return {
                fields: fields,
                constraint: new _.data.Model(props, name)
            };
        };

    //Define NameSpace 'form'
    _('form');

    declare('form.VisualJOSN.ClassObject', _.form.VisualJOSN.Object, {
        Element: null,
        model: null,
        textarea: null,
        _init: function(elem, $model, textarea) {
            if (_.util.bool.isStr($model) && /\w+/.test($model)) {
                if (models[$model]) {
                    this.model = models[$model];
                } else {
                    return _.error('class [' + classname + '] not declared.');
                }
            } else if (_.util.bool.isArr($model)) {
                this.model = declareModel($model);
            } else {
                return _.error('params error');
            }
            this.$ID = this.model.constraint.create({});
            this._parent._init.call(this, elem, textarea);
        },
        loadJSON: function(string) {
            var obj = JSON.parse(string) || {};
            return this.input(obj);
        },
        input: function(data) {
            var prop,
                value,
                inputs = [],
                fields = this.model.fields,
                data = this.model.constraint.update(this.$ID, data);
            _.each(fields, function(i, field) {
                prop = field.name;
                value = data[prop];
                switch (field.type) {
                    case 'select':
                        inputs.push('<select data-prop-name="' + prop + '">');
                        _.each(field.options[0], function(i, option) {
                            if (option == value) {
                                inputs.push('<option value="' + option + '" selected>' + field.options[1][i] + '</option>');
                            } else {
                                inputs.push('<option value="' + option + '">' + field.options[1][i] + '</option>');
                            }

                        });
                        inputs.push('</select>');
                        break;

                    case 'date':
                    case 'datetime':
                    case 'dayofweek':
                    case 'hourminute':
                    case 'time':
                        inputs.push('<input class="use-tp" data-tp-type="' + types[field.type] + '" data-prop-name="' + prop + '" type="' + field.type + '" value="' + value + '" />');
                        break;

                    default:
                        inputs.push('<input data-prop-name="' + prop + '" type="' + field.type + '" value="' + value + '" />');
                }
            });
            console.log(data, inputs);
            this.Element.innerHTML = inputs.join('');
            return this;
        },
        getJSON: function() {
            var json = JSON.stringify(this.output());
            if (this.textarea) {
                this.textarea.setText(json);
            }
            return json;
        },
        output: function() {
            var prop, data = {};
            _.each(_.query('[data-prop-name]', this.Element), function() {
                prop = _.dom.getAttr(this, 'data-prop-name');
                data[prop] = this.value;
            });
            return this.model.constraint.update(this.$ID, data);
        }
    });

    _.extend(_.form.VisualJOSN.ClassObject, true, {
        declare: function(classname, options) {
            if (_.util.bool.isStr(classname) && /\w+/.test(classname) && _.util.bool.isArr(options)) {
                var _i = 0,
                    _classname = classname;
                while (models[classname]) {
                    _i++;
                    classname = _classname + '_' + _i;
                }
                models[classname] = declareModel(options, classname);
                return classname;
            }
            return _.error('params error');
        }
    });
});