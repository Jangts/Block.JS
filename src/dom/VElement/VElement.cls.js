/*!
 * tangram.js framework source code
 *
 * class dom.VElement
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/util/bool.xtd',
    '$_/dom/',
    '$_/dom/VElement/patch.xtd',
    '$_/dom/VElement/diff.xtd'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document;

    var patch = _.dom.VElement.patch,
        diff = _.dom.VElement.diff;

    /**
     * tangram.js Virtual Document Object Model
     * 一个轻量的虚拟DOM类
     * 
     * @param   {String}    tagName         要创建的元素的标签名
     * @param   {Object}    props           元素的属性
     * @param   {Array}     children        子元素（节点）
     * 
     */
    declare('dom.VElement', {
        _init: function(tagName, props, children) {
            if (_.util.bool.isArr(props)) {
                children = props;
                props = {};
            };
            this.tagName = tagName;
            this.props = props || {};
            this.children = children || [];
            this.key = props ? props.key : undefined;
            var count = 0;
            _.each(this.children, function(i, child) {
                if (child instanceof _.dom.VElement) {
                    count += child.count;
                } else {
                    children[i] = '' + child;
                }
                count++;
            })
            this.count = count;
        },
        render: function() {
            var elem = document.createElement(this.tagName);
            var props = this.props;
            for (var propName in props) {
                var propValue = props[propName];
                _.dom.set(elem, propName, propValue);
            }
            _.each(this.children, function(i, child) {
                var childEl = (child instanceof _.dom.VElement) ?
                    child.render() :
                    document.createTextNode(child);
                elem.appendChild(childEl);
            })
            return elem;
        }
    });

    _.extend(_.dom, true, {
        createVElement: function(tagName, props, children) {
            return new _.dom.VElement(tagName, props, children);
        }
    });

    _.extend(_.dom.VElement, true, {
        patch: patch,
        diff: diff,
        create: function(tagName, props, children) {
            return new _.dom.VElement(tagName, props, children);
        }
    });
});