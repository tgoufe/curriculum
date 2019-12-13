# 什么是Promise串行

*Promise串行*是指每一个由promise封装的任务都顺序执行，即上一个执行完成后再执行下一个。

执行过程大致是下面的样子：

```
Task A | ------>|
Task B |         ------>|
Task C |                 ------>|
Task D |                         ------>|
```

# 为什么要讲Promise串行

我们平时会比较多的使用*并行*，即多个任务一起执行，也就是利用`Promise.all()`。但其实在日常开发中串行也是会遇到的，比如依次开启走廊的所有灯，或者其次让喷泉的水枪依次喷水等等。但是ES6中的`Promise`并没有对串行进行直接封装，所以需要我们自己来做。

![img](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/喷泉动图.gif)

# 分布讲解Promise串行

### Promise串行习题

之前有小伙伴发给过我一道这样的面试题，所以本文准备通过这道题来实现一下Promise串行。

> 定义 `type Task = () => Promise` （即 Task 是一个 **类型**，是一个返回值是 Promise 的函数类型）
>
> 假设有一个数组 tasks: Task[]（每一项都是一个 Task 类型的数组）
>
> 实现一个方法 `function execute(tasks: Task[]): Promise`，该方法将 tasks 内的任务 **依次** 执行，并返回一个结果为数组的 Promise ，该数组包含任务执行结果（以执行顺序排序）
>
> > 要求：
> > 忽略异常任务，并在结果数组中用 null 占位
>
> > 限制：
> > 不添加任何依赖，仅使用 Promise，不使用 Generator 或 async

如果允许使用`Generator`或者`async/await`来写的话，会很简单，文章末尾再实现`async/await`的方法。



先做完成一下测试用例的代码：

```javascript
const Task = (result, isSuccess = true) => {
  return () => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isSuccess) {
        console.log(`success: ${result}`);
        resolve(result);
      } else {
        console.log(`error: ${result}`);
        reject(result);
      }
    }, 1000);
  });
}


execute([
  Task('A'),
  Task('B'),
  Task('X', false),
  Task('C'),
]).then(resultList => {
  // 这里期望打印 ["A", "B", null, "C"]
  console.log(resultList)
})
```


思路大致如下图：
先做一个`Promise`实例，然后把每个`Task`循环的放置到上一个`promise`的`then`回调里。
<img src="https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/promise串行思路.png" style="zoom:40%;" />

需要注意的几点：
 1. 无论每个Task是成功还是失败，它都不能阻断下一个Task的执行
 2. 最后的then需要把每个Task的执行结果"决议"出去

对策：

1. 每一个Task外层包装一层Promise，捕获Task的reject状态
2. 可以利用一个中间变量，缓存所有Task的输出结果，然后在最后一个Promise的then里把中间变量“决议”出去

第一版代码如下：
```javascript
function execute(tasks) {
    let resultList = [];
	return tasks.reduce(
    (previousPromise, currentPromise) => previousPromise.then((resultList) => {
		return new Promise(resolve => {
			currentPromise().then(result => {
                resultList.push(result);
				resolve()
			}).catch(() => {
                  resultList.push(null);
		          resolve(resultList.concat(null))
			})
		})
	}),
    Promise.resolve()
	).then(() => resultList);
}
```

### 改进
其实Promise的链式操作是可以传递值的，所以可以利用这个特性，省去中间变量，

代码如下：
```javascript
function execute(tasks) {
	return tasks.reduce(
    (previousPromise, currentPromise) => previousPromise.then((resultList) => {
		return new Promise(resolve => {
			currentPromise().then(result => {
				resolve(resultList.concat(result))
			}).catch(() => {
				resolve(resultList.concat(null))
			})
		})
	}),
    Promise.resolve([])
	)
}
```


## 

### aysnc/await版本

代码如下:

```javascript
const execute = async (tasks = []) => {
  const resultList = [];
  for(task of tasks) {
    try {
      resultList.push(await task());
    } catch (e) {
      resultList.push(null);
    }
  }
  return resultList;
}
```
