/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Sat, 05 May 2018 06:22:21 GMT
 */
;
// tangram.config({});
tangram.init().block([
	'$_/app/Application'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var _ = pandora;
	var app = function (elem) {
		return new _.app.Application(elem);
	}
	pandora.app = app;
});
//# sourceMappingURL=app.js.map