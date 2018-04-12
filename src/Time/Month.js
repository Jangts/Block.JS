/*!
 * tangram.js framework source code
 *
 * class Time.Month extends Iterator
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/arr/',
    '$_/Time/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console;

    // 注册_.data命名空间到pandora
    _('data');

    var months = [],
        mons = [];

    var getYear = function(year) {
            switch (_.util.type(year, true)) {
                case 'Integer':
                case 'StringInteger':
                    var y = parseInt(year)
                    if (y) {
                        return y;
                    }
                    return new Date().getFullYear();
                default:
                    return new Date().getFullYear();
            }
        },
        getMonth = function(month, year) {
            switch (_.util.type(month, true)) {
                case 'Integer':
                case 'StringInteger':
                    var m = parseInt(month) - 1;
                    if (m >= 0 && m < 12) {
                        return [m, getYear(year)];
                    }
                    if (year != undefined) {
                        if (m >= 12) {
                            var inc = parseInt(m / 12);
                            m = m % 12;
                            return [m, getYear(year) + inc];
                        }
                        if (m < 0) {
                            var inc = parseInt(m / 12) - 1;
                            m = m % 12 + 12;
                            return [m, getYear(year) + inc];
                        }

                    }

                case 'Float':
                case 'StringFloat':
                    var date = new Date(parseFloat(month));
                    return [date.getMonth(), date.getFullYear()];

                case 'String':
                    var m = _.arr.has(months, month);
                    if (m !== false) {
                        return [m, getYear(year)];
                    }
                    m = _.arr.has(mons, month);
                    if (m !== false) {
                        return [m, getYear(year)];
                    }
                    var date = new Date(month);
                    m = date.getMonth();
                    if (m) {
                        return [m, date.getFullYear()];
                    }
                    var date = new Date();
                    return [date.getMonth(), date.getFullYear()];

                case 'Array':
                    return getMonth(month[0], month[1]);
                default:
                    var date = new Date();
                    return [date.getMonth(), date.getFullYear()];
            }
        },
        getStr = function(num) {
            if (num > 9) {
                return num.toString();
            }
            return '0' + num;
        },
        getDays = function(month, year, days) {
            var day, lastdate;
            days.length = 0;
            days.firstDay = new Date(year, month, 1).getDay();
            month++;
            lastdate = new Date(year, month, 0);
            days.lastDay = lastdate.getDay();
            lastdate = lastdate.getDate();
            for (day = 1; day <= lastdate; day++) {
                var arr = [year.toString(), getStr(month), getStr(day)];
                arr.year = year;
                arr.month = month - 1;
                arr.day = day;
                arr.dow = (days.firstDay + day - 1) % 7;
                days.push(arr);
            }
        };

    /**
     * 一个月份构建类，其实例同时是一个数组对象，可以遍历其中的日期
     * 同时该类是_.Iterator的子类，这使得他自带迭代器的功能，可以自遍历
     * 
     * @param   {number, string}    month          月份，0-11的数或数字
     * @param   {number, string}    year           年份
     *  
     */
    declare('Time.Month', _.Iterator, {
        year: 1970,
        month: 0,
        days: [],
        firstDay: 0,
        lastDay: 0,
        _init: function(month, year) {
            var month = getMonth(month, year);
            this.year = month[1];
            this.month = month[0];
            getDays(month[0], month[1], this);
        },
        prevMonth: function(createNewInstance) {
            if (createNewInstance === false) {
                this._init(this.month, this.year);
                return this;
            }
            return new _.Time.Month(this.month, this.year);
        },
        nextMonth: function(createNewInstance) {
            if (createNewInstance === false) {
                this._init(this.month + 2, this.year);
                return this;
            }
            return new _.Time.Month(this.month + 2, this.year);
        },
        prevYear: function(createNewInstance) {
            if (createNewInstance === false) {
                this._init(this.month, this.year - 1);
                return this;
            }
            return new _.Time.Month(this.month, this.year - 1);
        },
        nextYear: function(createNewInstance) {
            if (createNewInstance === false) {
                this._init(this.month, this.year + 1);
                return this;
            }
            return new _.Time.Month(this.month, this.year + 1);
        }
    });

    _('Time.Month', { format: getStr });
});