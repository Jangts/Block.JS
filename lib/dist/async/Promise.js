/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Sat, 12 May 2018 17:51:06 GMT
 */
;
// tangram.config({});
tangram.init().block([], function (pandora, root, imports, undefined) {
	var module = this.module;
	var async = pandora.ns('async', {});
	var _ = pandora;
	var doc = root.document;
	var console = root.console;
	pandora.declareClass('async.Promise', {
		_init: function (resolver) {
			var Promise = this;
			function resolve (value) {
				Promise.PromiseStatus = 'resolved';
				Promise.PromiseValue = value;
				Promise.listener();
			}
			function reject (value) {
				Promise.PromiseStatus = 'rejected';
				Promise.PromiseValue = value;
				Promise.listener();
			}
			this.PromiseStatus = 'pending';
			this.PromiseValue = undefined;
			this.handlers = {
				always: [],
				done: [],
				fail: [],
				progress: []
			};
			resolver && resolver(resolve, reject);
		},
		listener: function () {
			switch (this.PromiseStatus) {
				case 'resolved':
				this.callback('always', this.PromiseValue);
				this.callback('done', this.PromiseValue);
				break;;
				case 'rejected':
				this.callback('always', this.PromiseValue);
				this.callback('fail', this.PromiseValue);
				break;;
				case 'pending':
				this.callback('progress', this.PromiseValue);
				break;;
			};
		},
		callback: function (status, data) {
			for (var i in this.handlers[status]) {
				this.handlers[status][i].call(this, data);
			}
			this.handlers[status] = [];
			if (status === 'done' || status == 'fail') {
				this.handlers = {
					always: [],
					done: [],
					fail: [],
					progress: []
				};
			};
		},
		then: function (doneCallbacks, failCallbacks) {
			var Promise = this;
			return new pandora.async.Promise(function (resolve, reject) {
				try {
					typeof doneCallbacks === 'function' && Promise.handlers.done.push(doneCallbacks);
					typeof failCallbacks === 'function' && Promise.handlers.fail.push(failCallbacks);
					Promise.handlers.always.push(resolve);
					Promise.listener();
				}
				catch (err) {
					reject(err);
				};
			});
		},
		done: function (doneCallbacks) {
			typeof doneCallbacks == 'function' && this.handlers.done.push(doneCallbacks);
		},
		'catch': function (failCallbacks) {
			return this.then(null, failCallbacks);
		}
	});
	pandora.extend(pandora.async.Promise, {
		all: function (array) {
			var _arguments = arguments;
			var Callback = void 0;
			var Result = [];
			var Promises = {
				then: function (doneCallback) {
					Callback = (typeof doneCallback === 'function') ? doneCallback : undefined;
				}
			};
			var Done = 0;
			var Check = function () {
				Done++;
				if (Done == array.length) {
					Callback && Callback(Result);
				};
			}
			pandora.each(array, function (i, item) {
				item.then(function (data) {
					Result[i] = data;
					Check();
				});
			}, this);
			return Promises;
		},
		race: function (array) {
			var _arguments = arguments;
			var Done = void 0;
			var Fail = void 0;
			var Promises = {
				then: function (doneCallback, failCallback) {
					Done = (typeof doneCallback === 'function') ? doneCallback : undefined;
					Fail = (typeof failCallback === 'function') ? failCallback : undefined;
				}
			};
			var Checked = false;
			var Check = function (Promise) {
				if (Checked === false) {
					Checked = true;
					if (Promise.PromiseStatus === "resolved") {
						Done && Done(Promise.PromiseValue);
					}
					if (Promise.PromiseStatus === "rejected") {
						Fail && Fail(Promise.PromiseValue);
					}
				};
			}
			pandora.each(array, function (i, item) {
				item.then(function () {
					Check(item);
				}, function () {
					Check(item);
				});
			}, this);
			return Promises;
		},
		oneByOne: function (array) {
			var Done = void 0;
			var Fail = void 0;
			var Value = [];
			var Promises = {
				then: function (doneCallback, failCallback) {
					Done = (typeof doneCallback === 'function') ? doneCallback : undefined;
					Fail = (typeof failCallback === 'function') ? failCallback : undefined;
				}
			};
			var iterator = new _.Iterator(array);
			var Resolver = function (callback) {
				new pandora.async.Promise(callback).done(function (data) {
					Value.push(data);
					Check();
				});
			}
			var Check = function () {
				var elememt = iterator.next();
				if (elememt && typeof elememt == 'function') {
					Resolver(elememt);
				}
				else if (iterator.__ == array.length - 1) {
					Done && Done.call({
						PromiseStatus: 'resolved',
						PromiseValue: Value
					}, Value);
				}
				else {
					Fail && Fail.call({
						PromiseStatus: 'resolved',
						PromiseValue: Value
					}, Value);
				};
			}
			Check();
			return Promises;
		}
	});
	this.module.exports = pandora.async.Promise;
});
//# sourceMappingURL=Promise.js.map