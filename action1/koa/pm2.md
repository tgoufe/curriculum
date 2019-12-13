---
title: Koa从零搭建到Api实现—项目部署
date: 2019-07-22 18:20:00
top: 999
tags: 
  - Koa
  - Node.js
categories: 
  - Koa
  - Node.js
---

PM2是常用的node进程管理工具，它可以提供node.js应用管理，如自动重载、性能监控、负载均衡等。同类工具有Supervisor、Forever等。
<!--more-->

# PM2安装

使用PM2需要npm全局安装。


```
npm install -g pm2

```

# 启动PM2项目

## 直接启动项目

```
pm2 start app.js

```
即可启动Node.js应用，成功后会看到打印的信息：

```
[PM2] Spawning PM2 daemon with pm2_home=C:\Users\23101\.pm2
[PM2] PM2 Successfully daemonized
[PM2] Starting C:\xxx\lesson29\server.js in fork_mode (1 instance)
[PM2] Done.
┌────────┬────┬──────┬────────┬───┬─────┬───────────┐
│ Name   │ id │ mode │ status │ ↺ │ cpu │ memory    │
├────────┼────┼──────┼────────┼───┼─────┼───────────┤
│  app   │ 0  │ fork │ online │ 0 │ 0%  │ 32.0 MB   │
└────────┴────┴──────┴────────┴───┴─────┴───────────┘
 Use `pm2 show <id|name>` to get more details about an app

```

在表格中显示了应用的名称为app、id为0，应用名称和id都可以作为该应用的标识。

## 通过配置文件管理应用

PM2还支持通过配置文件管理应用，这种方式可以提供更丰富的配置，支持的配置格式是Javascript，JSON和YAML，具体可以查看文档。

## 文件夹结构
PM2启动后，它将自动创建这些文件夹：

```
$HOME/.pm2 将包含所有PM2相关文件
$HOME/.pm2/logs 将包含所有应用程序日志
$HOME/.pm2/pids 将包含所有应用程序pids
$HOME/.pm2/pm2.log PM2 日志
$HOME/.pm2/pm2.pid PM2 pid
$HOME/.pm2/rpc.sock 远程命令的套接字文件
$HOME/.pm2/pub.sock 可发布事件的套接字文件
$HOME/.pm2/conf.js PM2配置
在Windows中，$ HOME环境变量可以是$ HOMEDRIVE + $ HOMEPATH
```

# 查看应用列表


使用**pm2 list**可以查看应用列表

```
┌──────────┬────┬─────────┬──────┬───────┬────────┬─────────┬────────┬─────┬───────────┬───────┬──────────┐
│ App name │ id │ version │ mode │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user  │ watching │
├──────────┼────┼─────────┼──────┼───────┼────────┼─────────┼────────┼─────┼───────────┼───────┼──────────┤
│ server   │ 0  │ 1.0.0   │ fork │ 24776 │ online │ 9       │ 19m    │ 0%  │ 35.4 MB   │ 23101 │ disabled │
└──────────┴────┴─────────┴──────┴───────┴────────┴─────────┴────────┴─────┴───────────┴───────┴──────────┘

```

# 查看应用详情


在命令行中输入pm2 show 0，弹出信息如下：

