public remove (elem, context) {
    if (context && _.util.type(context) == 'Element' && elem.parentNode == context) {
        $..events.remove(elem);
        context.removeChild(elem);
    } else if (elem && elem.parentNode && elem.parentNode.removeChild) {
        //console.log(elem);
        $..events.remove(elem);
        elem.parentNode.removeChild(elem);
    }
}

namespace events with {
    fire (elem, event, eventType) {
        elem.tangram_js_id && @(elem.tangram_js_id).Events && @(elem.tangram_js_id).Events.fire(event, eventType);
        return this;
    },
    add (elem, eventType, selector, data, handler) {
        if (elem && handler) {
            var elemStorage = @(_.dom.cache(elem));
            if (elemStorage.Events) {
                var Events = elemStorage.Events;
            } else {
                var Events = new _.dom.Events(elem);
                Events._protected.keys.push(_.dom.cache(elem));
                elemStorage.Events = Events;
            }
            Events.push(eventType, selector, data, handler);
        }
        return this;
    },
    remove (elem, eventType, selector, handler) {
        if (elem.tangram_js_id && @(elem.tangram_js_id).Events) {
            var Events = @(elem.tangram_js_id).Events;
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
                        elem.tangram_js_id.Events = undefined;
                        delete elem.tangram_js_id.Events;
                    }
                }
            }
        }
        return this;
    },
    trigger (elem, evenType, data) {
        var domEvents = new _.dom.Events();
        for (var k in domEvents._protected.keys) {
            @(domEvents._protected.keys[k]).Events.trigger(evenType, elem, data);
        }
        typeof elem[evenType] == 'function' && elem[evenType]();
        return this;
    },
    touch (obj, selector, callback) {
        var move;
        var istouch = false;
        if (typeof selector === "function") {
            callback = selector;
            selector = null;
        }
        if (typeof callback === "function") {
            $..add(obj, 'touchstart', selector, null, function() {
                istouch = true;
            });
            $..add(obj, 'touchmove', selector, null, function(e) {
                move = true;
            });
            $..add(obj, 'touchend', selector, null, function(e) {
                e.preventDefault();
                if (!move) {
                    var touch = e.changedTouches[0];
                    e.pageX = touch.pageX;
                    e.pageY = touch.pageY;
                    var returnvalue = callback.call(this, e, 'touch');
                    if (returnvalue === false) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
                move = false;
            });
            $..add(obj, 'mousedown', selector, null, click);

            function click(e) {
                if (!istouch) {
                    return callback.call(this, e, 'touch');
                }
            }
        }
    },
    touchStart (obj, selector, callback) {
        if (typeof selector === "function") {
            callback = selector;
            selector = null;
        }
        if (typeof callback === "function") {
            var istouch = false;
            $..add(obj, 'touchstart', selector, null, function(e) {
                var touch = e.changedTouches[0];
                e.pageX = touch.pageX;
                e.pageY = touch.pageY;
                return callback.call(this, e, 'touchstart');
            });
            $..add(obj, 'mousedown', selector, null, click);

            function click(e) {
                if (!istouch) {
                    return callback.call(this, e);
                }
            }
        }
    },
    touchMove (obj, selector, callback) {
        if (typeof selector === "function") {
            callback = selector;
            selector = null;
        }
        if (typeof callback === "function") {
            var istouch = false;
            $..add(obj, 'touchmove', selector, null, function(e) {
                var touch = e.changedTouches[0];
                e.pageX = touch.pageX;
                e.pageY = touch.pageY;
                return callback.call(this, e, 'touchmove');
            });
            $..add(obj, 'mousemove', selector, null, click);

            function click(e) {
                if (!istouch) {
                    return callback.call(this, e, 'touchmove');
                }
            }
        }
    },
    touchEnd (obj, selector, callback) {
        if (typeof selector === "function") {
            callback = selector;
            selector = null;
        }
        if (typeof callback === "function") {
            var istouch = false;
            $..add(obj, 'touchend', selector, null, function(e) {
                var touch = e.changedTouches[0];
                e.pageX = touch.pageX;
                e.pageY = touch.pageY;
                return callback.call(this, e, 'touchend');
            });
            $..add(obj, 'mouseup', selector, null, click);

            function click(e) {
                if (!istouch) {
                    return callback.call(this, e, 'touchend');
                }
            }
        }
    },
    swipeLeft (obj, callback) {
        var start = {},
            end = {};
        $..touchStart(ojb, function(e) {
            start = {
                x: e.pageX,
                y: e.pageY
            };
        });
        $..touchEnd(obj, function(e) {
            end = {
                x: e.pageX,
                y: e.pageY
            }
            e.start = start;
            e.end = end;
            if (end.x > start.x + 10) {
                return callback.call(this, e, 'swipeLeft');
            }
        });
    },
    swipeRight (obj, callback) {
        var start = {},
            end = {};
        $..touchStart(ojb, function(e) {
            start = {
                x: e.pageX,
                y: e.pageY
            };
        });
        $..touchEnd(obj, function(e) {
            end = {
                x: e.pageX,
                y: e.pageY
            }
            e.start = start;
            e.end = end;
            if (end.x < start.x + 10) {
                return callback.call(this, e, 'swipeRight');
            }
        });
    },
    swipe (obj, callback) {
        var start = {},
            end = {};
        $..touchStart(ojb, function(e) {
            start = {
                x: e.pageX,
                y: e.pageY
            };
        });
        $..touchEnd(obj, function(e) {
            end = {
                x: e.pageX,
                y: e.pageY
            }
            e.start = start;
            e.end = end;
            if (end.x > start.x + 10) {
                return callback.call(this, e, 'swipe');
            }
            if (end.x < start.x + 10) {
                return callback.call(this, e, 'swipe');
            }
            if (end.y > start.y + 10) {
                return callback.call(this, e, 'swipe');
            }
            if (end.y < start.y + 10) {
                return callback.call(this, e, 'swipe');
            }
        });
    }
}