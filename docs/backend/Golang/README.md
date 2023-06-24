# hello  Golang

## Other Guide
+ [01-go命令行操作](./001-go命令行操作.md)
  + [01-01-go命令行程序设计原则](./001-01-go%20cli.md)
+ [02-goProjectLayout](Go%20Project%20Layout.md) 
+ [03-go标准库](xxx-标准库.md)
+ [04-优雅的Go项目](xxx-GraceGoProject.md)
+ [05-IAM 认证](xxx-IAM%20Authz.md)
+ [06-gRPC](./rpc/README.md)

## 程序结构

### 1.1 命名

Go语言中的关键字
```
break      default       func     interface   select
case       defer         go       map         struct
chan       else          goto     package     switch
const      fallthrough   if       range       type
continue   for           import   return      var
```

Go语言中还有大约30多个预定义的名字，对应内建的常量、类型和函数

```
内建常量: true false iota nil

内建类型: int int8 int16 int32 int64
          uint uint8 uint16 uint32 uint64 uintptr
          float32 float64 complex128 complex64
          bool byte rune string error

内建函数: make len cap new append copy close delete
          complex real imag
          panic recover
```

预定义名字可以重新定义使用它们，在一些特殊的场景中重新定义它们是有意义的。

名字（变量）的**作用域**，如何名字定义在函数内部，那么它就只在函数内部有效；如何是在函数外部定义，那么将在当前包的所有文件都可以访问。

名字的**可见性**，由它的首字母的大小写决定，如果一个名字是大写字母开头，那么它将是可导出的；反之

Go语言的风格中进来使用短小的名字，对应局部变量也是这样，例如：`i`；如果一个名字的作用域大，且生命周期长，那么用长的名字会更有意义

习惯上，Go使用**驼峰式**命名，当名字由几个单词组成时优先使用大小写分隔，

### 1.2 声明

Go语言主要有四种类型的声明语句：`var`、 `const`、 `type`、 `func` 分别对应变量，常量，类型，和函数实体对象

Go程序中有多个以`.go`源文件，每个源文件中以包的声明语句开始，说明该源文件是属于哪个包。包声明后是`import`语句导入依赖的其他包，然后是包一级的类型、变量、常量、函数的声明语句

### 1.3变量

`var`声明语句可以创建一个特定类型的变量，然后给变量附加一个名字，并且变量的初始值，声明如下

```
var <valueName> type = 表达式
```

## 复合数据类型

### 4.2Slice

Slice(切片)代表变长的序列，序列中每个元素都有相同的类型。slice的语法和数值很像，只是没有固定长度

一个slice是一个轻量级的数据类型，提供了访问数组子序列元素的功能，而且slice的底层确实是一个**数组对象**。

```go
type Slice struct {
    array unsafa.Pointer
    len int
    cap int
}
```



### 4.3Map

在Go语言中，一个map就是一个哈希表的引用。

使用内置的`make`函数创建一个map

```go
m := make(map[string]int)
```

#### 4.3.1 sync.Map

`sync.Map` 是Go语言标准库中一个并发安全的Map实现，可以在并发情况下安全地读写，而不用加锁

官方文档对使用`sync.Map`的建议：

+ 多个goroutine的并发使用是安全的，不需要额外的锁定或协调扩控制
+ 大多数代码应该使用原生的map，而不是单独的锁定或协调控制，以获得更好的类型安全性和维护性

结构体定义

```go
type Map struct {
    mu 		sync.Mutex
    read 	atomic.Value //readOnly
    dirty 	map[interface{}]interface{}
    misses 	int
    dirtyLocked uintptr
}
```

可以看出`sync.map`的实现依赖于一个互斥锁`sync.Mutex`和两个map——`read`和`dirty`

`read`的定义如下：

```go
type readOnly struct {
    m		map[interface{}]interface{} // map类型
    amended bool // amended表示read中键值对是否被修改
}
```

`dirty`的定义：

```go
type dirty struct {
    m	    map[interface{}]interface{} // 存储被修改过的键值对
    dirty	map[interface{}]bool	    // 存储了那些键值对被修改过
	misses  int
}
```

+ 读取的实现`Load()`：直接在`readOnly`中的m查找，如果`readOnly`中的键值被修改过，则需要从`dirty`中查找
+ 写入的实现`Store()`：分两步实现，首先判断`readOnly`中的键值对是否被修改，如果没有被修改过，则直接将键值对添加到`readOnly`的`m`中，否则，获取互斥锁，将键值对添加到`dirty`中的`m`中，并将对应的键添加到`dirty`中的`dirty`中
+ 删除的实现`Delete()`：分两步实现，首先判断`readOnly`中的键值对是否被修改，如果没有被修改过，直接从`readOnly`中的`m`中删除键值对即可，否则，获取互斥锁，如何将键添加到`dirty`中的`dirty`中，并将`dirty`中的对应件的值设置为false
+ 遍历的实现`range()`：需要将`readOnly`和`dirty`中的所有键值对进行合并，并返回所有未被删除的键值对

