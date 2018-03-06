/*!
 * Block.JS Framework Source Code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/dom/',
    '$_/form/SimpleEditor/commands/insert.cmds'
], function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker,
        console = global.console,
        
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
                var html = '<table data-ib-temp width="' + parseInt(val.width) + val.unit + '"><tbody>'
            } else {
                var html = '<table data-ib-temp><tbody>';
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
            var table = _.query('table[data-ib-temp]')[0];
            _.dom.removeAttr(table, 'data-ib-temp');
            window.getSelection && window.getSelection().selectAllChildren(_.query('td', table)[0]);
            this.selection.saveRange().collapse(true);
            this.onchange();
        }
        return this;
    });

    regCreater('inserttable', function() {
        var html = '<dialog class="bc se-dialog">';
        html += '<span class="bc se-title">Insert Table</span>';
        html += '<div class="bc se-attr"><div class="bc se-attr-left">';
        html += '<label>Size</label><input type="text" class="bc se-table-rows" placeholder="1">';
        html += '<span>×</span><input type="text" class="bc se-table-columns" placeholder="1">';
        html += '</div><div class="bc se-attr-right">';
        html += '<label>Width</label><input type="text" class="bc se-table-width" placeholder="100">';
        html += '<select class="bc se-table-unit">';
        html += '<option value="%" selected="selected">%</option>';
        html += '<option value="">px</option>';
        html += '</select></div></div>';
        html += '<div class="bc se-btns">';
        html += '<button type="button" data-ib-cmd="inserttable">OK</button>';
        html += '</div>';
        html += '</dialog>';
        return html;
    });

    regDialog('inserttable', function(btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var rowsInput = _.query('.bc.se-attr .bc.se-table-rows', dialog)[0];
        var columnsInput = _.query('.bc.se-attr .bc.se-table-columns', dialog)[0];
        var widthInput = _.query('.bc.se-attr .bc.se-table-width', dialog)[0];
        var unitInput = _.query('.bc.se-attr .bc.se-table-unit', dialog)[0];
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