我们在开发中经常会使用到forEach语句进行循环操作，但是你有没有遇到过在循环的过程中需要提前终止的情况呢？在for循环当中可以使用break语句，但是在forEach语句中又该如何操作呢？
<!--more-->
想一下下面的代码如何在循环到2的时候跳出循环
````JavaScript
var a = [1, 2, 3, 4, 5]
a.forEach(item=>{
    console.log(item); //输出：1,2
    if (item === 2) {
        //todo 想办法跳出循环
    }
})
````
其实在这里无论你使用break还是return都不能结束循环。
## 为什么forEach循环不能使用break或者return跳出循环

forEach进行编译后的代码类似下面这样
```JavaScript
const arr = [1, 2, 3, 4, 5];
for (let i = 0; i < arr.length; i++) {
  const rs = (function(item) {
    console.log(item);
    if (item > 2) return false;
  })(arr[i])
}
```
MDN关于forEach的介绍
>There is no way to stop or break a forEach() loop other than by throwing an exception. If you need such behavior, the forEach() method is the wrong tool.

>没有办法中止或者跳出 forEach() 循环，除了抛出一个异常。如果你需要这样，使用 forEach() 方法是错误的。

#如何跳出？
## 方法1：使用for循环代替
这个太简单了 不说了

## 方法2：使用some或者erery方法
every在碰到return false的时候，中止循环。some在碰到return ture的时候，中止循环。
```JavaScript
var a = [1, 2, 3, 4, 5]
a.every(item=>{
    console.log(item); //输出：1,2
    if (item === 2) {
        return false
    } else {
        return true
    }
})
var a = [1, 2, 3, 4, 5]
a.some(item=> {
    console.log(item); //输出：1,2
    if (item === 2) {
        return true
    } else {
        return false
    }
})
```

## 方法3：跑空循环
```JavaScript
var tag;
[1, 2, 3, 4, 5].forEach(function(item){
    if(!tag){
        console.log(item);
        if(item===2){
            tag=true;
        }
    }
})
```
这样做有两个问题，第一个问题，全局增加了一个tag变量，第二个问题，表面上看是终止了forEach循环，但是实际上循环的次数并没有改变，只是在不满足条件的时候callback什么都没执行而已，先来解决第一个问题，如何删除全局下新增的tag变量 。实际上forEach还有第二个参数，表示callback的执行上下文，也就是在callback里面this对应的值。因此我们可以讲上下文设置成空对象，这个对象自然没有tag属性，因此访问this.tag的时候会得到undefined
```javascript
[1, 2, 3, 4, 5].forEach(function(item){
    if(!this.tag){
        console.log(item);
        if(item===2){
            this.tag=true;
        }
    }
},{})
```

## 方法4：try catch 语句 
MDN文档说明了除非你抛出一个异常，否则是不能结束forEach循环的，因此可以抛出一个异常
```JavaScript
try {
  [1, 2, 3, 4, 5].forEach(function(item) {
    if (item=== 2) throw item;
    console.log(item);
  });
} catch (e) {}
```
## 方法5：spice大法
###forEach的执行细节
1.遍历的范围在第一次执行callback的时候就已经确定，所以在执行过程中去push内容，并不会影响遍历的次数，这和for循环有很大区别，下面的两个案例一个会造成死循环一个不会
```JavaScript
var arr=[1,2,3,4,5]
//会造成死循环的代码
for(var i=0;i<arr.length;i++){
    arr.push('a')
}
//不会造成死循环
arr.forEach(item=>arr.push('a'))
```
2.如果已经存在的值被改变，则传递给 callback 的值是 forEach 遍历到他们那一刻的值。
```JavaScript
var arr=[1,2,3,4,5];
arr.forEach((item,index)=>{
    console.log(`time ${index}`)
    arr[index+1]=`${index}a`;
    console.log(item)
})
```
3.已删除的项不会被遍历到。如果已访问的元素在迭代时被删除了（例如使用 shift()），之后的元素将被跳过。
```JavaScript
var arr=[1,2,3,4,5];
arr.forEach((item,index)=>{
    console.log(item)
    if(item===2){
        arr.length=index;
    }
})
```
在满足条件的时候将后面的值截掉，下次循环的时候照不到对应的值，循环就结束了，但是这样操作会破坏原始的数据，因此我们可以使用一个小技巧，即将数组从0开始截断，然后重新赋值给数组也就是array=array.splice(0)
```JavaScript
var arr=[1,2,3,4,5];
arr.forEach((item,index)=>{
    console.log(item)
    if(item===2){
        arr=arr.splice(0);
    }
})
```
