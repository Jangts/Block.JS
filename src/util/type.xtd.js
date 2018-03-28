/*!
 * tangram.js framework source code
 *
 * static util.type
 *
 * Date 2017-04-06
 */
;
tangram.block(function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    //对象子类型判断
    var typeofObj = function(object) {
        if (!object) {
            return 'Null';
        }
        if (isGlobal(object)) {
            return 'Global';
        }
        if (isDoc(object)) {
            return 'HTMLDocument';
        }
        if (isElement(object)) {
            return 'Element';
        }
        if (isElements(object)) {
            return 'Elements';
        }
        if (isArray(object)) {
            return 'Array';
        }
        if (isRegExp(object)) {
            return 'RegExp';
        }
        return nativeType(object);
    };

    var nativeType = function(object) {
        if (!object) {
            return 'Null';
        }
        var match = Object.prototype.toString.call(object).match(/\[object (\w+)\]/);
        if (match) {
            return match[1];
        }
        return 'Object';
    }

    var isGlobal = function(object) {
        return object === window;
    };

    var isDoc = function(object) {
        return object === document;
    };

    var isElement = function(object) {
        return object && typeof object === 'object' && ((HTMLElement && (object instanceof HTMLElement)) || (object.nodeType === 1) || (DocumentFragment && (object instanceof DocumentFragment)) || (object.nodeType === 11));
    };

    var isElFragment = function(object) {
        return object && typeof object === 'object' && ((DocumentFragment && (object instanceof DocumentFragment)) || (object.nodeType === 11));
    };

    var isElements = function(object) {
        if (object && typeof object === 'object') {
            if (HTMLCollection && (object instanceof HTMLCollection)) {
                return true;
            }
            if (NodeList && (object instanceof NodeList)) {
                return true;
            }
            if ((object instanceof Array) || (Object.prototype.toString.call(object) === '[object Array]') || ((typeof(object.length) === 'number') && ((typeof(object.item) === 'function') || (typeof(object.splice) != 'undefined')))) {
                for (var i = 0; i < object.length; i++) {
                    if (!isElement(object[i])) {
                        return false;
                    }
                };
                return true;
            }
        }

    };

    var isArray = function(object) {
        return Object.prototype.toString.call(object) === '[object Array]';
    };

    var isRegExp = function(object) {
        return object instanceof RegExp;
    };

    //字符串子类型判断
    var typeofStr = function(string) {
        if (isIntStr(string)) {
            return 'StringInteger';
        }
        if (isFloatStr(string)) {
            return 'StringFloat';
        }
        return 'String';
    };

    var IntExpr = /^(\+|-)?\d+$/;

    var isIntStr = function(string) {
        return IntExpr.test(string)
    };

    var isFloatStr = function(string) {
        if (/^[-\+]{0,1}[\d\.]+$/.test(string)) {
            if (string.split('.').length === 2 && string.split('.')[1] != '') {
                return true;
            }
        }
        return false;
    };

    var isInteger = function(number) {
        if (typeof Number.isInteger === 'function') {
            return Number.isInteger(number);
        } else {
            return Math.floor(number) === number;
        }
    }

    _('util.type', function(object, subtype) {
        switch (typeof object) {
            case 'object':
                return subtype ? typeofObj(object) : (object == null ? 'Null' : ((typeofObj(object) === 'Array') ? 'Array' : 'Object'));

            case 'function':
            case 'boolean':
            case 'undefined':
                return (typeof object).replace(/(\w)/, function(v) {
                    return v.toUpperCase();
                });

            case 'number':
                return subtype ? (isInteger(object) ? 'Integer' : 'Float') : 'Number';

            case 'string':
                return subtype ? typeofStr(object) : 'String';
        }
    });

    _('util.fasttype', function(obj) {
        return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
    });

    _.extend(_.util.type, {
        Obj: typeofObj,
        Str: typeofStr,
        isGlobal: isGlobal,
        isWin: isGlobal,
        isDoc: isDoc,
        isElement: isElement,
        isElements: isElements,
        isArray: isArray,
        isRegExp: isRegExp,
        IntExpr: IntExpr,
        isIntStr: isIntStr,
        isFloatStr: isFloatStr,
        isInteger: isInteger
    });

    _.extend(_.util.type.Obj, {
        native: nativeType
    });

    return pandora;
});