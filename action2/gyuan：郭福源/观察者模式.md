> 上一篇是[监听DOM加载完成及改变——MutationObserver](https://juejin.im/post/5d6dd5f3f265da03c23eeff9)，实际上是对关于"观察/订阅模式"的一种应用，这次搞定到底什么是“观察者模式”。

在上一篇中对于“观察者模式”的解释概括了一句话：
*A想看新闻，A就先在B这'交钱（订阅）'，以后有新闻B就给A送报纸，A挑想看的新闻*

但是实际上，这句话是比较笼统，并没有完全区分“观察/订阅模式”。

### 一、观察者模式与订阅模式的区别

首先明确一点，两种模式思路一致，在实现上略有不同。

上图：（在已订阅的前提下）

![观察者模式.jpg](https://upload-images.jianshu.io/upload_images/4128599-fd722fb89c74b71d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



![发布订阅.png](https://upload-images.jianshu.io/upload_images/4128599-b38ca6c40a274d21.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

总结：
1. 
    - 在“观察者模式”中，观察者需要“观察”被观察者本身，同理，被观察者在有更改的情况下直接通知观察者，直接关联。
    - 在“发布订阅模式”中，发布者与订阅者都关注“事件/代理通道”，无直接联系

2. 
    - 在“观察者模式”中，因为需要直接关联被观察者，所以声明/使用空间有限。
    - 在“发布订阅模式”中，只需要关联代理通道，可扩展性更强。

3. 
    - 在“观察者模式”中，大多数情况是同步执行，即被观察者发生改变立即通知观察者。
    - 在“发布订阅模式”中，大多数情况是异步执行，即委托代理通道发布。


### 二、观察者模式怎么用

上一个粗糙但中二的栗子：
![栗子.gif（源码附件1）](https://upload-images.jianshu.io/upload_images/4128599-737f533be5abce40.gif?imageMogr2/auto-orient/strip)


做如图效果，当切换第一个下拉列表时，进行如下操作：
1. 上方按钮激活；
2. 最后一个下拉列表写出随机招式；
3. 下方文字列出说明与随机口诀。

------------------------
##### 开始搞起：
- 常规思路：
```
<!--html-->
<select name="" id="per">
  <option value="0">----</option>
  <option value="1">司寇旗</option>
  <option value="2">庄叔</option>
  <option value="3">郁泽</option>
  <option value="4">罗珠</option>
</select>

<script>
    let selPer = document.getElementById('per');
    selPer.addEventListener('change', function (ev) {
      // do.....
      // 选中人物
      // 显示list下拉
      // 生成各装备
      // 显示内容
    });
</script>
```

大概就是类似情况，所有的业务逻辑都写在`change`事件下面，
这本身并没什么问题，但是作为优秀团队的开发写`耦合度`这么高的代码显然有点掉价，
而且不能避免的问题是，如果某些拍脑袋产品告诉你，要更改或添加某些逻辑内容，你要有把握保证不影响其他业务和逻辑。


- 观察者模式思路
1. 一处内容变更，多处同步修改；
2. 各个内容间本身没有关联；
3. 变更目标单向通信。

普通话翻译："如果我能让变动的下拉列表每变一次就通知一下其他人，又互不影响，就可以了。"

**划重点：需要同步更新，且其他内容动态变更，且不需要双向通信的情况**


### 三、观察者模式实现

首先，定义几个关键点：
- 观察者（多个动态变更的组件）
- 任务列表（谁订阅，通知谁）
- 被观察者（变动的下拉列表）

- **核心思路：每一个被观察者对应着一个任务队列，任务队列中存在着观察者，发布时依次通知。**

上代码：
```
	// 观察者类
	class Observer {
		constructor(id, fn) {
			this.id = id; // 识别标记, 用于退订(解绑)
			this.fn = fn; // 对应要执行的动作
		}

		subscribe(sub) {
			sub.subscribe(this)
        }

		execute(val) {
			this.val = val;
			this.fn(val)
		};
    }

	// 任务列表类
	class TaskList {
		constructor() {
			this.taskList = []; // 记录每一个观察的人
		}

		getCount() {
			return this.taskList.length;
		};

		get(index) {
			return this.taskList[index];
		};

		add(obj) {
			return this.taskList.push(obj); // 添加到任务列表, 即订阅
		};

		remove(id) {
			this.taskList = this.taskList.filter(ob => ob.id !== id);  // 从任务列表移除, 即退订
		};
	}

	// 被观察者
	class Subject {
		constructor() {
			this.subTasks = new TaskList(); // 当前被观察者的任务队列
		}

		subscribe(task) {
			this.subTasks.add(task);  // 当前被观察者订阅
		}

		unSubscribe(task) {
			this.subTasks.remove(task); // 当前被观察者退订
		};

		// 发布
		notify(val) {
			const taskCount = this.subTasks.getCount();
			for (let i = 0; i < taskCount; i++) {
				this.subTasks.get(i).execute(val); // 各个观察者开始执行
			}
		};
	}


```

接下来是订阅 - 将`观察者`与`被观察者`链接起来。

```

	let btnObserver= new Observer(1001, activePerFn);  // 按钮观察者
	let optionObserver= new Observer(1002, showOptionsFn); // 下拉列表观察者
	let showObserver = new Observer(1003, showTextFn); // 显示观察者

	const perSubject = new Subject(); // 被观察者

    // 订阅
	btnObserver.subscribe(perSubject);
	optionObserver.subscribe(perSubject);
	showObserver.subscribe(perSubject);

```
此时的被观察者`perSubject`对应的任务队列应该是：
```
/*	
(3) [Observer, Observer, Observer]
	0: Observer {id: 1001, fn: ƒ}
	1: Observer {id: 1002, fn: ƒ}
	2: Observer {id: 1003, fn: ƒ}
	length: 3
	__proto__: Array(0)
*/

```
那么，最终的发布动作，依然依靠`change`事件，触发已经写好的`notify`事件
```
	selPer.addEventListener('input', function (ev) {
		const val = this.value;
		if (val) perSubject.notify(val);
	})
```

### 四、观察者模式优劣

- 优点
    1. 一致性。
      多个观察者关注同一个动作时，`多个观察者能同步`做出反应；
    2. 低耦合
      在上述需求完成后，假设需要再新添一个下拉列表，但是这个下拉列表只需要激活按钮，不需要其他动作，
      新建一个被观察者类，按钮组件订阅即可，`耦合度低，易于维护`。

- 缺点
    1. 无法追踪变化
      虽然能够依次通知所有观察者，但是观察者无法追踪变化来源，只能单向接收。
    2. 限制因素
      被观察者不能被观察者影响，否则被观察者会实时变化并发布给观察者，产生无限循环。
    3. 性能问题
      如果有大量的直接和间接观察者，或者极频繁的变更，会占用更多的时间，有更棒的方案去实现。