/*!
 * tangram.js framework source code
 *
 * class painter/Charts/Element
 *
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/painter/Charts/Charts.cls',
    '$_/painter/Charts/util/helpers.xtd'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    declare('painter.Charts.Component', {
        _init: function(configuration) {
            _.extend(this, true, configuration);
            this.initialize.apply(this, arguments);
            this.save();
        },
        initialize: function() {},
        restore: function(props) {
            if (!props) {
                _.extend(this, true, this._saved);
            } else {
                _.each(props, function(index, key) {
                        this[key] = this._saved[key];
                    },
                    this);
            }
            return this;
        },
        save: function() {
            this._saved = _.util.obj.clone(this);
            delete this._saved._saved;
            return this;
        },
        update: function(newProps) {
            _.each(newProps, function(key, value) {
                this._saved[key] = this[key];
                this[key] = value;
            }, this);
            return this;
        },
        transition: function(props, ease) {
            _.each(props, function(key, value) {
                this[key] = ((value - this._saved[key]) * ease) + this._saved[key];
            }, this);
            return this;
        },
        tooltipPosition: function() {
            return {
                x: this.x,
                y: this.y
            };
        },
        hasValue: function() {
            return _.util.bool.isNumber(this.value);
        }
    });
});