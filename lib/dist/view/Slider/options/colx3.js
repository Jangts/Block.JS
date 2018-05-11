/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Fri, 11 May 2018 04:49:05 GMT
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
		name: 'colx3',
		bluider: function () {},
		counter: function (num) {
			return num - 3;
		},
		layout: function () {
			var rank = this.rank(this.actorsNum);
			var power = (this.actorsNum % 2) == 0 ? this.actorsNum + 4 : this.actorsNum + 3;
			var widthTroupe = 100 * power;
			var widthAactor = 100/power;
			this.troupe.style.width = widthTroupe + '%';
			this.troupe.style.height = '100%';
			var position =  -(this.curr + 1) * 100;
			this.troupe.style.top = 0;
			this.troupe.style.left = position + '%';
			$(this.actors).each(function (i) {
				this.setAttribute('data-actor-index', rank[i]);
				this.style.width = widthAactor + '%';
				this.style.height = '100%';
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
			rank.push(1);
			return rank;
		},
		correcter: function (from, to) {
			if (to == this.actorsNum) {
				return to;
			}
			else if (to > this.actorsNum && to - from === 1) {
				to = to - this.actorsNum;
				from = from - this.actorsNum;
			}
			else if (to ===  -1 && from === 0) {
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
			var position =  -(from + 1) * 100;
			this.troupe.style.left = position + '%';
			return to;
		},
		cut: function (n) {
			var to = this.correcter(this.curr, n);
			var position =  -(to + 1) * 100;
			$(this.troupe).stop(true, true).animate({left: position + '%'}, 500, 'easeInOutBack');
			this.curr = to;
		}
	});
	this.module.exports = pandora.view.Slider;
});
//# sourceMappingURL=colx3.js.map