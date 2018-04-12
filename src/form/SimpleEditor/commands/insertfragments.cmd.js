/*!
 * tangram.js framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
;
tangram.block(['$_/form/SimpleEditor/commands/insert.cmds'], function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker,
        console = global.console;

    var regCommand = cache.read(new _.Identifier('EDITOR_REG_CMD').toString()),
        regCreater = cache.read(new _.Identifier('EDITOR_REG_C').toString()),
        codesFragments = [];

    regCommand('insertfragments', function(val) {
        if (val && codesFragments[val]) {
            this.execCommand('insert', codesFragments[val]);
        }
        return this;
    });

    regCreater('insertfragments', function() {
        var fragments = this.options.fragments || [];
        if (fragments.length) {
            var html = '<ul class="se-pick">';
            _.each(fragments, function(i, fragment) {
                codesFragments.push(fragment.code);
                html += '<li class="se-font data-se-cmd" data-se-cmd="insertfragments" data-se-val="' + i + '">' + fragment.name + '</li>';
            });
            html += '</ul>';
            return html;
        }
        return '';
    }, true);
});