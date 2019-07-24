
前端如何玩转Nginx


<img itemprop="url image" src="https://cdn.almostover.ru/images/2017-04/get-letsencrypt-free-ssl-and-configure-with-nginx.png" class="full-image" alt="SSL сертификат от Let's Encrypt под NGINX">
<!--more-->
## 前端如何玩转Nginx
### 什么是Nginx，Nginx应该怎么读？

>Nginx [engine x] is an HTTP and reverse proxy server, a mail proxy server, and a generic TCP/UDP proxy server

>Nginx是一个HTTP和反向代理服务器，一个邮件代理服务器和一个通用的TCP / UDP代理服务器。

和通常所说的Apache一样(Apache HTTP Server)，都属于WEB servre的一种，相比于Apache，Nginx更轻量级，同样提供web 服务，可以比Apache占用更少的内存及资源，更能抗并发，nginx 处理请求是异步非阻塞的，而Apache则是阻塞型的，在高并发下Nginx能保持低资源低消耗高性能，同时具有高度模块化的设计，编写模块相对简单，支持 7 层负载均衡。
有别于Tomcat,后者属于Java Servlet容器，主要用于生成动态页面的。

>**作为 Web 服务器：**相比 Apache，Nginx 使用更少的资源，支持更多的并发连接，体现更高的效率，能够支持高达 50,000 个并发连接数的响应.

>**作为负载均衡服务器：**Nginx 既可以在内部直接支持 Rails 和 PHP，也可以支持作为 HTTP代理服务器对外进行服务。Nginx 用 C 编写, 不论是系统资源开销还是 CPU 使用效率都比 Perlbal 要好的多。

>**作为邮件代理服务器:** Nginx 同时也是一个非常优秀的邮件代理服务器（最早开发这个产品的目的之一也是作为邮件代理服务器）。

>**Nginx 安装非常的简单**，配置文件 非常简洁（还能够支持perl语法），Bugs非常少的服务器: Nginx 启动特别容易，并且几乎可以做到7*24不间断运行，即使运行数个月也不需要重新启动。你还能够在不间断服务的情况下进行软件版本的升级。


### Nginx中基础知识
附录零
### 前端能用他干什么
**1.反向代理**

