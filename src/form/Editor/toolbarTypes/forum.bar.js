/*!
 * Block.JS Framework Source Code
 *
 * forms Editor toolbarTypes forum
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/form/Editor/commands/base.cmds',
    '$_/form/Editor/commands/font.cmds',
    '$_/form/Editor/commands/header.cmds',
    '$_/form/Editor/commands/insertemoticon.cmd',
    '$_/form/Editor/commands/insertvideo.cmd',
    '$_/form/Editor/commands/insertimage.cmd'
], function(pandora, global, undefined) {
    pandora.form.Editor.regToolbarType('forum', ['bold', 'italic', 'h3', 'blockquote', 'insertemt', 'insertvideo', 'insertimage']);
});