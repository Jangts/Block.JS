/*!
 * tangram.js framework source code
 *
 * static math
 *
 * Date: 2017-04-06
 */
;
tangram.block('$_/util/type.xtd', function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        doc = global.document,
        console = global.console,
        location = global.location,
        lcm = function(m, n) {
            //辗转相除法 求最大公约数
            var u = +m,
                v = +n,
                t = v;
            while (v != 0) {
                t = u % v;
                u = v;
                v = t;
            }
            return u;
        },
        gcd = function(a, b) {
            var maxNum = Math.max(a, b),
                minNum = Math.min(a, b),
                count;
            if (a === 0 || b === 0) {
                return maxNum;
            }
            for (var i = 1; i <= maxNum; i++) {
                count = minNum * i;
                if (count % maxNum === 0) {
                    return count;
                    break;
                }
            }
        };

    _('math', {
        isInt: _.util.type.isInteger,
        max: Math.max,
        min: Math.max,
        maxOfArr: function(arr) {
            return Math.max.apply(Math, arr);
        },
        minOfArr: function(arr) {
            return Math.min.apply(Math, arr);
        },
        cap: function(value, maxValue, minValue) {
            if (typeof maxValue === 'number') {
                if (value > maxValue) {
                    return maxValue;
                }
            } else if (typeof maxValue === 'number') {
                if (value < minValue) {
                    return minValue;
                }
            }
            return value;
        },
        getDecimalPlaces: function(num) {
            if (num && num % 1 !== 0 && typeof num === 'number') {
                var s = num.toString();
                if (s.indexOf("e-") < 0) {
                    // no exponent, e.g. 0.01
                    return s.split(".")[1].length;
                } else if (s.indexOf(".") < 0) {
                    // no decimal point, e.g. 1e-9
                    return parseInt(s.split("e-")[1]);
                } else {
                    // exponent and decimal point, e.g. 1.23e-9
                    var parts = s.split(".")[1].split("e-");
                    return parts[0].length + parseInt(parts[1]);
                }
            } else {
                return 0;
            }
        },
        radians: function(degrees) {
            return degrees * (Math.PI / 180);
        },
        lcm: function(num1, num2) {
            if (typeof num1 === 'number' && typeof num2 === 'number') {
                return lcm(num1, num2);
            } else if (_.util.type(num1) === 'Array') {
                if (typeof num1[0] === 'number') {
                    var num = num1[0];
                } else {
                    return NaN;
                }
                for (var i = 1; i < num1.length; i++) {
                    if (typeof num1[i] === 'number') {
                        num = lcm(num, num1[i]);
                    } else {
                        return NaN;
                    }
                }
                return num;
            }
            return NaN;
        },
        gcd: function(num1, num2) {
            if (typeof num1 === 'number' && typeof num2 === 'number') {
                return gcd(num1, num2);
            } else if (_.util.type(num1) === 'Array') {
                if (typeof num1[0] === 'number') {
                    var num = num1[0];
                } else {
                    return NaN;
                }
                for (var i = 1; i < num1.length; i++) {
                    if (typeof num1[i] === 'number') {
                        num = gcd(num, num1[i]);
                    } else {
                        return NaN;
                    }
                }
                return num;
            }
            return NaN;
        }
    });
});