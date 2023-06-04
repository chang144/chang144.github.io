# xxx - gRPC

## 简介
gRPC是一个高性能、开源、通用的RPC框架，由Google推出，基于HTTP2协议标准设计开发，默认采用**Protocol Buffers**数据序列化协议，支持多种开发语言

gRPC提供了一种简单的方法来精确的定义服务，并为客户端和服务端自动生成可靠的**功能库**

### 主要特性：
+ IDL：gRPC使用ProtoBuf来定义服务
+ 多语言支持：gRPC支持多语言，并能够基于语言自动生成客户端和服务端功能库
+ HTTP2：gRPC基于HTTP2标准设计，由更强大功能，例如：双向流，头部压缩，多复用请求

## Protobuf --> Go

### 了解ProtoBuf

> 在proto文件中，默认使用proto2，如果要使用proto3，需要在文件前添加 `syntax = "proto3";`

下面的例子以proto3为例

`package`: 声明包名，默认转换为Go中的包名一致

`go_package`：指定不一样的包名
```protobuf
package test;
option go_package="test";
```

`message`：对应go中的`struct`，全部使用驼峰命名规则。嵌套定义的`message`, `enum`转换为go之后，名称变为`Parent_Child`结构

```protobuf
syntax = "proto3";
package test;
option go_package="test";
message Test {
  string name = 1;
  string age = 2;
}
```

使用命令行
```cmd
protoc --proto_path=./proto/ --go_out=./proto/*.proto
```
+ `proto_path` 用来表示编译的proto文件所依赖的其它proto文件的查找位置
+ `go_out` 两次含义，一层输出go对应的文件，一层指定生成的go文件

到这里，可以使用以上命令生成go文件了，注意两个参数的使用

### Protobuf语法解析

> 以**proto3**为例

+ `Message`

类型定义描述了一个请求或响应的消息格式，可以包含多种类型字段
```protobuf
syntax = "proto3";
message SearchRequest {
    string query = 1;
    int32  page_number = 2;
    int32  result_per_page = 3;
}
```
一个`.proto`文件可以定义多个`message`，一般用于同时定义多个相关的message，例如可以在声明的proto文件里面添加另一个响应message
`message SearchResponse {...}`

message里面的`Tags`，这是每个字段都有一个**唯一的数值标签**，其中[1-15]内标识在编码时占用一个字节，包含标识和字段类型。
[16-2047]之间的标识符占用2个字节。频繁出现的消息元素建议分配在[1-15],可以预留标识

最小的标识符从1开始，最大到2^19-1。不可以使用[19000 - 19999]之间的标识符，Protobuf协议实现中预留了这些标识符。

**字段规则**
+ 单数形式：一个message内同名单数形态的字段不能超过一个
+ repeated：前置`repeated`关键词，声明该字段为数值类型
+ `proto3`不支持`proto2`中的`required`和`optional`关键字

**添加注释**：使用双斜线`//` 

**保留字段**：使用字段`reserved`关键字指定保留字段名和标签
```protobuf
syntax = "proto3";
message Foo {
  reserved 2, 15, 9 to 11;
  reserved "foo", "bar";
}
```
> 注意：不能在一个`reserved`声明中混合字段名和标签

`.proto`文件的编译结果
+ Go: 生成一个.pb.go文件，每个消息类型对应一个结构体

各种语言的更多的使用方法请参考官方API文档

基本数据类型对比：

## 基本数据类型

| .proto   | Go      |
| :------- | :------ |
| double   | float64 |
| float    | float32 |
| int32    | int32   |
| int64    | int64   |
| uint32   | uint32  |
| uint64   | uint64  |
| sint32   | int32   |
| sint64   | int64   |
| fixed32  | uint32  |
| fixed64  | uint64  |
| sfixed32 | int32   |
| sfixed64 | int64   |
| bool     | bool    |
| string   | string  |
| bytes    | []byte  |

+ `enum`

当定义一个message时，想要一个字段只能说一个预定好的值列表内的某个值，就需要使用enum类型
```protobuf
syntax = "proto3";
message SearchRequest {
  string query = 1;
  int32 page_number = 2;
  int32 result_per_page = 3;
  // 定义enum类型
  enum Corpus {
    UNIVERSAL = 0;
    WEB = 1;
    IMAGES = 2;
    LOCAL = 3;
    NEWS = 4;
    PRODUCTS = 5;
    VIDEO = 6;
  }
  Corpus corpus = 4; // 使用Corpus作为字段类型
}
```
每个enum类型值第一个元素必须是0

