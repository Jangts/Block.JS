var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function myFunction(x, y, z, l, m, n) { console.log(x, y, z, l, m, n); }
var args = [0, 1, 2];
myFunction.apply(void 0, args.concat(args));
var aa = { aa: 'aa' };
var bb = { bb: 'bb' };
var cc = __assign({}, aa, bb);
console.log(cc);
var arr1 = ['two', 'three'];
var arr2 = ['one'].concat(arr1, ['four', 'five']);
console.log(arr2);
var arr = [1, 2, 3];
var arr2 = arr.slice(); // 和arr.slice()差不多
arr2.push(4);
console.log(arr1, arr2);
console.log(document.querySelectorAll('div').slice());
var numbers = [9, 4, 7, 1];
var min = Math.min.apply(Math, numbers); // 1
console.log(min);
//# sourceMappingURL=test.js.map