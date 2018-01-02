/*!
 * Block.JS Framework Source Code
 * 
 * class painter/Charts
 * 
 * Date: 2015-09-04
 */
;
block('$_/dom/', function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var instances = {};

    declare('painter.Charts', {
        ctx: undefined,
        canvas: undefined,
        width: 0,
        height: 0,
        ratio: 1,
        _init: function(elem, theme, options) {
            if (_.util.type.isElement(elem)) {
                this.id = new _.Identifier().toString();
                this.historyCharts = {};
                instances[this.id] = this;
                _.dom.setAttr(elem, 'data-chart-id', this.id);
                _.dom.setStyle(elem, {
                    '-webkit-tap-highlight-color': 'transparent',
                    '-webkit-user-select': 'none',
                    'position': 'relative',
                    'background-color': 'transparent'
                });
                this.Element = elem;
                var computeDimension = _.dom.getSize(elem, 'inner');
                this.width = computeDimension.width;
                this.height = computeDimension.height;
                this.layers = {};
                this.ratio = this.width / this.height;
                if (theme && _.painter.Charts.theme[theme]) {
                    this.options = _.util.obj.deepMerge(_.painter.Charts.util.defaults, _.painter.Charts.theme[theme]);
                } else {
                    this.options = _.copy(_.painter.Charts.util.defaults);
                }

                if (options) {
                    this.setOption(options);
                }
            } else {
                _.error('No Element');
            }
        },
        setOption: function(options) {
            options = options || {};
            if (options.radar) {
                this.radarpolar = this.radarpolar || null;
            } else if (options.polar) {
                // 已废弃
                this.polar = this.polar || null;
            } else {
                this.grid = this.grid || null;
            }
            this.series = {};
            this.options = _.util.obj.deepMerge(this.options || {}, options);
            if (options.backgroundColor) {
                _.dom.setStyle(this.Element, 'backgroundColor', options.backgroundColor);
            }
            _.painter.Charts.util.events.bindHover(this);
            if (options.series) {
                _.each(options.series, function(i, chart) {
                    if (chart.type) {
                        if (this[chart.type]) {
                            this.series[chart.type] = this.series[chart.type] || [];
                            this.series[chart.type].push(chart);
                        } else {
                            _.error('Loading chart type \'' + chart.type + '\' first.');
                        }
                    } else {
                        _.error('Unspecified type of one or more charts.');
                    }
                }, this);
            }
            this.build();
        },
        build: function(animaless) {
            this.activedCharts = [];
            this.activedNamesCount = {};
            if (this.grid || this.grid === null) {
                this.options.grid && this.options.grid.show && (typeof this.buildGrid === 'function') && this.buildGrid();
            } else if (this.polar || this.polar === null) {
                this.options.polar && this.options.polar.show && (typeof this.buildPolar === 'function') && this.buildPolar();
            }
            if (this.radarpolar || this.radarpolar === null) {
                this.options.radar && this.options.radar.show && (typeof this.buildRadar === 'function') && this.buildRadar();
            }
            var types = ['bar', 'polareare', 'line', 'scatter', 'radar', 'pie'];
            _.each(types, function(i, type) {
                this[type] && this[type]();
            }, this);

            console.log(this);
            animaless ? this.draw() : this.render();
        },
        getChartName: function(pre) {
            pre = typeof pre === 'string' ? pre : '';
            this.activedNamesCount[pre] = this.activedNamesCount[pre] || 0;
            return pre + this.activedNamesCount[pre]++;
        },
        getLayer: function(zIndex) {
            zIndex = zIndex || 0;
            if (!this.layers[zIndex]) {
                var canvas = _.dom.create('canvas', this.Element, {
                    width: this.width,
                    height: this.height,
                    style: {
                        'position': 'absolute',
                        'left': '0px',
                        'top': '0px',
                        'width': this.width + 'px',
                        'height': this.height + 'px',
                        '-webkit-user-select': 'none',
                        '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)'
                    }

                });
                canvas.width = this.width;
                canvas.height = this.height;
                this.layers[zIndex] = canvas;
            }
            return this.layers[zIndex];
        },
        retinaScale: function() {
            if (window.devicePixelRatio) {
                _.each(this.layers, function(zIndex, canvas) {
                    var ctx = canvas.getContext("2d"),
                        width = ctx.canvas.width,
                        height = ctx.canvas.height;
                    ctx.canvas.style.width = width + "px";
                    ctx.canvas.style.height = height + "px";
                    ctx.canvas.height = height * window.devicePixelRatio;
                    ctx.canvas.width = width * window.devicePixelRatio;
                    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
                });
            }
            return this;
        },
        clear: function() {
            _.each(this.layers, function(zIndex, canvas) {
                var ctx = canvas.getContext("2d"),
                    width = ctx.canvas.width,
                    height = ctx.canvas.height;
                _.painter.canvas.clear(ctx, width, height);
            });
            return this;
        },
        stop: function() {
            if (this.cancelAnimation) {
                this.cancelAnimation();
            }
            return this;
        },
        render: function() {
            this.clear();
            if (this.addAnimation && this.options.animation) {
                this.addAnimation();
            } else {
                (typeof this.options.onAnimationComplete === 'function') && this.options.onAnimationComplete();
            }
            return this;
        },
        draw: function(ease) {
            var easingDecimal = ease || 1;
            this.clear();
            this.grid && this.grid.draw(easingDecimal);
            this.radarpolar && this.radarpolar.draw(easingDecimal);
            this.polar && this.polar.draw(easingDecimal);
            _.each(this.activedCharts, function(i, chart) {
                chart.draw(ease);
            });
            return this;
        },
        resize: function() {
            this.stop();
            this.clear();
            var newWidth = _.painter.Charts.util.helpers.getMaximumWidth(this.Element),
                newHeight = this.options.maintainAspectRatio ? newWidth / this.ratio : _.painter.Charts.helpers.getMaximumHeight(this.Element);
            this.width = newWidth;
            this.height = newHeight;
            _.each(this.layers, function(zIndex, canvas) {
                canvas.width = newWidth;
                canvas.height = newHeight;
            });
            this.retinaScale();
            return this.build(true);
        }
    });

    _.extend(_.painter.Charts, {
        util: {
            helpers: {
                getMaximumWidth: function(parentNode) {
                    return _.dom.getSize(parentNode, 'inner').width;
                },
                getMaximumHeight: function(parentNode) {
                    return _.dom.getSize(parentNode, 'inner').height;
                }
            },
            defaults: {},
            events: {}
        },
        theme: {},
        sharp: {},
        type: {},
        component: {}
    });

    // Attach global event to resize each chart instance when the browser resizes
    _.dom.events.add(window, "resize", null, null, (function() {
        // Basic debounce of resize function so it doesn't hurt performance when resizing browser.
        var timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                _.each(instances, function(index, instance) {
                    // If the responsive flag is set in the chart instance config
                    // Cascade the resize event down to the chart.
                    if (instance.options.responsive) {
                        instance.resize(instance.render, true);
                    }
                });
            }, 50);
        };
    })());
});