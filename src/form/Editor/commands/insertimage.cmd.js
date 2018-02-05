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
    '$_/painter/canvas.xtd',
    '$_/form/Editor/commands/insert.cmds'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    _.form.Editor.regCommand('insertimage', function(val) {
        if (_.util.bool.isStr(val)) {
            var html = '<img src="' + val + '" />';
            this.execCommand('insert', html);
            this.collapse();
            return this;
        }
        if (_.util.bool.isArr(val)) {
            var html = '';
            for (var i = 0; i < val.length; i++) {
                html += '<img src="' + val[i] + '" />';
            }
            this.execCommand('insert', html);
            this.collapse();
        }
        return this;
    });

    _.form.Editor.regCreater('insertimage', function() {
        var html = '<dialog class="bc editor-dialog">';
        html += '<span class="bc editor-title">Insert Pictures</span>';
        html += '<div class="bc editor-url">';
        html += '<label>Enter URL</label><input type="text" class="bc editor-input" placeholder="Image URL" />';
        html += '</div>';
        html += '<input type="file" class="bc editor-files" value="" hidden="" multiple />';
        html += '<div class="bc editor-show"><span>click to upload</span></div>';
        html += '<div class="bc editor-btns">';
        html += '<input type="button" data-ib-cmd="insertimage" value="Insert Web Picture"/>';
        html += '<input type="button" data-ib-cmd="uploadimage" value="Upload And Insert"/>';
        html += '</div>';
        html += '</dialog>';
        return html;
    });

    _.form.Editor.regDialog('insertimage', function(btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var input = _.query('.bc.editor-url .bc.editor-input', dialog)[0];
        if (input && input.value) {
            return [input.value];
        }
        return null;
    });

    _.form.Editor.regDialog('uploadimage', function(btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var images = _.query('.bc.editor-show', dialog)[0];
        var files = images.files;
        if (files && files.length > 0) {
            var that = this;
            if (_.util.bool.isFn(this.transfer)) {
                this.transfer(files, function(val, failed) {
                    if (failed) {
                        alert(failed + 'pictures upload failed');
                    }
                    that.execCommand('insertimage', val);
                    _.dom.toggleClass(that.loadmask, 'on', false);
                });
                _.dom.toggleClass(this.loadmask, 'on', true);
            } else {
                var url;
                _.each(files, function(i, file) {
                    _.painter.canvas.fileToBase64(file, function(url) {
                        that.execCommand('insertimage', url);
                    });
                });
            }
            images.files = undefined;
        }
    });

    _.form.Editor.extends({
        insertImage: function(val) {
            return this.execCommand('insertimage', val);
        }
    });
});