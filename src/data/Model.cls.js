/*!
 * tangram.js framework source code
 *
 * class data.Model
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/util/bool.xtd',
    '$_/util/obj.xtd',
    '$_/data/hash.xtd'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console,
        location = global.location;

    var alias = {},
        models = {},
        modeldata = {},
        normalFormatter = function(attributes) {
            return {
                base: attributes.type,
                type: attributes.type,
                length: attributes.length || 0,
                default: attributes.default || '',
                range: attributes.range || null
            };
        },
        notNullFormatter = function(attributes) {
            return {
                base: attributes.type.split(' ')[0],
                type: attributes.type,
                length: attributes.length || 0,
                default: attributes.default || null,
                range: attributes.range || null
            };
        },
        timeFormatter = function(attributes) {
            return {
                base: 'time',
                type: attributes.type,
                default: attributes.default || null
            };
        },
        formatter = {
            'any': function() {
                return {
                    base: 'any',
                    type: 'any',
                    default: attributes.default || ''
                }
            },
            'scala': function() {
                return {
                    base: 'any',
                    type: 'scala',
                    length: attributes.length || 0,
                    default: attributes.default || '',
                    range: attributes.range || null
                }
            },
            'string': function(attributes) {
                return {
                    base: 'string',
                    type: 'string',
                    length: attributes.length || 0,
                    default: attributes.default || '',
                    range: attributes.range || null
                };
            },
            'bool': function(attributes) {
                return {
                    base: 'bool',
                    default: !!attributes.default
                };
            },
            'string not null': notNullFormatter,
            'int': normalFormatter,
            'int not null': notNullFormatter,
            'number': normalFormatter,
            'number not null': notNullFormatter,
            'fulldate': timeFormatter,
            'dayofyear': timeFormatter,
            'month': timeFormatter,
            'timeofday': timeFormatter,
            'hourminute': timeFormatter,
            'datetime': timeFormatter
        },
        modelsConstrutor = function(input) {
            var keys = _.util.obj.keysArray(input).sort(),
                props = {};
            _.each(input, function(prop, attributes) {
                if (attributes.type && formatter[attributes.type]) {
                    input[prop] = formatter[attributes.type](attributes);
                } else {
                    input[prop] = formatter['scala'](attributes);
                }
            });
            _.each(keys, function(i, prop) {
                props[prop] = input[prop];
            });
            return props;
        },
        uidMaker = function(props) {
            var josn = JSON.stringify(props);
            return _.data.hash.md5(josn);
        },
        check = function(property, value) {
            switch (property.base) {
                case 'string':
                    return checkString(property, value);

                case 'time':
                    return checkTime(property, value);

                case 'int':
                case 'number':
                    return checkNumber(property, value);

                case 'bool':
                    return checkBoolean(value);

                case 'any':
                    return checkAny(property, value);
            }
            return false;
        },
        checkString = function(property, value) {
            if (value || property.type === 'string') {
                return _.util.bool.isStr(value) && checkLength(property.length, value) && checkRange(property.range, value);
            }
            return false;
        },
        checkTime = function(property, value) {
            if (_.util.bool.isStr(value)) {
                switch (property.type) {
                    case 'fulldate':
                        return /^\s*\d{4}\-\d{1,2}\-\d{1,2}\s*$/.test(value);
                    case 'month':
                        return /^\s*\d{4}\-\d{1,2}\s*$/.test(value);
                    case 'dayofyear':
                        return /^\s*\d{1,2}\-\d{1,2}\s*$/.test(value);
                    case 'timeofday':
                        return /^\s*\d{1,2}\:\d{1,2}\:\d{1,2}\s*$/.test(value);
                    case 'hourminute':
                        return /^\s*\d{1,2}\:\d{1,2}\s*$/.test(value);
                    default:
                        return /^\s*\d{4}\-\d{1,2}\-\d{1,2}\s\d{1,2}\:\d{1,2}\:\d{1,2}\s*$/.test(value);
                }
            }
            return false;
        },
        checkNumber = function(property, value) {
            switch (property.type) {
                case 'int not null':
                    if (!value && value != 0) {
                        return false;
                    }
                case 'int':
                    return _.util.bool.isInt(value) && checkLength(property.length, value.toString()) && checkRange(property.range, value);

                case 'number not null':
                    if (!value && value != 0) {
                        return false;
                    }
                default:
                    return _.util.bool.isNumeric(value) && checkLength(property.length, value.toString()) && checkRange(property.range, value);
            }
        },
        checkBoolean = function(value) {
            return _.util.bool.isBool(value);
        },
        checkAny = function(property, value) {
            if (property.type === 'any') {
                return true;
            }
            switch (typeof value) {
                case 'string':
                    return checkLength(property.length, value) && checkRange(property.range, value);

                case 'number':
                    return checkLength(property.length, value.toString()) && checkRange(property.range, value);

                case 'boolean':
                    if (value) {
                        return checkLength(property.length, 'true') && checkRange(property.range, value);
                    }
                    return checkLength(property.length, 'false') && checkRange(property.range, value);
            }
            return false;
        },
        checkLength = function(length, value) {
            if (length) {
                return value.length <= length;
            }
            return true;
        },
        checkRange = function(range, value) {
            if (range && range.length) {
                return _.util.bool.inArr(value, range, true);
            }
            return true;
        };

    declare('data.Model', {
        _init: function(props, name) {
            var props = modelsConstrutor(props);

            this.uid = uidMaker(props);

            if (name) {
                alias[this.uid] = name;
            } else {
                alias[this.uid] = this.uid;
            }
            models[this.uid] = props;
            modeldata[this.uid] = [];

            // console.log(this.uid, props, models);
        },
        check: function(prop, value) {
            if (property = models[this.uid][prop]) {
                return check(property, value);
            }
            return false;
        },
        create: function(data) {
            var newdata = {};
            _.each(models[this.uid], function(prop, property) {
                // console.log(data, prop, _.util.obj.hasProp(data, prop));
                if (_.util.obj.hasProp(data, prop) && check(property, data[prop])) {
                    newdata[prop] = data[prop];
                } else if (property.default !== undefined) {
                    newdata[prop] = property.default;
                } else {
                    _.error('Must input a correct [' + prop + '] for model [' + alias[this.uid] + ']');
                }
            }, this);
            modeldata[this.uid].push(newdata);
            return modeldata[this.uid].length;
        },
        read: function($ID) {
            if ($ID) {
                return _.clone(modeldata[this.uid][$ID - 1]);
            }
            var list = {};
            _.each(modeldata[this.uid], function(i, data) {
                if (data) {
                    list[i + 1] = _.clone(data);
                }

            });
            return list;
        },
        update: function($ID, prop, value) {
            if (_.util.bool.isObj(prop)) {
                var props = models[this.uid],
                    data = modeldata[this.uid][$ID - 1];
                _.each(prop, function(p, v) {
                    if (_.util.obj.hasProp(data, p) && check(props[p], v)) {
                        data[p] = v;
                    }
                }, this);
            } else if (_.util.bool.isStr(prop)) {
                var obj = {};
                obj[prop] = value;
                this.update($ID, obj);
            }
            return this.read($ID);
        },
        delete: function($ID) {
            modeldata[this.uid][$ID - 1] = undefined;
            return true;
        },
        render: function(context) {
            var that = this;
            _.ab([
                '$_/see/see.css',
                '$_/dom/'
            ], function() {
                var list = that.read(),
                    table = '<table class="table">';
                table += '<tr class="head-row"><th></th>';
                _.each(models[that.uid], function(prop) {
                    table += '<th>' + prop.toUpperCase() + '</th>';
                });
                table += '</tr>';
                _.each(list, function($ID, data) {
                    table += '<tr><td>' + $ID + '</td>';
                    _.each(data, function(prop, value) {
                        if (_.util.bool.isScala(value)) {
                            table += '<td>' + value + '</td>';
                        } else {
                            table += '<td>-</td>';
                        }
                    });
                    table += '</tr>';
                });
                table += '</table>';
                if (context) {
                    _.dom.addClass(context, 'tangram-see');
                    _.dom.append(context, table);
                } else {
                    _.dom.append(doc.body, table);
                }
            });
        }
    });
});