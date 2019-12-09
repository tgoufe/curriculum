
---
title: Sequelize
date: 2019-08-26 18:00:00
tags:
    - Koa
    - Node
    - Mysql
categories: JavaScript
---

Sequelize你会用么？

<!--more-->

# Mysql 与 Sequelize 的关系

开始之前，我们先要对 ORM 有个大致的了解!何为 ORM
> ORM（Object Relational Mapping），称为对象关系映射，用于实现面向对象编程语言里不同类型系统的数据之间的转换。
> 对象关系映射（Object Relational Mapping，简称ORM，或O/RM，或O/R mapping），是一种程序设计技术，用于实现面向对象编程语言里不同类型系统的数据之间的转换。
Sequelize 呢！是一个基于 Promise 的 NodeJs ORM 库，目前支持 ostgres, MySQL, SQLite 和 Microsoft SQL Server 等数据库程序。Sequelize  相当一个中间人负责两者，谁呢？js 和 mysql 之间的交流。
让我们看一下Sequelize中各部分于Mysql概念上的对应关系

- 实例化 Sequelize 连接到 Database： 通过实例化 Sequelize 类，连接到数据库程序指定的数据库。
- 定义 Model 映射 Table：  通过模型映射数据表的定义并代理操作方法
- 指定 DataTypes 声明 Data Types：  把数据库的数据类型变成在 js 上下文中更合适的用法。
- 使用 Op 生成 Where 子句 Operators： 为选项对象提供强大的解耦和安全检测。
- 关联 Association 替代复杂的 Foreign Key 和 多表查询：  用一套简单的方法管理复杂的多表查询。
- 调用 Transcation 封装 Transation ：  对事务一层简单而必要的封装。
## 从一个小项目开始

开始之前，千万别忘了先把 Sequelize 以及依赖包安装到本地
```
npm i sequelize mysql2 -D

```
### 第一步，连接到数据库

Sequelize 是库的入口类，可做两件事情：
 1. 连接到数据库 
 2. 设置数据表的全局配置。
所以暂且可把 Sequelize 的实例 看做 Mysql 中的 Database（数据库）
```
// app/config/databse.config.js
export default {
  // 打开哪个数据库
  database: 'test',
  // 用户名
  username: 'root',
  // 密码
  password: '1234',
  // 使用哪个数据库程序
  dialect: 'mysql',
  // 地址
  host: 'localhost',
  // 端口
  port: 3306,
  // 连接池
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // 数据表相关的全局配置
  define: {
    // 是否冻结表名
    // 默认情况下，表名会转换为复数形式
    freezeTableName: true,
    // 是否为表添加 createdAt 和 updatedAt 字段
    // createdAt 记录表的创建时间
    // updatedAt 记录字段更新时间
    timestamps: true,
    // 是否为表添加 deletedAt 字段
    // 默认情况下, destroy() 方法会删除数据，
    // 设置 paranoid 为 true 时，将会更新 deletedAt 字段，并不会真实删除数据。
    paranoid: false
  }
}
```
导入配置文件，并实例化 Sequelize。
```
// app/models/test/index.js
import Sequelize from 'sequelize'
import config from '../../config/database.config'
// 实例化，并指定配置
export const sequelize = new Sequelize(config)
// 测试连接
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
```
> 划重点：models 目录用于存放 Sequelize 库相关文件，下层目录对应 Sequelize 打开 Mysql 中的 Database，每个下层目录中的 index.js 主文件用于整合 Model，而其他 .js 文件对应当前 Database 中的一张 Table。

### 第二步，建立模型

