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
    '$_/data/',
    '$_/data/Uploader.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker;

    var toolbarTypes = {},
        toolTypes = {
            '': 'empty',
            '|': 'separator',
            '/': 'linebreak'
        },
        statusTypes = {
            fontstatus: [
                '<lable>size: </lable><input type="text" class="bc editor-fsize-input" data-name="fontsize" value="14px">',
                '<lable>color: </lable><input type="text" class="bc editor-color-input" data-name="fontcolor" value="#000000">'
            ],
            tablestatus: [
                '<lable>width</lable><input type="text" class="bc editor-tablewidth-input" data-name="tablewidth" value="1">',
                '<lable>rows: </lable><input type="text" class="bc editor-rowslen" value="1" readonly>',
                '<i class="bc editor-table-adddata editor-table-addrow">Add Row</i>',
                '<lable>cols: </lable><input type="text" class="bc editor-colslen" value="1" readonly>',
                '<i class="bc editor-table-adddata editor-table-addcol">Add Column</i>',
                '<lable>border: </lable><input type="text" class="bc editor-border-input" data-name="tableborder" value="0">'
            ],
            imagestatus: [
                '<lable>width</lable><input type="text" class="bc editor-imgwidth-input" data-name="imgwidth" value="1">',
                '<lable>height</lable><input type="text" class="bc editor-imgheight-input" data-name="imgheight" value="1">',
                '<lable>border:</lable><input type="text" class="bc editor-border-input" data-name="imgborder" value="0">',
                '<i class="bc editor-imgfloat" data-float="none">No Float</i><i class="bc editor-imgfloat" data-float="left">Pull Left</i><i class="bc editor-imgfloat" data-float="right">Pull Right</i>'
            ]
        },
        statusHTML =
        '<div class="bc editor-fontstatus" title="Font Style"><section>' +
        statusTypes.fontstatus.join('</section><section>') +
        '</section></div><div class="bc editor-tablestatus" title="Table Style"><section>' +
        statusTypes.tablestatus.join('</section><section>') +
        '</section></div><div class="bc editor-imagestatus" title="Image Style"><section>' +
        statusTypes.imagestatus.join('</section><section>') +
        '</section></div>',
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
                empty: function() {
                    return '';
                },
                separator: function() {
                    return '<div class="bc editor-tool separator" title="separator"></div>';
                },
                linebreak: function() {
                    return '<div class="bc editor-tool linebreak" title="linebreak"></div>';
                },
                optionalitem: function(tool) {
                    var html = '<div class="bc editor-tool ' + tool + '" data-ib-cmds="' + tool + '" title="' + tool + '"><i class="bc editor-icon"></i>';
                    html += creators[tool].call(this);
                    html += '</div>';
                    return html;
                },
                dialogitem: function(tool) {
                    var html = '<div class="bc editor-tool ' + tool + '" data-ib-dialog="' + tool + '" title="' + tool + '"><i class="bc editor-icon"></i>';
                    html += creators[tool].call(this);
                    html += '</div>';
                    return html;
                },
                defaultitem: function(tool) {
                    return '<div class="bc editor-tool ' + tool + '" data-ib-cmd="' + tool + '" title="' + tool + '"><i class="bc editor-icon"></i></div>';
                }
            },
            toolarea: function(editor, textarea, options, toolarea) {
                if (!_.util.bool.isEl(toolarea)) {
                    var width = options.width || textarea.width - 2;
                    toolarea = _.dom.create('div', textarea.Element.parentNode, {
                        style: {
                            'width': width,
                            'border-color': (options.border && options.border.color) || '#CCCCCC',
                            'border-style': (options.border && options.border.style) || 'solid',
                            'border-width': (options.border && options.border.width) || '1px'
                        }
                    });
                }
                if (!toolarea.innerHTML) {
                    if (!options.toolbaritems) {
                        options.toolbaritems = toolbarTypes[options.toolbarType] || toolbarTypes['default'];
                    }
                    var html = '';
                    for (var i = 0; i < options.toolbaritems.length; i++) {
                        //console.log(this.options.toolbaritems[i]);
                        html += builders.tools[toolTypes[options.toolbaritems[i]]].call(editor, options.toolbaritems[i]);
                    }
                    html += '<div class="bc editor-clear"></div>';
                    toolarea.innerHTML = html;
                }
                _.dom.setAttr(toolarea, 'class', 'bc editor-toolarea editor-' + (options.themeType || 'default'));
                return toolarea;
            },
            editarea: function(editor, textarea, options) {
                var width = options.width || textarea.width - 2,
                    height = options.height || textarea.height - 2,
                    editarea = _.dom.create('div', textarea.Element.parentNode, {
                        className: 'bc editor editor-' + (options.themeType || 'default'),
                        style: {
                            'width': width,
                            'min-height': height,
                            'border-color': (options.border && options.border.color) || '#CCCCCC',
                            'border-style': (options.border && options.border.style) || 'solid',
                            'border-width': (options.border && options.border.width) || '1px'
                        }
                    });
                editarea.resetText = textarea.getText();
                _.dom.setAttr(editarea, 'data-editor-id', editor.uid);
                editor.richarea = _.dom.create('div', editarea, {
                    className: 'bc editor-richarea',
                    placeholder: _.dom.getAttr(textarea.Element, 'placeholder'),
                    contenteditable: 'true',
                    spellcheck: 'true',
                    talistenex: 1,
                    style: {
                        'width': width - 12,
                        'height': height - 12,
                        'padding': '5px',
                        'outline': 'none'
                    },
                    innerHTML: textarea.getText()
                });
                editor.codearea = _.dom.create('textarea', editarea, {
                    className: 'bc editor-codearea',
                    contenteditable: 'true',
                    spellcheck: 'true',
                    talistenex: 1,
                    style: {
                        'width': width - 12,
                        'height': height - 12,
                        'display': 'none',
                        'padding': '5px',
                        'outline': 'none'
                    },
                    value: textarea.getText()
                });
                editor.loadmask = _.dom.create('div', editarea, {
                    className: 'bc editor-loadmask',
                    innerHTML: '<div class="bc editor-spinner"><div class="bc editor-rect1"></div><div class="bc editor-rect2"></div><div class="bc editor-rect3"></div><div class="bc editor-rect4"></div><div class="bc editor-rect5"></div></div>'
                });

                editor.statebar = _.dom.create('div', editarea, {
                    className: 'bc editor-statebar',
                    innerHTML: statusHTML
                });
                return editarea;
            }
        };

    cache.save(toolbarTypes, 'EDITOR_BTYPES');
    cache.save(toolTypes, 'EDITOR_TTYPES');
    cache.save(creators, 'EDITOR_CREATS');
    cache.save(builders, 'EDITOR_BUILDS');

});