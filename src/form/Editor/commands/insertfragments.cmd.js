/*!
 * Block.JS Framework Source Code
 *
 * class forms/Editor
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/util/bool.xtd',
    '$_/dom/',
    '$_/form/Editor/commands/insert.cmds'
], function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker,
        console = global.console;

    var parameters = cache.read(new _.Identifier('EDITOR_PARAMS').toString()),
        codesFragments = [];

    _.form.Editor.regCommand('insertfragments', function(val) {
        if (val && codesFragments[val]) {
            this.execCommand('insert', codesFragments[val]);
        }
        return this;
    });

    _.form.Editor.regCreater('insertfragments', function() {
        var fragments = this.options.fragments || [];
        if (fragments.length) {
            var html = '<ul class="bc editor-pick">';
            _.each(fragments, function(i, fragment) {
                codesFragments.push(fragment.code);
                html += '<li class="bc editor-font" data-ib-cmd="insertfragments" data-ib-val="' + i + '">' + fragment.name + '</li>';
            });
            html += '</ul>';
            return html;
        }
        return '';
    }, true);
});