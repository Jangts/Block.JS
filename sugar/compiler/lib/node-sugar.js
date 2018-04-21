#!/usr/bin/env node
;
var tangram_js_sugar = require('./sugar.js');
var fs = require('fs');
var path = require('path');
var commands = ['compile', 'cdir', 'build', 'help', 'version'];
var options = {
    command: 'compile',
    inputDir: '',
    outputDir: '',
    containSubDir: false
};
var handlers = {
    compile: function (i, o) {
        o = o || i + '.js';
        var script = fs.readFileSync(i, 'utf-8');
        var sugar = tangram_js_sugar(script).compile();
        fs.writeFileSync(o, sugar.output);
        // console.log(sugar.output);
        console.log('tang file ' + i + ' compiled completed!');
    },
    cdir: function () {
        var indir = path.resolve(options.inputDir);
        console.log(indir);
    },
    build: function () {
    },
    help: function () {
    },
    version: function () {
    }
};
if (commands['includes'](process.argv[2])) {
    options.command = process.argv[2];
    var index = 3;
}
else {
    var index = 2;
}
process.argv.slice(index).forEach(function (item) {
    switch (item) {
        case "-c":
            options.containSubDir = true;
            break;
        case "-v":
            options.command = 'version';
            break;
        default:
            if (options.inputDir) {
                if (!options.inputDir) {
                    options.outputDir = item;
                }
            }
            else {
                options.inputDir = item;
            }
            break;
    }
});
// console.log(fs.readFileSync('./Tree.tang', 'utf-8'));
handlers.compile('./arr/arr.tang', './../src/arr/arr.js');
handlers.compile('./arr/diff.tang', './../src/arr/diff.js');
handlers.compile('./arr/Tree.tang', './../src/arr/Tree.js');
handlers.compile('./async/async.tang', './../src/async/async.js');
handlers.compile('./async/Promise.tang', './../src/async/Promise.js');
handlers.compile('./async/Request.tang', './../src/async/Request.js');
handlers.compile('./async/Uploader.tang', './../src/async/Uploader.tang.js');
handlers.compile('./data/data.tang', './../src/data/data.js');
handlers.compile('./data/Model.tang', './../src/data/Model.js');
handlers.compile('./data/Sheet.tang', './../src/data/Sheet.js');
handlers.compile('./data/Storage.tang', './../src/data/Storage.js');
handlers.compile('./math/math.tang', './../src/math/math.js');
handlers.compile('./math/easing.tang', './../src/math/easing.js');
handlers.compile('./media/Image.tang', './../src/media/Image.js');
handlers.compile('./media/Player.tang', './../src/media/Player.js');
handlers.compile('./str/str.tang', './../src/str/str.js');
handlers.compile('./str/hash.tang', './../src/str/hash.js');
handlers.compile('./str/MD5Encoder.tang', './../src/str/MD5Encoder.js');
//# sourceMappingURL=node-sugar.js.map