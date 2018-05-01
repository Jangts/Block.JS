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
                        let lines = [];
                        let last = [0,0,0,0,0];
                        for (let index = 0; index < this.mappings.length; index++) {
                            let points = [];
                            for (let point = 0; point < this.mappings[index].length; point++) {
                                let numbers = [];
                                for (let n = 0; n < this.mappings[index][point].length; n++) {
                                    numbers.push(vlq.encode(this.mappings[index][point][n] - last[n]));
                                }
                                points.push(numbers.join(''));
                                last = this.mappings[index][point];
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
