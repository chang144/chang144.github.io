---
sidebar: 'auto'
sidebarDepth: 3
---
# Golang 面试题

## Go基础类

### 0.Go语言的好处？
+ 对并发做了优化，在规模上运行良好
+ 标准代码格式，比其他语言的代码更具可读性
+ 自动垃圾收集比java、python更有效，可以与程序同时执行

### 1.Golang使用的数据类型？
+ Method
+ Bool
+ String
+ Array
+ Slice
+ Struct
+ Pointer
+ Function
+ Interface
+ Map
+ Channel

### 2.Go程序中的包是什么？
`pkg`是Go工作区中包含Go源文件或其他包的目录

### 3.Go支持什么形式的类型转换？将整数转换为浮点数
Go支持显式类型转换以满足其严格的类型要求

```go
int(double) // double转换为int
```

### 4.Goroutine? 怎么停止

Goroutine 线程比标准线程更轻量级，大多数 Golang 程序同时使用数千个 Goroutine。

创建goroutine，使用`go`在函数声明之前添加关键字

```go
go f(x, y, z)
```

通过一个`quit`信号通道来停止它，使用`chan`

```go
package main

func main()  {
    quit := make(chan bool)
	go func() {
		for  {
			select {
			case <-quit:
                return
			default:
                // ...
            }
		}
    }()
	// ...
	quit <- true
}
```

### 5.如何在运行时检查变量类型

类型开关(Type Switch)是在运行时检查变量类型的最佳方式。类型开关按类型
而不是值来评估变量。每个 Switch 至少包含一个 case 用作条件语句，如果没
有一个 case 为真，则执行 default。

### 6.Go语言中的Channel缓冲有什么特点？
无缓冲的channel是同步的，有缓冲的channel是非同步的

### 7.Go中Channel（通道）有什么特点？
+ 给一个nil的channel发送数据，会造成永久阻塞
+ 从一个nil的channel接收数据，也会造成永久阻塞
+ 给一个已经关闭的channel发送数据，会引起panic
+ 从一个已经关闭的channel接收数据，如何缓冲区中为空，则返回一个零值

### 8.Go中同步锁有什么特点？作用是什么？
当一个goroutine获得Mutex后，其他协程只能等待Mutex释放。

RWMutex在读锁占用的情况下，会阻止写，但不会阻止读

在写锁占用情况下，会阻止其他goroutine进行读或者写操作

> 同步锁的作用是保证资源在使用时的独有性，不会因为并发而导致数据错乱，保证系统的稳定性
