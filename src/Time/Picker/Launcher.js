tangram.block([
    '$_/dom/Elements'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console,
        $ = _.dom.select;

    var checkInputValue = {
        datetime: function() {
            this.currentInputValue = this.currentInputValue.trim();
            if (/^\-\d+\s*\-\s*\d{1,2}\s*\-\s*\d{1,2}\s+\d{1,2}\s*:\s*\d{1,2}\s*:\s*\d{1,2}$/.test(this.currentInputValue)) {
                this.currentValuesList = this.currentInputValue.replace(/^\-/, '').split(/[\-\s\:]+/);
                this.currentValuesList[0] = this.currentValuesList[0] * -1;
            } else {
                if (/^\d+\s*\-\s*\d{1,2}\s*\-\s*\d{1,2}\s+\d{1,2}\s*:\s*\d{1,2}\s*:\s*\d{1,2}$/.test(this.currentInputValue) == false) {
                    this.currentInputValue = new _.Time().format('yyyy-MM-dd hh:mm:ss');
                }
                this.currentValuesList = this.currentInputValue.split(/[\-\s\:]+/);
            }
            if (this.currentValuesList[0] == 0) {
                this.currentValuesList[0] = 1;
            }
            this.currentValuesList[1] = parseInt(this.currentValuesList[1]) - 1;
        },
        fulldate: function() {
            this.currentInputValue = this.currentInputValue.trim();
            if (/^\-\d+\s*\-\s*\d{1,2}\s*\-\s*\d{1,2}\s+\d{1,2}\s*:\s*\d{1,2}\s*:\s*\d{1,2}$/.test(this.currentInputValue)) {
                this.currentValuesList = this.currentInputValue.replace(/^\-/, '').split(/[\-\s\:]+/);
                this.currentValuesList[0] = this.currentValuesList[0] * -1;
            } else {
                if (/^\d+\s*\-\s*\d{1,2}\s*\-\s*\d{1,2}$/.test(this.currentInputValue) == false) {
                    this.currentInputValue = new _.Time().format('yyyy-MM-dd');
                }
                this.currentValuesList = this.currentInputValue.split(/[\-\s]+/);
            }
            if (this.currentValuesList[0] == 0) {
                this.currentValuesList[0] = 1;
            }
            this.currentValuesList[1] = parseInt(this.currentValuesList[1]) - 1;
        },
        localmonth: function() {},
        shortmonth: function() {},
        numbermonth: function() {},
        dayofyear: function() {
            this.currentInputValue = this.currentInputValue.trim();
            if (/^\d{1,2}\s*\-\s*\d{1,2}$/.test(this.currentInputValue) == false) {
                this.currentInputValue = new _.Time().format('yyyy-MM');
            }
            this.currentValuesList = this.currentInputValue.split(/[\-\s]+/);
            this.currentValuesList[1] = parseInt(this.currentValuesList[1]) - 1;
        },
        timeofday: function() {
            this.currentInputValue = this.currentInputValue.trim();
            if (/^\d{1,2}\s*:\s*\d{1,2}\s*:\s*\d{1,2}$/.test(this.currentInputValue) == false) {
                this.currentInputValue = new _.Time().format('hh:mm:ss');
            }
            this.currentValuesList = this.currentInputValue.split(/[\:\s]+/);
        },
        hourminute: function() {
            this.currentInputValue = this.currentInputValue.trim();
            if (/^\d{1,2}\s*:\s*\d{1,2}$/.test(this.currentInputValue) == false) {
                this.currentInputValue = new _.Time().format('hh:mm');
            }
            this.currentValuesList = this.currentInputValue.split(/[\:\s]+/);
        },
        dayofweek: function() {
            this.currentInputValue = parseInt(this.currentInputValue.trim());
            if (this.currentInputValue > 6 || this.currentInputValue < 0) {
                this.currentInputValue = 0;
            }
            this.currentValuesList = [this.currentInputValue];
        }
    };

    declare('Time.Picker.Launcher', {
        picker: null,
        currentInputType: 'datetime',
        currentInputValue: '1970-01-01 00:00:00',
        currentFirstYear: 1931,
        currentValuesList: [],
        currentdisplayTarget: $(),
        currentPickerType: 'year',
        _init: function(picker) {
            this.picker = picker;
        },
        clearDisplay: function() {
            _.each(this.picker.display, function(i, el) {
                _.dom.removeClass(el, 'actived');
            });
        },
        clearPickers: function(type) {
            if (this.currentPickerType != type) {
                $('.pickers section').removeClass('actived');
                this.currentPickerType = type;
            }
        },
        datetime: function() {
            checkInputValue[this.currentInputType].call(this);
            if (this.currentValuesList[0] > 0) {
                var quotient = parseInt((parseInt(this.currentValuesList[0]) - 1) / 60);
            } else {
                var quotient = parseInt((parseInt(this.currentValuesList[0]) - 61) / 60);
            }
            this.currentFirstYear = quotient * 60 + 1;
            this.picker.builder.datetime(parseInt(this.currentValuesList[0]), this.currentValuesList[1], parseInt(this.currentValuesList[2]),
                parseInt(this.currentValuesList[3]), parseInt(this.currentValuesList[4]), parseInt(this.currentValuesList[5]));
            this.currentdisplayTarget = $('.displayer .display-item[data-type=datetime] .display-char').sub(0);
            this.currentPickerType = 'year';
            _.dom.addClass(this.picker.display.datetime, 'actived');
            var that = this;
            setTimeout(function() {
                that.picker.builder.yearsListbuild(that.currentFirstYear, parseInt(that.currentValuesList[0]));
            }, 500);
        },
        fulldate: function() {
            checkInputValue[this.currentInputType].call(this);
            if (this.currentValuesList[0] > 0) {
                var quotient = parseInt((parseInt(this.currentValuesList[0]) - 1) / 60);
            } else {
                var quotient = parseInt((parseInt(this.currentValuesList[0]) - 61) / 60);
            }
            this.currentFirstYear = quotient * 60 + 1;
            this.picker.builder.fulldate(parseInt(this.currentValuesList[0]), this.currentValuesList[1], parseInt(this.currentValuesList[2]));
            this.currentdisplayTarget = $('.displayer .display-item[data-type=fulldate] .display-char').sub(0);
            this.currentPickerType = 'year';
            _.dom.addClass(this.picker.display.fulldate, 'actived');
            var that = this;
            setTimeout(function() {
                that.picker.builder.yearsListbuild(that.currentFirstYear, parseInt(that.currentValuesList[0]));
            }, 500);
        },
        localmonth: function() {},
        shortmonth: function() {},
        numbermonth: function() {},
        dayofyear: function() {
            checkInputValue[this.currentInputType].call(this);
            this.currentValuesList[1] = parseInt(this.currentValuesList[1]) - 1;
            this.picker.builder.dayofyear(parseInt(this.currentValuesList[0]), this.currentValuesList[1]);
            this.currentdisplayTarget = $('.displayer .display-item[data-type=dayofyear] .display-char').sub(0);
            this.currentPickerType = 'month';
            _.dom.addClass(this.picker.display.dayofyear, 'actived');
            var that = this;
            setTimeout(function() {
                that.picker.builder.monthsListbuild(parseInt(that.currentValuesList[0]) - 1);
            }, 500);
        },
        timeofday: function() {
            checkInputValue[this.currentInputType].call(this);
            this.picker.builder.timeofday(parseInt(this.currentValuesList[0]), parseInt(this.currentValuesList[1]), parseInt(this.currentValuesList[2]));
            this.currentdisplayTarget = $('.displayer .display-item[data-type=timeofday] .display-char').sub(0);
            this.currentPickerType = 'hour';
            _.dom.addClass(this.picker.display.timeofday, 'actived');
            var that = this;
            setTimeout(function() {
                that.picker.builder.hoursListbuild(parseInt(that.currentValuesList[0]));
            }, 500);
        },
        hourminute: function() {
            checkInputValue[this.currentInputType].call(this);
            this.picker.builder.hourminute(parseInt(this.currentValuesList[0]), parseInt(this.currentValuesList[1]));
            this.currentdisplayTarget = $('.displayer .display-item[data-type=hourminute] .display-char').sub(0);
            this.currentPickerType = 'hour';
            _.dom.addClass(this.picker.display.hourminute, 'actived');
            var that = this;
            setTimeout(function() {
                that.picker.builder.hoursListbuild(parseInt(that.currentValuesList[0]));
            }, 500);
        },
        dayofweek: function() {
            checkInputValue[this.currentInputType].call(this);
            this.picker.builder.dayofweek(parseInt(this.currentValuesList[0]));
            this.currentdisplayTarget = $('.displayer .display-item[data-type=dayofweek] .display-char').sub(0);
            this.currentPickerType = 'day';
            _.dom.addClass(this.picker.display.dayofweek, 'actived');
            var that = this;
            setTimeout(function() {
                that.picker.builder.daysListbuild(parseInt(that.currentValuesList[0]));
            }, 500);
        }
    });
});