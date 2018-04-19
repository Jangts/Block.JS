/*!
 * tangram.js framework source code
 *
 * tangram.js for amd
 *
 * Date 2017-04-06
 */
;
let exports: any = (<any>this).exports;
let require: any = (<any>this).require;
let module: any = (<any>this).module;
let define: any = (<any>this).define;

if (typeof exports === 'object') {
    exports = require('@jangts/tangram.js').block;
    if (typeof module === 'object') {
        module.exports = exports;
    }
} else if (typeof define === 'function' && define.amd) {
    // AMD
    define('block', ['tangram'], function(tangram) {
        return tangram.block;
    });
}