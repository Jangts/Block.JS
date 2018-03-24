tangram.block([
    '$_/data/',
    '$_/dom/Elements/animation.clsx'
], function(_, global, undefined) {
    var $ = _.dom.select,
        document = global.document,
        body = document.body || document.getElementsByTagName('body')[0],
        isSupportWebp = !![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;

    var htmlBuilde = function() {
            if ($('#tangram-dvcode-mask').length) {
                return;
            }
            var html = '<div class="loading">加载中</div>';
            html += '<canvas class="dvcode-image"></canvas>';
            html += '<canvas class="dvcode-mark"></canvas>';
            html += '<div class="hgroup"></div>';
            html += '<div class="tangram-dvcode-err"></div>';
            html += '<div class="tangram-dvcode-ok"></div>';
            html += '<div class="tangram-dvcode-slide">';
            html += '<div class="tangram-dvcode-dragger"></div>';
            html += '<div class="tangram-dvcode-tips">拖动左边滑块完成上方拼图</div></div>';
            html += '<div class="tangram-dvcode-tools">';
            html += '<div class="dvcode-close"></div>';
            html += '<div class="dvcode-refresh"></div></div></div>';
            _.dom.create('div', body, {
                id: 'tangram-dvcode-mask',
                className: 'tangram-dvcode-mask'
            });
            _.dom.create('div', body, {
                id: 'tangram-dvcode',
                className: 'tangram-dvcode',
                html: html
            });
            return true;
        },
        draw = {
            full: function() {
                var canvas_bg = $('.dvcode-image')[0];
                var ctx_bg = canvas_bg.getContext('2d');
                ctx_bg.drawImage(this.image, 0, this.imgHeight * 2, this.imgWidth, this.imgHeight, 0, 0, this.imgWidth, this.imgHeight);
            },
            image: function() {
                if (this.isBgDrawn) {
                    return;
                }
                this.isBgDrawn = true;
                var canvas_bg = $('.dvcode-image')[0];
                var ctx_bg = canvas_bg.getContext('2d');
                ctx_bg.drawImage(this.image, 0, 0, this.imgWidth, this.imgHeight, 0, 0, this.imgWidth, this.imgHeight);
            },
            mark: function() {
                var canvas_mark = $('.dvcode-mark')[0];
                var ctx_mark = canvas_mark.getContext('2d');
                //清理画布
                ctx_mark.clearRect(0, 0, canvas_mark.width, canvas_mark.height);
                ctx_mark.drawImage(this.image, 0, this.imgHeight, this.markWidth, this.imgHeight, this.markOffset, 0, this.markWidth, this.imgHeight);
                var imageData = ctx_mark.getImageData(0, 0, this.imgWidth, this.imgHeight);
                // 获取画布的像素信息
                // 是一个一维数组，包含以 RGBA 顺序的数据，数据使用  0 至 255（包含）的整数表示
                // 如：图片由两个像素构成，一个像素是白色，一个像素是黑色，那么 data 为
                // [255,255,255,255,0,0,0,255]
                // 这个一维数组可以看成是两个像素中RBGA通道的数组的集合即:
                // [R,G,B,A].concat([R,G,B,A])
                var data = imageData.data;
                //alert(data.length/4);
                var x = this.imgHeight,
                    y = this.imgWidth;
                for (var j = 0; j < x; j++) {
                    var ii = 1,
                        k1 = -1;
                    for (var k = 0; k < y && k >= 0 && k > k1;) {
                        // 得到 RGBA 通道的值
                        var i = (j * y + k) * 4;
                        k += ii;
                        var r = data[i],
                            g = data[i + 1],
                            b = data[i + 2];
                        // 我们从最下面那张颜色生成器中可以看到在图片的右上角区域，有一小块在
                        // 肉眼的观察下基本都是白色的，所以我在这里把 RGB 值都在 245 以上的
                        // 的定义为白色
                        // 大家也可以自己定义的更精确，或者更宽泛一些
                        if (r + g + b < 200) data[i + 3] = 0;
                        else {
                            var arr_pix = [1, -5];
                            var arr_op = [250, 0];
                            for (var i = 1; i < arr_pix[0] - arr_pix[1]; i++) {
                                var iiii = arr_pix[0] - 1 * i;
                                var op = parseInt(arr_op[0] - (arr_op[0] - arr_op[1]) / (arr_pix[0] - arr_pix[1]) * i);
                                var iii = (j * y + k + iiii * ii) * 4;
                                data[iii + 3] = op;
                            }
                            if (ii == -1) {
                                break;
                            }
                            k1 = k;
                            k = y - 1;
                            ii = -1;
                        };
                    }
                }
                ctx_mark.putImageData(imageData, 0, 0);
            }
        },
        send = {
            result: function() {
                var that = this;
                this.result = false;
                _.data.AJAX(this.url + '?m=check&token=' + this.markOffset, {
                    method: 'GET',
                    success: function(responseText) {
                        send.success.call(that, responseText);
                    },
                    fail: function(responseText) {
                        send.failure.call(that, responseText);
                    }
                });
            },
            success: function(responseText) {
                this.isMoveStarted = false;
                if (responseText == 'ok') {
                    // this._this.innerHTML = '√验证成功';
                    this.msg('√验证成功', 1);
                    this.result = true;
                    $('.hgroup').show();
                    setTimeout(this.hide, 3000);
                    if (_.util.bool.isFn(this.success)) {
                        this.success();
                    }
                } else {
                    var obj = $('#tangram-dvcode');
                    obj.addClass('dd');
                    setTimeout(function() {
                        obj.removeClass('dd');
                    }, 200);
                    this.result = false;
                    this.msg('验证失败');
                    this.errCount++;
                    if (this.errCount > 10) {
                        this.refresh();
                    }
                }
            },
            failure: function(xhr, status) {
                if (_.util.bool.isFn(this.fail)) {
                    this.fail();
                }
            },
        };

    _.declareClass('DVCode', {
        image: null,
        markWidth: 50,
        markHeight: 50,
        markOffset: 0,
        imgWidth: 240,
        imgHeight: 150,
        isImageLoaded: false,
        isBgDrawn: false,
        isMoveStarted: false,
        isMoving: false,
        startX: 0,
        startY: 0,
        success: null,
        fail: null,
        fail: null,
        cancel: null,
        result: false,
        errCount: 0,
        _init: function(options) {
            _.each(options, function(option, value) {
                this[option] = value;
            }, this);
            if (htmlBuilde()) {
                this.listenEvents();
            }
        },
        show: function() {
            $('.hgroup').hide();
            this.refresh();
            $('#tangram-dvcode-mask, #tangram-dvcode').show();
            return this;
        },
        hide: function() {
            $('#tangram-dvcode-mask, #tangram-dvcode').hide();
            if (_.util.bool.isFn(this.cancel)) {
                this.cancel();
            }
            return this;
        },
        refresh: function() {
            var that = this;
            this.errCount = 0;
            this.isBgDrawn = false;
            this.result = false;
            this.isImageLoaded = false;

            $('.dvcode-image, .dvcode-mark').hide();

            var src = this.url + "?m=make&t=" + Math.random();
            if (!isSupportWebp) {
                //浏览器不支持webp
                src += "&nowebp";
            }

            this.image = new Image();
            this.image.src = src;
            this.image.onload = function() {
                draw.full.call(that);
                var canvas_mark = $('.dvcode-mark')[0];
                var ctx_mark = canvas_mark.getContext('2d');
                //清理画布
                ctx_mark.clearRect(0, 0, canvas_mark.width, canvas_mark.height);
                that.isImageLoaded = true;
                $('.dvcode-image, .dvcode-mark').show();
            };

            $('.tangram-dvcode-dragger').css('transform', 'translate(0px, 0px)');
            $('.tangram-dvcode-tips').show();
            return this;
        },
        reset: function() {
            this.markOffset = 0;
            draw.image.call(this);
            draw.mark.call(this);
            $('.tangram-dvcode-dragger').css('transform', 'translate(0px, 0px)');
            return this;
        },
        msg: function(msg, status) {
            if (!status) {
                var that = this;
                status = 0;
                var elems = $('.tangram-dvcode-err').html(msg).transition('opacity', 0.8, 1000, null, function() {
                    setTimeout(function() {
                        elems.transition('opacity', 0, 1000);
                    }, 2000);
                    that.reset();
                });
            } else {
                var elems = $('.tangram-dvcode-ok').html(msg).transition('opacity', 0.8, 1000, null, function() {
                    setTimeout(function() {
                        elems.transition('opacity', 0, 1000);
                    }, 2000);
                });
            }
            return this;
        },
        result: function() {
            return this.result;
        },
        listenEvents: function() {
            if (!this.image) {
                var that = this;
                $('#tangram-dvcode')
                    .on(['mousedown', 'touchstart'], '.tangram-dvcode-dragger', this, function(e) {
                        that.onStartMove(e);
                    })
                    .on(['touchstart', 'click'], '.dvcode-close', this, function(e) {
                        that.hide();
                    })
                    .on(['mousedown', 'click'], '.dvcode-refresh', this, function(e) {
                        that.refresh();
                    });
                $(document)
                    .on(['mousemove', 'touchmove'], null, this, function(e) {
                        that.onMove(e);
                    })
                    .on(['mouseup', 'touchend'], null, this, function(e) {
                        that.onEndMove(e);
                    });
            }
            return this;
        },
        onStartMove: function(e) {
            if (this.isMoveStarted || !this.isImageLoaded) {
                return this;
            }
            e.preventDefault();
            if (e.touches) {
                e = e.touches[0];
            }
            // console.log("onStartMove");
            $('.tangram-dvcode-tips').hide();
            draw.image.call(this);
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.isMoveStarted = true;
            this.isMoving = true;
            return this;
        },
        onMove: function(e) {
            if (!this.isMoveStarted) return true;
            if (!this.isMoving) return true;
            e.preventDefault();
            if (e.touches) {
                e = e.touches[0];
            }
            this.isMoving = true;
            // console.log("onMove");
            var offset = e.clientX - this.startX;
            if (offset < 0) {
                offset = 0;
            }
            var max_off = this.imgWidth - this.markWidth;
            if (offset > max_off) {
                offset = max_off;
            }
            $('.tangram-dvcode-dragger').css('transform', 'translate(' + offset + 'px, 0px');
            this.markOffset = offset / max_off * (this.imgWidth - this.markWidth);
            draw.image.call(this);
            draw.mark.call(this);
            return this;
        },
        onEndMove: function(e) {
            if (!this.isMoveStarted) return true;
            e.preventDefault();
            if (e.touches) {
                e = e.touches[0];
            }
            // console.log("onEndMove");
            this.isMoving = false;
            send.result.call(this);
            return this;
        }
    });
});