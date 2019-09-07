---
title: 定义一个不可修改的常量对象
date: 2019-07-10 13:29:25
tags:
  - 常量
  - const
  - defineProperty
---

如何定义一个不可修改的常量对象

<!--more-->

当我们定义一个常量的时候，我们都知道使用 `const`，但是当定义的常量是一个对象的时候，就出现了一些违反直觉的情况

```javascript
const a = 1
    , obj = {
        a: 1
    }
    ;

obj.a = 2;  // 正常可以执行

a = 2;  // Uncaught TypeError: Assignment to constant variable.

obj = {
    b: 2
};  // Uncaught TypeError: Assignment to constant variable.
```

`WTF`，我用 `const` 定义了一个常量对象，但是它的属性仍然可以修改，只有给这个常量赋值的时候才会报错，这不是我想要的啊，这样真的有意义么？

查了一下资料，早在 `ES5` 时就引入了几个方法来防止对对象的修改，有三种锁定修改的级别：

* 防止扩展，禁止为对象“添加”属性和方法，但已存在的属性和方法是可以被修改或删除
* 密封，类似“防止扩展”，而且禁止为对象“删除”已存在的属性和方法
* 冻结，类似“密封”，而且禁止为对象“修改”已存在的属性和方法（所有字段均为只读）

每种锁定的类型都拥有两个方法：一个是用来实施操作，另一个用来检测是否应用了相应的操作

```javascript
const admin = {
        name: 'zhou'        
    }
    ;

// 防止扩展
Object.preventExtensions( admin );
// 对象是否可以扩展
console.log( Object.isExtensible( admin ) );   // false
admin.age = 25;    // 正常情况下执行无效果，严格模式下报错

// 密封对象
Object.seal( admin );
console.log( Object.isExtensible( admin ) );   // false
// 对象是否被密封
console.log( Object.isSealed( admin ) );   // true
delete admin.name;    // 正常情况下执行无效果，严格模式下报错

// 冻结对象
Object.freeze( admin );
console.log( Object.isExtensible( admin ) );   // false
console.log( Object.isSealed( admin ) );   // true
// 对象是否被冻结
console.log( Object.isFrozen( admin ) );   // true
admin.name = 'zhao';   // 正常情况下执行无效果，严格模式下报错
```

在全部定义好对象的功能后，才能使用上述的锁定方法，一旦一个对象被锁定了，将无法接受，若将对象锁定，推荐使用严格模式，当尝试修改对象时会抛出异常

那么这样看来，符合直觉的常量对象应该这样写：

```javascript
const obj = Object.freeze({
        a: 1
    })
    ;

obj.a = 2;  // Uncaught TypeError: Cannot assign to read only property 'a' of object '#<Object>'

obj.b = 3;  // Uncaught TypeError: Cannot add property b, object is not extensible

delete obj.a;   // Uncaught TypeError: Cannot delete property 'a' of #<Object>
```

这样就不用担心你定义的常量“不小心”被别人的代码修改了。。。

但是当你冻结的对象中的某个属性是一个对象的话，那么这个对象的属性值仍然能够被修改，也就是说 `freeze` 方法是浅冻结。。。，而要达成期望的目标的话就需要递归每个类型为对象的属性

经过测试，这些方法对数组也是有效的，当 `preventExtensions` 方法作用于数组上之后，使用 `push` 和 `unshift` 方法会报错，而 `splice` 就很有意思了，但参数少于等于 3 个的时候没事，多余 3 个的时候会报错

当 `seal` 方法作用于数组上之后，使用 `pop`、`shift` 和 `splice` 方法都会报错

当 `freeze` 方法作用于数组上之后，使用 `reverse`、`sort` 和 `fill` 方法会报错

在多说几句，在 `ES6` 中提供的 `Object.defineProperty` 方法，其第三个参数提供了多个属性描述符，上述方法对其也是会有影响的

```javascript
let a = {}
    ;

Object.defineProperty(a, 'value', {
    value: 1
    , configurable: true
    , enumerable: true
    , writable: true
});

Object.getOwnPropertyDescriptor(a, 'value');    // {value: 1, configurable: true, enumerable: true, writeable: true};

Object.preventExtensions( a );

Object.getOwnPropertyDescriptor(a, 'value');    // {value: 1, configurable: true, enumerable: true, writable: true};
// 其实 preventExtensions 方法不会 造成影响

Object.seal( a );

Object.getOwnPropertyDescriptor(a, 'value');    // {value: 1, configurable: false, enumerable: true, writable: true};
// 可以看到 configurable 被变成了 false

Object.freeze( a );

Object.getOwnPropertyDescriptor(a, 'value');    // {value: 1, configurable: false, enumerable: true, writable: false};
// 可以看到 writable 也被变成 false 了
```