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
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var parameters = cache.read(new _.Identifier('EDITOR_PARAMS').toString());

    _.form.Editor.regCommand('insertfile', function(file) {
        var name = file[0],
            val = file[1];
        if (_.util.bool.isStr(val)) {
            name = name || this.options.aaa;
            if (_.util.bool.isStr(name)) {
                var html = '<a href="' + val + '" target="_blank" title="click to download" class="bc editor-attachment">' + name + '</a><br />';
            } else {
                var html = 'Attachment : <a href="' + val + '" target="_blank" title="click to download" class="bc editor-attachment">' + val + '</a><br />';
            }
            this.execCommand('insert', html);
            this.collapse();
            return this;
        }
        return this;
    });

    _.form.Editor.regCreater('insertfile', function() {
        var html = '<dialog class="bc editor-dialog">';
        html += '<span class="bc editor-title">Insert Files</span>';
        html += '<div class="bc editor-aaa">';
        html += '<label>Alias</label><input type="text" class="bc editor-input" placeholder="Enter Attachment Anchor Alias" />';
        html += '</div>';
        html += '<div class="bc editor-url">';
        html += '<label>File URL</label><input type="text" class="bc editor-input" placeholder="Enter URL" />';
        html += '</div>';
        html += '<input type="file" class="bc editor-files" value="" hidden="" />';
        html += '<div class="bc editor-btns">';
        html += '<input type="button" data-ib-cmd="insertfile" value="Insert Url"/>';
        html += '<input type="button" data-ib-cmd="uploadfile" value="Or Upload"/>';
        html += '</div>';
        html += '</dialog>';
        return html;
    });

    _.form.Editor.regDialog('insertfile', function(btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var n_input = _.query('.bc.editor-aaa .bc.editor-input', dialog)[0],
            v_input = _.query('.bc.editor-url .bc.editor-input', dialog)[0];
        if (v_input && v_input.value) {
            return [n_input && n_input.value, v_input.value];
        }
        return null;
    });

    _.form.Editor.regDialog('uploadfile', function(btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var input = _.query('.bc.editor-files', dialog)[0];
        var that = this;
        input.onchange = function() {
            var file = this.files[0];
            if (that.attachment_type) {
                var preg = new RegExp('\.(' + that.attachment_type.join('|') + ')$', i);
                if (!preg.test(file)) {
                    return alert('Unsupported File Format');
                }
            }
            if (that.upload_maxsize) {
                if (file.size > that.upload_maxsize) {
                    return alert('Exceed Maximum Size Allowed Upload');
                }
            }
            if (_.util.bool.isFn(that.transfer)) {
                that.transfer([file], function(val, failed) {
                    if (failed) {
                        alert('attachment upload failed');
                    } else {
                        var n_input = _.query('.bc.editor-aaa .bc.editor-input', dialog)[0];
                        if (n_input && n_input.value) {
                            that.insertFile(val[0], n_input.value);
                        } else {
                            that.insertFile(val[0], file.name);
                        }

                    }
                    _.dom.toggleClass(that.loadmask, 'on', false);
                });
                _.dom.toggleClass(this.loadmask, 'on', true);
            } else {
                alert('No Upload Configuration');
            }
        }
        input.click();
    });

    _.form.Editor.extends({
        insertFile: function(val, name) {
            return this.execCommand('insertfile', [name, val]);
        }
    });
});