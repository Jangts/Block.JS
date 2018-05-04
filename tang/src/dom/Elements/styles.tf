//Expends CSS APIs To 'Elements'

expands .Elements {
    css (style, value) {
        if (typeof style === 'object') {
            this.each(function() {
                each(style as prop, value) {
                    dom.setStyle(this, prop, value);
                }
            });
        } else {
            switch (typeof value) {
                case 'string':
                case 'number':
                    return this.each(function() {
                        dom.setStyle(this, style, value);
                    });

                case 'function':
                    return this.each(function(i) {
                        dom.setStyle(this, style, value(i, dom.getStyle(this, style)));
                    });
                case 'undefined':
                    if (typeof style === 'string') {
                        return this[0] && dom.getStyle(this[0], style);
                    }
            }
        }
        return this;
    }
    width (value) {
        return sizes.call(this, 'width', value, dom.getWidth);
    }
    outerWidth (includeMargin) {
        if (includeMargin) {
            return this[0] && dom.getWidth(this[0], 'box');
        }
        return this[0] && dom.getWidth(this[0], 'outer');
    }
    innerWidth () {
        return this[0] && dom.getWidth(this[0], 'inner');
    }
    height (value) {
        return sizes.call(this, 'height', value, dom.getHeight);
    }
    outerHeight (includeMargin) {
        if (includeMargin) {
            return this[0] && dom.getHeight(this[0], 'box');
        }
        return this[0] && dom.getHeight(this[0], 'outer');
    }
    innerHeight (includeMargin) {
        return this[0] && dom.getHeight(this[0], 'inner');
    }
    scrollHeight (value) {
        return scroll_offset.call(this, 'scrollHeight', value);
    }
    scrollLeft (value) {
        return scroll_offset.call(this, 'scrollLeft', value);
    }
    scrollTop (value) {
        return scroll_offset.call(this, 'scrollTop', value);
    }
    scrollWidth (value) {
        return scroll_offset.call(this, 'scrollWidth', value);
    }
    offsetHeight (value) {
        return scroll_offset.call(this, 'offsetHeight', value);
    }
    offsetLeft (value) {
        return scroll_offset.call(this, 'offsetLeft', value);
    }
    offsetTop (value) {
        return scroll_offset.call(this, 'offsetTop', value);
    }
    offsetWidth (value) {
        return scroll_offset.call(this, 'offsetWidth', value);
    }
    offset (value) {
        if (value) {
            switch (typeof value) {
                case 'object':
                    return this.each(function() {
                        dom.setStyle(this, 'offsetTop', value.top);
                        dom.setStyle(this, 'offsetLeft', value.left);
                    });

                case 'function':
                    return this.each(function(i) {
                        var style = dom.getStyle(this);
                        dom.setStyle(this, 'offsetTop', value(i, style.offsetTop));
                        dom.setStyle(this, 'offsetLeft', value(i, style.offsetLeft));
                    });

            }
        }
        var style = this[0] ? dom.getStyle(this[0]) : {
            offsetTop: null,
            offsetLeft: null
        };
        return {
            top: style.offsetTop,
            left: style.offsetLeft
        }
    }
    widths () {
        var width = 0;
        this.each(function() {
            width += dom.getWidth(this, 'box');
        });
        return width;
    }
    heights () {
        var height = 0;
        this.each(function() {
            height += dom.getHeight(this, 'box');
        });
        return height;
    }
    show () {
        this.each(function() {
            dom.setStyle(this, 'display', 'block');
        });
        return this;
    }
    hide () {
        this.each(function() {
            dom.setStyle(this, 'display', 'none');
        })
        return this;
    }
}