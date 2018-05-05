public remove (elem, context) {
    if (context && _.util.type(context) == 'Element' && elem.parentNode == context) {
        _.dom.events.remove(elem);
        context.removeChild(elem);
    } else if (elem && elem.parentNode && elem.parentNode.removeChild) {
        //console.log(elem);
        _.dom.events.remove(elem);
        elem.parentNode.removeChild(elem);
    }
}

namespace events with {
    fire (elem, event, eventType) {
        elem.BID && @(elem.BID).Events && @(elem.BID).Events.fire(event, eventType);
        return this;
    },
    add (elem, eventType, selector, data, handler) {
        if (elem && handler) {
            var eleCache = @(_.dom.cache(elem));
            if (eleCache.Events) {
                var Events = eleCache.Events;
            } else {
                var Events = new _.dom.Events(elem);
                Events._protected.keys.push(_.dom.cache(elem));
                eleCache.Events = Events;
            }
            Events.push(eventType, selector, data, handler);
        }
        return this;
    },
    remove (elem, eventType, selector, handler) {
        if (elem.BID && @(elem.BID).Events) {
            var Events = @(elem.BID).Events;
            if (handler) {
                Events.removeHandler(eventType, selector, handler);
            } else {
                if (eventType && typeof selector != 'undefined') {
                    Events.removeSelector(eventType, selector);
                } else {
                    if (eventType) {
                        Events.removeType(eventType);
                    } else {
                        Events.remove();
                        elem.BID.Events = undefined;
                        delete elem.BID.Events;
                    }
                }
            }
        }
        return this;
    },
    trigger (elem, evenType, data) {
        var noEvents = new _.dom.Events();
        for (var k in noEvents._protected.keys) {
            @(noEvents._protected.keys[k]).Events.trigger(evenType, elem, data);
        }
        typeof elem[evenType] == 'function' && elem[evenType]();
        return this;
    },
    touch (obj, selector, fn) {
        var move;
        var istouch = false;
        if (typeof selector === "function") {
            fn = selector;
            selector = null;
        }
        if (typeof fn === "function") {
            _.dom.events.add(obj, 'touchstart', selector, null, function() {
                istouch = true;
            });
            _.dom.events.add(obj, 'touchmove', selector, null, function(e) {
                move = true;
            });
            _.dom.events.add(obj, 'touchend', selector, null, function(e) {
                e.preventDefault();
                if (!move) {
                    var touch = e.changedTouches[0];
                    e.pageX = touch.pageX;
                    e.pageY = touch.pageY;
                    var returnvalue = fn.call(this, e, 'touch');
                    if (returnvalue === false) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
                move = false;
            });
            _.dom.events.add(obj, 'mousedown', selector, null, click);

            function click(e) {
                if (!istouch) {
                    return fn.call(this, e, 'touch');
                }
            }
        }
    },
    touchStart (obj, selector, fn) {
        if (typeof selector === "function") {
            fn = selector;
            selector = null;
        }
        if (typeof fn === "function") {
            var istouch = false;
            _.dom.events.add(obj, 'touchstart', selector, null, function(e) {
                var touch = e.changedTouches[0];
                e.pageX = touch.pageX;
                e.pageY = touch.pageY;
                return fn.call(this, e, 'touchstart');
            });
            _.dom.events.add(obj, 'mousedown', selector, null, click);

            function click(e) {
                if (!istouch) {
                    return fn.call(this, e);
                }
            }
        }
    },
    touchMove (obj, selector, fn) {
        if (typeof selector === "function") {
            fn = selector;
            selector = null;
        }
        if (typeof fn === "function") {
            var istouch = false;
            _.dom.events.add(obj, 'touchmove', selector, null, function(e) {
                var touch = e.changedTouches[0];
                e.pageX = touch.pageX;
                e.pageY = touch.pageY;
                return fn.call(this, e, 'touchmove');
            });
            _.dom.events.add(obj, 'mousemove', selector, null, click);

            function click(e) {
                if (!istouch) {
                    return fn.call(this, e, 'touchmove');
                }
            }
        }
    },
    touchEnd (obj, selector, fn) {
        if (typeof selector === "function") {
            fn = selector;
            selector = null;
        }
        if (typeof fn === "function") {
            var istouch = false;
            _.dom.events.add(obj, 'touchend', selector, null, function(e) {
                var touch = e.changedTouches[0];
                e.pageX = touch.pageX;
                e.pageY = touch.pageY;
                return fn.call(this, e, 'touchend');
            });
            _.dom.events.add(obj, 'mouseup', selector, null, click);

            function click(e) {
                if (!istouch) {
                    return fn.call(this, e, 'touchend');
                }
            }
        }
    },
    swipeLeft (obj, fn) {
        var start = {},
            end = {};
        _.dom.events.touchStart(ojb, function(e) {
            start = {
                x: e.pageX,
                y: e.pageY
            };
        });
        _.dom.events.touchEnd(obj, function(e) {
            end = {
                x: e.pageX,
                y: e.pageY
            }
            e.start = start;
            e.end = end;
            if (end.x > start.x + 10) {
                return fn.call(this, e, 'swipeLeft');
            }
        });
    },
    swipeRight (obj, fn) {
        var start = {},
            end = {};
        _.dom.events.touchStart(ojb, function(e) {
            start = {
                x: e.pageX,
                y: e.pageY
            };
        });
        _.dom.events.touchEnd(obj, function(e) {
            end = {
                x: e.pageX,
                y: e.pageY
            }
            e.start = start;
            e.end = end;
            if (end.x < start.x + 10) {
                return fn.call(this, e, 'swipeRight');
            }
        });
    },
    swipe (obj, fn) {
        var start = {},
            end = {};
        _.dom.events.touchStart(ojb, function(e) {
            start = {
                x: e.pageX,
                y: e.pageY
            };
        });
        _.dom.events.touchEnd(obj, function(e) {
            end = {
                x: e.pageX,
                y: e.pageY
            }
            e.start = start;
            e.end = end;
            if (end.x > start.x + 10) {
                return fn.call(this, e, 'swipe');
            }
            if (end.x < start.x + 10) {
                return fn.call(this, e, 'swipe');
            }
            if (end.y > start.y + 10) {
                return fn.call(this, e, 'swipe');
            }
            if (end.y < start.y + 10) {
                return fn.call(this, e, 'swipe');
            }
        });
    }
}