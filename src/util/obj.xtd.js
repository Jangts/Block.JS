/*!
 * Block.JS Framework Source Code
 *
 * static util.obj
 *
 * Date 2017-04-06
 */
;
block(function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var deepMerge = function(obj1, obj2) {
        if (obj1 && obj2) {
            _.each(obj2, function(key, val) {
                if ((typeof obj1[key] === 'object') && (typeof val === 'object') && !(obj1[key] instanceof Array) && !(val instanceof Array)) {
                    obj1[key] = deepMerge(obj1[key], val)
                } else {
                    obj1[key] = val;
                }
            });
        } else {
            obj1 = obj2;
        }
        return obj1;
    };

    _('util.obj', {
        hasProp: function(property, obj) {
            return obj && obj.hasOwnProperty && obj.hasOwnProperty(property);
        },
        merge: function() {
            if (arguments.length > 0) {
                var object = {};
                for (var a = 0; a < arguments.length; a++) {
                    if (typeof arguments[a] == 'object') {
                        _.each(arguments[a], function(index, elememt) {
                            object[index] = elememt;
                        });
                    }
                }
            } else {
                var object = {};
            }
            return object;
        },
        deepMerge: function(obj1, obj2) {
            var object = {};
            if ((typeof obj1 === 'object') && (typeof obj2 === 'object') && !(obj1 instanceof Array) && !(obj2 instanceof Array)) {
                if (obj1 && obj2) {
                    object = _.copy(obj1);
                    _.each(obj2, function(key, val) {
                        if ((typeof object[key] === 'object') && (typeof val === 'object') && !(object[key] instanceof Array) && !(val instanceof Array)) {
                            object[key] = deepMerge(object[key], val)
                        } else {
                            object[key] = val;
                        }
                    });
                } else if (obj1) {
                    object = _.copy(obj1);
                } else if (obj2) {
                    object = _.copy(obj2);
                } else {
                    object = {};
                }
                return object;
            } else {
                _.error('Parameters must be two objects.');
            }
        },
        type: function(object, isDetail) {
            if (isDetail) {
                return _.util.type(object);
            } else {
                return typeof object;
            }
        },
        length: function(object, ownpropsonly) {
            var num = 0;
            for (var k in object) {
                if (ownpropsonly) {
                    if (object.hasOwnProperty(k)) {
                        num++;
                    }
                } else {
                    num++;
                }
            }
            return num;
        },
        clone: _.clone,
        has: function(object, elem) {
            for (var k in object) {
                if (object[k] == elem) return k;
            }
            return false;
        },
        toArray: function(obj) {
            var result = [];
            _.each(obj, function(index, elem) {
                result.push(elem);
            });
            return result
        },
        toString: function(obj) {
            return obj == null ? '' : typeof obj === 'object' ? JSON.stringify(obj, null, 2) : String(obj);
        },
        toQueryString: function(obj) {
            obj = obj || {};
            var fields = []
            for (var i in obj) {
                fields.push(i + "=" + obj[i]);
            }
            return fields.join("&");
        },
        valuesArray: this.toArray,
        keysArray: function(object) {
            var array = [];
            _.each(object, function(key) {
                array.push(key);
            });
            return array;
        }
    });
});