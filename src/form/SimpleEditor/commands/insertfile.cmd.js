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
    '$_/form/SimpleEditor/commands/insert.cmds'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var parameters = cache.read(new _.Identifier('EDITOR_PARAMS').toString()),
        regMethod = cache.read(new _.Identifier('EDITOR_REG_M').toString()),
        regCommand = cache.read(new _.Identifier('EDITOR_REG_CMD').toString()),
        regCreater = cache.read(new _.Identifier('EDITOR_REG_C').toString()),
        regDialog = cache.read(new _.Identifier('EDITOR_REG_D').toString());

    regMethod('insertFile', function(val, name) {
        return this.execCommand('insertfile', [name, val]);
    });

    regCommand('insertfile', function(file) {
        var name = file[0],
            val = file[1];
        if (_.util.bool.isStr(val)) {
            name = name || this.options.aaa;
            if (_.util.bool.isStr(name)) {
                var html = '<a href="' + val + '" target="_blank" title="click to download" class="tangram se-attachment">' + name + '</a><br />';
            } else {
                var html = 'Attachment : <a href="' + val + '" target="_blank" title="click to download" class="tangram se-attachment">' + val + '</a><br />';
            }
            this.execCommand('insert', html);
            this.collapse();
            return this;
        }
        return this;
    });

    regCreater('insertfile', function() {
        var html = '<dialog class="tangram se-dialog">';
        html += '<span class="tangram se-title">Insert Files</span>';
        html += '<div class="tangram se-aaa">';
        html += '<label><i>Alias</i><input type="text" class="tangram se-input" placeholder="Enter Attachment Anchor Alias" /></label>';
        html += '</div>';
        html += '<div class="tangram se-url">';
        html += '<label><i>File URL</i><input type="text" class="tangram se-input" placeholder="Enter URL" /></label>';
        html += '</div>';
        html += '<input type="file" class="tangram se-files" value="" hidden="" />';
        html += '<div class="tangram se-btns">';
        html += '<input type="button" data-se-cmd="insertfile" value="Insert Url"/>';
        html += '<input type="button" data-se-cmd="uploadfile" value="Or Upload"/>';
        html += '</div>';
        html += '</dialog>';
        return html;
    });

    regDialog('insertfile', function(btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var n_input = _.query('.tangram.se-aaa .tangram.se-input', dialog)[0],
            v_input = _.query('.tangram.se-url .tangram.se-input', dialog)[0];
        if (v_input && v_input.value) {
            return [n_input && n_input.value, v_input.value];
        }
        return null;
    });

    regDialog('uploadfile', function(btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var input = _.query('.tangram.se-files', dialog)[0];
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
                        var n_input = _.query('.tangram.se-aaa .tangram.se-input', dialog)[0];
                        if (n_input && n_input.value) {
                            that.insertFile(val[0], n_input.value);
                        } else {
                            that.insertFile(val[0], file.name);
                        }

                    }
                    _.each(that.loadmasks, function(i, loadmask) {
                        _.dom.toggleClass(loadmask, 'on', true);
                    });
                });
                _.each(that.loadmasks, function(i, loadmask) {
                    _.dom.toggleClass(loadmask, 'on', true);
                });
            } else {
                alert('No Upload Configuration');
            }
        }
        input.click();
    });
});