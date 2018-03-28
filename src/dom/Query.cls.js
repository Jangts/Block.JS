/*!
 * tangram.js framework source code
 *
 * class dom.Query
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/util/arr.xtd',
    '$_/dom/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker;

    //Declare Class 'Elements' Extends 'Query'
    declare('dom.Query', _.Iterator, {
        _init: function(selector, context) {
            this.selector = selector;
            this.context = context || this.context;
            var Elements = [];
            if (selector) {
                switch (typeof(selector)) {
                    case 'string':
                        Elements = _.dom.query(selector, this.context);
                        break;
                    case 'object':
                        switch (_.util.type(selector, true)) {
                            case 'HTMLDocument':
                            case 'Global':
                            case 'Element':
                                Elements.push(arguments[0]);
                                break;
                            case 'Object':
                                Elements = _.dom.query.byAttr(selector);
                                break;
                            case 'Elements':
                                Elements = arguments[0];
                                break;
                            case 'Array':
                                console.log(arguments[0]);
                                for (var i = 0; i < arguments[0].length; i++) {
                                    _.util.type(arguments[0][i]) == 'Element' && Elements.push(arguments[0][i]);
                                }
                                break;
                        }
                        break;
                }
                for (var i = 0; i < Elements.length; i++) {
                    this.push(Elements[i]);
                }
            }
        },
        context: document,
        each: function(handler) {
            for (var i = 0; i < this.length; i++) {
                handler.call(this[i], i, this[i]);
            }
            return this;
        },
        find: function(selector) {
            var Elements = [];
            this.each(function() {
                Elements.push(_.dom.query(selector, this))
            });
            this.prevObject = this;
            this.splice(0, this.length);
            for (var i in Elements) {
                for (var j = 0; j < Elements[i].length; j++) {
                    this.push(Elements[i][j])
                }
            }
            return this;
        },
        closet: function(tagName) {
            var Elements = [];
            var node;
            this.each(function() {
                if (node = _.dom.closest(this, tagName)) {
                    Elements.push(node);
                }
            });
            this.prevObject = this;
            this.splice(0, this.length);
            for (var i = 0; i < Elements.length; i++) {
                this.push(Elements[i]);
            }
            return this;
        },
        get: function(n) {
            if (typeof n === 'number') {
                if (n >= 0 && n < this.length) {
                    return this[n];
                } else if (n < 0 && n + this.length >= 0) {
                    return this[n + this.length];
                }
            }
            return null;
        },
        sub: function(part) {
            var Elements = [];
            switch (typeof part) {
                case 'number':
                    this.get(part) && Elements.push(this.get(part));
                    break;
                case 'string':
                    switch (part) {
                        case 'first':
                            this[0] && Elements.push(this[0]);
                            break;
                        case 'last':
                            this[this.length - 1] && Elements.push(this[this.length - 1]);
                            break;
                        case 'odd':
                            for (var i = 0; i < part.length; i += 2) {
                                Elements.push(this[i]);
                            }
                            break;
                        case 'even':
                            for (var i = 1; i < part.length; i += 2) {
                                Elements.push(this[i]);
                            }
                            break;
                    }
                    break;
                case 'object':
                    if (part instanceof Array) {
                        part = _.unique(part);
                        for (var i = 0; i < part.length; i++) {
                            this.get(part[i]) && Elements.push(this.get(part[i]));
                        }
                    }
                    break;
            }
            this.prevObject = this;
            this.splice(0, this.length);
            for (var i in Elements) {
                this.push(Elements[i]);
            }
            return this;
        },
        concat: function(selector, context) {
            var res = _.dom.query(selector, context || document);
            for (var i = 0; i < res.length; i++) {
                if (_.util.arr.has(this, res[i]) === false) {
                    this.push(res[i]);
                };
            }
            return this;
        }
    });
});