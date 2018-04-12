/*!
 * tangram.js framework source code
 *
 * class obj.Observer.Listener
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/util/bool'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        console = global.console;

    var isFn = _.util.bool.isFn,

        /**
         * 创建一个针对obj.Observer的实例对象的属性的监听对象
         * 
         * @param   {Object}    observer        必须是obj.Observer的实例对象
         * @param   {String}    property        需要被监听的属性名
         * @param   {function}  writeCallback   写回调
         * @param   {function}  readCallback    读回调
         * 
         */
        Listener = declare('obj.Observer.Listener', {
            _init: function(observer, property, writeCallback, readCallback) {
                this.observer = observer;
                this.data = observer.data;
                this.property = property;
                this.writeCallback = writeCallback;
                this.readCallback = readCallback;
                this.observer.listener = this;
                this.value = observer.data[property];
                this.observer.listener = null;
            },
            onread: function() {
                _.util.bool.isFn(this.readCallback) && this.readCallback.call(this.data, this.value, this.property);
            },
            onwrite: function(silently) {
                this.observer.silently = true;
                var value = this.data[this.property];
                this.observer.silently = silently;
                if (value !== this.value) {
                    this.value = value;
                    silently || (isFn(this.writeCallback) && this.writeCallback.call(this.data, this.value, this.property));
                }
            }
        });
});