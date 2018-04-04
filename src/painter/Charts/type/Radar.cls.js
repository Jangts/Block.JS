/*!
 * tangram.js framework source code
 *
 * class painter/Charts
 *
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/util/arr.xtd',
    '$_/painter/Charts/radar.clsx',
    '$_/painter/Charts/type/Default.cls',
    '$_/painter/Charts/sharp/Line.cls',
    '$_/painter/Charts/sharp/Point.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console;

    var helpers = _.painter.Charts.util.helpers,
        events = _.painter.Charts.util.events;

    var defaultConfig = {
        name: '',
        zIndex: 0,
        showPoint: true,
        itemStyle: {
            normal: {
                color: null,
                radius: 3,
                borderColor: null,
                borderWidth: 1
            },
            emphasis: {
                color: null,
                radius: 4,
                borderColor: null,
                borderWidth: 1
            }
        },
        lineStyle: {
            type: 'solid', //'dashed', 'dotted'
            borderColor: null,
            borderWidth: 2
        },
        showArea: false,
        areaStyle: {
            color: null,
        },
        hitDetectionRadius: 10,
        data: []
    };


    declare('painter.Charts.type.Radar', _.painter.Charts.type.Default, {
        defaults: defaultConfig,
        initialize: function(options) {
            var instance = this.instance,
                options = _.util.obj.deepMerge(this.defaults, options);
            this.options = {
                index: options.index,
                name: options.name,

                pointDot: options.showPoint,
                pointColor: options.itemStyle.normal.color || this.instance.options.lineColorDefaults[options.index % this.instance.options.lineColorDefaults.length],
                pointDotRadius: options.itemStyle.normal.radius,
                pointStrokeColor: options.itemStyle.normal.borderColor || '#FFFFFF',
                pointDotStrokeWidth: options.itemStyle.normal.borderWidth,

                pointEmphasisFill: options.itemStyle.emphasis.color || '#FFFFFF',
                pointEmphasisRadius: options.itemStyle.emphasis.radius,
                pointEmphasisStroke: options.itemStyle.emphasis.borderColor || options.itemStyle.normal.borderColor || this.instance.options.lineColorDefaults[options.index % this.instance.options.lineColorDefaults.length],
                pointEmphasisStrokeWidth: options.itemStyle.emphasis.borderWidth,

                datasetStrokeWidth: options.lineStyle.borderWidth,
                datasetStrokeType: options.lineStyle.type,
                strokeColor: options.lineStyle.borderColor || this.instance.options.lineColorDefaults[options.index % this.instance.options.lineColorDefaults.length],

                datasetFill: options.showArea,
                fillColor: options.areaStyle.color || this.instance.options.areaColorDefaults[options.index % this.instance.options.areaColorDefaults.length],

                bezierCurve: false,

                pointHitDetectionRadius: options.hitDetectionRadius
            };

            this.lines = [];
            this.segments = [];
            this.radar = this.instance.radarpolar;
            this.LineClass = declare(_.painter.Charts.sharp.Line, {
                ctx: this.ctx,
                radar: this.radar,
                bezierCurve: this.options.bezierCurve,
                bezierCurveTension: this.options.bezierCurveTension,
                lineWidth: this.options.datasetStrokeWidth,
                lineType: this.options.datasetStrokeType,
                strokeStyle: this.options.strokeColor,
                datasetStroke: true
            });

            this.PointClass = declare(_.painter.Charts.sharp.Point, {
                type: this.radar.status,
                ctx: this.ctx,
                radar: this.radar,
                titleLabel: this.options.name,
                display: this.options.pointDot,
                emphasisDisplay: true,
                fillColor: this.options.pointColor,
                emphasisFill: this.options.pointEmphasisFill || this.options.pointColor,
                radius: this.options.pointDotRadius,
                emphasisRadius: this.options.pointEmphasisRadius,
                strokeColor: this.options.pointStrokeColor,
                emphasisStroke: this.options.pointEmphasisStroke || this.options.pointStrokeColor,
                strokeWidth: this.options.pointDotStrokeWidth,
                emphasisStrokeWidth: this.options.pointEmphasisStrokeWidth,
                hitDetectionRadius: this.options.pointHitDetectionRadius,
                strictHover: this.instance.options.tooltip.strictHover
            });
            this.buildSegment(options.data);
        },
        buildSegment: function(data) {
            _.each(data, function(index, value) {
                this.addSegment(index, value);
            }, this);
            _.each(this.lines, function(index, line) {
                line.previous = this.lines[index - 1] || this.lines[this.lines.length - 1];
                line.next = this.lines[index + 1] || this.lines[0];
                line.siblings = this.lines.length;
            }, this);
        },
        update: function(data) {
            _.each(this.segments, function(index, segment) {
                segment.value = data && data[index] || 0;
                segment.restore(['display', 'fillColor', 'radius', 'strokeColor', 'strokeWidth']);
                segment.save();
                this.calculate(index, segment);
            }, this);
            for (var index = this.segments.length; index < data.length; index++) {
                this.addSegment(index, data[index]);
            }
            _.each(this.lines, function(index, line) {
                line.previous = this.lines[index - 1] || this.lines[this.lines.length - 1];
                line.next = this.lines[index + 1] || this.lines[0];
                line.siblings = this.lines.length;
            }, this);
        },
        addSegment: function(index, value) {
            var segment = new this.PointClass({
                    type: this.radar.status,
                    value: value,
                    label: this.radar.angleLabels[index],
                }),
                line = new this.LineClass({
                    index: index,
                    point: segment
                });
            this.lines.push(line);
            this.segments.push(segment);
            this.calculate(index, segment);
            _.extend(segment, true, {
                x: this.radar.xCenter,
                y: this.radar.yCenter,
                itemLabel: segment.label,
            });
            segment.save();
        },
        calculate: function(index, segment) {
            var position = this.radar.getPointPosition(this.radar.calculateAngle(index), this.radar.calculateRadius(index, segment.value))
            _.extend(segment, true, {
                X: position.x,
                Y: position.y
            });
        },
        getSegmentsAtEvent: function(e) {
            var segmentsArray = [],
                eventPosition = events.getRelativePosition(e);
            _.loop(this.segments, function(index, segment) {
                if (segment.inRange(eventPosition.x, eventPosition.y)) {
                    segmentsArray = this.segments;
                    _.loop.out();
                }
            }, this);
            return segmentsArray;
        },
        draw: function(ease) {
            var easingDecimal = ease || 1,
                ctx = this.ctx,
                points = [];

            _.each(this.segments, function(index, segment) {
                if (segment.hasValue()) {
                    segment.transition({
                        x: segment.X,
                        y: segment.Y

                    }, easingDecimal);
                    this.lines[index].draw(true);
                    points.push(segment);
                }
            }, this);
            if (this.options.datasetFill && (points.length === this.segments.length) && (this.radar.status === 6)) {
                ctx.globalAlpha = 0.85;
                ctx.fillStyle = this.options.fillColor;
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            _.each(points, function(index, point) {
                point.draw();
            }, this);
        }

    });

    _.painter.Charts.prototype.radar = function() {
        var chart,
            chartName,
            id = 0,
            radar = this.radarpolar;
        radar.charts.radarpolar = radar.charts.radarpolar || [];
        if (radar) {
            _.each(this.series.radar, function(i, options) {
                options.index = id++;
                chartName = this.getChartName(options.name);
                if (this.historyCharts[chartName] && this.historyCharts[chartName].type == 'radar') {
                    chart = this.historyCharts[chartName];
                    chart.update(options.data, options.index);
                } else {
                    chart = new _.painter.Charts.type.Radar(options, this, options.zIndex);
                    chart.type = 'radar';
                    this.historyCharts[chartName] = chart;
                }
                radar.charts.radarpolar.push(chart);
                this.activedCharts.push(chart);
            }, this);
        };
    }
});