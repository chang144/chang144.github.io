# 3.5 - WebSocket

解决场景之一：服务器主动发送消息给客户端

## HTTP轮询

+ 问题产生：怎样才能在用户不做任何操作的情况下，网页能收到消息并发送变更？

+ 解决方案：网页不断定时发HTTP请求到服务器，服务器收到请求后给客户端响应消息

这一解决方案是一种**伪**服务器推送的形式

## 长轮询

将HTTP的请求超时设置很大，期间如果服务器接收到了请求，返回响应，如果超时，则再次发起新的HTTP请求

这样就可以减少HTTP的请求个数

## 什么是WebSocket

在tcp连接的两端，在同一时间内，双方都可以主动向对方推送数据，这叫做**全双工**

> `HTTP/1.1`属于**半双工**，也是基于TCP协议，同一时间内，客户端和服务器只能有一方主动发送数据

由于`HTTP/1.1`的半双工属性，在需要全双工的场景下，催生出了基于TCP的新协议**WebSocket**

> WebSocket作用于应用层，同时注意，`WebSocket`与`socket`之间接近毫无关系

## 如何建立WebSocket连接

为了兼容一些使用场景，浏览器在**TCP三次握手**建立连接之后，都统一使用**HTTP协议**进行一次通信

想要**建立WebSocket连接**，在原来的HTTP协议之上，加入一些特殊的`header`头

```
Connection: Upgrade
Upgrade: WebSocket
Sec-WebSocket-Key: T2a6wZlAwhgQNqruZ2YUyg==\r\n
```

这些header头的意思是：

+ `Connection: Upgrade`:表示浏览器想要升级协议
+ `Upgrade: WebSocket`:升级的协议是WebSocket
+ `Sec-WebSocket-Key`:随机生成的base64码

此时，如果服务器支持升级为WebSocket协议，将会走WebSocket握手流程，返回`101`状态码的响应给浏览器

```
HTTP/1.1 101 Switching Protocols\r\n
Sec-WebSocket-Accept: iBJKv/ALIW2DobfoA4dmr3JHBCY=\r\n
Upgrade: WebSocket\r\n
Connection: Upgrade\r\n
```

### WebSocket升级过程中的base64码

在HTTP升级为WebSocket过程中，请求和响应中分别携带的`Sec-WebSocket-Key`和`Sec-WebSocket-Accept`用以验证WebSocket升级是否成功

1. 浏览器随机生成base64码放到`Sec-WebSocket-Key`中，发送到服务器
2. 服务器根据客户端（浏览器）生成的base64码，用某一种**公开**的算法编程另一段**字符串**，放到HTTP响应的`Sec-WebSocket-Accept`头中
3. 浏览器根据**该公开的算法**（与服务器一致的算法）将base64码转成另一段字符串，并与服务器返回的`Sec-WebSocket-Accept`进行对比，如果一致，则验证通过

到这里，经历**两次HTTP握手**，WebSocket就建立完成。

![websocket建立连接](https://cdn.xiaolincoding.com//mysql/other/f4edd3018914fe6eb38fad6aa3fd2d65.png)

> WebSocket是基于TCP协议，在经历三次TCP握手之后，利用HTTP协议升级为WebSocket协议
>
> WebSocket协议只有在建立连接的过程中使用到了HTTP

## WebSocket的消息格式

建立完成WebSocket之后，两端就使用WebSocket的数据格式进行通信

![websocket数据格式](https://cdn.xiaolincoding.com//mysql/other/3a63a86e5d7e72a37b9828fc6e65c21f.png)

关注一下字段：

+ `opcode`:用来标志这个数据帧是什么类型

  + opcode = 1，指text类型（string）的数据包
  + opcode = 2，指二进制数据格式（[]byte)的数据报
  + opcode = 8，关闭连接信号

+ `payload length`:存放传输的数据的长度，单位是字节

  存放payload长度的字段有好几个，我们可以使用前面的`7bit`，也可以使用后面的`7+16bit`或者`7+64bit`

  websocket不管数据有多大，都会读取`7bit`，根据它的取值在决定要不要在读取`+16bit`或者`+64bit`

  + 开始的`7bit`的值在`0~125`，那么表示**payload的全部长度**，读取最开始的`7bit`就够了
  + 如果是`126(0x7E)`，表示payload的长度范围在`126~65535`,接下来只需再读`+16bit`
  + 如果是`127(0x7F)`，表示payload的长度范围在`>=65535`,接下来只需再读`+64bit`

+ `payload data`:存放实际传输的数据

> 因为TCP协议本身是全双工，而WebSocket是直接使用TCP去传输数据，所以会出现**粘包**的问题（？）

WebSocket一般会使用**消息头+消息体**的格式去重新包装要发送的数据

## WebSocket的使用场

适用于服务器和客户端频繁交互的大部分场景

