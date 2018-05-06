/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Sun, 06 May 2018 13:10:49 GMT
 */
;
// tangram.config({});
tangram.init().block([
	'$_/view/Slider/'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var view = pandora.ns('view', {});
	var _ = pandora;
	var doc = root.document;
	var location = root.location;
	var $ = _.dom.select;
	pandora.view.Slider.extend({
		name: 'seamless-vert',
		easing: "linear",
		duration: 400,
		bluider: function () {},
		counter: function (num) {
			return num - 2;
		},
		layout: function () {
			var rank = this.rank(this.actorsNum);
			var power = (this.actorsNum % 2) == 0 ? this.actorsNum + 2 : this.actorsNum + 3;
			var heightTroupe = 100 * power;
			var heightAactor = 100/power;
			this.troupe.style.width = '100%';
			this.troupe.style.height = heightTroupe + '%';
			var position =  -(this.curr + 1) * 100;
			this.troupe.style.top = position + '%';
			this.troupe.style.left = 0;
			$(this.actors).each(function (i) {
				this.setAttribute('data-actor-index', rank[i]);
				this.style.width = '100%';
				this.style.height = heightAactor + '%';
			});
			if (this.renderPanel) {
				$('.panel', this.Element).each(function () {
					$('.slider-anchor', this).each(function (i) {
						this.setAttribute('data-actor-index', rank[i + 1]);
					});
				});
			};
		},
		rank: function (num) {
			var rank = [];
			rank.push(num - 1);
			for (var i = 0;i < num;i++) {
				rank.push(i);
			}
			rank.push(0);
			return rank;
		},
		correcter: function (from, to) {
			if (to === this.actorsNum && to - from === 1) {
				to = 0;
				from =  -1;
				var position =  -(from + 1) * 100;
				this.troupe.style.top = position + '%';
			}
			else if (to ===  -1 && from === 0) {
				to = this.actorsNum - 1;
				from = this.actorsNum;
				var position =  -(from + 1) * 100;
				this.troupe.style.top = position + '%';
			}
			if (to < 0 || to >= this.actorsNum) {
				_.error('You have specified a wrong pointer[' + to + '/' + this.actorsNum + ']!');
			}
			return to;
		},
		cut: function (n) {
			var to = this.correcter(this.curr, n);
			var position =  -(to + 1) * 100;
			$(this.troupe).stop(true, true).animate({top: position + '%'}, this.duration, this.easing);
			this.curr = to;
		}
	});
	this.module.exports = pandora.view.Slider;
});
//# sourceMappingURL=seamless-vert.js.map