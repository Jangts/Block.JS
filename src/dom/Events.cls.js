/*!
 * tangram.js framework source code
 *
 * class dom.Events
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/dom/',
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker;

    // 注册_.dom命名空间到pandora
    _('dom');

    var document = global.document,
        removeByIndex = function(array, index) {
            var result = [];
            for (var i = 0; i < array.length; i++) {
                i == index || result.push(array[i]);
            }
            return result;
        };

    declare('dom.Events', {
        _init: function(elem) {
            this.Element = elem;
            this.eventTypes = {};
        },
        _p: {
            types: {},
            keys: []
        },
        listen: function(eventType) {
            if (!this.eventTypes[eventType]) {
                var that = this;
                var originType = this.originEventType(eventType, this.Element);
                if (originType) {
                    this.eventTypes[eventType] = {
                        Listener: function(event) {
                            that.fire(event, eventType);
                        },
                        Selectors: {},
                        Elements: []
                    };
                    document.addEventListener ? this.Element.addEventListener(originType, this.eventTypes[eventType].Listener, false) : this.Element.attachEvent("on" + originType, this.eventTypes[eventType].Listener);
                }
            }
            return this;
        },
        push: function(eventType, selector, data, handler) {
            if (typeof handler == 'function') {
                this.listen(eventType);
                if (this.eventTypes[eventType]) {
                    switch (typeof selector) {
                        case 'string':
                            this.eventTypes[eventType]['Selectors'][selector] = this.eventTypes[eventType]['Selectors'][selector] || [];
                            this.eventTypes[eventType]['Selectors'][selector].push({
                                data: data,
                                handler: handler
                            });
                            break;
                        case 'object':
                            selector = selector || this.Element;
                            this.eventTypes[eventType]['Elements'].push({
                                elem: selector,
                                data: data,
                                handler: handler
                            });
                            break;
                    }
                }
            }
            return this;
        },
        originEventType: function(eventType, elem) {
            if (typeof eventType == 'string' && typeof elem == 'object' && (elem.nodeType == 1 || elem.nodeType == 9 || elem === global)) {
                if (typeof elem['on' + eventType] != 'undefined') {
                    return eventType;
                }
                if (this._p.types[eventType]) {
                    return this._p.types[eventType].type;
                }
                return eventType;
            }
            return null;
        },
        checkEventType: function(event, eventType) {
            if (eventType === event.type) {
                return true;
            } else if (this._p.types[eventType]) {
                for (var i in this._p.types[eventType]) {
                    if (this._p.types[eventType][i] != event[i]) {
                        return false;
                    }
                }
                return true;
            }
        },
        fire: function(event, eventType) {
            var callback = function(elem, sele) {
                event.data = sele.data;
                sele.handler.call(elem, event);
            };
            event.currentTarget = event.currentTarget || event.target || event.relatedTarget || event.srcElement;
            event.target = event.target || event.currentTarget;
            event.delegateTarget = this.Element;
            if (event.delegateTarget === event.target) {
                event.path = event.path || [event.target];
                event.isCurrent = true;
            } else {
                event.path = event.path || [event.target, event.delegateTarget];
                event.isCurrent = (event.path[0] === event.delegateTarget);
            }
            event.wheelDelta = event.wheelDelta || event.detail * -40;
            event.timeStamp = Date.parse(new Date()) / 1000;
            event.eventType = eventType;
            if (_.util.arr.has(['keypress', 'keyup', 'keydown'], event.type) !== false) {
                event.keyName = _.util.str.charCode(event.which);
            }
            if (this.checkEventType(event, eventType)) {
                event.path = event.path || _.dom.getParentNodes(event.target);
                var EventType = this.eventTypes[eventType];
                for (var s in EventType['Selectors']) {
                    var selector = EventType['Selectors'][s];
                    var elements = _.dom.query(s, this.Element);
                    for (var i = 0; i < elements.length; i++) {
                        if (_.util.arr.has(event.path, elements[i]) !== false) {
                            for (var n in selector) {
                                callback(elements[i], selector[n]);
                            }
                        }
                    }
                };
                for (var e in EventType['Elements']) {
                    var selector = EventType['Elements'][e];
                    if (_.util.arr.has(event.path, selector.elem) !== false) {
                        callback(selector.elem, selector);
                    }
                }
            }
            return this;
        },
        trigger: function(eventType, target, data) {
            if (this.eventTypes[eventType]) {
                var originEventType = this.originEventType(eventType);
                var event = {
                    path: [this.Element],
                    currentTarget: target,
                    data: data,
                    delegateTarget: this.Element,
                    isCurrent: false,
                    isTrigger: true,
                    target: target,
                    timeStamp: Date.parse(new Date()) / 1000,
                    type: originEventType,
                    eventType: eventType
                };
                var fire = function(callback) {
                    callback._handler = callback.handler;
                    callback.handler = function() {
                        callback.handler = callback._handler;
                        callback._handler = null;
                        delete callback._handler;
                    }
                    callback._handler.call(event.target, event);
                    //typeof event.target[originEventType] == 'function' && event.target[originEventType]();
                };
                for (var s in this.eventTypes[eventType]['Selectors']) {
                    var selector = this.eventTypes[eventType]['Selectors'][s];
                    var elements = _.dom.query(s, this.Element);
                    for (var i = 0; i < elements.length; i++) {
                        if (elements[i] == target) {
                            for (var n in selector) {
                                fire(selector[n]);
                            }
                        }
                    }
                };
                for (var e in this.eventTypes[eventType]['Elements']) {
                    var selector = this.eventTypes[eventType]['Elements'][e];
                    if (selector.elem == target) {
                        fire(selector);
                    }
                };
            }
            return this;
        },
        removeHandler: function(eventType, selector, handler) {
            if (this.eventTypes[eventType]) {
                selector = selector || this.Element;
                switch (typeof selector) {
                    case 'string':
                        for (var h in this.eventTypes[eventType]['Selectors'][selector]) {
                            if (this.eventTypes[eventType]['Selectors'][selector][h].handler == handler) {
                                delete this.eventTypes[eventType]['Selectors'][selector][h];
                            }
                        }
                        break;
                    case 'object':
                        for (var e = 0; e < this.eventTypes[eventType]['Elements'].length; e++) {
                            if (this.eventTypes[eventType]['Elements'][e] && this.eventTypes[eventType]['Elements'][e].elem == selector && (this.eventTypes[eventType]['Elements'][e].handler == handler || this.eventTypes[eventType]['Elements'][e]._handler == handler)) {
                                this.eventTypes[eventType]['Elements'] = removeByIndex(this.eventTypes[eventType]['Elements'], e);
                                e--;
                            }
                        }
                        break;
                }
            }
            return this;
        },
        removeSelector: function(eventType, selector) {
            if (this.eventTypes[eventType]) {
                selector = selector || this.Element;
                switch (typeof selector) {
                    case 'string':
                        delete this.eventTypes[eventType]['Selectors'][selector];
                        break;
                    case 'object':
                        for (var e = 0; e < this.eventTypes[eventType]['Elements'].length; e++) {
                            if (this.eventTypes[eventType]['Elements'][e].elem == selector) {
                                this.eventTypes[eventType]['Elements'] = removeByIndex(this.eventTypes[eventType]['Elements'], e);
                                e--;
                            }
                        }
                        break;
                }
            }
            return this;
        },
        removeType: function(eventType) {
            if (this.eventTypes[eventType]) {
                var originType = this.originEventType(eventType);
                document.addEventListener ? this.Element.removeEventListener(originType, this.eventTypes[eventType].Listener, false) : this.Element.detachEvent("on" + originType, this.eventTypes[eventType].Listener);
                delete this.eventTypes[eventType];
            }
            return this;
        },
        remove: function() {
            for (var eventType in this.eventTypes) {
                var originType = this.originEventType(eventType);
                document.addEventListener ? this.Element.removeEventListener(originType, this.eventTypes[eventType].Listener, false) : this.Element.detachEvent("on" + originType, this.eventTypes[eventType].Listener);
                delete this.eventTypes[eventType];
            }
            delete this.eventTypes;
            delete this.Element;
            return this;
        }
    });

    _.extend(_.dom.Events, {
        setType: function(types) {
            var noEvents = new _.dom.Events();
            for (var i in types) {
                noEvents._p.types[i] = types[i];
            }
        }
    });

    _.dom.Events.setType({
        'DOMMouseScroll': {
            type: 'mousewheel'
        },
        'mousewheel': {
            type: 'DOMMouseScroll'
        },
        'rclick': {
            type: 'mousedown',
            which: 3
        },
        'back': {
            type: 'keypress',
            which: 8
        },
        'enter': {
            type: 'keypress',
            which: 13
        }
    });
});