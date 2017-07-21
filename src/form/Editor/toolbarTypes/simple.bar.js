/*!
 * Block.JS Framework Source Code
 *
 * forms Editor toolbarTypes simple
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/form/Editor/commands/base.cmds',
    '$_/form/Editor/commands/font.cmds',
    '$_/form/Editor/commands/header.cmds',
    '$_/form/Editor/commands/insertimage.cmd',
    '$_/form/Editor/commands/insertvideo.cmd'
], function(pandora, global, undefined) {
    pandora.form.Editor.regToolbarType('simple', ['bold', 'italic', 'insertunorderedlist', 'insertorderedlist', 'blockquote', 'insertimage', 'insertvideo' /* 'fullscreen',*/ ]);
});