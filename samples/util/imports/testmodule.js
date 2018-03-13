(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define('mymodule', [], factory);
    else if (typeof block === 'function' && typeof tangram.module === 'object')
        tangram.module.declare(factory);
    else if (typeof exports === 'object')
        exports["mymodule"] = factory();
    else
        root["mymodule"] = factory();
})(this, function(require, exports, module) {
    module.exports = '<div style="margin: 100px auto 0; text-align: center; font-size:72px;">A Text Module</div>'
});