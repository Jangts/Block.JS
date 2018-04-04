/*!
 * tangram.js framework source code
 *
 * static data.diff
 *
 * Date 2017-04-06
 */
;
tangram.block(function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console;
    var getItemKey = function(item, key) {
            if (!item || !key) return void 666
            return typeof key === 'string' ? item[key] : key(item)
        },
        makeKeyIndexAndFree = function(list, key) {
            var keyIndex = {};
            var free = [];
            for (var i = 0, len = list.length; i < len; i++) {
                var item = list[i];
                var itemKey = getItemKey(item, key);
                if (itemKey) {
                    keyIndex[itemKey] = i;
                } else {
                    free.push(item);
                }
            }
            return {
                keyIndex: keyIndex,
                free: free
            }
        };

    _('data', {
        makeKeyIndexAndFree: makeKeyIndexAndFree,
        diff: function(oldList, newList, key) {
            var oldMap = makeKeyIndexAndFree(oldList, key),
                newMap = makeKeyIndexAndFree(newList, key),
                newFree = newMap.free,
                oldKeyIndex = oldMap.keyIndex,
                newKeyIndex = newMap.keyIndex;

            var moves = [],

                // a simulate list to manipulate
                children = [],
                i = 0,
                item,
                itemKey,
                freeIndex = 0;

            var remove = function(index) {
                    var move = { index: index, type: 0 };
                    moves.push(move);
                },
                insert = function(index, item) {
                    var move = { index: index, item: item, type: 1 };
                    moves.push(move);
                },
                removeSimulate = function(index) {
                    simulateList.splice(index, 1);
                };

            // fist pass to check item in old list: if it's removed or not
            while (i < oldList.length) {
                item = oldList[i];
                itemKey = getItemKey(item, key);
                if (itemKey) {
                    if (!newKeyIndex.hasOwnProperty(itemKey)) {
                        children.push(null);
                    } else {
                        var newItemIndex = newKeyIndex[itemKey];
                        children.push(newList[newItemIndex]);
                    }
                } else {
                    var freeItem = newFree[freeIndex++];
                    children.push(freeItem || null);
                }
                i++;
            }

            var simulateList = children.slice(0);

            // remove items no longer exist
            i = 0;
            while (i < simulateList.length) {
                if (simulateList[i] === null) {
                    remove(i);
                    removeSimulate(i);
                } else {
                    i++;
                }
            }

            // i is cursor pointing to a item in new list
            // j is cursor pointing to a item in simulateList
            var j = i = 0;
            while (i < newList.length) {
                item = newList[i];
                itemKey = getItemKey(item, key);

                var simulateItem = simulateList[j];
                var simulateItemKey = getItemKey(simulateItem, key);

                if (simulateItem) {
                    if (itemKey === simulateItemKey) {
                        j++;
                    } else {
                        // new item, just inesrt it
                        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
                            insert(i, item);
                        } else {
                            // if remove current simulateItem make item in right place
                            // then just remove it
                            var nextItemKey = getItemKey(simulateList[j + 1], key);
                            if (nextItemKey === itemKey) {
                                remove(i);
                                removeSimulate(j);
                                j++; // after removing, current j is right, just jump to next one
                            } else {
                                // else insert item
                                insert(i, item);
                            }
                        }
                    }
                } else {
                    insert(i, item);
                }

                i++;
            }

            return {
                moves: moves,
                children: children
            };
        }
    });
});