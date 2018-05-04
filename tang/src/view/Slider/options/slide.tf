/*!
 * tangram.js framework source code
 *
 * http://www.yangram.net/tangram.js/
 *
 * Date: 2017-04-06
 */
;
...Slider.extend({
    name: 'slide',
    easing: "linear",
    bluider() {},
    layout() {
        var power = (this.actorsNum % 2) == 0 ? this.actorsNum : this.actorsNum + 1,
            widthTroupe = 100 * power,
            widthAactor = 100 / power;
        this.troupe.style.width = widthTroupe + '%';
        this.troupe.style.height = '100%';
        this.troupe.style.top = 0;
        this.troupe.style.left = 0;
        $(this.actors).each((i) {
            this.setAttribute('data-actor-index', i);
            this.style.width = widthAactor + '%';
            this.style.height = '100%';
        });
        if (this.renderPanel) {
            $('.panel', this.Element).each(() {
                $('.slider-anchor', this).each((i) {
                    this.setAttribute('data-actor-index', i);
                });
            });
        }
    },
    correcter(to) {
        to = (to < this.actorsNum) ? to : 0;
        to = (to >= 0) ? to : this.actorsNum - 1;
        return to;
    },
    cut(n) {
        var to = this.correcter(n),
            position = to * -100;
        $(this.troupe).stop(true, true).animate({ left: position + '%' }, this.duration, this.easing);
        this.curr = to;
    }
});