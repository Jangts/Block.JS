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
    '$_/form/Editor/'
], function(pandora, global, undefined) {
    var _ = pandora,
        console = global.console;

    _.form.Editor.regCommand('createlink', function(val) {
        if (val && _.util.bool.isUrl(val.url)) {
            var url = 'http://temp.';
            url += new _.Identifier();
            url += '.com';
            if (this.selection.getRange().type === 'Caret') {
                this.execCommand('insert', val.url);
            }
            this.selection.getRange().execCommand('createlink', url);
            var a = _.query('a[href="' + url + '"]')[0];
            if (a) {
                a.href = val.url;
                a.href = val.url;
                if (val.isNew) {
                    a.target = '_blank';
                }
            }
            this.selection.saveRange();
            this.onchange();
        }
        return this;
    });

    _.form.Editor.regCreater('createlink', function() {
        var html = '<dialog class="bc editor-dialog">';
        html += '<span class="bc editor-title">Insert link</span>';
        html += '<div class="bc editor-url">';
        html += '<label>Enter URL</label><input type="text" class="bc editor-input createlink" placeholder="http://www.yangram.com/blockjs/" />';
        html += '</div>';
        html += '<div class="bc editor-check">';
        html += '<input type="checkbox" class="bc editor-checkbox" checked="checked"> <label>Open in new tab</label>';
        html += '</div>';
        html += '<div class="bc editor-btns">';
        html += '<button type="button" data-ib-cmd="createlink">OK</button>';
        html += '</div>';
        html += '</dialog>';
        return html;
    });

    _.form.Editor.regDialog('createlink', function(btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var input = _.query('.bc.editor-url .bc.editor-input', dialog)[0];
        var checkbox = _.query('.bc.editor-check .bc.editor-checkbox', dialog)[0]
        if (input && input.value != '') {
            return {
                url: input.value,
                isNew: checkbox && checkbox.checked
            }
        }
        return null;
    });

    _.form.Editor.extends({
        createLink: function(val) {
            return this.execCommand('insertlink', val);
        }
    });
});