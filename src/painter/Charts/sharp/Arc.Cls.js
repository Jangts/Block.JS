/*!
 * Block.JS Framework Source Code
 * A Web Front-end Development Javascript Framework
 * Mainly For DOM Operation, Data Exchange, Graphic Effects (Image, Canvas, SVG And Ect.), Front-end UI, And Some Basic Calculations.
 * Stripped from Tangram New Idea (TNI)
 *
 * extend_static_methods painter/Charts/util
 * http://www.yangram.net/blockjs/
 *
 * Written and Designed By Ivan Yeung
 *
 * Date: 2015-09-04
 */
;
block([
    '$_/painter/Charts/util/helpers.xtd',
    '$_/painter/Charts/Component/Component.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var helpers = _.painter.Charts.util.helpers;
    declare('painter.Charts.sharp.Arc', _.painter.Charts.Component, {
        inRange: function(chartX, chartY) {
            var pointRelativePosition = helpers.getAngleFromPoint(this, {
                x: chartX,
                y: chartY
            });

            // Normalize all angles to 0 - 2*PI (0 - 360°)
            var pointRelativeAngle = pointRelativePosition.angle % (Math.PI * 2),
                startAngle = (Math.PI * 2 + this.startAngle) % (Math.PI * 2),
                endAngle = (Math.PI * 2 + this.endAngle) % (Math.PI * 2) || 360;

            // Calculate wether the pointRelativeAngle is between the start and the end angle
            var betweenAngles = (endAngle < startAngle) ? pointRelativeAngle <= endAngle || pointRelativeAngle >= startAngle : pointRelativeAngle >= startAngle && pointRelativeAngle <= endAngle;

            //Check if within the range of the open/close angle
            var withinRadius = (pointRelativePosition.distance >= this.innerRadius && pointRelativePosition.distance <= this.outerRadius);

            return (betweenAngles && withinRadius);
            //Ensure within the outside of the arc centre, but inside arc outer
        },
        tooltipPosition: function() {
            var centreAngle = this.startAngle + ((this.endAngle - this.startAngle) / 2),
                rangeFromCentre = (this.outerRadius - this.innerRadius) / 2 + this.innerRadius;
            return {
                x: this.x + (Math.cos(centreAngle) * rangeFromCentre),
                y: this.y + (Math.sin(centreAngle) * rangeFromCentre)
            };
        },
        draw: function(animationPercent) {
            var easingDecimal = animationPercent || 1;

            var ctx = this.ctx;

            ctx.beginPath();

            ctx.arc(this.x, this.y, this.outerRadius < 0 ? 0 : this.outerRadius, this.startAngle, this.endAngle);

            ctx.arc(this.x, this.y, this.innerRadius < 0 ? 0 : this.innerRadius, this.endAngle, this.startAngle, true);

            ctx.closePath();
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;

            ctx.fillStyle = this.fillColor;

            ctx.fill();
            ctx.lineJoin = 'bevel';

            if (this.showStroke) {
                ctx.stroke();
            }
        }
    })
});