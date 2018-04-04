/*!
 * tangram.js framework source code
 *
 * static util.imports
 * init UMD
 *
 * Date 2017-04-06
 */
;
tangram.block(function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console;

    /* Define Generic Data Cache Container */
    this.storage.modulePaths = {};
    this.storage.packages = {};
    this.storage.modules = {};

    var Storage = this.storage,

        mainUrl = _.mainUrl();

    /* Module Sources Map */
    _module_source_map = {},

        /* Module IDs Map */
        _module_id_map = {},

        /* Common Modules Cache */
        _module_temp = undefined,

        _module_paths = undefined,

        /* Pattern of Naming Regular */
        requiresExpr = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,

        /* Ready Modules */
        _module_ready = function(shell, queue, records) {
            var src = shell.src;
            if (src && (!records[src])) {
                records[src] = true;
                _.each(shell.module.dependencies, function(i, dep) {
                    var id = shell.requires[dep],
                        s = Storage.modules[id] || Storage.modules[_module_id_map[id]] || {};
                    _module_ready(s, queue, records);
                });
                queue.push(shell);
            }
        },

        /* Run Modules */
        _module_run = function(shell) {
            if (shell.status === 'loaded') {
                if (typeof shell.module.factory === 'function') {
                    var args = [];
                    _.each(shell.deps, function(i, dep) {
                        var id = shell.requires[dep],
                            s = Storage.modules[id] || Storage.modules[_module_id_map[id]] || {},
                            module = s.module || {};
                        args.push(module.exports);
                    });
                    args.push(function(dep) {
                        var id = shell.requires[dep],
                            s = Storage.modules[id] || Storage.modules[_module_id_map[id]] || {},
                            module = s.module || {};
                        return module.exports;
                    });
                    args.push(shell.module.exports);
                    args.push(shell.module);
                    var result = shell.module.factory.apply(shell.module, args);
                    if (result) {
                        shell.module.exports = result;
                    }
                }
                shell.status = 'fired';
            }
        },

        _module_paths_build = function() {
            var url;
            _module_paths = [];
            _.each(Storage.modulePaths, function(name, path) {
                if (path.indexOf(':') < 0 && path.indexOf('/') != 0) {
                    url = mainUrl.replace(/\/+$/, '') + '/' + path;
                } else {
                    url = path;
                }
                var anchor = doc.createElement('a');
                anchor.href = url;
                url = _.relativePath(anchor.href + '/default');
                url = url.replace(/\./g, '\\\.');
                _module_paths.push({
                    pattern: new RegExp("^" + name + "\\\/"),
                    replace: path + '/',
                    ipattern: new RegExp("^" + url),
                    ireplace: name + '/'
                });
            });
        }

    _module_get_url = function(dep, module) {
            if (Storage.packages[dep]) {
                dep = dep + '/' + Storage.packages[dep];
            }
            if (module) {
                dep = dep.replace(/^\.\//, module.dir);
                dep = dep.replace(/^\.\.\//, module.dir + '../');
            }
            _.each(_module_paths, function(index, path) {
                dep = dep.replace(path.pattern, path.replace);
            });
            if (dep.indexOf(':') < 0 && dep.indexOf('/') != 0) {
                dep = mainUrl.replace(/\/+$/, '') + '/' + dep;
            }
            dep = dep.replace(/\/\.\/+/g, '/');
            while (/\/\w+\/\.\.\//.test(dep)) {
                dep = dep.replace(/\/\w+\/\.\.\//g, '/');
            }
            return dep;
        },


        _module_get_id = function(dir, url) {
            var paths = url.split('/'),
                basename = paths[paths.length - 1];
            id = dir + basename;
            _.each(_module_paths, function(index, path) {
                id = id.replace(path.ipattern, path.ireplace);
            });
            return id.replace(/\.\/+/g, '');
        },

        /* Calss Module */
        // The Module Constructor
        Module = function(id) {
            if (typeof id === 'string' && id != '') {
                this.id = id;
            }
            this.deps = [];
            this.exports = {};
        },

        // The Module Prototype
        ModuleDeclare = function(factory) {
            if (typeof factory === 'function') {
                var deps = _.copy(this.deps),
                    factoryToString = factory.toString();
                factoryToString.replace(requiresExpr, function(match, dep) {
                    deps.push(dep);
                });
                this.dependencies = deps;
                if (typeof factory === 'function') {
                    this.factory = factory;
                }
            }
        },

        ModuleCache = function(deps) {
            if ((typeof deps != 'object') || !(deps instanceof Array)) {
                deps = [];
            }
            _module_temp = {
                status: 'loaded',
                deps: deps,
                module: this,
                requires: {}
            };
        },

        ModuleDeps = function(Import, requires) {
            _.each(this.dependencies, function(i, dep) {
                var url = _module_get_url(dep, this);
                Import.requires.push({
                    target: requires,
                    dep: dep,
                    url: url
                });
            }, this);
        },

        /* Calss Import */
        // The Import Constructor
        Import = declare({
            _init: function(deps, callback) {
                this.imports = [];
                this.imports_map = {};
                this.requires = [];
                this.sources = {};
                this.callbacks = [];
                if (typeof deps === 'string') {
                    deps = [deps];
                };
                if (typeof deps === 'object' && deps instanceof Array) {
                    _.each(deps, function(i, dep) {
                        this.imports.push(dep);
                        this.requires.push({
                            target: this.imports_map,
                            dep: dep,
                            url: _module_get_url(dep)
                        });
                    }, this);
                    this.startload = 0;
                    this.loaded = 0;
                    if (typeof callback === 'function') {
                        this.callbacks.push(callback);
                    }
                    this.listener();
                };
            },
            loading: function() {
                var that = this;
                if (this.requires[this.startload]) {
                    var target = this.requires[this.startload].target,
                        dep = this.requires[this.startload].dep,
                        url = this.requires[this.startload].url;
                    this.startload++;
                    _.load(url + '.js', function(script) {
                        var dir = _.relativePath(script.src),
                            id = _module_get_id(dir, url);
                        if (_module_source_map[script.src]) {
                            _module_id_map[id] = _module_source_map[script.src];
                            if (!that.sources[script.src]) {
                                ModuleDeps.call(Storage.modules[_module_source_map[script.src]].module, that, Storage.modules[_module_source_map[script.src]].requires);
                                that.sources[script.src] = 1;
                            }
                        } else if (_module_temp) {
                            if (_module_temp.module.id) {
                                var _id = id;
                                id = _module_temp.module.id;
                                _module_id_map[_id] = id;
                            } else {
                                _module_temp.module.id = id;
                            }
                            script.setAttribute('data-module-id', id);
                            _module_source_map[script.src] = id;
                            Storage.modules[id] = _module_temp;
                            Storage.modules[id].src = script.src;
                            Storage.modules[id].module.dir = dir;
                            Storage.modules[id].module.src = script.src;
                            _module_temp = undefined;
                            ModuleDeps.call(Storage.modules[id].module, that, Storage.modules[id].requires);
                            that.sources[script.src] = 1;
                        }
                        target[dep] = id;
                        that.loaded++;
                        that.listener();
                    });
                    this.listener();
                } else {
                    this.startload++;
                    this.loaded++;
                    this.listener();
                };
            },
            listener: function() {
                if (this.loaded === this.requires.length) {
                    var queue = [],
                        records = {},
                        args = [],
                        result;
                    _.each(this.imports, function(i, dep) {
                        var id = this.imports_map[dep],
                            shell = Storage.modules[id] || Storage.modules[_module_id_map[id]] || {};
                        _module_ready(shell, queue, records);
                    }, this);
                    _.each(queue, function(i, shell) {
                        _module_run(shell);
                    });
                    _.each(this.imports, function(i, dep) {
                        var id = this.imports_map[dep],
                            shell = Storage.modules[id] || Storage.modules[_module_id_map[id]] || {},
                            module = shell.module || {};
                        args.push(module.exports);
                    }, this);
                    _.each(this.callbacks, function(i, callback) {
                        result = callback.apply(global, args);
                        args = ((typeof result === 'object') && (result instanceof Array)) ? result : [result];
                    });
                } else if (this.startload < this.requires.length) {
                    this.loading();
                }
            },
            and: function() {
                _.each(arguments, function(i, dep) {
                    var url = _module_get_url(dep);
                    this.imports[dep] = url[0];
                    this.requires.push(url);
                }, this);
                this.listener();
                return this;
            },
            then: function(callback) {
                if (typeof callback === 'function') {
                    this.callbacks.push(callback);
                }
                return this;
            }
        });

    _('util.imports', function(requires, callback) {
        if (typeof requires === 'object' && requires instanceof Array && typeof callback === 'function') {
            return new Import(requires).then(callback);
        }
        requires = Array.prototype.slice.call(arguments, 0);
        return new Import(requires);
    });

    //绑定全局入口
    this.module = {
        declare: function(factory) {
            var module = new Module();
            ModuleDeclare.call(module, factory);
            ModuleCache.call(module);
        },
        exports: function(factory) {
            var module = new Module();
            module.exports = factory;
            ModuleCache.call(module);
        }
    };

    //绑定全局入口
    global.define = function(id, deps, factory) {
        if (arguments.length >= 3) {
            if ((typeof deps != 'object') || !(deps instanceof Array)) {
                deps = [];
            }
            if ((typeof id != 'string') || (id == '')) {
                id = undefined;
            }
        } else if (arguments.length === 2) {
            factory = deps;
            if ((typeof id === 'object') && (id instanceof Array)) {
                deps = id;
                id = undefined;
            } else if ((typeof id === 'string') && (id != '')) {
                deps = [];
            } else {
                deps = [];
                id = undefined;
            }
        } else {
            factory = id;
            deps = [];
            id = undefined;
        }
        var module = new Module(id);
        if (typeof factory === 'function') {
            module.deps = deps;
            ModuleDeclare.call(module, factory);
        } else {
            module.exports = factory;
        }
        ModuleCache.call(module, deps);
    };

    global.define.amd = {};

    global.require = function(requires, callback) {
        new Import(requires, callback);
    };

    global.require.config = _.util.imports.config = function(options) {
        options = options || {};

        if (options.mainUrl) {
            global.tangram.config({
                mainUrl: options.mainUrl
            });
        }
        mainUrl = _.mainUrl();

        if (options.paths) {
            _.each(options.paths, function(name, path) {
                if (/^\w+$/.test(name) && /^[\w\.\/\:\-]+$/.test(path)) {
                    Storage.modulePaths[name] = path;
                }
            });
            _module_paths_build();
        }

        if (options.packages) {
            _.each(options.packages, function(i, pkg) {
                var name = pkg.name || '',
                    path = pkg.location || '',
                    main = pkg.main || '';
                if (/^\w+$/.test(name) && /^[\w\.\/\:\-]+$/.test(path)) {
                    Storage.modulePaths[name] = path;
                    Storage.packages[name] = main;
                }
            });
            _module_paths_build();
        }
    };
});