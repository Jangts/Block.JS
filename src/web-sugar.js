tangram.auto(['$_/sugar'], function () {
    var sugars = [], scripts = document.getElementsByTagName('script');
    for (var index = 0; index < scripts.length; index++) {
        var script = scripts[index];
        if (script.type === "text/tangram.js-sugar") {
            sugars.push(tangram_js_sugar(script.innerHTML).compile());
        }
    }
    for (var index = 0; index < sugars.length; index++) {
        var sugar = sugars[index];
        // console.log(sugar.ast, sugar.replacements);
        sugar.run();
    }
});
