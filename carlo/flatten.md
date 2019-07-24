


> 数组扁平化，顾名思义就是将多层嵌套的多位数组转换成结构清晰，层级更少的数组。

<!--more-->

期待效果如下:

```javascript
let  arr = [1, [2, [3, 4]]];
console.log(flatten(arr)) // [1, 2, 3, 4]
```

### **1、深度遍历**
最容易想到的方法，递归调用

```javascript
let arr = [1, [2, [3, 4]]];
let flatten = (arr)=>  {
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        if (Object.prototype.toString.call(arr[i])==='[object Array]') {
            result = result.concat(flatten(arr[i]))
        }
        else {
            result.push(arr[i])
        }
    }
    return result;
}
console.log(flatten(arr))
```

### **2.使用arr.reduce简化代码**
数组reduce方法本身就是一个迭代器，reduce为数组中的每一个元素依次执行callback函数，不包括数组中被删除或从未被赋值的元素

```javascript
var arr = [1, [2, [3, 4]]];

function flatten(arr) {
    return arr.reduce(function(prev, next){
        console.log(prev,next)
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}

console.log(flatten(arr))
```


### **3.对于纯数字的数组**
toString方法，也可以使用其他方法(join)，返回了一个逗号分隔的扁平的字符串，这时候我们再 split，然后转成数字，对于特殊数据不适用

```javascript
var arr = [1, [2, [3, 4]]];

function flatten(arr) {
    return arr.toString().split(',').map(function(item){
        return +item
    })
}

console.log(flatten(arr))
```

### **4.正则来了**
JSON.stringify转化为字符串,用正则替换掉[]，拼接为JSON数组，JSON.parse转为数组

```javascript
let arr = [1, [2, 3.3, ['a,b,c,d,e']]];

let flatten = (arr)=> {
    console.log(JSON.stringify(arr).replace(/\[|\]/g, ''))
    return JSON.parse(`[${JSON.stringify(arr).replace(/\[|\]/g, '')}]`);
}
console.log(flatten(arr))
```

### **5.ES6**
拓展运算符

```javascript
let arr = [1, [2, 3.3, ['a,b,c,d,e',undefined,null]]];
//console.log([].concat(...arr)); // 浅拷贝，只拷贝一层

function flatten(arr) {
 while (arr.some(item => Object.prototype.toString.call(item)==='[object Array]')) {
        arr = [].concat(...arr);
    }
    return arr;
}

console.log(flatten(arr))


//_.flatMapDeep([1, [2, 3.3, ['a,b,c,d,e',undefined,null]]]); //lodash实际也是采用这种方法
```
[lodash](https://github.com/lodash/lodash/blob/master/.internal/baseFlatten.js)
### **6.最好的方法**
说了这么多，有没有现成的方法可以使用呢？

### **ES10**
```javascript
let arr = [1,2,3,[4,5,6,[7,8,9,[10,11,12]]]];
arr.flat();               // [1,2,3,4,5,6,Array(4)]
arr.flat().flat();        // [1,2,3,4,5,6,7,8,9,Array(3)]
arr.flat().flat().flat(); // [1,2,3,4,5,6,7,8,9,10,11,12]
arr.flat(Infinity);       // [1,2,3,4,5,6,7,8,9,10,11,12]
}
```
[ES10](https://pawelgrzybek.com/whats-new-in-ecmascript-2019/#array-prototype-flat-array-prototype-flatmap-by-brian-terlson-michael-ficarra-and-mathias-bynens)

