/*!
 * Block.JS Framework Source Code
 *
 * class util.Promise
 *
 * Date 2017-04-06
 */
;
block(function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    declare('util.Promise', {
        _init: function(resolver) {
            var Promise = this;

            function resolve(value) {
                Promise.PromiseStatus = 'resolved';
                Promise.PromiseValue = value;
                Promise.listener();
            }

            function reject(value) {
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
        listener: function() {
            switch (this.PromiseStatus) {
                case 'resolved':
                    this.callback('always', this.PromiseValue);
                    this.callback('done', this.PromiseValue);
                    break;
                case 'rejected':
                    this.callback('always', this.PromiseValue);
                    this.callback('fail', this.PromiseValue);
                    break;
                case 'pending':
                    this.callback('progress', this.PromiseValue);
                    break;
            }
        },
        callback: function(status, data) {
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
        then: function(doneCallbacks, failCallbacks) {
            var Promise = this;
            return new _.util.Promise(function(resolve, reject) {
                try {
                    typeof doneCallbacks === 'function' && Promise.handlers.done.push(doneCallbacks);
                    typeof failCallbacks === 'function' && Promise.handlers.fail.push(failCallbacks);
                    Promise.handlers.always.push(resolve);
                    Promise.listener();
                } catch (err) {
                    reject(err);
                    //console.log(err);
                }
            });
        },
        done: function(doneCallbacks) {
            typeof doneCallbacks == 'function' && this.handlers.done.push(doneCallbacks);
        },
        'catch': function(failCallbacks) {
            return this.then(null, failCallbacks);
        }
    });

    _.extend(_.util.Promise, {
        all: function(array) {
            var Callback;
            var Result = [];
            var Promises = {
                then: function(doneCallback) {
                    Callback = (typeof doneCallback === 'function') ? doneCallback : undefined;
                }
            };
            var Done = 0;
            var Check = function() {
                Done++;
                if (Done == array.length) {
                    Callback && Callback(Result);
                }
            };
            _.each(array, function(i) {
                this.then(function(data) {
                    Result[i] = data;
                    Check();
                });
            });
            return Promises;
        },
        race: function(array) {
            var Done;
            var Fail;
            var Promises = {
                then: function(doneCallback, failCallback) {
                    Done = (typeof doneCallback === 'function') ? doneCallback : undefined;
                    Fail = (typeof failCallback === 'function') ? failCallback : undefined;
                }

            };
            var Checked = false;
            var Check = function(Promise) {
                if (Checked === false) {
                    Checked = true;
                    if (Promise.PromiseStatus === "resolved") {
                        Done && Done(Promise.PromiseValue);
                    }
                    if (Promise.PromiseStatus === "rejected") {
                        Fail && Fail(Promise.PromiseValue);
                    }
                }
            };
            _.each(array, function(i) {
                this.then(function() {
                    Check(this);
                }, function() {
                    Check(this);
                });
            });
            return Promises;
        },
        oneByOne: function(array) {
            var Done,
                Fail,
                Value = [],
                Promises = {
                    then: function(doneCallback, failCallback) {
                        Done = (typeof doneCallback === 'function') ? doneCallback : undefined;
                        Fail = (typeof failCallback === 'function') ? failCallback : undefined;
                    }
                },
                iterator = new _.Iterator(array);
            var Resolver = function(callback) {
                    new _.util.Promise(callback).done(function(data) {
                        Value.push(data);
                        Check();
                    });
                },
                Check = function() {
                    var elememt = iterator.next();
                    if (elememt && typeof elememt == 'function') {
                        Resolver(elememt);
                    } else if (iterator.__ == array.length - 1) {
                        Done && Done.call({ PromiseStatus: 'resolved', PromiseValue: Value }, Value);
                    } else {
                        Fail && Fail.call({ PromiseStatus: 'resolved', PromiseValue: Value }, Value);
                    }
                };
            Check();
            return Promises;
        }
    });
});