/*!
 * tangram.js framework source code
 *
 * static data
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/obj/',
    '$_/util/bool',
    '$_/dom/',
    '$_/async/Request'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        location = global.location,
        console = global.console,
        FormData = global.FormData,
        query = _.dom.sizzle || _.dom.query;


    _('async', {
        load: _.load,
        loadCSS: function(href, callback) {
            var link = query('link[href="' + href + '"]')[0] || _.dom.create('link', doc.getElementsByTagName('head')[0], {
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
            var script = query('script[src="' + src + '"]')[0] || _.dom.create('script', doc.getElementsByTagName('head')[0], {
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
        ajax: function(url, options) {
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
                    options.data = _.obj.toQueryString(options.data);
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

            var Promise = new _.async.Request(options);
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

            if (options.data) {
                if (typeof options.data == 'object') {
                    if (!options.mime) {
                        options.mime = 'multipart/form-data';
                    }
                    if (!_.util.bool.isForm(options.data)) {
                        if (options.mime === 'application/json') {
                            return Promise.setRequestHeader('Content-Type', 'application/json; charset=' + options.charset).send(JSON.stringify(options.data));
                        }
                        var formData = new FormData();
                        for (var i in options.data) {
                            formData.append(i, options.data[i]);
                        }
                        options.data = formData;
                    }
                    return Promise.send(options.data);
                }
                if (typeof options.data == 'string') {
                    if (!options.mime) {
                        options.mime = 'application/x-www-form-urlencoded';
                    }
                    return Promise.setRequestHeader('Content-Type', options.mime + '; charset=' + options.charset).send(options.data);
                }
            } else {
                Promise.setRequestHeader('Content-Type', 'text/html; charset=' + options.charset).send();
            }
        },
        json: function(url, doneCallback, failCallback) {
            _.async.ajax({
                url: url,
                success: function(txt) {
                    doneCallback(JSON.parse(txt));
                },
                fail: failCallback
            });
        }
    });
});