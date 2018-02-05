/*!
 * Block.JS Framework Source Code
 *
 * static util.str
 *
 * Date 2017-04-06
 */
;
block(function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console,
        location = global.location;

    //常用字符串处理函数
    _('util.str', {
        trim: function(str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        },
        capital: function(str) {
            return str.replace(/(\w)/, function(v) { return v.toUpperCase() });
        },
        toCamel: function(str) {
            return str.replace(/(-\w)/, function(v) { return v.replace('-', '').toUpperCase() });
        },
        has: function(strs, str) {
            return RegExp("\\b" + str + "\\b").test(strs);
        },
        charCode: function(code) {
            return String.fromCharCode(code);
        },
        escape: function(str) {
            return "echo(\"" + str.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "\");";
        },
        repeat: function(target, n) {
            var s = target,
                total = "";
            while (n > 0) {
                if (n % 2 == 1) {
                    total += s;
                }
                if (n == 1) {
                    break;
                }
                s += s;
                n = n >> 1; //相当于将n除以2取其商，或者说是开2次方
            }
            return total;
        }
    });
});