/*!
 * Block.JS Framework Source Code
 *
 * class forms/Editor
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/form/Editor/style.css',
    '$_/util/bool.xtd',
    '$_/dom/HTMLClose.cls',
    '$_/dom/Events.cls',
    '$_/data/',
    '$_/form/Editor/Selection.cls',
    '$_/form/Editor/parameters.tmp',
    '$_/form/Editor/builders.tmp',
    '$_/form/Editor/events.tmp',
    '$_/form/Editor/checks.tmp'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var Editors = {},
        conmands = {},

        parameters = cache.read(new _.Identifier('EDITOR_PARAMS').toString()),
        toolbarTypes = cache.read(new _.Identifier('EDITOR_BTYPES').toString()),
        toolTypes = cache.read(new _.Identifier('EDITOR_TTYPES').toString()),
        creators = cache.read(new _.Identifier('EDITOR_CREATS').toString()),
        builders = cache.read(new _.Identifier('EDITOR_BUILDS').toString()),
        dialogs = cache.read(new _.Identifier('EDITOR_DIALOGS').toString()),
        checks = cache.read(new _.Identifier('EDITOR_CHECKS').toString()),
        events = cache.read(new _.Identifier('EDITOR_EVENTS').toString());


    //Define NameSpace 'form'
    _('form');

    //Declare Class 'form.Editor'
    /**
     * forms inspection and submission and ect.
     * @class 'Editor'
     * @constructor
     * @param {Mix, Object }
     */

    declare('form.Editor', {
        textarea: null,
        toolarea: null,
        editarea: null,
        richarea: null,
        codearea: null,
        selection: null,
        isRich: 1,
        attachment_type: null,
        upload_maxsize: 1024 * 1024 * 20,
        transfer: null,
        _init: function(elems, settings) {
            settings = settings || {};
            this.options = {};
            for (var i in settings) {
                this.options[i] = settings[i];
            }
            if (settings.uploader) {
                this.upload_maxsize = settings.uploader.maxsize;
                this.attachment_type = settings.uploader.sfixs;
                this.transfer = settings.uploader.transfer;
            }
            if (_.util.bool.isArr(elems)) {
                this.textarea = builders.textarea(elems[0]);
                this.toolarea = builders.toolarea(this, this.textarea, this.options, elems[1]);
            } else if (_.util.bool.isEl(elems)) {
                this.textarea = builders.textarea(elems);
                this.toolarea = builders.toolarea(this, this.textarea, this.options);
            } else {
                return _.error('"elems" must be an array or element!');
            }
            this.uid = new _.Identifier();
            this.editarea = builders.editarea(this, this.textarea, this.options);
            this.selection = new _.form.Editor.Selection(this);
            Editors[this.uid] = this.listen();
        },
        execCommand: function(cmd, val) {
            cmd = cmd.toLowerCase();
            if (conmands[cmd]) {
                conmands[cmd].call(this, val);
            }
            return this;
        },
        setValue: function(value) {
            value = this.textarea.setText(value);
            this.richarea.innerHTML = this.codearea.value = value;
            this.selection.saveRange();
            return this.onchange();
        },
        resetValue: function() {
            this.setValue(this.editarea.resetText);
        },
        getValue: function() {
            if (this.isRich) {
                this.codearea.value = this.richarea.innerHTML;
            } else {
                if (this.richarea.innerHTML != this.codearea.value) {
                    this.richarea.innerHTML = this.codearea.value;
                }
            }
            this.textarea.setText(this.codearea.value);
            return this.codearea.value;
        },
        inForm: function(formElement) {
            return _.dom.contain(formElement, this.editarea);
            var parents = _.dom.getParentNodes();
            return _.bool.inArr(formElement, parents);
        },
        hideExtTools: function() {
            _.each(_.query('.bc.editor-tool[data-ib-dialog], .bc.editor-tool[data-ib-cmds]', this.toolarea), function(i, el) {
                _.dom.toggleClass(this, 'active', false);
            });
            return this;
        },
        showDialog: function(dialog) {
            this.hideExtTools();
            if (dialog) {
                var button = arguments[1] || _.query('.bc.editor-tool[data-ib-dialog=' + dialog + ']', this.toolarea)[0];
                _.dom.toggleClass(button, 'active');
            };
            return this;
        },
        showPick: function(cmds) {
            this.hideExtTools();
            if (cmds) {
                var height = this.isRich ? _.dom.getHeight(this.richarea, 'box') : _.dom.getHeight(this.codearea, 'box');
                var button = arguments[1] || _.query('.bc.editor-tool[data-ib-cmds=' + cmds + ']', this.toolarea)[0];
                _.dom.toggleClass(button, 'active');
                var list = _.query('.bc.editor-pick', button)[0];
                _.dom.setStyle(list, 'max-height', height - 15);
            };
            return this;
        },
        listen: function() {
            var editor = this,
                listeners = {
                    toolarea: new _.dom.Events(this.toolarea),
                    statebar: new _.dom.Events(this.statebar),
                    workspace: new _.dom.Events(this.richarea)
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
    });

    _.extend(_.form, true, {
        careatEditor: function(elems, settings) {
            var editor = new _.form.Editor(elems, settings);
            return editor;
        },
        careatEditors: function(selector, settings) {
            var editors = [];
            _.each(_.query(selector), function(i, el) {
                var editor = _.form.careatEditor(el, settings);
                editors.push(editor);
            });
            return editors;
        },
        getEditorById: function(id) {
            return id && Editors[id];
        }
    });

    _.extend(_.form.Editor, {
        extends: function(object, rewrite) {
            _.extend(_.form.Editor.prototype, rewrite, object);
        },
        regCommand: function(cmd, handler) {
            if (conmands[cmd] === undefined) {
                conmands[cmd] = handler;
                toolTypes[cmd] = 'defaultitem';
            }
        },
        regCreater: function(cmd, handler, optional) {
            if (creators[cmd] === undefined) {
                if (_.util.bool.isFn(handler)) {
                    creators[cmd] = handler;
                    if (optional) {
                        toolTypes[cmd] = 'optionalitem';
                    }
                } else if (_.util.bool.isStr(handler) && builders.tools[handler]) {
                    toolTypes[cmd] = handler;
                }
            }
        },
        regDialog: function(cmd, handler) {
            if (dialogs[cmd] === undefined) {
                dialogs[cmd] = handler;
                toolTypes[cmd] = 'dialogitem';
            }
        },
        regToolbarType: function(type, items) {
            if (toolbarTypes[type] === undefined) {
                toolbarTypes[type] = items;
            }
        }
    });

    //console.log(dialogs);
});