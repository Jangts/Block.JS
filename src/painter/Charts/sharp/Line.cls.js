/*!
 * tangram.js framework source code
 * Date: 2015-09-04
 */
;
tangram.block(['$_/painter/Charts/Component/Component.cls'], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console;

    var helpers = _.painter.Charts.util.helpers;

    declare('painter.Charts.sharp.Line', _.painter.Charts.Component, {
        index: 0,
        ctx: undefined,
        bezierCurve: false,
        bezierCurveTension: 0.4,
        datasetStroke: true,
        draw: function(closePath) {
            var ctx = this.ctx;
            if (this.bezierCurve) {
                var tension = (this.index > 0 && this.index < this.siblings - 1) ? this.bezierCurveTension : 0;
                this.controlPoints = helpers.splineCurve(
                    this.previous.point,
                    this.point,
                    this.next.point,
                    tension);

                if (this.grid) {
                    switch (this.grid.status) {
                        case 0:
                            if (this.controlPoints.outer.y > this.grid.bottomPoint) {
                                this.controlPoints.outer.y = this.grid.bottomPoint;
                            } else if (this.controlPoints.outer.y < this.grid.topPoint) {
                                this.controlPoints.outer.y = this.grid.topPoint;
                            }

                            if (this.controlPoints.inner.y > this.grid.bottomPoint) {
                                this.controlPoints.inner.y = this.grid.bottomPoint;
                            } else if (this.controlPoints.inner.y < this.grid.topPoint) {
                                this.controlPoints.inner.y = this.grid.topPoint;
                            }
                            break;
                        case 1:
                            if (this.controlPoints.outer.x > this.grid.rightPoint) {
                                this.controlPoints.outer.x = this.grid.rightPoint;
                            } else if (this.controlPoints.outer.x < this.grid.leftPoint) {
                                this.controlPoints.outer.x = this.grid.leftPoint;
                            }

                            if (this.controlPoints.inner.x > this.grid.rightPoint) {
                                this.controlPoints.inner.x = this.grid.rightPoint;
                            } else if (this.controlPoints.inner.x < this.grid.leftPoint) {
                                this.controlPoints.inner.x = this.grid.leftPoint;
                            }
                            break;
                    }
                }
            }

            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.strokeStyle;

            if (this.radar && this.datasetStroke) {
                if (this.index === 0) {
                    ctx.beginPath();
                }
                switch (this.lineType) {
                    case 'dashed':
                        return _.painter.canvas.drawDashLine(ctx, this.previous.point.x, this.previous.point.y, this.point.x, this.point.y, ctx.lineWidth * 3);
                    case 'dotted':
                        return _.painter.canvas.drawDashLine(ctx, this.previous.point.x, this.previous.point.y, this.point.x, this.point.y, ctx.lineWidth);
                }
            }

            if (this.index === 0) {
                ctx.beginPath();
                ctx.moveTo(this.point.x, this.point.y);
            } else {
                if (this.bezierCurve) {
                    ctx.bezierCurveTo(
                        this.previous.controlPoints.outer.x,
                        this.previous.controlPoints.outer.y,
                        this.controlPoints.inner.x,
                        this.controlPoints.inner.y,
                        this.point.x,
                        this.point.y);
                } else {

                    ctx.lineTo(this.point.x, this.point.y);
                }
            }

            if ((this.index === this.siblings - 1) && this.datasetStroke) {
                if (closePath) {
                    ctx.closePath();
                }
                ctx.stroke();
            }
        }
    })
});