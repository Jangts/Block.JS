/*!
 * tangram.js framework source code
 *
 * static dom.VElement.diff
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/util/bool',
    '$_/dom/',
    '$_/dom/VElement/patch',
    '$_/arr/diff'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console;

    var patch = _.dom.VElement.patch,
        dfsWalk = function(oldNode, newNode, index, patches) {
            var currentPatch = [];
            // Node is removed.
            if (newNode === null) {
                // Real DOM node will be removed when perform reordering, so has no needs to do anthings in here
                // TextNode content replacing
            } else if (_.util.bool.isStr(oldNode) && _.util.bool.isStr(newNode)) {
                if (newNode !== oldNode) {
                    currentPatch.push({ type: patch.TEXT, content: newNode });
                }
                // Nodes are the same, diff old node's props and children
            } else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
                // Diff props
                var propsPatches = diffProps(oldNode, newNode);
                if (propsPatches) {
                    currentPatch.push({ type: patch.PROPS, props: propsPatches });
                }
                // Diff children. If the node has a `ignore` property, do not diff children
                if (!isIgnoreChildren(newNode)) {
                    diffChildren(
                        oldNode.children,
                        newNode.children,
                        index,
                        patches,
                        currentPatch
                    );
                }
                // Nodes are not the same, replace the old node with new node
            } else {
                currentPatch.push({ type: patch.REPLACE, node: newNode });
            }

            if (currentPatch.length) {
                patches[index] = currentPatch;
            }
        },

        diffChildren = function(oldChildren, newChildren, index, patches, currentPatch) {
            var diffs = _.arr.diff(oldChildren, newChildren, 'key');
            newChildren = diffs.children;

            if (diffs.moves.length) {
                var reorderPatch = { type: patch.REORDER, moves: diffs.moves };
                currentPatch.push(reorderPatch);
            }

            var leftNode = null;
            var currentNodeIndex = index;
            _.each(oldChildren, function(i, child) {
                var newChild = newChildren[i];
                currentNodeIndex = (leftNode && leftNode.count) ?
                    currentNodeIndex + leftNode.count + 1 :
                    currentNodeIndex + 1;
                dfsWalk(child, newChild, currentNodeIndex, patches);
                leftNode = child;
            })
        },

        diffProps = function(oldNode, newNode) {
            var count = 0;
            var oldProps = oldNode.props;
            var newProps = newNode.props;

            var key, value;
            var propsPatches = {};

            // Find out different properties
            for (key in oldProps) {
                value = oldProps[key];
                if (newProps[key] !== value) {
                    count++;
                    propsPatches[key] = newProps[key];
                }
            }

            // Find out new property
            for (key in newProps) {
                value = newProps[key];
                if (!oldProps.hasOwnProperty(key)) {
                    count++;
                    propsPatches[key] = newProps[key];
                }
            }

            // If properties all are identical
            if (count === 0) {
                return null;
            }

            return propsPatches;
        },

        isIgnoreChildren = function(node) {
            return (node.props && node.props.hasOwnProperty('ignore'));
        };

    _('dom.VElement', {
        diff: function(oldTree, newTree) {
            var index = 0;
            var patches = {};
            dfsWalk(oldTree, newTree, index, patches);
            return patches;
        }
    });
});