# xxx - Go标准库

+ `unsafe`
+ `syscall`-`os`-`os/exec`
  + `os`
  + `os/exec`
  + `syscall`
+ `archive/tar`-`/zip-compress`
+ `fmt`-`io`-`bufio`-`path/filepath`-`flag`
  + `fmt`
  + `io`
  + `path/filepath`
  + `flag`
  + `bufio`
+ `strings`-`strconv`-`unicode`-`regexp`-`bytes`
  + `regexp`
  + `strconv`
  + `strings`
  + `unicode`
  + `bytes`
+ `math`-`math/cmath`-`math/big`-`math/rand`-`sort`
  + `math`
  + `math/rand`
  + `math/big`
  + `sort`
+ `container`-`/list-ring-heap`
  + `list-ring-heap`
  + `container`
+ `time`-`log`
  + `log`
  + `time`
+ `encoding/json`-`encoding/xml`-`text/template`
  + `encoding/json`
  + `encoding/xml`
  + `text/template`
+ `net`-`net/http`-`html`
  + `net`
  + `http`
  + `html`
+ `runtime`-`sync`
+ `reflect`



## unsafe

包含一些打破Go语言“类型安全”的命令，一般的程序不需要使用，可用在C/C++程序的调用中

## syscall


底层的外部包，提供了操作系统底层调用的基本接口

## os

提供了一个平台无关性的操作系统功能接口，采用Unix设计


## os/exec


提供我们运行外部操作系统命令和程序的方法

## strings


Go中使用`strings`包来完成对字符串的主要操作
+ `HasPrefix`判断字符串`r`是否以`prefix`开头：
    ```text
  strings.HasPrefix(r,prefix string) bool
    ```
+ `HasSuffix`判断字符串`r`是否以`suffix`结尾：
    ```text
  strings.HasSuffix(r,suffix string) bool
    ```
+ `Contains`判断字符串`r`是否包含`substr`
    ```text
  strings.Contains(r,substr string) bool
    ```
+ `Index`返回字符串`str`在字符串`r`中的索引(`str`的第一个字符的索引)，-1表示字符串`r`不包含字符串`str`：
    ```text
  strings.Index(r, str string) int
    ```
+ `LastIndex`返回字符串`str`在字符串`r`中最后出现位置的索引(`str`的第一个字符的索引)，-1表示字符串`r`不包含字符串`str`：
    ```text
  strings.LastIndex(r, str string) int
    ```
    如果`ch`是非ASCII编码的字符，使用下列的函数进行定位
    ```text
  strings.IndexRune(r string, r rune) int
    ```
+ `Replace`用于将字符串`str`中的前`n`个字符串 `old`替换为字符串 `new`, 并返回一个新的字符串，如果`n=-1`则替换所有`old`为字符串`new`:
    ```text
  strings.Replace(str, old, new, n) string
    ```
+ `Count`用于计算字符串`str`在字符串`r`中出现的非重叠次数：
    ```text
  strings.Count(r, str string) int
    ```
+ `Repeat`用于重复`count`次字符串`r`并返回一个新的字符串：
    ```text
  strings.Repeat(r string, count int) string
    ```
+ `ToLower`将字符串中的Unicode字符全部转换为相应的小写字符：
    ```text
  strings.ToLower(r string) string
    ```
+ `ToUpper`将字符串中的Unicode字符全部转换为相应的大写字符：
    ```text
  strings.ToUpper(r string) string
    ```
+ `TrimSpace`来剔除字符串开头和结尾的空包符号:
    ```text
  strings.TrimSpace(r string) string
    ```
+ `Trim`剔除字符串开头和结尾的指定字符:
    ```text
  strings.Trim(r, str string) string
    ```
+ `TrimLeft`剔除字符串开头的指定字符:
    ```text
  strings.TrimLeft(str string) string
    ```
+ `TrimRight`剔除字符串结尾的指定字符:
    ```text
  strings.TrimRight(str sting) string
    ```
+ `Fields`将会利用1个或者多个空白符号来作为动态长度的分隔符将字符串分割成若干小块，并返回一个Slice，如果字符串只包含空白符号，则返回以一个长度为0的slice：
    ```text
  strings.Fields(r sting) []string
    ```
+ `Split`用于自定义分割符号来对指定字符串进行分割，同样返回slice
    ```text
  strings.Split(r, sep string) []string
    ```
+ `Join`用于将元素类型为string的slice使用分割符号来拼接组成一个字符串：
    ```text
  strings.Join(sl []string, sep string) string
    ```
+ `NewReader`用于生成一个`Reader`并读取字符串中的内容，然后返回指向该`Reader`的指针，从其它类型读取内容的函数还有：
    + `Read()`从[]btye中读取内容
    + `ReadByte()`和`ReadRune()`从字符串中读取下一个byte或者rune

## strconv

## time


`time.Time`

`time.Now()` // `t.Day()` `t.Minute()` `t.Year()`

`time.After`

`time.Ticker`

`time.Sleep(r Duration)`

## bytes

Go语言中bytes包专门用来解决`[]bytes`切片的操作方法，它与`strings`包十分类似

