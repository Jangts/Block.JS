/*!
 * tangram.js framework source code
 *
 * static dom.VElement.patch
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/obj/',
    '$_/dom/'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        doc = global.document,
        console = global.console;

    var REPLACE = 0,
        REORDER = 1,
        PROPS = 2,
        TEXT = 3;

    var setProps = function(node, props) {
            for (var key in props) {
                if (props[key] === void 666) {
                    //void any === undefined
                    _.dom.removeAttr(key);
                } else {
                    var value = props[key]
                    _.dom.set(node, key, value);
                }
            }
        },
        reorderChildren = function(node, moves) {
            var staticNodeList = _.obj.toArray(node.childNodes);
            var maps = {};

            _.each(staticNodeList, function(i, node) {
                if (node.nodeType === 1) {
                    var key = node.getAttribute('key');
                    if (key) {
                        maps[key] = node;
                    }
                }
            });

            _.each(moves, function(i, move) {
                var index = move.index
                if (move.type === 0) { // remove item
                    if (staticNodeList[index] === node.childNodes[index]) { // maybe have been removed for inserting
                        node.removeChild(node.childNodes[index]);
                    }
                    staticNodeList.splice(index, 1)
                } else if (move.type === 1) { // insert item
                    var insertNode = maps[move.item.key] ?
                        maps[move.item.key] // reuse old item
                        :
                        (typeof move.item === 'object') ?
                        move.item.render() :
                        doc.createTextNode(move.item);
                    staticNodeList.splice(index, 0, insertNode);
                    node.insertBefore(insertNode, node.childNodes[index] || null);
                }
            });
        },
        applyPatches = function(node, currentPatches) {
            _.each(currentPatches, function(i, currentPatch) {
                switch (currentPatch.type) {
                    case REPLACE:
                        var newNode = (typeof currentPatch.node === 'String') ? doc.createTextNode(currentPatch.node) : currentPatch.node.render();
                        node.parentNode.replaceChild(newNode, node);
                        break;
                    case REORDER:
                        reorderChildren(node, currentPatch.moves);
                        break;
                    case PROPS:
                        setProps(node, currentPatch.props);
                        break;
                    case TEXT:
                        if (node.textContent) {
                            node.textContent = currentPatch.content;
                        } else {
                            node.nodeValue = currentPatch.content;
                        }
                        break;
                    default:
                        throw new Error('Unknow patch type ' + currentPatch.type);
                }
            });
        },
        dfsWalk = function(node, walker, patches) {
            var currentPatches = patches[walker.index]

            var len = node.childNodes ?
                node.childNodes.length :
                0
            for (var i = 0; i < len; i++) {
                var child = node.childNodes[i]
                walker.index++
                    dfsWalk(child, walker, patches);
            }

            if (currentPatches) {
                applyPatches(node, currentPatches);
            }
        };





    _('dom.VElement', {
        patch: function(node, patches) {
            var walker = { index: 0 };
            dfsWalk(node, walker, patches)
        }
    });

    _.extend(_.dom.VElement.patch, {
        REPLACE: REPLACE,
        REORDER: REORDER,
        PROPS: PROPS,
        TEXT: TEXT
    });
});