Model 是由 sequelize.define()（sequelize 就是上小节中的实例） 方法定义用于映射数据模型和数据表之间的关系的对象模型,其实就是 Mysql 中的一张数据表
新建一个文件 User.js 存放用户表的模型定义，如下：
```
// /models/test/User.js
export default (sequelize, DataTypes) =>
  // define() 方法接受三个参数
  // 表名，表字段的定义和表的配置信息
  sequelize.define('user', {
    id: {
      // Sequelize 库由 DataTypes 对象为字段定义类型
      type: DataTypes.INTEGER(11),
      // 允许为空
      allowNull: false,
      // 主键
      primaryKey: true,
      // 自增
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      // 唯一
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  })
```
然后，导入并同步到 Mysql 中。
```
// /test/index.js
import Sequelize from 'sequelize'
import config from '../../config/database.config'
export const sequelize = new Sequelize(config)
// 导入
export const User = sequelize.import(__dirname + '/User')
// 同步到 Mysql 中
// 也就是将我们用 js 对象声明的模型通过 sequelize 转换成 mysql 中真正的一张数据表
sequelize.sync()
// ...
```
> 划重点：推荐将所有的模型定义在 单文件 中以实现模块化，并通过 sequelize.import() 方法把模块导入到 index.js 中统一管理。
Sequelize 库会为我们执行以下 Mysql 原生命令在 test 中创建一张名为 user 的数据表。
```
CREATE TABLE IF NOT EXISTS `user` (`id` INTEGER(11) NOT NULL auto_increment UNIQUE , `username` VARCHAR(255) NOT NULL UNIQUE, `password` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
```
 >sequelize.sync() 将模型同步到数据库的三种方法和区别？
```
// 标准同步
// 只有当数据库中不存在与模型同名的数据表时，才会同步
sequelize.sync()
// 动态同步
// 修改同名数据表结构，以适用模型。
sequelize.sync({alter: true})
// 强制同步
// 删除同名数据表后同步，谨慎使用，会导致数据丢失
sequelize.sync({force: true})
// 另外，当你指定表与表之间的关联后，修改被关联的表结构时会抛出异常。
// 需要先注释掉关联代码，然后更新同步模型后，再取消掉注释即可。
// 再另外，当你有新的关联时必须使用动态同步才会生效。

```
同步成功后，我们把 sequelize.synce 注释掉。因为，我们再次重启应用后不需要再重新同步。
```
// sequelize.sync()
```
然后，在 controllers 中创建同名 User.js 文件，存放用户相关的接口逻辑（注册，登录，登出，查询和删除等）
```
// /controllers/User.js
import { User } from '../models/test/'

export default class {
  static async register (ctx) {
    const post = ctx.request.body
    let result
    try {
      // 调用模型的 create()  方法插入一行数据
      result = await User.create(post)
    } catch (error) {
      return ctx.body = {success: false, error}
    }
    ctx.body = {success: true, data: result}
  }
  // ...
}
```
> 这里你可能会有个疑问，就是控制器（controllers）中的逻辑分类应该是对应模型（model）还是路由（router）？其实这个问题很好回答，controllers 原本就是为了更好的管理 router 而分离出来的，而 router 的接口路径也应该恰好能够自我解释控制器逻辑的作用，所以控制器中的逻辑分类应该按照路由区别。
最后，挂载至路由。
```
// /router.js
import Router from 'koa-router'
const router = new Router
router.prefix('/api/v1')
import User from './controllers/User'
router
  .post('/register', User.register)
  // ...
export default router
```
打开 postman（或者其他接口调试工具）发起请求。请求成功后查看 Mysql。看是否有新的内容插入
> User.create() 方法返回的是一个由 Sequelize 库定义的结果集类（模型上大部分直接操作数据库的方法都返回这一结果集类）。
```
result = await User.create(post)
// 可直接获取结果集中的字段值
result.username
// 或者使用结果集对象提供的方法
result.getDataValue('username')
// 或者将结果集解析为一个 JSON 对象
result.toJSON()
// 踩坑必备
// 直接在结果集类上添加自定义数据是无效的
result.newAttr = 'newValue'
// 调用 setDataValue 方法或者调用 toJSON() 将它转换为一个对象
result.setDataValue('newAttr', 'newValue')
```
#### 模型方法
除了用户模型外，我们还需定义文章模型（article）、文章的点赞模型（article_like）、文章的收藏模型（article_star）和文章的评论模型（article_comment）。
这里列出了模型上一些操作数据库常用的方法。
[官方文档][12]
```
findOne()
findAll()
findById()
findOrCreate()
findOrBuild()
findAndCountAll()
create()
bulkCreate()
update()
upsert()
destroy()
increment()
decrement()
count()
max()
min()
sun()
```
#### 数据类型

