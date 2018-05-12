/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Sat, 12 May 2018 17:51:05 GMT
 */
;
// tangram.config({});
tangram.init().block([], function (pandora, root, imports, undefined) {
	var module = this.module;
	pandora.ns('arr', function () {
		var getItemKey = function (item, key) {
			if(!item || !key)return void 666;
			return typeof key === 'string' ? item[key]:key(item);
		}
		var makeKeyIndexAndFree = function (list, key) {
			var keyIndex = {};
			var free = [];
			for (var i = 0, len = list.length;i < len;i++) {
				var item = list[i];
				var itemKey = getItemKey(item, key);
				if (itemKey) {
					keyIndex[itemKey] = i;
				}
				else {
					free.push(item);
				}
			};
		}
		var diff = function (oldList, newList, key) {
			var oldMap = makeKeyIndexAndFree(oldList, key);
			var newMap = makeKeyIndexAndFree(newList, key);
			var newFree = newMap.free;
			var oldKeyIndex = oldMap.keyIndex;
			var newKeyIndex = newMap.keyIndex;
			var moves = [];
			var children = [];
			var i = 0;
			var item = void 0;
			var itemKey = void 0;
			var freeIndex = 0;
			var remove = function (index) {
				var move = {
					index: index,
					type: 0
				};
				moves.push(move);
			}
			var insert = function (index, item) {
				var move = {
					index: index,
					item: item,
					type: 1
				};
				moves.push(move);
			}
			var removeSimulate = function (index) {
				simulateList.splice(index, 1);
			}
			while (i < oldList.length) {
				item = oldList[i];
				itemKey = getItemKey(item, key);
				if (itemKey) {
					if (!newKeyIndex.hasOwnProperty(itemKey)) {
						children.push(null);
					}
					else {
						var newItemIndex = newKeyIndex[itemKey];
						children.push(newList[newItemIndex]);
					}
				}
				else {
					var freeItem = newFree[freeIndex++];
					children.push(freeItem || null);
				}
				i++;
			}
			var simulateList = children.slice(0);
			i = 0;
			while (i < simulateList.length) {
				if (simulateList[i] === null) {
					remove(i);
					removeSimulate(i);
				}
				else {
					i++;
				}
			}
			var j = 0;
			while (i < newList.length) {
				item = newList[i];
				itemKey = getItemKey(item, key);
				var simulateItem = simulateList[j];
				var simulateItemKey = getItemKey(simulateItem, key);
				if (simulateItem) {
					if (itemKey === simulateItemKey) {
						j++;
					}
					else {
						if (!oldKeyIndex.hasOwnProperty(itemKey)) {
							insert(i, item);
						}
						else {
							var nextItemKey = getItemKey(simulateList[j + 1], key);
							if (nextItemKey === itemKey) {
								remove(i);
								removeSimulate(j);
								j++;
							}
							else {
								insert(i, item);
							}
						}
					}
				}
				else {
					insert(i, item);
				}
				i++;
			};
		}
		return {
			makeKeyIndexAndFree: makeKeyIndexAndFree,
			diff: diff
		}
	});
	this.module.exports = _.arr.diff;
});
//# sourceMappingURL=diff.js.map