/*!
 * tangram.js framework syntactic sugar
 * Web Entrance
 *
 * Written and Designed By Jang Ts
 * http://tangram.js.cn
 */
;
this.tangram.auto(['$_/../sugar/compiler/lib/sugar'], function () {
    var sugars = [], scripts = document.getElementsByTagName('script');
    for (var index_1 = 0; index_1 < scripts.length; index_1++) {
        var script = scripts[index_1];
        if (script.type === "text/tangram.js-sugar") {
            // console.log(script.innerHTML);
            sugars.push(tangram_js_sugar(script.innerHTML).compile());
        }
    }
    for (var index_2 = 0; index_2 < sugars.length; index_2++) {
        var sugar = sugars[index_2];
        // console.log(sugar.ast, sugar.replacements);
        console.log(sugar.output);
        sugar.run();
    }
});
//# sourceMappingURL=web-sugar.js.map