/*!
 * tangram.js framework source code
 *
 * class see.BasicScrollBAR
 *
 * Date 2017-04-06
 */
;
tangram.block('$_/dom/Events.cls', function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document;

    declare('see.BasicScrollBAR', {
        disabled: false,
        protect: true,
        Element: undefined,
        document: undefined,
        vertical: undefined,
        horizontal: undefined,
        buttonUp: undefined,
        buttonRight: undefined,
        buttonDown: undefined,
        buttonLeft: undefined,
        horizontalRail: undefined,
        horizontalDragger: undefined,
        verticalRail: undefined,
        verticalDragger: undefined,
        resize: function() {
            if (this.Element) {
                this.document = this.document || this.Element;
                this.amount();
            }
            return this;
        },
        amount: function() {
            //Horizontal
            if (this.horizontal) {
                this.WinWidth = parseInt(_.dom.getStyle(this.Element, 'width'));
                this.DocWidth = _.dom.getSize(this.document, 'box').width;
                this.documentLeft = this.style(this.document, 'left', _.dom.getStyle(this.document, 'left') || 0);
                if (this.buttonLeft && this.buttonRight) {
                    this.RailWidth = this.style(this.horizontalRail, 'width', this.WinWidth - parseInt(_.dom.getStyle(this.buttonLeft, 'width')) - parseInt(_.dom.getStyle(this.buttonRight, 'width')));
                } else {
                    this.RailWidth = this.style(this.horizontalRail, 'width', this.WinWidth);
                }
                this.DragWidth = this.style(this.horizontalDragger, 'width', parseInt(_.dom.getStyle(this.horizontalRail, 'width')) * this.WinWidth / this.DocWidth);
                this.LeftMin = this.WinWidth - this.DocWidth;
                this.DraggerLeft = this.style(this.horizontalDragger, 'left', Math.abs(this.documentLeft / this.DocWidth * this.RailWidth));
                this.DraggerLeftMax = this.RailWidth - this.DragWidth;
                if (this.RailWidth <= this.DragWidth) {
                    this.horizontalActived = false;
                    this.toLeft();
                    _.dom.setStyle(this.horizontal, 'display', 'none');
                } else {
                    this.horizontalActived = true;
                    _.dom.setStyle(this.horizontal, 'display', 'block');
                }
            } else {
                this.horizontalActived = false;
            }

            //Vertical
            if (this.vertical) {
                this.WinHeight = parseInt(_.dom.getStyle(this.Element, 'height'));
                this.DocHeight = _.dom.getSize(this.document, 'box').height;
                this.documentTop = this.style(this.document, 'top', parseInt(_.dom.getStyle(this.document, 'top')) || 0);
                if (this.buttonUp && this.buttonDown) {
                    this.RailHeight = this.style(this.verticalRail, 'height', this.WinHeight - parseInt(_.dom.getStyle(this.buttonUp, 'height')) - parseInt(_.dom.getStyle(this.buttonDown, 'height')));
                } else {
                    this.RailHeight = this.style(this.verticalRail, 'height', this.WinHeight);
                }
                this.DragHeight = this.style(this.verticalDragger, 'height', parseInt(_.dom.getStyle(this.verticalRail, 'height')) * this.WinHeight / this.DocHeight);
                this.TopMin = this.WinHeight - this.DocHeight;
                this.DraggerTop = this.style(this.verticalDragger, 'top', Math.abs(this.documentTop / this.DocHeight * this.RailHeight));
                this.DraggerTopMax = this.RailHeight - this.DragHeight;
                if (this.RailHeight <= this.DragHeight) {
                    this.verticalActived = false;
                    this.toTop();
                    _.dom.setStyle(this.vertical, 'display', 'none');
                } else {
                    this.verticalActived = true;
                    _.dom.setStyle(this.vertical, 'display', 'block');
                }
            } else {
                this.verticalActived = false;
            }
            return this;
        },
        toTop: function() {
            this.documentTop = this.style(this.document, 'top', 0);
            this.DraggerTop = this.style(this.verticalDragger, 'top', 0);
            return this;
        },
        toBottom: function() {
            this.documentTop = this.style(this.document, 'top', this.WinHeight - this.DocHeight < 0 ? this.WinHeight - this.DocHeight : 0);
            this.DraggerTop = this.style(this.verticalDragger, 'top', Math.abs(this.documentTop / this.DocHeight * this.RailHeight));
            return this;
        },
        toLeft: function() {
            this.documentLeft = this.style(this.document, 'left', 0);
            this.DraggerLeft = this.style(this.horizontalDragger, 'left', 0);
            return this;
        },
        toRight: function() {
            this.documentLeft = this.style(this.document, 'left', this.WinWidth - this.DocWidth < 0 ? this.WinWidth - this.DocWidth : 0);
            this.DraggerLeft = this.style(this.horizontalDragger, 'left', Math.abs(this.documentLeft / this.DocWidth * this.RailWidth));
            return this;
        },
        bind: function() {
            var that = this;
            var _mousewheel = document.onmousewheel;
            new _.dom.Events(this.Element)
                .push('resize', null, null, function() {
                    that.resize;
                })
                .push('mousewheel', null, null, function(event) {
                    var elem = event.target;
                    if (that.protect) {
                        document.onmousewheel = function(event) {
                            return false;
                        };
                    }
                    that.mousewheel.call(that, event);
                })
                .push('mouseout', null, null, function() {
                    document.onmousewheel = _mousewheel;
                });
            if (this.vertical) {
                new _.dom.Events(this.verticalDragger)
                    .push('mousedown', null, null, function() {
                        document.body.onselectstart = document.body.ondrag = function(event) {
                            return false;
                        }
                        that.verticalDraggerActived = true;
                        this.y = event.y;
                    });
                new _.dom.Events(this.verticalRail)
                    .push('click', null, null, function(event) {
                        that.DraggerTop = that.style(that.verticalDragger, 'top', Math.abs(event.offsetY / that.RailHeight * that.DraggerTopMax));
                        that.documentTop = that.style(that.document, 'top', event.offsetY / that.RailHeight * that.TopMin);
                    });
            }
            if (this.horizontal) {
                new _.dom.Events(this.horizontalDragger)
                    .push('mousedown', null, null, function(event) {
                        document.body.onselectstart = document.body.ondrag = function() {
                            return false;
                        }
                        that.horizontalDraggerActived = true;
                        this.x = event.x;
                    });
                new _.dom.Events(this.horizontal)
                    .push('click', null, null, function() {
                        that.DraggerLeft = that.style(that.horizontalDragger, 'left', Math.abs(event.offsetX / that.RailWidth * that.DraggerLeftMax));
                        that.documentLeft = that.style(that.document, 'left', event.offsetX / that.RailWidth * that.LeftMin);
                    });
            }
            new _.dom.Events(document)
                .push('mouseup', null, null, function() {
                    that.verticalDraggerActived = that.horizontalDraggerActived = document.body.onselectstart = document.body.ondrag = false;
                })
                .push('mousemove', null, null, function(event) {
                    that.mousemove.call(that, event)
                });
            return this;
        },
        style: function(elem, prop, val) {
            _.dom.setStyle(elem, prop, val);
            return val;
        },
        mousewheel: function(event) {
            if (!this.disabled) {
                if (this.verticalActived) {
                    var WinHeight = parseInt(_.dom.getStyle(this.Element, 'height'));
                    var DocHeight = _.dom.getSize(this.document, 'box').height;
                    if (WinHeight != this.WinHeight || DocHeight != this.DocHeight) {
                        this.amount();
                    }
                    if (event.wheelDelta < 0) {
                        if (parseInt(_.dom.getStyle(this.document, 'top')) + event.wheelDelta > this.TopMin) {
                            if (this.documentTop + event.wheelDelta * 0.5 > this.TopMin) {
                                this.documentTop = this.style(this.document, 'top', this.documentTop + event.wheelDelta * 0.5);
                            } else {
                                this.documentTop = this.style(this.document, 'top', this.TopMin);
                            }
                        } else if (parseInt(_.dom.getStyle(this.document, 'top')) > this.TopMin) {
                            this.documentTop = this.style(this.document, 'top', this.TopMin);
                        } else {
                            //document.onmousewheel = null;
                        }
                    }
                    if (event.wheelDelta > 0) {
                        if (parseInt(_.dom.getStyle(this.document, 'top')) + event.wheelDelta < 0) {
                            if (this.documentTop + event.wheelDelta * 0.5 < 0) {
                                this.documentTop = this.style(this.document, 'top', this.documentTop + event.wheelDelta * 0.5);
                            } else {
                                this.documentTop = this.style(this.document, 'top', 0);
                            }
                        } else if (parseInt(_.dom.getStyle(this.document, 'top')) < 0) {
                            this.documentTop = this.style(this.document, 'top', 0);
                        } else {
                            //document.onmousewheel = null;
                        }
                    }
                    this.DraggerTop = this.style(this.verticalDragger, 'top', Math.abs(this.documentTop / this.DocHeight * this.RailHeight));
                } else if (this.horizontalActived) {
                    var WinWidth = parseInt(_.dom.getStyle(this.Element, 'width'));
                    var DocWidth = _.dom.getSize(this.document, 'box').width;
                    if (WinWidth != this.WinWidth || DocWidth != this.DocWidth) {
                        this.amount();
                    }
                    if (event.wheelDelta < 0) {
                        if (parseInt(_.dom.getStyle(this.document, 'left')) + event.wheelDelta > this.LeftMin) {
                            if (this.documentLeft + event.wheelDelta * 0.5 > this.LeftMin) {
                                this.documentLeft = this.style(this.document, 'left', this.documentLeft + event.wheelDelta * 0.5);
                            } else {
                                this.documentLeft = this.style(this.document, 'left', this.LeftMin);
                            }
                        } else if (parseInt(_.dom.getStyle(this.document, 'left')) > this.LeftMin) {
                            this.documentLeft = this.style(this.document, 'left', this.LeftMin);
                        } else {
                            //document.onmousewheel = null;
                        }
                    }
                    if (event.wheelDelta > 0) {
                        if (parseInt(_.dom.getStyle(this.document, 'left')) + event.wheelDelta < 0) {
                            if (this.documentLeft + event.wheelDelta * 0.5 < 0) {
                                this.documentLeft = this.style(this.document, 'left', this.documentLeft + event.wheelDelta * 0.5);
                            } else {
                                this.documentLeft = this.style(this.document, 'left', 0);
                            }
                        } else if (parseInt(_.dom.getStyle(this.document, 'left')) < 0) {
                            this.documentLeft = this.style(this.document, 'left', 0);
                        } else {
                            //document.onmousewheel = null;
                        }
                    }
                    this.DraggerLeft = this.style(this.horizontalDragger, 'left', Math.abs(this.documentLeft / this.DocWidth * this.RailWidth));
                }
            }
        },
        mousemove: function(e) {
            if (!this.disabled) {
                if (this.verticalDraggerActived) {
                    var moveY = event.y - this.verticalDragger.y;
                    if (Math.abs(moveY) > 120) {
                        if (this.DraggerTop + moveY >= 0 && this.DraggerTop + moveY <= this.DraggerTopMax) {
                            this.verticalDragger.y = event.y;
                            this.DraggerTop = this.style(this.verticalDragger, 'top', this.DraggerTop + moveY);
                        } else if (this.DraggerTop + moveY < 0) {
                            this.verticalDragger.y = event.y + this.DraggerTop;
                            this.DraggerTop = this.style(this.verticalDragger, 'top', 0);
                        } else if (this.DraggerTop + moveY > this.DraggerTopMax) {
                            this.verticalDragger.y = event.y + this.DraggerTop - this.DraggerTopMax;
                            this.DraggerTop = this.style(this.verticalDragger, 'top', this.DraggerTopMax);
                        }
                    }
                    this.documentTop = this.style(this.document, 'top', Math.abs(this.DraggerTop / this.RailHeight * this.DocHeight) * -1);
                }
                if (this.horizontalDraggerActived) {
                    var moveX = event.x - this.horizontalDragger.x;
                    if (Math.abs(moveX) > 120) {
                        if (this.DraggerLeft + moveX >= 0 && this.DraggerLeft + moveX <= this.DraggerLeftMax) {
                            this.horizontalDragger.x = event.x;
                            this.DraggerLeft = this.style(this.horizontalDragger, 'left', this.DraggerLeft + moveX);
                        } else if (this.DraggerLeft + moveX < 0) {
                            this.horizontalDragger.x = event.x + this.DraggerLeft;
                            this.DraggerLeft = this.style(this.horizontalDragger, 'left', 0);
                        } else if (this.DraggerLeft + moveX > this.DraggerLeftMax) {
                            this.horizontalDragger.x = event.x + this.DraggerLeft - this.DraggerLeftMax;
                            this.DraggerLeft = this.style(this.horizontalDragger, 'left', this.DraggerLeftMax);
                        }
                    }
                    this.documentLeft = this.style(this.document, 'left', Math.abs(this.DraggerLeft / this.RailHeight * this.DocHeight) * -1);
                }
            }
        }
    });
});