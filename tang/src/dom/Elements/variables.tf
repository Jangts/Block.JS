let insert = (content, handler) {
    switch (typeof content) {
        case 'string':
            return this.each(function() {
                handler(this, content);
            });

        case 'object':
            if (content.nodeType === 1 && this[0]) {
                handler(this[0], content);
                return this;
            }
            if (content.lenth > this.lenth) {
                return this.each(function(i) {
                    handler(this, content[i]);
                });
            }
            break;

        case 'function':
            return this.each(function(i) {
                handler(this, content(i));
            });
    }
    return this;
},
sizes = (type, value, handler) {
    switch (typeof value) {
        case 'string':
        case 'number':
            return this.each(function() {
                dom.setStyle(this, type, value);
            });

        case 'function':
            return this.each(function(i) {
                dom.setStyle(this, type, value(i, dom.getStyle(this, type)));
            });

        case 'undefined':
            return this[0] && handler(this[0]);
    }
    return this;
},
scroll_offset = (type, value) {
    if (_.util.bool.isNumeric(value)) {
        return this.each(function() {
            dom.setStyle(this, type, value);
        });
    }
    if (_.util.bool.isFn(value)) {
        return this.each(function(i) {
            dom.setStyle(this, type, value(i, dom.getStyle(this, type)));
        });
    }
    return this[0] && dom.getStyle(this[0], type);
};