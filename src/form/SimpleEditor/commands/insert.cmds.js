/*!
 * tangram.js framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
;
tangram.block([], function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker,
        console = global.console,

        regMethod = cache.read(new _.Identifier('EDITOR_REG_M').toString()),
        regCommand = cache.read(new _.Identifier('EDITOR_REG_CMD').toString()),

        commands = {
            'insert': function(val) {
                this.selection.getRange().insert(val);
                this.selection.saveRange();
                this.onchange();
                return this;
            },
            // 'p': function(val) {
            //     this.selection.getRange().execCommand('formatblock', '<p>');
            // },
            'blockquote': function(val) {
                this.selection.getRange().execCommand('formatblock', '<blockquote>');
                this.selection.saveRange();
                this.onchange();
                return this;
            }
        };

    regMethod('insertHTM', function(val) {
        return this.execCommand('insert', val);
    });

    _.each(commands, function(cmd, handler) {
        regCommand(cmd, handler);
    });
});