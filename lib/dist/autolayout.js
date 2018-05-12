/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Sat, 12 May 2018 18:29:31 GMT
 */
;
// tangram.config({});
tangram.block([
	'$_/see/Scrollbar/',
	'$_/see/Tabs/SlideTabs',
	'$_/see/ListView',
	'$_/see/NavMenu'
], function (pandora, root, imports, undefined) {
	var see = pandora.ns('see', {});
	var _ = pandora;
	var $ = _.dom.select;
	pandora.ns('see.Scrollbar', {
		auto: function () {
			$('.tangram-see.scrollbar[data-ic-auto]').each(function () {
				if (($(this).data('icAuto') != 'false') && ($(this).data('icRendered') != 'scrollbar')) {
					$(this).data('icRendered', 'scrollbar');
					new pandora.see.Scrollbar(this, {
						theme: $(this).data('scbarTheme') || 'default-light'
					});
				};
			});
		}
	});
	pandora.see.NavMenu.auto();
	pandora.see.Scrollbar.auto();
	pandora.see.Tabs.auto();
	pandora.see.Tabs.SlideTabs.auto();
	pandora.see.ListView.auto();
}, true);
//# sourceMappingURL=autolayout.js.map