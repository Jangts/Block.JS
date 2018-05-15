function myFunction(x, y, z, l, m, n) { console.log(x, y, z, l, m, n); }
var args = [0, 1, 2];
myFunction(...args, ...args);

let aa = { aa: 'aa' }
let bb = { bb: 'bb' }
let cc = { ...aa, ...bb }
console.log(cc);

var arr1 = ['two', 'three'];
var arr2 = ['one', ...arr1, 'four', 'five'];
console.log(arr2);

var arr = [1, 2, 3];
var arr2 = [...arr]; // 和arr.slice()差不多
arr2.push(4)
console.log(arr1, arr2);

console.log([...document.querySelectorAll('div')]);


let numbers = [9, 4, 7, 1];
let min = Math.min(...numbers); // 1
console.log(min);