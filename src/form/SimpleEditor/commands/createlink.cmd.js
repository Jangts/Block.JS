/*!
 * tangram.js framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/util/bool.xtd',
    '$_/dom/',
    '$_/form/SimpleEditor/'
], function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker,
        console = global.console,

        regMethod = cache.read(new _.Identifier('EDITOR_REG_M').toString()),
        regCommand = cache.read(new _.Identifier('EDITOR_REG_CMD').toString()),
        regCreater = cache.read(new _.Identifier('EDITOR_REG_C').toString()),
        regDialog = cache.read(new _.Identifier('EDITOR_REG_D').toString());

    regMethod('createLink', function(val) {
        return this.execCommand('createlink', val);
    });

    regCommand('createlink', function(val) {
        if (val && _.util.bool.isUrl(val.url)) {
            var url = 'http://temp.';
            url += new _.Identifier();
            url += '.com';
            if (this.selection.getRange().type === 'Caret') {
                this.execCommand('insert', val.url);
            }
            this.selection.getRange().execCommand('createlink', url);
            this.selection.collapseRange();
            var a = _.query('a[href="' + url + '"]');
            _.each(a, function() {
                this.href = val.url;
                if (val.isNew) {
                    this.target = '_blank';
                }
            });
            this.selection.restoreSelection();
            this.onchange();
        }
        return this;
    });

    regCreater('createlink', function() {
        var html = '<dialog class="tangram se-dialog">';
        html += '<span class="tangram se-title">Insert link</span>';
        html += '<div class="tangram se-url">';
        html += '<label><i>Enter URL</i><input type="text" class="tangram se-input createlink" placeholder="http://www.yangram.com/tangram.js/" /></label>';
        html += '</div>';
        html += '<div class="tangram se-check">';
        html += '<label><input type="checkbox" class="tangram se-checkbox" checked="checked">Open in new tab</label>';
        html += '</div>';
        html += '<div class="tangram se-btns">';
        html += '<button type="button" data-se-cmd="createlink">OK</button>';
        html += '</div>';
        html += '</dialog>';
        return html;
    });

    regDialog('createlink', function(btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var input = _.query('.tangram.se-url .tangram.se-input', dialog)[0];
        var checkbox = _.query('.tangram.se-check .tangram.se-checkbox', dialog)[0]
        if (input && input.value != '') {
            return {
                url: input.value,
                isNew: checkbox && checkbox.checked
            }
        }
        return null;
    });
});