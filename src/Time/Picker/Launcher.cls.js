tangram.block([
    '$_/dom/Elements/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console,
        $ = _.dom.select;

    var checkInputValue = {
        datetime() {
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
        fulldate() {
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
        localmonth() {},
        shortmonth() {},
        numbermonth() {},
        dayofyear() {
            this.currentInputValue = this.currentInputValue.trim();
            if (/^\d{1,2}\s*\-\s*\d{1,2}$/.test(this.currentInputValue) == false) {
                this.currentInputValue = new _.Time().format('yyyy-MM');
            }
            this.currentValuesList = this.currentInputValue.split(/[\-\s]+/);
            this.currentValuesList[1] = parseInt(this.currentValuesList[1]) - 1;
        },
        timeofday() {
            this.currentInputValue = this.currentInputValue.trim();
            if (/^\d{1,2}\s*:\s*\d{1,2}\s*:\s*\d{1,2}$/.test(this.currentInputValue) == false) {
                this.currentInputValue = new _.Time().format('hh:mm:ss');
            }
            this.currentValuesList = this.currentInputValue.split(/[\:\s]+/);
        },
        hourminute() {
            this.currentInputValue = this.currentInputValue.trim();
            if (/^\d{1,2}\s*:\s*\d{1,2}$/.test(this.currentInputValue) == false) {
                this.currentInputValue = new _.Time().format('hh:mm');
            }
            this.currentValuesList = this.currentInputValue.split(/[\:\s]+/);
        },
        dayofweek() {
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
        clearDisplay() {
            _.each(this.picker.display, (i, el) => {
                _.dom.removeClass(el, 'actived');
            });
        },
        clearPickers(type) {
            if (this.currentPickerType != type) {
                $('.pickers section').removeClass('actived');
                this.currentPickerType = type;
            }
        },
        datetime() {
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
            setTimeout(() => {
                this.picker.builder.yearsListbuild(this.currentFirstYear, parseInt(this.currentValuesList[0]));
            }, 500);
        },
        fulldate() {
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
            setTimeout(() => {
                this.picker.builder.yearsListbuild(this.currentFirstYear, parseInt(this.currentValuesList[0]));
            }, 500);
        },
        localmonth() {},
        shortmonth() {},
        numbermonth() {},
        dayofyear() {
            checkInputValue[this.currentInputType].call(this);
            this.currentValuesList[1] = parseInt(this.currentValuesList[1]) - 1;
            this.picker.builder.dayofyear(parseInt(this.currentValuesList[0]), this.currentValuesList[1]);
            this.currentdisplayTarget = $('.displayer .display-item[data-type=dayofyear] .display-char').sub(0);
            this.currentPickerType = 'month';
            _.dom.addClass(this.picker.display.dayofyear, 'actived');
            setTimeout(() => {
                this.picker.builder.monthsListbuild(parseInt(this.currentValuesList[0]) - 1);
            }, 500);
        },
        timeofday() {
            checkInputValue[this.currentInputType].call(this);
            this.picker.builder.timeofday(parseInt(this.currentValuesList[0]), parseInt(this.currentValuesList[1]), parseInt(this.currentValuesList[2]));
            this.currentdisplayTarget = $('.displayer .display-item[data-type=timeofday] .display-char').sub(0);
            this.currentPickerType = 'hour';
            _.dom.addClass(this.picker.display.timeofday, 'actived');
            setTimeout(() => {
                this.picker.builder.hoursListbuild(parseInt(this.currentValuesList[0]));
            }, 500);
        },
        hourminute() {
            checkInputValue[this.currentInputType].call(this);
            this.picker.builder.hourminute(parseInt(this.currentValuesList[0]), parseInt(this.currentValuesList[1]));
            this.currentdisplayTarget = $('.displayer .display-item[data-type=hourminute] .display-char').sub(0);
            this.currentPickerType = 'hour';
            _.dom.addClass(this.picker.display.hourminute, 'actived');
            setTimeout(() => {
                this.picker.builder.hoursListbuild(parseInt(this.currentValuesList[0]));
            }, 500);
        },
        dayofweek() {
            checkInputValue[this.currentInputType].call(this);
            this.picker.builder.dayofweek(parseInt(this.currentValuesList[0]));
            this.currentdisplayTarget = $('.displayer .display-item[data-type=dayofweek] .display-char').sub(0);
            this.currentPickerType = 'day';
            _.dom.addClass(this.picker.display.dayofweek, 'actived');
            setTimeout(() => {
                this.picker.builder.daysListbuild(parseInt(this.currentValuesList[0]));
            }, 500);
        }
    });
});