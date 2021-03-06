
 

> 出入平安

<!--more-->

![出入安全](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/https.png)


## **HTTP**
>超文本传输协议（HTTP，HyperText Transfer Protocol)是互联网上应用最为广泛的一种网络协议。所有的WWW文件都必须遵守这个标准。设计HTTP最初的目的是为了提供一种发布和接收HTML页面的方法。

### **HTTP解读**
**HTTP协议的主要特点可概括如下：**

* 支持客户/服务器模式。(C/S)
* 简单快速：客户向服务器请求服务时，只需传送请求方法和路径。请求方法常用的有GET、HEAD、POST。每种方法规定了客户与服务器联系的类型不同。由于HTTP协议简单，使得HTTP服务器的程序规模小，因而通信速度很快。
* 灵活：HTTP允许传输任意类型的数据对象。正在传输的类型由Content-Type加以标记。
* 无连接：无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。采用这种方式可以节省传输时间。
* 无状态：HTTP协议是无状态协议。无状态是指协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就较快。

**HTTP协议缺点：**

* 通信使用明文，内容可能被窃听(重要密码泄露)
* 不验证通信方身份，有可能遭遇伪装(跨站点请求伪造)
* 无法证明报文的完整性，有可能已遭篡改(运营商劫持)

**缺点解决**
#### 使用对称加密解决

![对称加密](	
http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/duichenmi.png)

对称密钥加密，又称私钥加密，即信息的发送方和接收方用同一个密钥去加密和解密数据。它的最大优势是加/解密速度快，适合于对大数据量进行加密，但双方都需要维护大量的密钥，密钥管理困难。

例如：DES、AES-GCM、ChaCha20-Poly1305等

#### 使用非对称加密解决

![非对称加密](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/feiduichenjiami.png)

非对称密钥加密，又称公钥加密，它需要使用一对密钥来分别完成加密和解密操作，一个公开发布，即公开密钥，另一个由用户自己秘密保存，即私用密钥。信息发送者用公开密钥去加密，而信息接收者则用私用密钥去解密。
从功能角度而言非对称加密比对称加密功能强大，但加密和解密速度却比对称密钥加密慢得多。

例如：RSA、DSA、ECDSA、 DH、ECDHE

## **HTTPS**
>HTTPS（全称：HyperText Transfer Protocol over Secure Socket Layer），安全的超文本传输协议其实,初衷是为了保证数据安全。大型互联网公司逐步都已经启用了全站 HTTPS，这也是未来互联网发展的趋势。

![https](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ssl.png)

https是在http协议基础上加入加密处理和认证机制以及完整性保护，即http+加密+认证+完整性保护=https
https并非应用层的一种新协议，只是http通信接口部分用ssl/tls协议代替而已。通常http直接和tcp通信，当使用ssl时则演变成先和ssl通信，再由ssl和tcp通信。

### **SSL**

>SSL 是“Secure Sockets Layer”的缩写，中文叫做“安全套接层”。在此之前互联网上使用的 HTTP 协议是明文的，存在各种安全问题，为了解决这种问题，SSL应运而生。

>1999年，IETF 就在那年把 SSL 标准化。标准化之后的名称改为 TLS（是“Transport Layer Security”的缩写），中文叫做“传输层安全协议”。
所以这两者其实就是同一种协议，只不过是在不同阶段的不同称呼。

>SSL协议可分为两层：
>>SSL记录协议（SSL Record Protocol）：它建立在可靠的传输协议（如TCP）之上，为高层协议提供数据封装、压缩、加密等基本功能的支持。
>>
>>SSL握手协议（SSL Handshake Protocol）：它建立在SSL记录协议之上，用于在实际的数据传输开始前，通讯双方进行身份认证、协商加密算法、交换加密密钥等。

**SSL/TLS协议的基本思路是采用公钥加密法，也就是说，客户端先向服务器端索要公钥，然后用公钥加密信息，服务器收到密文后，用自己的私钥解密。**

（1）如何保证公钥不被篡改？

	解决方法：将公钥放在数字证书中。只要证书是可信的，公钥就是可信的。

（2）公钥加密计算量太大，如何减少耗用的时间？

	解决方法：每一次对话（session），客户端和服务器端都生成一个"对话密钥"（session key），用它来加密信息。由于"对话密钥"是对称加密，所以运算速度非	常快，而服务器公钥只用于加密"对话密钥"本身，这样就减少了加密运算的消耗时间。

因此，SSL/TLS协议的基本过程是这样的：

（1） 客户端向服务器端索要并验证公钥。

（2） 双方协商生成"对话密钥"。

（3） 双方采用"对话密钥"进行加密通信。

### **HTTPS工作原理**

**1、客户端发起HTTPS请求**

用户在浏览器里输入一个https网址，然后连接到server的**443**端口。

**2、服务端的配置**

采用HTTPS协议的服务器必须要有一套数字证书，可以自己制作，也可以向组织申请，区别就是自己颁发的证书需要客户端验证通过，才可以继续访问，而使用受信任的公司申请的证书则不会弹出提示页面。这套证书其实就是一对公钥和私钥。

**3、服务端传送证书**

这个证书其实就是公钥，只是包含了很多信息，如证书的颁发机构，过期时间等等。

**4、客户端解析证书**

这部分工作是由客户端的SSL来完成的，首先会验证公钥是否有效，比如颁发机构，过期时间等等，如果发现异常，则会弹出一个警告框，提示证书存在问题。

（1）首先浏览器读取证书中的证书所有者、有效期等信息进行一一校验

（2）浏览器开始查找操作系统中已内置的受信任的证书发布机构CA，与服务器发来的证书中的颁发者CA比对，用于校验证书是否为合法机构颁发（比如Symantec、Comodo、GoDaddy、GlobalSign。）

（3）如果找不到，浏览器就会报错，说明服务器发来的证书是不可信任的。

（4）如果找到，那么浏览器就会从操作系统中取出颁发者CA 的公钥(多数浏览器开发商发布版本时，会事先在内部植入常用认证机关的公开密钥)，然后对服务器发来的证书里面的签名进行解密

（5）浏览器使用相同的hash算法计算出服务器发来的证书的hash值，将这个计算的hash值与证书中签名做对比

（6）对比结果一致，则证明服务器发来的证书合法，没有被冒充

（7）此时浏览器就可以读取证书中的公钥，用于后续加密了

**5、客户端传送加密信息**

这部分传送的是用证书加密后的随机值(对称加密秘钥)，目的就是让服务端得到这个随机值，以后客户端和服务端的通信就可以通过这个随机值来进行加密解密了。

**6、服务端解密信息**

服务端用证书私钥解密后，得到了客户端传过来的随机值(对称加密秘钥)，将内容通过该值进行对称加密

**7、传输加密后的信息**

这部分信息是服务端用私钥加密后的信息，可以在客户端被还原。

**8、客户端解密信息**

客户端用之前生成的私钥解密服务端传过来的信息，于是获取了解密后的内容。

![liucheng](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/httpsliucheng.png)
