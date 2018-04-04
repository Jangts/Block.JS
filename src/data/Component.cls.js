/*!
 * tangram.js framework source code
 *
 * class data.Component
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/util/COM.cls',
    '$_/data/Observer/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console,
        location = global.location;

    var observe = _.data.observe,
        watch = _.data.watch;


    declare('data.Component', _.util.COM, {
        _init: function(elem) {
            this.id = new _.Identifier().toString();
            this.Element = _.util.type.isElement(elem) ? elem : doc.getElementById(elem) || document;
            this.Element.setAttribute('id', this.id);
            return this;
        },
        _observe: function() {
            if (!this._observer) {
                observe(this);
            }
            return this;
        },
        _listen: function(attr, writeCallback, readCallback) {
            this._observer.listen(attr, writeCallback, readCallback);
            return this;
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
        onlaunch: _.self,
        onawake: _.self
    });
});