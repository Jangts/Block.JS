/*!
 * tangram.js framework source code
 *
 * extend_static_methods graphic/canvas
 *
 * Date: 2017-04-06
 */

tangram.block([
    '$_/util/bool',
    '$_/dom/',
    '$_/painter/SVGElement'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console,
        location = global.location;

    var SVGElement = _.painter.SVGElement,
        getGeoPathStr = function(coordinate, i, svg, type) {
            coordinate = svg.coordinateSwitch(coordinate, type);
            if (i == 0) {
                return 'M' + coordinate[0] + ',' + coordinate[1];
            } else {
                return 'L' + coordinate[0] + ',' + coordinate[1];
            }
        };

    var types = {
        Long: function(coordinate, mapCenter, scale, center) {
            return (coordinate[0] - mapCenter) * scale + center;
        },
        CosLat: function(coordinate, mapCenter, scale, center) {
            return Math.cos(2 * Math.PI / 360 * coordinate[1]) * (coordinate[0] - mapCenter) * scale + center;
        },
        World: function(coordinate, mapCenter, scale, center) {
            return (1 - Math.sin(2 * Math.PI / 360 * Math.abs(coordinate[1])) * Math.abs(coordinate[1]) / 180 * Math.abs(coordinate[1]) / 90) * (coordinate[0] - mapCenter) * scale + center;
        }
    };

    _('painter');

    declare('painter.SVG', {
        _init: function(root, width, height) {
            if (_.util.bool.isEl(root)) {
                this.root = root;
                this.width = width || 800;
                this.height = height || 600;
                var SVG = new SVGElement('svg', { width: width, height: height }, root);
                _.each(SVG, function(index, value) {
                    this[index] = value;
                }, this);
            }
        },
        rect: function(x, y, width, height, data) {
            var rect = new SVGElement('rect', {
                x: x,
                y: y,
                width: width,
                height: height
            }, this.Element);
            if (data) {
                _.each(data, function(attr) {
                    rect.attr(attr, this);
                });
            }
            return rect;
        },
        circle: function(cx, cy, r, data) {
            var circle = new SVGElement('circle', {
                cx: cx,
                cy: cy,
                r: r
            }, this.Element);
            if (data) {
                _.each(data, function(attr) {
                    circle.attr(attr, this);
                });
            }
            return circle;
        },
        eliipse: function(cx, cy, rx, ry, data) {
            var eliipse = new SVGElement('eliipse', {
                cx: cx,
                cy: cy,
                rx: rx,
                ry: ry
            }, this.Element);
            if (data) {
                _.each(data, function(attr) {
                    eliipse.attr(attr, this);
                });
            }
            return eliipse;
        },
        line: function(x1, y1, x2, y2, data) {
            var line = new SVGElement('line', {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            }, this.Element);
            if (data) {
                _.each(data, function(attr) {
                    line.attr(attr, this);
                });
            }
            return line;
        },
        path: function(pathString, data) {
            var path = new SVGElement('path', {
                d: pathString
            }, this.Element);
            if (data) {
                _.each(data, function(attr) {
                    path.attr(attr, this);
                });
            }
            return path;
        },
        text: function(x, y, textContent, data) {
            var text = new SVGElement('text', {
                x: x,
                y: y,
            }, this.Element);
            text.Element.textContent = textContent;
            if (data) {
                _.each(data, function(attr) {
                    text.attr(attr, this);
                });
            }
            text.span = function(x, y, textContent, data) {
                var tspan = new SVGElement('tspan', {
                    x: x,
                    y: y,
                }, text.Element);
                tspan.Element.textContent = textContent;
                if (data) {
                    _.each(data, function(attr) {
                        tspan.attr(attr, this);
                    });
                }
            };
            return text;
        },
        sharp: function() {

        }
    });

    _('painter', {
        geo: function(root, width, height, data, range, after, type) {
            var svg = new _.painter.SVG(root, width, height);
            var svgRate = width / height,
                mapRate = (range.rb[0] - range.lt[0]) / (range.lt[1] - range.rb[1]),
                center = width / 2;
            if (svgRate > mapRate) {
                var mapWidth = height * mapRate,
                    mapHeight = height,
                    top = 0;
            } else {
                var mapWidth = width,
                    mapHeight = width / mapRate,
                    top = (height - mapHeight) / 2;
            }
            var scale = mapWidth / (range.rb[0] - range.lt[0]),
                mapCenter = (range.rb[0] + range.lt[0]) / 2;
            svg.coordinateSwitch = function(coordinate, type) {
                type = type || 'CosLat';
                var x = types[type] ? types[type](coordinate, mapCenter, scale, center) : types.CosLat(coordinate, mapCenter, scale, center),
                    y = (range.lt[1] - coordinate[1]) * scale + top;
                return [x, y];
            }
            _.each(data, function(i, place) {
                var pathStr = '',
                    coordinates = place["geometry"]["coordinates"];
                _.each(coordinates, function(i, coordinate) {
                    if (_.util.bool.isNum(coordinate[0][0])) {
                        _.each(coordinates[i], function(n, array) {
                            pathStr += getGeoPathStr(array, n, svg, type);
                        });
                    } else if (_.util.bool.isNum(coordinate[0][0][0])) {
                        _.each(coordinates[i][0], function(n, array) {
                            pathStr += getGeoPathStr(array, n, svg, type);
                        });
                    }
                });
                var path = svg.path(pathStr);
                after.call(svg, i, path, place["type"], place["properties"]);
            });
            return svg;
        },
    });
});