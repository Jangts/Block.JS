/*
 *
 * 
 * 
 *  
 * 
 * 
 * 
 * tangram.js framework sugar compiled code
 * 
 *
 * 
 * 
 * Datetime: Thu, 19 Apr 2018 06:46:36 GMT
 */
;
tangram.block([
    '$_/arr/',
    '$_/util/bool',
    '$_/util/type as type1',
    '$_/util/../util/type as type2',
    '$_/util/../util/type as type3'
], function(pandora, global, imports, undefined) {
    var type1 = imports['$_/util/type'] && imports['$_/util/type'][0];
    var type2 = imports['$_/util/../util/type'] && imports['$_/util/../util/type'][0];
    var type3 = imports['$_/util/../util/type'] && imports['$_/util/../util/type'][0];
    var _ = pandora,
        declare = pandora.declareClass,
        document = global.document,
        console = global.console;
    console.log([_]);
    console.log(_.arr);
    console.log(_.util);
    var myArray = [0, function f(a) {}];
    pandora.each(myArray, function(i, el) {
        console.log(this);
        console.log(i, el);
    }, this);
    pandora.each(myArray, function(i) {
        console.log(this);
        console.log(i);
    }, this);
    pandora.each(myArray, function(_index, el) {
        console.log(this);
        console.log(_index, el);
    }, this);

    function each(i, el) {
        console.log(i, el);
    }
    console.log(imports);
    console.log(type1);
    console.log(type2);
    console.log(type3);
    pandora('see.Scrollbar', {
        auto: function() {
            $('.tangram-see.scrollbar[data-ic-auto]').each(function() {
                if (($(this).data('icAuto') != 'false') && ($(this).data('icRendered') != 'scrollbar') && [1, '2', {
                        c: 3
                    }].includes(1)) {
                    $(this).data('icRendered', 'scrollbar');
                    new _.see.Scrollbar(this, {
                        theme: $(this).data('scbarTheme') || 'default-light'
                    });
                }
            });
        }
    });
    pandora('see.Scrollbar', {
        auto: function() {
            $('.tangram-see.scrollbar[data-ic-auto]').each(function() {
                if (($(this).data('icAuto') != 'false') && ($(this).data('icRendered') != 'scrollbar') && [1, '2', {
                        c: 3
                    }].includes(1)) {
                    $(this).data('icRendered', 'scrollbar');
                    new _.see.Scrollbar(this, {
                        theme: $(this).data('scbarTheme') || 'default-light'
                    });
                }
            });
        }
    });
    pandora.extend(_.see.Scrollbar, {
        'auto': function() {
            $('.tangram-see.scrollbar[data-ic-auto]').each(function() {
                if (($(this).data('icAuto') != 'false') && ($(this).data('icRendered') != 'scrollbar') && [1, '2', {
                        c: 3
                    }].includes(1)) {
                    $(this).data('icRendered', 'scrollbar');
                    new _.see.Scrollbar(this, {
                        theme: $(this).data('scbarTheme') || 'default-light'
                    });
                }
            });
        }
    });
    pandora.declareClass('Test', {
        num: 1,
        str: 'test class',
        prop: undefined,
        _init: function(arg1) {
            if (arg1 === void 0) { arg1 = 'hello'; }
            console.log(arg1);
        }
    });
    pandora.extend(pandora.Test, {
        'num': 2,
        str: 'static string',
        arr: [0, 'b', function(arg1) {
            console.log(arg1);
        }],
        prop: {
            times: 5,
            type: 'static',
            method: function(arg1) {
                if (arg1 === void 0) { arg1 = 'method'; }
                console.log(rg1);
            }
        },
        method11: function(arg11) {
            console.log(arg11);
        }
    });
    pandora.declareClass('Test2', _.Test, {
        num: undefined,
        str: 'test2 class',
        static: [1, 2, 3],
        method: function anon(elem) {
            if (elem === void 0) { elem = null; }
            this.elem = elem;
        }
    });
    var myClass = pandora.declareClass(_.Test, {});
    pandora.extend(myClass, {
        prop: undefined
    });
    var AnonClass = pandora.declareClass({
        desc: 'this is an anonymous class',
        _init: function() {}
    });
    var AnonClass2 = pandora.declareClass(_.Test2, {
        desc: 'this is an anonymous class',
        _init: function() {}
    })

    function myFn1(arg1) {
        console.log(arg1);
    }

    function myFn2() {};
    var myFn3 = function(arg1) {
        if (arg1 === void 0) { arg1 = flase; }
        console.log(arg1);
    };
    var myFn4 = function(arg1) {
        if (arg1 === void 0) { arg1 = flase; }
        console.log(arg1);
    };
    var div = _.render({
            margin: "100px auto 0",
            textAlign: "center",
            fontSize: "72px"
        }),
        uid = new _.Identifier(),
        strings = 'Hello, I\'m tangram.js.'
        .split(''),
        iterator = new _.Iterator(strings),
        render = function(letter) {
            if (letter) {
                setTimeout(function() {
                    div.innerHTML += letter;
                    render(iterator.next());
                }, 150);
            } else {
                setTimeout(function() {
                    _.render({
                        'margin': "10px auto",
                        textAlign: "center",
                        fontSize: "13px",
                        color: "#666"
                    }, 'TestUID : ' + uid.toString());
                }, 200);
            }
        };
    console.log(uid, iterator);
    setTimeout(function() {
        render(iterator.next());
    }, 200);
    return {
        div: div
    };
}, true);