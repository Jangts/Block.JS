/*!
 * tangram.js framework source code
 *
 * extend_static_methods painter/Charts/components/MultiTooltip
 *
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/painter/Charts/util/helpers',
    '$_/painter/Charts/components/Abstract'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console;

    var helpers = _.painter.Charts.util.helpers;
    declare('painter.Charts.components.MultiTooltip', _.painter.Charts.components.Abstract, {
        initialize: function() {
            this.font = _.painter.canvas.fontString(this.fontSize, this.fontStyle, this.fontFamily);

            this.titleFont = _.painter.canvas.fontString(this.titleFontSize, this.titleFontStyle, this.titleFontFamily);

            this.titleHeight = this.title ? this.titleFontSize * 1.5 : 0;
            this.height = (this.labels.length * this.fontSize) + ((this.labels.length - 1) * (this.fontSize / 2)) + (this.yPadding * 2) + this.titleHeight;

            this.ctx.font = this.titleFont;

            var titleWidth = this.ctx.measureText(this.title).width,
                //Label has a legend square as well so account for this.
                labelWidth = _.painter.canvas.longestText(this.ctx, this.font, this.labels) + this.fontSize + 3,
                longestTextWidth = _.arr.max([labelWidth, titleWidth]);

            this.width = longestTextWidth + (this.xPadding * 2);

            var halfHeight = this.height / 2;

            //Check to ensure the height will fit on the canvas
            if (this.y - halfHeight < 0) {
                this.y = halfHeight;
            } else if (this.y + halfHeight > this.chart.height) {
                this.y = this.chart.height - halfHeight;
            }

            //Decide whether to align left or right based on position on canvas
            if (this.x > this.chart.width / 2) {
                this.x -= this.xOffset + this.width;
            } else {
                this.x += this.xOffset;
            }
        },
        getLineHeight: function(index) {
            var baseLineHeight = this.y - (this.height / 2) + this.yPadding,
                afterTitleIndex = index - 1;

            //If the index is zero, we're getting the title
            if (index === 0) {
                return baseLineHeight + this.titleHeight / 3;
            } else {
                return baseLineHeight + ((this.fontSize * 1.5 * afterTitleIndex) + this.fontSize / 2) + this.titleHeight;
            }

        },
        draw: function() {
            if (this.custom) {
                this.custom(this);
            } else {
                _.painter.canvas.drawRoundedRectangle(this.ctx, this.x, this.y - this.height / 2, this.width, this.height, this.cornerRadius);
                var ctx = this.ctx;
                ctx.globalAlpha = 0.75;
                ctx.fillStyle = this.fillColor;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.closePath();

                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                ctx.fillStyle = this.titleTextColor;
                ctx.font = this.titleFont;

                ctx.fillText(this.title, this.x + this.xPadding, this.getLineHeight(0));

                ctx.font = this.font;
                _.each(this.labels,
                    function(index, label) {
                        ctx.fillStyle = this.textColor;
                        ctx.fillText(label, this.x + this.xPadding + this.fontSize + 3, this.getLineHeight(index + 1));

                        /*
                        ctx.fillStyle = this.legendColorBackground;
                        ctx.fillRect(this.x + this.xPadding + this.fontSize/4, this.getLineHeight(index + 1) - this.fontSize / 8, this.fontSize/2, this.fontSize/2);
                        */

                        ctx.fillStyle = this.legendColors[index].fill;
                        ctx.fillRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize / 4, this.fontSize * 2 / 3, this.fontSize * 2 / 3);

                    },
                    this);
            }
        }
    });
});