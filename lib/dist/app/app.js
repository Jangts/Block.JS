/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Sat, 12 May 2018 17:51:05 GMT
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