`sync.Map`建议使用场景：在读和删较多的场景上表现很好，但是在写入场景上的性能很差

> 推荐阅读：
>
> [并发编程如此轻松：一篇文章深入探究 Go 语言中的 sync.Map！ - 掘金 (juejin.cn)](https://juejin.cn/post/7226604941727596581)
>
> [Go 并发读写 sync.map 的强大之处 - 掘金 (juejin.cn)](https://juejin.cn/post/7011355673069879304)

## 函数

### 5.8Deffered函数

只要在调用的普通函数或方法前加上关键字`defer`，就完成了defer所需的语法

`defer`语句经常被用于处理成对的操作，如打开、关闭、连接、断开连接、加锁、释放锁

#### defer底层原理
1. 每次`defer`语句执行时，会对函数进行**压栈**，函数参数会被拷贝下来，当外层函数退出时，defer的函数按定义的顺序逆序执行。当defer的函数为`nil`时，会产生panic
2. `defer`函数定义时，对外部变量的引用有两种方式： 分别是**函数参数**以及**闭包引用**
   + 作函数参数时，在`defer`定义时，会被缓存起来
   + 作闭包引用时，则在`defer`真正调用时，根据上下文确定当前的值
3. `defer`后面的语句在执行的时候，函数调用的参数会被保存起来，即（复制一份

### 5.9Panic异常

Go的类型系统会在编译时捕获很多错误，但有些错误只能在运行时检查，如数组访问越界、空指针引用等。这些运行时错误会引起painc异常。

当panic异常发生时，程序会中断运行，并立即执行在该goroutine中被延迟的函数（defer机制）

由于panic会引起程序的崩溃，因此panic一般用于严重错误

### 5.10Recover捕获异常

在defer函数中调用了内置函数**recover**，并且定义该defer语句的函数发生了panic异常，recover会使程序从panic中恢复，并返回panic value

```go
func Parse(input string) (r *Syntax, err error) {
    defer func() {
        if p := recover(); p != nil {
            err = fmt.Errorf("internal error: %v", p)
        }
    }()
    // ...parser...
}
```

## Goroutine和Channels

###  8.4Channels

使用内置的`make`函数，可以创建一个channel：

```go
ch := make(chan int)
```

与`map`类似，channel对应一个make创建的底层数据结构的引用

channel的两个操作：发送和接收

```go
ch <- x
x = <- ch
<-ch
```

channel还支持`close`操作，用于关闭channel，后续对该channel进行任何发送操作`close(ch)`

创建带缓存的channel

```go
ch = make(chan int) // unbuffered channel
ch = make(chan int, 0) // unbuffered channel
ch = make(chan int, 10) // buffered channel with capacity 10
```

#### 8.4.1 不带缓存的channels

 一个基于**无缓存**的Channel的发送操作会导致发生在goroutine阻塞，直到另一个goroutine在同一个Channels上执行接收操作。反之。

无缓存的Channels的发送和接收操作将导致两个goroutine进行一次同步操作。因此，无缓存Channels也称为同步Channels。

> 这里插播一个在go语言中**空结构体**的妙用：
>
> 空结构体，匿名空结构体：
>
> ````
> var e struct{}
> ````
>
> 或者命名空结构体：
>
> ```go
> type EmptyStruct struct {}
> var e EmptyStruct
> ```
>
> 它有一下特点：
>
> + 零内存占用：空结构体不占用任何内存空间
> + 地址相同：空结构体所指向的地址都相同
> + 无状态：不包含任何字段，所以它没有状态
>
> 使用场景：
>
> + 实现`set`集合类型
> + 同于通道信号
> + 作为方法接收器

#### 8.4.2串联的Channels（Pipeline）

Channels也可以用于将多个goroutine连接在一起，一个Channel的输出作为下一个Channel的输入

这种串联的Channels就是所谓的管道（pipeline）

#### 8.4.3单方向的Channel

Go语言的类型系统提供了单方向的channel类型

+ `chan <- int`表示一个**只发送**`int`的channel
+ `<- chan int`表示一个**只接收**`int`的channel

channels的关闭操作只用于断言不再向channel发送新的数据，所以在发送者所在的goroutine才能调用`close`函数关闭channel，负责接收者的channel调用`close`将回收一个编译错误

#### 8.4.4 带缓存的Channels

带缓存的channel内部持有一个元素队列。队列的最大容量有`make`函数的第二个参数决定

```go
ch = make(chan int, 10)
```

向缓存Channel的发送操作就是向内部缓存队列的尾部插入元素，接收操作则是从队列的头部删除元素

如果内部缓存队列是满的，新的发送操作将阻塞直到有另一个goroutine执行接收操作而释放了新的队列空间

当缓存队列既不是空也不是满的状态时，对该channel执行的发送或者接收操作都不会发送阻塞。通过这个方法，channel的缓存队列解耦了接收和发送的goroutine

通过`cap`函数，可以获取到channel内部缓存的容量；通过`len`函数，可获取到channel内部缓存的有效元素个数

### 8.5并发的循环

这里直接贴上并发的循环示例代码，有兴趣的同学自行前往[并发的循环 · Go语言圣经 (studygolang.com)](https://books.studygolang.com/gopl-zh/ch8/ch8-05.html)阅读

```go
// makeThumbnails6 makes thumbnails for each file received from the channel.
// It returns the number of bytes occupied by the files it creates.
func makeThumbnails6(filenames <-chan string) int64 {
    sizes := make(chan int64)
    var wg sync.WaitGroup // number of working goroutines
    for f := range filenames {
        wg.Add(1)
        // worker
        go func(f string) {
            defer wg.Done()
            thumb, err := thumbnail.ImageFile(f)
            if err != nil {
                log.Println(err)
                return
            }
            info, _ := os.Stat(thumb) // OK to ignore error
            sizes <- info.Size()
        }(f)
    }

    // closer
    go func() {
        wg.Wait()
        close(sizes)
    }()

    var total int64
    for size := range sizes {
        total += size
    }
    return total
}
```

### 8.7基于select的多路复用

使用多路复用的`select`语句，能够解决在一个goroutine中接收多个channel中的信息，且不会因为第一个channel中没有事件发送导致的阻塞

```go
select {
case <- ch1:
	// ...
case <- ch2:
	// ...
default:
	/// ...
}
```

+ `select`语句与`switch`语句类似
+ 每个case表示一个通信操作
+ 当多个case同时满足时，select会随机选择一个执行

> channel的**nil**作用：对于一个nil的channel发送和接收操作会被永远阻塞，在`select`语句中操作nil的channel永远不会被select到
>
> 这样，我们可以使用nil来激活或者禁用一个**case**

### 8.9并发的退出

采用广播机制：用关闭一个channel来进行广播

```go
var done = make(chan struct{})

func cancelled() bool {
	select {
	case <- done:
		return true
	default:
		return false
	}
}

func closeChannel() {
    go func() {
        os.Stdin.Read(make([]byte, 1))
        close(done)
    }
}
```

## 基于共享变量的并发

### 9.1竞争条件

**竞争条件**指的是程序在多个goroutine交叉执行操作时，没有给出正确的结果

一个常见的竞争条件案例是银行账户程序

### 9.2 sync.Mutex 互斥锁

go语言直接提供`sync.Mutex`类型支持互斥锁，

+ `Lock()`：获得token（锁）
+ `Unlock()`：释放token

```go
import "sync"

var (
	mu sync.Mutex
	balance int
)

func Deposit(amount int) {
    mu.Lock()
    defer mu.Unlock()
    balance = balance + amount
}

func Balance() int {
    mu.Lock()
    b := balance
    mu.Unlock()
    return b
}
```

> Go的mutex不能**重入**

### 9.3 sync.RWMutex读写锁

一种特殊类型的锁，其允许多个只读操作并行执行，但写操作会完全互斥。这种锁叫作“多读单写”锁（multiple readers, single writer lock）

Go语言提供的这样的锁是sync.RWMutex：

+ `RLock()`和`RUnlock()`获取和释放一个读取或者共享锁
+ `Lock()`和`Unlock()`获取或释放一个写或者互斥锁

`RLock`只能在临界区共享变量没有任何写入操作时可用

### 9.4内存同步

### 9.5 sync.Once惰性初始化

Go语言中提供了`sync.Once`为我们提供了一个专门的方案来解决这种一次性初始化的问题

概念上：一次性的初始化需要一个互斥量mutex和一个Boolean变量来记录初始是不是完成

+ `Do`这个唯一的方法需要接收初始化函数作为其参数

```go
var once sync.Once

func loading(){
    // do something
}

func A() {
    once.Do(loading)
}
```

每一次对Do(loadIcons)的调用都会锁定mutex，并会检查boolean变量（译注：Go1.9中会先判断boolean变量是否为1(true)，只有不为1才锁定mutex，不再需要每次都锁定mutex）。

用这种方式来使用sync.Once的话，我们能够避免在变量被构建完成之前和其它goroutine共享该变量。

### 9.7Goroutines和线程

[Goroutines和线程 · Go语言圣经 (studygolang.com)](https://books.studygolang.com/gopl-zh/ch9/ch9-08.html)
