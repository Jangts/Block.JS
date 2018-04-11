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
    '$_/dom/Elements/',
    '$_/Time/Month.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document;

    var $ = _.dom.select,
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        time = new _.Time();

    // 注册_.Time命名空间到pandora
    _('Time');

    declare('Time.Kalendar', _.data.Component, {
        _init: function(elem) {
            elem = _.util.type.isElement(elem) ? elem : doc.getElementById(elem);
            if (elem) {
                this.Element = elem;
                _.dom.addClass(elem, 'tangram-kalendar');
                this.months = $('.months', elem)[0] || _.dom.create('ul', elem, { className: 'months' });
                this.week = $('.week', elem)[0] || _.dom.create('ul', elem, { className: 'week' });
                this.days = $('.days', elem)[0] || _.dom.create('ul', elem, { className: 'days' });
                this.update(true);
            } else {
                _.error('Must specify an element!');
            }
        },
        update: function(today) {
            time.update();
            this.today = [time.year(), _.Time.Month.format(time.month()), _.Time.Month.format(time.day()), time.dayofweek()];
            if (today) {
                this.data = new _.Time.Month(this.today[1], this.today[0]);
            }
            return this.drawMonths().drawDaysOfWeek().drawDaysOfMonth();
        },
        prevMonth: function() {
            this.data.prevMonth(false);
            return this.update();
        },
        nextMonth: function() {
            this.data.nextMonth(false);
            return this.update();
        },
        drawMonths: function() {
            var html = '<li class="month prev-month">&lt;</li>';
            html += '<li class="month curr-month">' + months[this.data.month] + ' ' + this.data.year + '</li>';
            html += '<li class="month next-month">&gt;</li>';
            this.months.innerHTML = html;
            return this;
        },
        drawDaysOfWeek: function() {
            var d = 1,
                html = '';
            for (d; d < 8; d++) {
                _d = d % 7;
                if (_d == this.today[3]) {
                    html += '<li class="day-of-week today">' + dow[_d] + '</li>';
                } else {
                    html += '<li class="day-of-week">' + dow[_d] + '</li>';
                }
            }
            this.week.innerHTML = html;
            return this;
        },
        drawDaysOfMonth: function() {
            var p = 1,
                prevIndex,
                prevmonth = this.data.prevMonth(),
                t = 0,
                day = 1,
                date,
                today = this.today.join('/'),
                n = 0,
                nextlen,
                nextmonth = this.data.nextMonth(),
                html = '';


            if (this.data.firstDay === 0) {
                prevIndex = prevmonth.length - 6
                for (p; p < 6; p++) {
                    html += '<li class="day disabled">' + prevmonth[prevIndex++].day + '</li>';
                }
            } else {
                prevIndex = prevmonth.length - this.data.firstDay + 1;
                for (p; p < this.data.firstDay; p++) {
                    html += '<li class="day disabled">' + prevmonth[prevIndex++].day + '</li>';
                }
            }

            for (t; t < this.data.length; t++) {
                date = this.data[t].join('/') + '/' + this.data[t].dow;
                if (date == today) {
                    html += '<li class="day today" data-day-index="' + t + '">' + (day++) + '</li>';
                } else {
                    html += '<li class="day" data-day-index="' + t + '">' + (day++) + '</li>';
                }
            }

            nextlen = 43 - p - t;

            for (n; n < nextlen; n++) {
                html += '<li class="day disabled">' + nextmonth[n].day + '</li>';
            }
            this.days.innerHTML = html;
            return this;
        },
        drawEvents: function(events) {
            var day;
            _.each(events, function(index, marked) {
                day = $('[data-day-index="' + index + '"]', this.days).removeClass('events');
                if (marked) {
                    day.addClass('events');
                }
            });
            return this;
        }
    });
});