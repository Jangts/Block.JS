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
    '$_/painter/Charts/sharp/Rectangle.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var helpers = _.painter.Charts.util.helpers,
        events = _.painter.Charts.util.events;

    declare('painter.Charts.type.Bar', _.painter.Charts.type.Default, {
        defaults: {
            name: '',
            zIndex: 0,
            itemStyle: {
                normal: {
                    color: null,
                    barBorderColor: '#000',
                    barBorderWidth: 0
                },
                emphasis: {
                    color: null,
                    barBorderColor: '#000',
                    barBorderWidth: 0
                },
            },
            barWidth: 'auto',
            barMaxWidth: 'auto',
            barGap: 5,
            barCategoryGap: 3,
            data: []
        },
        initialize: function(options) {
            var options = _.util.obj.deepMerge(this.defaults, options),
                barStrokeWidth = parseInt(options.itemStyle.normal.barBorderWidth);
            this.options = {
                index: options.index,
                name: options.name,
                barShowStroke: (barStrokeWidth > 0),
                barStrokeWidth: barStrokeWidth,
                barValueSpacing: options.barGap,
                barDatasetSpacing: options.barCategoryGap,
                fillColor: options.itemStyle.normal.color || this.instance.options.barColorDefaults[options.index % this.instance.options.barColorDefaults.length],
                strokeColor: options.itemStyle.normal.barBorderColor,
                emphasisFill: options.itemStyle.emphasis.color || this.instance.options.barColorDefaultsEmphasis[options.index % this.instance.options.barColorDefaultsEmphasis.length],
                emphasisStroke: options.itemStyle.emphasis.barBorderColor,
                emphasisStrokeWidth: options.itemStyle.emphasis.barBorderWidth,

                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>"
            }
            this.segments = []
            this.grid = this.instance.grid;
            this.BarClass = declare(_.painter.Charts.sharp.Rectangle, {
                ctx: this.ctx,
                grid: this.grid,
                itemLabel: this.options.name,
                showStroke: this.options.barShowStroke,
                fillColor: this.options.fillColor,
                emphasisFill: this.options.emphasisFill,
                strokeColor: this.options.strokeColor,
                emphasisStroke: this.options.emphasisStroke,
                strokeWidth: this.options.barStrokeWidth,
                emphasisStrokeWidth: this.options.emphasisStrokeWidth,
            });
            this.buildSegments(options.data);

        },
        buildSegments: function(data) {
            _.each(data, function(index, value) {
                this.addSegment(index, value);
            }, this);
        },
        update: function(data, datasetIndex) {
            data = data || [];
            _.each(this.segments, function(index, segment) {
                segment.value1 = ((segment.type === 2) || (segment.type === 3)) ? data[index][0] : 0,
                    segment.value2 = ((segment.type === 2) || (segment.type === 3)) ? data[index][1] : data[index],
                    segment.restore(['fillColor', 'strokeColor', 'strokeWidth']);
                segment.save();
                this.calculate(index, segment);
            }, this);
            for (var index = this.segments.length; index < data.length; index++) {
                this.addSegment(index, data[index]);
            }
        },
        addSegment: function(index, value) {
            if (this.grid.status < 4) {
                if (typeof value === 'number') {
                    var segment = new this.BarClass({
                        type: this.grid.status,
                        value1: 0,
                        value2: value,
                        value: value
                    });
                } else if (typeof value === 'object') {
                    if (value.value) {
                        if (typeof value.value === 'number') {
                            var segment = new this.BarClass({
                                type: this.grid.status,
                                value1: 0,
                                value2: value.value,
                                value: value.value
                            });
                        } else if (typeof value.value === 'object') {
                            var segment = new this.BarClass({
                                type: this.grid.status + 2,
                                value1: value.value[0],
                                value2: value.value[1],
                                value: value.value
                            });
                        }
                        if (value.itemStyle && value.itemStyle.normal && value.itemStyle.normal.color) {
                            segment.fillColor = value.itemStyle.normal.color;
                        }
                        if (value.itemStyle && value.itemStyle.emphasis && value.itemStyle.emphasis.color) {
                            segment.emphasisFill = value.itemStyle.emphasis.color;
                        }
                    } else {
                        var segment = new this.BarClass({
                            type: this.grid.status + 2,
                            value1: value[0],
                            value2: value[1],
                            value: value
                        });
                    }
                }
                segment.label = (segment.grid.status === 1) ? segment.grid.yLabels[index] : segment.grid.xLabels[index];
                segment.titleLabel = segment.label;
                this.segments.push(segment);
                this.calculate(index, segment);
                segment.save();
            }
        },
        calculate: function(index, segment) {
            var length = this.instance.series.bar.length;
            var setGap = this.options.barDatasetSpacing;
            var valGap = this.options.barValueSpacing;
            switch (segment.type) {
                case 0:
                    var width = segment.grid.calculateBarWidth(length, setGap, valGap),
                        x = segment.grid.calculateBarX(length, this.options.index, index, setGap, valGap),
                        y = segment.grid.calculateY(segment.value2);
                    _.extend(segment, true, {
                        radius: width / 2,
                        x: x,
                        y: y,
                        X: x,
                        Y: y,
                        x1: x,
                        y1: segment.grid.baseY,
                        x2: x,
                        y2: segment.grid.baseY,
                    });
                    break;
                case 1:
                    var height = segment.grid.calculateBarHeight(length, setGap, valGap),
                        x = segment.grid.calculateX(segment.value2),
                        y = segment.grid.calculateBarY(length, this.options.index, index, setGap, valGap);
                    _.extend(segment, true, {
                        radius: height / 2,
                        x: x,
                        y: y,
                        X: x,
                        Y: y,
                        x1: segment.grid.baseX,
                        y1: y,
                        x2: segment.grid.baseX,
                        y2: y
                    });
                    break;
                case 2:
                    var width = segment.grid.calculateBarWidth(length, setGap, valGap),
                        x = segment.grid.calculateBarX(length, this.options.index, index, setGap, valGap),
                        y1 = segment.grid.calculateY(segment.value1),
                        y2 = segment.grid.calculateY(segment.value2);
                    _.extend(segment, true, {
                        radius: width / 2,
                        x: x,
                        y: (y1 + y2) / 2,
                        X: x,
                        Y: y2,
                        x1: x,
                        y1: y1,
                        x2: x,
                        y2: y1
                    });
                    break;
                case 3:
                    var height = segment.grid.calculateBarHeight(length, setGap, valGap),
                        x1 = segment.grid.calculateX(segment.value1);
                    x2 = segment.grid.calculateX(segment.value2);
                    y = segment.grid.calculateBarY(length, this.options.index, index, setGap, valGap);
                    _.extend(segment, true, {
                        radius: height / 2,
                        x: (x1 + x2) / 2,
                        y: y,
                        X: x2,
                        Y: y,
                        x1: x1,
                        y1: y,
                        x2: x1,
                        y2: y
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
                if (segment.inRange(eventPosition.x, eventPosition.y)) {
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
            var easingDecimal = ease || 1;
            var ctx = this.ctx,
                datasetIndex = this.options.index;
            var length = this.instance.series.bar.length;
            var setGap = this.options.barDatasetSpacing;
            var valGap = this.options.barValueSpacing;

            if (this.grid.status === 1) {
                _.each(this.segments, function(index, segment) {
                    if (segment.hasValue()) {
                        segment.transition({
                            radius: segment.grid.calculateBarHeight(length, setGap, valGap) / 2,
                            x1: segment.x1,
                            y1: segment.y,
                            x2: segment.X,
                            y2: segment.Y
                        }, easingDecimal).draw();
                    }
                }, this);
            } else {
                _.each(this.segments, function(index, segment) {
                    if (segment.hasValue()) {
                        segment.transition({
                            radius: segment.grid.calculateBarWidth(length, setGap, valGap) / 2,
                            x1: segment.x,
                            y1: segment.y1,
                            x2: segment.X,
                            y2: segment.Y
                        }, easingDecimal).draw();
                    }
                }, this);
            }
        }
    });

    _.painter.Charts.prototype.bar = function(index) {
        var chart,
            chartName,
            id = 0,
            grid = this.grid;
        grid.charts.bars = grid.charts.bars || [];
        if (grid) {
            _.extend(grid, {
                calculateBarX: function(datasetCount, datasetIndex, barIndex, datasetSpacing, valueSpacing) {
                    var xWidth = this.calculateBaseWidth(valueSpacing),
                        xAbsolute = this.calculateX(barIndex) - (xWidth / 2),
                        barWidth = this.calculateBarWidth(datasetCount, datasetSpacing, valueSpacing);
                    return xAbsolute + (barWidth * datasetIndex) + (datasetIndex * datasetSpacing) + barWidth / 2;
                },
                calculateBaseWidth: function(valueSpacing) {
                    return (this.calculateX(1) - this.calculateX(0)) - (2 * valueSpacing);
                },
                calculateBarWidth: function(datasetCount, datasetSpacing, valueSpacing) {
                    //The padding between datasets is to the right of each bar, providing that there are more than 1 dataset
                    var baseWidth = this.calculateBaseWidth(valueSpacing) - ((datasetCount - 1) * datasetSpacing);
                    return (baseWidth / datasetCount);
                },

                calculateBarY: function(datasetCount, datasetIndex, barIndex, datasetSpacing, valueSpacing) {
                    var yHeight = this.calculateBaseHeight(valueSpacing),
                        yAbsolute = this.calculateY(barIndex) + (yHeight / 2),
                        barHeight = this.calculateBarHeight(datasetCount, datasetSpacing, valueSpacing);
                    return yAbsolute - (barHeight * datasetIndex) - (datasetIndex * datasetSpacing) - barHeight / 2;
                },
                calculateBaseHeight: function(valueSpacing) {
                    return (this.calculateY(0) - this.calculateY(1)) - (2 * valueSpacing);
                },
                calculateBarHeight: function(datasetCount, datasetSpacing, valueSpacing) {
                    //The padding between datasets is to the right of each bar, providing that there are more than 1 dataset
                    var baseHeight = this.calculateBaseHeight(valueSpacing) - ((datasetCount - 1) * datasetSpacing);
                    return (baseHeight / datasetCount);
                }
            });

            _.each(this.series.bar, function(i, options) {
                options.index = id++;
                chartName = this.getChartName(options.name);
                if (this.historyCharts[chartName] && this.historyCharts[chartName].type == 'bar') {
                    chart = this.historyCharts[chartName];
                    chart.update(options.data, options.index);
                } else {
                    chart = new _.painter.Charts.type.Bar(options, this, options.zIndex);
                    chart.type = 'bar';
                    this.historyCharts[chartName] = chart;
                }
                grid.charts.bars.push(chart);
                this.activedCharts.push(chart);
            }, this);
        }
    }
});