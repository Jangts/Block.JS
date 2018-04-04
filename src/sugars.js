/*!
 * tangram.js framework source code
 *
 * syntactic sugars for tangram.js
 *
 * Date 2017-04-06
 */
;
(function(global, undefined) {
    var doc = global.document;

    // 编译主代码块
    compile = function() {
        var scripts = shallow(doc.getElementsByTagName('script')),
            getIncs = function(text) {
                if (text) {
                    array = text.replace(/[;\r\n]+/g, ';').replace(/^include\s+/, '"').replace(/\s*;\s*include\s+/g, '", "').replace(/\s*;\s*$/, '') + '"';
                    return "tangram.tangram.block([" + array + "], " + stings;
                } else {
                    return "tangram.tangram.block(" + stings;
                }
            },
            getBlock = function(text) {
                text = text.replace(/include\s+.+[;\s\r\n]*/, '');
                return text + "}, true);";
            },
            stings = "function(pandora, global){" +
            "\r\nvar _ = pandora," +
            "declare = pandora.declareClass," +
            "cache = pandora.locker," +
            "doc = global.document," +
            "console = global.console;\r\n";
        each(scripts, function(i, script) {
            // 判断是否为InterBlock
            if (script.type === "text/tangram.js") {
                // 获取代码并删除注释
                // var text = script.innerHTML.replace(/\s*\/\/.*/g, '').replace(/\s*\/\*[\s\S]*?\*\/\s*/g, '').replace(/\s*[;\r\n]+\s*/, ';\r\n').replace(/^[;\s\r\n]*/, ''),

                var text = script.innerHTML.replace(/\s*;+\s*[\r\n]+/g, ';\r\n').replace(/^[;\s\r\n]*/g, ''),

                    // 匹配引用和语句块
                    codes = text.match(/^((include\s+[^;]+[;\s\r\n]*)*)([\s\S]+)$/);

                // 匹配成功则运行
                if (codes) {
                    eval(getIncs(codes[1]) + getBlock(codes[3]));
                }
            }
        });
    };

    doc.addEventListener ? window.addEventListener('load', compile) : window.attachEvent("onload" + originType, compile);
}(window));