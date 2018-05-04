/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Fri, 04 May 2018 04:36:11 GMT
 */
;
// tangram.config({});
tangram.block([
	'$_/obj/',
	'$_/util/bool',
	'$_/dom/',
	'$_/async/Request'
], function (pandora, root, imports, undefined) {
	var _ = pandora;
	var doc = root.document;
	var location = root.location;
	var console = root.console;
	var FormData = root.FormData;
	var sqlengine = {
		parse: function (json, ops) {
			var o = {
				fields: ["*"],
				from: "json",
				where: "",
				orderby: [],
				order: "asc",
				limit: []
			}
			for (i in ops)o[i]= ops[i]
			var result = []
			result = sqlengine.returnFilter(json, o)
			result = sqlengine.returnOrderBy(result, o.orderby, o.order)
			result = sqlengine.returnLimit(result, o.limit)
			return result;
		},
		returnFilter: function (json, jsonsql_o) {
			var jsonsql_scope = eval(jsonsql_o.from)
			var jsonsql_result = []
			var jsonsql_rc = 0;
			
			if(jsonsql_o.where == "")jsonsql_o.where = "true"
			for (var jsonsql_i in jsonsql_scope) {
				with (jsonsql_scope[jsonsql_i]) {
					if (eval(jsonsql_o.where)) {
						jsonsql_result[jsonsql_rc++]= sqlengine.returnFields(jsonsql_scope[jsonsql_i], jsonsql_o.fields)
					}
				}
			}
			return jsonsql_result;
		},
		returnFields: function (scope, fields) {
			
			if(fields.length == 0)fields = ["*"]
			
			if(fields[0] == "*")return scope;
			var returnobj = {}
			
			for(var i in fields);
			returnobj[fields[i]]= scope[fields[i]]
			return returnobj;
		},
		returnOrderBy: function (result, orderby, order) {
			
			if(orderby.length == 0)return result;
			result.sort(function (a, b) {
				switch (order.toLowerCase()) {
					case "desc":
					return (eval('a.' + orderby[0] + ' < b.' + orderby[0]))? 1 :  -1;
					case "asc":
					return (eval('a.' + orderby[0] + ' > b.' + orderby[0]))? 1 :  -1;
					case "descnum":
					return (eval('a.' + orderby[0] + ' - b.' + orderby[0]))
					case "ascnum":
					return (eval('b.' + orderby[0] + ' - a.' + orderby[0]))
				}
			})
			return result;
		},
		returnLimit: function (result, limit) {
			switch (limit.length) {
				case 0:
				return result;
				case 1:
				return result.splice(0, limit[0])
				case 2:
				return result.splice(limit[0] - 1, limit[1])
			}
		}
	};
	pandora.ns('data', {
		encodeJSON: function (data) {
			try {
				return JSON.stringify(data)
			}
			catch (error) {
				console.log(error, data)
				return ''
			}
		},
		decodeJSON: function (txt) {
			try {
				return JSON.parse(txt)
			}
			catch (error) {
				console.log(error, text)
				return false;
			}
		},
		queryJSON: function (sql, json) {
			var returnfields = sql.match(/^(select)\s+([a-z0-9_\,\.\s\*]+)\s+from\s+([a-z0-9_\.]+)(?: where\s+\((.+)\))?\s*(?:order\sby\s+([a-z0-9_\,]+))?\s*(asc|desc|ascnum|descnum)?\s*(?:limit\s+([0-9_\,]+))?/i)
			var ops = {
				fields: returnfields[2].replace(' ', '').split(','),
				from: returnfields[3].replace(' ', ''),
				where: (returnfields[4] == undefined)? "true": returnfields[4],
				orderby: (returnfields[5] == undefined)?[]: returnfields[5].replace(' ', '').split(','),
				order: (returnfields[6] == undefined)? "asc": returnfields[6],
				limit: (returnfields[7] == undefined)?[]: returnfields[7].replace(' ', '').split(',')
			}
			return sqlengine.parse(json, ops)
		},
		reBuildUrl: function (url, data) {
			if (typeof url === 'object') {
				data = url;
				url = location.href;
			}
			return url + "?" + _.obj.toQueryString(data)
		},
		cookie: function (name, value, prop) {
			var c = doc.cookie;
			var ret = null;
			if (arguments.length == 1) {
				if (c && c !== '') {
					var cookies = c.split(';')
					for (var i = 0, l = cookies.length;i < l;i++) {
						var cookie = JY.trim(cookies[i])
						if (cookie.substring(0, name.length + 1) == (name + '=')) {
							ret = decodeURIComponent(cookie.substring(name.length + 1))
							break
						}
					}
				}
			}
			else {
				prop = prop || {}
				var expires = ''
				if (prop.expires) {
					var date = void 0;
					switch (prop.expires.constructor) {
						case Number:
						{
							date = new Date()
							date.setTime(date.getTime() + (prop.expires * 1000 * 60 * 60 * 24))
							date = date.toUTCString()
						}
						break
						case String:
						{
							date = prop.expires;
						}
						break
						default:
						{
							date = prop.expires.toUTCString()
						}
						break
					}
					expires = '; expires=' + date;
				}
				var path = prop.path ? '; path=' + (prop.path):''
				var domain = prop.domain ? '; domain=' + (prop.domain):''
				var secure = prop.secure ? '; secure': ''
				doc.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('')
			}
			return ret;
		}
	});
	return _.data;
});
//# sourceMappingURL=./data.js.map