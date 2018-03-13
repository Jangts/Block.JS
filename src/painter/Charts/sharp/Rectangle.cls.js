/*!
 * tangram.js framework source code
 * A Web Front-end Development Javascript framework
 * Mainly For DOM Operation, Data Exchange, Graphic Effects (Image, Canvas, SVG And Ect.), Front-end UI, And Some Basic Calculations.
 * Stripped from Tangram New Idea (TNI)
 *
 * extend_static_methods painter/Charts/sharps/Rectangle
 * http://www.yangram.net/tangram.js/
 *
 * Written and Designed By Ivan Yeung
 *
 * Date: 2015-09-04
 */
;
tangram.block(['$_/painter/Charts/Component/Component.cls'], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    declare('painter.Charts.sharp.Rectangle', _.painter.Charts.Component, {
        type: 0,
        ctx: undefined,
        radius: 0,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        draw: function() {
            switch (this.type) {
                case 0:
                case 2:
                    this.drawVertical();
                    break;
                case 1:
                case 3:
                    this.drawHorizontal();
                    break;
            }
        },
        drawVertical: function() {
            var ctx = this.ctx,
                halfWidth = this.radius,
                leftX = this.x1 - halfWidth,
                rightX = this.x2 + halfWidth,
                startY = this.y1,
                endY = this.y2,
                halfStroke = this.strokeWidth / 2;

            // Canvas doesn't allow us to stroke inside the width so we can
            // adjust the sizes to fit if we're setting a stroke on the line
            if (this.showStroke) {
                leftX += halfStroke;
                rightX -= halfStroke;
                endY = (endY < startY) ? endY + halfStroke : endY - halfStroke;
                if (this.type === 2) {
                    startY = (endY < startY) ? startY - halfStroke : startY + halfStroke;
                }
            }

            //console.log(this.x1, this.y1, this.x2, this.y2);

            ctx.beginPath();

            ctx.fillStyle = this.fillColor;
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;

            // It'd be nice to keep this class totally generic to any rectangle
            // and simply specify which border to miss out.
            ctx.moveTo(leftX, startY);
            ctx.lineTo(leftX, endY);
            ctx.lineTo(rightX, endY);
            ctx.lineTo(rightX, startY);
            if (this.type === 2) {
                ctx.lineTo(leftX, startY);
            }
            ctx.fill();
            if (this.showStroke) {
                ctx.stroke();
            }
        },
        drawHorizontal: function() {
            var ctx = this.ctx,
                halfHeight = this.radius,
                startX = this.x1,
                endX = this.x2,
                topY = this.y1 - halfHeight,
                bottomY = this.y2 + halfHeight,
                halfStroke = this.strokeWidth / 2;

            // Canvas doesn't allow us to stroke inside the width so we can
            // adjust the sizes to fit if we're setting a stroke on the line
            if (this.showStroke) {
                topY += halfStroke;
                bottomY -= halfStroke;
                endX = (endX > startX) ? endX - halfStroke : endY + halfStroke;
                if (this.type === 4) {
                    startX = (endX > startX) ? startX + halfStroke : startX - halfStroke;
                }
            }

            ctx.beginPath();

            ctx.fillStyle = this.fillColor;
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;

            // It'd be nice to keep this class totally generic to any rectangle
            // and simply specify which border to miss out.
            ctx.moveTo(startX, topY);
            ctx.lineTo(endX, topY);
            ctx.lineTo(endX, bottomY);
            ctx.lineTo(startX, bottomY);
            if (this.type === 2) {
                ctx.lineTo(startX, topY);
            }
            ctx.fill();
            if (this.showStroke) {
                ctx.stroke();
            }
        },
        hasValue: function() {
            return _.util.bool.isNumber(this.value2);
        },
        inRange: function(X, Y) {
            switch (this.type) {
                case 0:
                case 2:
                    return ((X >= (this.x1 - this.radius / 2)) && (X <= (this.x1 + this.radius / 2))) && ((Y >= this.y1 && Y <= this.y2) || (Y <= this.y1 && Y >= this.y2));
                    break;
                case 1:
                case 3:
                    return ((Y >= (this.y1 - this.radius / 2)) && (Y <= (this.y1 + this.radius / 2))) && ((X >= this.x1 && X <= this.x2) || (X <= this.x1 && X >= this.x2));
                    break;
            }


        }
    });
});