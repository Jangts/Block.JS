/*!
 * Block.JS Framework Source Code
 *
 * class painter/Charts
 *
 * Date: 2015-09-04
 */
;
block([
    '$_/util/arr.xtd',
    '$_/util/obj.xtd',
    '$_/painter/Charts/Charts.cls',
    '$_/painter/Charts/util/events.xtd',
    '$_/painter/Charts/scale/Polar.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var helpers = _.painter.Charts.util.helpers,
        events = _.painter.Charts.util.events;

    _.extend(_.painter.Charts.util.defaults, {
        radar: {
            show: true,
            zIndex: 0,
            center: ['50%', '50%'],
            radius: '75%',
            shape: 'polygon',
            splitArea: {
                show: true,
                areaStyle: {
                    color: null
                }
            },
            axisLine: {
                show: true,
                onZero: false,
                lineStyle: {
                    color: "rgba(0,0,0,.2)",
                    width: 1
                }
            },
            splitNumber: 5,
            splitLine: {
                show: true,
                lineStyle: {
                    color: "rgba(0,0,0,.1)",
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
            indicator: []
        }
    });

    _.painter.Charts.prototype.buildRadar = function() {
        var radar = _.util.obj.deepMerge(_.painter.Charts.util.defaults.radar, this.options.radar || {});

        var style = helpers.calculateCircleStyle(radar, this.width, this.height);

        var labels = []
        ranges = [];
        _.each(radar.indicator, function(i, indicator) {
            if (typeof indicator.name === 'string') {
                labels.push(indicator.name);
                ranges.push({
                    min: indicator.min || 0,
                    max: indicator.max
                });
            };

        });

        var polarOptions = {
            status: 6,
            ranges: ranges,
            splitNumber: radar.splitNumber,
            backgroundColors: radar.splitArea.show && radar.splitArea.areaStyle.color,

            display: (radar.show == true),
            hasBar: false,
            hasScatter: false,
            instance: this,
            ctx: this.getLayer(radar.zIndex).getContext("2d"),
            radius: style.radius,
            xCenter: style.x,
            yCenter: style.y,

            angleAxisMax: labels.length,
            angleAxisMin: 0,
            angleAxisShow: (radar.axisLine.show == true),
            angleAxisLineShow: (radar.axisLine.show == true),
            angleAxisLineWidth: radar.axisLine.lineStyle.width,
            angleAxisLineColor: radar.axisLine.lineStyle.color,

            angleSplitLineShow: (radar.splitLine.show == true),
            angleSplitLineArc: (radar.shape === 'circle'),
            angleSplitLineWidth: radar.splitLine.lineStyle.width,
            angleSplitLineColor: radar.splitLine.lineStyle.color,

            angleLabelsShow: (radar.axisLabel.show == true),
            angleLabelFontColor: radar.axisLabel.textStyle.fontColor,
            angleLabelFontSize: radar.axisLabel.textStyle.fontSize,
            angleLabelFontStyle: radar.axisLabel.textStyle.fontStyle,
            angleLabelFontFamily: radar.axisLabel.textStyle.fontFamily,

            angleLabels: labels,
            angleTemplateString: radar.axisLabel.formatter,
            angleOnZero: true,
            angleBeginAtZero: true,
            angleIntegersOnly: true,

            radiusAxisMax: null,
            radiusAxisMin: 0,
            radiusAxisShow: (radar.splitLine.show == true),
            radiusAxisLineShow: (radar.axisLine.show == true),
            radiusAxisLineWidth: radar.axisLine.lineStyle.width,
            radiusAxisLineColor: radar.axisLine.lineStyle.color,

            radiusSplitLineShow: (radar.splitLine.show == true),
            radiusSplitLineWidth: radar.splitLine.lineStyle.width,
            radiusSplitLineColor: radar.splitLine.lineStyle.color,

            radiusLabelsShow: false,
            radiusLabelFontColor: radar.axisLabel.textStyle.fontColor,
            radiusLabelFontSize: radar.axisLabel.textStyle.fontSize,
            radiusLabelFontStyle: radar.axisLabel.textStyle.fontSize,
            radiusLabelFontFamily: radar.axisLabel.textStyle.fontFamily,

            radiusLabels: [],
            radiusTemplateString: radar.axisLabel.formatter,
            radiusOnZero: true,
            radiusBeginAtZero: true,
            radiusIntegersOnly: true
        };

        if (this.radarpolar === null) {
            this.radarpolar = new _.painter.Charts.scale.Polar(polarOptions);
            _.extend(this.radarpolar, true, {});

            events.bindHover(this, function(evt) {
                var actives = [],
                    restores = {
                        'display': 'emphasisDisplay',
                        'fillColor': 'emphasisFill',
                        'radius': 'emphasisRadius',
                        'strokeColor': 'emphasisStroke',
                        'strokeWidth': 'emphasisStrokeWidth'
                    };
                for (var i = 0; this.radarpolar.charts.radarpolar && i < this.radarpolar.charts.radarpolar.length && actives.length === 0; i++) {
                    var chart = this.radarpolar.charts.radarpolar[i];
                    var activeSegments = chart.getSegmentsAtEvent(evt);
                    _.each(chart.segments, function(index, segment) {
                        segment.restore(_.util.obj.keysArray(restores));
                    });
                    if (activeSegments.length > 0) {
                        _.each(activeSegments, function(index, activeSegment) {
                            actives.push(activeSegment);
                            _.each(restores, function(normal, emphasis) {
                                activeSegment[normal] = activeSegment[emphasis];
                            });
                        });
                        break;
                    }
                };
                if (this.options.tooltip.show) {
                    this.showTooltip(actives, false, true);
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
            this.radarpolar.update(polarOptions);
        }
    };
});