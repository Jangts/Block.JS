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
        emoticons = {};

    _.form.Editor.regCommand('insertemoticon', function(val) {
        if (val && val.pack && val.name) {
            if (emoticons[val.pack] && emoticons[val.pack][val.name]) {
                if (this.options.emoticonsType == 'code') {
                    var code = val.pack + '/' + val.name
                    var codeFormat = this.options.emoticonsCodeFormat || parameters.emoticonsCodeFormat;
                    code = codeFormat.replace('CODE', code);
                    this.execCommand('insert', code);
                } else {
                    var src = parameters.basePath + 'emoticons/' + val.pack + '/' + emoticons[val.pack][val.name];
                    var html = '<img src="' + src + '" class="bc editor-emoticon" />';
                    this.execCommand('insert', html);
                }
                this.collapse();
            }
        }
        return this;
    });

    _.form.Editor.regCreater('insertemoticon', function() {
        var pack = this.options.emoticonsTable && emoticons[this.options.emoticonsTable] ? this.options.emoticonsTable : parameters.emoticonsTable;
        var emtb = emoticons[pack];
        var path = parameters.basePath + 'emoticons/' + pack + '/';
        var html = '<dialog class="bc editor-dialog"><ul class="bc editor-emoticons bc editor-emoticons-' + pack + '">';
        for (var i in emtb) {
            html += '<li class="bc editor-emoticon" data-ib-cmd="insertemoticon" data-ib-val="' + pack + ', ' + i + '" title="' + i + '"><img src="' + path + emtb[i] + '"></li>';
        }
        html += '</ul></dialog>';
        return html;
    });

    _.form.Editor.regDialog('insertemoticon', function(val) {
        if (val) {
            var arr = val.split(/,\s*/);
            if (arr.length > 1) {
                return {
                    pack: arr[0],
                    name: arr[1]
                }
            }
        }
        return null;
    });

    _.form.Editor.extends({
        insertEmoticon: function(val) {
            return this.execCommand('insertemoticon', val);
        }
    });

    _.extend(_.form.Editor, {
        regEmoticon: function(theme, images) {
            if (emoticons[theme] === undefined) {
                emoticons[theme] = images;
            }
        }
    });
});