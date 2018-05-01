/*!
 * tangram.js framework sugar compiled code
 *
 * Datetime: Mon, 30 Apr 2018 18:48:17 GMT
 */
;
// tangram.config({});
tangram.block([
    '$_/arr/',
    '$_/util/bool',
    '$_/util/type',
    '$_/util/../util/type'
], function (pandora, global, imports, undefined) {
    var type1 = imports['$_/util/type'] && imports['$_/util/type'][0];
    var types = imports['$_/util/../util/type'] && imports['$_/util/../util/type'];
    var type2 = imports['$_/util/../util/type'] && imports['$_/util/../util/type'][0];
    var type3 = imports['$_/util/../util/type'] && imports['$_/util/../util/type'][1];
    var a = void 0;
    var _ = pandora;
    var declare = pandora.declareClass;
    var document = global.document;
    var console = global.console;
    aaaaa = b;
    aaaaa = b;
    aaaaa = b;
    var document = global.document;
    var console = global.console;
    var b = 0;
    b = c = 0;
    var a = b;
    var c = function (s) {
        return s;
    };
    var c = a;
    var _ = pandora;
    console.log([
        _a,
        1,
        function () { }
    ]);
    console.log(_.arr);
    console.log(_.util);
    c = function (x) {
        return x + 2;
    };
    var a = (function (c, d) {
        return function (e) {
            return function (f) {
                return c + d + e + f + 18;
            }
        }
    })(1, 3)(4)(12);
    b = a;
    console.log(a);
    strings = 'Hello, I\'m tangram.js.'.split('')
    a = strings;
    console.log(a);
    var myArray = [0, function f(a) { }];
    pandora.each(myArray, function (i, el) {
        console.log(this)
        console.log(i, el)
    }, this);
    pandora.each(myArray, function (_index, i) {
        console.log(this)
        console.log(i)
    }, this);
    pandora.each(myArray, function (_index, el) {
        console.log(this)
        console.log(_index, el)
    }, this);
    var each = function (i, el) {
        console.log(i, el)
    }
    console.log(imports);
    console.log(type1);
    console.log(type2);
    console.log(type3);
    pandora.ns('foo.bar.see.Scrollbar', {
        auto: function () {

            $('.tangram-see.scrollbar[data-ic-auto]').each(function () {
                if (($(this).data('icAuto') != 'false') && ($(this).data('icRendered') != 'scrollbar') && [1, '2', { c: 3 }].includes(1)) {

                    $(this).data('icRendered', 'scrollbar')
                    new _.foo.bar.see.Scrollbar(this, {
                        theme: $(this).data('scbarTheme') || 'default-light'
                    });
                }
            })
        }
    });
    pandora.extend(_.foo.bar.see.Scrollbar, {
        'auto': function () {

            $('.tangram-see.scrollbar[data-ic-auto]').each(function () {
                if (($(this).data('icAuto') != 'false') && ($(this).data('icRendered') != 'scrollbar') && [1, '2', { c: 3 }].includes(1)) {

                    $(this).data('icRendered', 'scrollbar')
                    new _.foo.bar.see.Scrollbar(this, {
                        theme: $(this).data('scbarTheme') || 'default-light'
                    });
                }
            })
        }
    });
    var obj = {
        result: 4,
        method1: function () {
            console.log(1)
            return this;
        },
        method2: function () {
            console.log(2)
            return this;
        },
        method3: function () {
            console.log(3)
            return this;
        }
    };
    obj
        .method1()
        .method2()
        .method3()
        .result;
    console.log(

        obj
            .method1()
            .method2()
            .method3()
            .result,
        5);
    pandora.declareClass('foo.bar.Test', {
        num: 1,
        str: 'test class',
        prop: undefined,
        _init: function (arg1) {
            if (arg1 === void 0) { arg1 = 'hello'; }
            console.log(arg1)
        }
    });
    pandora.extend(pandora.foo.bar.Test, {
        'num': 2,
        str: 'static string',
        arr: [
            0,
            'b',
            function (arg1) {
                console.log(arg1)
            }
        ],
        prop: {
            times: 5,
            type: 'static',
            method: function (arg1) {
                if (arg1 === void 0) { arg1 = 'method'; }
                console.log(arg1)
            }
        },
        method11: function (arg11) {
            console.log(arg11)
        }
    });
    pandora.extend(pandora.foo.bar.Test.prototype, {
        num2: 2
    });
    var myClass = pandora.declareClass(_.foo.bar.Test, {
    });
    pandora.extend(myClass, {
        prop: undefined
    });
    var AnonClass = pandora.declareClass({
        desc: 'this is an anonymous class',
        _init: function () { }
    })
    var AnonClass2 = pandora.declareClass(_.Test2, {
        desc: 'this is an anonymous class',
        _init: function () { }
    })
    function myFn1(arg1) {
        console.log(arg1)
    }
    function myFn2() { }
    var myFn3 = function (arg1) {
        if (arg1 === void 0) { arg1 = flase; }
        console.log(arg1)
    }
    var div = _.render({
        margin: "100px auto 0",
        textAlign: "center",
        fontSize: "72px"
    });
    var uid = new _.Identifier();
    var strings = 'Hello, I\'m tangram.js.'.split('');
    var iterator = new _.Iterator(strings);
    var render = function (letter) {
        if (letter) {

            setTimeout(function () {
                div.innerHTML += letter;

                render(iterator.next());
            }, 150);
        }
        else {

            setTimeout(function () {
                _.render({
                    'margin': "10px auto",
                    textAlign: "center",
                    fontSize: "13px",
                    color: "#666"
                }, 'TestUID : ' + uid.toString())
            }, 200);
        }
    }
    console.log(uid, iterator);

    setTimeout(function () {

        render(iterator.next());
    }, 200);
    return { div: div };
}, true);
//# sourceMappingURL=runtime.test.js.map