/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Fri, 11 May 2018 04:49:02 GMT
 */
;
// tangram.config({});
tangram.init().block([
	'$_/dom/'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var dom = pandora.ns('dom', {});
	var _ = pandora;
	var declare = pandora.declareClass;
	var query = pandora.dom.sizzle || pandora.dom.query;
	var doc = root.document;
	var removeByIndex = function (array, index) {
		var result = [];
		for (var i = 0;i < array.length;i++) {
			i == index || result.push(array[i]);
		}
		return result;
	}
	$..Events = pandora.declareClass({
		_protected: {
			types:  {},
			keys: []
		},
		_init: function (elem) {
			this.Element = elem;
			this.eventTypes = {};
		},
		listen: function (eventType) {
			if (!this.eventTypes[eventType]) {
				var that = this;
				var originType = this.originEventType(eventType, this.Element);
				if (originType) {
					this.eventTypes[eventType] = {
						Listener: function (event) {
							that.fire(event, eventType);
						},
						Selectors:  {},
						Elements: []
					};
					doc.addEventListener ? this.Element.addEventListener(originType, this.eventTypes[eventType].Listener, false): this.Element.attachEvent("on" + originType, this.eventTypes[eventType].Listener);
				}
			}
			return this;
		},
		push: function (eventType, selector, data, handler) {
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
						break;;
						case 'object':
						selector = selector || this.Element;
						this.eventTypes[eventType]['Elements'].push({
							elem: selector,
							data: data,
							handler: handler
						});
						break;;
					}
				}
			}
			return this;
		},
		originEventType: function (eventType, elem) {
			if (typeof eventType == 'string'&& typeof elem == 'object' && (elem.nodeType == 1 || elem.nodeType == 9 || elem === root)) {
				if (typeof elem['on' + eventType] != 'undefined') {
					return eventType;
				}
				if (this._protected.types[eventType]) {
					return this._protected.types[eventType].type;
				}
				return eventType;
			}
			return null;
		},
		checkEventType: function (event, eventType) {
			if (eventType === event.type) {
				return true;
			}
			else if (this._protected.types[eventType]) {
				for (var i in this._protected.types[eventType]) {
					if (this._protected.types[eventType][i] != event[i]) {
						return false;
					}
				}
				return true;
			};
		},
		fire: function (event, eventType) {
			var callback = function (elem, sele) {
				event.data = sele.data;
				sele.handler.call(elem, event);
			}
			event.currentTarget = event.currentTarget || event.target || event.relatedTarget || event.srcElement;
			event.target = event.target || event.currentTarget;
			event.delegateTarget = this.Element;
			event.path = event.path || pandora.dom.getParentNodes(event.target, true);
			event.isCurrent = (event.delegateTarget === event.target);
			event.wheelDelta = event.wheelDelta || event.detail *  -40;
			event.timeStamp = Date.parse(new Date())/1000;
			event.eventType = eventType;
			if (_.arr.has(['keypress', 'keyup', 'keydown'], event.type) !== false) {
				event.keyName = _.str.charCode(event.which);
			}
			if (this.checkEventType(event, eventType)) {
				var EventType = this.eventTypes[eventType];
				for (var s in EventType['Selectors']) {
					var selector = EventType['Selectors'][s];
					var elements = query(s, this.Element);
					for (var i = 0;i < elements.length;i++) {
						if (_.arr.has(event.path, elements[i]) !== false) {
							for (var n in selector) {
								callback(elements[i], selector[n]);
							}
						}
					}
				}
				for (var e in EventType['Elements']) {
					var selector = EventType['Elements'][e];
					if (_.arr.has(event.path, selector.elem) !== false) {
						callback(selector.elem, selector);
					}
				}
			}
			return this;
		},
		trigger: function (eventType, target, data) {
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
					timeStamp: Date.parse(new Date())/1000,
					type: originEventType,
					eventType: eventType
				};
				var fire = function (callback) {
					callback._handler = callback.handler;
					callback.handler = function () {
						callback.handler = callback._handler;
						callback._handler = null;
						delete callback._handler;
					}
					callback._handler.call(event.target, event);
				}
				for (var s in this.eventTypes[eventType]['Selectors']) {
					var selector = this.eventTypes[eventType]['Selectors'][s];
					var elements = query(s, this.Element);
					for (var i = 0;i < elements.length;i++) {
						if (elements[i] == target) {
							for (var n in selector) {
								fire(selector[n]);
							}
						}
					}
				}
				for (var e in this.eventTypes[eventType]['Elements']) {
					var selector = this.eventTypes[eventType]['Elements'][e];
					if (selector.elem == target) {
						fire(selector);
					}
				}
			}
			return this;
		},
		removeHandler: function (eventType, selector, handler) {
			if (this.eventTypes[eventType]) {
				selector = selector || this.Element;
				switch (typeof selector) {
					case 'string':
					for (var h in this.eventTypes[eventType]['Selectors'][selector]) {
						if (this.eventTypes[eventType]['Selectors'][selector][h].handler == handler) {
							delete this.eventTypes[eventType]['Selectors'][selector][h];
						}
					}
					break;;
					case 'object':
					for (var e = 0;
					e < this.eventTypes[eventType]['Elements'].length;e++) {
						if (this.eventTypes[eventType]['Elements'][e] && this.eventTypes[eventType]['Elements'][e].elem == selector && (this.eventTypes[eventType]['Elements'][e].handler == handler || this.eventTypes[eventType]['Elements'][e]._handler == handler)) {
							this.eventTypes[eventType]['Elements'] = removeByIndex(this.eventTypes[eventType]['Elements'], e);
							e--;
						}
					}
					break;;
				}
			}
			return this;
		},
		removeSelector: function (eventType, selector) {
			if (this.eventTypes[eventType]) {
				selector = selector || this.Element;
				switch (typeof selector) {
					case 'string':
					delete this.eventTypes[eventType]['Selectors'][selector];
					break;;
					case 'object':
					for (var e = 0;
					e < this.eventTypes[eventType]['Elements'].length;e++) {
						if (this.eventTypes[eventType]['Elements'][e].elem == selector) {
							this.eventTypes[eventType]['Elements'] = removeByIndex(this.eventTypes[eventType]['Elements'], e);
							e--;
						}
					}
					break;;
				}
			}
			return this;
		},
		removeType: function (eventType) {
			if (this.eventTypes[eventType]) {
				var originType = this.originEventType(eventType);
				doc.addEventListener ? this.Element.removeEventListener(originType, this.eventTypes[eventType].Listener, false): this.Element.detachEvent("on" + originType, this.eventTypes[eventType].Listener);
				delete this.eventTypes[eventType];
			}
			return this;
		},
		remove: function () {
			for (var eventType in this.eventTypes) {
				var originType = this.originEventType(eventType);
				doc.addEventListener ? this.Element.removeEventListener(originType, this.eventTypes[eventType].Listener, false): this.Element.detachEvent("on" + originType, this.eventTypes[eventType].Listener);
				delete this.eventTypes[eventType];
			}
			delete this.eventTypes;
			delete this.Element;
			return this;
		}
	});
	pandora.extend($..Events, {
		setType: function (types) {
			var domEvents = new pandora.dom.Events();
			for (var i in types) {
				domEvents._protected.types[i] = types[i];
			};
		}
	});
	pandora.dom.Events.setType({
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
	this.module.exports = pandora.dom.Events;
});
//# sourceMappingURL=Events.js.map