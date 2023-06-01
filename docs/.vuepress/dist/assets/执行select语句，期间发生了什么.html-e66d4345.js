import{_ as e,o as a,c as i,e as l}from"./app-8273266b.js";const r={},h=l('<h1 id="mysql执行select-期间发生了什么" tabindex="-1"><a class="header-anchor" href="#mysql执行select-期间发生了什么" aria-hidden="true">#</a> MySQL执行select，期间发生了什么</h1><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/mysql/sql执行过程/mysql查询流程.png" alt="MySQl执行流程"></p><h2 id="第一步-连接器" tabindex="-1"><a class="header-anchor" href="#第一步-连接器" aria-hidden="true">#</a> 第一步：连接器</h2><ul><li>与客户端进行TCP三次握手建立连接</li><li>校验客户端的用户名和密码</li><li>成功登录，读取用户的权限，后面的权限逻辑判断都是基于本次读取的权限</li></ul><h2 id="第二步-查询缓存" tabindex="-1"><a class="header-anchor" href="#第二步-查询缓存" aria-hidden="true">#</a> 第二步：查询缓存</h2><p>当连接器成功与client连接上后</p><p>MySQL服务器在收到SQL语句，如果是<strong>select</strong>语句 首先会查询缓存（Query Cache）查找缓存数据，<strong>查询缓存是以key-value形式保存在内存中</strong>，如果SQL语句命中缓存，则直接返回value给客户端， 如果没有缓存命中，则继续往下执行，等待执行完毕，将查询结果存到缓存中。</p><p>注意：<strong>查询缓存</strong>会因为表的更新操作使得这个表的查询缓存被清空。</p><blockquote><p>MySQL 8.0版本直接将查询缓存删除，移除的是server层的查询缓存，并不是innodb存储引擎中的buffer pool</p></blockquote><h2 id="第三步-解析sql" tabindex="-1"><a class="header-anchor" href="#第三步-解析sql" aria-hidden="true">#</a> 第三步：解析SQL</h2><p>正式执行SQL查询语句前，需要<strong>解析器</strong>对SQL语句进行解析</p><h3 id="解析器" tabindex="-1"><a class="header-anchor" href="#解析器" aria-hidden="true">#</a> 解析器</h3><ul><li>词法分析：根据关键字构建出SQL语法树</li><li>语法分析：将词法分析的结果，按照语法规则进行解析，判断SQL语句是否满足MySQL语法</li></ul><blockquote><p>解析器只负责构建语法树和检查语法，但不会去查表或者字段存不存在</p></blockquote><h2 id="第四步-执行sql" tabindex="-1"><a class="header-anchor" href="#第四步-执行sql" aria-hidden="true">#</a> 第四步：执行SQL</h2><p>经过解析器后，接着进去执行SQL语句的流程</p><ul><li>prepare阶段：预处理阶段</li><li>optimize阶段：优化阶段</li><li>execute阶段：执行阶段</li></ul><h3 id="预处理器" tabindex="-1"><a class="header-anchor" href="#预处理器" aria-hidden="true">#</a> 预处理器</h3><ul><li>检查SQL查询语句中的表或者字段是否存在</li><li>将<code>select *</code>中的<code>*</code>符号扩展为表上的所有列表</li></ul><h3 id="优化器" tabindex="-1"><a class="header-anchor" href="#优化器" aria-hidden="true">#</a> 优化器</h3><p>优化器负责将SQL语句的执行方案确定下来</p><h3 id="执行器" tabindex="-1"><a class="header-anchor" href="#执行器" aria-hidden="true">#</a> 执行器</h3><p>到了执行器，MySQL才真正开始执行语句，在执行过程，执行器和存储引擎交互，交互以<strong>记录</strong>为单位</p><p>执行器与存储引擎交互过程：</p><ul><li>主键索引查询</li><li>全表查询</li><li>索引下推</li></ul><h4 id="主键索引查询" tabindex="-1"><a class="header-anchor" href="#主键索引查询" aria-hidden="true">#</a> 主键索引查询</h4>',26),t=[h];function d(s,n){return a(),i("div",null,t)}const o=e(r,[["render",d],["__file","执行select语句，期间发生了什么.html.vue"]]);export{o as default};
