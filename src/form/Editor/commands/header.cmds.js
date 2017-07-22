/*!
 * Block.JS Framework Source Code
 *
 * commands forms/Editor
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/form/Editor/',
], function(pandora, global, undefined) {
    var _ = pandora,
        console = global.console;

    var commands = {
        header: function(val) {
            this.selection.getRange().execCommand('formatblock', '<' + val + '>');
        },
        h1: function(val) {
            this.selection.getRange().execCommand('formatblock', '<h1>');
        },
        h2: function(val) {
            this.selection.getRange().execCommand('formatblock', '<h2>');
        },
        h3: function(val) {
            this.selection.getRange().execCommand('formatblock', '<h3>');
        },
        h4: function(val) {
            this.selection.getRange().execCommand('formatblock', '<h4>');
        },
        h5: function(val) {
            this.selection.getRange().execCommand('formatblock', '<h5>');
        },
        h6: function(val) {
            this.selection.getRange().execCommand('formatblock', '<h6>');
        }
    };


    _.each(commands, function(cmd, handler) {
        _.form.Editor.regCommand(cmd, handler);
    });

    _.form.Editor.regCreater('header', function() {
        var html = '<ul class="bc editor-pick">';
        for (var i = 1; i < 7; i++) {
            html += '<li class="bc editor-h' + i + '" data-ib-cmd="header" data-ib-val="h' + i + '"><h' + i + '>Header</h' + i + '></li>';
        }
        html += '</ul>';
        return html;
    }, true);
});