/*!
 * Block.JS Framework Source Code
 *
 * forms Editor toolbarTypes normal
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
    pandora.form.Editor.regToolbarType('normal', [
        'undo', 'redo',
        '|', 'bold', 'italic', 'underline',
        '|', 'fontname', 'fontsize', 'forecolor', 'backcolor',
        '|', 'h1', 'hr', 'blockquote', 'removeformat',
        '|', 'insertfile', 'pagebreak', 'createlink', 'unlink', 'inserttable', 'insertvideo', 'insertimage',
        '|', 'justifyleft', 'justifycenter', 'justifyright',
        '|', 'source' /* '|', 'fullscreen',*/
    ]);
});