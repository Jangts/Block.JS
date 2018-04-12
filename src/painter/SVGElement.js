/*!
 * tangram.js framework source code
 *
 * class SVG
 *
 * Date: 2017-04-06
 */

tangram.block([
    '$_/util/type',
    '$_/util/bool',
    '$_/dom/Events'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console;


    declare('painter.SVGElement', {
        _init: function(type, data, target) {
            var types = ['svg', 'rect', 'circle', 'eliipse', 'line', 'path', 'g', 'text', 'tspan', 'defs', 'use', 'textpath', 'linearGradient', 'radialGradient', 'stop'];
            if (!type || types.indexOf(type) == -1) {
                type = 'svg';
            }
            type = type || 'svg';
            this.Element = doc.createElementNS('http://www.w3.org/2000/svg', type);
            if (_.util.type(data) === 'Object') {
                _.each(data, function(attr, value) {
                    this.attr(attr, value);
                }, this);
            }
            if (_.util.bool.isEl(target)) {
                this.target = target;
                this.target.appendChild(this.Element);
            }
        },
        attr: function(attr, value) {
            if (attr.match(/^xlink:/i)) {
                this.Element.setAttributeNS('http://www.w3.org/1999/xlink', attr, value);
            } else {
                if (attr == 'styles') {
                    _.each(value, function(attr, val) {
                        this.css(attr, val);
                    }, this);
                } else {
                    this.Element.setAttribute(attr, value);
                }
            }
            return this;
        },
        css: function(attr, value) {
            _.dom.setStyle(this.Element, attr, value);
            return this;
        },
        fire: function(elem, event, eventType) {
            this.Events && this.Events.fire(event, eventType);
            return this;
        },
        on: function(eventType, selector, data, handler) {
            switch (arguments.length) {
                case 3:
                    handler = _.util.bool.isFn(data) ? data : undefined;
                    data = null;
                    break;
                case 2:
                    handler = _.util.bool.isFn(selector) ? data : undefined;
                    selector = null;
                    data = null;
                    break;
            };
            if (this.Element && handler) {
                if (!this.Events) {
                    this.Events = new _.dom.Events(this.Element);
                }
                this.Events.push(eventType, selector, data, handler);
            }
            return this;
        },
        off: function(elem, eventType, selector, handler) {
            if (this.Events) {
                if (handler) {
                    this.Events.removeHandler(eventType, selector, handler);
                } else {
                    if (eventType && typeof selector != 'undefined') {
                        this.Events.removeSelector(eventType, selector);
                    } else {
                        if (eventType) {
                            this.Events.removeType(eventType);
                        } else {
                            this.Events.remove();
                        }
                    }
                }
            }
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
        hover: function(overCallback, outCallback) {
            return this.on('mouseover', null, null, overCallback).on('mouseout', null, null, outCallback || overCallback);
        },
    });
});