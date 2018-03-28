/*!
 * tangram.js framework source code
 *
 * extend_static_methods painter/Charts/util
 *
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/math/math.xtd',
    '$_/painter/Charts/util/helpers.xtd',
    '$_/painter/Charts/Component/Component.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var helpers = _.painter.Charts.util.helpers;
    declare('painter.Charts.scale.Grid', _.painter.Charts.Component, {
        _init: function(configuration) {
            _.extend(this, true, configuration);
            switch (this.status) {
                case 0:
                    //横轴为项，纵轴为值
                    this.xOffsetSplitLines = this.hasBar;
                    this.yOffsetSplitLines = false;
                    break;
                case 1:
                    //横轴为值，纵轴为项
                    this.xOffsetSplitLines = false;
                    this.yOffsetSplitLines = this.hasBar || this.hasScatter;
                    break;
                case 5:
                    // 横纵皆为项
                    this.xOffsetSplitLines = false;
                    this.yOffsetSplitLines = true;
                    break;
                default:
                    //横纵皆为值
                    this.xOffsetSplitLines = false;
                    this.yOffsetSplitLines = false;
            }
            this.font = _.painter.canvas.fontString(this.xLabelFontSize, this.xLabelFontStyle, this.xLabelFontFamily);
            //this.save();
            this.fit();
        },
        update: function(newProps) {
            _.extend(this, true, newProps);
            //this.save();
            return this.fit();
        },
        fit: function() {
            this.charts = {};
            this.getValues();

            this.yScalePaddingTop = this.padding + 3;

            if (this.display && this.xLabelsShow) {
                this.yScalePaddingBottom = this.xLabelFontSize * 1.5 + 5 + this.padding;
            } else {
                this.yScalePaddingBottom = this.padding;
            }

            this.topPoint = this.top + this.yScalePaddingTop;
            this.bottomPoint = (this.display) ? this.height - this.yScalePaddingBottom + this.top : this.height + this.top;

            var currentHeight = this.drawingAreaY;
            this.calculateYRange(currentHeight);
            this.buildYLabels();

            this.xScalePaddingRight = this.padding;

            if (this.display && this.yLabelsShow) {
                this.xScalePaddingLeft = this.yLabelWidth + this.padding;
            } else {
                this.xScalePaddingLeft = this.padding;
            }

            this.drawingAreaX = this.width - (this.xScalePaddingLeft + this.xScalePaddingRight);
            this.drawingAreaY = this.height - (this.yScalePaddingBottom + this.yScalePaddingTop);

            this.leftPoint = Math.round(this.xScalePaddingLeft) + this.left;
            this.rightPoint = this.width + this.left;

            var currentWidth = this.drawingAreaX;
            this.calculateXRange(currentWidth);
            this.buildXLabels();

            if (this.status === 1) {
                this.fit1();
            } else if (this.status !== 5) {
                this.fit0();
            }
            return this;
        },
        getValues: function() {
            this.xValues = [];
            this.yValues = [];
            _.each(this.instance.series.line, function(i, chart) {
                var data = [];
                _.each(chart.data, function(j, v) {
                    (typeof v === 'number') && data.push(v);
                });
                switch (this.status) {
                    case 0:
                        this.yValues = _.util.arr.merge(this.yValues, data);
                        break;
                    case 1:
                        this.xValues = _.util.arr.merge(this.xValues, data)
                        break;
                }
            }, this);
            _.each(this.instance.series.bar, function(i, chart) {
                var data = [];
                _.each(chart.data, function(j, v) {
                    if (typeof v === 'number') {
                        data.push(v);
                    } else if (typeof v === 'object' && v instanceof Array) {
                        (typeof v[0] === 'number') && data.push(v[0]);
                        (typeof v[1] === 'number') && data.push(v[1]);
                    }
                });
                switch (this.status) {
                    case 0:
                        this.yValues = _.util.arr.merge(this.yValues, data);
                        break;
                    case 1:
                        this.xValues = _.util.arr.merge(this.xValues, data)
                        break;
                }
            }, this);
            _.each(this.instance.series.scatter, function(i, chart) {
                var xData = [],
                    yData = [];;
                _.each(chart.data, function(j, v) {
                    if (typeof v === 'object' && v instanceof Array) {
                        (typeof v[0] === 'number') && xData.push(v[0]);
                        (typeof v[1] === 'number') && yData.push(v[1]);
                    }
                });
                switch (this.status) {
                    case 0:
                        this.yValues = _.util.arr.merge(this.yValues, yData);
                        break;
                    case 1:
                        this.xValues = _.util.arr.merge(this.xValues, xData);
                        break;
                    case 4:
                        this.xValues = _.util.arr.merge(this.xValues, xData);
                        this.yValues = _.util.arr.merge(this.yValues, yData);
                        break;
                }
            }, this);

            if (this.xValues.length < 1) {
                this.xValues = [1];
            }
            if (this.yValues.length < 1) {
                this.yValues = [1];
            }
        },
        calculateYRange: function(currentHeight) {
            if (this.status === 1 || this.status === 5) {
                this.ySteps = this.yLabels.length;
                this.yStepValue = 1;
            } else {
                if ((typeof(this.yAxisMax) === 'number') && (typeof(this.yAxisMin) === 'number')) {
                    var valuesArray = [this.yAxisMax, this.yAxisMin];
                } else if (typeof(this.yAxisMax) === 'number') {
                    var min = _.util.arr.min(this.yValues),
                        valuesArray = [this.yAxisMax, min < this.yAxisMax ? min : this.yAxisMax - 1];
                } else if (typeof(this.yAxisMin) === 'number') {
                    var max = _.util.arr.max(this.yValues),
                        valuesArray = [this.yAxisMin, max > this.yAxisMin ? max : this.yAxisMin + 1];
                } else {
                    var valuesArray = this.yValues;
                }
                var updatedRanges = helpers.calculateScaleRange(
                    valuesArray,
                    currentHeight,
                    this.xLabelFontSize,
                    this.yBeginAtZero,
                    this.yIntegersOnly);
                _.extend(this, true, updatedRanges);
            }
        },
        buildYLabels: function() {
            if (this.status === 0 || this.status === 4) {
                // 纵轴为值
                this.yLabels = [];
                var stepDecimalPlaces = _.math.getDecimalPlaces(this.yStepValue);
                for (var i = 0; i <= this.ySteps; i++) {
                    this.yLabels.push(helpers.template(this.yTemplateString, {
                        value: (this.minY + (i * this.yStepValue)).toFixed(stepDecimalPlaces)
                    }));
                }
            }
            this.yLabelWidth = (this.display && this.yLabelsShow) ? _.painter.canvas.longestText(this.ctx, this.font, this.yLabels) + 10 : 0;

            var yLabelHeight = (this.display && this.yLabelsShow) ? this.yLabelFontSize * 1.5 : 0,
                yLabelSteps = this.ySteps,
                drawingAreaY = this.drawingAreaY;
            while (yLabelSteps * yLabelHeight > drawingAreaY) {
                yLabelSteps = Math.ceil(yLabelSteps / 2);
            }
            this.yLabelStep = Math.ceil(this.ySteps / yLabelSteps);
            return this;
        },
        calculateXRange: function(currentWidth) {
            if (this.status === 0 || this.status === 5) {
                // 横轴为项，或横纵皆为项
                this.xSteps = this.xLabels.length;
                this.xStepValue = 1;
            } else {
                if ((typeof(this.xAxisMax) === 'number') && (typeof(this.xAxisMin) === 'number')) {
                    var valuesArray = [this.xAxisMax, this.xAxisMin];
                } else if (typeof(this.xAxisMax) === 'number') {
                    var valuesArray = [this.xAxisMax, _.util.arr.min(this.xValues)];
                } else if (typeof(this.yAxisMin) === 'number') {
                    var valuesArray = [this.xAxisMin, _.util.arr.max(this.xValues)];
                } else {
                    var valuesArray = this.xValues;
                }
                var updatedRanges = helpers.calculateScaleRange(
                    valuesArray,
                    currentWidth,
                    this.yLabelFontSize,
                    this.xBeginAtZero,
                    this.xIntegersOnly,
                    true);
                _.extend(this, true, updatedRanges);

            }
        },
        buildXLabels: function() {
            if (this.status === 1 || this.status === 4) {
                // 横轴为值
                this.xLabels = [];
                var stepDecimalPlaces = _.math.getDecimalPlaces(this.xStepValue);
                for (var i = 0; i <= this.xSteps; i++) {
                    this.xLabels.push(helpers.template(this.xTemplateString, {
                        value: (this.minX + (i * this.xStepValue)).toFixed(stepDecimalPlaces)
                    }));
                }
            }
            this.xLabelWidth = (this.display && this.xLabelsShow) ? _.painter.canvas.longestText(this.ctx, this.font, this.xLabels) + 4 : 0;

            var xLabelSteps = this.xSteps,
                drawingAreaX = this.drawingAreaX;
            while (xLabelSteps * this.xLabelWidth > drawingAreaX) {
                xLabelSteps = Math.ceil(xLabelSteps / 2);
            }
            this.xLabelStep = Math.ceil(this.xSteps / xLabelSteps);
            return this;
        },
        fit0: function() {
            if (this.maxY * this.minY >= 0) {
                if (this.minY >= 0) {
                    this.baseY = this.bottomPoint;
                } else {
                    this.baseY = this.topPoint;
                }
            } else {
                var height = this.drawingAreaY,
                    difference = this.maxY - this.minY;
                this.baseY = this.calculateY(0);
            }
        },
        fit1: function() {
            if (this.maxX * this.minX >= 0) {
                if (this.minX >= 0) {
                    this.baseX = this.leftPoint;
                } else {
                    this.baseX = this.rightPoint;
                }
            } else {
                var width = this.drawingAreaY,
                    difference = this.maxX - this.minX;

                this.baseX = this.calculateX(0);
            }
        },
        calculateX: function(index) {
            if (this.status === 0 || this.status === 5) {
                var innerWidth = this.width - (this.xScalePaddingLeft + this.xScalePaddingRight),
                    valueWidth = innerWidth / Math.max((this.xSteps - ((this.xOffsetSplitLines) ? 0 : 1)), 1),
                    valueOffset = (valueWidth * index) + this.xScalePaddingLeft;
                if (this.xOffsetSplitLines) {
                    valueOffset += (valueWidth / 2);
                }
                return Math.round(valueOffset + this.left);
            }
            var value = index;
            var scalingFactor = this.drawingAreaX / (this.maxX - this.minX);
            return this.leftPoint + (scalingFactor * (value - this.minX));
        },
        calculateY: function(index) {
            if (this.status === 1 || this.status === 5) {
                var innerHeight = this.height - (this.yScalePaddingTop + this.yScalePaddingBottom),
                    valueHeight = innerHeight / Math.max((this.ySteps - ((this.yOffsetSplitLines) ? 0 : 1)), 1),
                    valueOffset = (valueHeight * index) + this.yScalePaddingBottom;

                if (this.yOffsetSplitLines) {
                    valueOffset += (valueHeight / 2);
                }
                return Math.round(this.height + this.top - valueOffset);
            }
            var value = index;
            var scalingFactor = this.drawingAreaY / (this.maxY - this.minY);
            return this.bottomPoint - (scalingFactor * (value - this.minY));
        },
        draw: function() {
            var xLabelGap = this.drawingAreaX / ((this.xOffsetSplitLines || (this.status !== 0 && this.status !== 5)) ? this.xSteps : this.xSteps - 1),
                yLabelGap = this.drawingAreaY / ((this.yOffsetSplitLines || (this.status !== 1 && this.status !== 5)) ? this.ySteps : this.ySteps - 1);
            if (this.display) {
                this.drawYAxis(yLabelGap);
                this.drawXAxis(xLabelGap);
            }
        },
        drawYAxis: function(yLabelGap) {
            if (this.yAxisShow) {
                var ctx = this.ctx;
                ctx.fillStyle = this.xLabelFontColor;
                ctx.font = this.font;
                ctx.textAlign = "right";
                ctx.textBaseline = "middle";
                _.each(this.yLabels, function(index, labelString) {
                    var yLabelCenter = this.bottomPoint - (yLabelGap * index),
                        yLabelPos = this.yOffsetSplitLines ? yLabelCenter - (yLabelGap * 0.5) : yLabelCenter,
                        linePositionY = Math.round(yLabelCenter);
                    if (((this.yOnZero && labelString == '0') || (!this.yOnZero && index === 0)) && this.yAxisLineShow) {
                        ctx.lineWidth = this.yAxisLineWidth;
                        ctx.strokeStyle = this.yAxisLineColor;
                        linePositionY += helpers.aliasPixel(ctx.lineWidth);
                        ctx.beginPath();
                        ctx.moveTo(this.leftPoint - 5, linePositionY);
                        ctx.lineTo(this.rightPoint, linePositionY);
                        ctx.stroke();
                        ctx.closePath();
                    } else {
                        if (this.ySplitLineShow) {
                            ctx.lineWidth = this.xSplitLineWidth;
                            ctx.strokeStyle = this.xSplitLineColor;
                            linePositionY += helpers.aliasPixel(ctx.lineWidth);
                            ctx.beginPath();
                            ctx.moveTo(this.leftPoint - 5, linePositionY);
                            ctx.lineTo(this.rightPoint, linePositionY);
                            ctx.stroke();
                            ctx.closePath();
                        }
                    }
                    if (this.yLabelsShow && (index % this.yLabelStep == Math.floor(this.yLabelStep / 2))) {
                        ctx.save();
                        ctx.fillText(labelString, this.leftPoint - 10, yLabelPos);
                        ctx.restore();
                    }
                }, this);
            }
        },
        drawXAxis: function(xLabelGap) {
            if (this.xAxisShow) {
                var ctx = this.ctx;
                ctx.fillStyle = this.xLabelFontColor;
                ctx.font = this.font;
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                _.each(this.xLabels, function(index, label) {
                    var xLabelCenter = this.leftPoint + (xLabelGap * index),
                        xLabelPos = this.xOffsetSplitLines ? xLabelCenter + (xLabelGap * 0.5) : xLabelCenter,
                        linePositionX = Math.round(xLabelCenter);

                    if (((this.xOnZero && label == '0') || (!this.xOnZero && index === 0)) && this.xAxisLineShow) {
                        ctx.lineWidth = this.xAxisLineWidth;
                        ctx.strokeStyle = this.xAxisLineColor;
                        ctx.beginPath();
                        ctx.moveTo(linePositionX, this.bottomPoint + 5);
                        ctx.lineTo(linePositionX, this.topPoint - 3);
                        ctx.stroke();
                        ctx.closePath();
                    } else {
                        if (this.xSplitLineShow) {
                            ctx.lineWidth = this.ySplitLineWidth;
                            ctx.strokeStyle = this.ySplitLineColor;
                            ctx.beginPath();
                            ctx.moveTo(linePositionX, this.bottomPoint + 5);
                            ctx.lineTo(linePositionX, this.topPoint - 3);
                            ctx.stroke();
                            ctx.closePath();
                        }
                    }
                    if (this.xLabelsShow && (index % this.xLabelStep == Math.floor(this.xLabelStep / 2))) {
                        ctx.save();
                        ctx.fillText(label, xLabelPos, this.bottomPoint + 8);
                        ctx.restore();
                    }
                }, this);

            }
        }
    });
});