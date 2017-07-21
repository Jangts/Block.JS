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
    '$_/form/Editor/commands/source.cmd',
    '$_/form/Editor/commands/insertfragments.cmd'
], function(pandora, global, undefined) {
    pandora.form.Editor.regToolbarType('article', [
        'undo', 'redo',
        '|', 'bold', 'italic', 'underline', 'strikethrough',
        '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'indent', 'outdent', 'removeformat', /* '|', 'fullscreen',*/
        '/', 'fontname', 'fontsize', 'forecolor', 'backcolor',
        '|', 'insertunorderedlist', 'insertorderedlist', 'header', 'blockquote', 'createlink', 'unlink', 'inserttable', 'insertvideo', 'insertimage',
        '|', 'source', 'insertfragments'
    ]);
});