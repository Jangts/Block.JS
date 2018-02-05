/*!
 * Block.JS Framework Source Code
 *
 * locales.en.times
 *
 * Date 2017-04-06
 */
;
block(function(pandora, global, undefined) {
    var _ = pandora;

    var en = {
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
        today: "today",
        suffix: [],
        meridiem: []
    }

    _.locales('times', {
        'en': en,
        'en-gb': en,
        'en-uk': en,
        'en-us': en
    });
});