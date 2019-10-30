## 概念 
在开始之前，我们非常有必要去了解、巩固一下call、apply和bind在开发中的具体作用。
```javascript
// call
    var a = {
        name : "Cherry",

        func1: function () {
            console.log(this.name)
        },

        func2: function () {
            setTimeout(  function () {
                this.func1()
            }.call(a),100);
        }

    };

    a.func2() // "Cherry"
    
// apply 
    var a = {
        name : "Cherry",

        func1: function () {
            console.log(this.name)
        },

        func2: function () {
            setTimeout(  function () {
                this.func1()
            }.apply(a),100);
        }

    };

    a.func2()   // Cherry
    
// bind
  var a = {
        name : "Cherry",

        func1: function () {
            console.log(this.name)
        },

        func2: function () {
            setTimeout(  function () {
                this.func1()
            }.bind(a)(),100);
        }

    };

    a.func2()  // Cherry

```
相同点：都可以改变this指向。  
不同点：call方法接受的是一个参数列表，apply的第二个参数为数组；bind方法返回的不是具体数值，而是函数。  
`如果想获取bind方法的返回值，可主动执行`

```javascript
function sayHelloTo (to) {
    console.log(`${this.name} say hello to ${to}`)
}

var Jerry = {
  name: 'Jerry'
}
sayHelloTo.call(Jerry, 'Tom')
//Jerry say hello to Tom.

var Foo = {
  name: 'Foo'
}
sayHelloTo.apply(Foo, ['Bar'])
//Foo say hello to Bar.

var XYZ = {
  name: 'XYZ'
}
var say = sayHelloTo.bind(XYZ)
say('ABC')
//XYZ say hello to ABC.
```
## 手写call方法
```javascript
Function.prototype.myCall = function(context, ...args) {
  // 判断是否是undefined和null
  if (typeof context === 'undefined' || context === null) { //1
    context = window
  }
  let fnSymbol = Symbol()      //2
  context[fnSymbol] = this    // 3
  let fn = context[fnSymbol] (...args) //4
  delete context[fnSymbol] //5
  return fn  //6
}
```
我们利用上面的`myCall`方法，替换call来执行上面的例子，可以得到相同的结果

我们分别来解读一下上面备注的数字：   
1、判断context的值，如果没有或者为undefined,则this指向window。（`与call方法中，如果第一个参数行为保持一致`）     
2、为传入的context扩展一个属性。  
3、将原函数指向这个属性。（`this在调用时，指向call前面的函数`）  
4、执行原函数。  
5、删除传入的对象的无用属性。  
6、返回执行后的值。

`这里需要注意的地方有两点：`  
`1、要熟练使用es6相关知识(...args,Symbol)`   
`2、之所以能获取到this.name,是因为此时的this指向的是context` 

## 手写apply方法
```javascript
Function.prototype.myApply = function(context, args) { // 1
  // 判断是否是undefined和null
  if (typeof context === 'undefined' || context === null) {
    context = window
  }
  let fnSymbol = Symbol()
  context[fnSymbol] = this
  let fn = context[fnSymbol] (...args)
  return fn
}
```
注意传参不同。  
`告诉你个小秘密，如何记住传的是列表类还是数组呢？Array与apply都是A开头，那就传数组喽！call不是A开头，那就是列表！`

## 手写bind方法
```javascript
Function.prototype.myBind = function(context) {
// 判断是否是undefined和null
    if (typeof context === "undefined" || context === null) {
    	context = window;
    }
    self = this;
    return function(...args) {
    	return self.apply(context, args);
    }
}
```

可以借用apply或者call，间接实现bind，并且，注意开头提到的区别！  
`bind返回的是函数哦～`  

如果文章对的前端学习有帮助，别忘了点赞关注哦～ 

------
摘录自    
[较真的前端](https://zhuanlan.zhihu.com/p/69070129)      
[this、apply、call、bind](https://juejin.im/post/59bfe84351882531b730bac2)    
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
