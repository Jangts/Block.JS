/*!
 * Block.JS Framework Source Code
 *
 * class util.COM
 *
 * Date 2017-04-06
 */
;
block(['$_/util/type.xtd'], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console,
        location = global.location;

    declare('util.COM', {
        id: null,
        state: false,
        viewstatus: false,
        actived: false,
        name: 'Base Component',
        Element: null,
        _init: function(elem) {
            this.id = new _.Identifier().toString();
            this.Element = _.util.type.isElement(elem) ? elem : document.getElementById(elem) || document;
            this.Element.setAttribute('id', this.id);
            return this;
        },
        on: function() {
            this.state = true;
            this.setAttr('data-status', 'on');
            return this;
        },
        off: function() {
            this.state = false;
            this.setAttr('data-status', 'off');
            return this;
        },
        toggleStatus: function() {
            if (this.status) {
                return this.off();
            } else {
                return this.on();
            }
        },
        setAttr: function(atrr, value) {
            this.Element.setAttribute(atrr, value);
            return this;
        },
        getAttr: function(atrr) {
            return this.Element.getAttribute(atrr);
        },
        removeAttr: function(atrr) {
            this.Element.removeAttribute(atrr);
            return this;
        },
        setStyle: function(pros, value) {
            this.Element.style[pros] = value;
            return this;
        },
        getStyle: function(pros, value) {
            return this.Element.style[pros];
        },
        render: function(data) {
            return this.onload();
        },
        onload: _.self,
        resize: function() {
            return this.onresize();
        },
        onresize: _.self,
        dest: function() {
            this.onbeforedestroy();
            var parent = this.Element && this.Element.parentNode;
            if (parent) {
                parent.removeChild && parent.removeChild(this.Element);
            }
            this.onafterdestroy();
        },
        onbeforedestroy: _.self,
        onafterdestroy: _.self
    });
});