/*!
 * Block.JS Framework Source Code
 *
 * class see/Paging
 *
 * Date: 2017-04-06
 */
;
block([
    '$_/util/bool.xtd',
    '$_/dom/Elements/',
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console,
        location = global.location;

    var $ = _.dom.select;

    declare('see.Paging', {
        _init: function(cpage, itemNum) {
            this.currentpage = cpage || 1;
            this.itemNum = itemNum || 9;
        },
        ajax: function(url, callback, prePage) {
            var that = this;
            if (_.util.bool.isStr(url)) {
                new _.data.XHR({
                    url: url
                }).done(function(data) {
                    if (_.util.bool.isNumeric(data)) {
                        total = parseInt(data);
                    } else {
                        var array = eval(data);
                        if (_.util.bool.isArr(array)) {
                            total = array.length;
                        } else {
                            total = 0;
                        }
                    }
                    prePage = prePage || 7;
                    that.pageNum = Math.ceil(total / prePage);
                    callback.call(that);
                }).send();
            }
        },
        setter: function(total, prePage) {
            prePage = prePage || 7;
            this.pageNum = Math.ceil(total / prePage);
        },
        getData: function() {
            var data = [];
            data["f"] = 1;
            data["p"] = this.currentpage > 1 ? this.currentpage - 1 : 1;
            data["n"] = this.currentpage < this.pageNum ? this.currentpage + 1 : this.pageNum;
            data["l"] = this.pageNum;
            start = this.currentpage > (Math.ceil(this.itemNum / 2) - 1) ? this.currentpage - Math.ceil(this.itemNum / 2) + 1 : 1;
            end = this.pageNum - this.currentpage > Math.floor(this.itemNum / 2) ? this.currentpage + Math.floor(this.itemNum / 2) : this.pageNum;
            for (var n = start; n <= end; n++) {
                data.push(n);
            }
            return data;
        },
        getList: function getList(pre, nxt, stt, end) {
            pre = pre || 'Prev';
            nxt = nxt || 'Next';
            var pages = this.getData();
            var html = '';
            if ($pages[`length`] > 0) {
                if (stt) {
                    html += '<li class="pages-list-item" onclick="window.location.href=\'?page=' + pages["f"] + '\'">' + $stt + '</li>';
                }
                if (this.currentpage > pages["f"]) {
                    $html += '<li class="pages-list-item" onclick="window.location.href=\'?page=' + pages["p"] + '\'">' + $pre + '</li>';
                }
                for ($n = 0; n < $pages[`length`]; n++) {
                    if (pages[n] == this.currentpage) {
                        html += '<li class="pages-list-item curr" onclick="window.location.href=\'?page=' + pages[n] + '\'">' + pages[n] + '</li>';
                    } else {
                        html += '<li class="pages-list-item" onclick="window.location.href=\'?page=' + pages[n] + '\'">' + pages[n] + '</li>';
                    }
                }
                if (this + cpage < pages["l"]) {
                    html += '<li class="pages-list-item" onclick="window.location.href=\'?page=' + pages["n"] + '\'">' + nxt + '</li>';
                }
                if (end) {
                    html += '<li class="pages-list-item" onclick="window.location.href=\'?page=' + pages["l"] + '\'">' + end + '</li>';
                }
            }
            return html;
        },
        appendist: function(target, pre, nxt, stt, end) {
            $(target).append(this.getList(pre, nxt, stt, end));
        }
    });
});