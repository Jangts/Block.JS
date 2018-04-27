/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Wed, 25 Apr 2018 00:54:02 GMT
 */
;
// tangram.config({});
tangram.block([], function (pandora, global, imports, undefined) {
	var _ = pandora;
	var doc = global.document;
	var console = global.console;
	function typeofObj (object) {
		if (!object) {
			return 'Null';
		}
		if(isGlobal(object))  {
			return 'Global';
		}
		if(isDoc(object)) {
			return 'HTMLDocument';
		}
		if(isElement(object)) {
			return 'Element';
		}
		if(isElements(object)) {
			return 'Elements';
		}
		if(isArray(object)) {
			return 'Array';
		}
		if(isRegExp(object)) {
			return 'RegExp';
		}
		return nativeType(object);
	}
	function nativeType (object) {
		if (!object) {
			return 'Null';
		}
		var match = Object.prototype.toString.call(object).match(/\[object (\w+)\]/);
		if (match) {
			return match[1];
		}
		return 'Object';
	}
	function isGlobal (object) {
		return object === window;
	}
	function isDoc (object) {
		return object === document;
	}
	function isElement (object) {
		return object && typeof object === 'object' && ((HTMLElement && (objectinstanceofHTMLElement)) || (object.nodeType === 1) || (DocumentFragment && (objectinstanceofDocumentFragment)) || (object.nodeType === 11));
	}
	function isElFragment (object) {
		return object && typeof object === 'object' && ((DocumentFragment && (objectinstanceofDocumentFragment)) || (object.nodeType === 11));
	}
	function isElements (object) {
		if (object && typeof object === 'object') {
			if(HTMLCollection && (objectinstanceofHTMLCollection))  {
				return true;
			}
			if(NodeList && (objectinstanceofNodeList)) {
				return true;
			}
			if((objectinstanceofArray) || (Object.prototype.toString.call(object) === '[object Array]') || ((typeof(object.length) === 'number') && ((typeof(object.item) === 'function') || (typeof(object.splice) != 'undefined')))) {
				for (var i = 0; i < object.length; i++) {
					if(!isElement(object[i]))  {
						return false;
					};
				}
				return true;
			};
		};
	}
	function isArray (object) {
		return Object.prototype.toString.call(object) === '[object Array]';
	}
	function isRegExp (object) {
		return object instanceof RegExp;
	}
	function typeofStr (string) {
		if(isIntStr(string))  {
			return 'StringInteger';
		}
		if(isFloatStr(string)) {
			return 'StringFloat';
		}
		return 'String';
	}
	var IntExpr = /^(\+|-)?\d+$/;
	function isIntStr (string) {
		return IntExpr.test(string);
	}
	function isFloatStr (string) {
		if(/^[-\+]{0,1}[\d\.]+$/.test(string))  {
			if(string.split('.').length === 2 && string.split('.')[1] != '')  {
				return true;
			};
		}
		return false;
	}
	function isInteger (number) {
		if (typeof Number.isInteger === 'function') {
			return Number.isInteger(number);
		}else  {
			return Math.floor(number) === number;
		};
	}
	_('util.type', function (object, subtype) {
		switch (typeof object) {
			case 'object': return   subtype ? typeofObj(object) : (object == null ? 'Null': ((typeofObj(object) === 'Array') ? 'Array': 'Object'));
			case 'function': case 'boolean': case 'undefined': return(typeof object).replace(/(\w)/, function (v) {
				return v.toUpperCase();
			});
			case 'number': return subtype ? (isInteger(object) ? 'Integer': 'Float') : 'Number';
			case 'string': return subtype ? typeofStr(object) : 'String';
		};
	});
	_('util.fasttype', function (obj) {
		return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
	});
	pandora('util.type', {
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
	pandora.extend(_.util.type.Obj, {
		native: nativeType
	});
	return _.util.type;
});