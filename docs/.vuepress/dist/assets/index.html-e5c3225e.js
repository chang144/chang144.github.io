import{_ as e,o as n,c as a,e as i}from"./app-2b4e389e.js";const d={},r=i(`<h1 id="hello-golang" tabindex="-1"><a class="header-anchor" href="#hello-golang" aria-hidden="true">#</a> hello Golang</h1><h2 id="程序结构" tabindex="-1"><a class="header-anchor" href="#程序结构" aria-hidden="true">#</a> 程序结构</h2><h3 id="_1-1-命名" tabindex="-1"><a class="header-anchor" href="#_1-1-命名" aria-hidden="true">#</a> 1.1 命名</h3><p>Go语言中的关键字</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>break      default       func     interface   select
case       defer         go       map         struct
chan       else          goto     package     switch
const      fallthrough   if       range       type
continue   for           import   return      var
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Go语言中还有大约30多个预定义的名字，对应内建的常量、类型和函数</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>内建常量: true false iota nil

内建类型: int int8 int16 int32 int64
          uint uint8 uint16 uint32 uint64 uintptr
          float32 float64 complex128 complex64
          bool byte rune string error

内建函数: make len cap new append copy close delete
          complex real imag
          panic recover
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>预定义名字可以重新定义使用它们，在一些特殊的场景中重新定义它们是有意义的。</p><p>名字（变量）的<strong>作用域</strong>，如何名字定义在函数内部，那么它就只在函数内部有效；如何是在函数外部定义，那么将在当前包的所有文件都可以访问。</p><p>名字的<strong>可见性</strong>，由它的首字母的大小写决定，如果一个名字是大写字母开头，那么它将是可导出的；反之</p><p>Go语言的风格中进来使用短小的名字，对应局部变量也是这样，例如：<code>i</code>；如果一个名字的作用域大，且生命周期长，那么用长的名字会更有意义</p><p>习惯上，Go使用<strong>驼峰式</strong>命名，当名字由几个单词组成时优先使用大小写分隔，</p><h3 id="_1-2-声明" tabindex="-1"><a class="header-anchor" href="#_1-2-声明" aria-hidden="true">#</a> 1.2 声明</h3><p>Go语言主要有四种类型的声明语句：<code>var</code>、 <code>const</code>、 <code>type</code>、 <code>func</code> 分别对应变量，常量，类型，和函数实体对象</p><p>Go程序中有多个以<code>.go</code>源文件，每个源文件中以包的声明语句开始，说明该源文件是属于哪个包。包声明后是<code>import</code>语句导入依赖的其他包，然后是包一级的类型、变量、常量、函数的声明语句</p><h3 id="_1-3变量" tabindex="-1"><a class="header-anchor" href="#_1-3变量" aria-hidden="true">#</a> 1.3变量</h3><p><code>var</code>声明语句可以创建一个特定类型的变量，然后给变量附加一个名字，并且变量的初始值，声明如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>var &lt;valueName&gt; type = 表达式
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,18),t=[r];function s(l,c){return n(),a("div",null,t)}const u=e(d,[["render",s],["__file","index.html.vue"]]);export{u as default};
