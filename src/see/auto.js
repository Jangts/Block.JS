/*!
 * tangram.js framework source code
 *
 * class see.Sticker,
 *
 * Date: 2017-04-06
 */
;
tangram.auto([
    '$_/see/NavMenu/',
    '$_/see/Scrollbar/',
    '$_/see/Tabs/SlideTabs.cls',
    '$_/see/ListView/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        location = global.location,
        $ = _.dom.select;

    _.extend(_.see.Scrollbar, {
        auto: function() {
            $('.tangram.scrollbar[data-ic-auto]').each(function() {
                if (($(this).data('icAuto') != 'false') && ($(this).data('icRendered') != 'scrollbar')) {
                    $(this).data('icRendered', 'scrollbar');
                    new _.see.Scrollbar(this, {
                        theme: $(this).data('scbarTheme') || 'default-light',
                    });
                }
            });
        }
    });

    _.see.NavMenu.auto();
    _.see.Scrollbar.auto();
    _.see.Tabs.auto();
    _.see.Tabs.SlideTabs.auto();
    _.see.ListView.auto();
});