/*!
 * tangram.js framework source code
 * 互联代码块框架源码
 * A Web Front-end Development Javascript framework
 * 一个互联网前端开发脚本框架
 * Mainly Use For DOM Operation, Data Operation, Graphic Processing, Front-end UI, And Some Basic Calculations.
 * 主要用于DOM操作，数据操作，图形相关，前端视觉，和一些基础计算。
 *
 * Written and Designed By Jang Ts
 * http://nidn.yangram.com/tangram.js/
 *
 * Date 2017-04-06
 */
;
(function(global, factory) {
    if (typeof exports === 'object' && typeof module === 'object') {
        // console.log(1);
        global.console = console;
        global.tangram = factory(global);
        exports = module.exports = {
            tangram: global.tangram,
            block: global.tangram.block
        }
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        // console.log(0);
        define('tangram', [], function() {
            return factory(global);
        });
    } else if (typeof exports === 'object') {
        exports.tangram = factory(global);
        exports.block = exports.tangram.block;
    } else {
        // console.log(2);
        global.tangram = factory(global);
        global.block = global.tangram.block;
    }

}(this, function(global, undefined) {

    /**
     * ------------------------------------------------------------------
     * Runtime Environment Initialization
     * 运行环境初始化
     * ------------------------------------------------------------------
     */

    var name = 'tangram.js JavaScript framework',
        version = '0.9.00',
        website = 'nidn.yangram.com/tangram.js/',

        /* 获取当前时间戳 */
        startTime = new Date(),

        /* 启用调试模式 */
        useDebugMode = false,

        /* 备份全局变量的引用，以防止这些变量被其他代码修改 */
        console = global.console,
        open = global.open,
        location = global.location,
        document = global.document,
        // 获取页面的head元素，如果没有的话，创建之
        head = (function() {
            if (document !== undefined) {
                if (document.head) {
                    return document.head;
                }

                // 兼容一些奇怪的浏览器
                var head = document.getElementsByTagName('head')[0];
                if (head) {
                    return head;
                }
                /* 如果原网页中没有HEAD标签，则创建一个 */
                head = document.createElement('head'),
                    documentElement = document.documentElement || document.getElementsByTagName('*')[0];
                documentElement.appendChild(head);
                return head;
            }
        })(),

        /********************
         * Get Information of runtime
         * 获取运行环境信息
         */

        /* 定义计算相对路径的函数 */
        calculateRelativePath = function(uri, reference) {
            /* 如果不指定目标dir，则和当前页面dir比较 */
            reference = reference || maindir;

            var i = 0,
                pathname_array = uri.split('/'),
                referdir_array = reference.split('/');
            pathname_array.length--;
            referdir_array.length--;

            //console.log(pathname_array, referdir_array)

            /* 如果皆不为本地文件 */
            if (pathname_array[i] !== 'file:' && referdir_array[i] !== 'file:') {
                /* 通过检查数组的前三位，以确保当前pathname与目标dir的协议及主机一致 */
                for (i; i < 3; i++) {
                    if (pathname_array[i] != referdir_array[i]) {
                        return pathname_array.join('/') + '/';
                    }
                }
            }
            /* 如果存在本地文件 */
            else {
                /* 通过检查数组的前五位，以确保当前pathname与目标dir的协议、盘符及根目录一致 */
                for (i; i < 5; i++) {
                    /* 如果当前pathname与目标dir的协议及盘符不一致，则直接返回当前pathname */
                    if (pathname_array[i] != referdir_array[i]) {
                        return pathname_array.join('/') + '/';
                    }
                }
            }

            /* 如果通过以上检查，则进行相对性比较 */
            var pathname = './';
            for (i; i < referdir_array.length; i++) {
                if (pathname_array[i] != referdir_array[i]) {
                    var l = 0,
                        len = referdir_array.length - i;
                    for (l; l < len; l++) {
                        pathname += '../';
                    }
                    break;
                }
            }
            for (i; i < pathname_array.length; i++) {
                pathname += pathname_array[i] + '/';
            }
            return pathname;
        },

        /* 计算宿主文件的目录地址 */
        maindir = (function() {
            if (location !== undefined) {
                var pathname_array = location.pathname.split('/');
                pathname_array.length--;
                return location.origin + pathname_array.join('/') + '/';
            }
        })(),

        /* 计算核心运行文件的相关信息 */
        runtime = (function() {
            if (document !== undefined) {
                var scripts = document.getElementsByTagName('script'),
                    preg = /([\w\-\.\/:]+\/)tangram[\w\-\.]*\.js/i,
                    i,
                    src,
                    matchs;
                for (i = scripts.length - 1; i >= 0; i--) {
                    if (scripts[i].hasAttribute('tangram.js')) {
                        return {
                            Element: scripts[i],
                            Pathname: calculateRelativePath(scripts[i].src)
                        };
                    }
                    src = scripts[i].src || '';
                    matchs = src.match(preg);
                    if (matchs) {
                        return {
                            Element: scripts[i],
                            Pathname: calculateRelativePath(src)
                        };
                    }
                };
            }
            return {
                Element: null,
                Pathname: './'
            };
        })();

    /**
     * ------------------------------------------------------------------
     * Core Function Definition
     * 定义核心函数
     * ------------------------------------------------------------------
     */

    var slice = function(arrayLike, startIndex, endIndex) {
            startIndex = parseInt(startIndex) || 0;
            return Array.prototype.slice.call(arrayLike, startIndex, endIndex);
        },

        /********************
         * Exception Handling
         * 错误处理
         */

        /* 强制报错：当方法被调用时抛出相应的错误描述 */
        error = function(str) {
            throw "tangram.js Error: " + str;
        },

        /* 调式报错：只有tangram.js处于调试模式时，才会抛出相应的错误描述，否则返回一个布尔值 */
        debug = function(str) {
            if (useDebugMode) {
                error(str);
            } else {
                return false;
            }
        },

        /********************
         * Traversal and Copy
         * 遍历与拷贝
         */

        /* 一般遍历：用以遍历对象，并执行相应操作 */
        each = function(obj, handler, that) {
            /* 首先检查是否为空对象或空值。 */
            if (typeof(obj) == 'object' && obj) {
                /* 截取传入的不定参数 */
                var addArgs = slice(arguments, 3);
                /* 判断是否为数组对象 */
                if ((obj instanceof Array) || (Object.prototype.toString.call(obj) === '[object Array]') || ((typeof(obj.length) === 'number') && ((typeof(obj.item) === 'function') || (typeof(obj.splice) != 'undefined')))) {
                    for (var i = 0; i < obj.length; i++) {
                        handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                    }
                } else {
                    for (var i in obj) {
                        handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                    }
                }
            }
        },

        /* 可控遍历：相比通用遍历：多了一个中断方法 */
        loop = (function() {
            /* 高级遍历方法的中断参数，当其值为是时，将中断当前遍历 */
            var BREAK = false;

            /* 高级遍历方法的中断：其作用是将终端参数的值设为是 */
            loop.out = function() {
                BREAK = true;
            };

            function loop(obj, handler, that) {
                /* 首先检查是否为空对象或空值。 */
                if (typeof(obj) == 'object' && obj) {
                    /* 截取传入的不定参数 */
                    var addArgs = slice(arguments, 3);

                    /* 初始化中断参数 */
                    BREAK = false;

                    /* 判断是否为数组对象 */
                    if ((obj instanceof Array) || (Object.prototype.toString.call(obj) === '[object Array]') || ((typeof(obj.length) === 'number') && ((typeof(obj.item) === 'function') || (typeof(obj.splice) != 'undefined')))) {
                        for (var i = 0; i < obj.length; i++) {
                            if (BREAK) {
                                BREAK = false;
                                break;
                            }
                            handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                        }
                    } else {
                        for (var i in obj) {
                            if (BREAK) {
                                BREAK = false;
                                break;
                            }
                            handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                        }
                    }
                }
            }
            return loop;
        })(),

        /* 深度拷贝：复制一个对象时逐层复制每一个子对象 */
        deep = function(source) {
            var type = Object.prototype.toString.call(source).match(/\[object (\w+)\]/)[1];
            if (type === 'Object') {
                var clone = {};
                each(source, function(key) {
                    if (source.hasOwnProperty(key)) {
                        clone[key] = deep(source[key]);
                    }
                });
                return clone;
            }
            if (type === 'Array') {
                return source.map && source.map(function(v) {
                    return deep(v);
                });
            }
            return source;
        },

        /* 影子拷贝：复制一个对象时只复制对象的基本类型 */
        shallow = function(source) {
            var target = {};
            each(source, function(key, value) {
                target[key] = value;
            });
            return target;
        },

        /* 对象拓展：复制一些对象的元素到指定的对象 */
        extend = function(base) {
            base = (base && (typeof(base) === 'object' || typeof(base) === 'function')) ? base : global;
            var rewrite = (arguments[1] === 1 || arguments[1] === true) ? true : false;
            each(slice(arguments, 1), function(index, source) {
                each(source, function(key, value) {
                    if (source.hasOwnProperty(key)) {
                        /* 判断是否需要覆盖 */
                        if (typeof base[key] === 'undefined' || rewrite) {
                            base[key] = value;
                        }
                    }
                });
            });
            return base;
        },

        /* 对象更新：仅当对象含有该元素且其值不为undefined时有效 */
        update = function(base) {
            base = (base && (typeof(base) === 'object' || typeof(base) === 'function')) ? base : global;
            each(slice(arguments, 1), function(index, source) {
                each(source, function(key, value) {
                    if (!(base[key] === undefined) && source.hasOwnProperty(key)) {
                        base[key] = value;
                    }
                });
            });
            return base;
        };

    /**
     * ------------------------------------------------------------------
     * Define Generic Data Cache Container, and hanlders of locker area
     * 定义通用数据缓存容器，及缓存区的操作方法
     * ------------------------------------------------------------------
     */

    var storage = {
            maps: {
                /* 链接标签映射 */
                linkTags: {},
                /* 缺省加载源类型 */
                sourceTypes: {
                    js: {
                        tag: 'script',
                        source: 'src'
                    },
                    css: {
                        tag: 'link',
                        source: 'href',
                        attrs: {
                            type: 'text/css',
                            rel: 'stylesheet'
                        }
                    },
                    img: {
                        tag: 'img',
                        source: 'src'
                    }
                },
                /* 标识符注册表 */
                identifiersReg: [],
                /* 标识符描述映射表 */
                identifiersMap: {},
            },
            classes: {},
            classesSharedSpace: {},
            locales: {},
            core: runtime,
            packagesUrl: runtime.Pathname,
            blocks: {
                /* 临时代码块缓存 */
                temp: [],
                /* 主代码块 */
                mains: [],
                /* 从（引用）代码块 */
                requires: {}
            },
            mainUrl: './',
            locker: {},
            afters: []
        },

        /* 缓存接口 */
        lockerHandlers = {
            /**
             * 储存
             * 
             * @param mixed     data    数据
             * @param string    salt    自定义标识
             * @return string
             */
            save: function(data, salt) {
                key = new Identifier(salt).toString();
                storage.locker[key] = data;
                return key
            },

            /**
             * 读取
             * @param string key 缓存密钥
             * @return mixed
             */
            read: function(key) {
                return storage.locker[key]
            },

            /**
             * 删除
             * 
             * @param string key 缓存密钥
             * @return undefined
             */
            dele: function(key) {
                storage.locker[key] = undefined;
                delete storage.locker[key]
            },

            /**
             * 检查缓存列表，仅调试模式下可用
             * 
             * @return undefined
             */
            chck: function() {
                if (useDebugMode) {
                    var i;
                    each(storage.locker, function(index, locker) {
                        i++;
                        console.log(locker);
                    });
                    i === undefined && console.log('no data in locker');
                } else {
                    error('The locker list can be checked only in the debug mode.');
                }
            }
        };

    /**
     * ------------------------------------------------------------------
     * Identifier, Iterator and LoadURL
     * 唯一标识符、迭代器，及加载器
     * ------------------------------------------------------------------
     */

    var zero2z = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),

        /* 获取随机标识符 */
        getUid = function(radix) {
            var uid = new Array(36);
            for (var i = 0; i < 36; i++) {
                uid[i] = zero2z[Math.floor(Math.random() * radix)];
            }
            uid[8] = uid[13] = uid[18] = uid[23] = '-';
            return uid.join('');
        },

        /**
         * @class Identifier
         * 定义标识符类
         */
        Identifier = function(salt, type) {
            this._init(salt, type);
        },

        /**
         * @class Iterator
         * 定义迭代器类
         */
        Iterator = function(obj, onlyKey) {
            this._init(obj, onlyKey);
        },

        /* URL加载函数 */
        loadURL = function(url, callback, parent, type) {
            parent = (parent && typeof parent.appendChild === 'function') ? parent : head;
            var loadType = storage.maps.sourceTypes[type] || storage.maps.sourceTypes.js,
                Element = document.createElement(loadType.tag);
            Element[loadType.source] = url;
            var source = Element[loadType.source];
            var callback = typeof callback === 'function' ? callback : function() {
                console.log(source + ' loaded.');
            };
            if (storage.maps.linkTags[source]) {
                Element = storage.maps.linkTags[source];
                if (Element.isLoaded) {
                    setTimeout(function() {
                        callback(Element);
                    }, 0);
                    return;
                }
            } else {
                storage.maps.linkTags[source] = Element;
                Element.setAttribute('async', '');
                if (loadType.attrs) {
                    each(loadType.attrs, function(attr, val) {
                        Element[attr] = val;
                    });
                };
                parent.appendChild(Element);
            };
            if (typeof(Element.onreadystatechange) === 'object') {
                Element.attachEvent('onreadystatechange', function() {
                    if (Element.readyState === 'loaded' || Element.readyState === 'complete') {
                        Element.isLoaded = true;
                        callback(Element);
                    };
                });
            } else if (typeof(Element.onload) === 'object') {
                Element.addEventListener('load', function() {
                    Element.isLoaded = true;
                    callback(Element);
                });
            };
        };

    /********************
     * Bind Prototypes To Identifier And Iterator
     * 绑定标识符构造器与迭代器的原型
     */

    /* 为标识符构造器绑定原型 */
    storage.classes.Identifier = Identifier.prototype = {
        _p: storage.classesSharedSpace,

        /**
         * 标识符构造函数
         * 
         * @param string|int    salt    其值为字串时，为自定义标识；为数字时为返值类型
         * @param int           type    返值类型，当salt为字串时有效
         * @return 构造函数，无返值
         */
        _init: function(salt, type) {
            if (typeof salt != 'string') {
                type = salt;
                salt = undefined;
            }
            if (typeof storage.maps.identifiersMap[salt] != 'undefined') {
                var uid = storage.maps.identifiersMap[salt];
            } else {
                var radix = 36;
                if (type == 0) {
                    radix = 10;
                } else if (type == 2) {
                    radix = 62;
                }
                uid = getUid(radix);
                while (storage.maps.identifiersReg.indexOf(uid) >= 0) {
                    uid = getUid(radix);
                }
                storage.maps.identifiersReg.push(uid);
                if (salt) {
                    storage.maps.identifiersMap[salt] = uid;
                }
            }
            this.toString = function() {
                return uid;
            };
        },

        /**
         * 批量拓展实例的属性和元素
         * 
         * @param array     members
         * @param bool      strict
         * @return Identifier
         */
        _x: function(members, strict) {
            if (strict) {
                update(this, members);
            } else {
                extend(this, true, members);
            }
            return this;
        },

        /**
         * 拷贝实例
         * 
         * @return object
         */
        _c: function() {
            return deep(this);
        }
    };

    /* 为迭代器绑定原型 */
    storage.classes.Iterator = Iterator.prototype = new Array;

    /* 拓展迭代器的原型 */
    extend(Iterator.prototype, true, {
        _p: storage.classesSharedSpace,

        /**
         * 迭代器构造函数
         * 
         * @param object    obj     用以初始化的对象
         * @param int       onlyKey 是否只录入对象的键
         * @return 构造函数，无返值
         */
        _init: function(obj, onlyKey) {
            if ((obj instanceof Array) || (Object.prototype.toString.call(obj) === '[object Array]') || ((typeof(obj.length) === 'number') && ((typeof(obj.item) === 'function') || (typeof(obj.splice) != 'undefined')))) {
                // if obj is an array object
                for (var i = 0; i < obj.length; i++) {
                    this.push(obj[i]);
                }
            } else {
                // if obj is an normal object
                each(obj, function(index, val) {
                    if (onlyKey) {
                        this.push(index);
                    } else {
                        this.push([index, val]);
                    }
                }, this);
            }
            this.__ = -1;
        },

        /**
         * 指定指针位置
         * 
         * @param int   index
         * @return mixed
         */
        point: function(index) {
            if (value < 0) {
                this.__ = 0;
            } else if (value >= this.length) {
                this.__ = this.length - 1;
            }
            return this[this.__];
        },

        /**
         * 读取第一个元素，同时指针也会跳到开始位置
         * 
         * @return mixed
         */
        first: function() {
            this.__ = 0;
            return this[this.__];
        },

        /**
         * 读取最后一个元素，同时指针也会跳到最后
         * @return mixed
         */
        last: function() {
            this.__ = this.length - 1;
            return this[this.__];
        },

        /**
         * 判断是否存在下一个元素
         * @return array
         */
        hasNext: function() {
            var next = this.__ + 1;
            if (next < 0 || next >= this.length || null == this[next]) {
                return false;
            }
            return true;
        },

        /**
         * 读取当前元素
         * 
         * @return array
         */
        get: function() {
            return this[this.__];
        },

        /**
         * 替换当前元素
         * 
         * @param mixed elem    新元素
         * @return mixed
         */
        set: function(elem) {
            this[this.__] = elem;
            return elem;
        },

        /**
         * 读取下一个元素
         * 
         * @return mixed
         */
        next: function() {
            if (this.hasNext()) {
                return this[++this.__];
            }
            return undefined;
        },

        /**
         * 一个可控遍历, 如果中途退出，则返回上次回调的返值
         * 
         * @param function  callback    回调函数
         * @return mixed
         */
        each: function(callback) {
            var BREAK = false,
                lastReturn;
            this.out = function() {
                BREAK = true;
            }
            for (var i = 0; i < this.length; i++) {
                if (BREAK) {
                    BREAK = false;
                    delete this.out;
                    return lastReturn;
                }
                lastReturn = callback.call(this, this[i]);
            }
            return true;
        },

        /**
         * 更新这个迭代器的所有元素
         * 
         * @param function  callback    回调函数
         * @return mixed
         */
        map: function(callback) {
            for (var i = 0; i < this.length; i++) {
                this[index] = callback.call(this, this[index]);
            };
            return this;
        },
        _x: Identifier.prototype._x,
        _c: Identifier.prototype._c
    });

    /**
     * ------------------------------------------------------------------
     * Definition of Pandora Box and Class Factory
     * 初始化潘多拉盒子与类工厂
     * ------------------------------------------------------------------
     */

    var namingExpr = /^[A-Z_\$][\w\$]*(\.[A-Z_\$][\w\$]*)*$/i,

        /********************
         * The Pandora's box
         * 潘多拉盒子
         */

        /* 潘多拉拓展接口 */
        pandora = storage.pandora = (function() {
            /**
             * 拓展潘多拉对象
             * 
             * @param string    name    元素名称
             * @param mixed     value   元素值
             * @param bool      update  是否覆盖已有值
             * @return object
             */
            function pandora(name, value, update) {
                if (namingExpr.test(name)) {
                    var object = pandora,
                        NameSplit = name.split('.');
                    value = value || {};
                    for (var i = 0; i < NameSplit.length && object; i++) {
                        if (i == NameSplit.length - 1) {
                            if ((object[NameSplit[i]] === undefined) || (typeof value !== 'object')) {
                                object[NameSplit[i]] = value;
                                object = object[NameSplit[i]];
                            } else {
                                object = object[NameSplit[i]];
                                for (var k in value) {
                                    object[k] = update ? value[k] : object[k] || value[k];
                                }
                            }
                        } else if (NameSplit[i] != '') {
                            object[NameSplit[i]] = object[NameSplit[i]] || {};
                            object = object[NameSplit[i]];
                        };
                    };
                    return object;
                }
                return error('Can not reput \'' + name + '\' into pandora box.');
            };

            /* 初始化潘多拉接口 */
            return extend(pandora, {
                /* 获取运行环境信息 */
                core: {
                    /**
                     * 获取开始时间
                     * 
                     * @return float
                     */
                    startTime: function() {
                        return startTime;
                    },

                    /**
                     * 获取作者信息
                     * 
                     * @return string
                     */
                    author: function() {
                        return author;
                    },

                    /**
                     * 获取tangram.js全名
                     * 
                     * @return string
                     */
                    name: function() {
                        return name;
                    },

                    /**
                     * 获取当前版本信息
                     * 
                     * @param string
                     */
                    version: function() {
                        return version;
                    },

                    /**
                     * 转到tangram.js官网
                     * 
                     * @return undefined
                     */
                    website: function() {
                        open(website, name);
                    },

                    /**
                     * 获取当前文件URL
                     * 
                     * @return string
                     */
                    dir: function() {
                        return storage.core.Pathname;
                    },
                },

                /**
                 * 强制报错
                 * 中止脚本，并抛出相应的文字描述
                 * 
                 * @param string str 需要抛出的信息
                 * @return undefined
                 */
                error: error,

                /**
                 * 调试报错
                 * 调试模式下，中止脚本，并抛出相应的文字描述
                 * 生产模式下，返回一个布尔值false，对进程不产生影响
                 * 
                 * @param string str 需要抛出的信息
                 * @return undefined|bool
                 */
                debug: debug,

                /**
                 * 计算相对路径
                 * 比较两个url，计算他们的相对路径（如果确实存在的话）
                 * 
                 * @param string            uri        进行比较的url
                 * @param string|undefined  reference  被比较的url，可以留空，默认为当前页面的url
                 * @return string
                 */
                relativePath: calculateRelativePath,

                /**
                 * 转换为数组，并截取之
                 * 
                 * @param object            arrayLike       数组或类似数组的对象
                 * @param int               startIndex      截取的起始位置，可留空，默认值为0
                 * @param int|undefined     endIndex        截取的结束位置，可留空，默认为截取的结尾位置
                 * @return undefined
                 */
                slice: slice,

                /**
                 * 一般遍历：用以遍历对象，并执行相应操作
                 * 
                 * @param object    obj         遍历的对象
                 * @param function  handler     处理元素的回调函数
                 * @param object    that        指定一个回调函数的调用对象
                 * @return undefined
                 */
                each: each,

                /**
                 * 可控遍历：相比通用遍历：多了一个中断方法
                 * 
                 * @param object    obj         遍历的对象
                 * @param function  handler     处理元素的回调函数
                 * @param object    that        指定一个回调函数的调用对象
                 * @return array
                 */
                loop: loop,

                /**
                 * 复制对象
                 * 
                 * @param object        source      源对象
                 * @param bool|int      deeply      是否深拷贝，默认为否
                 * @return object
                 */
                clone: function(source, deeply) {
                    if (deeply === true || deeply === 1) {
                        return deep(source);
                    } else {
                        return shallow(source);
                    }
                },

                /**
                 * 拷贝对象
                 * 
                 * @param object        source      源对象
                 * @param bool|int      shallowly   是否浅拷贝，默认为否
                 * @return object
                 */
                copy: function(source, shallowly) {
                    if (shallowly === true || shallowly === 1) {
                        return shallow(source);
                    } else {
                        return deep(source);
                    }
                },

                /**
                 * 对象拓展：复制一些对象的元素到指定的对象
                 * 
                 * @param object base 被拓展的对象
                 * @return object
                 */
                extend: extend,

                /**
                 * 对象更新：仅当对象含有该元素且其值不为undefined时有效
                 * 
                 * @param object base 被更新的对象
                 * @return object
                 */
                update: update,

                /**
                 * 加载URL
                 * 
                 * @param string    url         加载文件的路径
                 * @param function  callback    加载成功后的回调函数
                 * @param object    parent      加载资源的存放元素，默认为head元素
                 * @param string    type        加载资源的类型，支持js、css、img，默认为js
                 * @return undefined
                 */
                load: loadURL,

                /**
                 * @class Iterator
                 * 迭代器类
                 */
                Iterator: Iterator,

                /**
                 * @class Identifier
                 * 标识符类
                 */
                Identifier: Identifier,

                /**
                 * 返回当前URL
                 * 
                 * @return string
                 */
                mainUrl: function() {
                    return storage.mainUrl;
                },

                /* 私有缓存区操作 */
                locker: lockerHandlers,

                /* 命名正则 */
                namingExpr: namingExpr,

                /**
                 * 检查具名类
                 * 
                 * @param array list
                 * @return bool
                 */
                checkClass: function(list) {
                    list = list || [];
                    each(list, function(i, classname) {
                        if (!storage.classes[classname]) {
                            return false;
                        }
                    });
                    return true;
                },

                /**
                 * 检查潘多拉盒子
                 * 
                 * @param array list
                 * @return bool
                 */
                checkPandora: function(list) {
                    list = list || [];
                    each(list, function(i, objName) {
                        var names = objName.split('.');
                        var object = pandora;
                        each(names, function(index, name) {
                            object = object[name];
                            if (!object) {
                                return false;
                            }
                        });
                    });
                    return true;
                },

                /**
                 * 异步代码块
                 * 
                 * @param array     includes
                 * @param function  callback
                 * @return object
                 */
                asyncBlocks: function(includes, callback) {
                    return block(includes, callback, true);
                },

                /**
                 * 异步代码块别名
                 * 
                 * @param array     includes
                 * @param function  callback
                 * @return object
                 */
                ab: function(includes, callback) {
                    return block(includes, callback, true);
                },

                /**
                 * 简易渲染
                 * 
                 * @param object    style           样式
                 * @param string    innerHTML       DIV元素的content
                 * @param string    rewritebody     是否重写整个body
                 * @return array
                 */
                render: function(style, innerHTML, rewritebody) {
                    if (rewritebody) {
                        document.body.innerHTML = '';
                    }
                    style = (typeof style === 'object') ? style : {};
                    innerHTML = (typeof style === 'string') ? style : (innerHTML || '');
                    var el = document.createElement('div');
                    each(style, function(p, v) {
                        el.style[p] = v;
                    });
                    el.innerHTML = innerHTML;
                    document.body.appendChild(el);
                    return el;
                },

                /**
                 * 本地化语言包数据读写操作
                 * 
                 * @param string namespace
                 * @return mixed
                 */
                locales: function(namespace) {
                    if (namespace && (typeof namespace === 'string')) {
                        namespace = namespace.toLowerCase();
                        switch (arguments.length) {
                            case 1:
                                if (typeof storage.locales[namespace] === 'object') {
                                    return deep(storage.locales[namespace]);
                                }
                                return undefined;
                            case 2:
                                if (typeof arguments[1] === 'object') {
                                    if (typeof storage.locales[namespace] !== 'object') {
                                        storage.locales[namespace] = {};
                                    }
                                    each(arguments[1], function(lang, value) {
                                        lang = lang.toLowerCase();
                                        if (storage.locales[namespace][lang] === undefined) {
                                            storage.locales[namespace][lang] = value;
                                            var la = lang.substr(0, 2);
                                            if (storage.locales[namespace][la] === undefined) {
                                                storage.locales[namespace][la] = value;
                                            }
                                        }
                                    });
                                    return true;
                                }
                            default:
                                if ((typeof storage.locales[namespace] === 'object') && (typeof arguments[1] === 'string')) {
                                    var lang = arguments[1].toLowerCase(),
                                        value;
                                    if (storage.locales[namespace][lang]) {
                                        value = storage.locales[namespace][lang];
                                    } else {
                                        var la = lang.substr(0, 2);
                                        if (storage.locales[namespace][la]) {
                                            value = storage.locales[namespace][la];
                                        } else {
                                            return undefined;
                                        }
                                    }
                                    var i = 2;
                                    while ((typeof value === 'object') && (typeof arguments[i] === 'string')) {
                                        value = value[arguments[i++]];
                                    }
                                    switch (typeof value) {
                                        case 'object':
                                            return deep(value);
                                        case 'string':
                                            return value;
                                    }
                                }

                        }
                    }
                    return undefined;
                },

                /**
                 * 通用空操作
                 * 
                 * @return object
                 */
                self: function() {
                    return this;
                }
            });
        })(),


        /********************
         * The tangram.js class factory
         * tangram.js类工厂
         */

        /* 祖先类 */
        blockClass = {
            _p: storage.classesSharedSpace,
            _init: function() {},
            _x: Identifier.prototype._x,
            _c: Identifier.prototype._c
        },

        /* 准备类的成员 */
        prepareClassMembers = function(target, data, start) {
            for (start; start < data.length; start++) {
                if (data[start] && typeof data[start] === 'object') {
                    extend(target, true, data[start]);
                } else {
                    return target;
                }
            }
            return target;
        },

        template = 'if(this instanceof constructor){' +
        'this._init.apply(this, arguments);' +
        '}else{' +
        'var instance=new constructor();' +
        'instance._init.apply(instance, arguments);' +
        'return instance;}',

        /* 定义类的方法 */
        produceClass = function(classname, superclass, members) {
            var Class = function() {},
                name,
                constructor;
            Class.prototype = superclass;
            if (classname) {
                name = classname.replace(/\.[A-Za-z]/g, function(s) {
                    return s.replace('.', '').toUpperCase();
                });
                eval('constructor=function ' + name + '(){' + template + '}');
                constructor.prototype = new Class();
                storage.classes[classname] = constructor.prototype
                var old = pandora(classname, {});
                pandora(classname, constructor);
                pandora(classname, old);
            } else {
                constructor = function() {
                    if (this instanceof constructor) {
                        return this._init.apply(this, arguments);
                    } else {
                        var instance = new constructor();
                        instance._init.apply(instance, arguments);
                        return instance;
                    }
                };
                constructor.prototype = new Class();
            };

            members._parent = superclass;
            extend(constructor.prototype, true, members);
            return constructor;
        },

        /* 定义类的通用接口 */
        declareClass = pandora.declareClass = function() {
            var classname,
                superclass,
                members = {};
            if (arguments.length > 0) {
                if (typeof arguments[0] === 'string' && namingExpr.test(arguments[0])) {
                    if (storage.classes[arguments[0]]) {
                        return error('Can not redeclare class "' + arguments[0] + '".');
                    } else {
                        classname = arguments[0];
                        if (typeof arguments[1] === 'function') {
                            superclass = arguments[1].prototype || blockClass;
                            members = prepareClassMembers(members, arguments, 2);
                        } else {
                            superclass = blockClass;
                            members = prepareClassMembers(members, arguments, 1);
                        }
                    }
                } else {
                    classname = false;
                    if (typeof arguments[0] === 'function') {
                        superclass = arguments[0].prototype || blockClass;
                        members = prepareClassMembers(members, arguments, 1);
                    } else {
                        superclass = blockClass;
                        members = prepareClassMembers(members, arguments, 0);
                    }
                }
            } else {
                classname = false;
                superclass = blockClass;
                members = {};
            }
            return produceClass(classname, superclass, members);
        };

    /**
     * ------------------------------------------------------------------
     * Inter Codeblocks Definition
     * 定义互联代码块
     * ------------------------------------------------------------------
     */

    /********************
     * Inter Codeblocks
     * 互联代码块
     */

    var block = function(includes, callback, blockname) {
            return new Block(includes, callback, blockname).result;
        },

        /* 当前主代码块的指针 */
        mainPointer = 0,

        /* 代码块依赖计数 */
        requireCount = 0,
        loadedCount = 0,

        /* 运行从代码块 */
        fireblock = function(block) {
            each(block.requires, function(i, id) {
                var require = storage.blocks.requires[id];
                if (require.status === 'loaded') {
                    require.status = 'fired';
                    each(require.blocks, function(i, require) {
                        fireblock(require);
                    });
                }
            });
            block.id = lockerHandlers.save({});
            block.storage = lockerHandlers.read(block.id);
            var returnObject = block.callback(storage.pandora, global);

            // 将block的返值对象合并到全局变量window，以便在控制台调试
            each(returnObject, function(index, value) {
                global[index] = value;
            });
        },

        /**
         * @class Iterator
         * 代码块类
         */
        Block = declareClass({
            /**
             * 代码块类构造函数
             * 
             * @param array     includes
             * @param function  callback
             * @param string    blockname
             * @return 构造函数，无返值
             */
            _init: function(includes, callback, blockname) {
                this.requires = [];
                this.onload = 0;
                this.loaded = 0;
                switch (typeof includes) {
                    case 'string':
                        this.requires.push(includes);
                        if (typeof callback === 'function')
                            this.callback = callback;
                        break;
                    case 'object':
                        if (includes instanceof Array)
                            this.requires = includes;
                        if (typeof callback === 'function')
                            this.callback = callback;
                        break;
                    case 'function':
                        this.callback = includes;
                        blockname = callback;
                        break;
                };
                requireCount += this.requires.length;
                this.core = {
                    requires: [],
                    callback: this.callback
                };
                if (blockname) {
                    if (blockname === true) {
                        this.mainid = storage.blocks.mains.push(this.core) - 1;
                    } else if (typeof(blockname) === 'string') {
                        storage.blocks.requires[blockname.toLowerCase()] = {
                            blocks: [this.core],
                            status: 'loaded'
                        };
                    }
                } else {
                    storage.blocks.temp.push(this.core);
                    this.mainid = -1;
                }
                this.listene();
            },
            /**
             * 加载完成后的回调函数
             * 
             * @return undefined
             */
            callback: function() {
                console.log('tangram.js has loaded some require libraries.');
            },
            /**
             * 加载下一个
             * 
             * @return undefined
             */
            loadnext: function() {
                var that = this,
                    filetype,
                    url;

                /* 检查引用文件类型 */
                if (this.requires[this.onload].match(/\.css$/)) {
                    filetype = 'css';
                    url = this.requires[this.onload].replace(/^\$_\//, storage.core.Pathname).replace(/^\$\.\//, storage.mainUrl).replace(/^\$pkg\//, storage.packagesUrl);
                } else if (this.requires[this.onload].match(/\?/) || this.requires[this.onload].match(/\.js$/) || this.requires[this.onload].match(/\.json$/)) {
                    filetype = 'js';
                    url = this.requires[this.onload].replace(/^\$_\//, storage.core.Pathname).replace(/^\$\.\//, storage.mainUrl).replace(/^\$pkg\//, storage.packagesUrl);
                } else {
                    filetype = 'js';
                    url = this.requires[this.onload].replace(/^\$_\//, storage.core.Pathname).replace(/^\$\.\//, storage.mainUrl).replace(/^\$pkg\//, storage.packagesUrl) + '.js';
                    url = url.replace(/([A-Z][\w\$]+)\/.js$/, '$1/$1.cls.js').replace(/([a-z][\w\$]+)\/.js$/, '$1/$1.xtd.js');
                }

                if (this.requires[this.onload]) {
                    var id = this.requires[this.onload].toLowerCase();
                    this.core.requires.push(id);
                    this.onload++;
                    if (!!storage.blocks.requires[id]) {
                        this.loaded++;
                        loadedCount++;
                        this.listene();
                    } else {
                        storage.blocks.requires[id] = {
                            status: 'loading',
                            blocks: []
                        };
                        loadURL(url, function(script) {
                            that.loaded++;
                            loadedCount++;
                            script.setAttribute('data-include-id', id);
                            storage.blocks.requires[id].status = 'loaded';
                            storage.blocks.requires[id].blocks = storage.blocks.temp;
                            storage.blocks.temp = [];
                            that.listene();
                        }, false, filetype);
                    }
                } else {
                    this.onload++;
                    this.loaded++;
                    loadedCount++;
                    that.listene();
                };
            },
            /**
             * 监听加载状态
             * 
             * @return undefined
             */
            listene: function() {
                if (this.loaded === this.requires.length) {
                    this.result.status = 0;
                    if (loadedCount === requireCount) {
                        for (mainPointer; mainPointer < storage.blocks.mains.length; mainPointer++) {
                            fireblock(storage.blocks.mains[mainPointer]);
                            if (mainPointer === storage.blocks.mains.length - 1) {
                                each(storage.afters, function(i, codes) {
                                    codes(global, undefined);
                                });
                                storage.afters = [];
                            }
                        };
                    }
                } else if (this.onload < this.requires.length) {
                    this.loadnext();
                }
            },
            result: {
                status: 1
            }
        });

    /* 接口开放到全局 */
    var tangram = {
        block: block,
        /**
         * 全局配置
         * object options {
         *      useDebugMode:是否开启调试模式
         * }
         * 
         * @param object    options
         * @return object
         */
        config: function(options) {
            options = options || {};
            useDebugMode = options.useDebugMode ? true : false;

            if (options.packagesUrl) {
                storage.packagesUrl = options.packagesUrl;
            }

            if (options.mainUrl) {
                var _maindir = maindir,
                    anchor = document.createElement('a');
                anchor.href = options.mainUrl + '/';
                maindir = anchor.href;
                storage.mainUrl = calculateRelativePath(anchor.href, _maindir).replace(/\/+$/, '/');
            }

            if (storage.core.Element === null && options.corePath) {
                var anchor = document.createElement('a');
                anchor.href = options.corePath + '/';
                var src = anchor.href;
                storage.core.Pathname = calculateRelativePath(src);
                storage.core.Element = undefined;
            }
            return block;
        },

        /**
         * 实例化一个主代码块
         * 
         * @param array includes    该代码块所以依赖的其他代码块的文件路径
         * @param function callback 改代码块的代码
         * @return Block
         */
        main: function(includes, callback) {
            return block(includes, callback, true);
        },

        /**
         * 取潘多拉
         * 
         * @return object
         */
        pandora: function() {
            return storage.pandora;
        },

        /**
         * 运行前开放代码块
         * 
         * @param function codes
         * @return undefined
         */
        ready: function(codes) {
            codes(global, undefined);
        },

        /**
         * 运行后开放代码块
         * 
         * @param function codes
         * @return undefined
         */
        after: function(codes) {
            storage.afters.push(codes);
        }
    };

    /**
     * ------------------------------------------------------------------
     * Final Preparations
     * 最后的准备工作
     * ------------------------------------------------------------------
     */

    /* 自动配置 */
    if (storage.core.Element) {
        var config = storage.core.Element.getAttribute('data-config'),
            mains = storage.core.Element.getAttribute('data-mains'),
            debug = storage.core.Element.getAttribute('data-use-debugmode');
        if (config) {
            var url = url + '.js';
            loadURL(url, '$Config');
        };
        if (global.blockConfiguration) {
            tangram.config(global.blockConfiguration);
        }
        if (mains) {
            var mArr = mains.split(/,\s*/);
            each(mArr, function(i, url) {
                var url = url + '.js';
                loadURL(url, '$Main_' + i);
            });
        };
        if (debug != null) {
            useDebugMode = true;
        }
    }

    /* 检查是否调试模式 */
    if (useDebugMode) {
        console.log(storage);
    }

    /* 打卡 */
    if (!global.parent || global.parent == global) {
        console.log('[' + startTime.toLocaleString() + ']tangram.js framework Start Working!');
    }

    return tangram;
}));