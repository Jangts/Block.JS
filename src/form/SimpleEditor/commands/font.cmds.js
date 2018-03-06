/*!
 * Block.JS Framework Source Code
 *
 * commands forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/dom/',
    '$_/form/SimpleEditor/',
], function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker,
        console = global.console,
    
        regCommand = cache.read(new _.Identifier('EDITOR_REG_CMD').toString()),
        regCreater = cache.read(new _.Identifier('EDITOR_REG_C').toString()),
        
        defaults = {
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
            fontSizeTable: {
                '1':'10px',
                '2':'13px',
                '3':'16px',
                '4':'18px',
                '5':'24px',
                '6':'33px',
                '7':'48px'
            },
        },
        currentElem = function(range) {
            if (range.commonElem === range.commonNode) {
                if (range.startNode === range.commonNode) {
                    if (_.dom.contain(this.richarea, range.commonElem)) {
                        return range.commonElem;
                    }
                }
            }
        },
        commands = {
            'fontsize': function(val) {
                this.selection.getRange().execCommand('fontsize', val);
                this.selection.saveRange();
                this.onchange();
            },
            'forecolor': function(val) {
                this.selection.getRange().execCommand('forecolor', val);
                this.selection.saveRange();
                this.onchange();
            },
            'backcolor': function(val) {
                this.selection.getRange().execCommand('backcolor', val);
                this.selection.saveRange();
                this.onchange();
            }
        },

        creators = {
            'fontsize': function() {
                var html = '<ul class="bc se-pick">';
                var fontSizeTable = this.options.fontSizeTable || defaults.fontSizeTable;
                for (var i in fontSizeTable) {
                    var height = parseInt(fontSizeTable[i]) + 12;
                    height = height > 24 ? height : 24;
                    html += '<li class="bc se-font" data-ib-cmd="fontsize" data-ib-val="' + i + '" style="height: ' + height + 'px; line-height: ' + height + 'px;"><font style="font-size: ' + fontSizeTable[i] + ';" title="' + fontSizeTable[i] + '">' + fontSizeTable[i] + '</font></li>';
                }
                html += '</ul>';
                return html;
            },
            'forecolor': function() {
                var html = '<ul class="bc se-pick">';
                var colorTable = this.options.colorTable || defaults.colorTable;
                for (var n = 0; n < colorTable.length; n++) {
                    var colorTableRow = colorTable[n];
                    if (n > 0) {
                        html += '<hr class="bc se-break">';
                    }
                    for (var i = 0; i < colorTableRow.length; i++) {
                        html += '<li class="bc se-color" data-ib-cmd="forecolor" data-ib-val="' + colorTableRow[i] + '"><i style="background-color: ' + colorTableRow[i] + ';" title="' + colorTableRow[i] + '"></i></li>';
                    }
                }
                html += '</ul>';
                return html;
            },
            'backcolor': function() {
                var html = '<ul class="bc se-pick">';
                var colorTable = this.options.colorTable || defaults.colorTable;
                for (var n = 0; n < colorTable.length; n++) {
                    var colorTableRow = colorTable[n];
                    if (n > 0) {
                        html += '<hr class="bc se-break">';
                    }
                    for (var i = 0; i < colorTableRow.length; i++) {
                        html += '<li class="bc se-color" data-ib-cmd="backcolor" data-ib-val="' + colorTableRow[i] + '"><i style="background-color: ' + colorTableRow[i] + ';"></i></li>';
                    }
                }
                html += '</ul>';
                return html;
            }
        };

    _.each(commands, function(cmd, handler) {
        regCommand(cmd, handler);
    });

    _.each(creators, function(cmd, handler) {
        regCreater(cmd, handler, true);
    });
});