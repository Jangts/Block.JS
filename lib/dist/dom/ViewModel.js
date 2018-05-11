/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Fri, 11 May 2018 08:35:11 GMT
 */
;
// tangram.config({});
tangram.init().block([
	'$_/util/bool',
	'$_/obj/Observer/',
	'$_/obj/Observer/Listener'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var dom = pandora.ns('dom', {});
	var _ = pandora;
	var doc = root.document;
	var vdoms = {};
	var isFn = _.util.bool.isFn;
	var diff = void 0;
	var patch = void 0;
	var observe = _.obj.observe;
	var updateByCustomRenderer = function () {
		isFn(this.options.beforeRender) && this.options.beforeRender.call(this.options);
		this.options.render.call(this.options);
		isFn(this.options.afterRender) && this.options.afterRender.call(this.options);
	}
	var updateByVElement = function () {
		var tree = this.options.render.call(this);
		if (vdoms[this.id]) {
			patches = diff(vdoms[this.id].tree, tree);
			patch(vdoms[this.id].dom, patches);
			vdoms[this.id].tree = tree;
		}
		else {
			var dom = tree.render();
			vdoms[this.id] = {
				tree: tree,
				dom: dom
			};
			_.dom.events.add(dom, 'change', 'input, select, textarea', this, function (e) {
				e.data.input = this.value;
			});
			doc.body.appendChild(dom);
		};
	}
	var proxy = function (key) {
		var that = this;
		Object.defineProperty(this, key, {
			configurable: true,
			enumerable: true
		});
	}
	pandora.declareClass('dom.ViewModel', {
		_init: function (options, useVElement) {
			var _arguments = arguments;
			options = options || {}
			var that = this;
			this.id = new _.Identifier().toString();
			this.options = options;
			this.data = options.data;
			if (useVElement || (useVElement !== false && options.useVElement)) {
				diff = _.dom.VElement.diff;
				patch = _.dom.VElement.patch;
				var update = updateByVElement;
			}
			else {
				var update = updateByCustomRenderer;
			}
			this.observer = observe(options.data).listen(function (key) {
				console.log(key);
				update.call(that);
			});
			pandora.each(options.data, function (key) {
				proxy.call(this, key);
			}, this);
			update.call(this);
		}
	});
	module.exports = pandora.dom.ViewModel;
});
//# sourceMappingURL=ViewModel.js.map