/*!
 * tangram.js framework source code
 *
 * class form.SelectionRange
 *
 * Date: 2017-04-06
 */
;
tangram.block([
    '$_/util/bool.xtd',
    '$_/dom/Elements/form.clsx',
    '$_/data/Uploader.cls'
], function(pandora, global, undefined) {
    var block = this,
        _ = pandora,
        $ = _.dom.select,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    var builders = {
            image: function() {},
            video: function() {}
        },
        callbacks = {
            checkDone: function(files) {
                console.log(this, files);
                _.data.Uploader.transfer.call(this, files[0], {
                    url: this.caller.posturl,
                    handlers: {
                        before: callbacks.beforeUpload,
                        after: callbacks.afterUpload,
                        done: callbacks.uploadDone,
                        fail: callbacks.uploadFail,
                        progress: callbacks.onUploadProgress
                    }
                });
                return;
                previewer.innerHTML = list;
                previewer.files = files;
            },
            checkFail: function(files) {
                console.log(this, files);
            },
            uploadDone: function(response) {
                var src = this.caller.srcFinder(response.responseText);
                if (src) {
                    if (this.inputter) {
                        this.inputter.value = src;
                    }
                    this.displayer.src = src;
                } else {
                    console.log(response);
                    alert('上传失败');
                }
            },
            uploadFail: function(response) {
                console.log(this);
                alert('服务器错误');
                // console.log(response);
            },
            beforeUpload: function(response) {
                // console.log(response);
            },
            afterUpload: function(response) {
                // console.log(response);
            },
            onUploadProgress: function(response) {
                console.log(response);
            }
        },
        fileInputOnChange = function(caller) {
            if (caller.posturl) {
                if (caller.type === 'video') {
                    var uploader = new _.data.Uploader(this.files, ['video/mp4', 'video/ogg', 'video/webm'], ['mp4', 'ogg', 'webv'], 1024 * 1024 * 20);
                } else {
                    var uploader = new _.data.Uploader(this.files, ['image/jpeg', 'image/pjpeg', 'image/gif', 'image/png'], ['jpg', 'png', 'gif'], 1024 * 1024 * 20);
                }
                uploader.caller = caller;
                uploader.isOnlyFilter = false;
                console.log('foo');
                uploader.checkType(callbacks.checkDone, callbacks.checkFail);
            } else {
                _.error('must have a post url.');
            }
        },
        reset = function() {
            if (this.inputter) {
                this.inputter.value = this.resetsrc;
            }
            this.displayer.src = this.resetsrc;
        };

    declare('form.PicturesUploader', {
        type: 'image',
        subtype: 'image',
        Element: null,
        inputter: null,
        changer: null,
        displayer: null,
        resetter: null,
        resetsrc: null,
        posturl: 'http://www.eyutou.ni:8888/applications/uploads/files/?returndetails=json',
        _init: function(elem, options) {
            // console.log(this.Element, elem);
            this.Element = _.util.bool.isStr(elem) ? _.dom.query.byId(elem) : elem;
            if (_.util.bool.isEl(this.Element)) {
                options = options || {};
                this.type = options.type === 'vodeo' ? 'vodeo' : 'image';
                this.type = options.subtype || options.type;
                var inputs = $('.image-src', this.Element);
                if (inputs.length) {
                    this.inputter = inputs[0];
                    this.src = this.resetsrc = inputs.val();
                } else {
                    this.src = options.src || $(this.Element).data('defaultSrc') || null;
                    this.resetsrc = options.resetsrc || this.src;
                }
                if (!this.src) {
                    switch (this.subtype) {
                        case 'photo2x3':
                        case 'figure3x4':
                        case 'banner':
                        case 'banner100':
                            var filename = this.subtype + '.jpg';
                            break;

                        case 'avatar':
                        case 'avatar1x1':
                            var filename = 'avatar.jpg';
                            break;

                        case 'figure':
                        case 'figure4x3':
                            var filename = 'figure.jpg';
                            break;

                        case 'video':
                        case 'video4x3':
                            var imgsrc = 'video4x3.jpg',
                            filename = 'video4x3.mp4';
                            break;

                        case 'video16x9':
                            var imgsrc = 'video16x9.jpg',
                            filename = 'video16x9.mp4';
                            break;

                        default:
                            var filename = 'photo.jpg';
                    }
                    this.src = _.dirname(block.url) + 'images/' + filename;
                }
                var changers = $('.image-changer', this.Element);
                if (changers.length) {
                    this.changer = changers[0];
                    if (this.type === 'image') {
                        this.displayer = $('img.image-displayer', this.Element).attr('src', this.src).get(0);
                    } else {

                    }
                    if (this.resetsrc) {
                        this.resetter = $('.image-resetter', this.Element).get(0);
                    }
                } else {
                    builders[this.type].call(this);
                }
                this.listenEvents();
            } else {
                // console.log(this.Element, elem);
                _.error('elem must be an Element Object.');
            }
        },
        srcFinder: function(responseText) {
            var response = _.data.decodeJSON(responseText) || {
                data: 500
            };

            if (response.data && response.data.successed && response.data.successed.myfile && response.data.successed.myfile.length) {
                return response.data.successed.myfile[0].url
            } else {
                return null;
            }
        },
        listenEvents: function() {
            var that = this;
            this.changer.onchange = function() {
                fileInputOnChange.call(this, that);
            }

            if (this.resetter) {
                this.resetter.onclick = function() {
                    reset.call(that);
                }
            };
        }
    });
});