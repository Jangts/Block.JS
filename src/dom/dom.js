/*!
 * tangram.js framework source code
 *
 * static dom
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/arr/',
    '$_/dom/query/',
    '$_/dom/Events'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        query = _.dom.sizzle || _.dom.query;

    // 注册_.dom命名空间到pandora
    _('dom');

    var getParentNodes = function(node, containSelf) {
            if (containSelf) {
                var nodes = [node];
            } else {
                var nodes = [];
            }
            node = node.parentNode;
            while (node != undefined && node != null) {
                nodes.push(node);
                node = node.parentNode;
            }
            return nodes;
        },

        getClosestParent = function(node, tagName, containSelf) {
            var tagName = tagName.toUpperCase();
            if (!containSelf) {
                node = node.parentNode;
            }
            while (node != undefined && node != null) {
                if (node.tagName === tagName) {
                    return node;
                }
                node = node.parentNode;
            }
            return null;
        },

        unCSSStyle = {
            scrollHeight: 'scrollHeight',
            scrollLeft: 'scrollLeft',
            scrollTop: 'scrollTop',
            scrollWidth: 'scrollWidth',
            offsetHeight: 'offsetHeight',
            offsetLeft: 'offsetLeft',
            offsetTop: 'offsetTop',
            offsetWidth: 'offsetWidth'
        },

        getStyle = function(elem, property) {
            if (elem == global || elem == doc) {
                elem = doc.documentElement || doc.body;
            }
            if (property) {
                attr = property.replace(/(\-([a-z]){1})/g,
                    function() {
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
        },

        computedStyle = function(elem, property) {
            var style = {};
            var currentStyle = elem.currentStyle || {};
            var prop;
            if (property) {
                attr = property.replace(/(\-([a-z]){1})/g,
                    function() {
                        return arguments[2].toUpperCase();
                    });
                prop = property.replace(/[A-Z]/g,
                    function(s) {
                        return '-' + s.toLowerCase();
                    });
                return currentStyle[attr] || currentStyle[prop];
            } else {
                for (var key in currentStyle) {
                    key = key.replace(/(\-([a-z]){1})/g,
                        function() {
                            return arguments[2].toUpperCase();
                        });
                    prop = key.replace(/[A-Z]/g,
                        function(s) {
                            return '-' + s.toLowerCase();
                        });
                    style[key] = currentStyle[key];
                    style[prop] = currentStyle[key];
                }
                style.styleFloat = style.cssFloat;
                return style;
            }
        },

        setStyle = function(elem, property, value) {
            if (arguments.length === 2) {
                if (typeof property === 'string') {
                    elem.style.cssText = property;
                } else if (typeof property === 'object') {
                    _.each(property, function(prop, val) {
                        elem.style.prop = val;
                    });
                }
                return;
            }
            if (elem) {
                if (elem == global || elem == global.document) {
                    elem = doc.documentElement || doc.body;
                }
                attr = property.replace(/(\-([a-z]){1})/g,
                    function() {
                        return arguments[2].toUpperCase();
                    });
                prop = property.replace(/[A-Z]/g,
                    function(s) {
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
                        break;
                    case 'z-index':
                        elem.style[attr] = value;
                        break;
                    default:
                        value = (typeof value == 'number' || (typeof value == 'string' && /^[-\+]?[\d\.]+$/.test(value))) ? value + "px" : value;
                        elem.style[property] = value;
                        break;
                }
                return value;
            } else {
                _.debug('Cannot set style for null.');
            }
        },

        getSize = function(elem, type) {
            if (elem == window) {
                return {
                    width: doc.documentElement.clientWidth,
                    height: doc.documentElement.clientHeight
                }
            } else if (elem == document) {
                return {
                    width: Math.max.apply(null, [doc.documentElement.scrollWidth + doc.documentElement.offsetLeft, doc.documentElement.clientWidth]),
                    height: Math.max.apply(null, [doc.documentElement.scrollHeight + doc.documentElement.offsetTop, doc.documentElement.clientHeight])
                }
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
                        var container = elem.parentNode,
                            gapx = parseInt(getStyle(container, 'padding-left')) + parseInt(getStyle(container, 'padding-right')),
                            gapy = parseInt(getStyle(container, 'padding-bottom')) + parseInt(getStyle(container, 'padding-top'));
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
            }
        },

        matches = Element.prototype.matches ||
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        },

        hasClass = function(elem, className) {
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
        },

        toggleClass = function(elem, className, switchType) {
            if (hasClass(elem, className) && switchType !== true) {
                var exprs = [new RegExp('(^' + className + '$|^' + className + '\\s+|\\s+' + className + '$)'), new RegExp('\\s+' + className + '\\s')];
                elem.className = elem.className.replace(exprs[0], '').replace(exprs[1], ' ');
            } else if (!hasClass(elem, className) && switchType !== false) {
                elem.className = elem.className === '' ? className : elem.className + ' ' + className;
            }
        },
        insertAfter = function(elem, target) {
            var parent = target.parentNode;
            if (parent.lastChild == target) {
                parent.appendChild(elem);
            } else {
                parent.insertBefore(elem, target.nextSibling);
            }
            return elem;
        };

    _.extend(_.dom, {
        selector: function(selector, context) {
            context = context || document;
            var Elements = [];
            switch (typeof(selector)) {
                case 'string':
                    return query(selector, context);
                case 'object':
                    switch (_.util.type(selector)) {
                        case 'HTMLDocument':
                        case 'Global':
                        case 'Element':
                            Elements.push(arguments[0]);
                            return Elements;
                        case 'Object':
                            return _.dom.query.byAttr(selector);
                        case 'Elements':
                            return arguments[0];
                        case 'Array':
                            for (var i = 0; i < arguments[0].length; i++) {
                                _.util.type(arguments[0][i]) == 'Element' && Elements.push(arguments[0][i]);
                            }
                            return Elements;
                    }
                    break;
            }
        },
        byName: function(name, context) {
            context = context || document;
            return context.getElementsByName(name);
        }
    });

    _.extend(_.dom, {
        cache: function(elem) {
            if (elem) {
                return elem.BID = elem.BID || cache.save({});
            }
        }
    });

    _.extend(_.dom, {
        contain: _.dom.hasChildNode,
        getParentNodes: getParentNodes,
        closest: getClosestParent
    });

    _.extend(_.dom, {
        getStyle: getStyle,
        setStyle: function(elem) {
            switch (typeof arguments[1]) {
                case 'string':
                    setStyle(elem, arguments[1], arguments[2]);
                    break;
                case 'object':
                    for (var k in arguments[1]) {
                        setStyle(elem, k, arguments[1][k]);
                    }
                    break;
            }
        },
        getSize: getSize,
        getWidth: function(elem, type) {
            return getSize(elem, type).width;
        },
        getHeight: function(elem, type) {
            return getSize(elem, type).height;
        }
    });

    _.extend(_.dom, {
        set: function(elem, name, value) {
            switch (name) {
                case 'style':
                    elem.style.cssText = value;
                    break
                case 'value':
                    var tagName = elem.tagName || '';
                    tagName = tagName.toLowerCase();
                    if (tagName === 'input' || tagName === 'textarea') {
                        elem.value = value;
                    } else {
                        elem.setAttribute(name, value);
                    }
                    break
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
                    break
            }
            return value;
        },
        hasAttr: function(elem, attr) {
            return elem.hasAttribute(attr);
        },
        setAttr: function(elem, name, value) {
            elem.setAttribute(name, value);
            return value;
        },
        getAttr: function(elem, attr) {
            return elem.getAttribute(attr);
        },
        removeAttr: function(elem, attr) {
            elem.removeAttribute(attr);
        },
        setData: function(elem, dataName, data) {
            if (elem.dataset) {
                dataName = dataName.replace(/-[a-z]/g,
                    function(s) {
                        return s.replace('-', '').toUpperCase();
                    });
                elem.dataset[dataName] = data;
            } else {
                attr = 'data-' + dataName.replace(/[A-Z]/g, function(s) {
                    return '-' + s.toLowerCase();
                });
                elem.getAttribute(attr, data);
            }
        },
        getData: function(elem, dataName) {
            if (elem.dataset) {
                dataName = dataName.replace(/-[a-z]/g,
                    function(s) {
                        return s.replace('-', '').toUpperCase();
                    });
                return elem.dataset[dataName];
            } else {
                attr = 'data-' + dataName.replace(/[A-Z]/g,
                    function(s) {
                        return '-' + s.toLowerCase();
                    });
                return elem.getAttribute(attr);
            }
        }
    });

    _.extend(_.dom, {
        matches: function(elem, selectorString) {
            matches.call(elem, selectorString);
        },
        hasClass: hasClass,
        toggleClass: toggleClass,
        addClass: function(elem, className) {
            toggleClass(elem, className, true);
            return this;
        },
        removeClass: function(elem, className) {
            toggleClass(elem, className, false);
            return this;
        }
    });

    _.extend(_.dom, {
        fragment: function(tagName) {
            return doc.createDocumentFragment(tagName);
        },
        create: function(tagName, context, attribute) {
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
                        break;
                    case 'img':
                        var Element = new Image();
                        break;
                    default:
                        var Element = doc.createElement(tagName);
                }
                if (attribute) {
                    for (var i in attribute) {
                        if (i == 'style') {
                            _.dom.setStyle(Element, attribute[i]);
                        } else if ((i == 'value') && (tagName === 'input' || tagName === 'textarea')) {
                            _.dom.value = attribute[i];
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
                if (context)
                    context.appendChild(Element);
                return Element;
            }
        },
        createByString: function(string, target) {
            var parentNodeTagName, parentNode, node;
            if (!target || target.nodeType != 1) {
                target = _.dom.fragment('div');
            }
            if (/^<tr>[\s\S]*<\/tr>$/i.test(string)) {
                parentNodeTagName = 'tbody';
            } else if (/^<td>[\s\S]*<\/td>$/i.test(string)) {
                parentNodeTagName = 'tr';
            } else {
                parentNodeTagName = 'div';
            }
            parentNode = _.dom.create(parentNodeTagName, false, { html: string });
            node = parentNode.childNodes[0];
            while (node) {
                target.appendChild(node);
                node = parentNode.childNodes[0];
            }
            return target.childNodes;
        },
        build: function(str) {
            if (_.util.type(str) === 'Element') {
                return [str];
            }
            if (_.util.type(str) === 'String') {
                return _.dom.createByString(str);
            }
            return [null];
        },
        append: function(target, content) {
            if (_.util.type(content) == 'Element') {
                target.appendChild(content);
            } else if (_.util.type(content) == 'String') {
                target.innerHTML = target.innerHTML + content;
            }
            return this;
        },
        before: function(elem, content) {
            var parent = elem.parentNode;
            var newEls = _.dom.build(content);
            _.each(newEls, function() {
                if (_.util.type(this, true) == 'Element') {
                    parent.insertBefore(this, elem);
                }
            });
            return this;
        },
        after: function(elem, content) {
            var newEls, curEl;
            newEls = _.dom.build(content);
            curEl = elem;
            _.each(newEls, function() {
                if (_.util.type(this, true) === 'Element') {
                    curEl = insertAfter(this, curEl);
                }
            });
            return this;
        },
        index: function(elem, list) {
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
    });

    _.extend(_.dom, true, {
        remove: function(elem, context) {
            if (context && _.util.type(context) == 'Element' && elem.parentNode == context) {
                _.dom.events.remove(elem);
                context.removeChild(elem);
            } else if (elem && elem.parentNode && elem.parentNode.removeChild) {
                //console.log(elem);
                _.dom.events.remove(elem);
                elem.parentNode.removeChild(elem);
            }
        },
        events: {
            fire: function(elem, event, eventType) {
                elem.BID && cache.read(elem.BID).Events && cache.read(elem.BID).Events.fire(event, eventType);
                return this;
            },
            add: function(elem, eventType, selector, data, handler) {
                if (elem && handler) {
                    var eleCache = cache.read(_.dom.cache(elem));
                    if (eleCache.Events) {
                        var Events = eleCache.Events;
                    } else {
                        var Events = new _.dom.Events(elem);
                        Events._p.keys.push(_.dom.cache(elem));
                        eleCache.Events = Events;
                    }
                    Events.push(eventType, selector, data, handler);
                }
                return this;
            },
            remove: function(elem, eventType, selector, handler) {
                if (elem.BID && cache.read(elem.BID).Events) {
                    var Events = cache.read(elem.BID).Events;
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
                                elem.BID.Events = undefined;
                                delete elem.BID.Events;
                            }
                        }
                    }
                }
                return this;
            },
            trigger: function(elem, evenType, data) {
                var noEvents = new _.dom.Events();
                for (var k in noEvents._p.keys) {
                    cache.read(noEvents._p.keys[k]).Events.trigger(evenType, elem, data);
                }
                typeof elem[evenType] == 'function' && elem[evenType]();
                return this;
            },
            touch: function (obj, selector, fn) {
                var move;
                var istouch = false;
                if (typeof selector === "function") {
                    fn = selector;
                    selector = null;
                }
                if (typeof fn === "function") {
                    _.dom.events.add(obj, 'touchstart', selector, null, function () {
                        istouch = true;
                    });
                    _.dom.events.add(obj, 'touchmove', selector, null, function (e) {
                        move = true;
                    });
                    _.dom.events.add(obj, 'touchend', selector, null, function (e) {
                        e.preventDefault();
                        if (!move) {
                            var touch = e.changedTouches[0];
                            e.pageX = touch.pageX;
                            e.pageY = touch.pageY;
                            var returnvalue = fn.call(this, e, 'touch');
                            if (returnvalue === false) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }
                        move = false;
                    });
                    _.dom.events.add(obj, 'mousedown', selector, null, click);

                    function click(e) {
                        if (!istouch) {
                            return fn.call(this, e, 'touch');
                        }
                    }
                }
            },
            touchStart: function (obj, selector, fn) {
                if (typeof selector === "function") {
                    fn = selector;
                    selector = null;
                }
                if (typeof fn === "function") {
                    var istouch = false;
                    _.dom.events.add(obj, 'touchstart', selector, null, function (e) {
                        var touch = e.changedTouches[0];
                        e.pageX = touch.pageX;
                        e.pageY = touch.pageY;
                        return fn.call(this, e, 'touchstart');
                    });
                    _.dom.events.add(obj, 'mousedown', selector, null, click);

                    function click(e) {
                        if (!istouch) {
                            return fn.call(this, e);
                        }
                    }
                }
            },
            touchMove: function (obj, selector, fn) {
                if (typeof selector === "function") {
                    fn = selector;
                    selector = null;
                }
                if (typeof fn === "function") {
                    var istouch = false;
                    _.dom.events.add(obj, 'touchmove', selector, null, function (e) {
                        var touch = e.changedTouches[0];
                        e.pageX = touch.pageX;
                        e.pageY = touch.pageY;
                        return fn.call(this, e, 'touchmove');
                    });
                    _.dom.events.add(obj, 'mousemove', selector, null, click);

                    function click(e) {
                        if (!istouch) {
                            return fn.call(this, e, 'touchmove');
                        }
                    }
                }
            },
            touchEnd: function (obj, selector, fn) {
                if (typeof selector === "function") {
                    fn = selector;
                    selector = null;
                }
                if (typeof fn === "function") {
                    var istouch = false;
                    _.dom.events.add(obj, 'touchend', selector, null, function (e) {
                        var touch = e.changedTouches[0];
                        e.pageX = touch.pageX;
                        e.pageY = touch.pageY;
                        return fn.call(this, e, 'touchend');
                    });
                    _.dom.events.add(obj, 'mouseup', selector, null, click);

                    function click(e) {
                        if (!istouch) {
                            return fn.call(this, e, 'touchend');
                        }
                    }
                }
            },
            swipeLeft: function (obj, fn) {
                var start = {},
                    end = {};
                _.dom.events.touchStart(ojb, function (e) {
                    start = {
                        x: e.pageX,
                        y: e.pageY
                    };
                });
                _.dom.events.touchEnd(obj, function (e) {
                    end = {
                        x: e.pageX,
                        y: e.pageY
                    }
                    e.start = start;
                    e.end = end;
                    if (end.x > start.x + 10) {
                        return fn.call(this, e, 'swipeLeft');
                    }
                });
            },
            swipeRight: function (obj, fn) {
                var start = {},
                    end = {};
                _.dom.events.touchStart(ojb, function (e) {
                    start = {
                        x: e.pageX,
                        y: e.pageY
                    };
                });
                _.dom.events.touchEnd(obj, function (e) {
                    end = {
                        x: e.pageX,
                        y: e.pageY
                    }
                    e.start = start;
                    e.end = end;
                    if (end.x < start.x + 10) {
                        return fn.call(this, e, 'swipeRight');
                    }
                });
            },
            swipe: function (obj, fn) {
                var start = {},
                    end = {};
                _.dom.events.touchStart(ojb, function (e) {
                    start = {
                        x: e.pageX,
                        y: e.pageY
                    };
                });
                _.dom.events.touchEnd(obj, function (e) {
                    end = {
                        x: e.pageX,
                        y: e.pageY
                    }
                    e.start = start;
                    e.end = end;
                    if (end.x > start.x + 10) {
                        return fn.call(this, e, 'swipe');
                    }
                    if (end.x < start.x + 10) {
                        return fn.call(this, e, 'swipe');
                    }
                    if (end.y > start.y + 10) {
                        return fn.call(this, e, 'swipe');
                    }
                    if (end.y < start.y + 10) {
                        return fn.call(this, e, 'swipe');
                    }
                });
            }
        }
    });
});