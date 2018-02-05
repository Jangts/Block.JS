/*!
 * Block.JS Framework Source Code
 *
 * forms Editor toolbarTypes article
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/form/Editor/commands/base.cmds',
    '$_/form/Editor/commands/font.cmds',
    '$_/form/Editor/commands/header.cmds',
    '$_/form/Editor/commands/createlink.cmd',
    '$_/form/Editor/commands/inserttable.cmd',
    '$_/form/Editor/commands/insertimage.cmd',
    '$_/form/Editor/commands/insertvideo.cmd',
    '$_/form/Editor/commands/source.cmd'
], function(pandora, global, undefined) {
    var _ = pandora,
        console = global.console;

    _.form.Editor.regToolbarType('default', ['undo', 'redo',
        '|', 'bold', 'italic', 'underline',
        '|', 'insertorderedlist', 'h2', 'blockquote', 'createlink', 'unlink', 'inserttable', 'insertvideo', 'insertimage',
        '|', 'source'
    ]);
});