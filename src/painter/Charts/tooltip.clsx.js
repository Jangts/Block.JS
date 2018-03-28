/*!
 * tangram.js framework source code
 *
 * class painter/Charts/typeExtend
 *
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/util/bool.xtd',
    '$_/util/obj.xtd',
    '$_/painter/Charts/Charts.cls',
    '$_/painter/Charts/util/helpers.xtd',
    '$_/painter/Charts/Component/Tooltip.cls',
    '$_/painter/Charts/Component/MultiTooltip.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var helpers = _.painter.Charts.util.helpers;

    _.extend(_.painter.Charts.util.defaults, {
        tooltip: {
            show: true,
            type: 'item',
            zIndex: 0,
            triggerOn: ["mousemove", "touchstart", "touchmove"],
            triggerOff: ["mouseout"],
            onTrigger: null,

            backgroundColor: 'rgba(0,0,0,0.8)',
            borderColor: '#333',
            borderWidth: 0,
            padding: 5,
            formatter: '<%if (label){%><%=label%> : <%}%><%= value %>',
            axisFormatter: '<%= itemLabel %> : <%= value %>',
            caretSize: 8,
            cornerRadius: 6,
            xOffset: 10,
            textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: '\'Microsoft YaHei\', \'Hiragino Sans\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
                fontSize: 14,
            },
            titleFormatter: '<%= titleLabel%>',
            titleStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'blod',
                fontFamily: '\'Microsoft YaHei\', \'Hiragino Sans\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
                fontSize: 14,
            },
            strictHover: false,
            legendBackgroundColor: '#fff'
        }
    });

    _.painter.Charts.prototype.showTooltip = function(segments, forceRedraw, showMulti) {
        if (_.painter.Charts.Component.Tooltip) {
            if (typeof this.activeElements === 'undefined') {
                this.activeElements = [];
            }

            var isChanged = (function(Elements) {
                var changed = false;

                if (Elements.length !== this.activeElements.length) {
                    changed = true;
                    return changed;
                }

                _.each(Elements, function(index, element) {
                    if (element !== this.activeElements[index]) {
                        changed = true;
                    }
                }, this);
                return changed;
            }).call(this, segments);

            if (!isChanged && !forceRedraw) {
                return;
            } else {
                this.activeElements = segments;
            }

            var tooltip = this.options.tooltip;

            var options = {
                showTooltips: (tooltip.show == true),
                zIndex: tooltip.zIndex,
                customTooltips: tooltip.onTrigger,

                tooltipFillColor: tooltip.backgroundColor,

                tooltipFontFamily: tooltip.textStyle.fontFamily,
                tooltipFontSize: tooltip.textStyle.fontSize,
                tooltipFontStyle: tooltip.textStyle.fontStyle,
                tooltipFontWeight: tooltip.textStyle.fontWeight,
                tooltipFontColor: tooltip.textStyle.color,

                tooltipTitleFontFamily: tooltip.titleStyle.fontFamily,
                tooltipTitleFontSize: tooltip.titleStyle.fontSize,
                tooltipTitleFontStyle: tooltip.titleStyle.fontStyle,
                tooltipTitleFontWeight: tooltip.titleStyle.fontWeight,
                tooltipTitleFontColor: tooltip.titleStyle.color,

                tooltipTemplate: tooltip.formatter,
                multiTooltipTemplate: tooltip.axisFormatter,
                tooltipTitleTemplate: tooltip.titleFormatter,

                tooltipXPadding: _.util.bool.isArr(tooltip.padding) ? tooltip.padding[0] : (_.util.bool.isNumeric(tooltip.padding) ? parseFloat(tooltip.padding) : 5),
                tooltipYPadding: _.util.bool.isArr(tooltip.padding) ? tooltip.padding[1] : (_.util.bool.isNumeric(tooltip.padding) ? parseFloat(tooltip.padding) : 5),

                tooltipCaretSize: tooltip.caretSize,
                tooltipCornerRadius: tooltip.cornerRadius,
                tooltipXOffset: tooltip.xOffset,

                multiTooltipKeyBackground: tooltip.legendBackgroundColor,
            }

            this.draw();
            // If we have multiple datasets, show a MultiTooltip for all of the data points at that index
            if (segments.length > 0) {
                if (showMulti) {
                    var tooltipLabels = [],
                        tooltipColors = [],
                        medianPosition = (function() {

                            var Elements = [],
                                dataCollection,
                                xPositions = [],
                                yPositions = [],
                                xMax,
                                yMax,
                                xMin,
                                yMin;

                            _.each(segments, function(index, element) {
                                xPositions.push(element.x);
                                yPositions.push(element.y);

                                //Include any colour information about the element
                                tooltipLabels.push(helpers.template(options.multiTooltipTemplate, element));
                                tooltipColors.push({
                                    fill: element._saved.fillColor || element.fillColor,
                                    stroke: element._saved.strokeColor || element.strokeColor
                                });

                            });

                            yMin = _.math.minOfArr(yPositions);
                            yMax = _.math.maxOfArr(yPositions);

                            xMin = _.math.minOfArr(xPositions);
                            xMax = _.math.maxOfArr(xPositions);

                            return {
                                x: (xMin + xMax) / 2, //(xMin > this.width / 2) ? xMin : xMax,
                                y: (yMin + yMax) / 2
                            };

                        }).call(this);
                    new _.painter.Charts.Component.MultiTooltip({
                        x: medianPosition.x,
                        y: medianPosition.y,
                        xPadding: options.tooltipXPadding,
                        yPadding: options.tooltipYPadding,
                        xOffset: options.tooltipXOffset,
                        fillColor: options.tooltipFillColor,
                        textColor: options.tooltipFontColor,
                        fontFamily: options.tooltipFontFamily,
                        fontStyle: options.tooltipFontStyle,
                        fontSize: options.tooltipFontSize,
                        titleTextColor: options.tooltipTitleFontColor,
                        titleFontFamily: options.tooltipTitleFontFamily,
                        titleFontStyle: options.tooltipTitleFontStyle,
                        titleFontSize: options.tooltipTitleFontSize,
                        cornerRadius: options.tooltipCornerRadius,
                        labels: tooltipLabels,
                        legendColors: tooltipColors,
                        legendColorBackground: options.multiTooltipKeyBackground,
                        title: helpers.template(options.tooltipTitleTemplate, segments[0]),
                        chart: this,
                        ctx: this.getLayer(options.zIndex).getContext("2d"),
                        custom: options.customTooltips
                    }).draw();
                } else {
                    var Element = segments[0],
                        tooltipPosition = Element.tooltipPosition();

                    new _.painter.Charts.Component.Tooltip({
                        x: Math.round(tooltipPosition.x),
                        y: Math.round(tooltipPosition.y),
                        xPadding: options.tooltipXPadding,
                        yPadding: options.tooltipYPadding,
                        fillColor: options.tooltipFillColor,
                        textColor: options.tooltipFontColor,
                        fontFamily: options.tooltipFontFamily,
                        fontStyle: options.tooltipFontStyle,
                        fontSize: options.tooltipFontSize,
                        caretHeight: options.tooltipCaretSize,
                        cornerRadius: options.tooltipCornerRadius,
                        text: helpers.template(options.tooltipTemplate, Element),
                        chart: this,
                        ctx: this.getLayer(options.zIndex).getContext("2d"),
                        custom: options.customTooltips
                    }).draw();
                }
            }
        }
        return this;
    }
});