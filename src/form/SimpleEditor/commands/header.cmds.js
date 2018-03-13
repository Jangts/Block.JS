/*!
 * tangram.js framework source code
 *
 * commands forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/form/SimpleEditor/',
], function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker,
        console = global.console,

        regCommand = cache.read(new _.Identifier('EDITOR_REG_CMD').toString()),
        regCreater = cache.read(new _.Identifier('EDITOR_REG_C').toString()),

        commands = {
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
        regCommand(cmd, handler);
    });

    regCreater('header', function() {
        var html = '<ul class="tangram se-pick">';
        for (var i = 1; i < 7; i++) {
            html += '<li class="tangram se-h' + i + '" data-ib-cmd="header" data-ib-val="h' + i + '"><h' + i + '>Header ' + i + '</h' + i + '></li>';
        }
        html += '</ul>';
        return html;
    }, true);
});