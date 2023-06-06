import{_ as n,o as s,c as a,e}from"./app-d23692c0.js";const t={},i=e(`<h1 id="map" tabindex="-1"><a class="header-anchor" href="#map" aria-hidden="true">#</a> map</h1><p>哈希表是一个无序的<strong>key/value</strong>对的集合，其中所有的key的值是不同的，通过key可以在常数时间复杂度内检索、更新和删除对应的value</p><p>在Go语言中，一个map是一个哈希表的引用</p><p>写成：<code>map[key]value</code></p><p>map相关的操作：</p><ul><li>增加一个k-v对</li><li>删除一个k-v对</li><li>修改一个k对应的v</li><li>查询一个k对应的v</li></ul><h2 id="map的结构体" tabindex="-1"><a class="header-anchor" href="#map的结构体" aria-hidden="true">#</a> map的结构体</h2><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">package</span> gomap

<span class="token keyword">import</span> <span class="token string">&quot;unsafe&quot;</span>

<span class="token keyword">type</span> hmap <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	count     <span class="token builtin">int</span>  <span class="token comment">//元素个数</span>
	flags     <span class="token builtin">uint8</span>
	B         <span class="token builtin">uint8</span><span class="token comment">//扩容常量</span>
	noverflow <span class="token builtin">uint16</span><span class="token comment">//溢出 bucket 个数</span>
	hash0     <span class="token builtin">uint32</span><span class="token comment">//hash 种子</span>
	buckets   unsafe<span class="token punctuation">.</span>Pointer<span class="token comment">//bucket 数组指针</span>
	oldbuckets unsafe<span class="token punctuation">.</span>Pointer<span class="token comment">//扩容时旧的buckets 数组指针</span>
	nevacuate <span class="token builtin">uintptr</span><span class="token comment">//扩容搬迁进度</span>
	extra <span class="token operator">*</span>mapextra<span class="token comment">//记录溢出相关</span>
<span class="token punctuation">}</span>

<span class="token keyword">type</span> mapextra <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	tophash <span class="token punctuation">[</span>bucketCnt<span class="token punctuation">]</span><span class="token builtin">uint8</span>
	<span class="token comment">// Followed by bucketCnt keys </span>
	<span class="token comment">//and then bucketan Cnt values  </span>
	<span class="token comment">// Followed by overflow pointer.</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="sync-map-解析" tabindex="-1"><a class="header-anchor" href="#sync-map-解析" aria-hidden="true">#</a> sync.Map 解析</h2>`,9),l=[i];function c(p,o){return s(),a("div",null,l)}const u=n(t,[["render",c],["__file","map.html.vue"]]);export{u as default};
