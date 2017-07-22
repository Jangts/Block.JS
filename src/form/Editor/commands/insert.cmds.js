/*!
 * Block.JS Framework Source Code
 *
 * class forms/Editor
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/form/Editor/'
], function(pandora, global, undefined) {
    var _ = pandora,
        isGetSelection = window.getSelection ? true : false,
        document = global.document,
        console = global.console;

    var commands = {
        'insert': function(val) {
            this.selection.getRange().insert(val);
            this.selection.saveRange();
            this.onchange();
            return this;
        },
        'p': function(val) {
            this.selection.getRange().execCommand('formatblock', '<p>');
        },
        'blockquote': function(val) {
            this.selection.getRange().execCommand('formatblock', '<blockquote>');
        },
        'hr': function(val) {
            this.execCommand('insert', '<hr />');
            this.collapse();
            this.execCommand('insert', '<p></p>');
        },
        'pagebreak': function(val) {
            this.execCommand('insert', '<hr style="page-break-after: always;" class="bc editor-pagebreak">');
        },
        'inserttime': function(val) {
            this.execCommand('insert', '<hr style="page-break-after: always;" class="bc editor-pagebreak">');
        },
        'insertdate': function(val) {
            this.execCommand('insert', '<hr style="page-break-after: always;" class="bc editor-pagebreak">');
        }
    };

    _.each(commands, function(cmd, handler) {
        _.form.Editor.regCommand(cmd, handler);
    });

    _.form.Editor.extends({
        insertHTML: function(val) {
            return this.execCommand('insert', val);
        }
    });
});