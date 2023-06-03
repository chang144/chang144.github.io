# hello  Golang

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

