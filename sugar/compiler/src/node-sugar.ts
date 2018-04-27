#!/usr/bin/env node

/*!
 * tangram.js framework syntactic sugar
 * Node.JS Entrance
 *
 * Written and Designed By Jang Ts
 * http://tangram.js.cn
 */
;

const tangram_js_sugar = require('./sugar.js');
const fs = require('fs');
const glob = require("glob");
const path = require('path');
const commands = ['compile', 'cdir', 'build', 'help', 'version'];

// console.log(process.argv);

let options = {
    command: 'compile',
    inputDir: '',
    outputDir: '',
    containSubDir: false,
    safemode: false,
    toES6: false,
    compileMin: false
}

let handlers = {
    compile(i = null, o = null) {
        if (i) {
            o = o || i + '.js';
        } else if (options.inputDir) {
            i = options.inputDir;
            o = options.outputDir;
        } else {
            console.log('must input a filename');
            return;
        }
        console.log('compile tang file ' + i + '...');
        var script = fs.readFileSync(i, 'utf-8');
        var sugar = tangram_js_sugar(script, this.toES6).compile();
        fs.writeFileSync(o, sugar.output);
        console.log('file ' + o + ' compiled completed!');
        if (options.compileMin) {
            let om = o.replace(/js$/, 'min.js');
            fs.writeFileSync(om, sugar.min());
            console.log('file ' + om + ' compiled completed!');
        }
        // console.log(sugar.output);
        
    },
    cdir() {
        let indir = path.resolve(options.inputDir);
        let outdir = options.outputDir ? path.resolve(options.outputDir) : indir;
        let pattern;
        // console.log(indir);
        if (options.containSubDir) {
            pattern = indir + '/**/*.tang';
        } else {
            pattern = indir + '/*.tang';
        }
        glob(pattern, function (er, files) {
            // files 是匹配到的文件的数组.
            // 如果 `nonull` 选项被设置为true, 而且没有找到任何文件,那么files就是glob规则本身,而不是空数组
            // er是当寻找的过程中遇的错误
            // console.log(files);
            for (let index = 0; index < files.length; index++) {
                const tang = files[index];
                if (/\.test.tang$/.test(tang)){
                    continue;
                }
                if (options.safemode) {
                    var js: string = tang.replace(indir, outdir) + '.js';
                } else {
                    var js: string = tang.replace(indir, outdir).replace(/.tang$/, '.js');
                }
                handlers.compile(tang, js);
            }
        });
    },
    build() {
        console.log('Hello, world!');
    },
    help() {
        console.log('Hello, world!');
    },
    version() {
        console.log('Hello, world!');
    }
}

if (commands['includes'](process.argv[2])) {
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
        case "-m":
            options.compileMin = true;
            break;
        case "-v":
            options.command = 'version';
            break;
        case "-s":
            options.safemode = true;
            break;
        case "-e":
            options.toES6 = true;
            break;
        default:
            if (options.inputDir) {
                if (!options.outputDir) {
                    options.outputDir = item;
                }
            } else {
                options.inputDir = item;
            }
            break;
    }
});

// console.log('Hello, world!');
switch (options.command) {
    case 'compile':
        handlers.compile();
        break;
    case 'cdir':
        handlers.cdir();
        break;
    case 'build':

        break;
    case 'help':

        break;
    case 'version':

    default:
        break;
}

// node ./../../sugar/compiler/lib/node-sugar.js cdir ./ ./../../src/ -m -c
// console.log(fs.readFileSync('./Tree.tang', 'utf-8'));

// handlers.compile('./arr/arr.tang', './../src/arr/arr.js');
// handlers.compile('./arr/diff.tang', './../src/arr/diff.js');
// handlers.compile('./arr/Tree.tang', './../src/arr/Tree.js');

// handlers.compile('./async/async.tang', './../src/async/async.js');
// handlers.compile('./async/Promise.tang', './../src/async/Promise.js');
// handlers.compile('./async/Request.tang', './../src/async/Request.js');
// handlers.compile('./async/Uploader.tang', './../src/async/Uploader.js');

// handlers.compile('./data/data.tang', './../src/data/data.js');
// handlers.compile('./data/Model.tang', './../src/data/Model.js');
// handlers.compile('./data/Sheet.tang', './../src/data/Sheet.js');
// handlers.compile('./data/Storage.tang', './../src/data/Storage.js');

// handlers.compile('./math/math.tang', './../src/math/math.js');
// handlers.compile('./math/easing.tang', './../src/math/easing.js');

// handlers.compile('./media/Image.tang', './../src/media/Image.js');
// handlers.compile('./media/Player.tang', './../src/media/Player.js');

// handlers.compile('./str/str.tang', './../src/str/str.js');
// handlers.compile('./str/hash.tang', './../src/str/hash.js');
// handlers.compile('./str/MD5Encoder.tang', './../src/str/MD5Encoder.js');


// handlers.compile('./util/locales/en.tang', './../src/util/locales/en.js');
// handlers.compile('./util/locales/zh.tang', './../src/util/locales/zh.js');
// handlers.compile('./util/bool.tang', './../src/util/bool.js');
// handlers.compile('./util/Color.tang', './../src/util/Color.js');
// handlers.compile('./util/Time.tang', './../src/util/Time.js');
// handlers.compile('./util/type.tang', './../src/util/type.js');

// handlers.compile('./autolayout.tang', './../src/autolayout.js');