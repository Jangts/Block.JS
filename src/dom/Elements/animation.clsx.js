/*!
 * Block.JS Framework Source Code
 * 
 * extends animation methods for class Elements
 *
 * Date: 2017-04-06
 */
;
block([
    '$_/dom/animator.xtd',
    '$_/dom/Elements/',
    '$_/math/easing.xtd'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker;

    _.dom.Animation.setTweens(_.math.easing.all);

    //Extend Animation APIs To 'Elements'
    _.dom.select.extend({
        transition: function(style, value, duration, easing, callback) {
            //duration = duration,
            to = {};
            to[style] = value;
            this.each(function() {
                new _.dom.Animation(this, {
                    to: to,
                    duration: duration,
                    tween: _.Animation.getTween(easing),
                    callback: callback
                }).play(1);
            });
            return this;
        },
        animate: function(styles, duration, easing, callback) {
            duration = duration || 1000;
            this.each(function() {
                _.dom.animator.play(this, styles, duration, easing, callback);
            });
            return this;
        },
        stop: function(stopAll, goToEnd) {
            this.each(function() {
                _.dom.animator.stop(this, stopAll, goToEnd);
            });
            return this;
        },
        animator: function(settings) {
            this.each(function() {
                _.dom.animator(this, settings).play();
            });
            return this;
        },
        show: function(duration, easing, callback) {
            this.each(function() {
                if (duration) {
                    duration = duration;
                    if (_.dom.getStyle(this, 'display') != 'none') {
                        callback && callback.call(this);
                    } else {
                        var Animation = _.dom.animator(this);
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
                            width: _.dom.getStyle(this, 'width'),
                            height: _.dom.getStyle(this, 'height'),
                            paddingTop: _.dom.getStyle(this, 'paddingTop'),
                            paddingRight: _.dom.getStyle(this, 'paddingRight'),
                            paddingBottom: _.dom.getStyle(this, 'paddingBottom'),
                            paddingLeft: _.dom.getStyle(this, 'paddingLeft'),
                            marginTop: _.dom.getStyle(this, 'marginTop'),
                            marginRight: _.dom.getStyle(this, 'marginRight'),
                            marginBottom: _.dom.getStyle(this, 'marginBottom'),
                            marginLeft: _.dom.getStyle(this, 'marginLeft'),
                            opacity: _.dom.getStyle(this, 'opacity')
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
                        _.dom.setStyle(this, from);
                        _.dom.setStyle(this, 'display', 'block');
                        Animation.push({
                            from: from,
                            to: to,
                            over: to,
                            duration: duration,
                            tween: _.dom.Animation.getTween(easing),
                            callback: callback
                        });
                        Animation.play(1);
                    }
                } else {
                    _.dom.setStyle(this, 'display', 'block');
                }
            });
            return this;
        },
        hide: function(duration, easing, callback) {
            this.each(function() {
                if (duration) {
                    duration = duration;
                    if (_.dom.getStyle(this, 'display') == 'none') {
                        callback && callback.call(this);
                    } else {
                        var Animation = _.dom.animator(this);
                        var len = Animation.length;
                        var from = {
                                width: _.dom.getStyle(this, 'width'),
                                height: _.dom.getStyle(this, 'height'),
                                paddingTop: _.dom.getStyle(this, 'paddingTop'),
                                paddingRight: _.dom.getStyle(this, 'paddingRight'),
                                paddingBottom: _.dom.getStyle(this, 'paddingBottom'),
                                paddingLeft: _.dom.getStyle(this, 'paddingLeft'),
                                marginTop: _.dom.getStyle(this, 'marginTop'),
                                marginRight: _.dom.getStyle(this, 'marginRight'),
                                marginBottom: _.dom.getStyle(this, 'marginBottom'),
                                marginLeft: _.dom.getStyle(this, 'marginLeft'),
                                opacity: _.dom.getStyle(this, 'opacity')
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
                            tween: _.dom.Animation.getTween(easing),
                            callback: function() {
                                _.dom.setStyle(this, 'display', 'none');
                                _.dom.setStyle(this, from);
                                callback && callback.call(this);
                            }
                        });
                        Animation.play(1);
                    }
                } else {
                    _.dom.setStyle(this, 'display', 'none');
                }
            })
            return this;
        },
        fadeIn: function(duration, easing, callback) {
            duration = duration || 1000;
            this.each(function() {
                var Animation = _.dom.animator(this);
                var len = Animation.length;
                var opacity = _.dom.getStyle(this, 'opacity');
                if (len > 0) {
                    for (var i = len - 1; i >= 0; i--) {
                        if (Animation.scenes[i].over && Animation.scenes[i].over.opacity) {
                            opacity = Animation.scenes[i].over.opacity;
                            break;
                        }
                    }
                }
                _.dom.setStyle(this, 'opacity', 0);
                _.dom.setStyle(this, 'display', 'block');
                Animation.push({
                    from: { opacity: 0 },
                    to: { opacity: opacity },
                    over: { opacity: opacity },
                    duration: duration,
                    tween: _.dom.Animation.getTween(easing),
                    callback: function() {
                        callback && callback.call(this);
                    }
                });
                Animation.play(1);
            });
            return this;
        },
        fadeOut: function(duration, easing, callback) {
            duration = duration || 1000;
            this.each(function() {
                if (_.dom.getStyle(this, 'display') == 'none') {
                    callback && callback.call(this);
                } else {
                    var Animation = _.dom.animator(this);
                    var len = Animation.length;
                    var opacity = _.dom.getStyle(this, 'opacity');
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
                        tween: _.dom.Animation.getTween(easing),
                        callback: function() {
                            _.dom.setStyle(this, 'display', 'block');
                            callback && callback.call(this);
                        }
                    });
                    Animation.play(1);
                }
            });
            return this;
        }
    }, true);
});