/*!
 * tangram.js framework source code
 *
 * class painter/Charts
 *
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/arr/',
    '$_/obj/',
    '$_/painter/Charts/',
    '$_/painter/Charts/util/events',
    '$_/painter/Charts/components/scales/Polar'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console;

    var helpers = _.painter.Charts.util.helpers,
        events = _.painter.Charts.util.events;

    _.extend(_.painter.Charts.util.defaults, {
        polar: {
            show: true,
            zIndex: 0,
            center: ['50%', '50%'],
            radius: '75%',
            shape: 'polygon',
        },
        angleAxis: {
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
        radiusAxis: {
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

    _.painter.Charts.prototype.buildPolar = function() {
        var polar = _.obj.deepMerge(_.painter.Charts.util.defaults.polar, this.options.polar || {}),
            angleAxis = _.obj.deepMerge(_.painter.Charts.util.defaults.angleAxis, this.options.angleAxis || {}),
            radiusAxis = _.obj.deepMerge(_.painter.Charts.util.defaults.radiusAxis, this.options.radiusAxis || {});

        var style = helpers.calculateCircleStyle(polar, this.width, this.height);

        var polarOptions = {
            display: (polar.show == true),
            hasBar: this.series.bar ? true : false,
            hasScatter: this.series.scatter ? true : false,
            instance: this,
            ctx: this.getLayer(polar.zIndex).getContext("2d"),
            radius: style.radius,
            xCenter: style.x,
            yCenter: style.y,

            angleAxisMax: angleAxis.max,
            angleAxisMin: angleAxis.min,
            angleAxisShow: (angleAxis.show == true),
            angleAxisLineShow: (angleAxis.axisLine.show == true),
            angleAxisLineWidth: angleAxis.axisLine.lineStyle.width,
            angleAxisLineColor: angleAxis.axisLine.lineStyle.color,

            angleSplitLineShow: (angleAxis.splitLine.show == true),
            angleSplitLineArc: (polar.shape === 'circle'),
            angleSplitLineWidth: angleAxis.splitLine.lineStyle.width,
            angleSplitLineColor: angleAxis.splitLine.lineStyle.color,

            angleLabelsShow: (angleAxis.axisLabel.show == true),
            angleLabelFontColor: angleAxis.axisLabel.textStyle.fontColor,
            angleLabelFontSize: angleAxis.axisLabel.textStyle.fontSize,
            angleLabelFontStyle: angleAxis.axisLabel.textStyle.fontStyle,
            angleLabelFontFamily: angleAxis.axisLabel.textStyle.fontFamily,


            angleLabels: angleAxis.data,
            angleTemplateString: angleAxis.axisLabel.formatter,
            angleOnZero: angleAxis.axisLine.onZero,
            angleBeginAtZero: (angleAxis.axisLine.beginAtZero == true),
            angleIntegersOnly: true,

            radiusAxisMax: radiusAxis.max,
            radiusAxisMin: radiusAxis.min,
            radiusAxisShow: (radiusAxis.show == true),
            radiusAxisLineShow: (radiusAxis.axisLine.show == true),
            radiusAxisLineWidth: radiusAxis.axisLine.lineStyle.width,
            radiusAxisLineColor: radiusAxis.axisLine.lineStyle.color,

            radiusSplitLineShow: (radiusAxis.splitLine.show == true),
            radiusSplitLineWidth: radiusAxis.splitLine.lineStyle.width,
            radiusSplitLineColor: radiusAxis.splitLine.lineStyle.color,

            radiusLabelsShow: (radiusAxis.axisLabel.show == true),
            radiusLabelFontColor: radiusAxis.axisLabel.textStyle.fontColor,
            radiusLabelFontSize: radiusAxis.axisLabel.textStyle.fontSize,
            radiusLabelFontStyle: radiusAxis.axisLabel.textStyle.fontStyle,
            radiusLabelFontFamily: radiusAxis.axisLabel.textStyle.fontFamily,

            radiusLabels: radiusAxis.data,
            radiusTemplateString: radiusAxis.axisLabel.formatter,
            radiusOnZero: radiusAxis.axisLine.onZero,
            radiusBeginAtZero: (radiusAxis.axisLine.beginAtZero == true),
            radiusIntegersOnly: true
        };

        polarOptions.status = (polarOptions.angleLabels && polarOptions.radiusLabels) ? 5 : (polarOptions.angleLabels ? 0 : (polarOptions.radiusLabels ? 1 : 4));

        if (this.polar === null) {
            this.polar = new _.painter.Charts.components.scales.Polar(polarOptions);
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
                        'areas': {
                            'fillColor': 'emphasisFill',
                            'strokeColor': 'emphasisStroke',
                            'strokeWidth': 'emphasisWidth'
                        }
                    },
                    charts = _.arr.merge(this.polar.charts.lines, this.polar.charts.areas, this.polar.charts.scatters);
                _.each(types, function(i, type) {
                    for (var i = 0; this.polar.charts[type] && i < this.polar.charts[type].length && actives.length === 0; i++) {
                        var chart = this.polar.charts[type][i];
                        activeSegments = ((this.options.tooltip.type == 'axis') ? chart.getSegmentsAtEvent(evt, charts) : chart.getSegmentsAtEvent(evt));
                        _.each(chart.segments, function(index, segment) {
                            segment.restore(_.obj.keysArray(restores[type]));
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
                if ((this.options.tooltip.type == 'axis') && (actives.length > 0) && (this.polar.charts.lines) && (this.polar.charts.lines.length > 0)) {
                    if (this.polar.status === 0) {
                        // 横轴为项，纵轴为值
                        var x = actives[0].x,
                            y1 = this.polar.topPoint,
                            y2 = this.polar.bottomPoint,
                            ctx = this.polar.ctx;
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
                    if (this.polar.status === 1) {
                        // 横轴为值，纵轴为项
                        var x1 = this.polar.leftPoint,
                            x2 = this.polar.rightPoint,
                            y = actives[0].y,
                            ctx = this.polar.ctx;
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
            this.polar.update(polarOptions);
        }
    };
});