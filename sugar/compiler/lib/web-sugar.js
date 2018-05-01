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
                // console.log(script.src);
                _.async.ajax(script.src, function (data) {
                    tangram_js_sugar(data).compile().run(function (content) {
                        // console.log(this.ast);
                        // console.log(this.posimap, this.mappings);
                        console.log(content);
                        // console.log(this.min());
                        var lines = [];
                        var last = [0, 0, 0, 0, 0];
                        for (var index_1 = 0; index_1 < this.mappings.length; index_1++) {
                            var points = [];
                            for (var point = 0; point < this.mappings[index_1].length; point++) {
                                var numbers = [];
                                for (var n = 0; n < this.mappings[index_1][point].length; n++) {
                                    numbers.push(vlq.encode(this.mappings[index_1][point][n] - last[n]));
                                }
                                points.push(numbers.join(''));
                                last = this.mappings[index_1][point];
                            }
                            lines.push(points.join(','));
                        }
                        console.log(lines.join(';'));
                    }, function () {
                        // console.log(this.ast);
                        // console.log(this.replacements);
                    });
                });
                // ;
            }
            else {
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
//# sourceMappingURL=web-sugar.js.map