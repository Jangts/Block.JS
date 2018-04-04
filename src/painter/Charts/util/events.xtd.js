/*!
 * tangram.js framework source code
 *
 * extend_static_methods painter/Charts/util
 *
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/util/arr.xtd',
    '$_/dom/',
    '$_/painter/Charts/Charts.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console;

    var getRelativePosition = function(evt) {
            var mouseX, mouseY;
            var e = evt.originalEvent || evt,
                canvas = evt.currentTarget || evt.srcElement,
                boundingRect = canvas.getBoundingClientRect();

            if (e.touches) {
                mouseX = e.touches[0].clientX - boundingRect.left;
                mouseY = e.touches[0].clientY - boundingRect.top;

            } else {
                mouseX = e.clientX - boundingRect.left;
                mouseY = e.clientY - boundingRect.top;
            }

            return {
                x: mouseX,
                y: mouseY
            };

        },
        bindEvents = function(instance, arrayOfEvents, handler) {
            // Create the events object if it's not already present
            if (!instance.events) {
                instance.events = {};
            }
            _.each(arrayOfEvents, function(index, eventName) {
                instance.events[eventName] = function() {
                    handler.apply(instance, arguments);
                };
                _.dom.events.add(instance.Element, eventName, null, null, instance.events[eventName]);
            });
        },
        unbindEvents = function(instance, arrayOfEvents) {
            _.each(arrayOfEvents, function(eventName, handler) {
                _.dom.removeEvents(instance.Element, eventName, null, handler);
            });
        },
        hovers = {},
        bindHover = function(instance, callback) {
            if (!hovers[instance.id]) {
                hovers[instance.id] = {
                    eventTypes: _.util.arr.merge(instance.options.tooltip.triggerOn, instance.options.tooltip.triggerOff),
                    exceptEventTypes: instance.options.tooltip.triggerOff,
                    trigger: function(evt) {
                        if (hovers[instance.id].exceptEventTypes.indexOf(evt.type) < 0) {
                            _.each(hovers[instance.id].handlers, function(i, handler) {
                                handler(evt);
                            });
                        } else {
                            if (instance.options.tooltip.show) {
                                instance.showTooltip([]);
                            }
                        }
                    },
                    handlers: [function(evt) {
                        instance.actived = 0;
                    }]
                };
                bindEvents(instance, hovers[instance.id].eventTypes, hovers[instance.id].trigger);
            } else {
                if (typeof callback === 'function') {
                    hovers[instance.id].handlers.push(function(evt) {
                        if (instance.actived == 0) {
                            callback.call(instance, evt);
                        }
                    });
                }
            }
        };

    _.extend(_.painter.Charts.util.events, {
        getRelativePosition: getRelativePosition,
        bindEvents: bindEvents,
        unbindEvents: unbindEvents,
        bindHover: bindHover
    });
});