/*!
 * tangram.js framework source code
 *
 * class form.Clipboard
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/util/bool',
    '$_/dom/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console;

    // 注册_.data命名空间到pandora
    _('data');

    var doc = global.document;

    /**
     * 一个基于html的剪切板类
     * 
     * @param   {String}    tagName         要创建的元素的标签名
     * @param   {Object}    props           元素的属性
     * @param   {Array}     children        子元素（节点）
     * 
     */
    declare('form.Clipboard', {
        _init: function(elem) {
            // constructor for new simple upload client
            if (_.util.bool.isEl(elem) && (elem.tagName == 'INPUTS' || elem.tagName == 'TEXTAREA')) {
                this.Element = elem;
            } else {
                this.Element = _.dom.create('textarea', doc.getElementsByTagName('body')[0], {
                    style: {
                        position: 'fixed',
                        top: -2000,
                        left: -2000
                    }
                });
            }
        },

        Element: null,

        isValid: true,

        clipText: '',

        disable: function(cancel) {
            this.isValid = cancel ? true : false;
            return this;
        },

        setText: function(newText) {
            // set text to be copied to clipboard
            this.clipText = newText;
            this.Element.value = newText;
            return this;
        },

        copy: function() {
            if (_.util.bool.isFn(this.Element.focus)) {
                this.Element.focus();
                if (window.getSelection) {
                    var selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        doc.execCommand('selectall', false, false);
                        doc.execCommand('copy', false, false);
                    } else {
                        alert('Error');
                    }
                } else if (doc.selection) {
                    var range = doc.selection.createRange();
                    range.execCommand('selectall', false, false);
                    range.execCommand('copy', false, false);
                } else {
                    alert('Error');
                }
                this.Element.value = '';
                this.Element.blur();
            } else {
                alert('Error');
            }
            return this;
        }
    });

    var mouseUp = function() {
        if (_.util.bool.isFn(options.copy) || _.util.bool.isStr(options.copy)) {
            if (_.util.bool.isFn(options.copy)) {
                var text = options.copy.call(this);
            } else {
                var text = options.copy
            }
            clip.setText(text).copy();
            if (_.util.bool.isFn(options.done)) {
                options.done.call(this);
            }
        } else {
            if (_.util.bool.isFn(options.fail)) {
                options.fail.call(this);
            }
        }
    };

    _.extend(_.form.Clipboard, {
        glue: function(selector, options, clip) {
            if (!_.util.bool.isObj(clip) || !(clip instanceof _.form.Clipboard)) {
                clip = new _.form.Clipboard();
            }
            _.dom.events.add(document, 'mouseup', selector, null, mouseUp);
        }
    });
});