/*!
 * tangram.js framework source code
 *
 * class dom.Events
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/data/Component.cls',
    '$_/dom/Elements/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document;

    var $ = _.dom.select;

    // 注册_.Time命名空间到pandora
    _('Time');

    var removeByIndex = function(array, index) {
        var result = [];
        for (var i = 0; i < array.length; i++) {
            i == index || result.push(array[i]);
        }
        return result;
    };

    declare('Time.Clock', _.data.Component, {
        H: 0,
        m: 0,
        s: 0,
        _init: function(elem) {
            elem = _.util.type.isElement(elem) ? elem : doc.getElementById(elem);
            if (elem) {
                this.Element = elem;
                _.dom.addClass(elem, 'tangram').addClass(elem, 'clock');
                this.dial = $('.clock-dial', elem).html('<div class="clock-fixer"></div><div class="clock-hand hour"></div><div class="clock-hand minute"></div><div class="clock-hand second"></div>')[0] || _.dom.create('div', elem, {
                    className: 'clock-dial',
                    innerHTML: '<div class="clock-fixer"></div><div class="clock-hand hour"></div><div class="clock-hand minute"></div><div class="clock-hand second"></div>'
                });
                this.hands = {
                    hour: $('.clock-hand.hour', this.dial),
                    minute: $('.clock-hand.minute', this.dial),
                    second: $('.clock-hand.second', this.dial)
                };

                var that = this;
                that.h = 0;
                that.m = 0;
                that.s = 0;
                this._observe(true)
                    ._listen('h', function(a, v) {
                        that.setHour(v);
                    })
                    ._listen('m', function(a, v) {
                        that.setMinute(v);
                    })
                    ._listen('s', function(a, v) {
                        that.setSecond(v);
                    });
            } else {
                _.error('Must specify an element!');
            }
        },
        setHour: function(h) {
            h = parseInt(h) % 12;

            this._observer.silently = true;
            this.h = h;
            var angle = this.h * 30 + this.m * 0.5;
            this.hands.hour.css('transform', 'rotate(' + angle + 'deg)');
            this._observer.silently = false;

            return this;
        },
        setMinute: function(m) {
            m = parseInt(m) % 60;

            this._observer.silently = true;
            this.m = m;
            var angle = this.m * 6;
            this.hands.minute.css('transform', 'rotate(' + angle + 'deg)');
            this._observer.silently = false;

            return this;
        },
        setSecond: function(s) {
            s = parseInt(s) % 60;

            this._observer.silently = true;
            this.s = s;
            var angle = this.s * 6;
            this.hands.second.css('transform', 'rotate(' + angle + 'deg)');
            this._observer.silently = false;

            return this;
        },
        setTime: function(time) {

        }
    });
});