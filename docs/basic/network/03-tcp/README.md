# 计算机网络 - tcp篇

## TCP基础

### TCP头格式

![TCP](https://cdn.xiaolincoding.com//mysql/other/format,png-20230309230534096.png)

+ **序列号**：在建立连接时，由计算机生成的随机数最为初始值，通过**SYN**包传给接收端主机，每发送一次数据，就累加一次该数据字节数的大小，**用以解决网络包乱序问题**
+ **确认应答号**：指下一次期望收到的数据的序列号，发送端收到这个确认应答以后可以确定这个序号以前的数据都被正常接收。用来解决丢包的问题
+ **控制位**：
  + `ACK`:位为`1`时，确认应答的字段变为有效，TCP规定处理最初建立时的`SYN`包之外该为必须设置为`1`
  + `RST`:位为`1`时，表示TCP连接中出现异常必须强制断开连接
  + `SYN`:位为`1`时，表示希望连接，并在其序列号的字段进行序列号初始值的设定
  + `FIN`:位为`1`时，表示断开连接，当通信结束希望断开连接时，通信双方之间就可以相互交换`FIN`位为`1`的TCP段

## TCP建立连接



## TCP断开连接



## Socket编程

