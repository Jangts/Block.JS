;
(function(root, factory) {
    if (typeof exports === 'object') {
        // CommonJS
        // console.log('foo');
        let imports = {
            './common.require' : require('./common.require')
        }
        factory(root.pandora, root, imports, exports);
        if (typeof module === 'object') {
            module.exports = exports;
        }
    } else {
        // tangram.js
        // console.log('bar');
        root.tangram.init().block([
            './common.require'
        ], function (pandora, root, imports, undefined) {
            // console.log(this);
            factory.call(this, pandora, root, imports, tangram.exports);
        }, true);
    }
}(typeof window === 'undefined' ? global : window, function (pandora, root, imports, exports) {
    // console.log(root, typeof root, pandora);
    console.log(imports, exports);
}));