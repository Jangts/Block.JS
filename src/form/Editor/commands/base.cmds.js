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
    '$_/form/Range.cls',
    '$_/form/Editor/'
], function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker,
        console = global.console;

    var presets = [
            'bold', 'copy', 'cut', 'delete',
            'indent', 'italic', 'insertorderedlist', 'insertunorderedlist',
            'justifycenter', 'justifyfull', 'justifyleft', 'justifyright',
            'outdent', 'redo', 'removeformat', 'selectall',
            'strikethrough', 'subscript', 'superscript',
            'underline', 'undo', 'unlink'
        ],
        customs = {
            'paste': function(val) {
                if (global.clipboardData) {
                    this.selection.getRange().execCommand('paste', null);
                    this.selection.saveRange();
                } else {
                    alert('Browser does not support paste, please use Ctrl+V');
                };
            },
            'pasteastext': function(val) {
                if (global.clipboardData) {
                    this.selection.getRange().execCommand('paste', global.clipboardData.getData("text"));
                } else {
                    alert('Browser does not support paste');
                };
            },
            'cleardoc': function(val) {
                this.setValue('');
            },
            'print': function(val) {
                var val = val || this.getValue();
                this.selection.getRange().execCommand('print', val);
                this.selection.saveRange();
            }
        };

    _.each(presets, function(index, cmd) {
        _.form.Editor.regCommand(cmd, function(val) {
            this.selection.getRange().execCommand(cmd, val);
            this.selection.saveRange();
            this.onchange();
        });
    });

    _.each(customs, function(cmd, handler) {
        _.form.Editor.regCommand(cmd, handler);
    });

    _.extend(_.form.Editor, {
        regChecking: function(check, handler) {
            checks[check] = handler;
        }
    });
});