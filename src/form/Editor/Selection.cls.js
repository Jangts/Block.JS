/*!
 * Block.JS Framework Source Code
 *
 * class form.Selection
 *
 * Date: 2017-04-06
 */
;
block('$_/util/bool.xtd', function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;


    declare('form.Editor.Selection', {
        editor: null,
        range: null,

        _init: function(editor) {
            this.editor = editor;
        },

        // 恢复选区
        restoreSelection: function() {
            this.range = new _.form.SelectionRange(this.range);
        },

        // 获取 range 对象
        getRange: function() {
            if (this.range) {
                this.restoreSelection(this.range);
            } else {
                this.createEmptyRange();
            }
            return this.range;
        },

        // 保存选区
        saveRange: function(range) {
            if (range) {
                // 保存已有选区
                this.range = range
            } else {
                // 获取当前的选区
                range = new _.form.SelectionRange();

                // 判断选区内容是否在编辑内容之内
                if (range.isBelongTo(this.editor.richarea)) {
                    // 是编辑内容之内的
                    this.range = range;
                }
            }
            return range;
        },

        // 折叠选区
        collapseRange: function(toStart) {
            if (this.range) {
                this.range.collapse(toStart);
            }
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
        createEmptyRange: function() {
            var editor = this.editor,
                range = new _.form.SelectionRange(),
                elem;

            range.selectInput(this.editor.richarea, false);
            this.saveRange(range);

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