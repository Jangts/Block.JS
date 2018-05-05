/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Sat, 05 May 2018 02:42:14 GMT
 */
;
// tangram.config({});
tangram.block([], function (pandora, root, imports, undefined) {
	var _arguments = arguments;
	var _this = this;
	root.console.log('Hello, world!');
	var main = 0;
	var part1 = 1;
	var variable = ['foo', 'bar'];
	pandora.each(variable, function (index, item) {
		console.log(index, item);
	}, this);
	var fn1 = function () {}
	var fn12 = function (x) {
		return x * x;
	};
	console.log(fn12);
	console.log(fn12);
	console.log(fn12);
	console.log(fn12);
	console.log(fn12);
	console.log(fn12);
	console.log(fn12);
	var class1 = pandora.declareClass({
		___override_method_action_0: function () {},
		___override_method_action_1: function (arg1) {},
		___override_method_action_2: function (arg1, arg2) {},
		___override_method_action_3: function (arg1, arg2, arg3) {},
		action: function(){
			if (arguments.length === 0) { return this.___override_method_action_0.apply(this, arguments);}
			if (arguments.length === 1) { return this.___override_method_action_1.apply(this, arguments);}
			if (arguments.length === 2) { return this.___override_method_action_2.apply(this, arguments);}
			if (arguments.length === 3) { return this.___override_method_action_3.apply(this, arguments);}
			return this.___override_method_action_3.apply(this, arguments);
		}
	})
	console.log(fn12(3));
	var fn0 = function (arg1) {
		var more = Array.prototype.slice.call(arguments, 1);
		console.log(arg1, more)
		console.log(arg1, more)
		console.log(arg1, more)
		console.log(arg1, more);
	}
	var part2 = 2;
	console.log(part1 + part2);
	var class0 = pandora.declareClass({
		_init: function (elem) {
			this.elem = elem;
			this._private.name = 'main';
		},
		_setters: {
			name: function () {
				this._private.name = name;
			}},
		_getters: {
			name: function (name) {
				return this._private.name;
			}}
	})
	fn0(1, 2, 3, 4, 5, 6);
}, true);
//# sourceMappingURL=script.js.map