DataTypes 对象为模型的字段指定数据类型。
以下列出了部分 DataTypes 类型 对应的 Mysql 数据类型。
```
// 字符串
STRING(N=255)               // varchar(0~65535)
CHAR(N=255)                 // char(0~255)
TEXT(S=tiny/medium/long)    // s + text
// 数字
// 整数
TINYINT(N?)         // tinyint(1-byte)
SMALLINT(N?)        // smallint(2-byte)
MEDIUMINT(N?)       // mediumint(3-byte)
INTEGER(N=255?)     // integer(6-byte)
BIGINT(N?)          // bigint(8-byte)
// 浮点数
FLOAT(n, n)         // float(4-byte)
DOUBLE(n, n)        // double(8-byte)
// 布尔值
BOOLEAN             // tinyint(1)
// 日期
DATE(n?)            // datetime(8-byte)
TIME                // timestamp(4-byte)
NOW                 // 默认值为 current timestamp
// 其他
ENUM( any，...)      // ENUM('value1', ...) length > 65535 
JSON                 // JSON
```
integer，bigint，float 和 double 都支持 unsigned 和 zerofill 属性
```
Sequelize.INTEGER(11).UNSIGNED.ZEROFILL
```
#### 验证器
Model 为每个字段都提供了验证选项。
```
export default (sequelize, DataTypes) =>
  sequelize.define('user', {
    // ...
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true
      }
    }
  })
```
另外，可指定 args 和 msg 自定义参数和错误消息。
```
isEmail: {
    args: true, // 可省略，默认为 true
    msg: "邮箱格式不合法！"
}
```
只有当创建（比如，调用 create() 方法）或更新（比如，调用 update() 方法）模型数据时，才会触发验证器，另外当设置 allowNull: true，且字段值为 null 时，也不会触发验证器。仅当验证器验证通过时才会真实将操作同步到数据库中。当验证未通过时，会抛出一个 SequelizeValidationError 异常对象（这也是为什么，需要在数据库操作的地方用 try catch 语句捕获错误，防止 nodeJs 进程退出）。
```
validate: {
    is: ["^[a-z]+$",'i'],     // 只允许字母
    is: /^[a-z]+$/i,          // 与上一个示例相同,使用了真正的正则表达式
    not: ["[a-z]",'i'],       // 不允许字母
    isEmail: true,            // 检查邮件格式 (foo@bar.com)
    isUrl: true,              // 检查连接格式 (http://foo.com)
    isIP: true,               // 检查 IPv4 (129.89.23.1) 或 IPv6 格式
    isIPv4: true,             // 检查 IPv4 (129.89.23.1) 格式
    isIPv6: true,             // 检查 IPv6 格式
    isAlpha: true,            // 只允许字母
    isAlphanumeric: true,     // 只允许使用字母数字
    isNumeric: true,          // 只允许数字
    isInt: true,              // 检查是否为有效整数
    isFloat: true,            // 检查是否为有效浮点数
    isDecimal: true,          // 检查是否为任意数字
    isLowercase: true,        // 检查是否为小写
    isUppercase: true,        // 检查是否为大写
    notNull: true,            // 不允许为空
    isNull: true,             // 只允许为空
    notEmpty: true,           // 不允许空字符串
    equals: 'specific value', // 只允许一个特定值
    contains: 'foo',          // 检查是否包含特定的子字符串
    notIn: [['foo', 'bar']],  // 检查是否值不是其中之一
    isIn: [['foo', 'bar']],   // 检查是否值是其中之一
    notContains: 'bar',       // 不允许包含特定的子字符串
    len: [2,10],              // 只允许长度在2到10之间的值
    isUUID: 4,                // 只允许uuids
    isDate: true,             // 只允许日期字符串
    isAfter: "2011-11-05",    // 只允许在特定日期之后的日期字符串
    isBefore: "2011-11-05",   // 只允许在特定日期之前的日期字符串
    max: 23,                  // 只允许值 <= 23
    min: 23,                  // 只允许值 >= 23
    isCreditCard: true,       // 检查有效的信用卡号码
}
```
#### Getters & Setters


