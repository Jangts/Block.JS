let unCSSStyle = {
    scrollHeight: 'scrollHeight',
    scrollLeft: 'scrollLeft',
    scrollTop: 'scrollTop',
    scrollWidth: 'scrollWidth',
    offsetHeight: 'offsetHeight',
    offsetLeft: 'offsetLeft',
    offsetTop: 'offsetTop',
    offsetWidth: 'offsetWidth'
},

computedStyle = (elem, property) {
    var style = {};
    var currentStyle = elem.currentStyle || {};
    var prop;
    if (property) {
        attr = property.replace(/(\-([a-z]){1})/g, () {
                return arguments[2].toUpperCase();
            });
        prop = property.replace(/[A-Z]/g, (s) {
                return '-' + s.toLowerCase();
            });
        return currentStyle[attr] || currentStyle[prop];
    } else {
        for (var key in currentStyle) {
            key = key.replace(/(\-([a-z]){1})/g, () {
                    return arguments[2].toUpperCase();
                });
            prop = key.replace(/[A-Z]/g, (s) {
                    return '-' + s.toLowerCase();
                });
            style[key] = currentStyle[key];
            style[prop] = currentStyle[key];
            // log a;
        }
        style.styleFloat = style.cssFloat;
        return style;
    }
},

_setStyle = (elem, property, value) {
    if (arguments.length === 2) {
        if (typeof property === 'string') {
            elem.style.cssText = property;
        } else if (typeof property === 'object') {
            each(property as prop, val) {
                elem.style.prop = val;
            }
        }
        return;
    }
    if (elem) {
        if (elem == root || elem == root.document) {
            elem = doc.documentElement || doc.body;
        }
        attr = property.replace(/(\-([a-z]){1})/g, () {
                return arguments[2].toUpperCase();
            });
        prop = property.replace(/[A-Z]/g, (s) {
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
            // log value;
                value = (typeof value == 'number' || (typeof value == 'string' && /^[-\+]?[\d\.]+$/.test(value))) ? value + "px" : value;
                elem.style[property] = value;
                break;
        }
        return value;
    } else {
        _.debug('Cannot set style for null.');
    }
};

public
getStyle = (elem, property) {
    if (elem == root || elem == doc) {
        elem = doc.documentElement || doc.body;
    }
    if (property) {
        attr = property.replace(/(\-([a-z]){1})/g, () {
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

setStyle = (elem) {
    switch (typeof arguments[1]) {
        case 'string':
            _setStyle(elem, arguments[1], arguments[2]);
            break;
        case 'object':
            for (var k in arguments[1]) {
                _setStyle(elem, k, arguments[1][k]);
            }
            break;
    }
},

getSize = (elem, type) {
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

getWidth =  (elem, type) {
    return getSize(elem, type).width;
},

getHeight = (elem, type) {
    return getSize(elem, type).height;
};