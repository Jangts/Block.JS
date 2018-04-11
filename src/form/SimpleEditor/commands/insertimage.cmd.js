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
    '$_/painter/canvas.xtd',
    '$_/form/SimpleEditor/commands/insert.cmds'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console,

        regMethod = cache.read(new _.Identifier('EDITOR_REG_M').toString()),
        regCommand = cache.read(new _.Identifier('EDITOR_REG_CMD').toString()),
        regCreater = cache.read(new _.Identifier('EDITOR_REG_C').toString()),
        regDialog = cache.read(new _.Identifier('EDITOR_REG_D').toString());

    regMethod('insertImage', function(val) {
        return this.execCommand('insertimage', val);
    });

    regCommand('insertimage', function(val) {
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

    regCreater('insertimage', function() {
        var html = '<dialog class="se-dialog">';
        // html += '<span class="se-title">Insert Pictures</span>';
        html += '<div class="se-url">';
        html += '<label><i>Enter URL</i><input type="text" class="se-input" placeholder="Image URL" /></label>';
        html += '</div>';
        html += '<input type="file" class="se-files" value="" hidden="" multiple />';
        html += '<div class="se-show"><span>click to upload</span></div>';
        html += '<div class="se-btns">';
        html += '<input type="button" class="data-se-cmd" data-se-cmd="insertimage" value="Insert Web Picture"/>';
        html += '<input type="button" class="data-se-cmd" data-se-cmd="uploadimage" value="Upload And Insert"/>';
        html += '</div>';
        html += '</dialog>';
        return html;
    });

    regDialog('insertimage', function(btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var input = _.query('.se-url .se-input', dialog)[0];
        if (input && input.value) {
            return [input.value];
        }
        return null;
    });

    regDialog('uploadimage', function(btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var images = _.query('.se-show', dialog)[0];
        var files = images.files;
        if (files && files.length > 0) {
            var that = this;
            if (_.util.bool.isFn(this.transfer)) {
                this.transfer(files, function(val, failed) {
                    if (failed) {
                        alert(failed + 'pictures upload failed');
                    }
                    that.execCommand('insertimage', val);
                    _.each(that.loadmasks, function(i, loadmask) {
                        _.dom.toggleClass(loadmask, 'on', false);
                    });
                });
                _.each(that.loadmasks, function(i, loadmask) {
                    _.dom.toggleClass(loadmask, 'on', true);
                });
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
});