Getters 和 Setters 可以让你在获取和设置模型数据时做一些处理。
```
export default (sequelize, DataTypes) =>
  sequelize.define('user', {
    // ...
    sex: {
      type: DataTypes.BOLLEAN,
      allowNull: true,
      get () {
        const sex = this.getDataValue('sex')
        return sex ? '男' : '女'
      },
      set (val) {
        this.setDataValue('title', val === '男')
      }
    }
  })
```
### 第三步，关联

```
// models/test/index.js
// 导入
export const User = sequelize.import(__dirname + '/User')
export const Article = sequelize.import(__dirname + '/Article')
export const ArticleLike = sequelize.import(__dirname + '/Article_like')
export const ArticleStar = sequelize.import(__dirname + '/Article_star')
export const ArticleComment = sequelize.import(__dirname + '/Article_comment')
```
关联知识点简要一览
```
// models/test/index.js
// 在 source 上存在一对一关系的外键关联
source.belongsTo(target， {
    as: 'role'  // 使用别名（可代替目标模型）,
    foreignKey: 'user_id'   // 外键名,
    targetKey:  'id'        // 目标健，默认主键
})
// 在 target 上存在一对一关系的外键关联
source.hasOne(target)
// 在 target 上存在一对多 source 的外键关联
source.hasMany(target)
// 在 target 上存在多对多的外键关系（必须通过另外一张数据表保存关联数据）
source.belongsToMany(target, {through: 'UserProject'})
target.belongsToMany(source, {through: 'UserProject'})
```
接下来，我们来建立表与表之间的关联。显而易见，User 和 Article 之间存在一对多的关系，每个用户可先制定个小目标，先发它一亿篇文章（User 到 Article 为一对多，即用 hasMany 方法），反过来，一篇文章仅属于某个用户的私有财产（Article 到 User 为一对一，即用 belongsTo 方法）。
```
// models/test/index.js
// 外键 uid 将会放到 Article 上
User.hasMany(Article, {foreignKey: 'uid'})
// 同样，还是把外键放到 Article 上
Article.belongsTo(User, {foreignKey: 'uid'})
```
同步后，查看数据表 Article 时,多出了一个字段， 正是uid，这个就是外键。
>那么，问题就来了，为什么需要建立表与表之间的关联？它有何用？因为方便，如果你想要通过一次查询就把文章数据和文章所有关的点赞、收藏和评论数据一起找出来，并且放在一个数据结构中，那么关联是不可被替代的。在你 sequelize 一次查询多个表的关联数据时，它本质上是生成了一个复杂的 mysql 链表查询语句。而在 sequeliz 中你仅仅在需要时，指定即可。
User 与 ArticleLike，ArticleStar 和 ArticleComment 都存在与上述一样的关联关系,复制粘贴即可
```
// models/test/index.js
User.hasMany(ArticleLike, {foreignKey: 'uid'})
ArticleLike.belongsTo(User, {foreignKey: 'uid'})
User.hasMany(ArticleStar, {foreignKey: 'uid'})
ArticleStar.belongsTo(User, {foreignKey: 'uid'})
User.hasMany(ArticleComment, {foreignKey: 'uid'})
ArticleComment.belongsTo(User, {foreignKey: 'uid'})
```
另外， Article 与 ArticleLike，ArticleStar 和 ArticleComment 之间也存在关联关系，比如一条评论，你既要知道谁写的评论（uid），还有知道评论了哪篇文章 (aid)
```
// models/test/index.js
Article.hasMany(ArticleLike, {foreignKey: 'aid'})
ArticleLike.belongsTo(Article, {foreignKey: 'aid'})
Article.hasMany(ArticleStar, {foreignKey: 'aid'})
ArticleStar.belongsTo(Article, {foreignKey: 'aid'})
Article.hasMany(ArticleComment, {foreignKey: 'aid'})
ArticleComment.belongsTo(Article, {foreignKey: 'aid'})
```
同步后，看查看数据表 ArticleComment时，正如所料，它多出两个外键字段 uid 和 aid。

