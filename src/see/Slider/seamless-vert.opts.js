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
        doc = global.document,
        location = global.location,
        $ = _.dom.select;

    _.see.Slider.extend({
        name: 'seamless-vert',
        easing: "linear",
        duration: 400,
        bluider: function() {},
        counter: function(num) {
            return num - 2;
        },
        layout: function() {
            var rank = this.rank(this.actorsNum),
                power = (this.actorsNum % 2) == 0 ? this.actorsNum + 2 : this.actorsNum + 3,
                heightTroupe = 100 * power,
                heightAactor = 100 / power;
            this.troupe.style.width = '100%';
            this.troupe.style.height = heightTroupe + '%';
            var position = -(this.curr + 1) * 100;
            this.troupe.style.top = position + '%';
            this.troupe.style.left = 0;
            $(this.actors).each(function(i) {
                this.setAttribute('data-actor-index', rank[i]);
                this.style.width = '100%';
                this.style.height = heightAactor + '%';
            });
            if (this.renderPanel) {
                $('.panel', this.Element).each(function() {
                    $('.slider-anchor', this).each(function(i) {
                        this.setAttribute('data-actor-index', rank[i + 1]);
                    });
                });
            }
        },
        rank: function(num) {
            var rank = [];
            rank.push(num - 1);
            for (var i = 0; i < num; i++) {
                rank.push(i);
            }
            rank.push(0);
            return rank;
        },
        correcter: function(from, to) {
            if (to === this.actorsNum && to - from === 1) {
                to = 0;
                from = -1;
                var position = -(from + 1) * 100;
                this.troupe.style.top = position + '%';
            } else if (to === -1 && from === 0) {
                to = this.actorsNum - 1;
                from = this.actorsNum;
                var position = -(from + 1) * 100;
                this.troupe.style.top = position + '%';
            }
            if (to < 0 || to >= this.actorsNum) {
                _.error('You have specified a wrong pointer[' + to + '/' + this.actorsNum + ']!');
            }
            return to;
        },
        cut: function(n) {
            var to = this.correcter(this.curr, n),
                position = -(to + 1) * 100;
            $(this.troupe).stop(true, true).animate({ top: position + '%' }, this.duration, this.easing);
            this.curr = to;
        },
    });
});