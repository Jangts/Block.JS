/*!
 * tangram.js framework source code
 * 
 * options see.Slider.colx3-vert
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
        name: 'colx3-vert',
        bluider: function() {},
        counter: function(num) {
            return num - 3;
        },
        layout: function() {
            var rank = this.rank(this.actorsNum),
                power = (this.actorsNum % 2) == 0 ? this.actorsNum + 4 : this.actorsNum + 3,
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
            rank.push(1);
            return rank;
        },
        correcter: function(from, to) {
            if (to == this.actorsNum) {
                return to;
            } else if (to > this.actorsNum && to - from === 1) {
                to = to - this.actorsNum;
                from = from - this.actorsNum;
            } else if (to === -1 && from === 0) {
                to = to + this.actorsNum;
                from = from + this.actorsNum;
            }

            if (to < 0 || to > this.actorsNum) {
                _.error('You have specified a wrong pointer[' + to + '/' + this.actorsNum + ']!');
            }

            if (to == 0 && from == this.actorsNum) {
                from = 0;
            }
            if (to == 0 && from == this.actorsNum - 1) {
                to = this.actorsNum;
            }
            var position = -(from + 1) * 100;
            this.troupe.style.top = position + '%';
            return to;
        },
        cut: function(n) {
            var to = this.correcter(this.curr, n),
                position = -(to + 1) * 100;
            $(this.troupe).stop(true, true).animate({ top: position + '%' }, 500, 'easeInOutBack');
            this.curr = to;
        },
    });
});