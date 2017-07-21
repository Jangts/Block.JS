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
    '$_/painter/Charts/sharp/Arc.Cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    declare('painter.Charts.type.PolarArea', _.painter.Charts.type.Default, {
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
            this.segments = []
            var options = _.util.obj.deepMerge(this.defaults, options),
                barStrokeWidth = parseInt(options.itemStyle.normal.barBorderWidth);
            this.options = {
                scaleShowLabelBackdrop: true,
                scaleBackdropColor: "rgba(255,255,255,0.75)",
                scaleBeginAtZero: true,
                scaleBackdropPaddingY: 2,
                scaleBackdropPaddingX: 2,
                scaleShowLine: true,
                segmentShowStroke: true,
                segmentStrokeColor: "#fff",
                segmentStrokeWidth: 2,
                animationSteps: 100,
                animationEasing: "easeOutBounce",
                animateRotate: true,
                animateScale: false,
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>",
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

            this.segments = [];
            //Declare segment class as a chart instance specific class, so it can share props for this instance
            this.SegmentArc = _.painter.Charts.sharp.Arc.extend({
                showStroke: this.options.segmentShowStroke,
                strokeWidth: this.options.segmentStrokeWidth,
                strokeColor: this.options.segmentStrokeColor,
                ctx: this.chart.ctx,
                innerRadius: 0,
                x: this.chart.width / 2,
                y: this.chart.height / 2
            });
            this.scale = new _.painter.Charts.scale.RadialScale({
                display: this.options.showScale,
                fontStyle: this.options.scaleFontStyle,
                fontSize: this.options.scaleFontSize,
                fontFamily: this.options.scaleFontFamily,
                fontColor: this.options.scaleFontColor,
                showLabels: this.options.scaleShowLabels,
                lineWidth: (this.options.scaleShowLine) ? this.options.scaleLineWidth : 0,
                lineColor: this.options.scaleLineColor,
                lineArc: true,
                width: this.chart.width,
                height: this.chart.height,
                xCenter: this.chart.width / 2,
                yCenter: this.chart.height / 2,
                ctx: this.chart.ctx,
                templateString: this.options.scaleLabel,
                valuesCount: data.length
            });

            this.updateScaleRange(data);

            this.scale.update();

            _.each(data, function(index, segment) {
                this.addData(segment, index, true);
            }, this);

            //Set up tooltip events on the chart
            if (this.options.showTooltips) {
                helpers.bindEvents(this, this.options.tooltipEvents, function(evt) {
                    var activeSegments = (evt.type !== 'mouseout') ? this.getSegmentsAtEvent(evt) : [];
                    _.each(this.segments, function(index, segment) {
                        segment.restore(["fillColor"]);
                    });
                    _.each(activeSegments, function(index, activeSegment) {
                        activeSegment.fillColor = activeSegment.highlightColor;
                    });
                    this.showTooltip(activeSegments);
                });
            }

            this.render();
        },
    });


    var defaultConfig = {
        //Boolean - Show a backdrop to the scale label
        scaleShowLabelBackdrop: true,

        //String - The colour of the label backdrop
        scaleBackdropColor: "rgba(255,255,255,0.75)",

        // Boolean - Whether the scale should begin at zero
        scaleBeginAtZero: true,

        //Number - The backdrop padding above & below the label in pixels
        scaleBackdropPaddingY: 2,

        //Number - The backdrop padding to the side of the label in pixels
        scaleBackdropPaddingX: 2,

        //Boolean - Show line for each value in the scale
        scaleShowLine: true,

        //Boolean - Stroke a line around each segment in the chart
        segmentShowStroke: true,

        //String - The colour of the stroke on each segment.
        segmentStrokeColor: "#fff",

        //Number - The width of the stroke value in pixels
        segmentStrokeWidth: 2,

        //Number - Amount of animation steps
        animationSteps: 100,

        //String - Animation easing effect.
        animationEasing: "easeOutBounce",

        //Boolean - Whether to animate the rotation of the chart
        animateRotate: true,

        //Boolean - Whether to animate scaling the chart from the centre
        animateScale: false,

        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>"
    };


    _.painter.Charts.typeExtend({
        //Passing in a name registers this chart in the Chart namespace
        name: "PolarArea",
        //Providing a defaults will also register the defaults in the chart namespace
        defaults: defaultConfig,
        //Initialize is fired when the chart is initialized - Data is passed in as a parameter
        //Config is automatically merged by the core of _.painter.Charts.js, and is available at this.options

        getSegmentsAtEvent: function(e) {
            var segmentsArray = [];

            var location = helpers.getRelativePosition(e);

            _.each(this.segments, function(index, segment) {
                if (segment.inRange(location.x, location.y)) segmentsArray.push(segment);
            }, this);
            return segmentsArray;
        },
        addData: function(segment, atIndex, silent) {
            var index = atIndex || this.segments.length;

            this.segments.splice(index, 0, new this.SegmentArc({
                fillColor: segment.color,
                highlightColor: segment.highlight || segment.color,
                label: segment.label,
                value: segment.value,
                outerRadius: (this.options.animateScale) ? 0 : this.scale.calculateCenterOffset(segment.value),
                circumference: (this.options.animateRotate) ? 0 : this.scale.getCircumference(),
                startAngle: Math.PI * 1.5
            }));
            if (!silent) {
                this.reflow();
                this.update();
            }
        },
        removeData: function(atIndex) {
            var indexToDelete = (_.util.bool.isNumber(atIndex)) ? atIndex : this.segments.length - 1;
            this.segments.splice(indexToDelete, 1);
            this.reflow();
            this.update();
        },
        calculateTotal: function(data) {
            this.total = 0;
            _.each(data, function(index, segment) {
                this.total += segment.value;
            }, this);
            this.scale.valuesCount = this.segments.length;
        },
        updateScaleRange: function(datapoints) {
            var valuesArray = [];
            _.each(datapoints, function(index, segment) {
                valuesArray.push(segment.value);
            });

            var scaleSizes = (this.options.scaleOverride) ? {
                    steps: this.options.scaleSteps,
                    stepValue: this.options.scaleStepWidth,
                    min: this.options.scaleStartValue,
                    max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
                } :
                helpers.calculateScaleRange(
                    valuesArray,
                    _.util.arr.min([this.chart.width, this.chart.height]) / 2,
                    this.options.scaleFontSize,
                    this.options.scaleBeginAtZero,
                    this.options.scaleIntegersOnly
                );

            _.extend(
                this.scale,
                scaleSizes, {
                    size: _.util.arr.min([this.chart.width, this.chart.height]),
                    xCenter: this.chart.width / 2,
                    yCenter: this.chart.height / 2
                }
            );

        },
        update: function() {
            this.calculateTotal(this.segments);

            _.each(this.segments, function(index, segment) {
                segment.save();
            });

            this.reflow();
            this.render();
        },
        reflow: function() {
            _.extend(this.SegmentArc.prototype, {
                x: this.chart.width / 2,
                y: this.chart.height / 2
            });
            this.updateScaleRange(this.segments);
            this.scale.update();

            _.extend(this.scale, {
                xCenter: this.chart.width / 2,
                yCenter: this.chart.height / 2
            });

            _.each(this.segments, function(index, segment) {
                segment.update({
                    outerRadius: this.scale.calculateCenterOffset(segment.value)
                });
            }, this);

        },
        draw: function(ease) {
            var easingDecimal = ease || 1;
            //Clear & draw the canvas
            this.clear();
            _.each(this.segments, function(index, segment) {
                segment.transition({
                    circumference: this.scale.getCircumference(),
                    outerRadius: this.scale.calculateCenterOffset(segment.value)
                }, easingDecimal);

                segment.endAngle = segment.startAngle + segment.circumference;

                // If we've removed the first segment we need to set the first one to
                // start at the top.
                if (index === 0) {
                    segment.startAngle = Math.PI * 1.5;
                }

                //Check to see if it's the last segment, if not get the next and update the start angle
                if (index < this.segments.length - 1) {
                    this.segments[index + 1].startAngle = segment.endAngle;
                }
                segment.draw();
            }, this);
            this.scale.draw();
        },



        getCircumference: function() {
            return ((Math.PI * 2) / this.angleSteps);
        },
    });

});