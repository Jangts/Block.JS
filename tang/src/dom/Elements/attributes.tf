//Expends Attributes APIs To 'Elements'
expands .Elements {
    attr (attr, value) {
        switch (typeof value) {
            case 'string':
                return this.each(function() {
                    dom.setAttr(this, attr, value)
                });

            case 'function':
                return this.each(function(i) {
                    dom.setAttr(this, attr, value(i, dom.getAttr(this, attr)))
                });

            case 'undefined':
                return this[0] && dom.getAttr(this[0], attr);
        }
        this;
    }
    removeAttr (attr) {
        if (typeof attr == 'string') {
            this.each(function() {
                dom.removeAttr(this, attr)
            });
        }
        return this;
    }
    data (dataName, data) {
        switch (typeof data) {
            case 'string':
            case 'number':
                this.each(function(index) {
                    dom.setData(this, dataName, _.util.bool.isFn(data) ? data.call(this, index) : data)
                });
                break;
            case 'function':
                return this.each(function(i) {
                    dom.setData(this, attr, data(i, dom.getAttr(this, dataName)))
                });
            case 'undefined':
                return this[0] && dom.getData(this[0], dataName);
        }
        return this;
    }
    html (nodeString) {
        switch (typeof nodeString) {
            case 'string':
            case 'number':
                return this.each(function() {
                    this.innerHTML = nodeString;
                });
            case 'function':
                this.each(function(i) {
                    this.innerHTML = nodeString(i, this.innerHTML);
                });
            case 'undefined':
                return this[0] ? this[0].innerHTML : '';
        }
        return this;
    }
    hasClass (className) {
        return this[0] && dom.hasClass(this[0], className);
    }
    toggleClass (className, isSwitch) {
        switch (typeof className) {
            case 'string':
                this.each(function() {
                    dom.toggleClass(this, className, isSwitch);
                });
                break;
            case 'function':
                this.each(function(i, el) {
                    dom.toggleClass(this, className(i, dom.getAttr(el, 'class')), isSwitch);
                });
                break;
            case 'boolean':
                if (className === false) {
                    this.each(function(i, el) {
                        dom.setAttr(this, 'class', '');
                    });
                }
                break;
        }
        return this;
    }
    addClass (className) {
        return this.toggleClass(className, true);

    }
    removeClass (className) {
        return this.toggleClass(className, false);
    }
}