> 使用`allow_alias`选项的值为`true`，可以同个给不同的enum元素赋相同的值来定义别名

```protobuf
syntax = "proto3";
// 正确示例
enum EnumAllowingAlias {
  option allow_alias = true; // 开启allow_alias选项
  UNKNOWN = 0;
  STARTED = 1;
  RUNNING = 1;  // RUNNING和STARTED互为别名
}
```

使用其它Message作为字段
```protobuf
syntax = "proto3";
message SearchResponse {
    repeated Result results = 1;
}
message Result {
    string url = 1;
    string title = 2;
    repeated string snippets = 3;
}
```

+ `import`

导入其它`.proto`文件中的`message`

```protobuf
import "others.proto";
```
> 可以在`import`后面添加一个`public`关键字，转发所有对新文件的引用

使用了多proto文件的引用，在编译时可以添加上`-I / --proto_path`参数指定查找目录，如果没有指定该参数，默认在当前目录中查找

+ `message`嵌套

在一个message内部中定义另一个message类型，作为子message
```protobuf
syntax = "proto3";
message SearchResponse {
  message Result {
    string url = 1;
    string title = 2;
    repeated string snippets = 3;
  }
  repeated Result results = 1;
}
```
这里的`Result`作为`SearchResponse`的子message，通过编译后，生成的结构体(struct)名为`SearchResponse_Result`

内部声明的message类型只可以在内部直接使用，在外部使用需要前置父级message名称，例如`Parent.Type`

+ `Map`类型

proto3支持map类型声明
```protobuf
syntax = "proto3";
//map<key_type, value_type> map_field = N;
message Project {
  string name = 1; 
}

map<string, Project> projects = 1;
```
> + key_type类型可以是内置的标量类型(除浮点类型和bytes)
> + value_type可以是除map以外的任意类型
> + map字段不支持repeated属性
> + 不要依赖map类型的字段顺序

+ `package`
在`.proto`文件中使用`package`声明包名，避免命名冲突
```protobuf
syntax = "proto3";
package foo.bar;
message Open {...}
```
在其它的消息格式定义中可以使用**包名+消息名**的方式来使用类型
```protobuf
syntax = "proto3";
import "foo.bar.proto"
message Foo {
    foo.bar.Open open = 1;
}
```
> Go 中：默认使用package名作为包名，除非指定了option go_package选项

+ `Service`

如果在消息类型用在RPC（远程方法调用）系统中，可以在`.proto`文件中定义一个RPC服务接口，protocol编译器会根据所选择的不同语言生成服务接口代码

例如：定义一个RPC服务并实现一个方法，该方法接收`SearchRequest`并返回一个`SearchResponse`,此时可以在`.proto`文件中进行如下定义
```protobuf
syntax = "proto3";
service SearchService {
  rpc Search (SearchRequest) returns (SearchResponse) {}
}
```
生成的接口代码作为客户端与服务端的约定，**服务端必须实现定义的所有接口方法**，**客户端直接调用同名方法向服务端发起请求**

+ `options`
在定义`.proto`文件时可以标注一系列的options。Options并不改变整个文件声明的含义，但是可以影响特定环境下处理方式

> 完整的可用选项可以查看google/protobuf/descriptor.proto.

#### 基本规范
+ 描述文件以`.proto`作为文件后缀
+ Message命名采用驼峰命名的方式，字段命名采用小写加`_`分隔方式
```protobuf
syntax = "proto3";
message SongServerRequest {
  required string song_name = 1;
}
```
+ Enums类型名采用驼峰命名方式，字段命名采用大写字母加`_`分隔方式
```protobuf
syntax = "proto3";
enum Foo {
  FIRST_VALUE = 1;
  SECOND_VALUE = 2;
}
```
+ Service名称与RPC方法名统一采用驼峰式命名

#### 编译

参考Github项目google/protobuf安装编译器

```cmd
protoc --proto_path=IMPORT_PATH --cpp_out=DST_DIR --java_out=DST_DIR --python_out=DST_DIR --go_out=DST_DIR --ruby_out=DST_DIR --javanano_out=DST_DIR --objc_out=DST_DIR --csharp_out=DST_DIR path/to/file.proto
```
> 有关编译细节，将在后续补充详细 to be continued