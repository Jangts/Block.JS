/*!
 * Block.JS Framework Source Code
 *
 * extends some form methods to class dom.Elements
 *
 * Date: 2017-04-06
 */
;
block([
    '$_/dom/Elements/',
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker;

    _.dom.select.extend({
        val: function(value) {
            if (typeof value == 'string' || typeof value == 'number') {
                this.each(function(i, el) {
                    this.value = value;
                });
            } else {
                if (this[0]) {
                    return this[0].value;
                }
                return null;
            }
            return this;
        }
    });
});