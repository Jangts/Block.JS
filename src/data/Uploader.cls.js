/*!
 * tangram.js framework source code
 *
 * class data.Uploader
 *
 * Date 2017-04-06
 */
;
tangram.block(['$_/util/bool.xtd'], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console;

    // 注册_.data命名空间到pandora
    _('data');

    var XMLHttpRequest = global.XMLHttpRequest,
        ActiveXObject = global.ActiveXObject,
        FormData = global.FormData,

        //Define Private Method 'toRegExp',  'fileTransfer'
        toRegExp = function(array) {
            var str = array.join('|');
            str = str.replace(/(\/|\+|\.)/g, '\\$1');
            return new RegExp("^(" + str + ")$");
        },

        fileTransfer = function(url, form, handlers) {
            var that = this;
            var onBeforeTransferring = handlers.before;
            var onAfterTransferring = handlers.after;
            var onUploadComplete = handlers.done;
            var onUploadFailed = handlers.fail;
            var uploader = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            var response;
            if (uploader.upload) {
                var onTransferring = handlers.progress;
                var onSendStart = function(evt) {
                    response = {
                        lengthComputable: evt.lengthComputable,
                        loaded: evt.loaded,
                        total: evt.total,
                        readyState: uploader.readyState,
                        status: uploader.status,
                        responseText: 'Transferring'
                    }
                    _.util.bool.isFn(onBeforeTransferring) && onBeforeTransferring.call(that, response);
                };
                var onSendProgress = function(evt) {
                    response = {
                        lengthComputable: evt.lengthComputable,
                        loaded: evt.loaded,
                        total: evt.total,
                        readyState: uploader.readyState,
                        status: uploader.status,
                        responseText: 'Transferring'
                    }
                    _.util.bool.isFn(onTransferring) && onTransferring.call(that, response);
                };
                var onSendComplete = function(evt) {
                    response = {
                        readyState: uploader.readyState,
                        status: uploader.status,
                        responseText: 'Transferred'
                    }
                    _.util.bool.isFn(onAfterTransferring) && onAfterTransferring.call(that, response);
                };
                var onFailed = function(evt) {
                    response = {
                        readyState: uploader.readyState,
                        status: uploader.status,
                        responseText: 'Transfailed'
                    }
                    _.util.bool.isFn(onUploadFailed) && onUploadFailed.call(that, response);
                };
                var onTimeout = function(evt) {
                    response = {
                        readyState: uploader.readyState,
                        status: uploader.status,
                        responseText: 'Timeout'
                    }
                    _.util.bool.isFn(onUploadFailed) && onUploadFailed.call(that, response);
                }
            };
            var onStateChange = function() {
                if (this.readyState == 1) {
                    response = {
                        lengthComputable: false,
                        loaded: 0,
                        total: 0,
                        readyState: this.readyState,
                        status: this.status,
                        responseText: 'Waiting'
                    }
                    _.util.bool.isFn(onBeforeTransferring) && onBeforeTransferring.call(that, response);
                } else if (this.readyState == 2 || this.readyState == 3) {
                    response = {
                        readyState: this.readyState,
                        status: this.status,
                        responseText: 'Processing'
                    }
                    _.util.bool.isFn(onAfterTransferring) && onAfterTransferring.call(that, response);
                } else if (this.readyState == 4) {
                    //console.log(url, data, handlers, this);
                    if (this.status == 200) {
                        response = {
                            readyState: this.readyState,
                            status: this.status,
                            responseText: this.responseText
                        }
                        _.util.bool.isFn(onUploadComplete) && onUploadComplete.call(that, response);
                    } else {
                        response = {
                            readyState: this.readyState,
                            status: this.status,
                            responseText: this.responseText
                        }
                        _.util.bool.isFn(onUploadFailed) && onUploadFailed.call(that, response);
                    }
                }
            }
            if (uploader.upload && typeof uploader.onprogress != 'undefined') {
                uploader.upload.onloadstart = onSendStart;
                uploader.upload.onprogress = onSendProgress;
                uploader.upload.onloadend = onSendComplete;
                uploader.upload.onerror = onFailed;
                uploader.upload.ontimeout = onTimeout;
            }
            uploader.onreadystatechange = onStateChange;
            uploader.open('POST', url, true);
            // console.log(form);
            uploader.send(form);
        };

    /**
     * 一个数据树类型，提供4种排序方式
     * 
     * @param   {Array}     files           要上传的文件序列，一般有input获取
     * @param   {Array}     types           支持的文件格式，用于检查
     * @param   {Array}     suffixs         支持的文件后缀名，用于检查
     * @param   {Number}    maxSize         最大可上传文件大小，用于检查
     * 
     */
    declare('data.Uploader', {
        Element: null,
        fileTypeRegExp: null,
        fileNameRegExp: null,
        isOnlyFilter: true,
        _init: function(files, types, suffixs, maxSize) {
            this.files = files;
            if (_.util.bool.isArr(types)) {
                this.fileTypeRegExp = toRegExp(types);
            }
            if (_.util.bool.isArr(suffixs) && suffixs.length) {
                this.fileNameRegExp = new RegExp(".(" + suffixs.join('|') + ")$");
            }
            this.fileMaxSize = typeof maxSize == 'number' ? maxSize : 1024 * 1024 * 200;
        },
        checkType: function(doneCallback, failCallback) {
            var result = this.filesChecker(this.files);
            if (this.isOnlyFilter) {
                var result = this.filesFilter();
            } else {
                var result = this.filesChecker();
            }
            //console.log(result);
            if (result[0]) {
                _.util.bool.isFn(doneCallback) && doneCallback.call(this, result[1], result[2]);
            } else {
                _.util.bool.isFn(failCallback) && failCallback.call(this, result[1], result[2]);
            }
        },
        filesFilter: function() {
            var array = [];
            for (var i = 0; i < this.files.length; i++) {
                if (this.checkSIZE(this.files[i])) {
                    if (this.checkTYPE(this.files[i]) || this.checkEXTN(this.files[i])) {
                        array.push(this.files[i]);
                    }
                }
            }
            if (array.length > 0) {
                if (this.files.length > array.length) {
                    return [true, array, 0];
                }
                return [true, array, 1];
            } else {
                return [false, 0, 2];
            }
        },
        filesChecker: function() {
            for (var i = 0; i < this.files.length; i++) {
                if (!(this.checkTYPE(this.files[i]) || this.checkEXTN(this.files[i]))) {
                    return [false, this.files[i], 0];
                }
                if (!this.checkSIZE(this.files[i])) {
                    return [false, this.files[i], 1];
                }
            }
            return [true, this.files, 1];
        },
        checkTYPE: function(file) {
            return this.fileTypeRegExp && this.fileTypeRegExp.test(file.type);
        },
        checkEXTN: function(file) {
            return this.fileNameRegExp && this.fileNameRegExp.test(file.name);
        },
        checkSIZE: function(file) {
            return file.size < this.fileMaxSize;
        },
        transfer: function(options, method) {
            if (this.files.length && this.files.length === 1) {
                _.data.Uploader.transfer.call(this, this.files[0], options, method);
            } else {
                _.data.Uploader.transfer.call(this, this.files, options, method);
            }

        }
    });

    _.data.Uploader.transfer = function(file, options, method) {
        if (_.util.bool.isFile(file)) {
            options = options || {};
            options.url = options.url || location.href;
            options.data = options.data || {};
            var form = new FormData();
            for (var i in options.data) {
                form.append(i, options.data[i]);
            }
            if (typeof options.filefield == 'string') {
                form.append(options.filefield, file);
            } else {
                form.append('myfile', file);
            }
            form.append('enctype', 'multipart/form-data');
        } else if (_.util.bool.isFiles(file)) {
            options = options || {};
            options.data = options.data || {};
            var form = new FormData();
            for (var i in options.data) {
                form.append(i, options.data[i]);
            }
            if (typeof options.filefield == 'string') {
                filefield = options.filefield + '[]';
            } else {
                filefield = 'myfile[]';
            }
            for (var i = 0; i < file.length; i++) {
                form.append(filefield, file[i]);
            }
            form.append('enctype', 'multipart/form-data');
        } else if (_.util.bool.isForm(file)) {
            options = options || {};
            var form = file;
            for (var i in options.data) {
                form.append(i, options.data[i]);
            }
        } else {
            return _.debug('Must Give Transfer A File.');
        }
        if (method) {
            form.append('http_method', method);
        }
        options.url = options.url || location.href;
        options.handlers = options.handlers || {};
        fileTransfer.call(this, options.url, form, options.handlers);
    }
});