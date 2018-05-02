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
    '$_/../sugar/compiler/lib/sugar',
    '$_/../sugar/compiler/node_modules/vlq/dist/vlq'
], function (_) {
    var sugars = [], scripts = document.getElementsByTagName('script');
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
                        console.log(content);
                        // console.log(this.min());
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
