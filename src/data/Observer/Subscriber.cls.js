/*!
 * tangram.js framework source code
 *
 * class data.Observer.Subscriber
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/util/bool.xtd'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        console = global.console;

    /**
     * 创建订阅器，用于联通data.Observer实例和监听它属性的data.Observer.Listener实例
     * 
     */
    declare('data.Observer.Subscriber', {
        _init: function() {
            this.listeners = [];
        },
        watch: function(listener) {
            this.listeners.push(listener);
        },
        notify: function(isWriting, silentlyWriting) {
            if (isWriting) {
                _.each(this.listeners, function() {
                    this.onwrite(silentlyWriting);
                });
            } else {
                _.each(this.listeners, function() {
                    this.onread();
                });
            }
        }
    });
});