#### 关联使用

```
// 查询文章数据，同时关联评论数据
Article.findAll({
  // 通过 include 字段，把需要关联的模型指定即可。
  // 就辣么简单！
  include: [ArticleComment]
})
// 返回数据
{
    "id": 4,
    "title": "我是标题",
    "content": "我是内容",
    "createdAt": "2018-10-11T03:42:01.000Z",
    "updatedAt": "2018-10-11T03:42:01.000Z",
    "uid": 1,
    // 评论
    "article_comments": [/* */]
}
```
```
// 带上所有已建立关联表的数据
Article.findAll({
  include: [{
    all: true  
  }]
})

// 返回数据
}
    "id": 4,
    "title": "我是标题",
    "content": "我是内容",
    "createdAt": "2018-10-11T03:42:01.000Z",
    "updatedAt": "2018-10-11T03:42:01.000Z",
    "uid": 1,
    // 用户
    "user": {
        "id": 1,
        "username": "sunny",
        "password": "1234",
        "createdAt": "2018-10-11T03:38:54.000Z",
        "updatedAt": "2018-10-11T03:38:54.000Z"
    },
    // 点赞
    "article_likes": [/* */]],
    // 收藏
    "article_stars": [/* */]],
    // 评论
    "article_comments": [/* */]]
}

```
```
// 甚至你还可以深度递归（小心死循环）
Article.findAll({
  include: [{
    all: true,
    nested: true
  }]
})
```
### 第四步，接口逻辑

