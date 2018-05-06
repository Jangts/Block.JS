public
set = (elem, name, value) {
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

hasAttr = (elem, attr) {
    return elem.hasAttribute(attr);
},

setAttr = (elem, name, value) {
    elem.setAttribute(name, value);
    return value;
},

getAttr = (elem, attr) {
    return elem.getAttribute(attr);
},

removeAttr = (elem, attr) {
    elem.removeAttribute(attr);
},

setData = (elem, dataName, data) {
    if (elem.dataset) {
        dataName = dataName.replace(/-[a-z]/g, (s) {
                return s.replace('-', '').toUpperCase();
            });
        elem.dataset[dataName] = data;
    } else {
        attr = 'data-' + dataName.replace(/[A-Z]/g, (s) {
            return '-' + s.toLowerCase();
        });
        elem.getAttribute(attr, data);
    }
},

getData = (elem, dataName) {
    if (elem.dataset) {
        dataName = dataName.replace(/-[a-z]/g, (s) {
                return s.replace('-', '').toUpperCase();
            });
        return elem.dataset[dataName];
    } else {
        attr = 'data-' + dataName.replace(/[A-Z]/g, (s) {
                return '-' + s.toLowerCase();
            });
        return elem.getAttribute(attr);
    }
}
