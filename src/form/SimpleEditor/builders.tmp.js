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
                '<lable>color: </lable><input type="text" class="tangram se-color-input" data-name="fontcolor" value="#000000">'
            ],
            tablestatus: [
                '<lable>width</lable><input type="text" class="tangram se-tablewidth-input" data-name="tablewidth" value="1">',
                '<lable>rows: </lable><input type="text" class="tangram se-rowslen" value="1" readonly>',
                '<i class="tangram se-table-adddata se-table-addrow">Add Row</i>',
                '<lable>cols: </lable><input type="text" class="tangram se-colslen" value="1" readonly>',
                '<i class="tangram se-table-adddata se-table-addcol">Add Column</i>',
                '<lable>border: </lable><input type="text" class="tangram se-border-input" data-name="tableborder" value="0">'
            ],
            imagestatus: [
                '<lable>width</lable><input type="text" class="tangram se-imgwidth-input" data-name="imgwidth" value="1">',
                '<lable>height</lable><input type="text" class="tangram se-imgheight-input" data-name="imgheight" value="1">',
                '<lable>border:</lable><input type="text" class="tangram se-border-input" data-name="imgborder" value="0">',
                '<i class="tangram se-imgsize" data-size="3">L</i>' +
                '<i class="tangram se-imgsize" data-size="2">M</i>' +
                '<i class="tangram se-imgsize" data-size="1">S</i>' +
                '<i class="tangram se-imgsize" data-size="0">O</i>',
                '<i class="tangram se-imgfloat" data-float="none">No Float</i>' +
                '<i class="tangram se-imgfloat" data-float="left">Pull Left</i>' +
                '<i class="tangram se-imgfloat" data-float="right">Pull Right</i>'
            ]
        },
        creators = {},
        builders = {
            tools: {
                optionalitem: function(tool) {
                    var html = '<div class="tangram se-tool ' + tool + '" data-se-cmds="' + tool + '" title="' + tool + '"><i class="tangram se-icon"></i>';
                    html += creators[tool].call(this);
                    html += '</div>';
                    return html;
                },
                dialogitem: function(tool) {
                    var html = '<div class="tangram se-tool ' + tool + '" data-se-dialog="' + tool + '" title="' + tool + '"><i class="tangram se-icon"></i>';
                    html += creators[tool].call(this);
                    html += '</div>';
                    return html;
                },
                defaultitem: function(tool) {
                    return '<div class="tangram se-tool ' + tool + '" data-se-cmd="' + tool + '" title="' + tool + '"><i class="tangram se-icon"></i></div>';
                }
            },
            initEl: function(elem, options, textarea) {
                var width, height;
                if (textarea) {
                    width = textarea.offsetWidth + 2;
                    height = textarea.offsetHeight + 2;
                } else {
                    width = elem.offsetWidth;
                    height = elem.offsetHeight;
                }
                if (options.width) {
                    width = options.width;
                }
                if (options.height) {
                    height = options.height;
                }
                _.dom.setStyle(elem, 'height', 'auto');
                return {
                    Element: elem,
                    width: width,
                    height: height
                };
            },
            textarea: function(textarea) {
                var text,
                    htmlclose = new _.dom.HTMLClose();
                _.dom.setStyle(textarea, 'display', 'none');
                return {
                    Element: textarea,
                    getText: function() {
                        if (textarea.value) {
                            text = textarea.value;
                        } else {
                            text = textarea.innerHTML;
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
            },
            mainarea: function(options, text) {
                var width = this.cElement.width - 2,
                    mainarea = _.dom.create('div', this.cElement.Element, {
                        className: 'tangram simpleeditor',
                        style: {
                            'width': width,
                            'border-color': (options.border && options.border.color) || '#CCCCCC',
                            'border-style': (options.border && options.border.style) || 'solid',
                            'border-width': (options.border && options.border.width) || '1px'
                        }
                    });
                mainarea.resetText = text;
                _.dom.setAttr(mainarea, 'data-se-id', this.uid);
                return mainarea;
            },
            workspace: function(mainarea, options, isBuildStateBar) {
                var width = this.cElement.width - 2,
                    height = this.cElement.height;
                this.richareas.push(_.dom.create('div', mainarea, {
                    className: 'tangram se-richarea',
                    placeholder: options.placeholder || '', // _.dom.getAttr(textarea.Element, 'placeholder'),
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
                    innerHTML: mainarea.resetText
                }));
                this.loadmasks.push(_.dom.create('div', mainarea, {
                    className: 'tangram se-loadmask',
                    innerHTML: '<div class="tangram se-spinner"><div class="tangram se-rect1"></div><div class="tangram se-rect2"></div><div class="tangram se-rect3"></div><div class="tangram se-rect4"></div><div class="tangram se-rect5"></div></div>'
                }));
                if (isBuildStateBar) {
                    var statusHTML =
                        '<div class="tangram se-fontstatus" title="Font Style"><section>' +
                        statusTypes.fontstatus.join('</section><section>') +
                        '</section></div><div class="tangram se-tablestatus" title="Table Style"><section>' +
                        statusTypes.tablestatus.join('</section><section>') +
                        '</section></div><div class="tangram se-imagestatus" title="Image Style"><section>' +
                        statusTypes.imagestatus.join('</section><section>') +
                        '</section></div>';

                    this.statebar = _.dom.create('div', mainarea, {
                        className: 'tangram se-statebar',
                        innerHTML: statusHTML
                    });
                }

            },
            toolbar: function(options) {
                if (options.toolarea && _.util.bool.isEl(options.toolarea)) {
                    options.toolarea.innerHTML = '';
                    _.dom.addClass(options.toolarea, 'tangram simpleeditor');
                    _.dom.setStyle(options.toolarea, {

                        'border-color': (options.border && options.border.color) || '#CCCCCC',
                        'border-style': (options.border && options.border.style) || 'solid',
                        'border-width': (options.border && options.border.width) || '1px',
                        'overflow': 'visible'
                    });
                    var toolbar = _.dom.create('div', options.toolarea);
                } else {
                    var toolbar = _.dom.create('div', this.mainareas[0], {
                        style: {
                            'width': this.cElement.width,
                            'border-bottom-color': (options.border && options.border.color) || '#CCCCCC',
                            'border-bottom-style': (options.border && options.border.style) || 'solid',
                            'border-bottom-width': (options.border && options.border.width) || '1px'
                        }
                    });
                }

                var html = '';
                for (var i = 0; i < toolbaritems.length; i++) {
                    html += '<div class="tangram se-toolgroup">';
                    for (var j = 0; j < toolbaritems[i].length; j++) {
                        html += builders.tools[tooltypes[toolbaritems[i][j]]].call(this, toolbaritems[i][j]);
                    }
                    html += '</div>';
                }
                // html += '<div class="tangram se-clear"></div>';
                toolbar.innerHTML = html;
                _.dom.setAttr(toolbar, 'class', 'tangram se-toolbar');
                return toolbar;
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