---
title: for-of 如何遍历对象
date: 2019-05-28 13:59:00
tags:
  - for-of
  - 迭代器
  - JavaScript
---

使用 `for-of` 遍历对象是不是会轻松一点？

<!--more-->

如何遍历对象，一般来说都会想到 `for-in`

```javascript
let obj = {
        a: 1
        , b: 2
        , c: 3
        , d: 4
    }
    ;

for( let k in obj ){
    console.log(k, obj[k]);
}
// 输出结果
// a 1
// b 2
// c 3
// d 4
```

但是当有一些继承关系的时候，就有些麻烦了，遍历的时候会把继承的属性也遍历出来，这就得加些判断了
```javascript
let newObj = Object.create(obj)
    ;

newObj.e = 5;
newObj.f = 6;

for( let k in newObj ){
    console.log(k, newObj[k]);
}
// 输出结果  
// e 5
// f 6
// a 1
// b 2
// c 3
// d 4

for( let k in newObj ){
    if( newObj.hasOwnProperty(k) ){
        console.log(k, newObj[k]);
    }
}
// 输出结果  
// e 5
// f 6
```

当然多了一层缩进，有一点麻(蛋)烦(疼)，所以可以省略一层，变成下面这样
```javascript
for( let k in newObj ) if( newObj.hasOwnProperty(k) ){
    console.log(k, newObj[k]);
}
```

复习就到此为止了，接下来来尝试一些其它的方式

在 `ES6` 中提供了 `for-of`，可以很方便的遍历数组和类数组，但是却不能遍历对象，这是为什么，与 `for-in` 仅仅相差一个单词，用途也是遍历，为什么却不能使用在对象上？

查资料后得知，原来 `ES6` 中引入了 `Iterator`，只有提供了 `Iterator` 接口的数据类型才可以使用 `for-of` 来循环遍历，而 `Array`、`Set`、`Map`、某些类数组如 `arguments` 等数据类型都默认提供了 `Iterator` 接口，所以它们可以使用 `for-of` 来进行遍历

那么原因清楚了，该怎么解决呢？能不能为对象已经其它的一些数据类型提供 `Iterator` 接口呢

答案是可以的，`ES6` 同时提供了 `Symbol.iterator` 属性，只要一个数据结构有这个属性，就会被视为有 `Iterator` 接口，接着就是如何实现这个接口了，如下就是一个最简实现：
```javascript
newObj[Symbol.iterator] = function(){
    let index = 0
        , self = this
        , keys = Object.keys( self )
        ;
    
    return {
        next(){
            if( index < keys.length ){
                return {
                    value: self[keys[index++]]
                    , done: false
                };
            }
            else{
                return {
                    value: undefined
                    , done: true
                }
            }
        }
    };
};
```

仔细看一下发现就会发现 `Symbol.iterator` 接口其实是一个 `Generator` 函数，那么就可以简化代码：
```javascript
newObj[Symbol.iterator] = function* (){
    let keys = Object.keys( this )
        ;
    
    for(let i = 0, l = keys.length; i < l; i++){
        yield this[keys[i]];
    }
}

for(let v of newObj){
    console.log( v );
}
// 输出结果
// 5
// 6
```

值得注意的是 `Object.keys` 碰巧解决了之前 `for-in` 遇到的继承问题

这样满足了我们的期望，使用 `for-of` 来遍历对象，但是好像哪里不对，我们遍历对象时一般都是期望同时输出 `key` 和 `value` 的，这样调整一下代码
```javascript
newObj[Symbol.iterator] = function* (){
    let keys = Object.keys( this )
        ;
    
    for(let i = 0, l = keys.length; i < l; i++){
        yield {
            key: keys[i]
            , value: this[keys[i]]
        };
    }
}

for(let v of newObj){
    console.log( v );
}
// 输出结果
// {key: "e", value: 5}
// {key: "f", value: 6}
```

这样返回了一个对象，似乎又很不舒服，我们能不能尝试一些解构赋值呢。。。
```javascript
for(let {key, value} of newObj){
    console.log(key, value );
}
// 输出结果
// e 5
// f 6
```

这样似乎非常完美了。。。

但回过头来看，你觉得轻松了一点么？


拓展：
在 `class` 中使用 `Symbol.iterator`
```javascript
class User{
    constructor(name, gender, lv){
        this.name = name;
        this.gender = gender;
        this.lv = lv;
    }
    
    *[Symbol.iterator](){
        let keys = Object.keys( this )
            ;
        
        for(let i = 0, l = keys.length; i < l; i++){
            yield {
                key: keys[i]
                , value: this[keys[i]]
            };
        }
    }
}

let zhou = new User('zhou', 'male', 1);

for(let {key, value} of zhou){
    console.log(key, value);
}
// 输出结果
// name zhou
// gender male
// lv 1
```
