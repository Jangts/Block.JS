let insert = (content, handler) {
    switch (typeof content) {
        case 'string':
            return this.each(() {
                handler(this, content);
            });

        case 'object':
            if (content.nodeType === 1 && this[0]) {
                handler(this[0], content);
                return this;
            }
            if (content.lenth > this.lenth) {
                return this.each((i) {
                    handler(this, content[i]);
                });
            }
            break;

        case 'function':
            return this.each((i) {
                handler(this, content(i));
            });
    }
    return this;
},
sizes = (type, value, handler) {
    switch (typeof value) {
        case 'string':
        case 'number':
            return this.each(() {
                $..setStyle(this, type, value);
            });

        case 'function':
            return this.each((i) {
                $..setStyle(this, type, value(i, $..getStyle(this, type)));
            });

        case 'undefined':
            return this[0] && handler(this[0]);
    }
    return this;
},
scroll_offset = (type, value) {
    if (bool.isNumeric(value)) {
        return this.each(() {
            $..setStyle(this, type, value);
        });
    }
    if (bool.isFn(value)) {
        return this.each((i) {
            $..setStyle(this, type, value(i, $..getStyle(this, type)));
        });
    }
    return this[0] && $..getStyle(this[0], type);
};