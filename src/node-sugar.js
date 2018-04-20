#!/usr/bin/env node

// const tangram = require('/Users/ivan/Documents/GitHub/Block.JS/src/tangram.js');
const tangram_js_sugar = require('./sugar.js');
const fs = require('fs');
const path = require('path');
const commands = ['compile', 'cdir', 'build', 'help', 'version'];

const handlers = {
    compile(i, o) {
        o = o || i + '.js';
        var script = fs.readFileSync(i, 'utf-8');
        var sugar = tangram_js_sugar(script).compile();
        fs.writeFileSync(o, sugar.output);
        // console.log(sugar.output);
        console.log('tang file ' + i + ' compiled completed!');
    },
    cdir() {
        let indir = path.resolve(opition.inputDir)
        console.log(indir);
    },
    build() {

    },
    help() {

    },
    version() {

    }
}

let options = {
    command: 'compile',
    inputDir: '',
    outputDir: '',
    containSubDir: false
}
if (commands.includes(process.argv[2])) {
    options.command = process.argv[2];
    var index = 3;
} else {
    var index = 2;
}

process.argv.slice(index).forEach(function (item) {
    switch (item) {
        case "-c":
            options.containSubDir = true;
            break;
        case "-v":
            config.command = 'version';
            break;
        default:
            if (options.inputDir) {
                if (!options.inputDir) {
                    options.outputDir = item;
                }
            } else {
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