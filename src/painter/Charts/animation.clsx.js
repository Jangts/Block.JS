/*!
 * tangram.js framework source code
 * Date: 2015-09-04
 */
;
tangram.block('$_/painter/Charts/Charts.cls', function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var findNextWhere = function(arrayToSearch, filterCallback, startIndex) {
            // Default to start of the array
            if (!startIndex) {
                startIndex = -1;
            }
            for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
                var currentItem = arrayToSearch[i];
                if (filterCallback(currentItem)) {
                    return currentItem;
                }
            }
        },

        requestAnimFrame = (function() {
            return global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame || global.msRequestAnimationFrame ||
                function(callback, fps) {
                    return global.setTimeout(callback, 1000 / fps, this);
                };
        })(),

        animations = [];

    declare('painter.Charts.Animation', {
        curFrame: null,
        // default number of steps
        fps: 36,

        // the easing to use for this animation
        easing: "",

        // render function used by the animation service
        render: null,

        // user specified callback to fire on each step of the animation
        onAnimationProgress: null,

        // user specified callback to fire when the animation finishes
        onAnimationComplete: null,

        // calls startDigest with the proper context
        digestWrapper: function() {
            this.startDigest();
        },

        startDigest: function() {
            var startTime = Date.now();
            var framesToDrop = 0;

            if (this.dropFrames > 1) {
                framesToDrop = Math.floor(this.dropFrames);
                this.dropFrames -= framesToDrop;
            }

            for (var i = 0; i < animations.length; i++) {
                if (animations[i].animationObject.curFrame === null) {
                    animations[i].animationObject.curFrame = 0;
                }

                animations[i].animationObject.curFrame += 1 + framesToDrop;
                if (animations[i].animationObject.curFrame > animations[i].animationObject.frames) {
                    animations[i].animationObject.curFrame = animations[i].animationObject.frames;
                }

                animations[i].animationObject.render(animations[i].chartInstance, animations[i].animationObject);

                // Check if executed the last frame.
                if (animations[i].animationObject.curFrame == animations[i].animationObject.frames) {
                    // Call onAnimationComplete
                    animations[i].animationObject.onAnimationComplete.call(animations[i].chartInstance);
                    // Remove the animation.
                    animations.splice(i, 1);
                    // Keep the index in place to offset the splice
                    i--;
                }
            }

            var endTime = Date.now();
            var delay = endTime - startTime - this.frameDuration;
            var frameDelay = delay / this.frameDuration;

            if (frameDelay > 1) {
                this.dropFrames += frameDelay;
            }

            // Do we have more stuff to animate?
            var that = this;
            if (animations.length > 0) {
                requestAnimFrame(function() {
                    that.digestWrapper();
                }, this.fps);
            }
        }
    });

    _.extend(_.painter.Charts.prototype, {
        dropFrames: 0,
        addAnimation: function(duration) {
            var animationObject = new _.painter.Charts.Animation();
            animationObject.animationDuration = duration || this.options.animationDuration || 1000;
            animationObject.frames = Math.ceil(animationObject.animationDuration * animationObject.fps / 1000);
            animationObject.frameDuration = 1000 / animationObject.fps;
            animationObject.easing = this.options.animationEasing;

            // render function
            animationObject.render = function(instance, animation) {
                var easingFunction = _.math.easing.all[animation.easing];
                var stepDecimal = animation.curFrame / animation.frames;
                var easeDecimal = easingFunction(stepDecimal, 0, 1, 1);
                instance.draw(easeDecimal, stepDecimal, animation.curFrame);
            };
            // user events
            animationObject.onAnimationProgress = this.options.onAnimationProgress;
            animationObject.onAnimationComplete = this.options.onAnimationComplete;
            for (var index = 0; index < animations.length; ++index) {
                if (animations[index].chartInstance === this) {
                    // replacing an in progress animation
                    animations[index].animationObject = animationObject;
                    return;
                }
            }

            animations.push({
                chartInstance: this,
                animationObject: animationObject
            });

            // If there are no animations queued, manually kickstart a digest, for lack of a better word
            if (animations.length == 1) {
                requestAnimFrame(function() {
                    animationObject.digestWrapper();
                }, animationObject.fps);
            }
        },
        // Cancel the animation for a given chart instance
        cancelAnimation: function() {
            var index = findNextWhere(animations, function(animationWrapper) {
                return animationWrapper.chartInstance === this;
            });

            if (index) {
                animations.splice(index, 1);
            }
        }
    });
});