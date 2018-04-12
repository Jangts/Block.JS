/*!
 * tangram.js framework source code
 *
 * extend_static_methods painter/Charts/util
 *
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/arr/',
    '$_/util/bool',
    '$_/dom/',
    '$_/math/math',
    '$_/math/easing',
    '$_/painter/canvas',
    '$_/painter/Charts/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console;

    var aliasPixel = function(pixelWidth) {
            return (pixelWidth % 2 === 0) ? 0 : 0.5;
        },

        animationLoop = function(callback, totalSteps, easingString, onProgress, onComplete, chartInstance) {
            var currentStep = 0,
                easingFunction = easingEffects[easingString] || easingEffects.linear;

            var animationFrame = function() {
                currentStep++;
                var stepDecimal = currentStep / totalSteps;
                var easeDecimal = easingFunction(stepDecimal, 0, 1, 1);

                callback.call(chartInstance, easeDecimal, stepDecimal, currentStep);
                onProgress.call(chartInstance, easeDecimal, stepDecimal);
                if (currentStep < totalSteps) {
                    chartInstance.animationFrame = requestAnimFrame(animationFrame);
                } else {
                    onComplete.apply(chartInstance);
                }
            };
            requestAnimFrame(animationFrame);
        },

        calculateCircleStyle = function(options, width, height) {
            var maxRadius = _.arr.min([width, height]) / 2;
            radius = maxRadius * 0.75,
                x = width / 2,
                y = height / 2;

            if (options.radius) {
                if (_.util.bool.isPercent(options.radius)) {
                    radius = maxRadius * parseInt(options.radius) / 100
                } else if (_.util.bool.isNumeric(options.radius)) {
                    radius = parseFloat(options.radius);
                }
            }

            if (_.util.bool.isArr(options.center) && options.center.length === 2) {
                if (_.util.bool.isPercent(options.center[0])) {
                    x = width * parseInt(options.center[0]) / 100
                } else if (_.util.bool.isNumeric(options.center[0])) {
                    x = parseFloat(options.center[0]);
                }
                if (_.util.bool.isPercent(options.center[1])) {
                    y = height * parseInt(options.center[1]) / 100
                } else if (_.util.bool.isNumeric(options.center[1])) {
                    y = parseFloat(options.center[1]);
                }
            }
            return {
                maxRadius: maxRadius,
                radius: radius,
                x: x,
                y: y
            }
        },

        calculateDoughnutStyle = function(options, width, height) {
            var maxRadius = _.arr.min([width, height]) / 2;
            innerRadius = 0,
                outerRadius = maxRadius * 0.75,
                x = width / 2,
                y = height / 2;
            if (_.util.bool.isArr(options.radius)) {
                if (options.radius[0]) {
                    if (_.util.bool.isPercent(options.radius[0])) {
                        innerRadius = maxRadius * parseInt(options.radius[0]) / 100
                    } else if (_.util.bool.isNumeric(options.radius[0])) {
                        innerRadius = parseFloat(options.radius[0]);
                    }
                }
                if (options.radius[1]) {
                    if (_.util.bool.isPercent(options.radius[1])) {
                        outerRadius = maxRadius * parseInt(options.radius[1]) / 100
                    } else if (_.util.bool.isNumeric(options.radius[1])) {
                        outerRadius = parseFloat(options.radius[1]);
                    }
                }

            }

            if (_.util.bool.isArr(options.center) && options.center.length === 2) {
                if (_.util.bool.isPercent(options.center[0])) {
                    x = width * parseInt(options.center[0]) / 100
                } else if (_.util.bool.isNumeric(options.center[0])) {
                    x = parseFloat(options.center[0]);
                }
                if (_.util.bool.isPercent(options.center[1])) {
                    y = height * parseInt(options.center[1]) / 100
                } else if (_.util.bool.isNumeric(options.center[1])) {
                    y = parseFloat(options.center[1]);
                }
            }
            return {
                maxRadius: maxRadius,
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                x: x,
                y: y
            }
        },

        calculateOrderOfMagnitude = function(val) {
            return Math.floor(Math.log(val) / Math.LN10);
        },

        calculateRectangleStyle = function(options, width, height) {
            var width,
                height,
                top,
                right,
                bottom,
                left;
            if (_.util.bool.isNumeric(options.top)) {
                top = parseFloat(options.top);
            } else if (_.util.bool.isPercent(options.top)) {
                top = height * parseFloat(options.top) / 100;
            } else {
                top = 0;
            }

            if (_.util.bool.isNumeric(options.right)) {
                right = parseFloat(options.right);
            } else if (_.util.bool.isPercent(options.right)) {
                right = width * parseFloat(options.right) / 100;
            } else {
                right = 0;
            }

            if (_.util.bool.isNumeric(options.width)) {
                width = parseFloat(options.width);
                left = width - right - width;
            } else if (_.util.bool.isPercent(options.width)) {
                width = width * parseFloat(options.width) / 100;
                left = width - right - width;
            } else {
                if (_.util.bool.isNumeric(options.left)) {
                    left = parseFloat(options.left);
                } else if (_.util.bool.isPercent(options.left)) {
                    left = width * parseFloat(options.left) / 100;
                } else {
                    left = 100;
                }
                width = width - right - left;
            }
            if (_.util.bool.isNumeric(options.height)) {
                height = parseFloat(options.height);
            } else if (_.util.bool.isPercent(options.height)) {
                height = height * parseFloat(options.height) / 100;
            } else {
                if (_.util.bool.isNumeric(options.bottom)) {
                    bottom = parseFloat(options.bottom);
                } else if (_.util.bool.isPercent(options.bottom)) {
                    bottom = height * parseFloat(options.bottom) / 100;
                } else {
                    bottom = 0;
                }
                height = height - top - bottom;
            }
            return {
                width: width,
                height: height,
                top: top,
                left: left
            }
        },

        calculateScaleRange = function(valuesArray, drawingSize, textSize, startFromZero, integersOnly, isXoA, isPolar) {
            if (isPolar && isXoA) {
                var minSteps = 4,
                    maxSteps = Math.floor((Math.PI * drawingSize * 2) / (textSize * 1.5)),
                    skipFitting = (minSteps >= maxSteps);
            } else {
                var minSteps = 2,
                    maxSteps = Math.floor(drawingSize / (textSize * 1.5)),
                    skipFitting = (minSteps >= maxSteps);
            }

            var minValue = _.arr.min(valuesArray),
                maxValue = _.arr.max(valuesArray);

            if (maxValue === minValue) {
                maxValue += 0.5;
                if (minValue >= 0.5 && !startFromZero) {
                    minValue -= 0.5;
                } else {
                    maxValue += 0.5;
                }
            }

            var valueRange = Math.abs(maxValue - minValue),
                rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange),
                graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
                graphMin = (startFromZero) ? 0 : Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
                graphRange = graphMax - graphMin,
                stepValue = Math.pow(10, rangeOrderOfMagnitude),
                numberOfSteps = Math.round(graphRange / stepValue);

            while ((numberOfSteps > maxSteps || (numberOfSteps * 2) < maxSteps) && !skipFitting) {
                if (numberOfSteps > maxSteps) {
                    stepValue *= 2;
                    numberOfSteps = Math.round(graphRange / stepValue);
                    // Don't ever deal with a decimal number of steps - cancel fitting and just use the minimum number of steps.
                    if (numberOfSteps % 1 !== 0) {
                        skipFitting = true;
                    }
                } else {
                    //If user has declared ints only, and the step value isn't a decimal
                    if (integersOnly && rangeOrderOfMagnitude >= 0) {
                        //If the user has said integers only, we need to check that making the scale more granular wouldn't make it a float
                        if (stepValue / 2 % 1 === 0) {
                            stepValue /= 2;
                            numberOfSteps = Math.round(graphRange / stepValue);
                        } else {
                            break;
                        }
                    } else {
                        stepValue /= 2;
                        numberOfSteps = Math.round(graphRange / stepValue);
                    }
                }
            }

            if (skipFitting) {
                numberOfSteps = minSteps;
                stepValue = graphRange / numberOfSteps;
            }

            if (isPolar) {
                return [numberOfSteps, stepValue];
            }

            if (isXoA) {
                return {
                    xSteps: numberOfSteps,
                    xStepValue: stepValue,
                    minX: graphMin,
                    maxX: graphMin + (numberOfSteps * stepValue)
                };
            }

            return {
                ySteps: numberOfSteps,
                yStepValue: stepValue,
                minY: graphMin,
                maxY: graphMin + (numberOfSteps * stepValue)
            };

        },

        cancelAnimFrame = (function() {
            return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame ||
                function(callback) {
                    return window.clearTimeout(callback, 1000 / 60);
                };
        })(),

        generateLabels = function(templateString, numberOfSteps, graphMin, stepValue) {
            var labelsArray = new Array(numberOfSteps);
            if (templateString) {
                _.each(labelsArray, function(index, val) {
                    labelsArray[index] = template(templateString, {
                        value: (graphMin + (stepValue * (index + 1)))
                    });
                });
            }
            return labelsArray;
        },

        // Gets the angle from vertical upright to the point about a centre.
        getAngleFromPoint = function(centrePoint, anglePoint) {
            var distanceFromXCenter = anglePoint.x - centrePoint.x,
                distanceFromYCenter = anglePoint.y - centrePoint.y,
                radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);

            var angle = Math.PI * 2 + Math.atan2(distanceFromYCenter, distanceFromXCenter);

            //If the segment is in the top left quadrant, we need to add another rotation to the angle
            if (distanceFromXCenter < 0 && distanceFromYCenter < 0) {
                angle += Math.PI * 2;
            }

            return {
                angle: angle,
                distance: radialDistanceFromCenter
            };
        },

        noop = function() {},

        splineCurve = function(FirstPoint, MiddlePoint, AfterPoint, t) {
            var d01 = Math.sqrt(Math.pow(MiddlePoint.x - FirstPoint.x, 2) + Math.pow(MiddlePoint.y - FirstPoint.y, 2)),
                d12 = Math.sqrt(Math.pow(AfterPoint.x - MiddlePoint.x, 2) + Math.pow(AfterPoint.y - MiddlePoint.y, 2)),
                fa = t * d01 / (d01 + d12),
                // scaling factor for triangle Ta
                fb = t * d12 / (d01 + d12);
            return {
                inner: {
                    x: MiddlePoint.x - fa * (AfterPoint.x - FirstPoint.x),
                    y: MiddlePoint.y - fa * (AfterPoint.y - FirstPoint.y)
                },
                outer: {
                    x: MiddlePoint.x + fb * (AfterPoint.x - FirstPoint.x),
                    y: MiddlePoint.y + fb * (AfterPoint.y - FirstPoint.y)
                }
            };
        },

        template = function(templateString, valuesObject) {
            if (templateString instanceof Function) {
                return templateString(valuesObject);
            }

            var cache = {};

            function trim(str) {
                return str.replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t")
                    .join("');")
                    .split("%>")
                    .join("p.push('")
                    .split("\r")
                    .join("\\'");
            }

            function tmpl(str, data) {
                var fn = !/\W/.test(str) ? cache[str] : function(obj) {
                    var p = [],
                        print = function() {
                            p.push.apply(p, arguments);
                        };
                    with(obj) {
                        eval("p.push('" + trim(str) + "');");
                    }
                    return p.join('');
                };

                return data ? fn(data) : fn;
            }
            return tmpl(templateString, valuesObject);
        };

    _.extend(_.painter.Charts.util.helpers, {
        aliasPixel,
        animationLoop,
        calculateCircleStyle,
        calculateDoughnutStyle,
        calculateOrderOfMagnitude,
        calculateRectangleStyle,
        calculateScaleRange,
        cancelAnimFrame,
        generateLabels,
        getAngleFromPoint,
        noop,
        splineCurve,
        template
    });
});