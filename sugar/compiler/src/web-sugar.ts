/*!
 * tangram.js framework syntactic sugar
 * Web Entrance
 *
 * Written and Designed By Jang Ts
 * http://tangram.js.cn
 */
;
this.tangram.auto(['$_/../sugar/compiler/lib/sugar'], function () {
    let sugars = [], scripts = document.getElementsByTagName('script');
    for (let index = 0; index < scripts.length; index++) {
        const script = scripts[index];
        if (script.type === "text/tangram.js-sugar") {
            // console.log(script.innerHTML);
            sugars.push(tangram_js_sugar(script.innerHTML).compile());
        }
    }
    for (let index = 0; index < sugars.length; index++) {
        const sugar = sugars[index];
        // console.log(sugar.ast, sugar.replacements);
        console.log(sugar.output);
        sugar.run();
    }
});
