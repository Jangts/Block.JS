;
(function(root, factory) {
    if (typeof exports === 'object') {
        // CommonJS
        // console.log('foo');
        let imports = []
        factory(root.pandora, root, imports, exports);
        if (typeof module === 'object') {
            module.exports = exports;
        }
    } else {
        // tangram.js
        // console.log('bar');
        root.tangram.init().block([], function (pandora, root, imports, undefined) {
            factory.call(this, pandora, root, imports, this.module.exports);
        });
    }
}(typeof window === 'undefined' ? global : window, function (pandora, root, imports, exports) {
    exports.foo = 'bar';
    console.log(imports, exports);
}));