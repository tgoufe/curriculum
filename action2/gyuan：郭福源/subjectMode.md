# 观察者模式应用

> 上一篇是[监听DOM加载完成及改变——MutationObserver](https://juejin.im/post/5d6dd5f3f265da03c23eeff9)，实际上是对关于"观察/订阅模式"的一种应用，这次搞定到底什么是“观察者模式”。

在上一篇中对于“观察者模式”的解释概括了一句话：

*A想看新闻，A就先在B这'交钱（订阅）'，以后有新闻B就给A送报纸，A挑想看的新闻*

但是实际上，这句话是比较笼统，并没有完全区分“观察/订阅模式”。

## 一、观察者模式与订阅模式的区别

首先明确一点，两种模式思路一致，在实现上略有不同。

上图：（在已订阅的前提下）

![观察者模式.jpg](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/观察者模式.jpg)


![发布订阅.png](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/发布订阅.png)

总结：
1. 结构
  - 在“观察者模式”中，观察者需要“观察”被观察者本身，同理，被观察者在有更改的情况下直接通知观察者，直接关联。
  - 在“发布订阅模式”中，发布者与订阅者都关注“事件/代理通道”，无直接联系

2. 关联性
  - 在“观察者模式”中，因为需要直接关联被观察者，所以声明/使用空间有限。
  - 在“发布订阅模式”中，只需要关联代理通道，可扩展性更强。

3. 执行机制
  - 在“观察者模式”中，大多数情况是同步执行，即被观察者发生改变立即通知观察者。
  - 在“发布订阅模式”中，大多数情况是异步执行，即委托代理通道发布。


## 二、观察者模式怎么用

上一个粗糙但中二的栗子：
![栗子.gif](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/cc.gif)




做如图效果，当切换下拉列表时，进行如下操作：
1. 对应按钮激活；
2. input框写出招式；
3. 下方文字列出说明与随机口诀。

------------------------
### 开始搞起：

#### 思路1.0：
```html
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

大概就是类似情况，所有的业务逻辑都写在一个`change`事件下面，
这本身并没什么问题，但是作为优秀团队的开发写`耦合度`这么高的代码显然有点掉价，
而且不能避免的问题是，如果某些拍脑袋产品告诉你，要更改或添加某些逻辑内容，你要有把握保证不影响其他业务和逻辑。

#### 思路1.5：
既然耦合度高，那么可以利用`addEventListener`绑定函数不覆盖的特性，绑定多个`change`事件，
```javascript

    let selPer = document.getElementById('per');
    selPer.addEventListener('change', function (ev) {
      // 选中人物
    });
    selPer.addEventListener('change', function (ev) {
      // 显示list下拉
    });
    selPer.addEventListener('change', function (ev) {
      // 生成各装备
      // 显示内容
    });

```
可以，完美分开了，凑合也能看，
然而。。。此时如果要求，只有`观察者1`生效，`观察者2`和`观察者3`不再变动的话，没错，要用`removeEventListener`解绑，不过，上面的匿名函数要改成声明函数才可以；那如果要再增加两个“观察者”呢，就再复制两个好了。

维护起来有点头疼。

#### 思路2.0：
`change`事件本身很简单，难点看来在`耦合度高`/`变动时不好处理`问题，只是按顺序执行，那不如，考虑一下数组？
将想要执行的方法`push`到数组中，把选中的值传进去就好了嘛。
每当`change`事件触发，就循环执行以下数组里的内容，这样互不影响，添加又方便。
```javascript
    let obsArr = [fn1, fn2, fn3];
    selPer.addEventListener('change', function (ev) {
        const val = this.value;
        obsArr.map(item => item(val))
    });
```
有点意思，删除(解绑)时，就是找到要删除的元素，从数组里移除就好了。
查函数名很不科学，如果能多加一个 类似`id`的东西来查找就好了。

那加工一下试试看。


## 三、观察者模式实现
- 因为可能会有多个观察者，统一做个类，加个`id`， 加个`执行函数`；
```javascript
    class Observer {
        constructor(id, fn) {
            this.id = id; // 识别标记, 用于退订(解绑)
            this.fn = fn; // 对应要执行的动作
        }

        // 执行函数
        execute(val) {
            this.val = val;
            this.fn(val)
        };
    }

```
- 声明`观察者们`

```javascript
    let btnObserver= new Observer(1001, fn1);  // 按钮 - 观察者1
    let optionObserver= new Observer(1002, fn2); // input - 观察者2
    let showObserver = new Observer(1003, fn3); // 显示text - 观察者3
```

- 解绑怎么做呢？找`id`就好了。

```javascript

    function removeObserver(subList, id) {
        return subList.filter(ob => ob.id !== id);  // 从任务列表移除, 即退订
    }

    obsArr = removeObserver(ObsArr, 1002);
    obsArr = removeObserver(ObsArr, 1003);

```

**接下来，有一个问题，如果这时多加一个`被观察者subject`怎么办，看起来可以效仿写观察者的套路来。（毕竟暴露在外的数组还是很危险的）**

- 被观察者(Subject) - 变动主体，实际上也就是上面声明的`obsArr`
```javascript
    // 被观察者
    class Subject {
        constructor() {
            this.obsArr = []; // 当前被观察者的任务队列
        }

        // 发布
        notify(val) {
            this.obsArr.map(item => item.execute(val)) // 各个观察者开始执行
        };
    }

    let perSubject = new Subject(); // 声明一个被观察者
```
- 我们需要一个将观察者`push`进去的接口，在这个类里添一个接口。
```javascript
    subscribe(obs) {
        this.obsArr.push(obs); // 当前被观察者订阅
    }

    // 订阅
    perSubject.subscribe(btnObserver);
    perSubject.subscribe(optionObserver);
    perSubject.subscribe(showObserver);
```
- 此时的`perSubject`
```javascript
    console.log(perSubject)
/*	
(3) [Observer, Observer, Observer]
    0: Observer {id: 1001, fn: ƒ}
    1: Observer {id: 1002, fn: ƒ}
    2: Observer {id: 1003, fn: ƒ}
    length: 3
    __proto__: Array(0)
*/
```
- 接下来是已经写好的退订（解绑），直接粘贴进去（换一个厉害的名字）
```javascript
    unSubscribe(obs) {
        this.obsArr = this.obsArr.filter(ob => ob.id !== obs.id);  // 当前被观察者退订
    };

    perSubject.unSubscribe(optionObserver); // 退订观察者2
    perSubject.unSubscribe(showObserver); // 退订观察者3
```
- 最后，是循环执行（发布动态）
```javascript
    notify(val) {
        this.obsArr.map(item => item.fn(val))
    };
```
- 每当被观察者（下拉列表）改变时，发布一下
```javascript
    selPer.addEventListener('change', function (ev) {
        const val = this.value;
        if (val) perSubject.notify(val);
    });
```


搞定啦。

## 四、核心思路
- 关键点：
    - 观察者（参照上面栗子中的button、input、text）
    - 被观察者（参照上面栗子的select）
    - 任务列表（实际上是将栗子中的`this.obsArr`作为独立存在处理）- 观察者模式与订阅模式的区别点


- 观察者模式思路
  1. 一处内容变更，多处同步修改；
  2. 各个内容间本身没有关联；
  3. 变更目标单向通信。（双向会不停变动发布，形成死循环）


普通话翻译："如果我能让变动的下拉列表每变一次就通知一下其他人，又互不影响，就可以了。"

**划重点：需要同步更新，且其他内容动态变更，且不需要双向通信的情况**



## 四、观察者模式优劣

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
    4. 记得退订