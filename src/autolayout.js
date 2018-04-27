/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Wed, 25 Apr 2018 00:54:00 GMT
 */
;
// tangram.config({});
tangram.block([
	'$_/see/Scrollbar/',
	'$_/see/Tabs/SlideTabs',
	'$_/see/ListView',
	'$_/see/NavMenu'
], function (pandora, global, imports, undefined) {
	var _ = pandora;
	var doc = global.document;
	var location = global.location;
	var $ = _.dom.select;
	pandora.extend(_.see.Scrollbar, {
		auto: function () {
$('.tangram-see.scrollbar[data-ic-auto]').each(function () {
				if(($(this).data('icAuto') != 'false') && ($(this).data('icRendered') != 'scrollbar'))  {
$(this).data('icRendered', 'scrollbar');
					 new _.see.Scrollbar(this, {
						theme: $(this).data('scbarTheme') || 'default-light'
					});
				};
			});
		}
	});
	_.see.NavMenu.auto();
	_.see.Scrollbar.auto();
	_.see.Tabs.auto();
	_.see.Tabs.SlideTabs.auto();
	_.see.ListView.auto();
}, true);