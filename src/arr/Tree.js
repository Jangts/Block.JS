/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Tue, 24 Apr 2018 15:55:02 GMT
 */
;
// tangram.config({});
tangram.block([], function (pandora, global, imports, undefined) {
	var _ = pandora;
	var getParents = function (index) {
		var parents = [];
		pandora.each(this.data, function (i, leaf) {
			if (leaf[this.indexkey] == index) {
				leaf[this.parentskey] = getParents.call(this, leaf[this.parentindexkey]);
				parents.push(leaf);
			};
		}, this);
		return parents;
	}
	var getChildren = function (parent) {
		var children = [];
		pandora.each(this.data, function (i, leaf) {
			if (leaf[this.parentindexkey] == parent) {
				leaf[this.childrenkey] = getChildren.call(this, leaf[this.indexkey]);
				children.push(_.copy(leaf));
			};
		}, this);
		return children;
	}
	pandora.declareClass('arr.Tree', {
		_init: function (array, index, parent, otherkeys) {
			if (otherkeys === void 0) { otherkeys = {}; }
			this.result = [];
			this.data = array;
			this.indexkey = index || 'id';
			this.parentindexkey = parent || 'parent';
			this.levelkey = otherkeys.levelkey || 'level';
			this.childrenkey = otherkeys.childrenkey || 'children';
			this.parentskey = otherkeys.parentskey || 'parents';
		},
		getAllOrderByRoot: function (rootId, level) {
			if (rootId === void 0) { rootId = 0; }
			if (level === void 0) { level = 1; }
			pandora.each(this.data, function (i, leaf) {
				if (leaf[this.parentindexkey] == rootId) {
					leaf[this.levelkey] = level;
					this.result.push(leaf);
					this.getAllOrderByRoot(leaf[this.indexkey], level + 1);
				};
			}, this);
			return this;
		},
		getRootsWithChildren: function (rootId) {
			if (rootId === void 0) { rootId = 0; }
			pandora.each(this.data, function (i, leaf) {
				if (leaf[this.parentindexkey] == rootId) {
					leaf[this.childrenkey] = getChildren.call(this, leaf[this.indexkey]);
					this.result.push(leaf);
				};
			}, this);
			return this;
		},
		getAllWithChildren: function (rootId) {
			if (rootId === void 0) { rootId = 0; }
			pandora.each(this.data, function (i, leaf) {
				leaf[this.childrenkey] = getChildren.call(this, leaf[this.indexkey]);
				this.result.push(leaf);
			}, this);
			return this;
		},
		getAllWithParents: function (rootId) {
			if (rootId === void 0) { rootId = 0; }
			pandora.each(this.data, function (i, leaf) {
				leaf[this.parentskey] = getParents.call(this, leaf[this.parentindexkey]);
				this.result.push(leaf);
			}, this);
			return this;
		}
	});
});