tangram.block([
    '$_/dom/',
    'http://api.map.baidu.com/getscript?v=1.1&ak=&services=true&t=20130716024058',
    'http://api.map.baidu.com/res/11/bmap.css'
], function(_, global, undefined) {
    var BMap = global.BMap,
        BMAP_NAVIGATION_CONTROL_LARGE = global.BMAP_NAVIGATION_CONTROL_LARGE,
        BMAP_ANCHOR_BOTTOM_RIGHT = global.BMAP_ANCHOR_BOTTOM_RIGHT,
        BMAP_ANCHOR_BOTTOM_LEFT = global.BMAP_ANCHOR_BOTTOM_LEFT,
        addNavigationControl = function(map) {
            //向地图中添加缩放控件
            var ctrl_nav = new BMap.NavigationControl({
                anchor: BMAP_ANCHOR_TOP_LEFT,
                type: BMAP_NAVIGATION_CONTROL_LARGE
            });
            map.addControl(ctrl_nav);
        },
        addOverviewControl = function(map) {
            //向地图中添加缩略图控件
            var ctrl_ove = new BMap.OverviewMapControl({
                anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
                isOpen: 1
            });
            map.addControl(ctrl_ove);
        },
        addScaleControl = function(map) {
            //向地图中添加比例尺控件
            var ctrl_sca = new BMap.ScaleControl({
                anchor: BMAP_ANCHOR_BOTTOM_LEFT
            });
            map.addControl(ctrl_sca);
        },
        createInfoWindow = function(mark) {
            return new BMap.InfoWindow("<b class='iw_poi_title' title='" + mark.title + "'>" + mark.title + "</b><div class='iw_poi_content'>" + mark.content + "</div>");
        },
        createIcon = function(icon) {
            return new BMap.Icon(icon.png || _.core.dir() + 'add-ins/BaiduMap/icon.png', new BMap.Size(icon.w, icon.h), {
                imageOffset: new BMap.Size(-icon.l, -icon.t),
                infoWindowOffset: new BMap.Size(icon.lb + 5, 1),
                offset: new BMap.Size(icon.x, icon.h)
            });
        };

    _.declareClass('BaiduMap', {
        map: null,
        _init: function(elem, options) {
            if (options && options.coords) {
                elem = _.util.type.isElement(elem) ? elem : document.getElementById(elem);
                _.dom.addClass(elem, 'tangram-addin-map');
                var id = _.dom.getAttr(elem, 'id') || _.dom.setAttr(elem, 'id', (new _.Identifier()).toString());

                //在百度地图容器中创建一个地图
                var map = new BMap.Map(id),
                    //定义一个中心点坐标
                    point = new BMap.Point(options.coords[0], options.coords[1]);

                //设定地图的中心点和坐标并将地图显示在地图容器中
                map.centerAndZoom(point, options.zoom || 18);
                this.map = map;
                this.listenEvents();

                //向地图添加控件
                if (options.navigation !== null && options.navigation !== false) {
                    addNavigationControl(map);
                }
                if (options.overview !== null && options.overview !== false) {
                    addOverviewControl(map);
                }
                if (options.scale !== null && options.scale !== false) {
                    addScaleControl(map);
                }
                if (options.title) {
                    this.addMarker({
                        title: options.title,
                        content: options.desc || options.title,
                        point: options.coords,
                        isOpen: options.isOpen || 0,
                        icon: options.icon || {
                            img: _.core.dir() + 'add-ins/BaiduMap/icon.png',
                            // 宽度
                            w: 21,
                            // 高度
                            h: 21,
                            // 左偏移
                            l: 0,
                            // 上偏移
                            t: 0,
                            // 横坐标
                            x: 6,
                            lb: 5
                        }
                    });
                }
                if (options.marks) {
                    for (var i = 0; i < options.marks.length; i++) {
                        this.addMarker(options.marks[i]);
                    }
                }
            } else {
                _.error('coordsinates of central location must be given');
            }
        },
        addMarker: function(mark) {
            var point = new BMap.Point(mark.point[0], mark.point[1]),
                marker = new BMap.Marker(point, {
                    icon: createIcon(mark.icon)
                }),
                info = createInfoWindow(mark),
                label = new BMap.Label(mark.title, {
                    "offset": new BMap.Size(mark.icon.lb - mark.icon.x + 15, -20)
                });

            marker.setLabel(label);

            this.map.addOverlay(marker);
            label.setStyle({
                borderColor: "#808080",
                color: "#333",
                cursor: "pointer"
            });

            marker.addEventListener("click", function() {
                this.openInfoWindow(info);
            });
            info.addEventListener("open", function() {
                marker.getLabel().hide();
            });
            info.addEventListener("close", function() {
                marker.getLabel().show();
            });
            label.addEventListener("click", function() {
                marker.openInfoWindow(info);
            });
            if (!!mark.isOpen) {
                label.hide();
                marker.openInfoWindow(info);
            }
        },
        listenEvents: function() {
            this.map.enableDragging(); //启用地图拖拽事件，默认启用(可不写)
            this.map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
            this.map.enableDoubleClickZoom(); //启用鼠标双击放大，默认启用(可不写)
            this.map.enableKeyboard(); //启用键盘上下左右键移动地图
        }
    });
});