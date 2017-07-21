/*!
 * Block.JS Framework Source Code
 *
 * static util.arr
 *
 * Date 2017-04-06
 */
;
block(['$_/util/type.xtd'], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    _('util.arr', {
        merge: function() {
            if (arguments.length > 0) {
                var array = [];
                for (var a = 0; a < arguments.length; a++) {
                    if (typeof arguments[a] == 'object' && arguments[a] instanceof Array) {
                        _.each(arguments[a], function(index, elememt) {
                            if (array.indexOf(elememt) < 0) {
                                array.push(elememt);
                            }
                        });
                    }
                }
            } else {
                var array = [];
            }
            return array;
        },
        beObject: function(array1, array2) {
            var object = {};
            if (array2) {
                for (var i = 0; i < array1.length; i++) {
                    object[array1[i]] = array2[i] || null;
                }
            } else {
                for (var i = 0; i < array1.length; i++) {
                    object[i] = array1[i];
                }
            }
            return object;
        },
        each: function(array, handler) {
            if (_.util.type.isArray(array)) {
                for (var i = 0; i < array.length; i++) {
                    handler.call(array[i], i, array[i]);
                }
            }
        },
        eachReverse: function(array, handler) {
            if (_.util.type.isArray(array)) {
                for (var i = array.length - 1; i > -1; i--) {
                    handler.call(array[i], i, array[i]);
                }
            }
        },
        has: function(array, elem) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === elem) {
                    return i;
                };
            };
            return false;
        },
        push: function(elem, array, index) {
            index = parseInt(index);
            if (index >= 0 && index < array.length) {
                var _array = array;
                array.length = index;

            } else {
                var _array = [];

            }
            array.push(elem);
            for (var i = index + 1; i < _array.length; i++) {
                array.push(_array[i]);
            }
            return array;
        },
        remove: function(array, elem) {
            var result = [];
            for (var i = 0; i < array.length; i++) {
                array[i] == elem || result.push(array[i]);
            }
            return result;
        },
        removeByIndex: function(array, index) {
            var result = [];
            for (var i = 0; i < array.length; i++) {
                i == index || result.push(array[i]);
            }
            return result;
        },
        index: function(array, elem) {
            if (Array.prototype.indexOf) {
                return array.indexOf(elem);
            } else {
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === elem) return i;
                }
                return -1;
            }
        },
        search: function(elem, array) {
            return _.util.arr.index(array, elem);
        },
        where: function(array, filter) {
            var filtered = [];
            _.each(array, function(index, elem) {
                if (filter(elem)) {
                    filtered.push(elem);
                }
            });
            return filtered;
        },
        unique: function(array) {
            var result = [];
            _.each(array, function(i, elem) {
                if (_.util.arr.has(result, elem) === false) {
                    result.push(elem);
                };
            });
            return result;
        },
        sum: function(array) {
            return eval(array.join('+'));
        },
        max: function(array) {
            return Math.max.apply(Math, array);
        },
        min: function(array) {
            return Math.min.apply(Math, array);
        },
        indexOfMax: function(array) {
            return _.util.arr.index(array, Math.max.apply(Math, array));
        },
        indexOfMin: function(array) {
            return _.util.arr.index(array, Math.min.apply(Math, array));
        },
        slice: _.slice
    });
});