/*!
 * tangram.js framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/dom/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var dialogs = {},
        wshandler = function(event) {
            // console.log(event.target === event.data.richarea);
            var editor = event.data;
            if (event.eventType === 'mouseup') {
                editor.hideExtTools();
                _.each(_.dom.query('img[_selected=_selected]', editor.richarea), function(i, elem) {
                    _.dom.removeAttr(elem, '_selected');
                });
                _.query('.tangram.se-imagestatus', editor.statebar)[0].style.display = 'none';
                if (event.target.tagName === 'IMG') {
                    editor.selectedImage = event.target;
                    editor.selection.saveRange();
                    editor.onchange();
                    return;
                } else {
                    editor.selectedImage = undefined;
                }
            }
            if (editor.selection.range && editor.selection.range.type === 'Caret') {
                if (event.target === editor.richarea || editor.selection.range.commonElem === editor.richarea) {
                    _.query('.tangram.se-tablestatus', editor.statebar)[0].style.display = 'none';
                    editor.onchange();
                    return;
                }
                if (event.target === editor.selection.range.commonElem) {
                    editor.onchange();
                    return;
                }
            }
            editor.selection.saveRange();
            editor.onchange();

        },
        outhandler = function(event) {
            // console.log(event);
            var editor = event.data;
            editor.outmoment = false;
            if (event.buttons) {
                editor.selection.saveRange();
                editor.outmoment = true;
                setTimeout(function() {
                    editor.outmoment = false;
                }, 500);
                editor.onchange();
                return;
            }
            if (event.target === editor.richarea) {
                editor.selection.saveRange();
                editor.onchange();
            }
        },
        inhandler = function(event) {
            // console.log(event);
            var editor = event.data;
            if ((editor.outmoment === false) && (event.target === editor.richarea)) {
                editor.selection.restoreSelection();
            }
            editor.onchange();
        },
        xhandlers = {

        },
        inputs = {
            'fontsize': function(editor, input) {
                editor.execCommand('fontsize', input.value);
            },
            'fontcolor': function(editor, input) {
                editor.execCommand('forecolor', input.value);
            },
            'tablewidth': function(editor, input) {
                var table = editor.selectedTable;
                table.style.width = parseInt(input.value) + 'px';
                table.width = parseInt(input.value);
                editor.selection.saveRange();
            },
            'tableborder': function(editor, input) {
                var table = editor.selectedTable;
                table.style.borderTopWidth = parseInt(input.value) + 'px';
                table.style.borderRightWidth = parseInt(input.value) + 'px';
                table.style.borderBottomWidth = parseInt(input.value) + 'px';
                table.style.borderLeftWidth = parseInt(input.value) + 'px';
                table.style.borderStyle = table.style.borderStyle || 'solid';
                table.border = parseInt(input.value);
            },
            'imgwidth': function(editor, input) {
                var img = editor.selectedImage;
                img.style.width = parseInt(input.value) + 'px';
                img.width = parseInt(input.value);
            },
            'imgheight': function(editor, input) {
                var img = editor.selectedImage;
                img.style.height = parseInt(input.value) + 'px';
                img.height = parseInt(input.value);
            },
            'imgsize': function(editor, size) {
                var css, attr, img = editor.selectedImage;
                switch (size) {
                    case '3':
                        css = attr = '100%';
                        break;
                    case '2':
                        css = attr = '50%';
                        break;
                    case '1':
                        css = attr = '33%';
                        break;
                    default:
                        css = 'auto';
                        attr = null;
                        break;
                }
                img.style.width = css;
                img.width = attr;
                img.style.height = 'auto';
                img.height = null;
            },
            'imgborder': function(editor, input) {
                var img = editor.selectedImage;
                img.style.borderTopWidth = parseInt(input.value) + 'px';
                img.style.borderRightWidth = parseInt(input.value) + 'px';
                img.style.borderBottomWidth = parseInt(input.value) + 'px';
                img.style.borderLeftWidth = parseInt(input.value) + 'px';
                img.border = parseInt(input.value);
            }
        }
    events = {
        'toolarea': {
            'mouseup': {
                '[data-ib-dialog]': function(event) {
                    if (event.target.tagName == 'I') {
                        var editor = event.data,
                            dialog = _.dom.getAttr(this, 'data-ib-dialog');
                        _.each(_.query('.tangram.se-tool[data-ib-dialog] input[type=text], .tangram.se-tool[data-ib-dialog] textarea, .tangram.se-tool[data-ib-dialog] input.tangram.se-files', editor.toolarea), function(i, el) {
                            if (_.dom.hasClass(this, 'createlink')) {
                                var elem = editor.selection.getRange().commonElem;
                                if (!elem.tagName === 'A') {
                                    elem = _.dom.closest(elem, 'a');
                                }
                                if (elem) {
                                    this.value = _.dom.getAttr(elem, 'href');
                                } else {
                                    this.value = '';
                                }
                            } else {
                                this.value = '';
                            }
                        });

                        _.query('.tangram.se-tool[data-ib-dialog] .tangram.se-show', editor.toolarea)[0].innerHTML = '<span>click to upload</span>';
                        editor.showDialog(dialog, this);
                        editor.selection.restoreSelection();
                    };
                },
                '[data-ib-cmds]': function(event) {
                    var editor = event.data,
                        cmds = _.dom.getAttr(this, 'data-ib-cmds');
                    editor.showPick(cmds, this);
                    editor.selection.restoreSelection();
                },
                '[data-ib-cmd]': function(event) {
                    var editor = event.data;
                    if (!_.dom.hasClass(this, 'invalid')) {
                        editor.hideExtTools();
                        var cmd = _.dom.getAttr(this, 'data-ib-cmd');
                        switch (cmd) {
                            case 'createlink':
                            case 'inserttable':
                            case 'insertfile':
                            case 'insertvideo':
                            case 'insertimage':
                                var val = dialogs[cmd](this);
                                break;
                            case 'insertemoticon':
                                var val = dialogs[cmd](_.dom.getAttr(this, 'data-ib-val'));
                                break;
                            case 'uploadfile':
                                return dialogs[cmd].call(editor, this);
                            case 'uploadimage':
                                return dialogs[cmd].call(editor, this);
                            default:
                                var val = _.dom.getAttr(this, 'data-ib-val');
                                break;
                        }
                        editor.execCommand(cmd, val);
                    }
                },
                '.tangram.se-show span': function(event) {
                    var editor = event.data;
                    var previewer = this.parentNode,
                        dialog = _.dom.closest(this, 'dialog'),
                        input = _.query('.tangram.se-files', dialog)[0];
                    input.onchange = function() {
                        var doneCallback = function(files) {
                            if (files.length < 6) {
                                var ul_class = 'tangram se-list-56'
                            } else if (files.length < 19) {
                                var ul_class = 'tangram se-list-28'
                            } else {
                                return alert('Cannot more than 18 images!');
                            }
                            var list = '<ul class="' + ul_class + '">';
                            _.each(files, function() {
                                list += '<li><img src="' + _.painter.canvas.fileToBlob(this) + '" /></li>';
                            });
                            list += '</ul>';
                            previewer.innerHTML = list;
                            previewer.files = files;
                        };
                        var failCallback = function(file, errtype) {
                            switch (errtype) {
                                case 0:
                                    alert('Must Select Images!');
                                    break;
                                case 1:
                                    alert('Filesize OVER!');
                                    break;
                                case 2:
                                    alert('No Legal File Selected!');
                                    break;
                            };
                        };
                        var uploader = new _.data.Uploader(this.files, ['image/jpeg', 'image/pjpeg', 'image/gif', 'image/png'], ['jpg', 'png', 'gif'], editor.upload_maxsize);
                        uploader.isOnlyFilter = false;
                        uploader.checkType(doneCallback, failCallback);
                    }
                    input.click();
                }
            }
        },
        'statebar': {
            'mouseup': {
                '.tangram.se-imgfloat': function(e) {
                    var float = _.dom.getAttr(this, 'data-float') || 'none',
                        img = event.data.selectedImage;
                    img.style.float = float;
                    event.data.selection.saveRange();
                    event.data.onchange();
                },
                '.tangram.se-imgsize': function(e) {
                    var size = _.dom.getAttr(this, 'data-size') || 'none';
                    inputs['imgsize'](event.data, size);
                    event.data.selection.saveRange();
                    event.data.onchange();
                },
                '.tangram.se-table-addrow': function(e) {
                    var editor = e.data,
                        table = editor.selectedTable,
                        row = editor.selectedTableRow,
                        len = row.cells.length;
                    _.dom.after(row, '<tr>' + _.util.str.repeat('<td>&nbsp;</td>', len) + '</tr>');

                },
                '.tangram.se-table-addcol': function(e) {
                    var editor = e.data,
                        table = editor.selectedTable,
                        row = editor.selectedTableRow,
                        cell = editor.selectedTableCell,
                        index = _.dom.index(cell, row.cells);
                    _.each(table.rows, function(i, row) {
                        cell = row.cells[index] || row.cells[row.length - 1];
                        _.dom.after(row.cells[index], '<td>&nbsp;</td>');
                    });

                }
            },
            'change': {
                'input': function(e) {
                    var name = _.dom.getAttr(this, 'data-name');
                    if (_.util.bool.isFn(inputs[name])) {
                        inputs[name](event.data, this);
                    }
                }
            }
        },
        'workspace': {
            'mouseout': outhandler,
            'mouseenter': inhandler,
            'mouseup': wshandler,
            'keyup': wshandler
        }
    };

    cache.save(dialogs, 'EDITOR_DIALOGS');
    cache.save(events, 'EDITOR_EVENTS');
})