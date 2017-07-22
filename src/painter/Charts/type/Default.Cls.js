/*!
 * Block.JS Framework Source Code
 * A Web Front-end Development Javascript Framework
 * Mainly For DOM Operation, Data Exchange, Graphic Effects (Image, Canvas, SVG And Ect.), Front-end UI, And Some Basic Calculations.
 * Stripped from Tangram New Idea (TNI)
 *
 * class painter/Charts/typeExtend
 * http://www.yangram.net/blockjs/
 *
 * Written and Designed By Ivan Yeung
 *
 * Date: 2015-09-04
 */
;
block([
    '$_/util/obj.xtd',
    '$_/painter/Charts/Charts.cls',
    '$_/painter/Charts/util/helpers.xtd',
    '$_/painter/Charts/util/events.xtd',
    '$_/painter/Charts/util/defaults.xtd'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var helpers = _.painter.Charts.util.helpers,
        events = _.painter.Charts.util.events,
        anim = undefined,
        getMaximumWidth = function(domNode) {
            return _.dom.getSize(domNode, 'max').width;
        };
    declare('painter.Charts.type.Default', {
        _init: function(options, charts, zIndex) {
            this.instance = charts;
            this.ctx = charts.getLayer(zIndex).getContext("2d");
            this.initialize(options);
        },
        initialize: function() {
            return this;
        },
        reflow: helpers.noop,
        generateLegend: function() {
            return helpers.template(this.options.legendTemplate, {
                datasets: this.datasets
            });
        },
        destroy: function() {
            this.stop();
            this.clear();
            unbindEvents(this, this.events);
            var canvas = this.chart.canvas;

            // Reset canvas height/width attributes starts a fresh with the canvas context
            canvas.width = this.chart.width;
            canvas.height = this.chart.height;

            // < IE9 doesn't support removeProperty
            if (canvas.style.removeProperty) {
                canvas.style.removeProperty('width');
                canvas.style.removeProperty('height');
            } else {
                canvas.style.removeAttribute('width');
                canvas.style.removeAttribute('height');
            }

            delete _.painter.Charts.instances[this.id];
        },
        toBase64Image: function() {
            return this.chart.canvas.toDataURL.apply(this.chart.canvas, arguments);
        }
    });
});