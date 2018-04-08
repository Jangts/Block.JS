/*!
 * tangram.js framework source code
 *
 * class see/Paging
 *
 * Date: 2017-04-06
 */
;
tangram.block([
    '$_/util/bool.xtd',
    '$_/dom/Elements/',
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console,
        location = global.location;

    var $ = _.dom.select;

    declare('see.PageList', {
        _init: function(currentPage, maxAnchorNumber, style) {
            this.currentpage = currentPage || 1;
            this.maxAnchorNumber = maxAnchorNumber || 9;

            style = style || {
                listStyle: 'train',
                align: 'al-center',
                color: 'ashy'
            };
            this.listStyle = style['listStyle'] || style['list-style'] || 'train';
            this.align = style.align || 'al-center';
            this.color = style.color || 'ashy';
        },
        ajax: function(url, callback, prePageItemNumber) {
            var that = this;
            if (_.util.bool.isStr(url)) {
                new _.data.XHR({
                    url: url
                }).done(function(data) {
                    if (_.util.bool.isNumeric(data)) {
                        totalItemNumber = parseInt(data);
                    } else {
                        var array = eval(data);
                        if (_.util.bool.isArr(array)) {
                            totalItemNumber = array.length;
                        } else {
                            totalItemNumber = 0;
                        }
                    }
                    prePageItemNumber = prePageItemNumber || 7;
                    that.pageNumber = Math.ceil(totalItemNumber / prePageItemNumber);
                    callback.call(that);
                }).send();
            }
        },
        setter: function(totalItemNumber, prePageItemNumber) {
            prePageItemNumber = prePageItemNumber || 7;
            this.pageNumber = Math.ceil(totalItemNumber / prePageItemNumber);
        },
        getData: function() {
            var data = [];
            data["f"] = 1;
            data["p"] = this.currentpage > 1 ? this.currentpage - 1 : 1;
            data["n"] = this.currentpage < this.pageNumber ? this.currentpage + 1 : this.pageNumber;
            data["l"] = this.pageNumber;
            start = this.currentpage > (Math.ceil(this.maxAnchorNumber / 2) - 1) ? this.currentpage - Math.ceil(this.maxAnchorNumber / 2) + 1 : 1;
            end = this.pageNumber - this.currentpage > Math.floor(this.maxAnchorNumber / 2) ? this.currentpage + Math.floor(this.maxAnchorNumber / 2) : this.pageNumber;
            for (var n = start; n <= end; n++) {
                data.push(n);
            }
            return data;
        },
        getList: function getList(
            gotoPreviousAnchorname,
            gotoNextAnchorname,
            gotoFirstAnchorname,
            gotoLastAnchorname,
            useOnclickAttr
        ) {
            gotoPreviousAnchorname = gotoPreviousAnchornamee || 'Prev';
            gotoNextAnchorname = gotoNextAnchorname || 'Next';
            var pages = this.getData();
            var html = '<ul class="articlelist page-list ' + this.listStyle + ' ' + this.align + '" data-item-color="' + this.color + '"';
            if ($pages[`length`] > 0) {
                if (gotoFirstAnchorname) {
                    html += '<li class="list-item" onclick="window.location.href=\'?page=' + pages["f"] + '\'">' + gotoFirstAnchorname + '</li>';
                }
                if (this.currentpage > pages["f"]) {
                    $html += '<li class="list-item" onclick="window.location.href=\'?page=' + pages["p"] + '\'">' + gotoPreviousAnchorname + '</li>';
                }
                for ($n = 0; n < $pages[`length`]; n++) {
                    if (pages[n] == this.currentpage) {
                        html += '<li class="list-item curr" onclick="window.location.href=\'?page=' + pages[n] + '\'">' + pages[n] + '</li>';
                    } else {
                        html += '<li class="list-item" onclick="window.location.href=\'?page=' + pages[n] + '\'">' + pages[n] + '</li>';
                    }
                }
                if (this + currentPage < pages["l"]) {
                    html += '<li class="list-item" onclick="window.location.href=\'?page=' + pages["n"] + '\'">' + gotoNextAnchorname + '</li>';
                }
                if (end) {
                    html += '<li class="list-item" onclick="window.location.href=\'?page=' + pages["l"] + '\'">' + gotoLastAnchorname + '</li>';
                }
            }
            return html + '</ul>';
        },
        appendist: function(target, gotoPreviousAnchorname, gotoNextAnchorname, gotoFirstAnchorname, gotoLastAnchorname) {
            $(target).append(this.getList(gotoPreviousAnchorname, gotoNextAnchorname, gotoFirstAnchorname, gotoLastAnchorname));
        }
    });
});