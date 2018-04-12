/*!
 * tangram.js framework source code
 *
 * class form.Selection
 *
 * Date: 2017-04-06
 */
;
tangram.block([
    '$_/util/bool',
    '$_/form/SimpleEditor/Range'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console;


    declare('form.SimpleEditor.Selection', {
        editor: null,
        range: null,

        _init: function(editor) {
            this.editor = editor;
        },

        // 恢复选区
        restoreSelection: function() {
            if (this.range) {
                this.range = new _.form.SimpleEditor.Range(this.range);
            } else {
                this.createEmptyRange();
            }
        },

        // 获取 range 对象
        getRange: function() {
            this.restoreSelection();
            return this.range;
        },

        // 保存选区
        saveRange: function(range) {
            if (!range) {
                // 获取当前的选区
                range = new _.form.SimpleEditor.Range();
            } else {
                new _.form.SimpleEditor.Range(range);
            }
            // 判断选区内容是否在编辑内容之内
            var i = 0,
                richareas = this.editor.richareas;
            for (i; i < richareas.length; i++) {
                if (range.isBelongTo(richareas[i])) {
                    // 是编辑内容之内
                    this.range = range;
                    break;
                }
            }
            return this.range;
        },

        // 折叠选区
        collapseRange: function(toStart) {
            if (this.range) {
                this.range.collapse(toStart);
            }
            return this;
        },

        // 选中区域的文字
        getSelectionText: function() {
            if (this.range) {
                return this.range.text;
            }
            return '';
        },

        // 选区的 $Elem
        getSelectionContainerElem: function(range) {
            range = range || this.range;
            if (range) {
                var elem = range.commonNode;
                return (elem != null) && (elem.nodeType === 1 ? elem : elem.parentNode);
            }
        },
        getSelectionStartElem: function(range) {
            range = range || this.range
            if (range) {
                var elem = range.startNode;
                return (elem != null) && (elem.nodeType === 1 ? elem : elem.parentNode);
            }
        },
        getSelectionEndElem: function(range) {
            range = range || this.range
            if (range) {
                var elem = range.endNode;
                return (elem != null) && (elem.nodeType === 1 ? elem : elem.parentNode);
            }
        },

        // 选区是否为空
        isSelectionEmpty: function() {
            if (this.range) {
                return this.range.isEmpty();
            }
            return false
        },

        // 创建一个空白（即 &#8203 字符）选区
        createEmptyRange: function(index) {
            var editor = this.editor,
                range = new _.form.SimpleEditor.Range(),
                elem;
            index = parseInt(index) || 0;
            range.selectInput(this.editor.richareas[index], false);
            this.collapseRange().saveRange(range);

            if (!this.isSelectionEmpty()) {
                // 当前选区必须没有内容才可以
                return;
            }

            try {
                // 目前只支持 webkit 内核
                if (_.util.bool.isWebkit()) {
                    // 插入 &#8203
                    range.insertHTML('&#8203;');
                    // 修改 offset 位置
                    range.setEnd(range.endNode, range.endOffset + 1);
                    // 存储
                    range.collapse(false);
                } else {
                    var elem = _.dom.createByString('<strong>&#8203;</strong>');
                    range.insertElem(elem);
                    this.range.selectElem(elem, false);
                }
            } catch (ex) {
                // 部分情况下会报错，兼容一下
            }
        },

        // 根据 $Elem 设置选区
        createRangeByElem: function(elem, toStart, isContent) {
            if (!elem) {
                return
            }
            this.saveRange(this.range.selectElem(elem, toStart, isContent));
        }
    });
});