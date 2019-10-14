> reduce在我们日常的开发中，使用的频率并不是很高，如果使用得当，相信你会在日常的工作中，更加的得心应手。同时，部分公司的面试，有时也会去问到关于reduce的一些知识，这就让我们不得不防备（学习）了。 

## 定义
reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。  
## 语法  
> arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])

### 参数 
`callback` : 执行数组中每个值的函数，包含四个参数：  
+ accumulator : 累计器累计回调的返回值；它是上一次调用回调时返回的累计值，或 initialValue（见下面）`累计器`
+ currentValue : 数组中正在处理的元素；`当前值`
+ currentIndex(可选) : 数组中正在处理的元素的索引；`当前索引`
+ array(可选) : 调用reduce()的数组；`数组`

`initialValue` (可选): 作为第一次调用`callback`函数时的第一个参数的值。如果没有提供初始值，则将使用数组中的第一个元素，`在没有初始值的空数组上调用reduce将报错`。  

### 返回值  
函数累计处理的结果（accumulator）

### 解析 
回调函数第一次执行时，accumulator 和currentValue的取值有两种情况：如果调用reduce()时提供了initialValue，accumulator取值为initialValue，currentValue取数组中的第一个值；如果没有提供 initialValue，那么accumulator取数组中的第一个值，currentValue取数组中的第二个值。
`日常的使用中，经常会忽略initialValue的存在，建议使用时添加initialValue参数，是其更加方便阅读、理解`

### reduce()如何运行 
```javascript
[0, 1, 2, 3, 4].reduce(function(accumulator, currentValue, currentIndex, array){
  return accumulator + currentValue;
});
```
callback 被调用四次，每次调用的参数和返回值如下表：  
| callback    | accumulator | currentValue | currentIndex |           array | return value |
| ----------- | :---------: | -----------: | -----------: | --------------: | -----------: |
| second call |      0      |            1 |            1 | [0, 1, 2, 3, 4] |            1 |
| third call  |      1      |            2 |            2 | [0, 1, 2, 3, 4] |            3 |
| fourth call |      3      |            3 |            3 | [0, 1, 2, 3, 4] |            6 |

reduce返回的值将是最后一次回调返回的值（10）

## 常见reduce使用 

### 数组里所有值的和

```javascript
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15

```
### 累加对象数组里的值  
```javascript
var initialValue = 0;
var sum = [{x: 1}, {x:2}, {x:3}].reduce(function (accumulator, currentValue) {
    return accumulator + currentValue.x;
},initialValue)

console.log(sum) // logs 6

```
### 将二维数组转换为一维

```javascript
var flattened = [[0, 1], [2, 3], [4, 5]].reduce(
  function(a, b) {
    return a.concat(b);
  },
  []
);
// flattened is [0, 1, 2, 3, 4, 5]

//箭头函数
var flattened = [[0, 1], [2, 3], [4, 5]].reduce(
 ( acc, cur ) => acc.concat(cur),
 []
);

```
### 计算数组中每个元素出现的次数 
```javascript
var names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];

var countedNames = names.reduce(function (allNames, name) { 
  if (name in allNames) {
    allNames[name]++;
  }
  else {
    allNames[name] = 1;
  }
  return allNames;
}, {});

// countedNames is:
// { 'Alice': 2, 'Bob': 1, 'Tiff': 1, 'Bruce': 1 }

```
### 数组去重 
```javascript
let arr = [1,2,1,2,3,5,4,5,3,4,4,4,4];
let result = arr.sort().reduce((init, current) => {
    if(init.length === 0 || init[init.length-1] !== current) {
        init.push(current);
    }
    return init;
}, []);
console.log(result); //[1,2,3,4,5]
```
### 翻译mdn中的reduce
```javascript
if (!Array.prototype.reduce) {
  Object.defineProperty(Array.prototype, 'reduce', {
    value: function(callback /*, initialValue*/) {
      if (this === null) {
        throw new TypeError( 'Array.prototype.reduce ' + 
          'called on null or undefined' );
      }
      if (typeof callback !== 'function') { // reduce的第一个参数必须为函数
        throw new TypeError( callback +
          ' is not a function');
      }

      var o = Object(this);

      var len = o.length; 
      
      var k = 0; 
      var value;

      if (arguments.length >= 2) { //如果存在初始值，则存储器的初始值为initialValue
        value = arguments[1];
      } else {
        while (k < len && !(k in o)) {
          k++; 
        }
        if (k >= len) {  // 调用reduce的数组不能为空
          throw new TypeError( 'Reduce of empty array ' +
            'with no initial value' );
        }
        value = o[k++];
      }

      while (k < len) {
      
        if (k in o) { //重复调用
          value = callback(value, o[k], k, o);
        }
        k++;
      }
      return value; //返回存储器值
    }
  });
}
```
`注意`    
1. 如果数组为空且没有提供`initialValue`，会抛出`TypeError` 。  
2. 如果数组仅有一个元素（无论位置如何）并且没有提供`initialValue`， 或者有提供`initialValue`但是数组为空，那么此唯一值将被返回并且callback不会被执行。

> 说到底，如果想更好的操作reduce(),还是要必须掌握他的基本语法，callback函数的参数使用方式和initialValue;
>   感兴趣的同学，也可以去查看关于reduce的源码，相信你可以收获更多！