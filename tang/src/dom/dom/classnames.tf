let _matches = Element.prototype.matches
|| Element.prototype.matchesSelector 
|| Element.prototype.mozMatchesSelector 
|| Element.prototype.msMatchesSelector 
|| Element.prototype.oMatchesSelector 
|| Element.prototype.webkitMatchesSelector
|| (s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;
    while (--i >= 0 && matches.item(i) !== this) {}
    return i > -1;
};

public
matches = (elem, selectorString) {
    _matches.call(elem, selectorString);
},

hasClass = (elem, className) {
    if (elem.className) {
        if (elem.className.baseVal) {
            return elem.className.animVal.match(new RegExp('(^|\\s+)' + className + '(\\s+|$)'));
        }
        if (elem.className.baseVal) {
            return elem.className.baseVal.match(new RegExp('(^|\\s+)' + className + '(\\s+|$)'));
        }
        return elem.className.match(new RegExp('(^|\\s+)' + className + '(\\s+|$)'));
    }
    return false;
},

toggleClass = (elem, className, switchType) {
    if (hasClass(elem, className) && switchType !== true) {
        var exprs = [new RegExp('(^' + className + '$|^' + className + '\\s+|\\s+' + className + '$)'), new RegExp('\\s+' + className + '\\s')];
        elem.className = elem.className.replace(exprs[0], '').replace(exprs[1], ' ');
    } else if (!hasClass(elem, className) && switchType !== false) {
        elem.className = elem.className === '' ? className : elem.className + ' ' + className;
    }
},

addClass = (elem, className) {
    toggleClass(elem, className, true);
    return this;
},

removeClass = (elem, className) {
    toggleClass(elem, className, false);
    return this;
};