接口呢！也就是增删改查
```
// app/controllers/Article.js
import {Article} from "../models/test"
export default class {
  // 增
  static async add (ctx) {
    const post = ctx.request.body
    let result
    try {
      // 简单直了
      result = await Article.create(post)
    } catch (error) {
      return ctx.body = {success: false, error}
    }
    ctx.body = {success: true, data: result}
  }
  
   // 删
  static async remove (ctx) {
    const {id, uid} = ctx.request.body
    let result
    try {
      // 必须同时指定 id 和 uid 才能删除
      result = await Article.destroy({
        where: { id, uid }
      })
    } catch (error) {
      return ctx.body = {success: false, error}
    }
    ctx.body = {success: true, data: result}
  }
  // 改    
  static async update (ctx) {
    const post = ctx.request.body
    // 才不让你改所属的用户呢
    delete post.uid
    let result
      // 改呢，必须通过 where 指定主键
      result = await Article.update(post, {where: {id: post.id}})
    ctx.body = {success: true, data: result}
  }
  // 查
  static async find (ctx) {
    const {id, uid} = ctx.query
    let result
    try {
      result = await Article.findAll({
        // 可选的 id（查询指定文章数据） 和 uid（查询指定用户所有的文章数据）
        where: Object.assign({}, id && {id}, uid && {uid}),
        // 带上所有的关联数据
        include: [{
          all: true,
        }]
      })
    } catch (error) {
      return ctx.body = {success: false, error}
    }
    ctx.body = {success: true, data: result}
  }
}
```
最后记得挂载到路由。
```
// app/router.js
import Article from './controllers/Article'
router
  .get('/article/find', Article.find)
  .post('/article/add', Article.add)
  .post('/article/update', Article.update)
  .post('/article/remove', Article.remove)
```
**Op（查询条件）**
--
Op 对象集内置了一系列适用于 where 子句 查询的操作符（查询条件）。
```
// /models/test/index.js
//  导出 Op
export const Op = Sequelize.Op
```
```
// /models/controllers/User.js
import {User, Op} from '../models/test/'

export default class {
  static async findTest (ctx) {
    let result
    try {
      result = await User.findAll({
        // 查询所有 id > 2 的用户
        where: {
          id: {
            [Op.gt]: 2
          }
        }
      })
    } catch (error) {
      return ctx.body = {success: false, error}
    }
    ctx.body = {success: true, data: result}
  }
}
```
以下列出了所有内置的 Op 操作符
```
[Op.and]: {a: 5}           // 且 (a = 5)
[Op.or]: [{a: 5}, {a: 6}]  // (a = 5 或 a = 6)
[Op.gt]: 6,                // id > 6
[Op.gte]: 6,               // id >= 6
[Op.lt]: 10,               // id < 10
[Op.lte]: 10,              // id <= 10
[Op.ne]: 20,               // id != 20
[Op.eq]: 3,                // = 3
[Op.not]: true,            // 不是 TRUE
[Op.between]: [6, 10],     // 在 6 和 10 之间
[Op.notBetween]: [11, 15], // 不在 11 和 15 之间
[Op.in]: [1, 2],           // 在 [1, 2] 之中
[Op.notIn]: [1, 2],        // 不在 [1, 2] 之中
[Op.like]: '%hat',         // 包含 '%hat'
[Op.notLike]: '%hat'       // 不包含 '%hat'
[Op.iLike]: '%hat'         // 包含 '%hat' (不区分大小写)  (仅限 PG)
[Op.notILike]: '%hat'      // 不包含 '%hat'  (仅限 PG)
[Op.regexp]: '^[h|a|t]'    // 匹配正则表达式/~ '^[h|a|t]' (仅限 MySQL/PG)
[Op.notRegexp]: '^[h|a|t]' // 不匹配正则表达式/!~ '^[h|a|t]' (仅限 MySQL/PG)
[Op.iRegexp]: '^[h|a|t]'    // ~* '^[h|a|t]' (仅限 PG)
[Op.notIRegexp]: '^[h|a|t]' // !~* '^[h|a|t]' (仅限 PG)
[Op.like]: { [Op.any]: ['cat', 'hat']} // 包含任何数组['cat', 'hat'] - 同样适用于 iLike 和 notLike
[Op.overlap]: [1, 2]       // && [1, 2] (PG数组重叠运算符)
[Op.contains]: [1, 2]      // @> [1, 2] (PG数组包含运算符)
[Op.contained]: [1, 2]     // <@ [1, 2] (PG数组包含于运算符)
[Op.any]: [2,3]            // 任何数组[2, 3]::INTEGER (仅限PG)
[Op.col]: 'user.organization_id' // = 'user'.'organization_id', 使用数据库语言特定的列标识符, 本例使用 PG
```
>为什么不直接使用符号而是使用额外的封装层 Op，据官方说法是为了防止 SQL 注入和其他一些安全检测。另外，Op 对象集其实是一系列 Symbol 的集合。

  [1]: https://segmentfault.com/a/1190000018586799
  [2]: /img/bVbp9wi
  [3]: /img/bVbp9wq
  [4]: https://www.toutiao.com/c/user/5829409765/#mid=1618557694883854
  [5]: https://weibo.com/qqkillqq
  [6]: https://www.qdfuns.com/u/21292.html
  [7]: https://segmentfault.com/u/bingshangroup
  [8]: https://www.jianshu.com/u/4e2e5c6a5983
  [9]: https://space.bilibili.com/406530879
  [10]: /img/bVbp9sy
  [11]: /img/bVbp9s4
  [12]: https://github.com/demopark/sequelize-docs-Zh-CN
  [13]: /img/bVbp9wi
  [14]: /img/bVbp9wq
