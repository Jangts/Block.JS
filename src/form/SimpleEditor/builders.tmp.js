/*!
 * Block.JS Framework Source Code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/util/bool.xtd',
    '$_/dom/',
    '$_/data/',
    '$_/data/Uploader.cls',
    '$_/form/SimpleEditor/events.tmp'
], function(pandora, global, undefined) {
    var
        _ = pandora,
        cache = pandora.locker,
        dialogs = cache.read(new _.Identifier('EDITOR_DIALOGS').toString()),

        conmands = {},
        metheds = {},
        tooltypes = {},
        toolbaritems = [
            ['bold', 'italic', 'underline', 'strikethrough'],
            ['fontsize', 'forecolor', 'backcolor'],
            ['header', 'blockquote', 'insertunorderedlist', 'insertorderedlist'],
            ['justifyleft', 'justifycenter', 'justifyright', 'justifyfull'],
            ['createlink', 'unlink', 'inserttable', 'insertfile', 'insertvideo', 'insertimage', 'insertemoticon'],
            ['removeformat', 'insertfragments']
        ],
        statusTypes = {
            fontstatus: [
                '<lable>color: </lable><input type="text" class="bc se-color-input" data-name="fontcolor" value="#000000">'
            ],
            tablestatus: [
                '<lable>width</lable><input type="text" class="bc se-tablewidth-input" data-name="tablewidth" value="1">',
                '<lable>rows: </lable><input type="text" class="bc se-rowslen" value="1" readonly>',
                '<i class="bc se-table-adddata se-table-addrow">Add Row</i>',
                '<lable>cols: </lable><input type="text" class="bc se-colslen" value="1" readonly>',
                '<i class="bc se-table-adddata se-table-addcol">Add Column</i>',
                '<lable>border: </lable><input type="text" class="bc se-border-input" data-name="tableborder" value="0">'
            ],
            imagestatus: [
                '<lable>width</lable><input type="text" class="bc se-imgwidth-input" data-name="imgwidth" value="1">',
                '<lable>height</lable><input type="text" class="bc se-imgheight-input" data-name="imgheight" value="1">',
                '<lable>border:</lable><input type="text" class="bc se-border-input" data-name="imgborder" value="0">',
                '<i class="bc se-imgsize" data-size="3">L</i>' +
                '<i class="bc se-imgsize" data-size="2">M</i>' +
                '<i class="bc se-imgsize" data-size="1">S</i>' +
                '<i class="bc se-imgsize" data-size="0">O</i>',
                '<i class="bc se-imgfloat" data-float="none">No Float</i>' +
                '<i class="bc se-imgfloat" data-float="left">Pull Left</i>' +
                '<i class="bc se-imgfloat" data-float="right">Pull Right</i>'
            ]
        },
        creators = {},
        builders = {
            textarea: function(textarea) {
                if (_.util.bool.isEl(textarea)) {
                    var text,
                        htmlclose = new _.dom.HTMLClose(),
                        width = textarea.offsetWidth,
                        height = textarea.offsetHeight;
                    _.dom.setStyle(textarea, 'display', 'none');
                    return {
                        Element: textarea,
                        width: width,
                        height: height,
                        getText: function() {
                            if (text === undefined) {
                                if (textarea.value) {
                                    text = textarea.value;
                                } else {
                                    text = textarea.innerHTML;
                                }
                            }
                            if (!text) {
                                text = '<div><br></div>';
                            }
                            return text;
                        },
                        setText: function(value) {
                            if (textarea.value) {
                                text = textarea.value = htmlclose.compile(value).replace(/_selected(="\w")?/, '');
                            } else {
                                text = textarea.innerHTML = htmlclose.compile(value).replace(/_selected(="\w")?/, '');
                            }
                            return text;
                        }
                    };
                }
                return _.error('"textarea" must be an element!');
            },
            tools: {
                optionalitem: function(tool) {
                    var html = '<div class="bc se-tool ' + tool + '" data-ib-cmds="' + tool + '" title="' + tool + '"><i class="bc se-icon"></i>';
                    html += creators[tool].call(this);
                    html += '</div>';
                    return html;
                },
                dialogitem: function(tool) {
                    var html = '<div class="bc se-tool ' + tool + '" data-ib-dialog="' + tool + '" title="' + tool + '"><i class="bc se-icon"></i>';
                    html += creators[tool].call(this);
                    html += '</div>';
                    return html;
                },
                defaultitem: function(tool) {
                    return '<div class="bc se-tool ' + tool + '" data-ib-cmd="' + tool + '" title="' + tool + '"><i class="bc se-icon"></i></div>';
                }
            },
            editarea: function(editor, uid, textarea, options) {
                var width = options.width || textarea.width - 2,
                    editarea = _.dom.create('div', textarea.Element.parentNode, {
                        className: 'bc simpleeditor',
                        style: {
                            'width': width,
                            'border-color': (options.border && options.border.color) || '#CCCCCC',
                            'border-style': (options.border && options.border.style) || 'solid',
                            'border-width': (options.border && options.border.width) || '1px'
                        }
                    });
                editarea.resetText = textarea.getText();
                _.dom.setAttr(editarea, 'data-se-id', uid);
                builders.toolarea(editor, textarea, options, editarea, width);
                builders.richarea(editor, textarea, options, editarea, width);
                builders.statebar(editor, textarea, options, editarea);
                return editarea;
            },
            toolarea: function(editor, textarea, options, editarea, width) {
                editor.toolarea = _.dom.create('div', editarea, {
                    style: {
                        'width': width,
                        'border-bottom-color': (options.border && options.border.color) || '#CCCCCC',
                        'border-bottom-style': (options.border && options.border.style) || 'solid',
                        'border-bottom-width': (options.border && options.border.width) || '1px'
                    }
                });
                var html = '';
                for (var i = 0; i < toolbaritems.length; i++) {
                    html += '<div class="bc se-toolgroup">';
                    for (var j = 0; j < toolbaritems[i].length; j++) {
                        html += builders.tools[tooltypes[toolbaritems[i][j]]].call(editor, toolbaritems[i][j]);
                    }
                    html += '</div>';
                }
                // html += '<div class="bc se-clear"></div>';
                editor.toolarea.innerHTML = html;
                _.dom.setAttr(editor.toolarea, 'class', 'bc se-toolarea');
            },
            richarea: function(editor, textarea, options, editarea, width) {
                var height = options.height || textarea.height;
                editor.richarea = _.dom.create('div', editarea, {
                    className: 'bc se-richarea',
                    placeholder: _.dom.getAttr(textarea.Element, 'placeholder'),
                    contenteditable: 'true',
                    spellcheck: 'true',
                    talistenex: 1,
                    style: {
                        'width': width - 12,
                        'min-height': height,
                        'height': height - 12,
                        'padding': '5px',
                        'outline': 'none'
                    },
                    innerHTML: textarea.getText()
                });
                editor.loadmask = _.dom.create('div', editarea, {
                    className: 'bc se-loadmask',
                    innerHTML: '<div class="bc se-spinner"><div class="bc se-rect1"></div><div class="bc se-rect2"></div><div class="bc se-rect3"></div><div class="bc se-rect4"></div><div class="bc se-rect5"></div></div>'
                });
            },
            statebar: function(editor, textarea, options, editarea) {
                var statusHTML =
                    '<div class="bc se-fontstatus" title="Font Style"><section>' +
                    statusTypes.fontstatus.join('</section><section>') +
                    '</section></div><div class="bc se-tablestatus" title="Table Style"><section>' +
                    statusTypes.tablestatus.join('</section><section>') +
                    '</section></div><div class="bc se-imagestatus" title="Image Style"><section>' +
                    statusTypes.imagestatus.join('</section><section>') +
                    '</section></div>';

                editor.statebar = _.dom.create('div', editarea, {
                    className: 'bc se-statebar',
                    innerHTML: statusHTML
                });
            }
        };

    var regMethod = function(object, rewrite) {
            _.extend(_.form.SimpleEditor.prototype, rewrite, object);
        },
        regCommand = function(cmd, handler) {
            if (conmands[cmd] === undefined) {
                conmands[cmd] = handler;
                tooltypes[cmd] = 'defaultitem';
            }
        },
        regCreater = function(cmd, handler, optional) {
            if (creators[cmd] === undefined) {
                if (_.util.bool.isFn(handler)) {
                    creators[cmd] = handler;
                    if (optional) {
                        tooltypes[cmd] = 'optionalitem';
                    }
                } else if (_.util.bool.isStr(handler) && builders.tools[handler]) {
                    tooltypes[cmd] = handler;
                }
            }
        },
        regDialog = function(cmd, handler) {
            if (dialogs[cmd] === undefined) {
                dialogs[cmd] = handler;
                tooltypes[cmd] = 'dialogitem';
            }
        }

    cache.save(regMethod, 'EDITOR_REG_M');
    cache.save(regCommand, 'EDITOR_REG_CMD');
    cache.save(regCreater, 'EDITOR_REG_C');
    cache.save(regDialog, 'EDITOR_REG_D');
    cache.save(conmands, 'EDITOR_CMDS');
    cache.save(metheds, 'EDITOR_METHODS');
    cache.save(builders, 'EDITOR_BUILDS');
});