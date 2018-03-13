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
    '$_/Time/locales/en'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document;

    var $ = _.dom.select;

    var months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
        mons = _.locales('times', 'en', 'monthsShort'),
        daysofweek = _.locales('times', 'en', 'days'),
        days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    var format = (type, value) => {
        value = parseInt(value);
        switch (type) {
            case 'month':
                return months[value]

            case 'day':
                return daysofweek[value]

            case 'm':
                return value + 1

            case 'mon':
                value++
            case 'date':
            case 'hour':
            case 'minute':
            case 'first':
            case 'second':
                if (value > 9) {
                    return value;
                }
                return '0' + value;
            case 'y':
                if (value == 1) {
                    return '元年';
                }
            case 'year':
                if (value < 0) {
                    return Math.abs(value) + '<i class="bctag"></i>';
                }
            default:
                return value;
        }
    };

    declare('Time.Picker.Builder', {
        format: format,
        _init: function(picker) {
            this.picker = picker;
            this.yearslist = $('.pickers section[data-type=years] ul', picker.Element);
            this.monthslist = $('.pickers section[data-type=months] ul', picker.Element);
            this.dateslist = $('.pickers section[data-type=dates] ul', picker.Element);
            this.hourslist = $('.pickers section[data-type=hours] ul', picker.Element);
            this.minuteslist = $('.pickers section[data-type=minutes] ul', picker.Element);
            this.dayslist = $('.pickers section[data-type=days] ul', picker.Element);
        },
        datetime(year, month, day, hour, minute, second) {
            var html = '<i class="display-char" data-char-type="year" data-value="' + year + '">' + format('year', year) + '</i>';
            html += '<i class="display-char" data-char-type="mon" data-value="' + month + '">' + format('mon', month) + '</i>';
            html += '<i class="display-char" data-char-type="date" data-value="' + day + '">' + format('date', day) + '</i>';
            html += '<i class="display-char" data-char-type="hour" data-value="' + hour + '">' + format('hour', hour) + '</i>';
            html += '<i class="display-char" data-char-type="first" data-value="' + minute + '">' + format('first', minute) + '</i>';
            html += '<i class="display-char" data-char-type="second" data-value="' + second + '">' + format('second', second) + '</i>';
            this.picker.display.datetime.innerHTML = html;
        },
        fulldate(year, month, day) {
            var html = '<i class="display-char" data-char-type="year" data-value="' + year + '">' + format('year', year) + '</i>';
            html += '<i class="display-char" data-char-type="mon" data-value="' + month + '">' + format('mon', month) + '</i>';
            html += '<i class="display-char" data-char-type="date" data-value="' + day + '">' + format('date', day) + '</i>';
            this.picker.display.fulldate.innerHTML = html;
        },
        dayofyear(month, day) {
            var html = '<i class="display-char" data-char-type="month" data-value="' + month + '">' + format('month', month) + '</i>';
            html += '<i class="display-char" data-char-type="date" data-value="' + day + '">' + format('date', day) + '</i>';
            this.picker.display.dayofyear.innerHTML = html;
        },
        timeofday(hour, minute, second) {
            var html = '<i class="display-char" data-char-type="hour" data-value="' + hour + '">' + format('hour', hour) + '</i>';
            html += '<i class="display-char" data-char-type="first" data-value="' + minute + '">' + format('first', minute) + '</i>';
            html += '<i class="display-char" data-char-type="second" data-value="' + second + '">' + format('second', second) + '</i>';
            this.picker.display.timeofday.innerHTML = html;
        },
        hourminute(hour, minute) {
            var html = '<i class="display-char" data-char-type="hour" data-value="' + hour + '">' + format('hour', hour) + '</i>';
            html += '<i class="display-char" data-char-type="minute" data-value="' + minute + '">' + format('minute', minute) + '</i>';
            this.picker.display.hourminute.innerHTML = html;
        },
        dayofweek(day) {
            this.picker.display.dayofweek.innerHTML = '<i class="display-char" data-char-type="day" data-value="' + day + '">' + format('day', day) + '</i>';
        },
        yearsListbuild(firstYear, selectedYear) {
            var year = firstYear,
                lastYear = firstYear + 59;

            var html = '<li class="prev">Prev Page</li>';
            for (year; year <= lastYear; year++) {
                if (year === selectedYear) {
                    if (year % 4) {
                        html += '<li class="selected" data-value="' + year + '">' + format('y', year) + '</li>';
                    } else {
                        html += '<li class="leap selected" data-value="' + year + '">' + format('y', year) + '</li>';
                    }
                } else {
                    if (year % 4) {
                        html += '<li data-value="' + year + '">' + format('y', year) + '</li>';
                    } else {
                        html += '<li class="leap" data-value="' + year + '">' + format('y', year) + '</li>';
                    }
                }
            }
            html += '<li class="next">Next Page</li>';
            this.yearslist.html(html).parent().addClass('actived');
        },
        monthsListbuild(selectedMonth) {
            var html = '';
            for (var month = 0; month < 12; month++) {
                if (month === selectedMonth) {
                    if (month < 3) {
                        html += '<li class="spring selected" data-value="' + month + '">' + mons[month] + '</li>';
                    } else if (month < 6) {
                        html += '<li class="summer selected" data-value="' + month + '">' + mons[month] + '</li>';
                    } else if (month < 9) {
                        html += '<li class="autumn selected" data-value="' + month + '">' + mons[month] + '</li>';
                    } else {
                        html += '<li class="winter selected" data-value="' + month + '">' + mons[month] + '</li>';
                    }
                } else {
                    if (month < 3) {
                        html += '<li class="spring" data-value="' + month + '">' + mons[month] + '</li>';
                    } else if (month < 6) {
                        html += '<li class="summer" data-value="' + month + '">' + mons[month] + '</li>';
                    } else if (month < 9) {
                        html += '<li class="autumn" data-value="' + month + '">' + mons[month] + '</li>';
                    } else {
                        html += '<li class="winter" data-value="' + month + '">' + mons[month] + '</li>';
                    }
                }
            }
            this.monthslist.html(html).parent().addClass('actived');
        },
        datesListbuild(firstDay, count, selectedDate, hideDayOfWeek) {
            var d = day = 0,
                lastDay = (firstDay + count - 1) % 7;
            var date = 1,
                lastDate = count;

            var html = '';
            if (!hideDayOfWeek) {
                for (d; d < 7; d++) {
                    html += '<li class="head">' + days[d] + '</li>';
                }

                for (d = 0; d < 7; d++) {
                    html += '<li class="head">' + days[d] + '</li>';
                }
            }
            for (day; day < firstDay; day++) {
                html += '<li class="placeholder""></li>';
            }
            for (date; date <= lastDate; date++) {
                if (date === selectedDate) {
                    if ((date + firstDay) % 7 === 0 || (date + firstDay) % 7 === 1) {
                        html += '<li class="weekend selected" data-value="' + date + '">' + date + '</li>';
                    } else {
                        html += '<li class="selected" data-value="' + date + '">' + date + '</li>';
                    }
                } else {
                    if ((date + firstDay) % 7 === 0 || (date + firstDay) % 7 === 1) {
                        html += '<li class="weekend" data-value="' + date + '">' + date + '</li>';
                    } else {
                        html += '<li data-value="' + date + '">' + date + '</li>';
                    }
                }
            }
            for (lastDay; lastDay < 6; lastDay++) {
                html += '<li class="placeholder"></li>';
            }
            this.dateslist.html(html).parent().addClass('actived');
        },
        hoursListbuild(selectedHour) {
            var html = '';
            for (var hour = 0; hour <= 23; hour++) {
                if (hour === selectedHour) {
                    html += '<li class="selected" data-value="' + hour + '">' + hour + '</li>';
                } else if (hour % 6) {
                    if (hour < 12) {
                        html += '<li class="am" data-value="' + hour + '">' + hour + '</li>';
                    } else {
                        html += '<li class="pm" data-value="' + hour + '">' + hour + '</li>';
                    }
                } else {
                    if (hour < 12) {
                        html += '<li class="am int" data-value="' + hour + '">' + hour + '</li>';
                    } else {
                        html += '<li class="pm int" data-value="' + hour + '">' + hour + '</li>';
                    }
                }
            }
            this.hourslist.html(html).parent().addClass('actived');
        },
        minutesListbuild(selectedMinute) {
            var html = '';
            for (var minute = 0; minute <= 59; minute++) {
                if (minute === selectedMinute) {
                    if (minute % 5) {
                        html += '<li class="selected" data-value="' + minute + '">' + minute + '</li>';
                    } else {
                        html += '<li class="int selected" data-value="' + minute + '">' + minute + '</li>';
                    }
                } else {
                    if (minute % 5) {
                        html += '<li class=""data-value="' + minute + '">' + minute + '</li>';
                    } else {
                        html += '<li class="int" data-value="' + minute + '">' + minute + '</li>';
                    }
                }
            }
            this.minuteslist.html(html).parent().addClass('actived');
        },
        daysListbuild(selectedDay) {
            var html = '';
            for (var day = 0; day < 7; day++) {
                if (day === selectedDay) {
                    if (day > 0 && day < 5) {
                        html += '<li class="selected" data-value="' + day + '">' + days[day] + '</li>';
                    } else {
                        html += '<li class="weekend selected" data-value="' + day + '">' + days[day] + '</li>';
                    }
                } else {
                    if (day > 0 && day < 5) {
                        html += '<li class="data-value="' + day + '">' + days[day] + '</li>';
                    } else {
                        html += '<li class="weekend" data-value="' + day + '">' + days[day] + '</li>';
                    }
                }
            }
            this.dayslist.html(html).parent().addClass('actived');
        }
    });
});