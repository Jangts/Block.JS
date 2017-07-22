/*!
 * Block.JS Framework Source Code
 *
 * class Elements
 *
 * Date: 2017-04-06
 */
;
block([
    '$_/util/bool.xtd',
    '$_/dom/Query.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker;

    var insert = function(content, handler) {
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
        sizes = function(type, value, handler) {
            switch (typeof value) {
                case 'string':
                case 'number':
                    return this.each(function() {
                        _.dom.setStyle(this, type, value);
                    });

                case 'function':
                    return this.each(function(i) {
                        _.dom.setStyle(this, type, value(i, _.dom.getStyle(this, type)));
                    });

                case 'undefined':
                    return this[0] && handler(this[0]);
            }
            return this;
        },
        scroll_offset = function(type, value) {
            if (_.util.bool.isNumeric(value)) {
                return this.each(function() {
                    _.dom.setStyle(this, type, value);
                });
            }
            if (_.util.bool.isFn(value)) {
                return this.each(function(i) {
                    _.dom.setStyle(this, type, value(i, _.dom.getStyle(this, type)));
                });
            }
            return this[0] && _.dom.getStyle(this[0], type);
        };

    // Declare Class 'Elements' Extends 'Query'
    declare('dom.Elements', _.dom.Query, {
        _init: function(selector, context) {
            if (_.util.bool.isOuterHTML(selector)) {
                this.isElFragment = true;
                this.context = context || this.context;
                Elements = _.dom.createByString(this.selector = selector);
                for (var i = 0; i < Elements.length; i++) {
                    this.push(Elements[i]);
                }
            } else {
                this._parent._init.call(this, selector, context);
            }
        },
        is: function(tagName, screen) {
            switch (typeof tagName) {
                case 'string':
                    tagName = tagName.toUpperCase();
                    switch (typeof screen) {
                        case 'boolean':
                            if (screen) {
                                var list = [];
                                this.each(function() {
                                    if (this.tagName.toUpperCase() === tagName) {
                                        list.push(this)
                                    }
                                });
                                return list;
                            }
                            for (var i = 0; i < this.length; i++) {
                                if (this.tagName.toUpperCase() !== tagName) {
                                    return false;
                                }
                            }
                            return true;

                        case 'number':
                            if (this[screen]) {
                                return this[screen].tagName.toUpperCase() === tagName ? true : false;
                            }
                            return false;
                    }
                    return this[0] && ((this[0].tagName.toUpperCase() === tagName) ? true : false);

                case 'boolean':
                    if (tagName) {
                        var list = [];
                        this.each(function() {
                            list.push(this.tagName.toUpperCase())
                        });
                        return list;
                    }
                    break;

                case 'number':
                    return this[tagName] && this[tagName].tagName.toUpperCase();
            }
            return this[0] && this[0].tagName.toUpperCase();
        },
        append: function(content) {
            switch (typeof content) {
                case 'string':
                    return this.each(function() {
                        this.innerHTML += content;
                    });

                case 'function':
                    return this.each(function(i) {
                        this.innerHTML += content(i, this.innerHTML);
                    });

                case 'object':
                    if (content.nodeType == 1) {
                        if (this[0]) {
                            this[0].appendChild(content);;
                        }
                    }
            }
            return this;
        },
        appendTo: function(selector) {
            var parents = new _.dom.Elements(selector);
            //console.log(selector, parents, this.isElFragment);
            if (this.isElFragment) {
                var Elements,
                    that = this;
                that.length = 0;
                parents.each(function(i, parent) {
                    console.log(parent);
                    Elements = _.dom.createByString(that.selector, parent);
                    for (var i = 0; i < Elements.length; i++) {
                        that.push(Elements[i]);
                    }
                });
                return this;
            }
            if (parents.length == 1) {
                var node = this[0];
                while (node) {
                    parents[0].appendChild(node);
                    node = this[0];
                }
                return this;
            }
            return this;
        },
        remove: function() {
            this.each(function() {
                _.dom.remove(this);
            });
            return null;
        },
        before: function(content) {
            return insert.call(this, content, _.dom.before);
        },
        after: function(content) {
            return insert.call(this, content, _.dom.after);
        },
        index: function(list) {
            if (_.util.type.isElement(list)) {
                return _.dom.index(list, this);
            }
            return _.dom.index(this[0], list);
        },
        parent: function() {
            var nodes = [];
            this.each(function() {
                nodes.push(this.parentNode);
            });
            return new _.dom.Elements(_.util.arr.unique(nodes));
        }
    });

    //Extend Public Static Methods 'query' For 'dom'
    _.extend(_.dom, true, {
        select: function(selector, context) {
            return new _.dom.Elements(selector, context);
        }
    });

    //Extend Public Static Methods 'extend' For 'dom/query'
    _.extend(_.dom.select, {
        extend: function(object, rewrite) {
            _.extend(_.dom.Elements.prototype, rewrite, object);
        }
    });

    //Extend Attributes APIs To 'Elements'
    _.dom.select.extend({
        attr: function(attr, value) {
            switch (typeof value) {
                case 'string':
                    return this.each(function() {
                        _.dom.setAttr(this, attr, value)
                    });

                case 'function':
                    return this.each(function(i) {
                        _.dom.setAttr(this, attr, value(i, _.dom.getAttr(this, attr)))
                    });

                case 'undefined':
                    return this[0] && _.dom.getAttr(this[0], attr);
            }
            this;
        },
        removeAttr: function(attr) {
            if (typeof attr == 'string') {
                this.each(function() {
                    _.dom.removeAttr(this, attr)
                });
            }
            return this;
        },
        data: function(dataName, data) {
            switch (typeof data) {
                case 'string':
                case 'number':
                    this.each(function(index) {
                        _.dom.setData(this, dataName, _.util.bool.isFn(data) ? data.call(this, index) : data)
                    });
                    break;
                case 'function':
                    return this.each(function(i) {
                        _.dom.setData(this, attr, data(i, _.dom.getAttr(this, dataName)))
                    });
                case 'undefined':
                    return this[0] && _.dom.getData(this[0], dataName);
            }
            return this;
        },
        html: function(nodeString) {
            switch (typeof nodeString) {
                case 'string':
                case 'number':
                    return this.each(function() {
                        this.innerHTML = nodeString;
                    });
                case 'function':
                    this.each(function(i) {
                        this.innerHTML = nodeString(i, this.innerHTML);
                    });
                case 'undefined':
                    return this[0] ? this[0].innerHTML : '';
            }
            return this;
        },
        hasClass: function(className) {
            return this[0] && _.dom.hasClass(this[0], className);
        },
        toggleClass: function(className, isSwitch) {
            switch (typeof className) {
                case 'string':
                    this.each(function() {
                        _.dom.toggleClass(this, className, isSwitch);
                    });
                    break;
                case 'function':
                    this.each(function(i, el) {
                        _.dom.toggleClass(this, className(i, _.dom.getAttr(el, 'class')), isSwitch);
                    });
                    break;
                case 'boolean':
                    if (className === false) {
                        this.each(function(i, el) {
                            _.dom.setAttr(this, 'class', '');
                        });
                    }
                    break;
            }
            return this;
        },
        addClass: function(className) {
            return this.toggleClass(className, true);

        },
        removeClass: function(className) {
            return this.toggleClass(className, false);
        }
    });

    //Extend CSS APIs To 'Elements'
    _.dom.select.extend({
        css: function(style, value) {
            if (typeof style === 'object') {
                this.each(function() {
                    _.each(style, function(prop, value) {
                        _.dom.setStyle(this, prop, value);
                    }, this);
                });
            } else {
                switch (typeof value) {
                    case 'string':
                    case 'number':
                        return this.each(function() {
                            _.dom.setStyle(this, style, value);
                        });

                    case 'function':
                        return this.each(function(i) {
                            _.dom.setStyle(this, style, value(i, _.dom.getStyle(this, style)));
                        });
                    case 'undefined':
                        if (typeof style === 'string') {
                            return this[0] && _.dom.getStyle(this[0], style);
                        }
                }
            }
            return this;
        },
        width: function(value) {
            return sizes.call(this, 'width', value, _.dom.getWidth);
        },
        outerWidth: function(includeMargin) {
            if (includeMargin) {
                return this[0] && _.dom.getWidth(this[0], 'box');
            }
            return this[0] && _.dom.getWidth(this[0], 'outer');
        },
        innerWidth: function() {
            return this[0] && _.dom.getWidth(this[0], 'inner');
        },
        height: function(value) {
            return sizes.call(this, 'height', value, _.dom.getHeight);
        },
        outerHeight: function(includeMargin) {
            if (includeMargin) {
                return this[0] && _.dom.getHeight(this[0], 'box');
            }
            return this[0] && _.dom.getHeight(this[0], 'outer');
        },
        innerHeight: function(includeMargin) {
            return this[0] && _.dom.getHeight(this[0], 'inner');
        },
        scrollHeight: function(value) {
            return scroll_offset.call(this, 'scrollHeight', value);
        },
        scrollLeft: function(value) {
            return scroll_offset.call(this, 'scrollLeft', value);
        },
        scrollTop: function(value) {
            return scroll_offset.call(this, 'scrollTop', value);
        },
        scrollWidth: function(value) {
            return scroll_offset.call(this, 'scrollWidth', value);
        },
        offsetHeight: function(value) {
            return scroll_offset.call(this, 'offsetHeight', value);
        },
        offsetLeft: function(value) {
            return scroll_offset.call(this, 'offsetLeft', value);
        },
        offsetTop: function(value) {
            return scroll_offset.call(this, 'offsetTop', value);
        },
        offsetWidth: function(value) {
            return scroll_offset.call(this, 'offsetWidth', value);
        },
        offset: function(value) {
            if (value) {
                switch (typeof value) {
                    case 'object':
                        return this.each(function() {
                            _.dom.setStyle(this, 'offsetTop', value.top);
                            _.dom.setStyle(this, 'offsetLeft', value.left);
                        });

                    case 'function':
                        return this.each(function(i) {
                            var style = _.dom.getStyle(this);
                            _.dom.setStyle(this, 'offsetTop', value(i, style.offsetTop));
                            _.dom.setStyle(this, 'offsetLeft', value(i, style.offsetLeft));
                        });

                }
            }
            var style = this[0] ? _.dom.getStyle(this[0]) : {
                offsetTop: null,
                offsetLeft: null
            };
            return {
                top: style.offsetTop,
                left: style.offsetLeft
            }
        },
        widths: function() {
            var width = 0;
            this.each(function() {
                width += _.dom.getWidth(this, 'box');
            });
            return width;
        },
        heights: function() {
            var height = 0;
            this.each(function() {
                height += _.dom.getHeight(this, 'box');
            });
            return height;
        },
        show: function() {
            this.each(function() {
                _.dom.setStyle(this, 'display', 'block');
            });
            return this;
        },
        hide: function() {
            this.each(function() {
                _.dom.setStyle(this, 'display', 'none');
            })
            return this;
        }
    });

    //Extend Events APIs To 'Elements'
    _.dom.select.extend({
        on: function(eventType, selector, data, handler) {
            switch (arguments.length) {
                case 3:
                    handler = _.util.bool.isFn(data) ? data : undefined;
                    data = null;
                    break;
                case 2:
                    handler = _.util.bool.isFn(selector) ? selector : undefined;
                    selector = null;
                    data = null;
                    break;
            };
            this.each(function() {
                _.dom.events.add(this, eventType, selector, data, handler);
            });
            return this;
        },
        off: function(eventType, selector, handler) {
            this.each(function() {
                _.dom.events.remove(this, eventType, selector, handler);
            });
            return this;
        },
        trigger: function(eventType, data) {
            this.each(function() {
                _.dom.events.trigger(this, eventType, data);
            });
            return this;
        },
        bind: function(eventType, data, handler) {
            if (arguments.length == 2) {
                handler = _.util.bool.isFn(data) ? data : undefined;
                data = undefined;
            }
            return this.on(eventType, null, data, handler);
        },
        unbind: function(eventType, handler) {
            return this.off(eventType, null, handler);
        },
        mouseover: function(data, handler) {
            return this.bind('mouseover', data, handler);
        },
        mouseout: function(data, handler) {
            return this.bind('mouseout', data, handler);
        },
        hover: function(overCallback, outCallback) {
            return this.mouseover(overCallback).mouseout(outCallback || overCallback);
        },
        mousedown: function(data, handler) {
            return this.bind('mousedown', data, handler);
        },
        mouseup: function(data, handler) {
            return this.bind('mouseup', data, handler);
        },
        mousemove: function(data, handler) {
            this.bind('mousemove', data, handler);
        },
        'click': function(data, handler) {
            if (_.util.bool.isFn(handler)) {
                return this.bind('click', data, handler);
            }
            if (_.util.bool.isFn(data)) {
                return this.bind('click', data);
            }
            return this.trigger('click');
        },
        'focus': function(data, handler) {
            if (_.util.bool.isFn(handler)) {
                return this.bind('focus', data, handler);
            }
            if (_.util.bool.isFn(data)) {
                return this.bind('focus', data);
            }
            return this.trigger('focus');
        },
        'blur': function(data, handler) {
            if (_.util.bool.isFn(handler)) {
                return this.bind('blur', data, handler);
            }
            if (_.util.bool.isFn(data)) {
                return this.bind('blur', data);
            }
            return this.trigger('blur');
        },
        'submit': function(data, handler) {
            if (_.util.bool.isFn(handler)) {
                return this.bind('submit', data, handler);
            }
            if (_.util.bool.isFn(data)) {
                return this.bind('submit', data);
            }
            return this.trigger('submit');
        }
    });

    _('dom.$', _.dom.select);
});