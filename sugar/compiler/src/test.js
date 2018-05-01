;
(function(root, factory) {
    if (typeof exports === 'object') {
        // CMD
        let imports = [
            require('othermudule')
        ]
        factory(imports, exports);
        if (typeof module === 'object') {
            module.exports = exports;
        }
    } else if (typeof root.tangram === 'function' && root.tangram.blcok) {
        // TNS
        tangram.block([
            'othermudule'
        ], function(pandora, root, imports, undefined) {
            return factory.apply(this, imports, tangram.initExports());
        });
    } else {
        root.tangram_js_sugar = factory(root);
    }
}(this, function(imports, exports) {

}));