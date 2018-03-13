tangram.block([
    '$_/dom/',
    '$_/Time/Month.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console,
        $ = _.dom.select;

    var
        eventhandlers = {
            '.displayer .display-item .display-char': {
                'click' (event) {
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
                'click' (event) {
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
                'click' (event) {
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
                'click' (event) {
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
                'click' (event) {
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

    cache.save(eventhandlers, 'TIMEPICKER_EVENTS');
});