---
title: 【乾坤大挪移】如何高逼格的交换两个变量的值
date: 2019-03-21 17:00:00
tags: JavaScript
categories: 开发技巧
password: tgfe
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
---
>变量交换是每种开发语言的入门知识，通常在第二节的时候就会被介绍（第一节课在扯皮）

<!--more-->

作为新一代的高层次（doubi）开发者，有没有什么高逼格的方法来实现呢（默默打开权威指南）？

##一、首先我们先回顾一下最原始的方法
最最最原始的方法，第一章介绍的方法，设置一个中间变量。通俗易懂，但是会增加内存，

```javascript
var a = 1,b = 2,tmp;
tmp = a;a = b;b = tmp;
console.log(a,b)
```
##二、加减运算
然后就翻到第二章，嗯，运算符也是可以的，加减法嘛，但是只能交换数字，而且存在数字相加溢出和小数精度的情况。

```javascript
  var a=1,b=2;
  //加法运算：
  a = a+b;//a=3,b=2
  b = a-b;//b=1
  a = a-b;//a=2

  //减法算：
  a = a+b;//a=3,b=2
  b = a-b;//b=1;
  a = a-b;//a=2
console.log(a,b)
```

##三、位运算
继续第二章往后翻，嗯还有位操作， a^ b ^ b == a，虽然解决了溢出的问题，但是还是局限于数字。

```javascript
var a = 1, // 二进制：0001
    b = 2;  // 二进制：0010

a = a ^ b; // 计算结果：a = 0011, b = 0010
b = a ^ b; // 计算结果：a = 0011, b = 0001
a = a ^ b; // 计算结果：a = 0010, b = 0001
console.log(a,b)
```

##四、运算符优先级
第二种运算符优先级的方法似乎解决了我们所有的问题，兼容无所有类型。但是，才翻了二章，继续翻。

```javascript
//改造加减法
var a=1,b=2;
a = b - a + (b = a);
console.log(a,b)
 
//高级一点的
a=[b,b=a][0];//[2,1]
console.log(a,b);
```

##五、对象的方法
“万物皆对象，没有对象解决不了的”

```javascript
var a="1",b="2";
a={a:b,b:a}
b=a.a;//1
a=a.b;//2
console.log(a,b);
```


##六、数组
当然数组也是可以解决的。

```javascript
var a="1",b="2";
a=[a,b];
b=a[0];
a=b[1];
console.log(a,b);
```

##七、Try、Catch
继续翻，事情并没有结束，我们找到了这个。

```javascript
var a="1",b="2";
a=(function(){;
    try{return b}
    finally{b=a}}//finally 语句在 try 和 catch 之后无论有无异常都会执行。
)();
console.log(a,b);
```

##八、ES6
ES6的解构赋值，都9102年，为什么不用解构赋值呢？

```javascript
let a = "1",b = "2";
[a, b] = [b, a];
console.log(a, b);
 
//bable
"use strict";
var a = "1",
    b = "2";
var _ref = [b, a];
a = _ref[0];
b = _ref[1];
console.log(a, b);
```

###**写了这么多，回到初衷，我只不过是想把数组中的两个值交换位置而已。**

**明明可以这样嘛**

```javascript
var arr = [0, 1, 2, 3, 4];
function change(arr = [], index1, index2) {
    arr[index2] = arr.splice(index1, 1, arr[index2])[0];
}
change(arr, 1, 3)
console.log(arr)
```


end~
