/*!
 * tangram.js framework source code
 *
 * http://www.yangram.net/tangram.js/
 *
 * Date: 2017-04-06
 */
;
tangram.block('$_/see/Slider/Slider.cls', function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        location = global.location,
        $ = _.dom.select;

    _.see.Slider.extend({
        name: 'slide-vert',
        easing: "linear",
        duration: 400,
        bluider: function() {},
        layout: function() {
            var power = (this.actorsNum % 2) == 0 ? this.actorsNum : this.actorsNum + 1,
                heightTroupe = 100 * power,
                heightAactor = 100 / power;
            this.troupe.style.width = '100%';
            this.troupe.style.height = heightTroupe + '%';
            this.troupe.style.top = 0;
            this.troupe.style.left = 0;
            $(this.actors).each(function(i) {
                this.setAttribute('data-actor-index', i);
                this.style.width = '100%';
                this.style.height = heightAactor + '%';
            });
            if (this.renderPanel) {
                $('.panel', this.Element).each(function() {
                    $('.slider-anchor', this).each(function(i) {
                        this.setAttribute('data-actor-index', i);
                    });
                });
            }
        },
        correcter: function(to) {
            to = (to < this.actorsNum) ? to : 0;
            to = (to >= 0) ? to : this.actorsNum - 1;
            return to;
        },
        cut: function(n) {
            var to = this.correcter(n),
                position = to * -100;
            $(this.troupe).stop(true, true).animate({ top: position + '%' }, this.duration, this.easing);
            this.curr = to;
        },
    });
});