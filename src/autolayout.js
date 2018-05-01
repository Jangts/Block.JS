/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Mon, 30 Apr 2018 17:12:24 GMT
 */
;
// tangram.config({});
tangram.block([
    /* @posi0 */
    '$_/see/Scrollbar/',
    /* @posi1 */
    '$_/see/Tabs/SlideTabs',
    /* @posi2 */
    '$_/see/ListView',
    /* @posi3 */
    '$_/see/NavMenu'
], function(pandora, root, imports, undefined) {
    var _ = pandora;
    var doc = root.document;
    var location = root.location;
    var $ = _.dom.select;
    pandora.extend(_.see.Scrollbar, {
        auto: function() {
            $('.tangram-see.scrollbar[data-ic-auto]').each(function() {
                if (($(this).data('icAuto') != 'false') && ($(this).data('icRendered') != 'scrollbar')) {
                    $(this).data('icRendered', 'scrollbar')
                    new _.see.Scrollbar(this, {
                        theme: $(this).data('scbarTheme') || 'default-light'
                    });
                }
            })
        }
    });
    _.see.NavMenu.auto();
    _.see.Scrollbar.auto();
    _.see.Tabs.auto();
    _.see.Tabs.SlideTabs.auto();
    _.see.ListView.auto();
}, true);