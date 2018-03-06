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
    '$_/form/Range.cls',
    '$_/form/SimpleEditor/'
], function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker,
        console = global.console;

    var presets = [
            'bold', 'italic', 'insertorderedlist', 'insertunorderedlist',
            'justifycenter', 'justifyfull', 'justifyleft', 'justifyright',
            'removeformat', 'strikethrough', 'underline', 'unlink'
        ],

        regCommand = cache.read(new _.Identifier('EDITOR_REG_CMD').toString());

    _.each(presets, function(index, cmd) {
        regCommand(cmd, function(val) {
            this.selection.getRange().execCommand(cmd, val);
            this.selection.saveRange();
            this.onchange();
        });
    });
});