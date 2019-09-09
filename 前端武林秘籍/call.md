# 乾坤大挪移


> call、apply、bind三者均来自Function.prototype，被设计用来用于改变函数体内this的指向。


<iframe src="//player.bilibili.com/player.html?aid=48032001&cid=84139446&page=1" style="width:100%" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
<div style="width: 100%;text-align: center;">
</div>
##零：前情回顾
**请先回顾JS中闭包的相关知识，不再赘述。**

###一：招式介绍
> call、apply、bind三者均来自Function.prototype，被设计用来用于改变函数体内this的指向。

```javascript
// 有只猫叫小黑，小黑会吃鱼
const cat = {
    name: '小黑',
    eatFish(...args) {
        console.log('this指向=>', this);
        console.log('...args', args);
        console.log(this.name + '吃鱼');
    },
}
// 有只狗叫大毛，大毛会吃骨头
const dog = {
    name: '大毛',
    eatBone(...args) {
        console.log('this指向=>', this);
        console.log('...args', args);
        console.log(this.name + '吃骨头');
    },
}

console.log('=================== call =========================');
// 有一天大毛想吃鱼了，可是它不知道怎么吃。怎么办？小黑说我吃的时候喂你吃
cat.eatFish.call(dog, '汪汪汪', 'call')
// 大毛为了表示感谢，决定下次吃骨头的时候也喂小黑吃
dog.eatBone.call(cat, '喵喵喵', 'call')

console.log('=================== apply =========================');
cat.eatFish.apply(dog, ['汪汪汪', 'apply'])
dog.eatBone.apply(cat, ['喵喵喵', 'apply'])

console.log('=================== bind =========================');
// 有一天他们觉得每次吃的时候再喂太麻烦了。干脆直接教对方怎么吃
const test1 = cat.eatFish.bind(dog, '汪汪汪', 'bind')
const test2 = dog.eatBone.bind(cat, '喵喵喵', 'bind')
test1()
test2()
 
```


###二：招式分解
**Apply（）的使用：**
>apply() 方法调用一个具有给定this值的函数，以及作为一个数组（或类似数组对象）提供的参数。

>func.apply(thisArg, [argsArray])

>thisArg 可选的参数。在 func 函数运行时使用的 this 值。注意，不一定是该函数执行时真正的 this 值：如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动指向全局对象（浏览器中就是window对象），当值为原始值（1，‘string’，true）时 this 会指向该原始值的自动包装对象（Number，String，Boole）。

>argsArray  可选的参数。一个数组或者类数组对象（NodeList），其中的数组元素的每一项将作为单独的参数传给 func 函数。如果该参数的值为 null 或  undefined，则表示不需要传入任何参数。从ECMAScript 5 开始可以使用类数组对象。

**妙用一：数组拼接**

```javascript
var array = ['a', 'b'];
var elements = [0, 1, 2];
array.push.apply(array, elements);
console.info(array); // ["a", "b", 0, 1, 2]
//解决了想修改原数组，不想用循环，还想传递一个数组的问题
```

**妙用二：数组求最值**

```javascript
/* 找出数组中最大/小的数字 */
var numbers = [5, 6, 2, 3, 7];

/* 应用(apply) Math.min/Math.max 内置函数完成 */
var max = Math.max.apply(null, numbers); /* 基本等同于 Math.max(numbers[0], ...) 或 Math.max(5, 6, ..) */
var min = Math.min.apply(null, numbers);
console.log(max,min)
 
// 如果一个数组我们已知里面全都是数字，想要知道最大的那个数，由于Array没有max方法，Math对象上有
// 我们可以根据apply传递参数的特性将这个数组当成参数传入
// 最终Math.max函数调用的时候会将apply的数组里面的参数一个一个传入，恰好符合Math.max的参数传递方式
// 这样变相的实现了数组的max方法。min方法也同理
// 会有Argument length limited to 65536的限制
```

**妙用三：伪数组转换**

```javascript
var arrayLike = {
    0: 'xiaobai',
    1: 'xiaohei',
    2: 'xiaohong',
    length: 3
}
var arr = Array.prototype.slice.call(arrayLike);
console.log(arr)
```
**妙用四：变量类型判断**

```javascript
function isArray(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
}
console.log(isArray([])) 
console.log(isArray('qianduan'))
 
// toString()方法允许被修改，以上假定未被修改
// toString()为Object的原型方法，而Array，function等类型作为Object的实例，都重写了toString方法。不同的对象类型调用toString方法时，调用的是对应的重写之后的toString方法（function类型返回内容为函数体的字符串，Array类型返回元素组成的字符串），而不会去调用Object上原型toString方法（返回对象的具体类型），所以采用obj.toString()不能得到其对象类型，只能将obj转化为字符串类型；因此，在想要得到对象的具体类型时，应该调用Object上原型toString方法。
```
**妙用五：构造继承**

```javascript
function Animal(name, age) {
    this.name = name;
    this.age = age;
}

function Dog() {
    Animal.apply(this,['cat','5']);
    // Animal.call(this, 'cat', '5');
    this.say = function() {
        console.log(this.name + ":" + this.age);
    }
}

var dog = new Dog();
dog.say(); //cat:5
 
// new的过程Dog中的this指向了创建的dog对象，然后执行构造函数中的代码，执行了关键的apply，apply将当前环境的this(dog对象)指定给Animal，所以Animal中的this指向的就是dog对象，Animal中定义了name和age属性，就相当于在dog中定义了这些属性，因此dog对象便拥有了Animal中定义的属性，从而达到了继承的目的
```

