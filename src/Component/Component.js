/*!
 * tangram.js framework source code
 *
 * class Component
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/obj/Observer/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console,
        location = global.location;

    var observe = _.obj.observe,
        watch = _.obj.watch;


    declare('Component',{
        id: null,
        state: false,
        viewstatus: false,
        actived: false,
        name: 'Base Component',
        Element: null,
        _init: function (elem) {
            this.id = new _.Identifier().toString();
            this.Element = _.util.type.isElement(elem) ? elem : doc.getElementById(elem) || document;
            this.Element.setAttribute('id', this.id);
            return this;
        },
        _observe: function () {
            if (!this._observer) {
                observe(this);
            }
            return this;
        },
        _listen: function (attr, writeCallback, readCallback) {
            this._observer.listen(attr, writeCallback, readCallback);
            return this;
        },
        on: function () {
            this.state = true;
            this.setAttr('data-app-state', 'on');
            return this;
        },
        off: function () {
            this.state = false;
            this.setAttr('data-app-state', 'off');
            return this;
        },
        toggleStatus: function () {
            if (this.status) {
                return this.off();
            } else {
                return this.on();
            }
        },
        setAttr: function (atrr, value) {
            this.Element.setAttribute(atrr, value);
            return this;
        },
        getAttr: function (atrr) {
            return this.Element.getAttribute(atrr);
        },
        removeAttr: function (atrr) {
            this.Element.removeAttribute(atrr);
            return this;
        },
        setStyle: function (pros, value) {
            this.Element.style[pros] = value;
            return this;
        },
        getStyle: function (pros, value) {
            return this.Element.style[pros];
        },
        render: function (data) {
            return this.onload();
        },
        onload: _.self,
        resize: function () {
            return this.onresize();
        },
        onresize: _.self,
        dest: function () {
            this.onbeforedestroy();
            var parent = this.Element && this.Element.parentNode;
            if (parent) {
                parent.removeChild && parent.removeChild(this.Element);
            }
            this.onafterdestroy();
        },
        attr: function(attr, val) {
            if (val === undefined) {
                return this.getAttr(attr);
            } else {
                this.setAttr(attr, val);
            }
            return this;
        },
        launch: function(href) {
            this.on();
            return this.onlaunch(href);
        },
        awake: function() {
            this.actived = true;
            this.setAttr('actived', 'true');
            return this.on();
        },
        sleep: function() {
            this.actived = false;
            this.removeAttribute('actived');
            return this.onsleep();
        },
        onbeforedestroy: _.self,
        onafterdestroy: _.self,
        onlaunch: _.self,
        onawake: _.self
    });
});