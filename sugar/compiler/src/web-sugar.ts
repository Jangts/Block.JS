/*!
 * tangram.js framework syntactic sugar
 * Web Entrance
 *
 * Written and Designed By Jang Ts
 * http://tangram.js.cn
 */
;
this.tangram.init().auto([
    '$_/async/',
    '$_/../sugar/compiler/lib/sugar as tangram_js_sugar'
], function (_, root, imports) {
    var tangram_js_sugar = imports.tangram_js_sugar,
    sugars = [], scripts = document.getElementsByTagName('script');
    // console.log(imports);
    for (var index = 0; index < scripts.length; index++) {
        var script = scripts[index];
        if (script.type === "text/tangram.js-sugar") {
            if (script.src) {
                var src = script.src;
                var i = 0;
                _.async.ajax(src, function (data) {
                    let sugar = tangram_js_sugar(data).compile().run(function (content) {
                        console.log(this.ast);
                        // console.log(this.posimap, this.mappings);

                        console.log(true, content);
                        // console.log(data);
                        // console.log(this.min());
                    }, function () {
                        // console.log(this.ast);
                        // console.log(this.replacements);
                    });
                });
                // ;
            } else {
                tangram_js_sugar(script.innerHTML).compile().run(function (content) {
                    console.log(this.ast);
                    console.log(content);
                }, function () {
                    console.log(this.ast);
                    // console.log(this.replacements);
                });
            }
        }
    }
});
