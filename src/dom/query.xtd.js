/*!
 * tangram.js framework source code
 *
 * package dom.query
 *
 * Date 2017-04-06
 */
;
tangram.block(['$_/util/str.xtd', '$_/util/arr.xtd', '$_/util/obj.xtd'], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker;

    //选择器正则表达式
    var idExpr = /^([\w-]+)?#([\w-]+)/;
    var classExpr = /^([\w-]+)?\.([\w-]+)/;
    var attrExpr = /^([\w-]+)?\[([\w-]+)([|*~\$!]*)(?:=(?:['"]?)(\w+)(?:['"]?))?\]/;
    var gtExpr = /^([\w-#.]+)(?:\s*)(\>)(?:\s*)([\w#.-]+)/;
    var onlyIdExpr = /^#[\w-_]*$/i;
    var onlyNameExpr = /^@[\w-_]+$/i;

    //对象元素遍历
    var each = _.each;

    //选择器入口
    var query = function(selector, context) {
        context = context || document;
        var result = [];
        if (onlyIdExpr.test(selector)) {
            selector = selector.replace(/#/, "");
            var elem = document.getElementById(selector);
            if (elem) {
                if (context == document || hasChildNode(context, elem)) {
                    return [elem];
                }
            }
            return [];
        }
        if (onlyNameExpr.test(selector)) {
            selector = selector.replace(/@/, "");
            return context.getElementsByName(selector);
        }
        if (document.querySelectorAll) {
            context = context.querySelectorAll ? context : document;
            if (selector.match(/\[[\w-]+=("|')[^\1]*\1[^\]]*\1\]/g)) {
                return [];
            }
            selector = selector.replace(/\[[\w-]+=[^'"=\]]+\]/g,
                function(attr) {
                    return attr.replace("=", '="').replace("]", '"]');
                }).replace(/\[+/, '[').replace(/\]+/, ']');
            result = context.querySelectorAll(selector);
        } else {
            each(selector.split(','),
                function(s) {
                    result = result.concat(filters(s, context));
                });
            result = _.util.arr.unique(result);
        };
        return result;
    };

    //选择器匹配管理
    var filters = function(selector, context) {
        var result = [];
        var splits = selector.match(gtExpr);
        if (splits) {
            return childFilters(splits, context);
        };
        splits = selector.split(/\s+/);
        var ps = find(splits[0], context);
        if (!splits[1]) {
            return ps;
        }
        each(ps,
            function(elem) {
                result = result.concat(find(splits[1], elem));
            });
        return result;
    };

    var childFilters = function(splits, context) {
        var result = [];
        each(find(splits[1]),
            function(context) {
                each(context.childNodes,
                    function(child) {
                        (child.nodeType == 1 && (child.tagName == splits[3].toUpperCase() || "#" + child.id == splits[3] || _.util.str.has(child.className, splits[3].replace('.', '')))) && result.push(child);
                    });
            });
        return result;
    };

    //选择器简单匹配
    var find = function(selector, context) {
        var result = [];
        var className = selector.match(classExpr);
        var id = !className && selector.match(idExpr);
        var attr = !id && selector.match(attrExpr);
        if (id) {
            var elem = byId(id[2], context, id[1]);
            if (elem) {
                result.push(elem);
            }
        } else if (className) {
            result = byClass(className[2], context, className[1]);
        } else if (attr) {
            result = byAttr(attr[2], attr[4], context, attr[1], attr[3]);
        } else {
            result = byTagName(selector, context);
        }
        return _.uitl.obj.toArray(result);
    };

    /**
     * Sub Selectors And Other Auxiliary Methods Of tangram.js Selector
     * ------------------------------------------------------------------
     */

    /**
     * ID Selector
     *
     * Select HTMLElement By 'id' (and tagName)
     *
     * @param {String} id, id attribute of Selected HTMLElement must be this string
     * @param {Object<HTMLElement>} context, Selected HTMLElement must be childNode of this object
     * @param {String} tagName, tagName of Selected HTMLElement must be this string
     * @returns void
     *
     * @date 2015-09-12
     * @author QETHAN<qinbinyang@zuijiao.net>
     */
    var byId = function(id, context, tagName) {
        context = context || document;
        var elem = document.getElementById(id);
        if (tagName && elem && elem.tagName != tagName.toUpperCase()) {
            return undefined;
        };
        if (!hasChildNode(context, elem)) {
            return undefined;
        }
        return elem;
    };

    var hasChildNode = function(elem, node) {
        node = node.parentNode;
        while (node != undefined && node != null) {
            if (node === elem) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    };

    var byClass = function(className, context, tagName) {
        context = context || document;
        if (document.getElementsByClassName && !tagName) {
            return context.getElementsByClassName(className);
        };
        if (document.querySelectorAll) {
            return context.querySelectorAll((tagName || "") + "." + className);
        };
        return byAttr("class", className, context, tagName, '~');
    };

    var byAttr = function(name, val, context, tagName, sign) {
        name = name == 'class' && 'className';
        var result = [];
        var vl = val ? val.length : 0;
        var vi = !val ? -1 : (!sign ? 0 : ' |*~$!'.indexOf(sign));
        each(byTagName(tagName, context),
            function(elem) {
                var v = elem[name] || elem.getAttribute(name);
                if (elem.nodeType == 1 && v) {
                    var exprs = [true, v == val, v.substr(0, vl) == val, v.indexOf(val) > -1, _.util.str.has(v, val), v.substr(v.length - vl) == val, v != val];
                    if (exprs[vi + 1])
                        result.push(elem);
                };
            });
        return result;
    };

    var byTagName = function(tagName, context) {
        tagName = tagName || "*";
        context = context || document;
        return context.getElementsByTagName(tagName);
    };

    var byAttrsObject = function(Attrs, context) {
        var str = '';
        if (Attrs.tagName)
            str = Attrs.tagName;
        if (Attrs.id)
            str += '#' + Attrs.id;
        if (Attrs.className) {
            if (typeof(Attrs.className) == 'string') {
                str += '.' + Attrs.className;
            } else if (_.util.type(Attrs.className) == 'Array') {
                for (var i in Attrs.className) {
                    str += '.' + Attrs.className[i];
                }
            }
        }
        if (Attrs.name)
            str += '[name=' + Attrs.name + ']';
        for (var i in Attrs) {
            if (i != 'tagName' && i != 'id' && i != 'className' && i != 'name') {
                str += '[' + i + '=' + Attrs[i] + ']';
            }
        }
        return query(str, context);
    };;

    _('dom', {
        query: query,
        hasChildNode: hasChildNode,
        hasParentNode: function(elem, node) {
            return hasChildNode(node, elem);
        }
    });

    _.extend(_.dom.query, {
        byId: byId,
        byAttr: byAttrsObject,
        byTag: byTagName,
        byClass: byClass,
    });

    _.extend(_, {
        byId: byId,
        byCn: byClass,
        query: query
    });
});