let insertAfter = (elem, target) {
    var parent = target.parentNode;
    if (parent.lastChild == target) {
        parent.appendChild(elem);
    } else {
        parent.insertBefore(elem, target.nextSibling);
    }
    return elem;
};

public
fragment = (tagName) {
    return doc.createDocumentFragment(tagName);
},

create = (tagName, context, attribute) {
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
                    $..setStyle(Element, attribute[i]);
                } else if ((i == 'value') && (tagName === 'input' || tagName === 'textarea')) {
                    $..value = attribute[i];
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

createByString = (string, target) {
    var parentNodeTagName, parentNode, node;
    if (!target || target.nodeType != 1) {
        target = $..fragment('div');
    }
    if (/^<tr>[\s\S]*<\/tr>$/i.test(string)) {
        parentNodeTagName = 'tbody';
    } else if (/^<td>[\s\S]*<\/td>$/i.test(string)) {
        parentNodeTagName = 'tr';
    } else {
        parentNodeTagName = 'div';
    }
    parentNode = $..create(parentNodeTagName, false, { html: string });
    node = parentNode.childNodes[0];
    while (node) {
        target.appendChild(node);
        node = parentNode.childNodes[0];
    }
    return target.childNodes;
},

build = (str) {
    if (_.util.type(str) === 'Element') {
        return [str];
    }
    if (_.util.type(str) === 'String') {
        return $..createByString(str);
    }
    return [null];
},

append = (target, content) {
    if (_.util.type(content) == 'Element') {
        target.appendChild(content);
    } else if (_.util.type(content) == 'String') {
        target.innerHTML = target.innerHTML + content;
    }
    return this;
},

before = (elem, content) {
    var parent = elem.parentNode;
    var newEls = $..build(content);
    each(newEls as newElem ){
        if (_.util.type(newElem, true) == 'Element') {
            parent.insertBefore(newElem, elem);
        }
    }
    return this;
},

after = (elem, content) {
    var newEls, curEl;
    newEls = $..build(content);
    curEl = elem;
    each(newEls as newElem) {
        if (_.util.type(newElem, true) === 'Element') {
            curEl = insertAfter(newElem, curEl);
        }
    }
    return this;
},

index = (elem, list) {
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
};