/*!
 * tangram.js framework source code
 *
 * class popup.Dialog
 *
 * Date 2017-04-06
 */
;
tangram.block(['$_/util/COM', '$_/dom/Elements'], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console,
        location = global.location;
    var $ = _.dom.select;

    declare('see.popup.Dialog', _.util.COM, {
        mask: undefined,
        maskBgColor: 'transparent',
        maskOpacity: 0,
        layerIndex: 10000,
        document: undefined,
        closer: undefined,
        docPosition: 'Top',
        docWidthMax: 0,
        docHeightMax: 0,
        _init: function(elem) {
            this.Element = elem || function() {
                var div = doc.createElement('div');
                div.className = 'tangram popup';
                div.style.position = 'fixed';
                div.innerHTML = '<div class="popup-mask"></div><div class="popup-document"></div>';
                doc.body.appendChild(div);
                return div;
            }();
            this.mask = $('.popup-mask', this.Element).get(0);
            this.document = $('.popup-document', this.Element).get(0);
        },
        builder: function() {
            _.dom.setStyle(this.Element, 'display', 'none');
            _.dom.setStyle(this.Element, 'z-index', -100);
            if (this.mask) {
                _.dom.setStyle(this.mask, 'z-index', 0);
                _.dom.setStyle(this.mask, 'background-color', this.maskBgColor);
                _.dom.setStyle(this.mask, 'opacity', this.maskOpacity);
            }
            this.document && _.dom.setStyle(this.document, 'z-index', 100);
            this.closer && _.dom.setStyle(this.closer, 'z-index', 200);
            return this.bind();
        },
        on: function() {
            this.state = true;
            _.dom.setStyle(this.Element, 'display', 'block');
            return this;
        },
        off: function() {
            this.state = false;
            _.dom.setStyle(this.Element, 'display', 'none');
            return this;
        },
        show: function(content) {
            if (!this.status) {
                this.on();
                _.dom.setStyle(this.Element, 'z-index', this.layerIndex);
                this.render(content).onshow();
            }
            return this;
        },
        hide: function() {
            if (this.status) {
                this.off().onhide();
            }
            return this;
        },
        render: function(content) {
            var size = _.dom.getSize(this.Element);
            var DocWidth = this.documentWidthMax <= size.width ? this.documentWidthMax : size.width;
            var DocHeight = this.documentHeightMax <= size.height ? this.documentHeightMax : size.height;
            _.dom.setStyle(this.document, 'width', DocWidth);
            _.dom.setStyle(this.document, 'height', DocHeight);
            _.dom.setStyle(this.document, 'margin-left', -1 * DocWidth / 2);
            _.dom.setStyle(this.document, 'margin-top', -1 * DocHeight / 2);
            if (content) {
                if (_.util.bool.isEl(content)) {
                    this.Doc.appendChild(content);
                } else if (_.util.bool.isStr(content)) {
                    this.Doc.innerHTML = content;
                }
            }
            switch (this.documentPosition) {
                case 'Top':
                    _.dom.setStyle(this.document, 'margin-top', -1 * size.height / 2);
                    break;
                case 'Middle':
                    _.dom.setStyle(this.document, 'margin-top', -1 * DocHeight / 2);
                    break;
                case 'Bottom':
                    _.dom.setStyle(this.document, 'margin-top', size.height / 2 - DocHeight);
                    break;
            }
            return this;
        },
        bind: function() {
            var that = this;
            new _.dom.Events(global).push('resize', null, null, function() {
                that.state && that.render();
            });
            if (this.closer) {
                new _.dom.Events(this.closer).push('click', null, null, function() {
                    that.off();
                });
            } else {
                new _.dom.Events(this.mask).push('click', null, null, function() {
                    that.off();
                });
            }
            return this;
        },
        onshow: _.self,
        onhide: _.self
    });
});