/*!
 * tangram.js framework source code
 *
 * class dom.Events
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/util/bool',
    '$_/obj/Observer/',
    '$_/obj/Observer/Listener'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document;

    var vdoms = {},
        isFn = _.util.bool.isFn,
        diff, patch,
        observe = _.obj.observe,
        updateByCustomRenderer = function() {
            isFn(this.options.beforeRender) && this.options.beforeRender.call(this.options);
            this.options.render.call(this.options);
            isFn(this.options.afterRender) && this.options.afterRender.call(this.options);
        },
        updateByVElement = function() {
            var tree = this.options.render.call(this);
            if (vdoms[this.id]) {
                patches = diff(vdoms[this.id].tree, tree);
                patch(vdoms[this.id].dom, patches);
                vdoms[this.id].tree = tree;
            } else {
                var dom = tree.render();
                vdoms[this.id] = {
                    tree: tree,
                    dom: dom
                };
                _.dom.events.add(dom, 'change', 'input, select, textarea', this, function(e) {
                    //e.data.observer.silently = true;
                    e.data.input = this.value;
                    //e.data.observer.silently = false;
                });
                doc.body.appendChild(dom);
            }
        },
        proxy = function(key) {
            var that = this;
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                get: function proxyGetter() {
                    return that.data[key];
                },
                set: function proxySetter(val) {
                    that.data[key] = val;
                }
            })
        };

    declare('dom.ViewModel', {
        _init: function(options, useVElement) {
            options = options || {};
            var that = this;
            this.id = new _.Identifier().toString();
            this.options = options;
            this.data = options.data;
            if (useVElement || (useVElement !== false && options.useVElement)) {
                diff = _.dom.VElement.diff;
                patch = _.dom.VElement.patch;
                var update = updateByVElement;
            } else {
                var update = updateByCustomRenderer;
            }
            this.observer = observe(options.data).listen(function(key) {
                console.log(key);
                update.call(that);
            });
            _.each(options.data, function(key) {
                proxy.call(this, key);
            }, this);
            update.call(this);
        }
    });
});