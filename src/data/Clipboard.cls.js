/*!
 * Block.JS Framework Source Code
 *
 * class data.Clipboard
 *
 * Date 2017-04-06
 */
;
block([
    '$_/util/bool.xtd',
    '$_/dom/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    // 注册_.data命名空间到pandora
    _('data');

    var document = global.document;

    /**
     * 一个基于html的剪切板类
     * 
     * @param   {String}    tagName         要创建的元素的标签名
     * @param   {Object}    props           元素的属性
     * @param   {Array}     children        子元素（节点）
     * 
     */
    declare('data.Clipboard', {
        _init: function(elem) {
            // constructor for new simple upload client
            if (_.util.bool.isEl(elem) && (elem.tagName == 'INPUTS' || elem.tagName == 'TEXTAREA')) {
                this.Element = elem;
            } else {
                this.Element = _.dom.create('textarea', document.getElementsByTagName('body')[0], {
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
                        document.execCommand('selectall', false, false);
                        document.execCommand('copy', false, false);
                    } else {
                        alert('Error');
                    }
                } else if (document.selection) {
                    var range = document.selection.createRange();
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
        if (_.util.bool.isFn(settings.copy) || _.util.bool.isStr(settings.copy)) {
            if (_.util.bool.isFn(settings.copy)) {
                var text = settings.copy.call(this);
            } else {
                var text = settings.copy
            }
            clip.setText(text).copy();
            if (_.util.bool.isFn(settings.done)) {
                settings.done.call(this);
            }
        } else {
            if (_.util.bool.isFn(settings.fail)) {
                settings.fail.call(this);
            }
        }
    };

    _.extend(_.data.Clipboard, {
        glue: function(selector, settings, clip) {
            if (!_.util.bool.isObj(clip) || !(clip instanceof _.data.Clipboard)) {
                clip = new _.data.Clipboard();
            }
            _.dom.events.add(document, 'mouseup', selector, null, mouseUp);
        }
    });
});