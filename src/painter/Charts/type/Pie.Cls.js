/*!
 * Block.JS Framework Source Code
 *
 * class painter/Charts
 *
 * Date: 2015-09-04
 */
;
block([
    '$_/painter/Charts/type/Default.cls',
    '$_/painter/Charts/sharp/Arc.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var helpers = _.painter.Charts.util.helpers,
        events = _.painter.Charts.util.events,
        defaultConfig = {
            name: '',
            zIndex: 0,
            center: ['50%', '50%'],
            radius: [0, '75%', '80%'],
            roseType: false,
            itemStyle: {
                normal: {
                    color: null,
                    borderColor: '#000',
                    borderWidth: 0,
                },
                emphasis: {
                    color: null,
                    borderColor: null,
                    borderWidth: 1
                }
            },
            label: {
                normal: {
                    show: false,
                    position: 'outside',
                    formatter: '',
                    textStyle: {
                        color: '#fff',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontFamily: '\'Microsoft YaHei\', \'Hiragino Sans\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
                        fontSize: 12,
                    }
                },
                emphasis: {
                    show: false,
                    formatter: '',
                    textStyle: {
                        color: '#fff',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontFamily: '\'Microsoft YaHei\', \'Hiragino Sans\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
                        fontSize: 12,
                    }
                }
            },
            animateRotate: true,
            animateScale: false,
            data: []
        };

    declare('painter.Charts.type.Pie', _.painter.Charts.type.Default, {
        defaults: defaultConfig,
        initialize: function(options) {
            var instance = this.instance,
                options = _.util.obj.deepMerge(this.defaults, options),
                barStrokeWidth = parseInt(options.itemStyle.normal.barBorderWidth),
                emphasisRadius;


            var style = helpers.calculateDoughnutStyle(options, instance.width, instance.height),
                maxRadius = style.maxRadius,
                innerRadius = style.innerRadius,
                outerRadius = style.outerRadius,
                x = style.x,
                y = style.y;

            if (_.util.bool.isArr(options.radius) && options.radius[2]) {
                if (_.util.bool.isPercent(options.radius[2])) {
                    emphasisRadius = maxRadius * parseInt(options.radius[2]) / 100
                } else if (_.util.bool.isNumeric(options.radius[2])) {
                    emphasisRadius = parseFloat(options.radius[1]);
                } else {
                    emphasisRadius = outerRadius + 5;
                }
            } else {
                emphasisRadius = outerRadius + 5;
            }

            this.options = {
                index: options.index,
                name: options.name,
                animateRotate: options.animateRotate,
                animateScale: options.animateScale,

                innerRadius: innerRadius,
                outerRadius: outerRadius,
                emphasisRadius: emphasisRadius,
                fillColor: options.itemStyle.normal.color,
                emphasisFill: options.itemStyle.emphasis.color,
                center: [x, y],

                segmentShowStroke: (barStrokeWidth > 0),
                segmentStrokeColor: options.itemStyle.normal.borderColor || '#FFFFFF',
                segmentStrokeWidth: barStrokeWidth,

                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>"
            };

            if (options.roseType) {
                switch (options.roseType) {
                    case 'area':
                        this.options.type = 'area';
                        break;
                    case 'angle':
                        this.options.type = 'angle';
                        break;
                    default:
                        this.options.type = 'radius';
                }
            } else {
                this.options.type = 'pie';
            }

            this.ArcClass = declare(_.painter.Charts.sharp.Arc, {
                ctx: this.ctx,
                showStroke: this.options.segmentShowStroke,
                strokeWidth: this.options.segmentStrokeWidth,
                strokeColor: this.options.segmentStrokeColor,
                x: x,
                y: y,
                innerRadius: this.options.animateScale ? 0 : this.options.innerRadius,
                emphasisRadius: this.options.animateScale ? 0 : this.options.emphasisRadius,
                //oRadius: (this.options.outerRadius - this.options.innerRadius),
                iRadius: this.options.innerRadius,
                eRadius: this.options.emphasisRadius,
                startAngle: Math.PI * 1.5
            });

            this.segments = [];
            this.buildSegment(options.data);

        },
        buildSegment: function(data) {
            this.calculateTotalAndMax(data);
            _.each(data, function(index, elem) {
                this.addSegment(index, elem, data.length);
            }, this);
        },
        update: function(data) {
            this.calculateTotalAndMax(data);
            var leng = _.util.arr.max([data.length, this.segments.length]);
            _.each(this.segments, function(index, segment) {
                segment.value = data && data[index] && data[index].value || 0,
                    segment.restore(['fillColor', 'oRadius']);
                segment.outerRadius = this.options.outerRadius;
                segment.innerRadius = this.options.innerRadius;
                segment.emphasisRadius = this.options.emphasisRadius;
                segment.save();
            }, this);
            for (var index = this.segments.length; index < data.length; index++) {
                this.addSegment(index, data[index], leng);
            }
        },
        addSegment: function(index, elem, leng) {
            var h = (360 * index / leng + 350) % 360,
                s = [70, 85, 60, 35, 40, 35, 100, 95, 30, 35, 10, 65],
                l = [60, 60, 60, 50, 50, 50, 40, 40, 35, 60, 70, 60],
                e = [70, 70, 70, 60, 60, 60, 50, 50, 50, 70, 75, 70],
                i = Math.floor((h + 15) / 30),
                angle = this.calculateCircumference(elem.value),
                radius = this.calculateRadius(elem.value),
                fillColor, emphasisFill;

            if (elem.itemStyle && elem.itemStyle.normal && elem.itemStyle.normal.color) {
                fillColor = elem.itemStyle.normal.color;
            } else {
                switch (this.options.fillColor) {
                    case 'object':
                        fillColor = this.options.fillColor[index];
                        break;
                    case 'string':
                        fillColor = this.options.fillColor;
                        break;
                    default:
                        fillColor = 'hsl(' + h + ', ' + s[i % 12] + '%, ' + l[i % 12] + '%)';
                }
            }

            if (elem.itemStyle && elem.itemStyle.emphasis && elem.itemStyle.emphasis.color) {
                emphasisFill = elem.itemStyle.emphasis.color;
            } else {
                switch (this.options.emphasisFill) {
                    case 'object':
                        emphasisFill = this.options.emphasisFill[index];
                        break;
                    case 'string':
                        emphasisFill = this.options.emphasisFill;
                        break;
                    default:
                        emphasisFill = 'hsl(' + h + ', ' + s[i % 12] + '%, ' + e[i % 12] + '%)';
                }
            }

            var segment = new this.ArcClass({
                value: elem.value,
                label: elem.name,
                fillColor: fillColor,
                emphasisFill: emphasisFill,
                circumference: this.options.animateRotate ? 0 : angle,
                outerRadius: this.options.animateScale ? 0 : radius,
                oRadius: radius
            });
            this.segments.push(segment);
            segment.save();
        },
        calculateTotalAndMax: function(data) {
            var values = [];
            if (this.options.type === 'area') {
                _.each(data, function(index, segment) {
                    values.push(Math.sqrt(segment.value));
                }, this);
            } else {
                _.each(data, function(index, segment) {
                    values.push(parseFloat(segment.value));
                }, this);
            }
            this.length = data.length;
            this.total = _.util.arr.sum(values);
            this.max = _.util.arr.max(values);
        },
        calculateCircumference: function(value) {
            if (this.total > 0) {
                switch (this.options.type) {
                    case 'area':
                        return (Math.PI * 2) * (Math.sqrt(value) / this.total);
                    case 'radius':
                        return (Math.PI * 2) * (1 / this.length);
                    case 'angle':
                    case 'pie':
                        return (Math.PI * 2) * (value / this.total);
                }
            } else {
                return 0;
            }
        },
        calculateRadius: function(value) {
            if (this.total > 0) {
                switch (this.options.type) {
                    case 'area':
                        return (this.options.outerRadius - this.options.innerRadius) * (Math.sqrt(value) / this.max) + this.options.innerRadius;
                    case 'radius':
                    case 'angle':
                        return (this.options.outerRadius - this.options.innerRadius) * (value / this.max) + this.options.innerRadius;
                    case 'pie':
                        return this.options.outerRadius;
                }
            } else {
                return 0;
            }
        },
        removeSegment: function(index) {
            index = parseInt(index) || 0;
            this.segments.splice(index, 1);
        },
        getSegmentsAtEvent: function(e) {
            var segmentsArray = [];
            var location = events.getRelativePosition(e);
            _.each(this.segments, function(index, segment) {
                if (segment.inRange(location.x, location.y))
                    segmentsArray.push(segment);
                segment.restore(['fillColor', 'oRadius']);
            }, this);
            return segmentsArray;
        },
        draw: function(easeDecimal) {
            var animDecimal = (easeDecimal) ? easeDecimal : 1;
            _.each(this.segments, function(index, segment) {
                segment.transition({
                    circumference: this.calculateCircumference(segment.value),
                    outerRadius: this.calculateRadius(segment.value),
                    innerRadius: segment.iRadius
                }, animDecimal);
                segment.endAngle = segment.startAngle + segment.circumference;
                if (index < this.segments.length - 1) {
                    this.segments[index + 1].startAngle = segment.endAngle;
                }
                segment.draw();
            }, this);

        }
    });
    _.painter.Charts.prototype.pie = function() {
        var chart,
            chartName,
            id = 0;
        _.each(this.series.pie, function(i, options) {
            //options.index = id++;
            chartName = this.getChartName(options.name);
            if (this.historyCharts[chartName] && this.historyCharts[chartName].type == 'pie') {
                chart = this.historyCharts[chartName];
                chart.update(options.data, options.index);
            } else {
                chart = new _.painter.Charts.type.Pie(options, this, options.zIndex);
                chart.type = 'pie';
                this.historyCharts[chartName] = chart;
                events.bindHover(this, function(evt) {
                    var activeSegments = [];
                    _.loop(this.activedCharts, function(i, chart) {
                        activeSegments = chart.getSegmentsAtEvent(evt);
                        if (activeSegments.length) {
                            _.loop.out();
                        }
                    });
                    _.each(activeSegments, function(index, activeSegment) {
                        activeSegment.fillColor = activeSegment.emphasisFill;
                        activeSegment.oRadius = activeSegment.eRadius;
                    });
                    if (this.options.tooltip.show) {
                        this.showTooltip(activeSegments);
                    }
                    if (activeSegments.length > 0) {
                        this.actived = 1;
                        _.dom.setStyle(this.Element, 'cursor', 'pointer');
                    } else {
                        this.actived = 0;
                        _.dom.setStyle(this.Element, 'cursor', 'default');
                    }
                });
            }
            this.activedCharts.push(chart);
        }, this);
    }
});