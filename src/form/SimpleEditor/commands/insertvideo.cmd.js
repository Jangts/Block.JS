/*!
 * tangram.js framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/dom/',
    '$_/form/SimpleEditor/commands/insert.cmds'
], function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker,
        console = global.console,

        regMethod = cache.read(new _.Identifier('EDITOR_REG_M').toString()),
        regCommand = cache.read(new _.Identifier('EDITOR_REG_CMD').toString()),
        regCreater = cache.read(new _.Identifier('EDITOR_REG_C').toString()),
        regDialog = cache.read(new _.Identifier('EDITOR_REG_D').toString());

    regMethod('insertVideo', function(val) {
        return this.execCommand('insertvideo', val);
    });

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

    regCommand('insertvideo', function(val) {
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

    regCreater('insertvideo', function() {
        var html = '<dialog class="tangram se-dialog">';
        html += '<span class="tangram se-title">Insert Video</span>';
        html += '<textarea class="tangram se-code" placeholder="Embedded code"></textarea>';
        html += '<div class="tangram se-url">';
        html += '<label><i>Enter URL</i><input type="text" class="tangram se-input" placeholder="Video URL" /></label>';
        html += '</div>';
        html += '<div class="tangram se-attr"><div class="tangram se-attr-left">';
        html += '<label><i>Size</i><input type="number" class="tangram se-vidoe-width" placeholder="640"></label>';
        html += '<span>×</span><input type="number" class="tangram se-vidoe-height" placeholder="480">';
        html += '</div><div class="tangram se-attr-right">';
        html += '<label><i>Type</i><select class="tangram se-vidoe-type"></label>';
        html += '<option value="swf" selected="selected">swf</option>';
        html += '<option value="webm">webm</option>';
        html += '<option value="mp4">mp4</option>';
        html += '<option value="ogg">ogg</option>';
        html += '</select></div></div>';
        html += '<div class="tangram se-btns">';
        html += '<button type="button" data-se-cmd="insertvideo">OK</button>';
        html += '</div>';
        html += '</dialog>';
        return html;
    });

    regDialog('insertvideo', function(btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var textarea = _.query('.tangram.se-code', dialog)[0];
        if (textarea && textarea.value != '') {
            return {
                code: textarea.value
            }
        }
        var input = _.query('.tangram.se-url .tangram.se-input', dialog)[0];
        var widthInput = _.query('.tangram.se-attr .tangram.se-vidoe-width', dialog)[0];
        var heightInput = _.query('.tangram.se-attr .tangram.se-vidoe-height', dialog)[0];
        var typeInput = _.query('.tangram.se-attr .tangram.se-vidoe-type', dialog)[0];
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
});