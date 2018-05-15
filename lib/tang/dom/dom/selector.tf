public
contain =  $..hasChildNode,

selector = (selector, context) {
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
                    return $..selector.byAttr(selector);
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

byName = (name, context) {
    context = context || document;
    return context.getElementsByName(name);
},

getParentNodes = (node, containSelf) {
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

getClosestParent = (node, tagName, containSelf) {
    var tagName = tagName.toUpperCase();
    if (!containSelf) {
        node = node.parentNode;
    
    while (node != undefined && node != null) {
        if (node.tagName === tagName) {
            return node;
        }
        node = node.parentNode;
    }
    return null;
};