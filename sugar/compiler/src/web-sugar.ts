/*!
 * tangram.js framework syntactic sugar
 * Web Entrance
 *
 * Written and Designed By Jang Ts
 * http://tangram.js.cn
 */
;
this.tangram.auto([
    '$_/async/',
    '$_/../sugar/compiler/lib/sugar'
], function (_) {
    var sugars = [], scripts = document.getElementsByTagName('script');
    for (var index = 0; index < scripts.length; index++) {
        var script = scripts[index];
        if (script.type === "text/tangram.js-sugar") {
            if (script.src) {
                // console.log(script.src);
                _.async.ajax(script.src, function (data) {
                    tangram_js_sugar(data).compile().run(function (content) {
                        console.log(this.ast);
                        console.log(this.mappings);
                        console.log(content);
                    }, function () {
                        // console.log(this.ast);
                        // console.log(this.replacements);
                    });
                });
                // ;
            } else {
                tangram_js_sugar(script.innerHTML).compile().run(function (content) {
                    console.log(content);
                }, function () {
                    console.log(this.ast);
                    // console.log(this.replacements);
                });
            }
        }
    }
});
