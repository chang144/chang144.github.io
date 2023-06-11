import{_ as o,o as c,c as e,e as p}from"./app-c89e49fa.js";const t={},d=p('<h1 id="_2-2-键入网址到网页显示-期间发生了什么" tabindex="-1"><a class="header-anchor" href="#_2-2-键入网址到网页显示-期间发生了什么" aria-hidden="true">#</a> 2.2 - 键入网址到网页显示，期间发生了什么</h1><hr><blockquote><p>面试题：【当键入网址后，到网页显示，期间发生了什么？</p></blockquote><p>下面一张较简单的网络拓扑模型作为例子，探究探究其间发生了什么？</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/2.jpg" alt="简单的网络模型"></p><h2 id="http" tabindex="-1"><a class="header-anchor" href="#http" aria-hidden="true">#</a> HTTP</h2><hr><blockquote><p>浏览器做的第一步工作是<strong>解析URL</strong></p></blockquote><p>首先浏览器做的第一步工作就是要对<code>URL</code>进行解析，从而生成发生给<code>Web</code>服务器的请求信息</p><p>在一条长长的URL里的各个元素的代表是什么</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/3.jpg" alt="URL 解析"></p><p>这里的URL实际上是请求服务器里的文件资源</p><blockquote><p>当上图的蓝色部分URL元素都省略了，那么请求的是哪个文件呢？</p></blockquote><p>当没有路径名时，就代表访问根目录下事先设置的<strong>默认文件</strong>，也就是<code>/index.html</code>或者<code>/default.html</code>这些文件，这样就不好发生混乱</p><blockquote><p>生产HTTP请求信息</p></blockquote><p>对<code>URL</code>进行解析之后，浏览器确定了Web服务器和文件名，接下来就是根据这些信息来生产HTTP请求信息</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/4.jpg" alt="HTTP 的消息格式"></p><h2 id="真实地址查询——dns" tabindex="-1"><a class="header-anchor" href="#真实地址查询——dns" aria-hidden="true">#</a> 真实地址查询——DNS</h2><hr><p>通过浏览器解析URL并生成HTTP消息后，需要委托操作系统将消息发送给<code>Web</code>服务器</p><p>但是在发送之前，还需要<strong>查询服务器域名对应的IP地址</strong>，因为委托操作系统发送消息时，必须提供通信对象的IP地址</p><p>这里，有一种服务器就专门保存了<code>Web</code>服务器域名与<code>IP</code>的对应关系——DNS服务器</p><blockquote><p>域名的层级关系</p></blockquote><p>DNS中的域名都是用<strong>句点</strong>来分隔的，比如<code>www.server.com</code>，这里的句点带不了不同层次之间的界限</p><p>在域名中，<strong>越靠右</strong>的位置表示其<strong>层级越高</strong></p><p>实际上<strong>域名</strong>最后还有一个点，比如<code>www.server.com.</code>，这个最后一个点代表根域名</p><p>也就是说，<code>.</code>根域是最顶层，它的下一层是<code>.com</code>顶级域,再下面是<code>server.com</code></p><p>所以，域名的层级关系类似一个树状结构</p><ul><li>根DNS服务器<code>.</code></li><li>顶级域DNS服务器<code>.com</code></li><li>权威DNS服务器<code>server.com</code></li></ul><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/5.jpg" alt="DNS 树状结构"></p><p>根域的DNS服务器信息保存在互联网中所有的DNS服务器中，这样一来任何DNS服务器都可以找到并访问根域DNS服务器</p><p>因此，客户端只要能够找到任意一台 DNS 服务器，就可以通过它找到根域 DNS 服务器，然后再一路顺藤摸瓜找到位于下层的某台目标 DNS 服务器。</p><blockquote><p>域名解析的工作流程</p></blockquote><ol><li><strong>客户端</strong>首先会发出一个DNS请求，问www.server.com的IP是啥，并发给本地DNS服务器（也就是客户端的TCP/IP设置中填写的DNS服务器地址）</li><li>本地域名服务器收到客户端的请求后，如果<strong>缓存里的表格</strong>能找到www.server.com，则直接返回IP地址，如果没有，本地DNS会去问它的根域名服务器， 根域名服务器是最高层次的，它不直接用于域名解析，但能指明一条道路。</li><li>根DNS收到本地DNS的请求后，根据www.server.com的后置是<code>.com</code>，这个域名归于<code>.com</code>区域管理，返回<code>.com</code>顶级域名服务器地址给本地</li><li>本地DNS收到顶级域名服务器地址后，向顶级域名服务器请求负责www.server.com的权威DNS服务器的地址，</li><li>本地DNS最后向权威DNS服务器请求www.server.com的IP地址，该server.com的权威服务器就是域名解析结果的出处。</li><li>权威DNS服务器查询结后将对应的IP地址X.X.X.X返回到本地DNS</li><li>本地DNS再将IP地址返回客户端，客户端和目标建立连接</li></ol><p>至此，DNS的解析过程完成了，其过程可见下图</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/6.jpg" alt="域名解析的工作流程"></p><blockquote><p>域名解析并不是每次都需要经过这么多步骤</p></blockquote><p>还有<strong>缓存</strong>的存在。</p><p>浏览器会先看自身有没有对这个域名的缓存，如果有，就直接返回，如果没有，就去问操作系统，操作系统也会去看自己的缓存，如果有，就直接返回，如果没有，再去 hosts 文件看，也没有，才会去问「本地 DNS 服务器」。</p><h2 id="协议栈" tabindex="-1"><a class="header-anchor" href="#协议栈" aria-hidden="true">#</a> 协议栈</h2><hr><p>通过DNS获取IP后，就可以把HTTP的传输工具交给操作系统中的<strong>协议栈</strong></p><p>协议栈的内部分为几个部分，分别承担不同的工作。上下关系是有一定的规则的，上面的部分会向下面的部分委托工作，下面的部分收到委托的工作并执行。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/7.jpg" alt="img"></p><p>应用程序（浏览器）通过调用 Socket 库，来委托协议栈工作。协议栈的上半部分有两块，分别是负责收发数据的 TCP 和 UDP 协议，这两个传输协议会接受应用层的委托执行收发数据的操作。</p><p>协议栈的下面一半是用 IP 协议控制网络包收发操作，在互联网上传数据时，数据会被切分成一块块的网络包，而将网络包发送给对方的操作就是由 IP 负责的。</p><p>此外 IP 中还包括 <code>ICMP</code> 协议和 <code>ARP</code> 协议。</p><ul><li><code>ICMP</code> 用于告知网络包传送过程中产生的错误以及各种控制信息。</li><li><code>ARP</code> 用于根据 IP 地址查询相应的以太网 MAC 地址。</li></ul><p>IP 下面的网卡驱动程序负责控制网卡硬件，而最下面的网卡则负责完成实际的收发操作，也就是对网线中的信号执行发送和接收操作。</p><h2 id="可靠传输——tcp" tabindex="-1"><a class="header-anchor" href="#可靠传输——tcp" aria-hidden="true">#</a> 可靠传输——TCP</h2><hr><p>HTTP是基于TCP协议传输的，</p><blockquote><p>TCP包头格式</p></blockquote><p>TCP 报文头部的格式：</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/8.jpg" alt="TCP 包头格式"></p><p>首先，<strong>源端口号</strong>和<strong>目标端口号</strong>是必不可少的，如果没有这两个端口号，数据不知道发送给哪些应用</p><p>接下来有<strong>包的序号</strong>，这个是为了解决包乱序的问题</p><p>还有<strong>确认号</strong>，目的是确认发出去对方是否有收到。如果没有收到就重新发送直到送达，这是是为了解决丢包问题</p><p>还有一些<strong>状态位</strong>。例如 <code>SYN</code> 是发起一个连接，<code>ACK</code> 是回复，<code>RST</code> 是重新连接，<code>FIN</code> 是结束连接等。TCP 是面向连接的，因而双方要维护连接的状态，这些带状态位的包的发送，会引起双方的状态变更。</p><p>还有一个重要的就是<strong>窗口大小</strong>。TCP要做<strong>流量控制</strong>，通信双方各声明一个窗口（缓存大小），标识自己当前能够提供的处理能力，以控制流量发送的快慢</p><p>除了流量控制以外，TCP还做了<strong>拥塞控制</strong>，能够控制数据发送的速度</p><blockquote><p>TCP传输数据之前，要先<strong>三次握手</strong>建立连接</p></blockquote><p>在HTTP传输数据之前，首先需要TCP建立连接，TCP连接的建立，通常称为<strong>三次握手</strong></p><p>这个所谓的「连接」，只是双方计算机里维护一个状态机，在连接建立的过程中，双方的状态变化时序图就像这样。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4/网络/TCP三次握手.drawio.png" alt="TCP 三次握手"></p><ul><li>一开始，客户端和服务端都处于 <code>CLOSED</code> 状态。先是服务端主动监听某个端口，处于 <code>LISTEN</code> 状态。</li><li>然后客户端主动发起连接 <code>SYN</code>，之后处于 <code>SYN-SENT</code> 状态。</li><li>服务端收到发起的连接，返回 <code>SYN</code>，并且 <code>ACK</code> 客户端的 <code>SYN</code>，之后处于 <code>SYN-RCVD</code> 状态。</li><li>客户端收到服务端发送的 <code>SYN</code> 和 <code>ACK</code> 之后，发送对 <code>SYN</code> 确认的 <code>ACK</code>，之后处于 <code>ESTABLISHED</code> 状态，因为它一发一收成功了。</li><li>服务端收到 <code>ACK</code> 的 <code>ACK</code> 之后，处于 <code>ESTABLISHED</code> 状态，因为它也一发一收了。</li></ul><p>所以三次握手目的是<strong>保证双方都有发送和接收的能力</strong>。</p><blockquote><p>如何查看TCP的连接状态</p></blockquote><p>TCP 的连接状态查看，在 Linux 可以通过 <code>netstat -napt</code> 命令查看。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/10.jpg" alt="TCP 连接状态查看"></p><blockquote><p>TCP分割数据</p></blockquote><p>如果 HTTP 请求消息比较长，超过了 <code>MSS</code> 的长度，这时 TCP 就需要把 HTTP 的数据拆解成一块块的数据发送，而不是一次性发送所有数据。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/11.jpg" alt="MTU 与 MSS"></p><ul><li><code>MTU</code>：一个网络包的最大长度，以太网中一般为 <code>1500</code> 字节。</li><li><code>MSS</code>：除去 IP 和 TCP 头部之后，一个网络包所能容纳的 TCP 数据的最大长度。</li></ul><p>数据会被以 <code>MSS</code> 的长度为单位进行拆分，拆分出来的每一块数据都会被放进单独的网络包中。也就是在每个被拆分的数据加上 TCP 头信息，然后交给 IP 模块来发送数据。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/12.jpg" alt="数据包分割"></p><blockquote><p>TCP报文生成</p></blockquote><p>TCP协议里面会有两个端口，一个是浏览器监听的端口（通常为随机生成），一个是Web服务器监听的端口（HTTP默认是<code>80</code>，HTTPS默认是<code>443</code>）</p><p>双方建立连接后，TCP报文中的数据部分就是存放了<strong>HTTP头部+数据</strong>，组装好TCP报文之后，就需要交给下面的网络层处理</p><p>至此，网络包的报文如下图。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/13.jpg" alt="TCP 层报文"></p><h2 id="远程定位——ip" tabindex="-1"><a class="header-anchor" href="#远程定位——ip" aria-hidden="true">#</a> 远程定位——IP</h2><hr><p>TCP模块在执行连接、收发、断开等阶段操作时，都需要委托IP模块将数据封装成<strong>网络包</strong>发送给通信对象</p><blockquote><p>IP包头格式</p></blockquote><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/14.jpg" alt="IP 包头格式"></p><p>在IP协议中，需要有<strong>源地址IP</strong>和<strong>目标地址IP</strong>：</p><ul><li>源地址IP：客户端输出的IP地址</li><li>目标地址：通过DNS域名解析得到的Web服务器IP</li></ul><p>因为HTTP是经过TCP传输的，所有在IP包头的<strong>协议号</strong>，要填写<code>06</code>（十六进制），表示协议为TCP协议</p><blockquote><p>假设客户端有多个网卡，就会有多个IP地址，那么IP头部的源地址应该选择哪个地址？</p></blockquote><p>这个判断相当于在多块网卡中，判断应该使用哪个网卡来发送包</p><p>这时候就需要根据<strong>路由表</strong>规则，来判断哪一个网卡作为源地址IP</p><p>在 Linux 操作系统，我们可以使用 <code>route -n</code> 命令查看当前系统的路由表。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/15.jpg" alt="路由表"></p><p>举个例子，根据上面的路由表，我们假设 Web 服务器的目标地址是 <code>192.168.10.200</code>。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/16.jpg" alt="路由规则判断"></p><ol><li>首先先和第一条目的子网掩码（<code>Genmask</code>）进行 <strong>与运算</strong>，得到结果为 <code>192.168.10.0</code>，但是第一个条目的 <code>Destination</code> 是 <code>192.168.3.0</code>，两者不一致所以匹配失败。</li><li>再与第二条目的子网掩码进行 <strong>与运算</strong>，得到的结果为 <code>192.168.10.0</code>，与第二条目的 <code>Destination 192.168.10.0</code> 匹配成功，所以将使用 <code>eth1</code> 网卡的 IP 地址作为 IP 包头的源地址。</li></ol><p>那么假设 Web 服务器的目标地址是 <code>10.100.20.100</code>，那么依然依照上面的路由表规则判断，判断后的结果是和第三条目匹配。</p><p>第三条目比较特殊，它目标地址和子网掩码都是 <code>0.0.0.0</code>，这表示<strong>默认网关</strong>，如果其他所有条目都无法匹配，就会自动匹配这一行。并且后续就把包发给路由器，<code>Gateway</code> 即是路由器的 IP 地址。</p><blockquote><p>IP报文生成</p></blockquote><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/17.jpg" alt="IP 层报文"></p><h2 id="两点传输——mac" tabindex="-1"><a class="header-anchor" href="#两点传输——mac" aria-hidden="true">#</a> 两点传输——MAC</h2><hr><p>生成了IP头部之后，接下来网络包还需要在IP头部的前面加上<strong>MAC头部</strong></p><blockquote><p>MAC包头格式</p></blockquote><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/18.jpg" alt="MAC 包头格式"></p><p>在MAC包头里需要<strong>发送方的MAC地址</strong>和<strong>接收方目标MAC地址</strong>，用于<strong>两点之间的传输</strong></p><p>一般在TCP/IP通信里，MAC包头的协议类型只使用：</p><ul><li><code>0800</code>：IP协议</li><li><code>0806</code>：ARP协议</li></ul><blockquote><p>MAC发送方和接收方如何确认？</p></blockquote><p><strong>发送方</strong>的MAC地址获取简单，MAC地址在网卡生产时写入到ROM里面，只要将这个值读取出来写入到MAC头部就行</p><p><strong>接收方</strong>的MAC地址就有点复杂，只要告诉以太网对方的MAC地址，以太网就会把包发送过去，那么对方的MAC地址哪里来呢？</p><p>这是得先清楚应该把包发给谁，需要查询一下<strong>路由表</strong>，在路由表中找到匹配的条目，然后把包发送给<code>Gateway</code>列中的IP地址</p><blockquote><p>如何获取对方的MAC地址？</p></blockquote><p>这里需要<code>ARP</code>协议帮我们找到路由器的MAC地址</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/19.jpg" alt="ARP 广播"></p><p>ARP协议会在以太网中以广播的形式，对以太网所有的设备进行广播，如果对方和自己处在同一张子网中，那么上面操作就可可以得到对方的MAC地址，那么将这个MAC地址写入MAC头部后，MAC头部就完成了</p><blockquote><p>ARP缓存</p></blockquote><p>在得到对方的MAC地址后，操作系统会将本次的查询结果放到一块ARP缓存的内存空间，不过缓存保存的时间就几分钟</p><p>也就是说，在发包时：</p><ul><li>先查询 ARP 缓存，如果其中已经保存了对方的 MAC 地址，就不需要发送 ARP 查询，直接使用 ARP 缓存中的地址。</li><li>而当 ARP 缓存中不存在对方 MAC 地址时，则发送 ARP 广播查询。</li></ul><blockquote><p>查看 ARP 缓存内容</p></blockquote><p>在 Linux 系统中，我们可以使用 <code>arp -a</code> 命令来查看 ARP 缓存的内容。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/20.jpg" alt="ARP 缓存内容"></p><blockquote><p>MAC 报文生成</p></blockquote><p>至此，网络包的报文如下图。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/21.jpg" alt="MAC 层报文"></p><h2 id="出口——网卡" tabindex="-1"><a class="header-anchor" href="#出口——网卡" aria-hidden="true">#</a> 出口——网卡</h2><hr><p>网络包只是存放在内存中的一串二进制数字信息，没有办法直接发送给对方。因此，我们需要将<strong>数字信息转换为电信号</strong>，才能在网线上传输，也就是说，这才是真正的数据发送过程。</p><p>负责执行这一操作的是<strong>网卡</strong>，要控制网卡还需要靠<strong>网卡驱动程序</strong>。</p><p>网卡驱动获取网络包之后，会将其<strong>复制</strong>到网卡内的缓存区中，接着会在其<strong>开头加上报头和起始帧分界符，在末尾加上用于检测错误的帧校验序列</strong>。</p><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4/网络/数据包.drawio.png" alt="数据包"></p><ul><li>起始帧分界符是一个用来表示包起始位置的标记</li><li>末尾的 <code>FCS</code>（帧校验序列）用来检查包传输过程是否有损坏</li></ul><p>最后网卡会将包转为电信号，通过网线发送出去。</p><h2 id="交换机" tabindex="-1"><a class="header-anchor" href="#交换机" aria-hidden="true">#</a> 交换机</h2><hr><p>下面来看一下包是如何通过交换机的。交换机的设计是将网络包<strong>原样</strong>转发到目的地。交换机工作在 MAC 层，也称为<strong>二层网络设备</strong>。</p><blockquote><p>交换机的包接收操作</p></blockquote><p>……</p><h2 id="服务器-与-客户端" tabindex="-1"><a class="header-anchor" href="#服务器-与-客户端" aria-hidden="true">#</a> 服务器 与 客户端</h2><hr><p><img src="https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/计算机网络/键入网址过程/25.jpg" alt="网络分层模型"></p><p>数据包抵达服务器后，服务器会先扒开数据包的 MAC 头部，查看是否和服务器自己的 MAC 地址符合，符合就将包收起来。</p><p>接着继续扒开数据包的 IP 头，发现 IP 地址符合，根据 IP 头中协议项，知道自己上层是 TCP 协议。</p><p>于是，扒开 TCP 的头，里面有序列号，需要看一看这个序列包是不是我想要的，如果是就放入缓存中然后返回一个 ACK，如果不是就丢弃。TCP头部里面还有端口号， HTTP 的服务器正在监听这个端口号。</p><p>于是，服务器自然就知道是 HTTP 进程想要这个包，于是就将包发给 HTTP 进程。</p><p>服务器的 HTTP 进程看到，原来这个请求是要访问一个页面，于是就把这个网页封装在 HTTP 响应报文里。</p><p>HTTP 响应报文也需要穿上 TCP、IP、MAC 头部，不过这次是源地址是服务器 IP 地址，目的地址是客户端 IP 地址。</p>',149),i=[d];function n(r,l){return c(),e("div",null,i)}const g=o(t,[["render",n],["__file","02-键入网址到网页显示，期间发送了什么.html.vue"]]);export{g as default};
