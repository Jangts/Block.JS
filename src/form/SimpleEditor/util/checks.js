/*!
 * tangram.js framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/dom/',
    '$_/util/Color'
], function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker,
        console = global.console,
        query = _.dom.sizzle || _.dom.query;

    var rbgaToHexadecimal = function(rgba) {
            var arr = rgba.split(/\D+/);
            var num = Number(arr[1]) * 65536 + Number(arr[2]) * 256 + Number(arr[3]);
            var hex = num.toString(16);
            while (hex.length < 6) {
                hex = "0" + hex;
            }
            return "#" + hex.toUpperCase();
        },
        inheritDecoration = function(node, textDecorationLine) {
            while (node != undefined && node != null) {
                var _inheritDecoration = _.dom.getStyle(node).textDecorationLine;
                if (_inheritDecoration && (_inheritDecoration == textDecorationLine)) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        },
        checkFontFormat = function(style) {
            var range = this.selection.range;
            if (range && range.commonElem) {
                _.each(query('.se-pick li', this.toolbar), function(i, el) {
                    _.dom.toggleClass(this, 'selected', false);
                });
                selector = ", .fontsize .se-font[data-se-val=\"" + style.fontSize + "\"]";
                selector += ", .forecolor .se-color[data-se-val=\"" + rbgaToHexadecimal(style.color) + "\"]";
                selector += ", .backcolor .se-color[data-se-val=\"" + rbgaToHexadecimal(style.backgroundColor) + "\"]";
                _.each(query(selector, this.toolbar), function(i, el) {
                    _.dom.toggleClass(this, 'selected', true);
                });
            }
        },
        checkFormat = function() {
            var range = this.selection.range;
            if (range && range.commonElem) {
                _.each(query('.bold, .italic, .underline, .strikethrough, .justifyleft, .justifycenter, .justifyright, .justifyfull, .blockquote, .insertunorderedlist, .insertorderedlist', this.toolbar), function(i, el) {
                    _.dom.toggleClass(this, 'active', false);
                });
                var style = _.dom.getStyle(range.commonElem);
                var selector = [];
                // console.log(range, range.commonElem, style.fontWeight, style.fontStyle);
                if (style.fontWeight === 'bold' || style.fontWeight == 700) {
                    selector.push('.bold');
                }
                if (style.fontStyle == 'italic') {
                    selector.push('.italic');
                }
                if (inheritDecoration(range.commonElem, 'line-through')) {
                    selector.push('.strikethrough');
                }
                if (inheritDecoration(range.commonElem, 'underline')) {
                    selector.push('.underline');

                }
                switch (style.textAlign) {
                    case 'start':
                    case 'left':
                        selector.push('.justifyleft');
                        break;
                    case 'center':
                        selector.push('.justifycenter');
                        break;
                    case 'end':
                    case 'right':
                        selector.push('.justifyright');
                        break;
                    case 'justify':
                        selector.push('.justifyfull');
                        break;
                }
                if (_.dom.closest(range.commonElem, 'ul', true)) {
                    selector.push('.insertunorderedlist');
                }
                if (_.dom.closest(range.commonElem, 'ol', true)) {
                    selector.push('.insertorderedlist');
                }
                if (_.dom.closest(range.commonElem, 'blockquote', true)) {
                    selector.push('.blockquote');
                }
                if (selector.length > 0) {
                    _.each(query(selector.join(', '), this.toolbar), function(i, el) {
                        _.dom.toggleClass(this, 'active', true);
                    });
                }
                checkFontFormat.call(this, style);
            }
        },
        checkStatus = function() {
            if (this.statebar) {
                var range = this.selection.range;
                // console.log(range && range.commonElem);
                if (range && range.commonElem) {
                    var style = _.dom.getStyle(range.commonElem),
                        node = _.dom.closest(range.commonElem, 'table'),
                        row = _.dom.closest(range.commonElem, 'tr'),
                        cell = _.dom.closest(range.commonElem, 'td', true);


                    query('.se-fontstatus .se-color-input', this.statebar)[0].value = _.util.Color.rgbFormat(style.color, 'hex6');
                    if (node && row) {
                        query('.se-tablestatus', this.statebar)[0].style.display = 'block';
                        var rowslen = node.rows.length,
                            colslen = row.cells.length;
                        this.selectedTable = node;
                        this.selectedTableRow = row;
                        this.selectedTableCell = cell;
                        //console.log([node]);
                        query('.se-tablestatus .se-tablewidth-input', this.statebar)[0].value = node.offsetWidth;
                        query('.se-tablestatus .se-rowslen', this.statebar)[0].value = rowslen;
                        query('.se-tablestatus .se-colslen', this.statebar)[0].value = colslen;
                        query('.se-tablestatus .se-border-input', this.statebar)[0].value = node.border || 0;
                    } else {
                        query('.se-tablestatus', this.statebar)[0].style.display = 'none';
                    }
                    if (this.selectedImage) {
                        query('.se-imagestatus', this.statebar)[0].style.display = 'block';
                        query('.se-imagestatus .se-imgwidth-input', this.statebar)[0].value = this.selectedImage.offsetWidth;
                        query('.se-imagestatus .se-imgheight-input', this.statebar)[0].value = this.selectedImage.offsetHeight;
                        query('.se-imagestatus .se-border-input', this.statebar)[0].value = this.selectedImage.border || 0;
                        var nodes = query('.se-imagestatus .se-imgfloat', this.statebar),
                            select = this.selectedImage.style.float ? this.selectedImage.style.float : 'none';
                        _.each(nodes, function(i, node) {
                            _.dom.toggleClass(node, 'active', false);
                        });
                        // console.log(select, _.arr.has(['left', 'right', 'none'], select));
                        if (_.arr.has(['left', 'right', 'none'], select) === false) {
                            select = 'none';
                        }
                        _.dom.toggleClass(query('.se-imagestatus .se-imgfloat[data-float=' + select + ']', this.statebar)[0], 'active', true);
                        if (!this.selectedImage.border) {
                            _.dom.setAttr(this.selectedImage, '_selected', '_selected');
                        }
                    } else {
                        query('.se-imagestatus', this.statebar)[0].style.display = 'none';
                    }
                }
            }
        };
    cache.save({
        format: checkFormat,
        status: checkStatus
    }, 'EDITOR_CHECKS');
});