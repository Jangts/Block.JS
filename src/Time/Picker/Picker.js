/*!
 * tangram.js framework source code
 *
 * class dom.Events
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/Component/',
    '$_/dom/Elements',
    '$_/Time/Month',
    // '$_/Time/Picker/events.tmp',
    '$_/Time/Picker/Builder',
    '$_/Time/Picker/Launcher',
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document;

    var $ = _.dom.select;

    // 注册_.Time命名空间到pandora
    _('Time');

    var eventhandlers = {
        '.displayer .display-item .display-char': {
            'click': function (event) {
                var picker = event.data,
                    builder = picker.builder,
                    launcher = picker.launcher,
                    type = _.dom.getAttr(this, 'data-char-type'),
                    value = parseInt(_.dom.getAttr(this, 'data-value'));
                switch (type) {
                    case 'year':
                        launcher.currentdisplayTarget = $(this);
                        launcher.clearPickers(type);
                        builder.yearsListbuild(launcher.currentFirstYear, value);
                        break;
                    case 'mon':
                    case 'month':
                        launcher.currentdisplayTarget = $(this);
                        launcher.clearPickers(type);
                        builder.monthsListbuild(value);
                        break;
                    case 'date':
                        launcher.currentdisplayTarget = $(this);
                        launcher.clearPickers(type);
                        switch (launcher.currentInputType) {
                            case 'datetime':
                            case 'fulldate':
                                var month = new _.Time.Month(parseInt(launcher.currentValuesList[1]) + 1, parseInt(launcher.currentValuesList[0]));
                                var firstDay = month.firstDay,
                                    count = month.length,
                                    selectedDate = value,
                                    hideDayOfWeek = false;
                                break;
                            case 'dayofyear':
                                var firstDay = 0;
                                switch (parseInt(launcher.currentValuesList[0])) {
                                    case 2:
                                        var count = 29;
                                        break;
                                    case 4:
                                    case 6:
                                    case 9:
                                    case 11:
                                        var count = 30;
                                        break;
                                    default:
                                        var count = 31;
                                        break;
                                }
                                selectedDate = value,
                                    hideDayOfWeek = true;
                                break;
                        }
                        builder.datesListbuild(firstDay, count, selectedDate, hideDayOfWeek);
                        break;
                    case 'hour':
                        launcher.currentdisplayTarget = $(this);
                        launcher.clearPickers(type);
                        builder.hoursListbuild(value);
                        break;
                    case 'minute':
                    case 'first':
                    case 'second':
                        launcher.currentdisplayTarget = $(this);
                        launcher.clearPickers(type);
                        builder.minutesListbuild(value);
                        break;
                    case 'day':
                        launcher.currentdisplayTarget = $(this);
                        launcher.clearPickers(type);
                        builder.daysListbuild(value);
                        break;
                }
            }
        },
        '.buttons span': {
            'click': function (event) {
                var picker = event.data,
                    launcher = picker.launcher,
                    type = _.dom.getAttr(this, 'data-type');
                switch (type) {
                    case 'reset':
                        picker.launch(launcher.currentInputValue, launcher.currentInputType);
                        break;
                    case 'cancel':
                        picker.cancelCallback(picker.result());
                        // launcher.clearDisplay();
                        // launcher.clearPickers();
                        break;
                    case 'confirm':
                        picker.confirmCallback(picker.result());
                        // launcher.clearDisplay();
                        // launcher.clearPickers();
                        break;
                }
            }
        },
        '.pickers ul li[data-value]': {
            'click': function (event) {
                var picker = event.data,
                    builder = picker.builder,
                    launcher = picker.launcher,
                    value = parseInt(_.dom.getAttr(this, 'data-value'));
                $('.pickers .selected', picker.Element).removeClass('selected');
                _.dom.addClass(this, 'selected');
                launcher.currentdisplayTarget.attr('data-value', value);
                picker.resetValue(value);
                launcher.currentdisplayTarget.html(builder.format(launcher.currentPickerType, value));
            }
        },
        '.pickers ul li.prev': {
            'click': function (event) {
                var picker = event.data,
                    builder = picker.builder,
                    launcher = picker.launcher;
                launcher.currentFirstYear -= 60;
                if (launcher.currentFirstYear == -59) {
                    launcher.currentFirstYear = -60;
                }
                builder.yearsListbuild(launcher.currentFirstYear, parseInt(launcher.currentValuesList[0]));
            }
        },
        '.pickers ul li.next': {
            'click': function (event) {
                var picker = event.data,
                    builder = picker.builder,
                    launcher = picker.launcher;
                launcher.currentFirstYear += 60;
                if (launcher.currentFirstYear == 0) {
                    launcher.currentFirstYear = 1;
                }
                builder.yearsListbuild(launcher.currentFirstYear, parseInt(launcher.currentValuesList[0]));
            }
        }
    };

    declare('Time.Picker', _.Component, {
        confirmCallback: null,
        cancelCallback: null,
        _init: function(elem) {
            elem = _.util.type.isElement(elem) ? elem : doc.getElementById(elem);
            if (elem) {
                elem.innerHTML = '';
                _.dom.addClass(elem, 'tangram-timepicker');
                this.Element = elem;
                this.build();
                this.builder = new _.Time.Picker.Builder(this);
                this.launcher = new _.Time.Picker.Launcher(this);
            }
        },
        build: function() {
            var display = _.dom.create('div', this.Element, {
                    className: 'displayer'
                }),
                Buttons = _.dom.create('div', this.Element, {
                    className: 'buttons',
                    html: '<span data-type="reset">Reset</span><span data-type="cancel">Cancel</span><span data-type="confirm">Confirm</span>'
                }),
                pickers = _.dom.create('div', this.Element, {
                    className: 'pickers'
                });
            this.display = {
                datetime: _.dom.create('section', display, {
                    className: 'display-item',
                    'data-type': 'datetime'
                }),
                fulldate: _.dom.create('section', display, {
                    className: 'display-item',
                    'data-type': 'fulldate'
                }),
                dayofyear: _.dom.create('section', display, {
                    className: 'display-item',
                    'data-type': 'dayofyear'
                }),
                timeofday: _.dom.create('section', display, {
                    className: 'display-item',
                    'data-type': 'timeofday'
                }),
                hourminute: _.dom.create('section', display, {
                    className: 'display-item',
                    'data-type': 'hourminute'
                }),
                dayofweek: _.dom.create('section', display, {
                    className: 'display-item',
                    'data-type': 'dayofweek'
                })
            }

            this.pickers = {
                YearsPicker: _.dom.create('section', pickers, { html: '<ul></ul>', 'data-type': 'years' }),
                MonthsPicker: _.dom.create('section', pickers, { html: '<ul></ul>', 'data-type': 'months' }),
                DatesPicker: _.dom.create('section', pickers, { html: '<ul></ul>', 'data-type': 'dates' }),
                HoursPicker: _.dom.create('section', pickers, { html: '<ul></ul>', 'data-type': 'hours' }),
                MinutesPicker: _.dom.create('section', pickers, { html: '<ul></ul>', 'data-type': 'minutes' }),
                DaysPicker: _.dom.create('section', pickers, { html: '<ul></ul>', 'data-type': 'days' })
            }

            //
            return this.listenEvents();
        },
        launch: function(value, type, confirmCallback, cancelCallback) {
            this.launcher.clearDisplay();
            this.launcher.clearPickers();
            this.launcher.currentInputValue = value;
            if (_.util.bool.isFn(confirmCallback)) {
                this.confirmCallback = confirmCallback;
            }
            if (_.util.bool.isFn(cancelCallback)) {
                this.cancelCallback = cancelCallback;
            }
            switch (type) {
                case 'fulldate':
                    this.launcher.currentInputType = type;
                    //CurrentInputValue = '2016-02-26';
                    this.launcher.fulldate();
                    break;
                case 'dayofyear':
                    this.launcher.currentInputType = type;
                    //CurrentInputValue = '2-26';
                    this.launcher.dayofyear();
                    break;
                case 'localmonth':
                    break;
                case 'shortmonth':
                    break;
                case 'numbermonth':
                    break;
                case 'timeofday':
                    this.launcher.currentInputType = type;
                    //CurrentInputValue = '13:30:00';
                    this.launcher.timeofday();
                    break;
                case 'hourminute':
                    this.launcher.currentInputType = type;
                    //CurrentInputValue = '13:30';
                    this.launcher.hourminute();
                    break;
                case 'dayofweek':
                    this.launcher.currentInputType = type;
                    //CurrentInputValue = '0';
                    this.launcher.dayofweek();
                    break;
                default:
                    this.launcher.currentInputType = 'datetime';
                    //CurrentInputValue = '2016-02-26 13:30:00';
                    this.launcher.datetime();
            }
        },
        resetValue: function(value) {
            switch (this.launcher.currentInputType) {
                case 'datetime':
                case 'fulldate':
                    switch (this.launcher.currentPickerType) {
                        case 'year':
                            this.launcher.currentValuesList[0] = value;
                            break;
                        case 'mon':
                            this.launcher.currentValuesList[1] = value;
                            break;
                        case 'date':
                            this.launcher.currentValuesList[2] = value;
                            break;
                        case 'hour':
                            this.launcher.currentValuesList[3] = value;
                            break;
                        case 'first':
                            this.launcher.currentValuesList[4] = value;
                            break;
                        case 'second':
                            this.launcher.currentValuesList[5] = value;
                            break;
                    }
                    break;

                case 'dayofyear':
                    switch (this.launcher.currentPickerType) {
                        case 'month':
                            this.launcher.currentValuesList[0] = value;
                            break;
                        case 'date':
                            this.launcher.currentValuesList[1] = value;
                            break;
                    }
                    break;

                case 'timeofday':
                    switch (this.launcher.currentPickerType) {
                        case 'hour':
                            this.launcher.currentValuesList[0] = value;
                            break;
                        case 'first':
                            this.launcher.currentValuesList[1] = value;
                            break;
                        case 'second':
                            this.launcher.currentValuesList[2] = value;
                            break;
                    }
                    break;

                case 'hourminute':
                    switch (this.launcher.currentPickerType) {
                        case 'hour':
                            this.launcher.currentValuesList[0] = value;
                            break;
                        case 'minute':
                            this.launcher.currentValuesList[1] = value;
                            break;
                    }
                    break;

                case 'dayofweek':
                    this.launcher.currentValuesList[0] = value;
                    break;
            }
        },
        result: function() {
            switch (this.launcher.currentInputType) {
                case 'datetime':
                    return this.launcher.currentValuesList[0] +
                        '-' + this.builder.format('mon', this.launcher.currentValuesList[1]) +
                        '-' + this.builder.format('date', this.launcher.currentValuesList[2]) +
                        ' ' + this.builder.format('hour', this.launcher.currentValuesList[3]) +
                        ':' + this.builder.format('first', this.launcher.currentValuesList[4]) +
                        ':' + this.builder.format('second', this.launcher.currentValuesList[5]);

                case 'fulldate':
                    return this.launcher.currentValuesList[0] +
                        '-' + this.builder.format('mon', this.launcher.currentValuesList[1]) +
                        '-' + this.builder.format('date', this.launcher.currentValuesList[2]);

                case 'dayofyear':
                    return this.builder.format('m', this.launcher.currentValuesList[0]) +
                        '-' + this.builder.format('date', this.launcher.currentValuesList[1]);

                case 'timeofday':
                    return this.builder.format('hour', this.launcher.currentValuesList[0]) +
                        ':' + this.builder.format('first', this.launcher.currentValuesList[1]) +
                        ':' + this.builder.format('second', this.launcher.currentValuesList[2]);

                case 'hourminute':
                    return this.builder.format('hour', this.launcher.currentValuesList[0]) +
                        ':' + this.builder.format('minute', this.launcher.currentValuesList[1]);

                case 'dayofweek':
                    return this.launcher.currentValuesList[0];
            }
        },
        listenEvents: function() {
            var that = this;
            _.each(eventhandlers, function(selector, handlers) {
                _.each(handlers, function(eventType, handler) {
                    _.dom.events.remove(that.Element, eventType, selector, handler);
                    _.dom.events.add(that.Element, eventType, selector, that, handler);
                });
            });
            return this;
        }
    });
});