$..Animation.setTweens(..math.easing.all);

//Expends Animation APIs To 'Elements'
expands .Elements {
    transition (style, value, duration, easing, callback) {
        //duration = duration,
        to = {};
        to[style] = value;
        this.each(() {
            new $..Animation(this, {
                to: to,
                duration: duration,
                tween: $..Animation.getTween(easing),
                callback: callback
            }).play(1);
        });
        return this;
    }
    animate (styles, duration, easing, callback) {
        duration = duration || 1000;
        // log styles;
        this.each(() {
            $..animator.play(this, styles, duration, easing, callback);
        });
        return this;
    }
    stop (stopAll, goToEnd) {
        this.each(() {
            $..animator.stop(this, stopAll, goToEnd);
        });
        return this;
    }
    animator (options) {
        this.each(() {
            $..animator(this, options).play();
        });
        return this;
    }
    show (duration, easing, callback) {
        this.each(() {
            if (duration) {
                duration = duration;
                if ($..getStyle(this, 'display') != 'none') {
                    callback && callback.call(this);
                } else {
                    var Animation = $..animator(this);
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
                        width: $..getStyle(this, 'width'),
                        height: $..getStyle(this, 'height'),
                        paddingTop: $..getStyle(this, 'paddingTop'),
                        paddingRight: $..getStyle(this, 'paddingRight'),
                        paddingBottom: $..getStyle(this, 'paddingBottom'),
                        paddingLeft: $..getStyle(this, 'paddingLeft'),
                        marginTop: $..getStyle(this, 'marginTop'),
                        marginRight: $..getStyle(this, 'marginRight'),
                        marginBottom: $..getStyle(this, 'marginBottom'),
                        marginLeft: $..getStyle(this, 'marginLeft'),
                        opacity: $..getStyle(this, 'opacity')
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
                    $..setStyle(this, from);
                    $..setStyle(this, 'display', 'block');
                    Animation.push({
                        from: from,
                        to: to,
                        over: to,
                        duration: duration,
                        tween: $..Animation.getTween(easing),
                        callback: callback
                    });
                    Animation.play(1);
                }
            } else {
                $..setStyle(this, 'display', 'block');
            }
        });
        return this;
    }
    hide (duration, easing, callback) {
        this.each(() {
            if (duration) {
                duration = duration;
                if ($..getStyle(this, 'display') == 'none') {
                    callback && callback.call(this);
                } else {
                    var Animation = $..animator(this);
                    var len = Animation.length;
                    var from = {
                        width: $..getStyle(this, 'width'),
                        height: $..getStyle(this, 'height'),
                        paddingTop: $..getStyle(this, 'paddingTop'),
                        paddingRight: $..getStyle(this, 'paddingRight'),
                        paddingBottom: $..getStyle(this, 'paddingBottom'),
                        paddingLeft: $..getStyle(this, 'paddingLeft'),
                        marginTop: $..getStyle(this, 'marginTop'),
                        marginRight: $..getStyle(this, 'marginRight'),
                        marginBottom: $..getStyle(this, 'marginBottom'),
                        marginLeft: $..getStyle(this, 'marginLeft'),
                        opacity: $..getStyle(this, 'opacity')
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
                        tween: $..Animation.getTween(easing),
                        callback () {
                            $..setStyle(this, 'display', 'none');
                            $..setStyle(this, from);
                            callback && callback.call(this);
                        }
                    });
                    Animation.play(1);
                }
            } else {
                $..setStyle(this, 'display', 'none');
            }
        })
        return this;
    }
    fadeIn (duration, easing, callback) {
        duration = duration || 1000;
        this.each(() {
            var Animation = $..animator(this);
            var len = Animation.length;
            var opacity = $..getStyle(this, 'opacity');
            if (len > 0) {
                for (var i = len - 1; i >= 0; i--) {
                    if (Animation.scenes[i].over && Animation.scenes[i].over.opacity) {
                        opacity = Animation.scenes[i].over.opacity;
                        break;
                    }
                }
            }
            $..setStyle(this, 'opacity', 0);
            $..setStyle(this, 'display', 'block');
            Animation.push({
                from: { opacity: 0 },
                to: { opacity: opacity },
                over: { opacity: opacity },
                duration: duration,
                tween: $..Animation.getTween(easing),
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
            if ($..getStyle(this, 'display') == 'none') {
                callback && callback.call(this);
            } else {
                var Animation = $..animator(this);
                var len = Animation.length;
                var opacity = $..getStyle(this, 'opacity');
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
                    tween: $..Animation.getTween(easing),
                    callback () {
                        $..setStyle(this, 'display', 'block');
                        callback && callback.call(this);
                    }
                });
                Animation.play(1);
            }
        });
        return this;
    }
}