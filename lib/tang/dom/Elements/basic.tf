expands .Elements {
    each (handler) {
        for (var i = 0; i < this.length; i++) {
            handler.call(this[i], i, this[i]);
        }
        return this;
    }
    find (selector) {
        var Elements = [];
        this.each(() {
            Elements.push(query(selector, this))
        });
        this.prevObject = this;
        this.splice(0, this.length);
        for (var i in Elements) {
            for (var j = 0; j < Elements[i].length; j++) {
                this.push(Elements[i][j])
            }
        }
        return this;
    }
    closet (tagName) {
        var Elements = [];
        var node;
        this.each(() {
            if (node = $..closest(this, tagName)) {
                Elements.push(node);
            }
        });
        this.prevObject = this;
        this.splice(0, this.length);
        for (var i = 0; i < Elements.length; i++) {
            this.push(Elements[i]);
        }
        return this;
    }
    get (n) {
        if (typeof n === 'number') {
            if (n >= 0 && n < this.length) {
                return this[n];
            } else if (n < 0 && n + this.length >= 0) {
                return this[n + this.length];
            }
        }
        return null;
    }
    sub (part) {
        var Elements = [];
        switch (typeof part) {
            case 'number':
                this.get(part) && Elements.push(this.get(part));
                break;
            case 'string':
                switch (part) {
                    case 'first':
                        this[0] && Elements.push(this[0]);
                        break;
                    case 'last':
                        this[this.length - 1] && Elements.push(this[this.length - 1]);
                        break;
                    case 'odd':
                        for (var i = 0; i < part.length; i += 2) {
                            Elements.push(this[i]);
                        }
                        break;
                    case 'even':
                        for (var i = 1; i < part.length; i += 2) {
                            Elements.push(this[i]);
                        }
                        break;
                }
                break;
            case 'object':
                if (part instanceof Array) {
                    part = ..unique(part);
                    for (var i = 0; i < part.length; i++) {
                        this.get(part[i]) && Elements.push(this.get(part[i]));
                    }
                }
                break;
        }
        this.prevObject = this;
        this.splice(0, this.length);
        for (var i in Elements) {
            this.push(Elements[i]);
        }
        return this;
    }
    concat (selector, context) {
        var res = query(selector, context || document);
        for (var i = 0; i < res.length; i++) {
            if (..arr.has(this, res[i]) === false) {
                this.push(res[i]);
            };
        }
        return this;
    }
    is (tagName, screen) {
        switch (typeof tagName) {
            case 'string':
                tagName = tagName.toUpperCase();
                switch (typeof screen) {
                    case 'boolean':
                        if (screen) {
                            var list = [];
                            this.each(() {
                                if (this.tagName.toUpperCase() === tagName) {
                                    list.push(this)
                                }
                            });
                            return list;
                        }
                        for (var i = 0; i < this.length; i++) {
                            if (this.tagName.toUpperCase() !== tagName) {
                                return false;
                            }
                        }
                        return true;

                    case 'number':
                        if (this[screen]) {
                            return this[screen].tagName.toUpperCase() === tagName ? true : false;
                        }
                        return false;
                }
                return this[0] && ((this[0].tagName.toUpperCase() === tagName) ? true : false);

            case 'boolean':
                if (tagName) {
                    var list = [];
                    this.each(() {
                        list.push(this.tagName.toUpperCase())
                    });
                    return list;
                }
                break;

            case 'number':
                return this[tagName] && this[tagName].tagName.toUpperCase();
        }
        return this[0] && this[0].tagName.toUpperCase();
    }
    append (content) {
        switch (typeof content) {
            case 'string':
                return this.each(() {
                    this.innerHTML += content;
                });

            case 'function':
                return this.each((i) {
                    this.innerHTML += content(i, this.innerHTML);
                });

            case 'object':
                if (content.nodeType == 1) {
                    if (this[0]) {
                        this[0].appendChild(content);;
                    }
                }
        }
        return this;
    }
    appendTo (selector) {
        var parents = new $..Elements(selector);
        //console.log(selector, parents, this.isElFragment);
        if (this.isElFragment) {
            var Elements,
                that = this;
            that.length = 0;
            parents.each((i, parent) {
                console.log(parent);
                Elements = $..createByString(that.selector, parent);
                for (var i = 0; i < Elements.length; i++) {
                    that.push(Elements[i]);
                }
            });
            return this;
        }
        if (parents.length == 1) {
            var node = this[0];
            while (node) {
                parents[0].appendChild(node);
                node = this[0];
            }
            return this;
        }
        return this;
    }
    remove () {
        this.each(() {
            $..remove(this);
        });
        return null;
    }
    before (content) {
        return insert.call(this, content, $..before);
    }
    after (content) {
        return insert.call(this, content, $..after);
    }
    index (list) {
        if (..util.type.isElement(list)) {
            return $..index(list, this);
        }
        return $..index(this[0], list);
    }
    parent () {
        var nodes = [];
        this.each(() {
            nodes.push(this.parentNode);
        });
        return new $..Elements(..arr.unique(nodes));
    }
}