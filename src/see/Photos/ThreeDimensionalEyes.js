/*!
 * tangram.js framework source code
 *
 * class see.ThreeDimensionalEyes extends Photos
 * 
 * Date: 2017-04-06
 */
;
tangram.block([
    '$_/util/bool',
    '$_/dom/Events',
    '$_/see/Photos/',
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console,
        location = global.location,
        query = _.dom.sizzle || _.dom.query;

    _('see');

    declare('see.ThreeDimensionalEyes', _.see.Photos, {
        _init: function(stage, images) {
            this.Element = _.util.bool.isStr(stage) ? _.dom.query.byId(stage) : stage;
            _.dom.setStyle(this.Element, {
                cursor: 'default'
            });
            switch (typeof images) {
                case 'string':
                    this.loadBox();
                    var that = this;
                    this.loadJson(images, function() {
                        that.length > 0 && that.play();
                    });
                    break;
                case 'object':
                    this.loadBox();
                    if (_.util.bool.isArr(images)) {
                        this.loadArray(images);
                    } else {
                        this.loadFolder(images);
                    }
                    this.length > 0 && this.play();
                    break;
                case 'undefined':
                    this.noData();
                    this.length > 0 && this.play().bind();
                    break;
            };
        },
        cur: 0,
        start: 0,
        loadBox: function() {
            var that = this;
            this.loadingArea = query('.ib-3deyes-loading', this.Element)[0] || _.dom.create('div', this.Element, {
                className: 'ib-3deyes-loading',
            });
            _.dom.setStyle(this.loadingArea, {
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                bottom: 0
            });
            _.dom.addEvents(this.loadingArea, 'click', null, null, function() {
                that.loading();
                _.dom.removeEvents(this, 'click');
            });
        },
        loading: function() {
            var loaded = 0;
            var percent;
            var that = this;
            _.dom.setStyle(this.loadingArea, {
                width: 0,
                height: 5,
                backgroundColor: '#000',
                opacity: .8
            });
            for (var n = 0; n < this.length; n++) {
                var img = _.dom.create('img', this.Element, {
                    src: this.images[n],
                    className: 'ib-3deyes-item'
                });
                img.style.display = 'none';
                img.onload = function() {
                    loaded++;
                    percent = loaded / that.length * 100;
                    _.dom.setStyle(that.loadingArea, 'width', percent + '%');
                    if (loaded >= that.length) {
                        _.dom.setStyle(that.loadingArea, 'display', 'none');
                        that.bind();
                    }
                };
            }
        },
        noData: function() {
            this.images = [];
            var that = this;
            _.each(query('img.ib-3deyes-item', this.Element), function() {
                _.dom.setStyle(this, 'display', 'none');
                that.images.push(_.dom.getAttr(this, 'src'));
                that.length++;
            });
        },
        bind: function() {
            var that = this;
            new _.dom.Events(this.Element)
                .push('mousedown', null, null, function() {
                    that.state = true;
                })
                .push('touchstart', null, null, function() {
                    that.state = true;
                })
                .push('mousemove', null, null, function(e) {
                    if (that.state == true) {
                        that.change(e.pageX - this.offsetLeft);
                    } else {
                        that.start = e.pageX - this.offsetLeft;
                    }
                })
                .push('touchmove', null, null, function(e) {
                    e.preventDefault();
                    var end = e.touches[0] || e.changedTouches[0];
                    if (that.state == true) {
                        that.change(end.pageX - this.offsetLeft);
                    } else {
                        that.start = end.pageX - this.offsetLeft;
                    }
                });
            new _.dom.Events(document)
                .push('mouseup', null, null, function() {
                    that.state = false;
                })
                .push("touchend", null, null, function() {
                    that.state = false;
                });
            return this;
        },
        change: function(end) {
            var move = this.start - end;
            if (move > 25) {
                this.start = this.start - 25;
                this.cur = --this.cur < 0 ? this.length - 1 : this.cur;
                this.play();
                this.change(end);
            } else if (move < -25) {
                this.start = this.start + 25;
                this.cur = ++this.cur >= this.length ? 0 : this.cur;
                this.play();
                this.change(end);
            } else {
                this.start = end;
            }
        },
        play: function() {
            _.dom.setStyle(this.Element, {
                backgroundImage: 'url(' + this.images[this.cur] + ')',
                position: 'relative'
            });
            return this;
        }
    });

});