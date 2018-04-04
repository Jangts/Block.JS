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
        doc = global.document,
        console = global.console;

    var values = {},
        builders = {
            image: function() {
                // console.log(this);
                this.changer = _.dom.create('input', this.Element, {
                    className: 'pic-changer',
                    type: 'file',
                    value: ''
                });
                _.dom.create('i', this.Element, {
                    className: 'pic-mask'
                });
                this.displayer = _.dom.create('img', this.Element, {
                    className: 'pic-displayer'
                });
                this.displayer.src = this.playsrc;
                this.resetter = _.dom.create('i', this.Element, {
                    className: 'pic-resetter',
                    innerHTML: '重置或清除'
                });
            },
            video: function() {
                // console.log(this);
                this.changer = _.dom.create('input', this.Element, {
                    className: 'pic-changer',
                    type: 'file',
                    value: ''
                });
                _.dom.create('i', this.Element, {
                    className: 'pic-mask'
                });
                this.displayer = _.dom.create('video', this.Element, {
                    className: 'pic-displayer',
                    autoplay: 'autoplay',
                    loop: 'loop',
                    muted: 'muted'
                });
                _.dom.create('img', this.displayer, {
                    className: 'pic-displayer'
                }).src = this.subtype === 'video16x9' ? _.dirname(block.url) + 'images/video16x9.jpg' : _.dirname(block.url) + 'images/video.jpg';
                this.displayer.src = this.playsrc;
                this.resetter = _.dom.create('i', this.Element, {
                    className: 'pic-resetter',
                    innerHTML: '重置或清除'
                });
            }
        },
        callbacks = {
            checkDone: function(files) {
                // console.log(this, files);
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
            },
            checkFail: function(file, errtype) {
                // console.log(file, errtype);
                // return;
                switch (errtype) {
                    case 0:
                        alert('Format Error!');
                        break;
                    case 1:
                        alert('Filesize OVER!');
                        break;
                    case 2:
                        alert('No Legal File Selected!');
                        break;
                };
            },
            uploadDone: function(response) {
                var caller = this.caller,
                    src = caller.srcFinder(response.responseText);
                if (src) {
                    if (caller.inputter) {
                        caller.inputter.value = src;
                    }
                    caller.displayer.src = src;
                    values[caller.uid] = src;
                } else {
                    // console.log(response);
                    alert('上传失败');
                }
                $(caller.bluemask).css({
                    height: '0',
                    top: '100%'
                });
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
                var p, caller = this.caller;
                if (response.lengthComputable) {
                    p = Math.round(response.loaded * 100 / response.total);
                    $(caller.bluemask).css({
                        height: p + '%',
                        top: (100 - p) + '%'
                    });
                };
                // console.log(p + '%', (100 - p) + '%');
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
                // console.log('foo');
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
            values[this.uid] = this.resetsrc;
        };

    declare('form.PicturesUploader', {
        type: 'image',
        subtype: 'image',
        Element: null,
        inputter: null,
        changer: null,
        displayer: null,
        bluemask: null,
        resetter: null,
        resetsrc: null,
        playsrc: null,
        posturl: '',
        _init: function(elem, options) {
            this.Element = _.util.bool.isStr(elem) ? _.dom.query.byId(elem) : elem;
            // console.log(this.Element, elem);
            if (_.util.bool.isEl(this.Element)) {
                _.dom.addClass(this.Element, 'actived');
                options = options || {};
                this.uid = new _.Identifier();
                this.type = options.type === 'video' ? 'video' : 'image';
                this.subtype = options.subtype || options.type;
                var inputs = $('.pic-src', this.Element);
                if (inputs.length) {
                    this.inputter = inputs[0];
                    values[this.uid] = this.playsrc = this.resetsrc = inputs.val() || '';
                    inputs.hide();
                } else {
                    values[this.uid] = '';
                    this.playsrc = options.src || $(this.Element).data('defaultSrc') || null;
                    this.resetsrc = options.resetsrc || this.playsrc || '';
                }
                if (!this.playsrc) {
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
                            var filename = 'video4x3.mp4';
                            break;

                        case 'video16x9':
                            var filename = 'video16x9.mp4';
                            break;

                        default:
                            var filename = 'photo.jpg';
                    }
                    this.playsrc = _.dirname(block.url) + 'images/' + filename;
                }
                var changers = $('.pic-changer', this.Element);
                if (changers.length) {
                    this.changer = changers[0];
                    if (this.type === 'image') {
                        this.displayer = $('img.pic-displayer', this.Element).attr('src', this.playsrc).get(0);
                    } else {

                    }
                    this.resetter = $('.pic-resetter', this.Element).get(0);
                } else {
                    builders[this.type].call(this);
                }
                this.bluemask = $('.pic-bluemask', this.Element).get(0) || _.dom.create('i', this.Element, {
                    className: 'pic-bluemask'
                });
                if (options.url) {
                    this.posturl = options.url;
                }
                if (options.finder) {
                    this.srcFinder = options.finder;
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
        inForm: function(formElement) {
            return (formElement === this.Element) || _.dom.contain(formElement, this.Element);
        },
        resetValue: function() {
            if (this.resetter) {
                reset.call(this);
            }
        },
        getValue: function() {
            return values[this.uid];
        },
        listenEvents: function() {
            var that = this;
            if (this.posturl) {
                this.changer.onchange = function() {
                    fileInputOnChange.call(this, that);
                }

            }
            if (this.resetter) {
                this.resetter.onclick = function() {
                    reset.call(that);
                }
            };
        }
    });

    _.extend(_.form, true, {
        careatPicturesUploader: function(elem, options) {
            return new _.form.PicturesUploader(elem, options);
        },
        careatPicturesUploaders: function(selector, options) {
            var uploaders = [];
            _.each(_.query(selector), function(i, el) {
                uploaders.push(_.form.careatPicturesUploader(el, options));
            });
            return uploaders;
        }
    });
});