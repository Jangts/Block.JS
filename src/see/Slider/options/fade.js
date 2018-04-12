/*!
 * tangram.js framework source code
 *
 * options see.Slider.fade
 *
 * Date: 2017-04-06
 */
;
tangram.block('$_/see/Slider/Slider', function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        location = global.location,
        $ = _.dom.select;

    _.see.Slider.extend({
        name: 'fade',
        layout: function() {
            var rank = this.rank(this.actorsNum);
            $(this.actors).each(function(i) {
                this.setAttribute('data-actor-index', rank[i]);
                this.style.position = 'absolute';
                this.style.width = '100%';
                this.style.top = 0;
                this.style.left = 0;
                this.style.opacity = i ? 0 : 1;
                this.style.zIndex = i ? 0 : 100;
            });
        },
        rank: function(num) {
            var rank = [];
            for (var i = 0; i < num; i++) { rank.push(i); }
            return rank;
        },
        correcter: function(to) {
            to = to < this.actorsNum ? to : 0;
            to = to > -1 ? to : this.actorsNum - 1;
            return to;
        },
        cut: function(n) {
            var inner = this.troupe,
                from = this.curr,
                to = this.correcter(n);
            if (from != to) {
                $(this.troupe).find('[data-actor-index=' + to + ']').css('opacity', 1).hide().css('z-index', 200).stop(true, true).fadeIn(800, 'easeInOutQuart', function() {
                    $(inner).find('[data-actor-index=' + from + ']').css('z-index', 0).css('opacity', 0);
                    $(this).css('z-index', 100);
                });
            }
            this.curr = to;
        }
    });
});