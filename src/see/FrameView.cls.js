/*!
 * Block.JS Framework Source Code
 *
 * class see.FrameView,
 *
 * Date: 2017-04-06
 */
;
block([
    '$_/util/bool.xtd',
    '$_/dom/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        location = global.location,
        infinity = global.Number.POSITIVE_INFINITY,
        $ = _.dom.select;

    _('see');

    var initScrollTop = $(document.body).scrollTop(),
        handlers = {};

    declare('see.FrameView', {
        state: false,
        Element: null,
        frame: null,
        histories: null,
        nextIndex: 0,
        _init(elem) {
            this.Element = _.util.bool.isStr(elem) ? _.dom.query.byId(elem) : elem;
            this.frame = _.dom.create('iframe', this.Element, {
                width: '100%',
                height: '100%'
            });
            this.histories = [];
        },
        on() {
            this.state = true;
            _.dom.setAttr(this.Element, 'state', 'on');
            return this;
        },
        off() {
            this.state = false;
            _.dom.setAttr(this.Element, 'state', 'off');
            return this;
        },
        load(url, isnew) {
            this.on().frame.src = url;
            if (isnew === true) {
                this.histories.length = this.nextIndex;
                this.histories.push(url);
                this.nextIndex = this.histories.length;
            }
            var that = this;
            this.frame.onload = function() {
                console.log(this.location);
                that.onload(this);
            }
            this.frame.onload.onhashchange = function() {
                console.log(this, that.frame.location, that.frame.location.hash);
            }
            _.dom.setStyle(this.Element, { overflowY: 'hidden' }).setStyle(this.frame, {
                height: '100%',
                overflow: 'auto'
            });
            return this;
        },
        onload(frame) {
            _.dom.setStyle(this.Element, { overflowY: 'hidden' }).setStyle(this, {
                height: '100%',
                overflow: 'auto'
            });
            try {
                var frameSize = _.dom.getSize(frame.contentWindow.document.body);
            } catch (error) {
                frame.scrolling = 'auto';
                return;
            }
            _.dom.setStyle(frame, {
                height: frameSize.height,
                overflow: 'hidden'
            });
            _.dom.setStyle(this.Element, { overflowY: 'auto' });
        },
        refresh() {
            return this.load(this.histories[this.nextIndex - 1]);
        },
        loadPrev() {
            if (this.nextIndex > 1) {
                this.nextIndex--;
                this.request(this.histories[this.nextIndex - 1])
            }
            return this;
        },
        loadNext() {
            if (this.nextIndex < this.histories.length) {
                this.nextIndex++;
                this.request(this.histories[this.nextIndex - 1])
            }
            return this;
        },
        loadText(html) {
            this.launch().frame.srcdoc = html;
            return this;
        },
        resize() {
            return this;
        }
    });
});