*正向代理代理客户端，反向代理代理服务器*
![正向代理](https://pic4.zhimg.com/80/v2-07ededff1d415c1fa2db3fd89378eda0_hd.jpg)
![反向代理](https://pic4.zhimg.com/80/v2-816f7595d80b7ef36bf958764a873cba_hd.jpg)

反向代理对用户是非透明的，即我们并不知道自己访问的是代理服务器，而服务器知道反向代理在为他服务。

```shell
#工作模式及连接数上限,感兴趣的可以看附录1
events { 

}

http 
{
	#设定虚拟主机配置
    server {
        listen 80;  #侦听端口
        server_name aa.aa.com; #定义访问时服务名称
        #请求的路由，以及各种页面的处理情况。
        location / {
        		#Proxy Settings 附录2
            proxy_pass https:127.0.0.1：8080;  #转发路径
        }
    }
    server {
        listen 80;  #侦听端口
        server_name bb.bb.com; #定义访问时服务名称
        #请求的路由，以及各种页面的处理情况。
        location / {
            rewrite ^/(?!template|icon_resource|component|js)(.*/.*).html$ /html/$1.html break;                  #改写URL，正则
            root  /Users/carlo/tgou/tgou/branch/dev; #本地路径
            index  index.html index.htm;             #定义首页索引文件的名称
        }
    }
}
```

**2.静态资源访问**

```shell
#工作模式及连接数上限,感兴趣的可以看附录1
events { 

}

http 
{
	#设定虚拟主机配置
    server {
        listen 80;  #侦听端口
        server_name aa.aa.com; #定义访问时服务名称
        #请求的路由，以及各种页面的处理情况。
			location ~* \.(png|gif|jpg|jpeg)$ {
			    root    /root/static/;
			    autoindex on;  #开启目录浏览
			    #过期30天，静态文件不怎么更新，过期可以设大一点， 
				 expires 30d;         
			}
    }
}
```
匹配以png|gif|jpg|jpeg为结尾的请求，并将请求转发root中指定的路径。同时也可以进行一些缓存的设置。

**3.解决跨域**

```shell
#工作模式及连接数上限,感兴趣的可以看附录1
events { 

}

http 
{
	#设定虚拟主机配置
    server {
        listen 80;  #侦听端口
        server_name aa.aa.com; #定义访问时服务名称
        #请求的路由，以及各种页面的处理情况。
	    location / {
	        add_header Access-Control-Allow-Origin *;  
	        add_header Access-Control-Allow-Credentials true;  
	        add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
	    }
    }
    server {
        listen 80;  #侦听端口
        server_name aa.aa.com; #定义访问时服务名称
        location /api{
          proxy_pass dev.server.com; #nginx对服务端转发的请求不会触发浏览器的同源策略。
        }
	}
}
```
**4.请求拦截**

```shell
http 
{
	#设定虚拟主机配置
    server {
        listen 80;  #侦听端口
        server_name aa.aa.com; #定义访问时服务名称
        #根据状态码过滤
		  error_page 500 501 502 503 504 506 /50x.html;
	     location = /50x.html {
	        # 将跟路径改编为存放 html 的路径。
	        root /root/static/html;
	    }		
    }，
    server {
	     listen 80;  #侦听端口
	     server_name aa.aa.com; #定义访问时服务名称
	     #根据请求类型过滤。
		if ($request_method = DELETE ) {
				return 403;
		}

    }		
}
}
```

**5.负载均衡**

网络负载均衡是由多台服务器以对称的方式组成一个服务器集合，每台服务器都具有等价的地位，都可以单独对外提供服务而无须其他服务器的辅助。
WEB服务器将外部发送来的请求均匀分配到对称结构中的某一台服务器上，而接收到请求的服务器独立地回应客户的请求。负载均衡能够平均分配客户请求到服务器列阵，借此提供快速获取重要数据，解决大量并发访问服务问题。

```shell
http 
{
	#热备，第一个server挂了，切换到第二个。
	upstream serverList {
	    server 1.1.1.1;
	    server 2.2.2.2 backup;
	}
	
	#默认使用轮询的方式，把每个请求按顺序逐一分配到不同的server，如果server挂掉，则自动剔除。
	upstream serverList {
	    server 1.1.1.1;
	    server 2.2.2.2;
	}
	
	#加权轮询策略，不设置默认为1。
	upstream serverList {
	    server 1.1.1.1  weight=1;
	    server 2.2.2.2  weight=2;#上一个的2倍
	}
	
	#最少连接策略，把每个请求优先分配连接数最少的server，可以平衡每个队列的长度，并避免向压力大的服务器添加更多的请求
	upstream serverList {
		 least_conn;
	    server 1.1.1.1;
	    server 2.2.2.2;
	}
	
	#基于IP策略，把每个请求按访问IP的hash结果分配，同一个IP会分配到同一个后端服务器，可以解决session问题。	
	upstream serverList {
		 ip_hash;
	    server 1.1.1.1;
	    server 2.2.2.2;
	}
	
	#使用第三方插件可实现fair(最快响应时间策略),url_hash(基于UR策略)
	
	#设定虚拟主机配置
    server {
    
	}
}
```


**6.其他常用功能**

* **禁止访问**

```shell
http 
{
	#设定虚拟主机配置
    server {
        listen 80;  #侦听端口
        server_name aa.aa.com; #定义访问时服务名称
        #禁止访问指定目录下的指定文件
	    location ~* /(caches|include|uploadfile)/.*\.(html|htm)$ {
	        deny all;
	    }
    }
    server {
    	#禁止使用IP地址访问
		listen 80 default;
		server_name _;
		return 403;
	}
}
```
* **gzip**

gzip是一项由WEB服务器和浏览器之间共同遵守的协议，需要双方都支持才会启用。过程如下：

首先浏览器请求某个URL地址，并在请求的头中设置属性accept-encoding值为gzip,deflate，表明浏览器支持gzip压缩。

服务器接收到请求后判断浏览器是否支持压缩，如果支持就传送压缩后的响应内容，否则传送不经过压缩的内容；

```
http 
{

	gzip on;
	gzip_disable "msie6"; #IE6不压缩

    gzip_http_version       1.1;        
    gzip_comp_level         5;   #压缩级别
	 gzip_min_length 256;         #不压缩临界值
	 gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/vnd.ms-fontobject application/x-font-ttf font/opentype image/svg+xml image/x-icon;

    server {

    }
}
```

### [nginx中文站](http://www.nginx.cn/doc/index.html)

### 附录零
#### 全局变量
![全局变量](http://xuqiang.cc/wp-content/uploads/2019/04/WechatIMG109.jpeg)

#### nginx location的匹配规则
* =			严格匹配。如果请求匹配这个location，那么将停止搜索并立即处理此请求
* ~         区分大小写匹配(可用正则表达式)
* ~*        不区分大小写匹配(可用正则表达式)
* !~        区分大小写不匹配
* !~*       不区分大小写不匹配
* ^~        如果把这个前缀用于一个常规字符串,那么告诉nginx 如果路径匹配那么不测试正则表达式

### 附录一

```
#运行用户
user nobody;
#启动进程,通常设置成和cpu的数量相等
worker_processes  1;

#全局错误日志及PID文件
#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

#工作模式及连接数上限
events {
    #epoll是多路复用IO(I/O Multiplexing)中的一种方式,
    #仅用于linux2.6以上内核,可以大大提高nginx的性能
    use   epoll; 

    #单个后台worker process进程的最大并发链接数    
    worker_connections  1024;

    # 并发总数是 worker_processes 和 worker_connections 的乘积
    # 即 max_clients = worker_processes * worker_connections
    # 在设置了反向代理的情况下，max_clients = worker_processes * worker_connections / 4  为什么
    # 为什么上面反向代理要除以4，应该说是一个经验值
    # 根据以上条件，正常情况下的Nginx Server可以应付的最大连接数为：4 * 8000 = 32000
    # worker_connections 值的设置跟物理内存大小有关
    # 因为并发受IO约束，max_clients的值须小于系统可以打开的最大文件数
    # 而系统可以打开的最大文件数和内存大小成正比，一般1GB内存的机器上可以打开的文件数大约是10万左右
    # 我们来看看360M内存的VPS可以打开的文件句柄数是多少：
    # $ cat /proc/sys/fs/file-max
    # 输出 34336
    # 32000 < 34336，即并发连接总数小于系统可以打开的文件句柄总数，这样就在操作系统可以承受的范围之内
    # 所以，worker_connections 的值需根据 worker_processes 进程数目和系统可以打开的最大文件总数进行适当地进行设置
    # 使得并发总数小于操作系统可以打开的最大文件数目
    # 其实质也就是根据主机的物理CPU和内存进行配置
    # 当然，理论上的并发总数可能会和实际有所偏差，因为主机还有其他的工作进程需要消耗系统资源。
    # ulimit -SHn 65535

}


http {
    #设定mime类型,类型由mime.type文件定义
    include    mime.types;
    default_type  application/octet-stream;
    #设定日志格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  logs/access.log  main;

    #sendfile 指令指定 nginx 是否调用 sendfile 函数（zero copy 方式）来输出文件，
    #对于普通应用，必须设为 on,
    #如果用来进行下载等应用磁盘IO重负载应用，可设置为 off，
    #以平衡磁盘与网络I/O处理速度，降低系统的uptime.
    sendfile     on;
    #tcp_nopush     on;

    #连接超时时间
    #keepalive_timeout  0;
    keepalive_timeout  65;
    tcp_nodelay     on;

    #开启gzip压缩
    gzip  on;
    gzip_disable "MSIE [1-6].";

    #设定请求缓冲
    client_header_buffer_size    128k;
    large_client_header_buffers  4 128k;


    #设定虚拟主机配置
    server {
        #侦听80端口
        listen    80;
        #定义使用 www.nginx.cn访问
        server_name  www.nginx.cn;

        #定义服务器的默认网站根目录位置
        root html;

        #设定本虚拟主机的访问日志
        access_log  logs/nginx.access.log  main;

        #默认请求
        location / {
            
            #定义首页索引文件的名称
            index index.php index.html index.htm;   

        }

        # 定义错误提示页面
        error_page   500 502 503 504 /50x.html;
        location = /50x.html {
        }

        #静态文件，nginx自己处理
        location ~ ^/(images|javascript|js|css|flash|media|static)/ {
            
            #过期30天，静态文件不怎么更新，过期可以设大一点，
            #如果频繁更新，则可以设置得小一点。
            expires 30d;
        }

        #PHP 脚本请求全部转发到 FastCGI处理. 使用FastCGI默认配置.
        location ~ .php$ {
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
            include fastcgi_params;
        }

        #禁止访问 .htxxx 文件
            location ~ /.ht {
            deny all;
        }

    }
}
```



location 同域名
多个策略  
gzip  等级
多个config