**Call（）的使用：**
>call() 方法调用一个函数, 其具有一个指定的this值和分别地提供的参数(参数的列表)。apply的语法糖。

>fun.call(thisArg, arg1, arg2, ...)

>thisArg 可选的参数。在 func 函数运行时使用的 this 值。注意，不一定是该函数执行时真正的 this 值：如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动指向全局对象（浏览器中就是window对象），当值为原始值（1，‘string’，true）时 this 会指向该原始值的自动包装对象（Number，String，Boole）。

>argsArray  可选的参数。指定的参数列表。

**妙用一：调用匿名函数**

```javascript
(function() {
    ...
    this.__wrapped__=n;
    ...
}).call(this);
 
// 兼容严格模式，严格模式下，匿名函数里this会报错。也实现了匿名函数针对不同的this，做不同的处理。
```

**妙用二：字符串分隔连接**

```javascript
var temp = Array.prototype.join.call('hellow!', ','); 
console.log(temp)
 
// 字符串没有join方法,借用Array
```

**妙用三：字符串取每一项**

```javascript
Array.prototype.map.call('foo', (item) => {
    console.log(item)
}).join(''); 
 
// 字符串没有join方法,借用Array
```

**Bind（）的使用：**
>bind()方法创建一个新的函数，在调用时设置this关键字为提供的值。并在调用新函数时，将给定参数列表作为原函数的参数序列的前若干项。

>function.bind(thisArg[, arg1[, arg2[, ...]]])

>thisArg 调用绑定函数时作为this参数传递给目标函数的值。 如果使用new运算符构造绑定函数，则忽略该值。当使用bind在setTimeout中创建一个函数（作为回调提供）时，作为>thisArg传递的任何原始值都将转换为object。如果bind函数的参数列表为空，执行作用域的this将被视为新函数的thisArg。

>argsArray  当目标函数被调用时，预先添加到绑定函数的参数列表中的参数。

**解释一下：**

ES6新增的方法，这个方法会返回一个新的函数（函数调用的方式），调用新的函数，会将原始函数的方法当做传入对象的方法使用，传入新函数的任何参数也会一并传入原始函数。

```javascript
function f(x) {
    console.log(this.a + x); //原始函数
}
var obj = {
    a: 1       //传入对象
}
var newFn = f.bind(obj) //会将原始函数的方法当做传入对象的方法使用
newFn(2) //调用新的函数
 
setTimeout(function() {
    console.log(this.name + ": Got it!")
}.bind(this), 30)
 
daily() {
    this.enjoy(function() {
        this.eat()
        this.drink()
        this.sleep()
    }.bind(this))
}

如果使用new运算符构造生成的绑定函数，则忽略绑定的this。
function f(x) {
    this.a = 1;
    this.b = function() { return this.a + x }
}
var obj = {
    a: 10
}
var newObj = new(f.bind(obj, 2)) //传入了一个实参2
console.log(newObj.a) //输出 1, 说明返回的函数用作构造函数时obj(this的值)被忽略了
console.log(newObj.b()) //输出3 ，说明传入的实参2传入了原函数original 

如果bind函数的参数列表为空，执行作用域的this将被视为新函数的thisArg。
window.color = 'red';

function sayColor(){
  console.log(this.color);
}
var func2 = sayColor.bind();//this同理
// 输出 "red", 因为传的是''，全局作用域中this代表window。等于传的是window。
func2();

多次bind会发生什么
在Javascript中，多次 bind() 是无效的。更深层次的原因， bind() 的实现，相当于使用函数在内部包了一个 call / apply ，第二次 bind() 相当于再包住第一次 bind() ,故第二次以后的 bind 是无法生效的。

function say() {
    console.log(this.x);
};
var a = say.bind({x: 1});
var b = a.bind({x: 2});
b()
 
var a = function() {
	return say.apply({x: 1}); //改变say的this
};
 
var b = function() {
	return a.apply({x: 2});  //改变了a的this
};
```
**妙用一：偏函数（使一个函数拥有预设的初始参数）**

```javascript
//在绑定this的同事传入几个值作为默认参数，之后执行时再传入的参数排在默认参数后面。
const obj = {}
function f(...args) {console.log(args)}
const newFn = f.bind(obj, '1', '2')
newFn('3', '4')
 
 
function add(arg1, arg2) {
    return arg1 + arg2
}
// 创建一个函数，它拥有预设的第一个参数
var addThirtySeven = add.bind(null, 37); 
var result3 = addThirtySeven(5, 10);
console.log(result3)
// 37 + 5 = 42 ，第二个参数被忽略
```

**妙用二：快捷调用**

```javascript
<div class="test">hello</div>
<div class="test">hello</div>
<div class="test">hello</div>
<div class="test">hello</div>
<script>
  function log() {
    console.log("hello")
  }

  //const forEach = Array.prototype.forEach
  //forEach.call(document.querySelectorAll(".test"), (test) => test.addEventListener("click", log))
 
  const unbindForEach = Array.prototype.forEach,
  		forEach = Function.prototype.call.bind(unbindForEach)
  forEach(document.querySelectorAll(".test"), (test) => test.addEventListener("click", log))
</script>
 
//生成一个长期绑定的函数给nodeList使用，不需要每次都使用call，
```


**三：见招拆招**
什么时候是用什么方法?

apply：传递参数不多，传递类数组

call：确定参数个数，关注参数的对应关系

bind：不立即执行，生成一个新的函数，长期绑定某个函数给某个对象使用

**四：融会贯通**
a.func.bind(b).call(c)  this指向哪里？

==如何手写一个完美的call(),bind()方法==























