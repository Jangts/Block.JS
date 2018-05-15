/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Sat, 12 May 2018 18:29:32 GMT
 */
;
// tangram.config({});
tangram.init().block([
    '$_/arr/',
    '$_/dom/selector',
    '$_/dom/Events'
], function(pandora, root, imports, undefined) {
    var module = this.module;
    pandora.ns('dom', function() {
        var _ = pandora;
        var doc = root.document;
        var query = this.sizzle || this.selector;
        var cache = pandora.dom.cache = function(elem) {
            if (elem) {
                return elem.tangram_js_id = elem.tangram_js_id || pandora.storage.set({});
            };
        }
        var unCSSStyle = {
            scrollHeight: 'scrollHeight',
            scrollLeft: 'scrollLeft',
            scrollTop: 'scrollTop',
            scrollWidth: 'scrollWidth',
            offsetHeight: 'offsetHeight',
            offsetLeft: 'offsetLeft',
            offsetTop: 'offsetTop',
            offsetWidth: 'offsetWidth'
        };
        var computedStyle = function(elem, property) {
            var style = {};
            var currentStyle = elem.currentStyle || {}
            var prop = void 0;
            if (property) {
                attr = property.replace(/(\-([a-z]){1})/g, function() {
                    return arguments[2].toUpperCase();
                });
                prop = property.replace(/[A-Z]/g, function(s) {
                    return '-' + s.toLowerCase();
                });
                return currentStyle[attr] || currentStyle[prop];
            } else {
                for (var key in currentStyle) {
                    key = key.replace(/(\-([a-z]){1})/g, function() {
                        return arguments[2].toUpperCase();
                    });
                    prop = key.replace(/[A-Z]/g, function(s) {
                        return '-' + s.toLowerCase();
                    });
                    style[key] = currentStyle[key];
                    style[prop] = currentStyle[key];
                }
                style.styleFloat = style.cssFloat;
                return style;
            };
        }
        var _setStyle = function(elem, property, value) {
            var _arguments = arguments;
            if (arguments.length === 2) {
                if (typeof property === 'string') {
                    elem.style.cssText = property;
                } else if (typeof property === 'object') {
                    pandora.each(property, function(prop, val) {
                        elem.style.prop = val;
                    }, this);
                }
                return;;
            }
            if (elem) {
                if (elem == root || elem == root.document) {
                    elem = doc.documentElement || doc.body;
                }
                attr = property.replace(/(\-([a-z]){1})/g, function() {
                    return arguments[2].toUpperCase();
                });
                prop = property.replace(/[A-Z]/g, function(s) {
                    return '-' + s.toLowerCase();
                });
                if (unCSSStyle[attr]) {
                    elem[unCSSStyle[attr]] = value;
                    return value;
                }
                switch (prop) {
                    case 'opacity':
                        if (elem.style.filter) {
                            elem.style.filter = 'alpha(' + attr + '=' + value + ')';
                        }
                        elem.style[attr] = value;
                        break;;
                    case 'z-index':
                        elem.style[attr] = value;
                        break;;
                    default:
                        value = (typeof value == 'number' || (typeof value == 'string' && /^[-\+]?[\d\.]+$/.test(value))) ? value + "px" : value;
                        elem.style[property] = value;
                        break;;
                }
                return value;
            } else {
                _.debug('Cannot set style for null.');
            };
        }
        var getStyle = function(elem, property) {
            if (elem == root || elem == doc) {
                elem = doc.documentElement || doc.body;
            }
            if (property) {
                attr = property.replace(/(\-([a-z]){1})/g, function() {
                    return arguments[2].toUpperCase();
                });
                if (unCSSStyle[attr]) {
                    return elem[unCSSStyle[attr]];
                }
            }
            try {
                return property ? getComputedStyle(elem, null)[property] : getComputedStyle(elem, null);
            } catch (e) {
                return property ? computedStyle(elem, property) : computedStyle(elem, null);
            };
        }
        var setStyle = function(elem) {
            switch (typeof arguments[1]) {
                case 'string':
                    _setStyle(elem, arguments[1], arguments[2]);
                    break;;
                case 'object':
                    for (var k in arguments[1]) {
                        _setStyle(elem, k, arguments[1][k]);
                    }
                    break;;
            };
        }
        var getSize = function(elem, type) {
            if (elem == window) {
                return {
                    width: doc.documentElement.clientWidth,
                    height: doc.documentElement.clientHeight
                };
            } else if (elem == document) {
                return {
                    width: Math.max.apply(null, [doc.documentElement.scrollWidth + doc.documentElement.offsetLeft, doc.documentElement.clientWidth]),
                    height: Math.max.apply(null, [doc.documentElement.scrollHeight + doc.documentElement.offsetTop, doc.documentElement.clientHeight])
                };
            } else {
                switch (type) {
                    case 'box':
                        return {
                            width: elem.offsetWidth + parseInt(getStyle(elem, 'margin-left')) + parseInt(getStyle(elem, 'margin-right')),
                            height: elem.offsetHeight + parseInt(getStyle(elem, 'margin-top')) + parseInt(getStyle(elem, 'margin-bottom'))
                        };
                    case 'inner':
                        return {
                            width: elem.clientWidth,
                            height: elem.clientHeight
                        };
                    case 'outer':
                        return {
                            width: elem.offsetWidth,
                            height: elem.offsetHeight
                        };
                    case 'max':
                        var container = elem.parentNode;
                        var gapx = parseInt(getStyle(container, 'padding-left')) + parseInt(getStyle(container, 'padding-right'));
                        var gapy = parseInt(getStyle(container, 'padding-bottom')) + parseInt(getStyle(container, 'padding-top'));
                        return {
                            width: container ? container.clientWidth - gapx : 0,
                            height: container ? container.clientHeight - gapy : 0
                        };
                    default:
                        return {
                            width: parseInt(getStyle(elem, 'width')) || 0,
                            height: parseInt(getStyle(elem, 'height')) || 0
                        };
                }
            };
        }
        var getWidth = function(elem, type) {
            return getSize(elem, type).width;
        }
        var getHeight = function(elem, type) {
            return getSize(elem, type).height;
        }
        var set = function(elem, name, value) {
            switch (name) {
                case 'style':
                    elem.style.cssText = value;
                    break;;
                case 'value':
                    var tagName = elem.tagName || '';
                    tagName = tagName.toLowerCase();
                    if (tagName === 'input' || tagName === 'textarea') {
                        elem.value = value;
                    } else {
                        elem.setAttribute(name, value);
                    }
                    break;;
                default:
                    if (elem.style[name] != undefined) {
                        elem.style[name] = value;
                    } else if (elem[name] != undefined) {
                        elem[elem] = value;
                        if (name === 'id') {
                            elem.setAttribute(name, value);
                        }
                    } else {
                        elem.setAttribute(name, value);
                    }
                    break;;
            }
            return value;
        }
        var hasAttr = function(elem, attr) {
            return elem.hasAttribute(attr);
        }
        var setAttr = function(elem, name, value) {
            elem.setAttribute(name, value);
            return value;
        }
        var getAttr = function(elem, attr) {
            return elem.getAttribute(attr);
        }
        var removeAttr = function(elem, attr) {
            elem.removeAttribute(attr);
        }
        var setData = function(elem, dataName, data) {
            if (elem.dataset) {
                dataName = dataName.replace(/-[a-z]/g, function(s) {
                    return s.replace('-', '').toUpperCase();
                });
                elem.dataset[dataName] = data;
            } else {
                attr = 'data-' + dataName.replace(/[A-Z]/g, function(s) {
                    return '-' + s.toLowerCase();
                });
                elem.getAttribute(attr, data);
            };
        }
        var getData = function(elem, dataName) {
            if (elem.dataset) {
                dataName = dataName.replace(/-[a-z]/g, function(s) {
                    return s.replace('-', '').toUpperCase();
                });
                return elem.dataset[dataName];
            } else {
                attr = 'data-' + dataName.replace(/[A-Z]/g, function(s) {
                    return '-' + s.toLowerCase();
                });
                return elem.getAttribute(attr);
            };
        }
        var _matches = Element.prototype.matches ||
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||

            function(s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s);
                var i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            }
        var matches = function(elem, selectorString) {
            _matches.call(elem, selectorString);
        }
        var hasClass = function(elem, className) {
            if (elem.className) {
                if (elem.className.baseVal) {
                    return elem.className.animVal.match(new RegExp('(^|\\s+)' + className + '(\\s+|$)'));
                }
                if (elem.className.baseVal) {
                    return elem.className.baseVal.match(new RegExp('(^|\\s+)' + className + '(\\s+|$)'));
                }
                return elem.className.match(new RegExp('(^|\\s+)' + className + '(\\s+|$)'));
            }
            return false;
        }
        var toggleClass = function(elem, className, switchType) {
            if (hasClass(elem, className) && switchType !== true) {
                var exprs = [new RegExp('(^' + className + '$|^' + className + '\\s+|\\s+' + className + '$)'), new RegExp('\\s+' + className + '\\s')];
                elem.className = elem.className.replace(exprs[0], '').replace(exprs[1], ' ');
            } else if (!hasClass(elem, className) && switchType !== false) {
                elem.className = elem.className === '' ? className : elem.className + ' ' + className;
            };
        }
        var addClass = function(elem, className) {
            toggleClass(elem, className, true);
            return this;
        }
        var removeClass = function(elem, className) {
            toggleClass(elem, className, false);
            return this;
        }
        var insertAfter = function(elem, target) {
            var parent = target.parentNode;
            if (parent.lastChild == target) {
                parent.appendChild(elem);
            } else {
                parent.insertBefore(elem, target.nextSibling);
            }
            return elem;
        }
        var fragment = function(tagName) {
            return doc.createDocumentFragment(tagName);
        }
        var create = function(tagName, context, attribute) {
            if (tagName) {
                tagName = tagName.toLowerCase();
                switch (tagName) {
                    case 'svg':
                    case 'rect':
                    case 'circle':
                    case 'eliipse':
                    case 'line':
                    case 'path':
                    case 'g':
                    case 'text':
                    case 'tspan':
                    case 'defs':
                    case 'use':
                    case 'textpath':
                    case 'linearGradient':
                    case 'radialGradient':
                    case 'stop':
                        var Element = doc.createElementNS('http://www.w3.org/2000/svg', tagName);
                        break;;
                    case 'img':
                        var Element = new Image();
                        break;;
                    default:
                        var Element = doc.createElement(tagName);
                }
                if (attribute) {
                    for (var i in attribute) {
                        if (i == 'style') {
                            pandora.setStyle(Element, attribute[i]);
                        } else if ((i == 'value') && (tagName === 'input' || tagName === 'textarea')) {
                            pandora.value = attribute[i];
                        } else if (i == 'html') {
                            Element.innerHTML = attribute[i];
                        } else if (Element.style[i] != undefined) {
                            Element.style[i] = attribute[i];
                        } else if (Element[i] != undefined) {
                            Element[i] = attribute[i];
                        } else {
                            var attr = i.replace(/[A-Z]/g, function(s) {
                                return '-' + s.toLowerCase();
                            });
                            Element.setAttribute(attr, attribute[i]);
                        }
                    }
                }
                if (context) context.appendChild(Element);
                return Element;
            };
        }
        var createByString = function(string, target) {
            var parentNodeTagName = void 0;
            var parentNode = void 0;
            var node = void 0;
            if (!target || target.nodeType != 1) {
                target = pandora.fragment('div');
            }
            if (/^<tr>[\s\S]*<\/tr>$/i.test(string)) {
                parentNodeTagName = 'tbody';
            } else if (/^<td>[\s\S]*<\/td>$/i.test(string)) {
                parentNodeTagName = 'tr';
            } else {
                parentNodeTagName = 'div';
            }
            parentNode = pandora.create(parentNodeTagName, false, { html: string });
            node = parentNode.childNodes[0];
            while (node) {
                target.appendChild(node);
                node = parentNode.childNodes[0];
            }
            return target.childNodes;
        }
        var build = function(str) {
            if (_.util.type(str) === 'Element') {
                return [str];
            }
            if (_.util.type(str) === 'String') {
                return pandora.createByString(str);
            }
            return [null];
        }
        var append = function(target, content) {
            if (_.util.type(content) == 'Element') {
                target.appendChild(content);
            } else if (_.util.type(content) == 'String') {
                target.innerHTML = target.innerHTML + content;
            };
            return this;
        }
        var before = function(elem, content) {
            var _arguments = arguments;
            var parent = elem.parentNode;
            var newEls = pandora.build(content);
            pandora.each(newEls, function(_index, newElem) {
                if (_.util.type(newElem, true) == 'Element') {
                    parent.insertBefore(newElem, elem);
                };
            }, this);
            return this;
        }
        var after = function(elem, content) {
            var _arguments = arguments;
            var newEls = void 0;
            var curEl = void 0;
            newEls = pandora.build(content);
            curEl = elem;
            pandora.each(newEls, function(_index, newElem) {
                if (_.util.type(newElem, true) === 'Element') {
                    curEl = insertAfter(newElem, curEl);
                };
            }, this);
            return this;
        }
        var index = function(elem, list) {
            if (list && list.length) {
                switch (typeof list) {
                    case 'object':
                        return _.arr.index(_.slice(list, 0), elem);
                    case 'string':
                        return _.arr.index(query(list), elem);
                }
            }
            if (list === true) {
                return _.arr.index(query(elem.tagName, elem.parentNode), elem);
            }
            return (elem && elem.parentNode && elem.parentNode.childNodes) ? _.arr.index(elem.parentNode.childNodes, elem) : -1;
        }
        var remove = pandora.dom.remove = function(elem, context) {
            if (context && _.util.type(context) == 'Element' && elem.parentNode == context) {
                pandora.events.remove(elem);
                context.removeChild(elem);
            } else if (elem && elem.parentNode && elem.parentNode.removeChild) {
                pandora.events.remove(elem);
                elem.parentNode.removeChild(elem);
            };
        }
        pandora.ns('dom.events', {
            fire: function(elem, event, eventType) {
                elem.tangram_js_id && pandora.storage.get(elem.tangram_js_id).Events && pandora.storage.get(elem.tangram_js_id).Events.fire(event, eventType);
                return this;
            },
            add: function(elem, eventType, selector, data, handler) {
                if (elem && handler) {
                    var elemStorage = pandora.storage.get(_.dom.cache(elem));
                    if (elemStorage.Events) {
                        var Events = elemStorage.Events;
                    } else {
                        var Events = new _.dom.Events(elem);
                        Events._protected.keys.push(_.dom.cache(elem));
                        elemStorage.Events = Events;
                    }
                    Events.push(eventType, selector, data, handler);
                }
                return this;
            },
            remove: function(elem, eventType, selector, handler) {
                if (elem.tangram_js_id && pandora.storage.get(elem.tangram_js_id).Events) {
                    var Events = pandora.storage.get(elem.tangram_js_id).Events;
                    if (handler) {
                        Events.removeHandler(eventType, selector, handler);
                    } else {
                        if (eventType && typeof selector != 'undefined') {
                            Events.removeSelector(eventType, selector);
                        } else {
                            if (eventType) {
                                Events.removeType(eventType);
                            } else {
                                Events.remove();
                                elem.tangram_js_id.Events = undefined;
                                delete elem.tangram_js_id.Events;
                            }
                        }
                    }
                }
                return this;
            },
            trigger: function(elem, evenType, data) {
                var domEvents = new _.dom.Events();
                for (var k in domEvents._protected.keys) {
                    pandora.storage.get(domEvents._protected.keys[k]).Events.trigger(evenType, elem, data);
                }
                typeof elem[evenType] == 'function' && elem[evenType]();
                return this;
            },
            touch: function(obj, selector, callback) {
                var move = void 0;
                var istouch = false;
                if (typeof selector === "function") {
                    callback = selector;
                    selector = null;
                }
                if (typeof callback === "function") {
                    pandora.add(obj, 'touchstart', selector, null, function() {
                        istouch = true;
                    });
                    pandora.add(obj, 'touchmove', selector, null, function(e) {
                        move = true;
                    });
                    pandora.add(obj, 'touchend', selector, null, function(e) {
                        e.preventDefault();
                        if (!move) {
                            var touch = e.changedTouches[0];
                            e.pageX = touch.pageX;
                            e.pageY = touch.pageY;
                            var returnvalue = callback.call(this, e, 'touch');
                            if (returnvalue === false) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }
                        move = false;
                    });
                    pandora.add(obj, 'mousedown', selector, null, click);

                    function click(e) {
                        if (!istouch) {
                            return callback.call(this, e, 'touch');
                        };
                    }
                };
            },
            touchStart: function(obj, selector, callback) {
                if (typeof selector === "function") {
                    callback = selector;
                    selector = null;
                }
                if (typeof callback === "function") {
                    var istouch = false;
                    pandora.add(obj, 'touchstart', selector, null, function(e) {
                        var touch = e.changedTouches[0];
                        e.pageX = touch.pageX;
                        e.pageY = touch.pageY;
                        return callback.call(this, e, 'touchstart');
                    });
                    pandora.add(obj, 'mousedown', selector, null, click);

                    function click(e) {
                        if (!istouch) {
                            return callback.call(this, e);
                        };
                    }
                };
            },
            touchMove: function(obj, selector, callback) {
                if (typeof selector === "function") {
                    callback = selector;
                    selector = null;
                }
                if (typeof callback === "function") {
                    var istouch = false;
                    pandora.add(obj, 'touchmove', selector, null, function(e) {
                        var touch = e.changedTouches[0];
                        e.pageX = touch.pageX;
                        e.pageY = touch.pageY;
                        return callback.call(this, e, 'touchmove');
                    });
                    pandora.add(obj, 'mousemove', selector, null, click);

                    function click(e) {
                        if (!istouch) {
                            return callback.call(this, e, 'touchmove');
                        };
                    }
                };
            },
            touchEnd: function(obj, selector, callback) {
                if (typeof selector === "function") {
                    callback = selector;
                    selector = null;
                }
                if (typeof callback === "function") {
                    var istouch = false;
                    pandora.add(obj, 'touchend', selector, null, function(e) {
                        var touch = e.changedTouches[0];
                        e.pageX = touch.pageX;
                        e.pageY = touch.pageY;
                        return callback.call(this, e, 'touchend');
                    });
                    pandora.add(obj, 'mouseup', selector, null, click);

                    function click(e) {
                        if (!istouch) {
                            return callback.call(this, e, 'touchend');
                        };
                    }
                };
            },
            swipeLeft: function(obj, callback) {
                var start = {};
                var end = {};
                pandora.touchStart(ojb, function(e) {
                    start = {
                        x: e.pageX,
                        y: e.pageY
                    };
                });
                pandora.touchEnd(obj, function(e) {
                    end = {
                        x: e.pageX,
                        y: e.pageY
                    };
                    e.start = start;
                    e.end = end;
                    if (end.x > start.x + 10) {
                        return callback.call(this, e, 'swipeLeft');
                    };
                });
            },
            swipeRight: function(obj, callback) {
                var start = {};
                var end = {};
                pandora.touchStart(ojb, function(e) {
                    start = {
                        x: e.pageX,
                        y: e.pageY
                    };
                });
                pandora.touchEnd(obj, function(e) {
                    end = {
                        x: e.pageX,
                        y: e.pageY
                    };
                    e.start = start;
                    e.end = end;
                    if (end.x < start.x + 10) {
                        return callback.call(this, e, 'swipeRight');
                    };
                });
            },
            swipe: function(obj, callback) {
                var start = {};
                var end = {};
                pandora.touchStart(ojb, function(e) {
                    start = {
                        x: e.pageX,
                        y: e.pageY
                    };
                });
                pandora.touchEnd(obj, function(e) {
                    end = {
                        x: e.pageX,
                        y: e.pageY
                    };
                    e.start = start;
                    e.end = end;
                    if (end.x > start.x + 10) {
                        return callback.call(this, e, 'swipe');
                    }
                    if (end.x < start.x + 10) {
                        return callback.call(this, e, 'swipe');
                    }
                    if (end.y > start.y + 10) {
                        return callback.call(this, e, 'swipe');
                    }
                    if (end.y < start.y + 10) {
                        return callback.call(this, e, 'swipe');
                    };
                });
            }
        });
        module.exports = this;
        return {
            getStyle: getStyle,
            setStyle: setStyle,
            getSize: getSize,
            getWidth: getWidth,
            getHeight: getHeight,
            set: set,
            hasAttr: hasAttr,
            setAttr: setAttr,
            getAttr: getAttr,
            removeAttr: removeAttr,
            setData: setData,
            getData: getData,
            matches: matches,
            hasClass: hasClass,
            toggleClass: toggleClass,
            addClass: addClass,
            removeClass: removeClass,
            fragment: fragment,
            create: create,
            createByString: createByString,
            build: build,
            append: append,
            before: before,
            after: after,
            index: index
        }
    });

});
//# sourceMappingURL=dom.js.map