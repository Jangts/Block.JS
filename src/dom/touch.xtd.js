/*!
 * Block.JS Framework Source Code
 *
 * static dom.events
 *
 * Date 2017-04-06
 */
;
block(['$_/dom/'], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker;

    _.extend(_.dom.events, {
        touch: function(obj, selector, fn) {
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
        touchStart: function(obj, selector, fn) {
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
        touchMove: function(obj, selector, fn) {
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
        touchEnd: function(obj, selector, fn) {
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
        swipeLeft: function(obj, fn) {
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
        swipeRight: function(obj, fn) {
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
        swipe: function(obj, fn) {
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
    });
});