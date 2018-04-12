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
    '$_/form/SimpleEditor/commands/insert.cmds'
], function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker,
        console = global.console,
        query = _.dom.sizzle || _.dom.query,

        regMethod = cache.read(new _.Identifier('EDITOR_REG_M').toString()),
        regCommand = cache.read(new _.Identifier('EDITOR_REG_CMD').toString()),
        regCreater = cache.read(new _.Identifier('EDITOR_REG_C').toString()),
        regDialog = cache.read(new _.Identifier('EDITOR_REG_D').toString());

    regMethod('insertTable', function(val) {
        return this.execCommand('inserttable', val);
    });

    regCommand('inserttable', function(val) {
        if (val) {
            var rows = parseInt(val.rows) || 1;
            var columns = parseInt(val.columns) || 1;
            if (val.width && parseInt(val.width)) {
                var html = '<table data-se-temp width="' + parseInt(val.width) + val.unit + '"><tbody>'
            } else {
                var html = '<table data-se-temp><tbody>';
            }
            for (var r = 0; r < rows; r++) {
                html += '<tr>';
                for (var c = 0; c < columns; c++) {
                    html += '<td>&nbsp;</td>';
                }
                html += '</tr>';
            }
            html += '</tbody></table>';
            this.execCommand('insert', html);
            var table = query('table[data-se-temp]')[0];
            _.dom.removeAttr(table, 'data-se-temp');
            window.getSelection && window.getSelection().selectAllChildren(query('td', table)[0]);
            this.selection.saveRange().collapse(true);
            this.onchange();
        }
        return this;
    });

    regCreater('inserttable', function() {
        var html = '<dialog class="se-dialog">';
        // html += '<span class="se-title">Insert Table</span>';
        html += '<div class="se-attr"><div class="se-attr-left">';
        html += '<label><i class="size">Size</i><input type="number" class="se-table-rows" placeholder="1"></label>';
        html += '<span>×</span><input type="number" class="se-table-columns" placeholder="1">';
        html += '</div><div class="se-attr-right">';
        html += '<label><i>Width</i><input type="number" class="se-table-width" placeholder="100"></label>';
        html += '<select class="se-table-unit">';
        html += '<option value="%" selected="selected">%</option>';
        html += '<option value="">px</option>';
        html += '</select></div></div>';
        html += '<div class="se-btns">';
        html += '<button type="button" class="data-se-cmd" data-se-cmd="inserttable">OK</button>';
        html += '</div>';
        html += '</dialog>';
        return html;
    });

    regDialog('inserttable', function(btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var rowsInput = query('.se-attr .se-table-rows', dialog)[0];
        var columnsInput = query('.se-attr .se-table-columns', dialog)[0];
        var widthInput = query('.se-attr .se-table-width', dialog)[0];
        var unitInput = query('.se-attr .se-table-unit', dialog)[0];
        if (rowsInput && columnsInput) {
            return {
                rows: rowsInput.value == '' ? 1 : rowsInput.value,
                columns: columnsInput.value == '' ? 1 : columnsInput.value,
                width: widthInput.value == '' ? null : widthInput.value,
                unit: unitInput.value
            };
        }
        return null;
    });
});