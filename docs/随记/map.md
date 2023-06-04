# map

哈希表是一个无序的**key/value**对的集合，其中所有的key的值是不同的，通过key可以在常数时间复杂度内检索、更新和删除对应的value

在Go语言中，一个map是一个哈希表的引用

写成：`map[key]value`

map相关的操作：
+ 增加一个k-v对
+ 删除一个k-v对
+ 修改一个k对应的v
+ 查询一个k对应的v

## map的结构体

```go
package gomap

import "unsafe"

type hmap struct {
	count     int  //元素个数
	flags     uint8
	B         uint8//扩容常量
	noverflow uint16//溢出 bucket 个数
	hash0     uint32//hash 种子
	buckets   unsafe.Pointer//bucket 数组指针
	oldbuckets unsafe.Pointer//扩容时旧的buckets 数组指针
	nevacuate uintptr//扩容搬迁进度
	extra *mapextra//记录溢出相关
}

type mapextra struct {
	tophash [bucketCnt]uint8
	// Followed by bucketCnt keys 
	//and then bucketan Cnt values  
	// Followed by overflow pointer.
}
```

## sync.Map 解析
