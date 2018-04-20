/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Fri, 20 Apr 2018 00:33:07 GMT
 */
;
tangram.block([], function (pandora, global, imports, undefined) {var getItemKey = function(item, key){
		if(!item || !key) return void 666; 
		return typeof key === 'string' ? item[key]: key(item); 
	}; 
	var makeKeyIndexAndFree = function(list, key){ 
		var keyIndex = {}; 
		var free =[]; 
		for(var i = 0, len = list.length; i < len; i++){ 
			var item = list[i]; 
			var itemKey = getItemKey(item, key); 
			if(itemKey){
				keyIndex[itemKey] = i; 
			}
			else{
				free.push(item); 
			}
		}
		return{
			keyIndex:  keyIndex,
			free:  free
		}
	}; 
	pandora('arr',{
		makeKeyIndexAndFree:  makeKeyIndexAndFree,
		diff: function(oldList, newList, key){ 
			var oldMap = makeKeyIndexAndFree(oldList, key),
			newMap = makeKeyIndexAndFree(newList, key),
			newFree = newMap.free,
			oldKeyIndex = oldMap.keyIndex,
			newKeyIndex = newMap.keyIndex; 
			var moves =[],
			children =[],
			i = 0,
			item,
			itemKey,
			freeIndex = 0; 
			var remove = function(index){ 
				var move ={
					index:  index,
					type:  0
				}; 
				moves.push(move); 
			},
			insert = function(index, item){ 
				var move ={
					index:  index,
					item:  item,
					type:  1
				}; 
				moves.push(move); 
			},
			removeSimulate = function(index){
				simulateList.splice(index, 1); 
			}; 
			while(i < oldList.length){
				item = oldList[i]; 
				itemKey = getItemKey(item, key); 
				if(itemKey){
					if(!newKeyIndex.hasOwnProperty(itemKey)){
						children.push(null); 
					}
					else{ 
						var newItemIndex = newKeyIndex[itemKey]; 
						children.push(newList[newItemIndex]); 
					}
				}
				else{ 
					var freeItem = newFree[freeIndex++]; 
					children.push(freeItem || null); 
				}
				i++;

			}; 
			var simulateList = children.slice(0); 
			i = 0; 
			while(i < simulateList.length){
				if(simulateList[i] === null){
					remove(i); 
					removeSimulate(i); 
				}
				else{
					i++;

				}
			}; 
			var j = i = 0; 
			while(i < newList.length){
				item = newList[i]; 
				itemKey = getItemKey(item, key); 
				var simulateItem = simulateList[j]; 
				var simulateItemKey = getItemKey(simulateItem, key); 
				if(simulateItem){
					if(itemKey === simulateItemKey){
						j++;

					}
					else{
						if(!oldKeyIndex.hasOwnProperty(itemKey)){
							insert(i, item); 
						}
						else{ 
							var nextItemKey = getItemKey(simulateList[j + 1], key); 
							if(nextItemKey === itemKey){
								remove(i); 
								removeSimulate(j); 
								j++;

							}
							else{
								insert(i, item); 
							}
						}
					}
				}
				else{
					insert(i, item); 
				}
				i++;

			}
			return{
				moves:  moves,
				children:  children
			}; 
		}
	}); 
	return _.arr.diff; 
});