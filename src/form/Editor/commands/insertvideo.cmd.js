/*!
 * Block.JS Framework Source Code
 *
 * class forms/Editor
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/dom/',
    '$_/form/Editor/commands/insert.cmds'
], function(pandora, global, undefined) {
    var _ = pandora,
        console = global.console;

    var videoHTML = {
        'swf': function(src, width, height) {
            var html = '<embed src="' + src + '"';
            html += ' allowFullScreen="true" quality="high"';
            if (width) {
                html += ' width="' + width + '"';
            };
            if (height) {
                html += ' height="' + height + '"';
            };
            html += ' align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>';
            return html;
        },
        'webm': function(src, width, height) {
            var html = '<video src="' + src + '" controls="controls"';
            if (width) {
                html += ' width="' + width + '"';
            };
            if (height) {
                html += ' height="' + height + '"';
            };
            html += '>您的浏览器不支持 video 标签。</video>';
            return html;
        },
        'mp4': function(src, width, height) {
            var html = '<video src="' + src + '" controls="controls"';
            if (width) {
                html += ' width="' + width + '"';
            };
            if (height) {
                html += ' height="' + height + '"';
            };
            html += '>您的浏览器不支持 video 标签。</video>';
            return html;
        },
        'ogg': function(src, width, height) {
            var html = '<video src="' + src + '" controls="controls"';
            if (width) {
                html += ' width="' + width + '"';
            };
            if (height) {
                html += ' height="' + height + '"';
            };
            html += '>您的浏览器不支持 video 标签。</video>';
            return html;
        }
    };

    _.form.Editor.regCommand('insertvideo', function(val) {
        if (val) {
            if (val.code && val.code != '') {
                this.execCommand('insert', val.code);
                this.collapse();
                return this;
            }
            if (val.url) {
                var html = videoHTML[val.type || 'swf'](val.url, val.width, val.height);
                this.execCommand('insert', html);
                this.collapse();
            }
        }
        return this;
    });

    _.form.Editor.regCreater('insertvideo', function() {
        var html = '<dialog class="bc editor-dialog">';
        html += '<span class="bc editor-title">Insert Video</span>';
        html += '<textarea class="bc editor-code" placeholder="Embedded code"></textarea>';
        html += '<div class="bc editor-url">';
        html += '<label>Enter URL</label><input type="text" class="bc editor-input" placeholder="Video URL" />';
        html += '</div>';
        html += '<div class="bc editor-attr"><div class="bc editor-attr-left">';
        html += '<label>Size</label><input type="text" class="bc editor-vidoe-width" placeholder="640">';
        html += '<span>×</span><input type="text" class="bc editor-vidoe-height" placeholder="480">';
        html += '</div><div class="bc editor-attr-right">';
        html += '<label>Type</label><select class="bc editor-vidoe-type">';
        html += '<option value="swf" selected="selected">swf</option>';
        html += '<option value="webm">webm</option>';
        html += '<option value="mp4">mp4</option>';
        html += '<option value="ogg">ogg</option>';
        html += '</select></div></div>';
        html += '<div class="bc editor-btns">';
        html += '<button type="button" data-ib-cmd="insertvideo">OK</button>';
        html += '</div>';
        html += '</dialog>';
        return html;
    });

    _.form.Editor.regDialog('insertvideo', function(btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var textarea = _.query('.bc.editor-code', dialog)[0];
        if (textarea && textarea.value != '') {
            return {
                code: textarea.value
            }
        }
        var input = _.query('.bc.editor-url .bc.editor-input', dialog)[0];
        var widthInput = _.query('.bc.editor-attr .bc.editor-vidoe-width', dialog)[0];
        var heightInput = _.query('.bc.editor-attr .bc.editor-vidoe-height', dialog)[0];
        var typeInput = _.query('.bc.editor-attr .bc.editor-vidoe-type', dialog)[0];
        if (input && input.value != '') {
            return {
                url: input.value,
                type: typeInput.value,
                width: widthInput.value == '' ? null : widthInput.value,
                height: heightInput.value == '' ? null : heightInput.value
            };
        }
        return null;
    });

    _.form.Editor.extends({
        insertVideo: function(val) {
            return this.execCommand('insertvideo', val);
        }
    });
});