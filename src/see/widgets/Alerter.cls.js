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
    '$_/dom/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        location = global.location;

    declare('see.widgets.Alerter', _.util.COM, {
        current: 0,
        _init: function(elem) {
            if (elem) {
                this.Element = elem;
                this.messages = [];
                this.vision = _.dom.query('.msgbox', elem)[0];
                if (this.vision) {
                    this.title = _.dom.query('.msgtit', this.vision)[0];
                    this.content = _.dom.query('.msgcon', this.vision)[0];
                    this.buttons = _.dom.query('.msgbtn', this.vision)[0];
                }
            }
        },
        push: function(msg) {
            this.messages.push(msg);
            this.current || this.listener();
            return this;
        },
        on: function() {
            this.state = true;
            _.dom.toggleClass(this.Element, 'actived', true);
            return this;
        },
        off: function() {
            this.state = false;
            _.dom.toggleClass(this.Element, 'actived', false);
            return this;
        },
        listener: function() {
            this.off();
            if (this.messages[this.current]) {
                this.show();
            } else {
                this.hide();
            }
            return this;
        },
        show: function(i) {
            this.render().on().onhide();
            return this.resize();
        },
        hide: function() {
            this.messages = [];
            this.title.innerHTML = '';
            this.content.innerHTML = '';
            this.buttons.innerHTML = '';
            this.current = 0;
            return this.onhide();
        },
        render: function() {
            this.title.innerHTML = this.messages[this.current].title;
            this.content.innerHTML = this.messages[this.current].content;
            this.buttons.innerHTML = this.messages[this.current].buttons;
            this.current++;
            return this.resize();
        },
        resize: function() {
            if (this.state) {
                var winSize = _.dom.getSize(global);
                var contentHeightMax = winSize['height'] - 100;
                var contentSize = _.dom.getSize(this.content);
                var contentHeight = contentSize.height > contentHeightMax ? contentHeightMax : contentSize.height;
                var visionHeight = contentHeight + 100;
                var visionMarginTop = visionHeight / -2;

                _.dom.setStyle(this.vision, {
                    height: visionHeight,
                    marginTop: visionMarginTop
                });
                _.dom.setStyle(this.content, {
                    height: contentHeight,
                });
            }
            return this;
        },
        bind: function() {
            var that = this,
                handler = function(event) {
                    var type = _.dom.getAttr(this, 'data-exec');
                    if (type && type != '') {
                        var msg = that.messages[that.current - 1] ? that.messages[that.current - 1].handlers : {};
                        switch (type) {
                            case 'confirm':
                            case 'resolve':
                                _.util.bool.isFn(msg.done) && msg.done.call(msg);
                                break;
                            case 'reject':
                                _.util.bool.isFn(msg.fail) && msg.fail.call(msg);
                                break;
                            case 'cancel':
                                _.util.bool.isFn(msg.undo) && msg.undo.call(msg);
                                break;
                        }
                        _.util.bool.isFn(msg.always) && msg.always.call(msg);
                        that.listener();
                    }
                };
            _.dom.events.remove(this.Element, 'click');
            _.dom.events.add(this.Element, 'click', 'click', null, handler);
            return this;
        },
        onshow: _.self,
        onhide: _.self
    });
});