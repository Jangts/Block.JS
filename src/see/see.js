/*!
 * tangram.js framework source code
 *
 * http://www.yangram.net/tangram.js/
 *
 * Date: 2017-04-06
 */
;
tangram.block([
    '$_/util/bool',
    '$_/dom/Elements'
], function(pandora, global, imports, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        
        doc = global.document,
        location = global.location,
        $ = _.dom.select;

    declare('see.Menu', {
        _init: function (elem) {
            this.Element = _.util.bool.isStr(elem) ? _.dom.query.byId(elem) : elem;
            if (_.util.bool.isEl(this.Element)) {
                this.render();
            }
        },
        render: function () {
            $('.submenu[data-width]', this.Element).each(function () {
                $(this).css('width', parseFloat($(this).data('width')));
            });
            $('.submenu[data-height]', this.Element).each(function () {
                $(this).css('height', parseFloat($(this).data('height')));
            });
            $('.submenu.under.al-center, .submenu.upon.al-center', this.Element).each(function () {
                $('tangram-see').addClass('__while-menu-item-get-size');
                width = $(this).width();
                $('tangram-see').removeClass('__while-menu-item-get-size');
                $(this).css('margin-left', '-' + width / 2 + 'px');
            });
            $('.submenu.rside.al-middle, .submenu.lside.al-middle', this.Element).each(function () {
                $('tangram-see').addClass('__while-menu-item-get-size');
                height = $(this).height();
                $('tangram-see').removeClass('__while-menu-item-get-size');
                $(this).css('margin-top', '-' + height / 2 + 'px');
            });
        }
    });

    declare('see.List', {
        _init: function (elem) {
            this.Element = _.util.bool.isStr(elem) ? _.dom.query.byId(elem) : elem;
            if (_.util.bool.isEl(this.Element)) {
                this.render();
            }
        },
        render: function () {
            if (_.dom.hasClass(this.Element, 'withthumb')) {
                var itemWidth, mediaWidth, bodyWidth;
                $('.tangram-see .articlelist.withthumb>.list-item', this.Element).each(function () {
                    if (_.dom.hasClass(this, 'top-bottom')) {
                        return this;
                    }
                    itemWidth = $(this).innerWidth();
                    mediaWidth = Math.ceil($('.list-figure,.list-image, img', this).outerWidth(true));
                    bodyWidth = itemWidth - mediaWidth - 1;
                    $('.list-body', this).sub(0).width(bodyWidth);
                    // console.log(itemWidth, mediaWidth, $('.list-body', this).sub(0));

                });
                return this;
            }
        }
    });

    declare('see.PageList', {
        _init: function (currentPage, maxAnchorNumber, style) {
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
        ajax: function (url, callback, prePageItemNumber) {
            var that = this;
            if (_.util.bool.isStr(url)) {
                new _.async.Request({
                    url: url
                }).done(function (data) {
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
        setter: function (totalItemNumber, prePageItemNumber) {
            prePageItemNumber = prePageItemNumber || 7;
            this.pageNumber = Math.ceil(totalItemNumber / prePageItemNumber);
        },
        getData: function () {
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
        appendist: function (target, gotoPreviousAnchorname, gotoNextAnchorname, gotoFirstAnchorname, gotoLastAnchorname) {
            $(target).append(this.getList(gotoPreviousAnchorname, gotoNextAnchorname, gotoFirstAnchorname, gotoLastAnchorname));
        }
    });

    _.extend(_.see, {
        NavMenu: {
            auto: function () {
                $('.tangram-see. menu[data-ic-auto]').each(function () {
                    if (($(this).data('icAuto') != 'false') && ($(this).data('icRendered') != 'navmenu')) {
                        $(this).data('icRendered', 'navmenu');
                        new _.see.NavMenu(this);
                    }
                });
            }
        },
        List: {
            auto: function () {
                var List = this;
                $('.tangram-see .articlelist[data-ic-auto]').each(function () {
                    if (($(this).data('icAuto') != 'false') && ($(this).data('icRendered') != 'articlelist')) {
                        $(this).data('icRendered', 'articlelist');
                        new List(this);
                    }
                });
            }
        }
    });
});