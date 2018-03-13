/*!
 * tangram.js framework source code
 *
 * class see.Tabs,
 * class see.Tabs.Auto
 *
 * Date: 2017-04-06
 */
;
tangram.block([
    '$_/see/Tabs/',
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        location = global.location,
        $ = _.dom.select;

    declare('see.Tabs.SlideTabs', _.see.Tabs, {
        speed: 5000,
        timer: undefined,
        progress: 0,
        _init: function(elem, settings) {
            this._parent._init.call(this, elem, settings);
            this.play();
        },
        play: function() {
            this.stop();
            this[this.type]();
            var progress, that = this;
            if (_.util.bool.isFn(this.onprogress)) {
                var speed = this.speed / 100;
                this.onprogress(progress = 0);
                this.timer = setInterval(function() {
                    that.onprogress(++progress);
                    if (progress === 100) {
                        that.next();
                    }
                }, speed);
            } else {
                this.timer = setInterval(function() {
                    that.next();
                }, this.speed);
            }
            return this;
        },
        next: function() {
            this.stop();
            this.cur++;
            this.play();
            return this;
        },
        stop: function() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = undefined;
            };
            return this;
        },
        onprogress: null
    });

    _.extend(_.see.Tabs.SlideTabs, {
        auto: function() {
            $('.tangram.stabs[data-ic-auto]').each(function() {
                if ($(this).data('icAuto') != 'false') {
                    new _.see.Tabs.SlideTabs(this, {
                        trigger: $(this).data('tabsTrigger') || 'mouseover',
                        keyClass: $(this).data('tabskeyclass') || 'actived'
                    });
                }
            });
        }
    });
});