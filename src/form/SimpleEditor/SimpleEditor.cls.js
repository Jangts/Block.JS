/*!
 * tangram.js framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/form/SimpleEditor/style.css',
    '$_/util/bool.xtd',
    '$_/dom/HTMLClose.cls',
    '$_/dom/Events.cls',
    '$_/data/',
    '$_/form/SimpleEditor/Selection.cls',
    '$_/form/SimpleEditor/parameters.tmp',
    '$_/form/SimpleEditor/builders.tmp',
    '$_/form/SimpleEditor/checks.tmp',
    '$_/form/SimpleEditor/commands/base.cmds',
    '$_/form/SimpleEditor/commands/font.cmds',
    '$_/form/SimpleEditor/commands/header.cmds',
    '$_/form/SimpleEditor/commands/createlink.cmd',
    '$_/form/SimpleEditor/commands/inserttable.cmd',
    '$_/form/SimpleEditor/commands/insertfile.cmd',
    '$_/form/SimpleEditor/commands/insertimage.cmd',
    '$_/form/SimpleEditor/commands/insertvideo.cmd',
    '$_/form/SimpleEditor/commands/insertemoticon.cmd',
    '$_/form/SimpleEditor/commands/insertfragments.cmd',
    '$_/form/SimpleEditor/emoticons/default.emt'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var SimpleEditors = {},
        conmands = cache.read(new _.Identifier('EDITOR_CMDS').toString()),
        // parameters = cache.read(new _.Identifier('EDITOR_PARAMS').toString()),
        metheds = cache.read(new _.Identifier('EDITOR_METHODS').toString()),
        // creators = cache.read(new _.Identifier('EDITOR_CREATS').toString()),
        builders = cache.read(new _.Identifier('EDITOR_BUILDS').toString()),
        // 
        checks = cache.read(new _.Identifier('EDITOR_CHECKS').toString()),
        events = cache.read(new _.Identifier('EDITOR_EVENTS').toString());

    //Define NameSpace 'form'
    _('form');

    //Declare Class 'form.SimpleEditor'
    /**
     * forms inspection and submission and ect.
     * @class 'SimpleEditor'
     * @constructor
     * @param {Mix, Object }
     */

    declare('form.SimpleEditor', {
            cElement: null,
            mainareas: null,
            richareas: null,
            textareas: null,
            loadmasks: null,
            statebar: null,
            toolbar: null,
            selection: null,
            attachment_type: null,
            upload_maxsize: 1024 * 1024 * 20,
            transfer: null,
            _init: function(elem, options, textareas) {
                if (_.util.bool.isEl(elem)) {
                    options = options || {};
                    this.options = {};
                    this.uid = new _.Identifier();
                    for (var i in options) {
                        this.options[i] = options[i];
                    }
                    if (options.uploader) {
                        this.upload_maxsize = options.uploader.maxsize;
                        this.attachment_type = options.uploader.sfixs;
                        this.transfer = options.uploader.transfer;
                    }

                    if (elem.tagName.toUpperCase() === 'TEXTAREA' || elem.tagName.toUpperCase() === 'INPUT') {
                        textareas = elem;
                        this.cElement = builders.initEl(elem.parentNode, options, textareas);
                    } else {
                        this.cElement = builders.initEl(elem, options, textareas);
                    }

                    this.textareas = [];
                    if (textareas) {
                        if (_.util.bool.isEl(textareas)) {
                            this.textareas = [builders.textarea(textareas)];
                        } else if (_.util.bool.isEls(textareas)) {
                            _.each(textareas, function(i, textarea) {
                                this.textareas.push(builders.textarea(textarea));
                            }, this);
                        } else if (_.util.bool.isArr(textareas)) {
                            _.each(textareas, function(i, textarea) {
                                console.log(textarea);
                                if (_.util.bool.isEl(textarea)) {
                                    this.textareas.push(builders.textarea(textarea));
                                }
                            }, this);
                        }
                    } else {
                        _.each(_.query('textarea, input', this.cElement.Element), function(i, el) {
                            this.textareas.push(builders.textarea(el));
                        }, this);
                    }

                    this.mainareas = [];
                    if (this.textareas.length) {
                        _.each(this.textareas, function(i, textarea) {
                            console.log(textarea, textarea.getText());
                            this.mainareas.push(builders.mainarea.call(this, options, textarea.getText()));
                        }, this);
                    } else {
                        var text = this.cElement.Element.innerHTML;
                        this.cElement.Element.innerHTML = '';
                        this.mainareas.push(builders.mainarea.call(this, options, text));
                    }

                    this.toolbar = builders.toolbar.call(this, options);

                    this.richareas = [];
                    this.loadmasks = [];
                    var isBuildStateBar = (this.mainareas.length === 1);
                    _.each(this.mainareas, function(i, mainarea) {
                        builders.workspace.call(this, mainarea, options, isBuildStateBar);
                    }, this);

                    this.selection = new _.form.SimpleEditor.Selection(this);
                    SimpleEditors[this.uid] = this.listen();
                } else {
                    return _.error('@param "elem" must be an element!');
                }
            },
            focus: function(index) {
                index = parseInt(index) || 0;
                this.selection.createEmptyRange(index);
            },
            execCommand: function(cmd, val) {
                cmd = cmd.toLowerCase();
                if (conmands[cmd]) {
                    conmands[cmd].call(this, val);
                }
                return this;
            },
            setValue: function(value, index) {
                index = parseInt(index) || 0;
                if (this.textareas[index]) {
                    value = this.textareas[index].setText(value);
                }
                this.richareas[index] && (this.richareas[index].innerHTML = value);
                this.selection.createEmptyRange(index);
                return this.onchange();
            },
            resetValue: function() {
                _.each(this.mainareas, function(index, mainarea) {
                    this.richareas[index].innerHTML = mainarea.resetText;
                }, this);
            },
            getValue: function(index) {
                index = parseInt(index) || 0;
                _.each(this.textareas, function(i, textarea) {
                    textarea.setText(this.richareas[i].innerHTML);
                }, this);

                return this.richareas[index] ? this.richareas[index].innerHTML : '';
            },
            getContentTxt: function(index) {
                index = parseInt(index) || 0;
                var _range = this.selection.getRange();
                this.selection.createEmptyRange(index);
                this.selection.range.execCommand('selectall');
                this.selection.saveRange();
                var _text = this.selection.range.text;
                this.selection.saveRange(_range);
                return _text;
            },
            getText: function(index) {
                index = parseInt(index) || 0;
                return this.selection.getSelectionText();
            },
            inForm: function(formElement) {
                return _.dom.contain(formElement, this.cElement.Element);
            },
            hideExtTools: function() {
                _.each(_.query('.tangram.se-tool[data-se-dialog], .tangram.se-tool[data-se-cmds]', this.toolbar), function(i, el) {
                    _.dom.toggleClass(this, 'active', false);
                });
                return this;
            },
            showDialog: function(dialog) {
                this.hideExtTools();
                if (dialog) {
                    var button = arguments[1] || _.query('.tangram.se-tool[data-se-dialog=' + dialog + ']', this.toolbar)[0];
                    _.dom.toggleClass(button, 'active');
                };
                return this;
            },
            showPick: function(cmds) {
                this.hideExtTools();
                if (cmds) {
                    var button = arguments[1] || _.query('.tangram.se-tool[data-se-cmds=' + cmds + ']', this.toolbar)[0];
                    _.dom.toggleClass(button, 'active');

                    if (_.dom.contain(this.mainareas[0], this.toolbar)) {
                        var list = _.query('.tangram.se-pick', button)[0],
                            height = _.dom.getHeight(this.richareas[0], 'box');
                        _.dom.setStyle(list, 'max-height', height - 15);
                    }
                };
                return this;
            },
            listen: function() {
                var editor = this,
                    listeners = {
                        toolbar: new _.dom.Events(this.toolbar),
                        workspaces: new _.dom.Events(this.cElement.Element)
                    };
                _.each(listeners, function(name, listener) {
                    _.each(events[name], function(eventType, handler) {
                        if (_.util.bool.isFn(handler)) {
                            listener.push(eventType, null, editor, handler);
                        } else if (_.util.bool.isObj(handler)) {
                            _.each(handler, function(selector, fn) {
                                listener.push(eventType, selector, editor, fn);
                            });
                        }
                    })
                });
                return this;
            },
            collapse: function(toStart) {
                this.selection.getRange().collapse(toStart);
            },
            onchange: function() {
                _.each(checks, function(check, handler) {
                    handler.call(this);
                }, this);
                return this;
            },
        },
        metheds);

    _.extend(_.form, true, {
        careatEditor: function(elems, options) {
            var editor = new _.form.SimpleEditor(elems, options);
            return editor;
        },
        careatEditors: function(selector, options) {
            var editors = [];
            _.each(_.query(selector), function(i, el) {
                var editor = _.form.careatEditor(el, options);
                editors.push(editor);
            });
            return editors;
        },
        getEditorById: function(id) {
            return id && SimpleEditors[id];
        }
    });
});