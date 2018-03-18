/*!
 * tangram.js framework source code
 *
 * class data.Component
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
        document = global.document,
        console = global.console,
        location = global.location;

    var models = {},
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
        formatter = {
            'any': function() {
                return {
                    base: 'any',
                    type: 'any',
                    length: 0,
                    default: attributes.default || '',
                    range: attributes.range || null
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
            'number not null': notNullFormatter
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
        checkNumber = function(property, value) {
            switch (property.type) {
                case 'int not null':
                    if (!value && value != 0) {
                        return false;
                    }
                case 'int':
                    return _.util.type.isInt(value) && checkLength(property.length, value) && checkRange(property.range, value);

                case 'number not null':
                    if (!value && value != 0) {
                        return false;
                    }
                default:
                    return _.util.bool.isNumeric(value) && checkLength(property.length, value) && checkRange(property.range, value);
            }
        },
        checkBoolean = function(value) {
            return _.util.bool.isBool(value);
        },
        checkAny = function(property, value) {
            if (property.type === 'any') {
                return checkRange(property.range, value);
            }

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
        _init: function(props) {
            var props = modelsConstrutor(props);

            this.uid = uidMaker(props);

            models[this.uid] = props;

            console.log(this.uid, props, models);
        },
        check: function(prop, value) {

        },
        create: function($data) {

        },
        read: function($ID) {

        },
        updata: function($ID, $data) {

        }
    });
});