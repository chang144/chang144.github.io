# MySQL执行select，期间发生了什么

![MySQl执行流程](https://cdn.xiaolincoding.com/gh/xiaolincoder/mysql/sql%E6%89%A7%E8%A1%8C%E8%BF%87%E7%A8%8B/mysql%E6%9F%A5%E8%AF%A2%E6%B5%81%E7%A8%8B.png)

## 第一步：连接器

+ 与客户端进行TCP三次握手建立连接
+ 校验客户端的用户名和密码
+ 成功登录，读取用户的权限，后面的权限逻辑判断都是基于本次读取的权限

## 第二步：查询缓存

当连接器成功与client连接上后

MySQL服务器在收到SQL语句，如果是**select**语句
首先会查询缓存（Query Cache）查找缓存数据，**查询缓存是以key-value形式保存在内存中**，如果SQL语句命中缓存，则直接返回value给客户端，
如果没有缓存命中，则继续往下执行，等待执行完毕，将查询结果存到缓存中。

注意：**查询缓存**会因为表的更新操作使得这个表的查询缓存被清空。

> MySQL 8.0版本直接将查询缓存删除，移除的是server层的查询缓存，并不是innodb存储引擎中的buffer pool

## 第三步：解析SQL

正式执行SQL查询语句前，需要**解析器**对SQL语句进行解析

### 解析器

+ 词法分析：根据关键字构建出SQL语法树
+ 语法分析：将词法分析的结果，按照语法规则进行解析，判断SQL语句是否满足MySQL语法

> 解析器只负责构建语法树和检查语法，但不会去查表或者字段存不存在

## 第四步：执行SQL

经过解析器后，接着进去执行SQL语句的流程

+ prepare阶段：预处理阶段
+ optimize阶段：优化阶段
+ execute阶段：执行阶段

### 预处理器

+ 检查SQL查询语句中的表或者字段是否存在
+ 将`select *`中的`*`符号扩展为表上的所有列表

### 优化器

优化器负责将SQL语句的执行方案确定下来

### 执行器

到了执行器，MySQL才真正开始执行语句，在执行过程，执行器和存储引擎交互，交互以**记录**为单位

执行器与存储引擎交互过程：
+ 主键索引查询
+ 全表查询
+ 索引下推

#### 主键索引查询

