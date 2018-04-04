/*!
 * tangram.js framework source code
 *
 * extend_static_methods graphic/canvas
 *
 * Date: 2017-04-06
 */

tangram.block(function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        doc = global.document;

    declare('painter.QRCode.SVGDrawing', {
        _init: function(el, options) {
            this.Element = el;
            this.options = options;
        },
        draw: function(QRCode) {
            var options = this.options;
            var elem = this.Element;
            var nCount = QRCode.getModuleCount();
            var nWidth = Math.floor(options.width / nCount);
            var nHeight = Math.floor(options.height / nCount);

            this.clear();

            function makeSVG(tag, attrs) {
                var el = doc.createElementNS('http://www.w3.org/2000/svg', tag);
                for (var k in attrs)
                    if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k]);
                return el;
            }

            var svg = makeSVG("svg", { 'viewBox': '0 0 ' + String(nCount) + " " + String(nCount), 'width': '100%', 'height': '100%', 'fill': options.colorLight });
            svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
            elem.appendChild(svg);

            svg.appendChild(makeSVG("rect", { "fill": options.colorLight, "width": "100%", "height": "100%" }));
            svg.appendChild(makeSVG("rect", { "fill": options.colorDark, "width": "1", "height": "1", "id": "template" }));

            for (var row = 0; row < nCount; row++) {
                for (var col = 0; col < nCount; col++) {
                    if (QRCode.isDark(row, col)) {
                        var child = makeSVG("use", { "x": String(col), "y": String(row) });
                        child.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template")
                        svg.appendChild(child);
                    }
                }
            }
        },
        clear: function() {
            while (this.Element.hasChildNodes())
                this.Element.removeChild(this.Element.lastChild);
        }
    });
});