/*!
 * tangram.js framework source code
 *
 * class data.ZClip
 *
 * Date 2017-04-06
 */
;
tangram.block([
    '$_/util/bool.xtd',
    '$_/dom/events.xtd'
], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    // 注册_.data命名空间到pandora
    _('data');

    var document = global.document,
        location = global.location,

        // registered upload clients on page, indexed by id
        clients = {},
        register = function(id, client) {
            // register new client to receive events
            clients[id] = client;
        },

        // URL to movie
        moviePath = _.core.dir() + 'data/ZClip.cls.swf',

        // ID of next movie
        nextId = 1,

        bingThingy = function(thingy) {
            // simple DOM lookup utility function
            if (_.util.bool.isStr(thingy))
                thingy = document.getElementById(thingy);
            if (!thingy.addClass) {
                // extend element with a few useful methods
                thingy.hide = function() {
                    this.style.display = 'none';
                };
                thingy.show = function() {
                    this.style.display = '';
                };
                thingy.addClass = function(name) {
                    this.removeClass(name);
                    this.className += ' ' + name;
                };
                thingy.removeClass = function(name) {
                    var classes = this.className.split(/\s+/);
                    var idx = -1;
                    for (var k = 0; k < classes.length; k++) {
                        if (classes[k] == name) {
                            idx = k;
                            k = classes.length;
                        }
                    }
                    if (idx > -1) {
                        classes.splice(idx, 1);
                        this.className = classes.join(' ');
                    }
                    return this;
                };
                thingy.hasClass = function(name) {
                    return !!this.className.match(new RegExp("\\s*" + name + "\\s*"));
                };
            }
            return thingy;
        },

        getDOMObjectPosition = function(obj, stopObj) {
            // get absolute coordinates for dom element
            var info = {
                left: 0,
                top: 0,
                width: obj.width ? obj.width : obj.offsetWidth,
                height: obj.height ? obj.height : obj.offsetHeight
            };
            while (obj && (obj != stopObj)) {
                info.left += obj.offsetLeft;
                info.top += obj.offsetTop;
                obj = obj.offsetParent;
            }

            return info;
        };

    /**
     * ZeroClipboard for tangram.js
     * 一款基于flash的剪切板，相比_.data.Clipboard更具兼容性
     * 
     * @param   {Element}       elem        需要被复制的数据所在的Element元素
     * 
     */
    declare('data.ZClip', {
        _init: function(elem) {
            // constructor for new simple upload client
            this.handlers = {};

            // unique ID
            this.id = nextId++;
            this.movieId = 'ZeroClipboardMovie_' + this.id;

            // register client with singleton to receive flash events
            register(this.id, this);

            // create movie
            if (elem) {
                this.glue(elem);
            };
        },
        id: 0,
        // unique ID for us
        ready: false,
        // whether movie is ready to receive events or not
        movie: null,
        // reference to movie object
        clipText: '',
        // text to copy to clipboard
        handCursorEnabled: true,
        // whether to show hand cursor, or default pointer cursor
        cssEffects: true,
        // enable CSS mouse effects on dom container
        handlers: null,
        // user event handlers
        glue: function(elem, appendElem, stylesToAdd) {
            // glue to DOM element
            // elem can be ID or actual DOM element object
            this.domElement = bingThingy(elem);

            // float just above object, or zIndex 99 if dom element isn't set
            var zIndex = 99;
            if (this.domElement.style.zIndex) {
                zIndex = parseInt(this.domElement.style.zIndex, 10) + 1;
            }

            if (_.util.bool.isStr(appendElem)) {
                appendElem = bingThingy(appendElem);
            } else if (typeof(appendElem) == 'undefined') {
                appendElem = document.getElementsByTagName('body')[0];
            }

            // find X/Y position of domElement
            var box = getDOMObjectPosition(this.domElement, appendElem);

            // create floating DIV above element
            this.div = document.createElement('div');
            var style = this.div.style;
            style.position = 'absolute';
            style.left = '' + box.left + 'px';
            style.top = '' + box.top + 'px';
            style.width = '' + box.width + 'px';
            style.height = '' + box.height + 'px';
            style.zIndex = zIndex;

            if (_.util.bool.isObj(stylesToAdd)) {
                for (addedStyle in stylesToAdd) {
                    style[addedStyle] = stylesToAdd[addedStyle];
                }
            }

            // style.backgroundColor = '#f00'; // debug
            appendElem.appendChild(this.div);

            this.div.innerHTML = this.getHTML(box.width, box.height);
        },

        getHTML: function(width, height) {
            // return HTML for movie
            var html = '';
            var flashvars = 'id=' + this.id + '&width=' + width + '&height=' + height;

            if (navigator.userAgent.match(/MSIE/)) {
                // IE gets an OBJECT tag
                var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
                html += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + protocol + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + width + '" height="' + height + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + flashvars + '"/><param name="wmode" value="transparent"/></object>';
            } else {
                // all other browsers get an EMBED tag
                html += '<embed id="' + this.movieId + '" src="' + moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + width + '" height="' + height + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + flashvars + '" wmode="transparent" />';
            }
            return html;
        },

        hide: function() {
            // temporarily hide floater offscreen
            if (this.div) {
                this.div.style.left = '-2000px';
            }
        },

        show: function() {
            // show ourselves after a call to hide()
            this.reposition();
        },

        destroy: function() {
            // destroy control and floater
            if (this.domElement && this.div) {
                this.hide();
                this.div.innerHTML = '';

                var body = document.getElementsByTagName('body')[0];
                try {
                    body.removeChild(this.div);
                } catch (e) {;
                }

                this.domElement = null;
                this.div = null;
            }
        },

        reposition: function(elem) {
            // reposition our floating div, optionally to new container
            // warning: container CANNOT change size, only position
            if (elem) {
                this.domElement = bingThingy(elem);
                if (!this.domElement)
                    this.hide();
            }

            if (this.domElement && this.div) {
                var box = getDOMObjectPosition(this.domElement);
                var style = this.div.style;
                style.left = '' + box.left + 'px';
                style.top = '' + box.top + 'px';
            }
        },

        setText: function(newText) {
            // set text to be copied to clipboard
            this.clipText = newText;
            if (this.ready)
                this.movie.setText(newText);
        },

        addEventListener: function(eventName, func) {
            // add user event listener for event
            // event types: load, queueStart, fileStart, fileComplete, queueComplete, progress, error, cancel
            eventName = eventName.toString().toLowerCase().replace(/^on/, '');
            if (!this.handlers[eventName])
                this.handlers[eventName] = [];
            this.handlers[eventName].push(func);

        },

        setHandCursor: function(enabled) {
            // enable hand cursor (true), or default arrow cursor (false)
            this.handCursorEnabled = enabled;
            if (this.ready)
                this.movie.setHandCursor(enabled);
        },

        setCSSEffects: function(enabled) {
            // enable or disable CSS effects on DOM container
            this.cssEffects = !!enabled;
        },

        receiveEvent: function(eventName, args) {
            // receive event from flash
            eventName = eventName.toString().toLowerCase().replace(/^on/, '');

            // special behavior for certain events
            switch (eventName) {
                case 'load':
                    // movie claims it is ready, but in IE this isn't always the case...
                    // bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function
                    this.movie = document.getElementById(this.movieId);
                    if (!this.movie) {
                        var self = this;
                        setTimeout(function() {
                            self.receiveEvent('load', null);
                        }, 1);
                        return;
                    }

                    // firefox on pc needs a "kick" in order to set these in certain cases
                    if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                        var self = this;
                        setTimeout(function() {
                            self.receiveEvent('load', null);
                        }, 100);
                        this.ready = true;
                        return;
                    }

                    this.ready = true;
                    this.movie.setText(this.clipText);
                    this.movie.setHandCursor(this.handCursorEnabled);
                    break;

                case 'mouseover':
                    if (this.domElement && this.cssEffects) {
                        this.domElement.addClass('hover');
                        if (this.recoverActive)
                            this.domElement.addClass('active');
                    }
                    break;

                case 'mouseout':
                    if (this.domElement && this.cssEffects) {
                        this.recoverActive = false;
                        if (this.domElement.hasClass('active')) {
                            this.domElement.removeClass('active');
                            this.recoverActive = true;
                        }
                        this.domElement.removeClass('hover');
                    }
                    break;

                case 'mousedown':
                    if (this.domElement && this.cssEffects) {
                        this.domElement.addClass('active');
                    }
                    break;

                case 'mouseup':
                    if (this.domElement && this.cssEffects) {
                        this.domElement.removeClass('active');
                        this.recoverActive = false;
                    }
                    break;
            } // switch eventName
            if (this.handlers[eventName]) {
                for (var idx = 0,
                        len = this.handlers[eventName].length; idx < len; idx++) {
                    var func = this.handlers[eventName][idx];

                    if (_.util.bool.isFn(func)) {
                        // actual function reference
                        func(this, args);
                    } else if ((_.util.bool.isObj(func)) && (func.length == 2)) {
                        // PHP style object + method, i.e. [myObject, 'myMethod']
                        func[0][func[1]](this, args);
                    } else if (_.util.bool.isStr(func)) {
                        // name of function
                        window[func](this, args);
                    }
                } // foreach event handler defined
            } // user defined handler for event
        }
    });

    _.extend(_.data.ZClip, {
        setMoviePath: function(path) {
            // set path to ZeroClipboard.swf
            moviePath = path;
        },
        create: function(elem, params) {
            if (_.util.bool.isEl(elem) && _.util.bool.isObj(params) && !_.util.bool.isArr(params)) {
                var settings = {
                    path: moviePath,
                    copy: null,
                    before: null,
                    after: null,
                    clickAfter: true,
                    setHandCursor: true,
                    setCSSEffects: true
                };
                _.extend(settings, params);
                if (_.util.bool.isVisi(elem)) {
                    this.setMoviePath(settings.path);
                    var clip = new _.Data.ZClip();

                    clip.setHandCursor(settings.setHandCursor);
                    clip.setCSSEffects(settings.setCSSEffects);

                    clip.setHandCursor(settings.setHandCursor);
                    clip.setCSSEffects(settings.setCSSEffects);
                    clip.addEventListener('mouseOver', function(client) {
                        _.dom.events.trigger(elem, 'mouseenter');
                    });
                    clip.addEventListener('mouseOut', function(client) {
                        _.dom.events.trigger(elem, 'mouseleave');
                    });
                    clip.addEventListener('mouseDown', function(client) {
                        _.dom.events.trigger(elem, 'mousedown');
                        if (!_.util.bool.isFn(settings.copy)) {
                            clip.setText(settings.copy);
                        } else {
                            clip.setText(settings.copy.call(elem));
                        }
                        if (_.util.bool.isFn(settings.before)) {
                            settings.before.call(elem);
                        }
                    });
                    clip.addEventListener('mouseUp', function(client) {
                        //elem.removeClass('hover');
                        _.dom.events.trigger(elem, 'mouseup');
                    });
                    clip.addEventListener('complete', function(client, text) {
                        if (_.util.bool.isFn(settings.after)) {
                            settings.after.call(elem, text);
                        } else {
                            if (text.length > 500) {
                                text = text.substr(0, 500) + "...\n\n(" + (text.length - 500) + " characters not shown)";
                            }
                            _.dom.removeClass(elem, 'hover');
                            alert("Copied text to clipboard:\n\n " + text);
                        }
                        if (settings.clickAfter) {
                            _.dom.events.trigger(elem, 'click');
                        }
                    });
                    _.dom.events.add(window, 'load', null, null, function() {
                        clip.reposition();
                    });
                    _.dom.events.add(window, 'resize', null, null, function() {
                        clip.reposition();
                    });
                    clip.glue(elem);
                }
            };
        },
        query: function(selector, params, context) {
            _.each(_.dom.query(selector, context), function() {
                _.Data.ZClip.create(this, params);
            });
        }
    });

    global.ZeroClipboard = {
        clients: clients,
        dispatch: function(id, eventName, args) {
            var client = this.clients[id];
            if (client) {
                client.receiveEvent(eventName, args);
            }
        },

    };
});