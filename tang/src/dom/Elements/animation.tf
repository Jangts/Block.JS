dom.Animation.setTweens(_.math.easing.all);

//Expends Animation APIs To 'Elements'
expands .Elements {
    transition (style, value, duration, easing, callback) {
        //duration = duration,
        to = {};
        to[style] = value;
        this.each(() {
            new dom.Animation(this, {
                to: to,
                duration: duration,
                tween: dom.Animation.getTween(easing),
                callback: callback
            }).play(1);
        });
        return this;
    }
    animate (styles, duration, easing, callback) {
        duration = duration || 1000;
        this.each(() {
            dom.animator.play(this, styles, duration, easing, callback);
        });
        return this;
    }
    stop (stopAll, goToEnd) {
        this.each(() {
            dom.animator.stop(this, stopAll, goToEnd);
        });
        return this;
    }
    animator (options) {
        this.each(() {
            dom.animator(this, options).play();
        });
        return this;
    }
    show (duration, easing, callback) {
        this.each(() {
            if (duration) {
                duration = duration;
                if (dom.getStyle(this, 'display') != 'none') {
                    callback && callback.call(this);
                } else {
                    var Animation = dom.animator(this);
                    var len = Animation.length;
                    var from = {
                        width: 0,
                        height: 0,
                        paddingTop: 0,
                        paddingRight: 0,
                        paddingBottom: 0,
                        paddingLeft: 0,
                        marginTop: 0,
                        marginRight: 0,
                        marginBottom: 0,
                        marginLeft: 0,
                        opacity: 0
                    };
                    var to = {
                        width: dom.getStyle(this, 'width'),
                        height: dom.getStyle(this, 'height'),
                        paddingTop: dom.getStyle(this, 'paddingTop'),
                        paddingRight: dom.getStyle(this, 'paddingRight'),
                        paddingBottom: dom.getStyle(this, 'paddingBottom'),
                        paddingLeft: dom.getStyle(this, 'paddingLeft'),
                        marginTop: dom.getStyle(this, 'marginTop'),
                        marginRight: dom.getStyle(this, 'marginRight'),
                        marginBottom: dom.getStyle(this, 'marginBottom'),
                        marginLeft: dom.getStyle(this, 'marginLeft'),
                        opacity: dom.getStyle(this, 'opacity')
                    };
                    if (len > 0) {
                        for (var style in to) {
                            for (var i = len - 1; i >= 0; i--) {
                                if (Animation.scenes[i].over && Animation.scenes[i].over[style]) {
                                    to[style] = Animation.scenes[i].over[style];
                                    break;
                                }
                            }
                        }
                    }
                    dom.setStyle(this, from);
                    dom.setStyle(this, 'display', 'block');
                    Animation.push({
                        from: from,
                        to: to,
                        over: to,
                        duration: duration,
                        tween: dom.Animation.getTween(easing),
                        callback: callback
                    });
                    Animation.play(1);
                }
            } else {
                dom.setStyle(this, 'display', 'block');
            }
        });
        return this;
    }
    hide (duration, easing, callback) {
        this.each(() {
            if (duration) {
                duration = duration;
                if (dom.getStyle(this, 'display') == 'none') {
                    callback && callback.call(this);
                } else {
                    var Animation = dom.animator(this);
                    var len = Animation.length;
                    var from = {
                        width: dom.getStyle(this, 'width'),
                        height: dom.getStyle(this, 'height'),
                        paddingTop: dom.getStyle(this, 'paddingTop'),
                        paddingRight: dom.getStyle(this, 'paddingRight'),
                        paddingBottom: dom.getStyle(this, 'paddingBottom'),
                        paddingLeft: dom.getStyle(this, 'paddingLeft'),
                        marginTop: dom.getStyle(this, 'marginTop'),
                        marginRight: dom.getStyle(this, 'marginRight'),
                        marginBottom: dom.getStyle(this, 'marginBottom'),
                        marginLeft: dom.getStyle(this, 'marginLeft'),
                        opacity: dom.getStyle(this, 'opacity')
                    },
                        to = {
                            width: 0,
                            height: 0,
                            paddingTop: 0,
                            paddingRight: 0,
                            paddingBottom: 0,
                            paddingLeft: 0,
                            marginTop: 0,
                            marginRight: 0,
                            marginBottom: 0,
                            marginLeft: 0,
                            opacity: 0
                        };
                    if (len > 0) {
                        for (var style in from) {
                            for (var i = len - 1; i >= 0; i--) {
                                if (Animation.scenes[i].over && Animation.scenes[i].over[style]) {
                                    from[style] = Animation.scenes[i].over[style];
                                    break;
                                }
                            }
                        }
                    }
                    Animation.push({
                        from: from,
                        to: to,
                        over: from,
                        duration: duration,
                        tween: dom.Animation.getTween(easing),
                        callback () {
                            dom.setStyle(this, 'display', 'none');
                            dom.setStyle(this, from);
                            callback && callback.call(this);
                        }
                    });
                    Animation.play(1);
                }
            } else {
                dom.setStyle(this, 'display', 'none');
            }
        })
        return this;
    }
    fadeIn (duration, easing, callback) {
        duration = duration || 1000;
        this.each(() {
            var Animation = dom.animator(this);
            var len = Animation.length;
            var opacity = dom.getStyle(this, 'opacity');
            if (len > 0) {
                for (var i = len - 1; i >= 0; i--) {
                    if (Animation.scenes[i].over && Animation.scenes[i].over.opacity) {
                        opacity = Animation.scenes[i].over.opacity;
                        break;
                    }
                }
            }
            dom.setStyle(this, 'opacity', 0);
            dom.setStyle(this, 'display', 'block');
            Animation.push({
                from: { opacity: 0 },
                to: { opacity: opacity },
                over: { opacity: opacity },
                duration: duration,
                tween: dom.Animation.getTween(easing),
                callback () {
                    callback && callback.call(this);
                }
            });
            Animation.play(1);
        });
        return this;
    }
    fadeOut (duration, easing, callback) {
        duration = duration || 1000;
        this.each(() {
            if (dom.getStyle(this, 'display') == 'none') {
                callback && callback.call(this);
            } else {
                var Animation = dom.animator(this);
                var len = Animation.length;
                var opacity = dom.getStyle(this, 'opacity');
                if (len > 0) {
                    for (var i = len - 1; i >= 0; i--) {
                        if (Animation.scenes[i].over && Animation.scenes[i].over.opacity) {
                            opacity = Animation.scenes[i].over.opacity;
                            break;
                        }
                    }
                }
                Animation.push({
                    from: { opacity: opacity },
                    to: { opacity: 0 },
                    over: { opacity: opacity },
                    duration: duration,
                    tween: dom.Animation.getTween(easing),
                    callback () {
                        dom.setStyle(this, 'display', 'block');
                        callback && callback.call(this);
                    }
                });
                Animation.play(1);
            }
        });
        return this;
    }
}