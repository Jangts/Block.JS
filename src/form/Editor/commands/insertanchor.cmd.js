/*!
 * Block.JS Framework Source Code
 *
 * class forms/Editor
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/util/bool.xtd',
    '$_/dom/',
    '$_/form/Editor/commands/insert.cmds'
], function(pandora, global, undefined) {
    var _ = pandora,
        console = global.console;

    _.form.Editor.regCommand('insertanchor', function(val) {
        if (_.util.bool.isStr(val) && val != '') {
            var html = '<a name="' + val + '"></a>';
            this.execCommand('insert', html);
            this.collapse();
        }
        return this;
    });

    _.form.Editor.regCreater('insertanchor', function() {
        var html = '<dialog class="bc editor-dialog">';
        var html = '<dialog class="bc editor-dialog">';
        html += '<span class="bc editor-title">Insert Anchor</span>';
        html += '<div class="bc editor-anchor">';
        html += '<input type="text" class="bc editor-input" placeholder="Anchor Name" />';
        html += '<button type="button" data-ib-cmd="insertanchor">OK</button>';
        html += '</div>';
        html += '</dialog>';
        html += '</dialog>';
        return html;
    });

    _.form.Editor.regDialog('insertanchor', function(btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var input = _.query('.bc.editor-anchor .bc.editor-input', dialog)[0];
        if (input && input.value) {
            return input.value;
        }
        return null;
    });

    _.form.Editor.extends({
        insertAnchor: function(val) {
            return this.execCommand('insertanchor', val);
        }
    });
});