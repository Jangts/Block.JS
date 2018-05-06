/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Sun, 06 May 2018 09:07:04 GMT
 */
;
// tangram.config({});
tangram.init().block([
	'$_/util/bool',
	'$_/obj/',
	'$_/str/hash'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var _ = pandora;
	var doc = root.document;
	var console = root.console;
	var location = root.location;
	var alias = {};
	var models = {};
	var modeldata = {};
	var normalFormatter = function (attributes) {
		return {
			base: attributes.type,
			type: attributes.type,
			length: attributes.length || 0,
			default: attributes.default || '',
			range: attributes.range || null
		};
	}
	var notNullFormatter = function (attributes) {
		return {
			base: attributes.type.split(' ')[0],
			type: attributes.type,
			length: attributes.length || 0,
			default: attributes.default || null,
			range: attributes.range || null
		};
	}
	var timeFormatter = function (attributes) {
		return {
			base: 'time',
			type: attributes.type,
			default: attributes.default || null
		};
	}
	var formatter = {
		'any': function () {
			return {
				base: 'any',
				type: 'any',
				default: attributes.default || ''
			};
		},
		'scala': function () {
			return {
				base: 'any',
				type: 'scala',
				length: attributes.length || 0,
				default: attributes.default || '',
				range: attributes.range || null
			};
		},
		'string': function (attributes) {
			return {
				base: 'string',
				type: 'string',
				length: attributes.length || 0,
				default: attributes.default || '',
				range: attributes.range || null
			};
		},
		'bool': function (attributes) {
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
	};
	var modelsConstrutor = function (input) {
		var _arguments = arguments;
		var keys = _.obj.keysArray(input).sort();
		var props = {};
		pandora.each(input, function (prop, attributes) {
			if (attributes.type && formatter[attributes.type]) {
				input[prop] = formatter[attributes.type](attributes);
			}
			else {
				input[prop] = formatter['scala'](attributes);
			};
		}, this);
		pandora.each(keys, function (i, prop) {
			props[prop] = input[prop];
		}, this);
		return props;
	}
	var uidMaker = function (props) {
		var josn = JSON.stringify(props);
		return _.str.hash.md5(josn);
	}
	var check = function (property, value) {
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
	}
	var checkString = function (property, value) {
		if (value || property.type === 'string') {
			return _.util.bool.isStr(value) && checkLength(property.length, value) && checkRange(property.range, value);
		}
		return false;
	}
	var checkTime = function (property, value) {
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
	}
	var checkNumber = function (property, value) {
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
		};
	}
	var checkBoolean = function (value) {
		return _.util.bool.isBool(value);
	}
	var checkAny = function (property, value) {
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
	}
	var checkLength = function (length, value) {
		if (length) {
			return value.length <= length;
		}
		return true;
	}
	var checkRange = function (range, value) {
		if (range && range.length) {
			return _.util.bool.inArr(value, range, true);
		}
		return true;
	}
	pandora.declareClass('data.Model', {
		_init: function (props, name) {
			var props = modelsConstrutor(props);
			this.uid = uidMaker(props);
			if (name) {
				alias[this.uid] = name;
			}
			else {
				alias[this.uid] = this.uid;
			}
			models[this.uid] = props;
			modeldata[this.uid] = [];
		},
		check: function (prop, value) {
			if (property = models[this.uid][prop]) {
				return check(property, value);
			}
			return false;
		},
		create: function (data) {
			var _arguments = arguments;
			var newdata = {};
			pandora.each(models[this.uid], function (prop, property) {
				if (_.obj.hasProp(data, prop) && check(property, data[prop])) {
					newdata[prop] = data[prop];
				}
				else if (property.default !== undefined) {
					newdata[prop] = property.default;
				}
				else {
					_.error('Must input a correct [' + prop + '] for model [' + alias[this.uid] + ']');
				};
			}, this);
			modeldata[this.uid].push(newdata);
			return modeldata[this.uid].length;
		},
		read: function ($ID) {
			var _arguments = arguments;
			if ($ID) {
				return _.clone(modeldata[this.uid][$ID - 1]);
			}
			var list = {};
			pandora.each(modeldata[this.uid], function (i, data) {
				if (data) {
					list[i + 1] = _.clone(data);
				};
			}, this);
			return list;
		},
		update: function ($ID, prop, value) {
			var _arguments = arguments;
			if (_.util.bool.isObj(prop)) {
				var props = models[this.uid];
				var data = modeldata[this.uid][$ID - 1];
				pandora.each(prop, function (p, v) {
					if (_.obj.hasProp(data, p) && check(props[p], v)) {
						data[p] = v;
					};
				}, this);
			}
			else if (_.util.bool.isStr(prop)) {
				var obj = {};
				obj[prop] = value;
				this.update($ID, obj);
			};
			return this.read($ID);
		},
		delete: function ($ID) {
			modeldata[this.uid][$ID - 1] = undefined;
			return true;
		},
		render: function (context) {
			var that = this;
			_.ab([
				'$_/see/see.css',
				'$_/dom/'
			], function () {
				var _arguments = arguments;
				var list = that.read();
				var table = '<table class="table">';
				table += '<tr class="head-row"><th></th>';
				pandora.each(models[that.uid], function (prop) {
					table += '<th>' + prop.toUpperCase() + '</th>';
				}, this);
				table += '</tr>';
				pandora.each(list, function ($ID, data) {
					table += '<tr><td>' + $ID + '</td>';
					pandora.each(data, function (_index, value) {
						if (_.util.bool.isScala(value)) {
							table += '<td>' + value + '</td>';
						}
						else {
							table += '<td>-</td>';
						};
					}, this);
					table += '</tr>';
				}, this);
				table += '</table>';
				if (context) {
					_.dom.addClass(context, 'tangram-see');
					_.dom.append(context, table);
				}
				else {
					_.dom.append(doc.body, table);
				};
			});
		}
	});
	this.module.exports = _.data.Model;
});
//# sourceMappingURL=Model.js.map