/*!
 * Block.JS Framework Source Code
 *
 * class painter/Charts
 *
 * Date: 2015-09-04
 */
;
block([
    '$_/painter/Charts/grid.clsx',
    '$_/painter/Charts/type/Default.cls',
    '$_/painter/Charts/sharp/Line.cls',
    '$_/painter/Charts/sharp/Point.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
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
        showLine: true,
        lineStyle: {
            normal: {
                borderColor: null,
                borderWidth: 2
            }
        },
        showArea: false,
        areaStyle: {
            color: null,
        },
        hitDetectionRadius: 10,
        smooth: false,
        smoothTension: 0.4,
        data: []
    };

    declare('painter.Charts.type.Line', _.painter.Charts.type.Default, {
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

                datasetStroke: options.showLine,
                datasetStrokeWidth: options.lineStyle.borderWidth,
                strokeColor: options.lineStyle.borderColor || this.instance.options.lineColorDefaults[options.index % this.instance.options.lineColorDefaults.length],

                datasetFill: options.showArea,
                fillColor: options.areaStyle.color || this.instance.options.areaColorDefaults[options.index % this.instance.options.areaColorDefaults.length],

                bezierCurve: options.smooth,
                bezierCurveTension: options.smoothTension,

                pointHitDetectionRadius: options.hitDetectionRadius,

                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>",
            };

            this.lines = [];
            this.segments = [];
            this.grid = this.instance.grid;
            this.LineClass = declare(_.painter.Charts.sharp.Line, {
                ctx: this.ctx,
                grid: this.grid,
                bezierCurve: this.options.bezierCurve,
                bezierCurveTension: this.options.bezierCurveTension,
                lineWidth: this.options.datasetStrokeWidth,
                strokeStyle: this.options.strokeColor,
                datasetStroke: this.options.datasetStroke
            });
            this.PointClass = declare(_.painter.Charts.sharp.Point, {
                type: this.grid.status,
                ctx: this.ctx,
                grid: this.grid,
                itemLabel: this.options.name,
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
                line.previous = this.lines[index - 1] || line;
                line.next = this.lines[index + 1] || line;
                line.siblings = this.lines.length;
            }, this);
        },
        update: function(data) {
            _.each(this.segments, function(index, segment) {
                segment.value = data && data[index] || 0;
                segment.base = this.grid.baseY;
                segment.restore(['display', 'fillColor', 'radius', 'strokeColor', 'strokeWidth']);
                segment.save();
                this.calculate(index, segment);
            }, this);
            for (var index = this.segments.length; index < data.length; index++) {
                this.addSegment(index, data[index]);
            }
            _.each(this.lines, function(index, line) {
                line.previous = this.lines[index - 1] || line;
                line.next = this.lines[index + 1] || line;
                line.siblings = this.lines.length;
            }, this);
        },
        addSegment: function(index, value) {
            var segment = new this.PointClass({
                    type: this.grid.status,
                    value: value,
                    label: (this.grid.status === 1) ? this.grid.yLabels[index] : this.grid.xLabels[index],
                }),
                line = new this.LineClass({
                    index: index,
                    point: segment
                });
            console.log(this.grid.status);
            this.lines.push(line);
            this.segments.push(segment);
            this.calculate(index, segment);
            _.extend(segment, true, {
                x: this.segments[index - 1] ? this.segments[index - 1].X : segment.X,
                y: this.segments[index - 1] ? this.segments[index - 1].Y : segment.Y,
                titleLabel: segment.label
            });
            segment.save();
        },
        calculate: function(index, segment) {
            switch (segment.type) {
                case 0:
                    _.extend(segment, true, {
                        X: this.grid.calculateX(index),
                        Y: this.grid.calculateY(segment.value)
                    });
                    break;
                case 1:
                    _.extend(segment, true, {
                        X: this.grid.calculateX(segment.value),
                        Y: this.grid.calculateY(index)
                    });
                    break;
            }
        },
        removeSegment: function(index) {
            index = parseInt(index) || 0;
            this.segments.splice(index, 1);
        },
        getSegmentsAtEvent: function(e, charts) {
            var segmentsArray = [],
                eventPosition = events.getRelativePosition(e);
            _.loop(this.segments, function(index, segment) {
                if (segment.inRange(eventPosition.x, eventPosition.y, (charts === undefined))) {
                    if (charts && charts.length) {
                        _.each(charts, function(i, chart) {
                            segmentsArray.push(chart.segments[index]);
                        });
                    } else {
                        segmentsArray.push(segment);
                    }
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
                    this.lines[index].draw();
                    points.push(segment);
                }
            }, this);

            if (this.options.datasetFill && (points.length > 0) && ((this.grid.status === 0) || (this.grid.status === 1))) {
                if (this.grid.status === 0) {
                    ctx.lineTo(points[points.length - 1].x, this.grid.baseY);
                    ctx.lineTo(points[0].x, this.grid.baseY);
                } else {
                    ctx.lineTo(this.grid.baseX, points[points.length - 1].y);
                    ctx.lineTo(this.grid.baseX, points[0].y);
                }
                ctx.globalAlpha = 0.85;
                ctx.fillStyle = this.options.fillColor;
                ctx.closePath();
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            _.each(points, function(index, point) {
                point.draw();
            });
        }
    });

    _.painter.Charts.prototype.line = function() {
        var chart,
            chartName,
            id = 0;
        if (this.grid) {
            grid = this.grid;
            grid.charts.lines = grid.charts.lines || [];
            _.each(this.series.line, function(i, options) {
                options.index = id++;
                chartName = this.getChartName(options.name);
                if (this.historyCharts[chartName] && this.historyCharts[chartName].type == 'line') {
                    chart = this.historyCharts[chartName];
                    chart.update(options.data, options.index);
                } else {
                    chart = new _.painter.Charts.type.Line(options, this, options.zIndex);
                    chart.type = 'line';
                    this.historyCharts[chartName] = chart;
                }
                grid.charts.lines.push(chart);
                this.activedCharts.push(chart);
            }, this);
        }
    }
});