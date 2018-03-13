/*!
 * tangram.js framework source code
 *
 * class data.Tree
 *
 * Date 2017-04-06
 */
;
tangram.block(function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    // 注册_.data命名空间到pandora
    _('data');

    var getParents = function(index) {
            var parents = [];
            _.each(this.data, function(i, leaf) {
                if (leaf[this.indexkey] == index) {
                    leaf[this.parentskey] = getParents.call(this, leaf[this.parentindexkey]);
                    parents.push(leaf);
                }
            }, this);
            return parents;
        },

        getChildren = function(parent) {
            var children = [];
            _.each(this.data, function(i, leaf) {
                if (leaf[this.parentindexkey] == parent) {
                    leaf[this.childrenkey] = getChildren.call(this, leaf[this.indexkey]);
                    children.push(_.copy(leaf));
                }
            }, this);
            return children;
        };

    /**
     * 一个数据树类型，提供4种排序方式
     * 
     * @param   {Array}     array           原始数据，数组
     * @param   {String}    index           索引键的键名
     * @param   {String}    parent          父级元素外键键名
     * @param   {Object}    otherkeys       其他辅助键键名集
     * 
     */
    declare('data.Tree', {
        _init: function(array, index, parent, otherkeys) {
            otherkeys = otherkeys || {}
            this.result = [],
                this.data = array;
            this.indexkey = index || 'id';
            this.parentindexkey = parent || 'parent';
            this.levelkey = otherkeys.levelkey || 'level';
            this.childrenkey = otherkeys.childrenkey || 'children';
            this.parentskey = otherkeys.parentskey || 'parents';
        },
        getAllOrderByRoot: function(rootId, level) {
            rootId = rootId || 0;
            level = level || 1;
            _.each(this.data, function(i, leaf) {
                if (leaf[this.parentindexkey] == rootId) {
                    leaf[this.levelkey] = level;
                    this.result.push(leaf);
                    this.getAllOrderByRoot(leaf[this.indexkey], level + 1);
                }
            }, this);
            return this;
        },
        getRootsWithChildren: function(rootId) {
            rootId = rootId || 0;
            _.each(this.data, function(i, leaf) {
                if (leaf[this.parentindexkey] == rootId) {
                    leaf[this.childrenkey] = getChildren.call(this, leaf[this.indexkey]);
                    this.result.push(leaf);
                }
            }, this);
            return this;
        },
        getAllWithChildren: function(rootId) {
            rootId = rootId || 0;
            _.each(this.data, function(i, leaf) {
                leaf[this.childrenkey] = getChildren.call(this, leaf[this.indexkey]);
                this.result.push(leaf);
            }, this);
            return this;
        },
        getAllWithParents: function(rootId) {
            rootId = rootId || 0;
            _.each(this.data, function(i, leaf) {
                leaf[this.parentskey] = getParents.call(this, leaf[this.parentindexkey]);
                this.result.push(leaf);
            }, this);
            return this;
        }
    });
});