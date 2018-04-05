/*!
 * tangram.js framework source code
 *
 * http://www.yangram.net/tangram.js/
 *
 * Date: 2017-04-06
 */
;
tangram.block([
    '$_/util/bool.xtd',
    '$_/dom/Elements/animation.clsx'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        location = global.location,
        $ = _.dom.select;



    declare('see.ListView', {
        _init: function(elem) {
            this.Element = _.util.bool.isStr(elem) ? _.dom.query.byId(elem) : elem;
            if (_.util.bool.isEl(this.Element)) {
                this.render();
            }
        },
        render: function() {
            if (_.dom.hasClass(this.Element, 'media-list')) {
                var itemWidth, mediaWidth, bodyWidth;
                $('.tangram.listview.media-list>.list-item', this.Element).each(function() {
                    if (_.dom.hasClass(this, 'top-bottom')) {
                        return this;
                    }
                    itemWidth = $(this).innerWidth();
                    mediaWidth = Math.ceil($('.list-figure,.list-image, img', this).outerWidth(true));
                    bodyWidth = itemWidth - mediaWidth - 1;
                    $('.list-body', this).sub(0).width(bodyWidth);
                    // console.log(itemWidth, mediaWidth, $('.list-body', this).sub(0));

                });
                return this;
            }
        }
    });

    _.extend(_.see.ListView, {
        auto: function() {
            var ListView = this;
            $('.tangram.listview[data-ic-auto]').each(function() {
                if (($(this).data('icAuto') != 'false') && ($(this).data('icRendered') != 'listview')) {
                    $(this).data('icRendered', 'listview');
                    new ListView(this);
                }
            });
        }
    });
});