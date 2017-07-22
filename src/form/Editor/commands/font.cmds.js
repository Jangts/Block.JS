/*!
 * Block.JS Framework Source Code
 *
 * commands forms/Editor
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/dom/',
    '$_/form/Editor/',
], function(pandora, global, undefined) {
    var _ = pandora,
        console = global.console;

    var defaults = {
            colorTable: [
                ['#000000', '#444444', '#666666', '#999999', '#CCCCCC', '#EEEEEE', '#F3F3F3', '#FFFFFF'],
                [],
                ['#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9900FF', '#FF00FF'],
                [],
                ['#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#CFE2F3', '#D9D2E9', '#EAD1DC'],
                ['#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#9FC5E8', '#B4A7D6', '#D5A6BD'],
                ['#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6FA8DC', '#8E7CC3', '#C27BA0'],
                ['#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3D85C6', '#674EA7', '#A64D79'],
                ['#990000', '#B45F06', '#BF9000', '#38771D', '#134F5C', '#0B5394', '#351C75', '#741B47'],
                ['#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#073763', '#201211', '#4C1130'],
            ],
            fontSizeTable: ['9px', '10px', '12px', '14px', '16px', '18px', '21px', '24px', '30px', '36px', '48px', '72px'],
            fontNameTable: ["'Microsoft YaHei', 'Hiragino Sans'", "Arial, Helvetica", "Courier, 'Courier New'", 'Georgia', "'Times New Roman', Times", "'Trebuchet MS'", "Verdana, Geneva"],
        },
        currentElem = function(range) {
            if (range.commonElem === range.commonNode) {
                if (range.startNode === range.commonNode) {
                    if (_.dom.contain(this.richarea, range.commonElem)) {
                        return range.commonElem;
                    }
                }
            }
            console.log(range.commonElem, range.commonNode, range.startNode);
        },
        commands = {
            'fontname': function(val) {
                // var id = new _.Identifier(),
                //     selection = this.selection,
                //     range = selection.getRange(),
                //     elem = currentElem(range);

                // console.log(elem);
                // selection.getRange().execCommand('fontname', id);
                // _.each(_.query('font[face=' + id + ']', this.richarea), function() {
                //     _.dom.removeAttr(this, 'face');
                //     _.dom.setStyle(this, 'font-family', val);
                //     //selection.saveRange(range);
                //     selection.createRangeByElem(elem || this);
                // });
                // this.onchange();

                this.selection.getRange().execCommand('fontname', val);
                this.selection.saveRange();
                this.onchange();
            },
            'fontsize': function(val) {
                // var id = new _.Identifier(),
                //     selection = this.selection,
                //     range = selection.getRange(),
                //     elem = currentElem(range),
                //     fontname = _.dom.getStyle(selection.getRange().commonElem, 'font-family');
                // selection.getRange().execCommand('fontname', id);
                // _.each(_.query('font[face=' + id + ']', this.richarea), function() {
                //     _.dom.removeAttr(this, 'face');
                //     _.dom.setStyle(this, 'font-family', fontname);
                //     _.dom.setStyle(this, 'font-size', val);
                //     //selection.saveRange(range);
                //     selection.createRangeByElem(elem || this);
                // });
                // this.onchange();
                this.selection.getRange().execCommand('fontsize', val);
                this.selection.saveRange();
                this.onchange();
            },
            'forecolor': function(val) {
                // var id = new _.Identifier(),
                //     selection = this.selection,
                //     range = selection.getRange(),
                //     elem = currentElem(range),
                //     fontname = _.dom.getStyle(selection.getRange().commonElem, 'font-family');
                // selection.getRange().execCommand('fontname', id);
                // _.each(_.query('font[face=' + id + ']', this.richarea), function() {
                //     _.dom.removeAttr(this, 'face');
                //     _.dom.setStyle(this, 'font-family', fontname);
                //     _.dom.setStyle(this, 'color', val);
                //     //selection.saveRange(range);
                //     selection.createRangeByElem(elem || this);
                // });
                // this.onchange();

                this.selection.getRange().execCommand('forecolor', val);
                this.selection.saveRange();
                this.onchange();
            },
            'backcolor': function(val) {
                // var id = new _.Identifier(),
                //     selection = this.selection,
                //     range = selection.getRange(),
                //     elem = currentElem(range),
                //     fontname = _.dom.getStyle(selection.getRange().commonElem, 'font-family');
                // selection.getRange().execCommand('fontname', id);
                // _.each(_.query('font[face=' + id + ']', this.richarea), function() {
                //     _.dom.removeAttr(this, 'face');
                //     _.dom.setStyle(this, 'font-family', fontname);
                //     _.dom.setStyle(this, 'background-color', val);
                //     //selection.saveRange(range);
                //     selection.createRangeByElem(elem || this);
                // });
                // this.onchange();

                this.selection.getRange().execCommand('backcolor', val);
                this.selection.saveRange();
                this.onchange();
            },
            'lineheight': function(val) {
                _.dom.setStyle(selection.getRange().commonElem, 'line-height', val);
                this.selection.saveRange();
                this.onchange();
            },
            'touppercase': function() {
                this.selection.getRange().changeCase(false);
                this.onchange();
            },
            'tolowercase': function() {
                this.selection.getRange().changeCase(true);
                this.onchange();
            }
        },

        creators = {
            'fontname': function() {
                var html = '<ul class="bc editor-pick">';
                var fontNameTable = this.options.fontNameTable || defaults.fontNameTable;
                for (var i = 0; i < fontNameTable.length; i++) {
                    html += '<li class="bc editor-font" data-ib-cmd="fontname" data-ib-val="' + fontNameTable[i] + '"><font style="font-family: ' + fontNameTable[i] + ';" title="' + fontNameTable[i] + '">' + fontNameTable[i].replace(/('|")/g, '') + '</font></li>';
                }
                html += '</ul>';
                return html;
            },
            'fontsize': function() {
                var html = '<ul class="bc editor-pick">';
                var fontSizeTable = this.options.fontSizeTable || defaults.fontSizeTable;
                for (var i = 0; i < fontSizeTable.length; i++) {
                    var height = parseInt(fontSizeTable[i]) + 15;
                    height = height > 24 ? height : 24;
                    html += '<li class="bc editor-font" data-ib-cmd="fontsize" data-ib-val="' + fontSizeTable[i] + '" style="height: ' + height + 'px; line-height: ' + height + 'px;"><font style="font-size: ' + fontSizeTable[i] + ';" title="' + fontSizeTable[i] + '">' + fontSizeTable[i] + '</font></li>';
                }
                html += '</ul>';
                return html;
            },
            'forecolor': function() {
                var html = '<ul class="bc editor-pick">';
                var colorTable = this.options.colorTable || defaults.colorTable;
                for (var n = 0; n < colorTable.length; n++) {
                    var colorTableRow = colorTable[n];
                    if (n > 0) {
                        html += '<hr class="bc editor-break">';
                    }
                    for (var i = 0; i < colorTableRow.length; i++) {
                        html += '<li class="bc editor-color" data-ib-cmd="forecolor" data-ib-val="' + colorTableRow[i] + '"><i style="background-color: ' + colorTableRow[i] + ';" title="' + colorTableRow[i] + '"></i></li>';
                    }
                }
                html += '</ul>';
                return html;
            },
            'backcolor': function() {
                var html = '<ul class="bc editor-pick">';
                var colorTable = this.options.colorTable || defaults.colorTable;
                for (var n = 0; n < colorTable.length; n++) {
                    var colorTableRow = colorTable[n];
                    if (n > 0) {
                        html += '<hr class="bc editor-break">';
                    }
                    for (var i = 0; i < colorTableRow.length; i++) {
                        html += '<li class="bc editor-color" data-ib-cmd="backcolor" data-ib-val="' + colorTableRow[i] + '"><i style="background-color: ' + colorTableRow[i] + ';"></i></li>';
                    }
                }
                html += '</ul>';
                return html;
            }
        };

    _.each(commands, function(cmd, handler) {
        _.form.Editor.regCommand(cmd, handler);
    });

    _.each(creators, function(cmd, handler) {
        _.form.Editor.regCreater(cmd, handler, true);
    });
});