```

 Describing process with id 0 - name server 
┌───────────────────┬─────────────────────────────────────────────┐
│ status            │ online                                      │
│ name              │ server                                      │
│ version           │ 1.0.0                                       │
│ restarts          │ 0                                           │
│ uptime            │ 3m                                          │
│ script path       │ C:\xxx\lesson29\server.js                   │
│ script args       │ N/A                                         │
│ error log path    │ C:\Users\23101\.pm2\logs\server-error.log   │
│ out log path      │ C:\Users\23101\.pm2\logs\server-out.log     │
│ pid path          │ C:\Users\23101\.pm2\pids\server-0.pid       │
│ interpreter       │ node                                        │
│ interpreter args  │ N/A                                         │
│ script id         │ 0                                           │
│ exec cwd          │ C:\xxx\lesson29                             │
│ exec mode         │ fork_mode                                   │
│ node.js version   │ 11.9.0                                      │
│ node env          │ N/A                                         │
│ watch & reload    │ ✘                                           │
│ unstable restarts │ 0                                           │
│ created at        │ 2019-04-09T14:07:23.918Z                    │
└───────────────────┴─────────────────────────────────────────────┘
 Revision control metadata 
┌──────────────────┬──────────────────────────────────────────┐
│ revision control │ git                                      │
│ remote url       │ https://github.com/chencl1986/Blog.git   │
│ repository root  │ C:\xxx\Blog                              │
│ last update      │ 2019-04-09T14:07:24.928Z                 │
│ revision         │ 08f1efdfeb48bcc87f96b563d4d013a22e42ed9f │
│ comment          │                                          │
│ branch           │ master                                   │
└──────────────────┴──────────────────────────────────────────┘
 Actions available 
┌────────────────────────┐
│ km:heapdump            │
│ km:cpu:profiling:start │
│ km:cpu:profiling:stop  │
│ km:heap:sampling:start │
│ km:heap:sampling:stop  │
└────────────────────────┘
 Trigger via: pm2 trigger server <action_name>

 Code metrics value 
┌────────────────────────┬───────┐
│ Heap Size              │ 13.70 │
│ Heap Usage             │ 59.91 │
│ Used Heap Size         │ 8.21  │
│ Active requests        │ 0     │
│ Active handles         │ 4     │
│ Event Loop Latency     │ 2.30  │
│ Event Loop Latency p95 │ 7.15  │
│ HTTP Mean Latency      │ 10    │
│ HTTP P95 Latency       │ 10038 │
│ HTTP                   │ 0     │
└────────────────────────┴───────┘
 Add your own code metrics: http://bit.ly/code-metrics
 Use `pm2 logs server [--lines 1000]` to display logs
 Use `pm2 env 0` to display environement variables
 Use `pm2 monit` to monitor CPU and Memory usage server


```

# 监控CPU内存

使用pm2 monit方法，即可监控CPU和内存的使用情况，同时应用的报错信息也会打印在Global Logs窗口中。

# 监听代码变化
使用如下命令，可以监听代码保存，并更新应用。

```

pm2 start server.js --watch

```

PM2不止监听server.js文件，还监听了它引用的所有模块，只要任意模块代码进行了保存，如键盘按下ctrl + s，或新建文件，PM2就会进行重启。
如果需要忽略某些文件，则可以在配置文件中设置，如下：

```
{
  "watch": ["server", "client"],
  "ignore_watch" : ["node_modules", "client/img"],
  "watch_options": {
    "followSymlinks": false
  }
}

```


- watch可以是布尔值，路径数组或表示路径的字符串。默认为false。
- ignore_watch可以是一个路径数组或一个字符串，它将被chokidar解释为glob或正则表达式。
- watch_options是一个替代chokidar的选项的对象。有关定义，请参阅chokidar文档。


# 环境管理

在项目开发时，通常需要进行环境管理，PM2可以使用配置文件与命令行参数设置环境。

## 添加配置文件

首先，使用pm2 init命令，创建一个ecosystem.config.js文件，其中已经有默认的配置。

```
module.exports = {
  apps : [{
    name: 'API',
    script: 'app.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};


```

## 修改配置

其中，对环境管理有用的为：

```
{
  env: {
    NODE_ENV: 'development'
  },
  env_production: {
    NODE_ENV: 'production'
  }
}


```

为了配合我们的项目，可以将配置修改为如下：

```
{
  env: {
    NODE_ENV: 'dev'
  },
  env_development: {
    NODE_ENV: 'dev'
  },
  env_production: {
    NODE_ENV: 'prod'
  }
}


```

- pm2 start ecosystem.config.js --watch --env
- pm2 start ecosystem.config.js --watch --env development
- pm2 start ecosystem.config.js --watch --env production

## 启动开发环境

在服务端的代码中，可以通过process.env.NODE_ENV，拿到设置的值。
例如我们使用pm2 start ecosystem.config.js --watch --env development命令启动项目，则可以打印出process.env.NODE_ENV的值为`dev：

```
const process = require('process')
console.log(process.env.NODE_ENV) // dev
mode = process.env.NODE_ENV // dev

```
