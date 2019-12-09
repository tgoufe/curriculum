# 手写源码系列（三）：New操作符的实现

> 在真正去实现new的时候，我们先来关注一下，new操作符的功能都有那些？只有真正懂得来new操作符的功能，我们才能自己去实现一下new操作符。

## new操作符实现的功能

多说无益，我们通过实际例子去了解一下
```javascript
function Student (name, age){
    this.name = name;
    this.age = age;
}
Student.prototype.id = '110'
let hanson = new Student('hanson',18);
console.log(hanson.name); // 'hanson'
console.log(hanson.id)  //110
```
这段代码非常的入门，都能看懂，其实它也能更好的解释出了new操作符的作用：
1. 创建了一个新的实例对象。
2. 该对象的__proto__属性与构造函数（Student）的prototype全等（hanson.__proto === Student.prototype）
3. 改变this指向，使其指向新创建的实例对象

也就是说，通过new操作符实现的实例对象，即可访问`构造函数`的属性，也可以访问`构造函数原型`上的属性。

## 实现我们自己的new函数
```javascript
// 代码实现样式
function Student (name, age){
    ....
}
// 通过new函数实现
let hanson1 = new Student(...)
// 创建一个新的myNew函数，自己实现new函数的功能
let hanson2 = myNew(Student,...)
```

```javascript
function myNew(){
    const obj = new Object();
    Constructor = Array.prototype.shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    Constructor.apply(obj,arguments);
    return obj;
}
```
上面的解释：
1. 创建一个新的对象，并返回。符合new函数的功能。
2. 截取传入myNew函数的第一个参数。
3. 将第一个参数的prototype与要返回的对象建立关联。
4. 使用apply，改变构造函数的this指向，使其指向新对象，这样，obj就可以访问到构造函数中的属性了。
5. 返回obj。
 
`注意：`如果你还不能理解有关原型函数等有关知识，请点击[继承](https://juejin.im/post/5d47f0f06fb9a06b1d21297c)，了解相关知识。

### 试一下
```javascript
function Student (name, age){
    this.name = name;
    this.age = age;
}
function myNew(){
    const obj = new Object();
    Constructor = Array.prototype.shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    Constructor.apply(obj,arguments);
    return obj;
}
let newPerson = myNew(Student,'hanson',18);
console.log(newPerson.name) // hanson
```
结果与new操作符实现的结果一样！

## 完了吗？
![来自MDN](https://user-gold-cdn.xitu.io/2019/11/26/16ea6fb8d50a96b5?w=590&h=209&f=png&s=46487)
这是从MDN上买呢截取的一段图片，仔细看上面介绍的第三件事情，如果构造函数有显示返回一个对象呢？
```javascript
function Student (name, age){
    this.class= '3.5';
    return {
        name:name,
        age:age
    }
}

let newPerson = new Student('hanson',18)
console.log(newPerson.name) // hanson
console.log(newPerson.class) // undefined

```
<strong>如果构造函数有返回值，那么只返回构造函数返回的对象。</strong>

```javascript
function myNew(){
    const obj = new Object();
    Constructor = Array.prototype.shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    let ret = Constructor.apply(obj,arguments); // 判断构造函数是否存在返回值
    return typeof ret === 'object'? ret : obj;
}
```
通常情况下，构造函数是没有返回值的，但是，谁又能保证一定没有呢？