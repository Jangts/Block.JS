/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Sun, 06 May 2018 09:07:04 GMT
 */
;
// tangram.config({});
tangram.init().block([
	'$_/obj/',
	'$_/str/hash'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var _ = pandora;
	var doc = root.document;
	var console = root.console;
	var location = root.location;
	var localStorage = root.localStorage;
	var data = {};
	pandora.declareClass('data.Storage', {
		_init: function (name) {
			if (name && (typeof name === 'string')) {
				this.id = _.str.hash.md5.pseudoIdentity(name);
			}
			else {
				this.id = new _.Identifier(name,1).toString();
			}
			try {
				data[this.id] = root.JSON.parse(localStorage[this.id]);
				this.length = _.obj.length(data[this.id], true);
			}
			catch (e) {
				data[this.id] = {};
				localStorage[this.id] = '{}';
				this.length = 0;
			}
			return this;
		},
		set: function (key, value) {
			if (key && typeof key === 'string') {
				if (value === undefined) {
					if (data[this.id].hasOwnProperty(key)) {
						delete data[this.id][key];
						localStorage[this.id] = root.JSON.stringify(data[this.id]);
						this.length = _.obj.length(data[this.id], true);
					}
				}
				else {
					data[this.id][key] = value;
					localStorage[this.id] = root.JSON.stringify(data[this.id]);
					this.length = _.obj.length(data[this.id], true);
				}
			}
			return this;
		},
		get: function (key) {
			if (key === undefined) {
				return data[this.id];
			}
			if (key && typeof key === 'string') {
				if (data[this.id].hasOwnProperty(key)) {
					return data[this.id][key];
				}
			}
			return undefined;
		},
		clear: function (del) {
			if (del) {
				delete data[this.id];
				delete localStorage[this.id];
			}
			else {
				data[this.id] = {};
				localStorage[this.id] = '{}';
			}
			return null;
		}
	});
	this.module.exports = _.data.Storage;
});
//# sourceMappingURL=Storage.js.map