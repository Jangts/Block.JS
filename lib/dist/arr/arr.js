/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Fri, 11 May 2018 08:35:08 GMT
 */
;
// tangram.config({});
tangram.init().block([
	'$_/util/type'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var _ = pandora;
	pandora.ns('arr', {
		merge: function () {
			var _arguments = arguments;
			if (arguments.length > 0) {
				var array = [];
				for (var a = 0;a < arguments.length;a++) {
					if (typeof arguments[a] == 'object' && arguments[a] instanceof Array) {
						pandora.each(arguments[a], function (index, elememt) {
							if (array.indexOf(elememt) < 0) {
								array.push(elememt);
							};
						}, this);
					}
				}
			}
			else {
				var array = [];
			}
			return array;
		},
		beObject: function (array1, array2) {
			var object = {};
			if (array2) {
				for (var i = 0;i < array1.length;i++) {
					object[array1[i]] = array2[i] || null;
				}
			}
			else {
				for (var i = 0;i < array1.length;i++) {
					object[i] = array1[i];
				}
			}
			return object;
		},
		each: function (array, handler) {
			if (_.util.type.isArray(array)) {
				for (var i = 0;i < array.length;i++) {
					handler.call(array[i], i, array[i]);
				}
			};
		},
		eachReverse: function (array, handler) {
			if (_.util.type.isArray(array)) {
				for (var i = array.length - 1;i >  -1;i--) {
					handler.call(array[i], i, array[i]);
				}
			};
		},
		has: function (array, elem) {
			for (var i = 0;i < array.length;i++) {
				if (array[i] === elem) {
					return i;
				}
			}
			return false;
		},
		push: function (elem, array, index) {
			index = parseInt(index);
			if (index >= 0 && index < array.length) {
				var _array = array;
				array.length = index;
			}
			else {
				var _array = [];
			}
			array.push(elem);
			for (var i = index + 1;i < _array.length;i++) {
				array.push(_array[i]);
			}
			return array;
		},
		remove: function (array, elem) {
			var result = [];
			for (var i = 0;i < array.length;i++) {
				array[i] == elem || result.push(array[i]);
			}
			return result;
		},
		removeByIndex: function (array, index) {
			var result = [];
			for (var i = 0;i < array.length;i++) {
				i == index || result.push(array[i]);
			}
			return result;
		},
		index: function (array, elem) {
			if (Array.prototype.indexOf) {
				return array.indexOf(elem);
			}
			else {
				for (var i = 0;i < array.length;i++) {
					if(array[i] === elem)return i;
				}
				return  -1;
			};
		},
		search: function (elem, array) {
			return _.arr.index(array, elem);
		},
		where: function (array, filter) {
			var _arguments = arguments;
			var filtered = [];
			pandora.each(array, function (index, elem) {
				if (filter(elem)) {
					filtered.push(elem);
				};
			}, this);
			return filtered;
		},
		unique: function (array) {
			var _arguments = arguments;
			var result = [];
			pandora.each(array, function (i, elem) {
				if (_.arr.has(result, elem) === false) {
					result.push(elem);
				};
			}, this);
			return result;
		},
		sum: function (array) {
			return eval(array.join('+'));
		},
		max: function (array) {
			return Math.max.apply(Math, array);
		},
		min: function (array) {
			return Math.min.apply(Math, array);
		},
		indexOfMax: function (array) {
			return _.arr.index(array, Math.max.apply(Math, array));
		},
		indexOfMin: function (array) {
			return _.arr.index(array, Math.min.apply(Math, array));
		},
		slice: _.slice
	});
	this.module.exports = _.arr;
});
//# sourceMappingURL=arr.js.map