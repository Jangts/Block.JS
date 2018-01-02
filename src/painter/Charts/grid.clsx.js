/*!
 * Block.JS Framework Source Code
 * A Web Front-end Development Javascript Framework
 * Mainly For DOM Operation, Data Exchange, Graphic Effects (Image, Canvas, SVG And Ect.), Front-end UI, And Some Basic Calculations.
 * Stripped from Tangram New Idea (TNI)
 *
 * class painter/Charts
 * http://www.yangram.net/blockjs/
 *
 * Written and Designed By Ivan Yeung
 *
 * Date: 2015-09-04
 */
;
block([
    '$_/util/arr.xtd',
    '$_/util/bool.xtd',
    '$_/util/obj.xtd',
    '$_/painter/Charts/Charts.cls',
    '$_/painter/Charts/util/events.xtd',
    '$_/painter/Charts/scale/Grid.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var helpers = _.painter.Charts.util.helpers,
        events = _.painter.Charts.util.events;

    _.extend(_.painter.Charts.util.defaults, {
        grid: {
            show: true,
            zIndex: 0,
            left: '10%',
            top: 60,
            right: '10%',
            bottom: 60,
            width: 'auto',
            height: 'auto',
            padding: 10,
        },
        xAxis: {
            show: true,
            type: 'label',
            axisLine: {
                show: true,
                onZero: false,
                lineStyle: {
                    color: "rgba(0,0,0,.2)",
                    width: 1
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: "rgba(0,0,0,.05)",
                    width: 1
                }
            },
            axisLabel: {
                show: true,
                //inside: false,
                //rotate: 0,
                //margin: 8,
                formatter: "<%=value%>",
                textStyle: {
                    fontFamily: "'Microsoft YaHei', 'Hiragino Sans'",
                    fontSize: 12,
                    fontStyle: "normal",
                    fontColor: "#666"
                }
            },
            max: null,
            min: null,
            data: null
        },
        yAxis: {
            show: true,
            type: 'value',
            axisLine: {
                show: true,
                onZero: false,
                lineStyle: {
                    color: "rgba(0,0,0,.20)",
                    width: 1
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: "rgba(0,0,0,.05)",
                    width: 1
                }
            },
            axisLabel: {
                show: true,
                //inside: false,
                //rotate: 0,
                //margin: 8,
                formatter: "<%=value%>",
                textStyle: {
                    fontFamily: "'Microsoft YaHei', 'Hiragino Sans'",
                    fontSize: 12,
                    fontStyle: "normal",
                    fontColor: "#666"
                }
            },
            max: null,
            min: null,
            data: null
        }
    });

    _.painter.Charts.prototype.buildGrid = function() {
        var grid = _.util.obj.deepMerge(_.painter.Charts.util.defaults.grid, this.options.grid || {}),
            xAxis = _.util.obj.deepMerge(_.painter.Charts.util.defaults.xAxis, this.options.xAxis || {}),
            yAxis = _.util.obj.deepMerge(_.painter.Charts.util.defaults.yAxis, this.options.yAxis || {});

        var style = helpers.calculateRectangleStyle(grid, this.width, this.height);

        var gridOptions = {
            display: (grid.show == true),
            hasBar: this.series.bar ? true : false,
            hasScatter: this.series.scatter ? true : false,
            instance: this,
            ctx: this.getLayer(grid.zIndex).getContext("2d"),
            width: style.width,
            height: style.height,
            top: style.top,
            left: style.left,
            padding: grid.padding,

            xAxisMax: xAxis.max,
            xAxisMin: xAxis.min,
            xAxisShow: (xAxis.show == true),
            xAxisLineShow: (xAxis.axisLine.show == true),
            xAxisLineWidth: xAxis.axisLine.lineStyle.width,
            xAxisLineColor: xAxis.axisLine.lineStyle.color,

            xSplitLineShow: (xAxis.splitLine.show == true),
            xSplitLineWidth: xAxis.splitLine.lineStyle.width,
            xSplitLineColor: xAxis.splitLine.lineStyle.color,

            xLabelsShow: (xAxis.axisLabel.show == true),
            xLabelFontColor: xAxis.axisLabel.textStyle.fontColor,
            xLabelFontSize: xAxis.axisLabel.textStyle.fontSize,
            xLabelFontStyle: xAxis.axisLabel.textStyle.fontStyle,
            xLabelFontFamily: xAxis.axisLabel.textStyle.fontFamily,

            xLabels: xAxis.data,
            xTemplateString: xAxis.axisLabel.formatter,
            xOnZero: xAxis.axisLine.onZero,
            xBeginAtZero: (xAxis.axisLine.beginAtZero == true),
            xIntegersOnly: true,

            yAxisMax: yAxis.max,
            yAxisMin: yAxis.min,
            yAxisShow: (yAxis.show == true),
            yAxisLineShow: (yAxis.axisLine.show == true),
            yAxisLineWidth: yAxis.axisLine.lineStyle.width,
            yAxisLineColor: yAxis.axisLine.lineStyle.color,

            ySplitLineShow: (yAxis.splitLine.show == true),
            ySplitLineWidth: yAxis.splitLine.lineStyle.width,
            ySplitLineColor: yAxis.splitLine.lineStyle.color,

            yLabelsShow: (yAxis.axisLabel.show == true),
            yLabelFontColor: yAxis.axisLabel.textStyle.fontColor,
            yLabelFontSize: yAxis.axisLabel.textStyle.fontSize,
            yLabelFontStyle: yAxis.axisLabel.textStyle.fontStyle,
            yLabelFontFamily: yAxis.axisLabel.textStyle.fontFamily,

            yLabels: yAxis.data,
            yTemplateString: yAxis.axisLabel.formatter,
            yOnZero: yAxis.axisLine.onZero,
            yBeginAtZero: (yAxis.axisLine.beginAtZero == true),
            yIntegersOnly: true
        };

        gridOptions.status = (gridOptions.xLabels && gridOptions.yLabels) ? 5 : (gridOptions.xLabels ? 0 : (gridOptions.yLabels ? 1 : 4));

        if (this.grid === null) {
            this.grid = new _.painter.Charts.scale.Grid(gridOptions);
            events.bindHover(this, function(evt) {
                var actives = [],
                    types = ['lines', 'bars', 'scatters'],
                    restores = {
                        'lines': {
                            'display': 'emphasisDisplay',
                            'fillColor': 'emphasisFill',
                            'radius': 'emphasisRadius',
                            'strokeColor': 'emphasisStroke',
                            'strokeWidth': 'emphasisStrokeWidth'
                        },
                        'scatters': {
                            'radius': 'emphasisRadius'
                        },
                        'bars': {
                            'fillColor': 'emphasisFill',
                            'strokeColor': 'emphasisStroke',
                            'strokeWidth': 'emphasisWidth'
                        }
                    },
                    charts = _.util.arr.merge(this.grid.charts.lines, this.grid.charts.bars, this.grid.charts.scatters);
                _.each(types, function(i, type) {
                    for (var i = 0; this.grid.charts[type] && i < this.grid.charts[type].length && actives.length === 0; i++) {
                        var chart = this.grid.charts[type][i];
                        console.log(chart);
                        activeSegments = ((this.options.tooltip.type == 'axis') ? chart.getSegmentsAtEvent(evt, charts) : chart.getSegmentsAtEvent(evt));
                        _.each(chart.segments, function(index, segment) {
                            segment.restore(_.util.obj.keysArray(restores[type]));
                        });
                        if (activeSegments.length > 0) {
                            _.each(activeSegments, function(index, activeSegment) {
                                actives.push(activeSegment);
                                _.each(restores[type], function(normal, emphasis) {
                                    activeSegment[normal] = activeSegment[emphasis];
                                });
                            });
                            break;
                        }
                    }
                }, this);

                if (this.options.tooltip.show) {
                    this.showTooltip(actives, false, (this.options.tooltip.type == 'axis'));
                }
                if ((this.options.tooltip.type == 'axis') && (actives.length > 0) && (this.grid.charts.lines) && (this.grid.charts.lines.length > 0)) {
                    if (this.grid.status === 0) {
                        // 横轴为项，纵轴为值
                        var x = actives[0].x,
                            y1 = this.grid.topPoint,
                            y2 = this.grid.bottomPoint,
                            ctx = this.grid.ctx;
                        ctx.translate(0.5, 0);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = '#FF0000';
                        ctx.beginPath();
                        ctx.moveTo(x, y1);
                        ctx.lineTo(x, y2);
                        ctx.stroke();
                        ctx.translate(-0.5, 0);
                        ctx.closePath();
                    }
                    if (this.grid.status === 1) {
                        // 横轴为值，纵轴为项
                        var x1 = this.grid.leftPoint,
                            x2 = this.grid.rightPoint,
                            y = actives[0].y,
                            ctx = this.grid.ctx;
                        ctx.translate(0, 0.5);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = '#FF0000';
                        ctx.beginPath();
                        ctx.moveTo(x1, y);
                        ctx.lineTo(x2, y);
                        ctx.stroke();
                        ctx.translate(0, -0.5);
                        ctx.closePath();
                    }
                }
                if (actives.length > 0) {
                    this.actived = 1;
                    _.dom.setStyle(this.Element, 'cursor', 'pointer');
                } else {
                    this.actived = 0;
                    _.dom.setStyle(this.Element, 'cursor', 'default');
                }
            });
        } else {
            this.grid.update(gridOptions);

        }
    };
});