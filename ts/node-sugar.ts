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

handlers.compile('./arr/arr.tang', './../src/arr/arr.tang.js');
handlers.compile('./arr/diff.tang', './../src/arr/diff.tang.js');
handlers.compile('./arr/Tree.tang', './../src/arr/Tree.tang.js');