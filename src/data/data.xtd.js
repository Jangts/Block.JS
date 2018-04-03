/*!
 * tangram.js framework source code
 *
 * static data
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/util/obj.xtd',
    '$_/util/bool.xtd',
    '$_/dom/',
    '$_/data/XHR.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        location = global.location,
        console = global.console,
        FormData = global.FormData;;


    _('data', {
        load: _.load,
        loadCSS: function(href, callback) {
            var link = _.dom.query('link[href="' + href + '"]')[0] || _.dom.create('link', document.getElementsByTagName('head')[0], {
                type: 'text/css',
                rel: 'stylesheet',
                async: 'async'
            });
            if (!_.dom.getAttr(link, 'href')) {
                link.href = href;
            }

            if (_.dom.getAttr(link, 'loaded') === 'loaded') {
                setTimeout(function() {
                    _.util.bool.isFn(callback) && callback();
                }, 0);
            } else {
                if (typeof(link.onreadystatechange) === 'object') {
                    link.attachEvent('onreadystatechange', function() {
                        if (link.readyState === 'loaded' || link.readyState === 'complete') {
                            _.dom.setAttr(link, 'loaded', 'loaded');
                            _.util.bool.isFn(callback) && callback();
                        } else {
                            console.log(link.readyState);
                        }
                    });
                } else if (typeof(link.onload) !== 'undefined') {
                    link.addEventListener('load', function() {
                        _.dom.setAttr(link, 'loaded', 'loaded');
                        _.util.bool.isFn(callback) && callback();
                    });
                };
            };

        },
        loadScript: function(src, callback) {
            var script = _.dom.query('script[src="' + src + '"]')[0] || _.dom.create('script', document.getElementsByTagName('head')[0], {
                type: 'application/javascript',
                async: 'async'
            });
            if (!_.dom.getAttr(script, 'src')) {
                script.src = src;
            }
            if (_.dom.getAttr(script, 'loaded')) {
                _.util.bool.isFn(callback) && callback();
            } else {
                if (typeof(script.onreadystatechange) === 'object') {
                    script.attachEvent('onreadystatechange', function() {
                        if (script.readyState === 'loaded' || script.readyState === 'complete') {
                            _.dom.setAttr(script, 'loaded', 'loaded');
                            _.util.bool.isFn(callback) && callback();
                        };
                    });
                } else if (typeof(script.onload) === 'object') {
                    script.addEventListener('load', function() {
                        _.dom.setAttr(script, 'loaded', '');
                        _.util.bool.isFn(callback) && callback();
                    });
                };
            };
        },
        AJAX: function(url, options) {
            switch (arguments.length) {
                case 2:
                    if (!_.util.bool.isObj(options)) {
                        if (_.util.bool.isFn(options)) {
                            options = {
                                success: options
                            }
                        } else {
                            options = {};
                        }
                    }

                    if (_.util.bool.isStr(url)) {
                        options.url = url;
                    }
                    break;
                case 1:
                    if (_.util.bool.isObj(url)) {
                        options = url;
                    } else if (_.util.bool.isStr(url)) {
                        options = {
                            url: url,
                            method: 'GET'
                        }
                    }
                    break;
                case 0:
                    options = {
                        url: location.href,
                        method: 'GET'
                    };
                    break;
                default:
                    return undefined;
            }

            if (!options.method) {
                if ((typeof options.data === 'object') || (typeof options.data === 'string')) {
                    options.method = 'POST';
                } else {
                    options.method = 'GET';
                    options.data = undefined;
                }
            }

            // GET方法无法发送数据，需要整理到URL中
            if (options.data && (options.method.toUpperCase() === 'GET')) {
                if (typeof options.data == 'object') {
                    options.data = _.util.obj.toQueryString(options.data);
                }
                if (typeof options.data == 'string') {
                    // console.log(options.url, options.url.indexOf('?'));
                    if (options.url.indexOf('?') !== -1) {
                        options.url = options.url + "&" + options.data;
                    } else {
                        options.url = options.url + "?" + options.data;
                    }
                }
                options.data = undefined;
            }

            var Promise = new _.data.XHR(options);
            Promise.success = Promise.done;
            Promise.error = Promise.fail;
            Promise.complete = Promise.always;
            if (options.beforeSend && typeof options.beforeSend == 'function') {
                options.beforeSend(Promise.xmlhttp);
            };
            Promise.progress(options.progress).success(options.success).error(options.fail).complete(options.complete)
            if (!options.charset) {
                options.charset = 'UTF-8';
            }
            if (!options.mime) {
                options.mime = 'text/html';
            }
            if (options.data) {
                if (typeof options.data == 'object') {
                    if (!_.util.bool.isForm(options.data)) {
                        var formData = new FormData();
                        for (var i in options.data) {
                            formData.append(i, options.data[i]);
                        }
                        options.data = formData;
                    }
                    return Promise.setRequestHeader('Content-Type', options.mime + '; charset = ' + options.charset).send(options.data);
                }
                if (typeof options.data == 'string') {
                    return Promise.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=' + options.charset).send(options.data);
                }
            } else {
                Promise.setRequestHeader('Content-Type', options.mime + ';charset=' + options.charset).send();
            }
        },
        json: function(url, doneCallback, failCallback) {
            _.data.AJAX({
                url: url,
                success: function(txt) {
                    doneCallback(JSON.parse(txt));
                },
                fail: failCallback
            });
        },
        encodeJSON: function(data) {
            try {
                return JSON.stringify(data);
            } catch (error) {
                console.log(error);
                return '';
            }
        },
        decodeJSON: function(txt) {
            try {
                return JSON.parse(txt)
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        encodeQueryString: function(data) {
            return _.util.obj.toQueryString(data)
        },
        decodeQueryString: function(str) {
            str = str.replace(/^#/, '');
            var data = {};
            var fields = str.split('&');
            var i = 0,
                filed;
            for (i; i < fields.length; i++) {
                filed = fields[i].split('=');
                data[filed[0]] = filed[1];
            }
            return data;
        },
        reBuildUrl: function(url, data) {
            if (typeof url === 'object') {
                data = url;
                url = location.href;
            }
            // console.log(url, url.indexOf('?'));
            if (url.indexOf('?') !== -1) {
                return url + "&" + _.util.obj.toQueryString(data);
            }
            return url + "?" + _.util.obj.toQueryString(data);
        },
        cookie: function(name, value, prop) {
            var c = document.cookie,
                ret = null;
            if (arguments.length == 1) {
                if (c && c !== '') {
                    var cookies = c.split(';');
                    for (var i = 0, l = cookies.length; i < l; i++) {
                        var cookie = JY.trim(cookies[i]);
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            ret = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
            } else {
                prop = prop || {};
                var expires = '';
                if (prop.expires) {
                    var date;
                    switch (prop.expires.constructor) {
                        case Number:
                            {
                                date = new Date();
                                date.setTime(date.getTime() + (prop.expires * 1000 * 60 * 60 * 24));
                                date = date.toUTCString();
                            }
                            break;
                        case String:
                            {
                                date = prop.expires;
                            }
                            break;
                        default:
                            {
                                date = prop.expires.toUTCString();
                            }
                            break;
                    }
                    expires = '; expires=' + date;
                }
                var path = prop.path ? '; path=' + (prop.path) : '';
                var domain = prop.domain ? '; domain=' + (prop.domain) : '';
                var secure = prop.secure ? '; secure' : '';
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            }
            return ret;
        }
    });
});