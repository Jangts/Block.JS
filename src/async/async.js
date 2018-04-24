/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Tue, 24 Apr 2018 15:55:02 GMT
 */
;
// tangram.config({});
tangram.block([
	'$_/obj/',
	'$_/util/bool',
	'$_/dom/',
	'$_/async/Request'
], function (pandora, global, imports, undefined) {
	var _ = pandora;
	var doc = global.document;
	var location = global.location;
	var console = global.console;
	var FormData = global.FormData;
	var query = _.dom.sizzle || _.dom.query;
	pandora('async', {
		load: _.load,
		loadCSS: function (href, callback) {
			var link = query('link[href="' + href + '"]')[0] || _.dom.create('link', doc.getElementsByTagName('head')[0], {
				type: 'text/css',
				rel: 'stylesheet',
				async: 'async'
			});
			if(!_.dom.getAttr(link, 'href')) {
				link.href = href;
			}
			if(_.dom.getAttr(link, 'loaded') === 'loaded') {
				setTimeout(function () {
					_.util.bool.isFn(callback) && callback();
				}, 0);
			}else {
				if(typeof(link.onreadystatechange) === 'object') {
					link.attachEvent('onreadystatechange', function () {
						if (link.readyState === 'loaded' || link.readyState === 'complete') {
							_.dom.setAttr(link, 'loaded', 'loaded');
							_.util.bool.isFn(callback) && callback();
						}else {
							console.log(link.readyState);
						};
					});
				}else if(typeof(link.onload) !== 'undefined') {
					link.addEventListener('load', function () {
						_.dom.setAttr(link, 'loaded', 'loaded');
						_.util.bool.isFn(callback) && callback();
					});
				};
			};
		},
		loadScript: function (src, callback) {
			var script = query('script[src="' + src + '"]')[0] || _.dom.create('script', doc.getElementsByTagName('head')[0], {
				type: 'application/javascript',
				async: 'async'
			});
			if(!_.dom.getAttr(script, 'src')) {
				script.src = src;
			}
			if(_.dom.getAttr(script, 'loaded')) {
				_.util.bool.isFn(callback) && callback();
			}else {
				if(typeof(script.onreadystatechange) === 'object') {
					script.attachEvent('onreadystatechange', function () {
						if (script.readyState === 'loaded' || script.readyState === 'complete') {
							_.dom.setAttr(script, 'loaded', 'loaded');
							_.util.bool.isFn(callback) && callback();
						};
					});
				}else if(typeof(script.onload) === 'object') {
					script.addEventListener('load', function () {
						_.dom.setAttr(script, 'loaded', '');
						_.util.bool.isFn(callback) && callback();
					});
				};
			};
		},
		ajax: function (url, options) {
			switch (arguments.length) {
				case 2: if(!_.util.bool.isObj(options)) {
					if(_.util.bool.isFn(options)) {
						options = {
							success: options
						};
					}else {
						options = {};
					};
				}
				if(_.util.bool.isStr(url)) {
					options.url = url;
				}
				break;
				case 1: if(_.util.bool.isObj(url)) {
					options = url;
				}else if(_.util.bool.isStr(url)) {
					options = {
						url: url,
						method: 'GET'
					};
				}
				break;
				case 0: options = {
					url: location.href,
					method: 'GET'
				};
				break;
				default: return undefined;
			}
			if (!options.method) {
				if((typeofoptions.data === 'object') || (typeofoptions.data === 'string')) {
					options.method = 'POST';
				}else {
					options.method = 'GET';
					options.data = undefined;
				};
			}
			if(options.data && (options.method.toUpperCase() === 'GET')) {
				if(typeof options.data == 'object') {
					options.data = _.obj.toQueryString(options.data);
				}
				if(typeof options.data == 'string') {
					if(options.url.indexOf('?') !==  -1) {
						options.url = options.url + "&" + options.data;
					}else {
						options.url = options.url + "?" + options.data;
					};
				}
				options.data = undefined;
			}
			var Promise = new _.async.Request(options);
			Promise.success = Promise.done;
			Promise.error = Promise.fail;
			Promise.complete = Promise.always;
			if (options.beforeSend &&  typeof options.beforeSend == 'function') {
				options.beforeSend(Promise.xmlhttp);
			}
			Promise.progress(options.progress).success(options.success).error(options.fail).complete(options.complete);
			if (!options.charset) {
				options.charset = 'UTF-8';
			}
			if (options.data) {
				if(typeof options.data == 'object') {
					if (!options.mime) {
						options.mime = 'multipart/form-data';
					}
					if(!_.util.bool.isForm(options.data)) {
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
				if(typeof options.data == 'string') {
					if (!options.mime) {
						options.mime = 'application/x-www-form-urlencoded';
					}
					return Promise.setRequestHeader('Content-Type', options.mime + '; charset=' + options.charset).send(options.data);
				};
			}else {
				Promise.setRequestHeader('Content-Type', 'text/html; charset=' + options.charset).send();
			};
		},
		json: function (url, doneCallback, failCallback) {
			_.async.ajax({
				url: url,
				success: function (txt) {
					doneCallback(JSON.parse(txt));
				},
				fail: failCallback
			});
		}
	});
	return _.async;
});