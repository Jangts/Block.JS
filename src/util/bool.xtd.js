/*!
 * Block.JS Framework Source Code
 *
 * static util.bool
 *
 * Date 2017-04-06
 */
;
block([
    '$_/util/type.xtd',
    '$_/dom/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console,
        File = global.File,
        FileList = global.FileList,
        FormData = global.FormData;

    _('util.bool', {
        truthy: function(value) {
            return !!value
        },
        is: function(file, __class) {
            return _.util.bool.isObj(file) && file instanceof __class;
        },
        isBool: function(vari) {
            return typeof vari == 'boolean';
        },
        isObj: function(obj) {
            return typeof obj == 'object' && obj;
        },
        hasProp: _.util.obj.hasProp,
        isWin: _.util.type.isGlobal,
        isDoc: _.util.type.isDoc,
        isEl: _.util.type.isElement,
        isVisi: function(elem) {
            return _.dom.getStyle(elem, 'display') != 'none';
        },
        isHide: function(elem) {
            return _.dom.getStyle(elem, 'display') == 'none';
        },
        isEls: _.util.type.isElements,
        isArr: _.util.type.isArray,
        inArr: function(elem, array) {
            return _.util.arr.has(array, elem);
        },
        in: function(elem, object) {
            if (_.util.type.isArray(object)) {
                return _.util.arr.has(object, elem);
            }
            if (_.util.bool.isObj(object)) {
                return _.util.obj.has(object, elem);
            }
            return false;
        },
        isReg: _.util.type.isRegExp,
        isFile: function(file) {
            return _.util.bool.isObj(file) && file instanceof File;
        },
        isFiles: function(files) {
            return _.util.bool.isObj(files) && files instanceof FileList;
        },
        isForm: function(data) {
            return _.util.bool.isObj(data) && data instanceof FormData
        },
        isFn: function(obj) {
            return typeof obj == 'function';
        },
        isStr: function(str) {
            return typeof str == 'string';
        },
        isOuterHTML: function(str) {
            return /^<(\w+)[\s\S]+<\/\1>$/.test(str) || /^<(\w+)[^>]*\/\s*>$/.test(str);
        },
        isIntStr: _.util.type.isIntStr,
        isFloatStr: _.util.type.isFloatStr,
        isPercent: function(str) {
            return (typeof str === 'string') && (/^[-\+]{0,1}(\d+(\.\d+){0,1}|\.\d+)\%$/.test(str));
        },
        hasStr: _.hasString,
        isNum: function(num) {
            return typeof num == 'number';
        },
        isNumber: function(num) {
            return !isNaN(parseFloat(num)) && isFinite(num);
        },
        isNumeric: function(num) {
            return typeof num == 'number' || _.util.type.isIntStr(num) || _.util.type.isFloatStr(num);
        },
        isNul: function(obj) {
            if (obj) {
                return false;
            } else {
                return true;
            }
        },
        isUrl: function(str) {
            var strRegex = "^((https|http|ftp|rtsp|mms|wss|ws)?://)" +
                "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
                +
                "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
                +
                "|" // 允许IP和DOMAIN（域名）
                +
                "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
                +
                "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
                +
                "[a-z]{2,6})" // first level domain- .com or .museum
                +
                "(:[0-9]{1,4})?" // 端口- :80
                +
                "((/?)|" // a slash isn't required if there is no file name
                +
                "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var re = new RegExp(strRegex);
            if (re.test(str)) {
                return true;
            } else {
                return false;
            }
        },
        isHttpMethod: function(method) {
            if(typeof method !== 'string'){
                return false;
            }
            method = method.toUpperCase();
            return _.util.bool.inArr(method, ['GET', 'CONNECT', 'COPY', 'DELETE', 'HEAD', 'LINK', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'TRACE', 'UNLINK', 'UPDATE', 'WRAPPED']) && method;
        },
        isSupportCanvas: function() {
            return typeof CanvasRenderingContext2D != "undefined";
        },
        // 是否 webkit
        isWebkit: function() {
            const reg = /webkit/i
            return reg.test(this._ua)
        },

        // 是否 IE
        isIE: function() {
            return 'ActiveXObject' in window
        },
        isAndroid: function() {
            var android = false;
            var sAgent = navigator.userAgent;

            if (/android/i.test(sAgent)) { // android
                android = true;
                var aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);

                if (aMat && aMat[1]) {
                    android = parseFloat(aMat[1]);
                }
            }
            return android;
        }
    });
});