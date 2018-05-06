/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Sun, 06 May 2018 13:10:48 GMT
 */
;
// tangram.config({});
tangram.init().block([], function (pandora, root, imports, undefined) {
	var module = this.module;
	var en = {
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
		today: "today",
		suffix: [],
		meridiem: []
	};
	pandora.locales('times', {
		'en': en,
		'en-GB': en,
		'en-UK': en,
		'en-US': en
	});
});
//# sourceMappingURL=en.js.map