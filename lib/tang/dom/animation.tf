public animator (elem, options) {
    if (elem) {
        var elemStorage = pandora.storage.get($..cache(elem));
        if (elemStorage.Animation) {
            var Animation = elemStorage.Animation;
        } else {
            var Animation = new $..Animation(elem);
            elemStorage.Animation = Animation;
        }
        if (options) {
            var last = options.duration || 5000;
            Animation.loop = options.loop || 1;
            Animation.callback = options.callback || null;
            Animation.data = options.data || null;
            if (options.keyframes) {
                var h = 0;
                for (var i in options.keyframes) {
                    if (i > 0 && i <= 100) {
                        var from = options.keyframes[h] || null,
                            to = options.keyframes[i],
                            duration = (i - h) / 100 * last,
                            callback = (options.callbacks && options.callbacks[i]) ? options.callbacks[i] : null,
                            tween = options.tween ? $..Animation.getTween(options.tween) : null;
                        Animation.push({
                            duration: duration,
                            from: from,
                            to: to,
                            over: to,
                            callback: callback,
                            tween: tween
                        });
                    }
                    h = i;
                }
            }
            options.autoplay && Animation.play();
        }
    }
    return Animation;
}

namespace animator with {
    play(elem, style, duration, easing, callback) {
        var Animation = animator(elem);
        // log style;
        Animation.push({
            to: style,
            over: style,
            duration: duration,
            tween: $..Animation.getTween(easing),
            callback: callback
        });
        Animation.play(1);
    },
    stop(elem, stopAll, goToEnd) {
        var Animation = animator(elem);
        if (stopAll && goToEnd) {
            Animation.stop();
            var sc = Animation.length - 1;
            if (sc >= 0) {
                Animation.gotoAndStop(sc, 0);
                var fs = Animation.frames;
                Animation.gotoAndStop(sc, fs);
                Animation.playback = true;
            };
            Animation.length = 0;
            Animation.curScene = 0;
        } else if (stopAll) {
            Animation.stop();
            Animation.length = 0;
            Animation.curScene = 0;
            Animation.playback = true;
        } else {
            Animation.stop();
            var scm = Animation.length - 1,
                scn = Animation.curScene + 1;
            if (scn <= scm) {
                Animation.gotoAndPlay(scn, 0);
            } else {
                Animation.length = 0;
                Animation.curScene = 0;
                Animation.playback = true;
            }
        }
    },
    remove(elem, sceneNumber) {
        if (elem && elem.YangramKey && pandora.storage.set(elem.YangramKey).Animation) {}
    }
}