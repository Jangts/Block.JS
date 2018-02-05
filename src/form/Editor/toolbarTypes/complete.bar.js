/*!
 * Block.JS Framework Source Code
 *
 * forms Editor toolbarTypes complete
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/form/Editor/commands/base.cmds',
    '$_/form/Editor/commands/font.cmds',
    '$_/form/Editor/commands/header.cmds',
    '$_/form/Editor/commands/insertanchor.cmd',
    '$_/form/Editor/commands/createlink.cmd',
    '$_/form/Editor/commands/inserttable.cmd',
    '$_/form/Editor/commands/insertfile.cmd',
    '$_/form/Editor/commands/insertimage.cmd',
    '$_/form/Editor/commands/insertvideo.cmd',
    '$_/form/Editor/commands/insertemoticon.cmd',
    '$_/form/Editor/commands/source.cmd',
    '$_/form/Editor/commands/insertfragments.cmd'
], function(pandora, global, undefined) {
    pandora.form.Editor.regToolbarType('complete', [
        /** group zero **********************************/
        'undo', 'redo',
        /** group one **********************************/
        '|', 'selectall', 'copy', 'paste', 'cut', 'delete', 'cleardoc', 'print',
        /** group two **********************************/
        '|', 'bold', 'italic', 'underline', 'strikethrough',
        /** group three **********************************/
        '|', 'header', 'p', 'blockquote', 'removeformat',
        /** group four **********************************/
        '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull',
        /** group five **********************************/
        '|', 'indent', 'outdent',
        /** group six **********************************/
        '|', 'insertunorderedlist', 'insertorderedlist', /* '|', 'fullscreen',*/
        /** group seven **********************************/
        '/', 'fontname', 'fontsize', 'forecolor', 'backcolor', 'lineheight', 'touppercase', 'tolowercase',
        /** group eight **********************************/
        '|', 'subscript', 'superscript', 'inserttime', 'insertdate',
        /** group nine **********************************/
        '|', 'hr', 'pagebreak', '|', 'insertanchor', 'createlink', 'unlink', 'inserttable', '|', 'insertfile', 'insertvideo', 'insertimage', 'insertemoticon',
        /** group ten **********************************/
        '|', 'source', 'insertfragments'
    ]);
});