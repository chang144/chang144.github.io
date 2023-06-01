import{_ as o,r as i,o as t,c as l,a as e,b as s,d as a,e as c}from"./app-aa614d19.js";const r={},d=e("p",null,"learn from",-1),p={href:"https://juejin.cn/post/7179042892395053113",target:"_blank",rel:"noopener noreferrer"},u={href:"https://docs.docker.com/engine/reference/builder/",target:"_blank",rel:"noopener noreferrer"},k={href:"https://juejin.cn/post/7042663735156015140",target:"_blank",rel:"noopener noreferrer"},m={href:"https://zhuanlan.zhihu.com/p/387840381",target:"_blank",rel:"noopener noreferrer"},g={href:"https://github.com/compose-spec/compose-spec/blob/master/spec.md",target:"_blank",rel:"noopener noreferrer"},v=c(`<h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> 前言</h2><hr><p>学习Dockers前期，通过Docker的官方镜像仓库拉取里面的镜像，根据这些镜像创建出容器并运行</p><p>实际上，Docker官方镜像也是通过一定的方式构建出来的，只要弄清其中的逻辑，我们也可以仿照官方镜像的构建过程，构建出自己的镜像</p><p><code>Dockerfile</code>就是这样一个用于描述Docker镜像构建过程的文本文件，dockerfile可以包含多条构建指令，以及相关的描述</p><h3 id="_1-什么是容器" tabindex="-1"><a class="header-anchor" href="#_1-什么是容器" aria-hidden="true">#</a> 1.什么是容器</h3><p>容器是计算机上的沙盒进程，与主机上的其它进程隔离，这种隔离利用了<code>内核命名空间和cgroups</code>。简而言之容器是：</p><ul><li>是<code>image</code>的可运行实例</li><li>可以在本地计算机、虚拟机上运行或部署到云中</li><li>是可移植的</li><li>与其它容器隔离，并运行自己的软件，二进制文件和配置</li></ul><h3 id="_2-什么是容器映射" tabindex="-1"><a class="header-anchor" href="#_2-什么是容器映射" aria-hidden="true">#</a> 2.什么是容器映射</h3><p>当容器运行时，它使用了隔离的文件系统。这个自定义的文件系统由容器映像<code>container image</code>提供。因为image包含了容器的问价系统，使用image必须包含所有的运行应用程序所必须的所有东西——依赖项、配置、脚本、二进制文件等等。</p><blockquote><p>沙盒进程是指在计算机系统中，为了保障安全和隔离性而采用的一种技术，将应用程序运行在一个受限制的环境中，限制它们能访问的资源和操作范围，从而避免恶意程序和授权程序对系统的破坏</p></blockquote><h3 id="_3-容器是怎么运行的" tabindex="-1"><a class="header-anchor" href="#_3-容器是怎么运行的" aria-hidden="true">#</a> 3.容器是怎么运行的</h3><p>当一个容器运行时，它为其文件系统使用来image的各个层。每个容器都有自己的命名空间来创建/更新/删除文件。在另一个容器中不会看到任何更改，即使它们使用相同的image</p><h3 id="_4-容器卷-container-volumes" tabindex="-1"><a class="header-anchor" href="#_4-容器卷-container-volumes" aria-hidden="true">#</a> 4.容器卷[container volumes]</h3><p>每个容器启动时都是从容器的定义开始的。在容器中可以创建、更新和删除文件，但当容器被删除时，这些改变将回丢失，所有更变都被隔离在各个容器中</p><p>卷：提供了将容器的特定文件系统路径链路到主机的能力。如果在主机上的某个文件被挂载，那么当容器中该文件路径下的文件发送更改时，我们在主机上同样也可以看到更改。同样的，启动另一个挂载了同一个文件目录的容器，它也可以访问到相同的文件</p><h2 id="镜像构建原理" tabindex="-1"><a class="header-anchor" href="#镜像构建原理" aria-hidden="true">#</a> 镜像构建原理</h2><hr><h3 id="_1-docker架构模式" tabindex="-1"><a class="header-anchor" href="#_1-docker架构模式" aria-hidden="true">#</a> 1.Docker架构模式</h3><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e33ce775404146daa01bc0d385cc2cee~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp" alt="img"></p><p><code>docker</code>使用了<strong>client</strong>/<strong>server</strong>的架构模式。构建镜像时，用户在<strong>dockers</strong> <strong>client</strong>输入构建命令。<strong>docker</strong>引擎以 <code>REST API</code>的形式，像 <strong>docker</strong> <strong>daemon</strong>发送构建请求，如何dockers daemon就根据构建请求的内容，开始镜像构建的工作，并向Client持续放回构建过程的信息。</p><h3 id="_2-镜像分层模型" tabindex="-1"><a class="header-anchor" href="#_2-镜像分层模型" aria-hidden="true">#</a> 2.镜像分层模型</h3><hr><p><strong>docker</strong>镜像是用于创建容器的只读模板，是通过 <strong>Dockerfile</strong>中定义的指令构建而成的，构建结束后，会在原有的镜像层上生成一个新的镜像层，如下所示</p><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51e63bbb613a4676859d1a041762fe9b~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp" alt="img"></p><p>在 tomcat 镜像创建一个容器后，会在tomcat镜像之上新创建一个可写的容器层，在容器中写文件时，会保存到这个容器层中</p><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c27b2dee8b754753b6da6b71d9864e4b~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp" alt="img"></p><h3 id="_3-基础镜像与父级镜像" tabindex="-1"><a class="header-anchor" href="#_3-基础镜像与父级镜像" aria-hidden="true">#</a> 3.基础镜像与父级镜像</h3><hr><p>用于构建基础镜像的 <strong>Dockerfile</strong> 不指定父级镜像，Docker约定使用如下形式基础镜像</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">FROM</span> scratch</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这里的 <code>scratch</code>是一个空镜像，可以从零开始构建镜像，常用来构建最小镜像，如<code>busybox</code>，<code>debian</code>，<code>alpine</code>等镜像，省去很多linux命令，因此很小。一般，不需要自己去构建基础镜像。</p><p>构建自定义镜像时，通过<strong>FROM</strong>指定使用说明父级镜像。例如，官方的<strong>tomcat</strong>命令没有yum，vim等命令，但是我们可以将<strong>tomcat</strong>镜像作为父级镜像，然后安装想要的命令，这样在容器中就可以使用了。</p><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba55ae94bfb144cfa68b43aa7e19372e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp" alt="img"></p><h3 id="_4-构建上下文-build-context" tabindex="-1"><a class="header-anchor" href="#_4-构建上下文-build-context" aria-hidden="true">#</a> 4.构建上下文 / build context</h3><hr><p><strong>Client</strong> 向 <strong>Docker</strong> <strong>daemon</strong> 发送的构架请求包含两部分，第一部分是 <strong>Dockerfile</strong>文件，第二部分是<strong>构建上下文</strong></p><p>构建上下文是一些文件集合，这些文件可以是指定路径下的文件，也可以是远程资源中指定路径下的文件，在构建过程中，Docker daemon 可以访问这些文件，并执行相应的操作[理解：访问配置文件]</p><ul><li>路径上下文</li></ul><p>构建命令中指定具体路径，该路径下的所有文件即为构建上下文，这些文件被打包送给Docker daemon中，然后被解压</p><p>假使一个项目的文件结构如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>demo
|--Dockerfile
|--src
|--test
|--node_modules
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在项目根目录执行下面的构建命令</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code>docker build -t img-tag .
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>构建请求的第一部分是<strong>Dockerfile</strong>，这个文件在当前目录下，文件是默认名称，因此省略，</p><p>相当于默认加上了 <strong>-f Dockerfile</strong>, 该Dockerfile内容如下</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">FROM</span> busybox</span>
<span class="token instruction"><span class="token keyword">WORKDIR</span> /src</span>
<span class="token instruction"><span class="token keyword">COPY</span> src .</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>构建请求的第二部分是 <code>.</code>这个点代表当前，此时当前目录就是此次的构建的上下文，Docker引擎会整理该目录下的所有文件，把不被 <code>.dockerignore</code>中的规则所的文件都发送到Docker daemon中，如下所示</p><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f19f34eb288545db8023ef3fbc34e64f~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp" alt="img"></p><p>如果此时位于项目根目录的上一级目录，构建命令如下</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code>docker build -t img-tag -f ./demo/Dockerfile ./demo/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>URL上下文</li></ul><p>Docker 还支持利用远程仓库URL构建镜像，此时指定的远程仓库目录就充当了构建上下文</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> build https://gitee.com:user/my-repo.git<span class="token comment">#master:docker</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>以上构建命令指定了一个 Gitee 项目的 master 分支，冒号（:）之前是 Git 检出的目标 URL, 冒号之后的 docker 是远程仓库根目录下的一个子目录，此时这个子目录就是构建上下文</p><p>Docker client 执行构建命令时，Docker 引擎首先会将远程仓库的 master 分支拉取到本地的一个临时目录中，然后将其中的 docker 目录下的文件作为构建上下文发送到 Docker daemon 中。拉取远程文件之后，又回到了路径上下文的步骤，如下图所示</p><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d2402bdb96547cb8245d4300435417c~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp" alt="img"></p><ul><li>省略上下文</li></ul><p>如果 Dockerfile 中的指令不需要对任何文件进行操作，可以省略构建上下文，此时不会向 Docker daemon 发送额外的文件，这可以提高构建速度</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code>docker build -t my-hello-world:latest -&lt;&lt;EOF
<span class="token instruction"><span class="token keyword">FROM</span> busybox</span>
<span class="token instruction"><span class="token keyword">RUN</span> echo <span class="token string">&quot;hello world&quot;</span></span>
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-构建缓存" tabindex="-1"><a class="header-anchor" href="#_5-构建缓存" aria-hidden="true">#</a> 5.构建缓存</h3><hr><p>迭代过程中，Dockerfile对于的资源会被经常修改，因此需要频繁重新构建镜像，Docker为了提高构建速度，设计了多种优化方案，其中最重要的是<strong>构建缓存</strong></p><p>示例：说明构建缓存是如何工作的，Dockerfile如下</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token comment"># syntax=docker/dockerfile:1</span>
<span class="token instruction"><span class="token keyword">FROM</span> ubuntu:latest</span>

<span class="token instruction"><span class="token keyword">RUN</span> apt-get update &amp;&amp; apt-get install -y build-essentials</span>
<span class="token instruction"><span class="token keyword">COPY</span> main.c Makefile /src/</span>
<span class="token instruction"><span class="token keyword">WORKDIR</span> /src/</span>
<span class="token instruction"><span class="token keyword">RUN</span> make build</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>镜像构建过中，dockerfile 中的指令会从上往下执行，每一个构建步骤的结果都会被缓存起来，例如</p><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46f1ef9ec967422cb9bd204762fd2da1~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp" alt="img"></p><p>此时再次构建，会直接使用缓存中的结果(Using cache)</p><p>这里假设修改了main.c 中的代码，再次构建时，从 <code>COPY main Makefile /src/</code>这条指令开始，后续构建缓存都会失效，如下图所示</p><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ca255ce38314bad88310df01679268a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp" alt="img"></p><p>如果不想使用构建缓存，执行构建命令时，可以传入 <code>--no-cahe</code></p><h3 id="_6-镜像构建过程" tabindex="-1"><a class="header-anchor" href="#_6-镜像构建过程" aria-hidden="true">#</a> 6.镜像构建过程</h3><p>Docker Client 执行构建命令后，会经过以下步骤构建出最终镜像</p><ol><li>确定构建上下文，如果构建上下文中有 .dockerignore 文件，解析该文件的匹配规则，将构建上下文中被匹配的文件资源排除</li><li>将 Dockerfile 和构建上下文发送给 Docker daemon</li><li>Docker daemon 收到构建请求。以下的步骤都由 Docker daemon 完成，省略主语</li><li>逐条校验 Dockerfile 中的指令是否合法，如果不合法，立即结束构建。这一步可以确定一共有多少个构建步骤，便于后续分步构建时显示当前步骤，如 <strong>Step 1/2</strong></li><li>逐条执行 Dockerfile 中的指令，每条指令都新创建一层。会生成临时 container 用于执行命令，该步骤结束后删除临时容器</li><li>生成最终镜像</li></ol><h2 id="dockerignore" tabindex="-1"><a class="header-anchor" href="#dockerignore" aria-hidden="true">#</a> .dockerignore</h2><hr><p>这个文件需要遵循一定的语法规则</p><ol><li>以 # 开头的行是备注，不会被解析为匹配规则</li><li>支持 ? 通配符，匹配单个字符</li><li>支持 * 通配符，匹配多个字符，只能匹配单级目录</li><li>支持 ** 通配符，可匹配多级目录</li><li>支持 ! 匹配符，声明某些文件资源不需要被排除</li><li>可以用 .dockerignore 排除 Dockerfile 和 .dockerignore 文件。Docker Client 仍然会将这两个文件发送到 Docker daemon，因为 Docker 底层需要。但 ADD 和 COPY 指令就无法操作这两个文件了</li></ol><p>示例：</p><div class="language-.dockerignore line-numbers-mode" data-ext=".dockerignore"><pre class="language-.dockerignore"><code># this is a .dockerignore demo

*/demo*
*/*/demo*
demo?
**/mydemo*
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="dockerfile" tabindex="-1"><a class="header-anchor" href="#dockerfile" aria-hidden="true">#</a> Dockerfile</h2><hr><p><strong>Dockerfile</strong>时一个用于描述Docekr镜像构建过程的文本文件，包含多条构建指令，以及相关的描述</p><p>Dockerfile的构建指令需要遵循如下的语法</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token comment"># Comment</span>
INSTRUCTION arguments
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>以 <code>#</code>开头的行绝大部分是注释，还有一小部分是解析器指令</p><p>构建指令分两个部分，第一部分是指令，第二部分是指令参数。</p><h4 id="_1-解析器指令-parse-directive" tabindex="-1"><a class="header-anchor" href="#_1-解析器指令-parse-directive" aria-hidden="true">#</a> 1.解析器指令 / parse directive</h4><p>解析器指令是以 <code>#</code>开始，用来提示解释器对 Dockerfile进行特殊处理，构建过程中它不会增加镜像层，也不会出现在构建过程</p><p>解析器指令是可选的</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token comment"># directive=value</span>
<span class="token comment"># 解析器指令需要在空行，注释，构建指令之前</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注意事项</strong></p><ul><li>同一解析器指令不能重复</li><li>不区分大小写，按照惯例，推荐小写</li><li>空行、注释、构建指令之后，Docker 不再查找解析器指令，都当成注释</li><li>按照惯例，解析器指令位于 Dockerfile 的第一行，在后面添加空行</li><li>行内的空格被忽略，不支持跨行</li></ul><p>Docker 目前支持两种解析器指令</p><ol><li>syntax</li><li>escape</li></ol><p><strong>syntax</strong> 解析器指令，只有使用 <strong>BuildKit</strong> 作为构建器时才生效</p><p><strong>escape</strong> 解析器指令，用于指定在 Dockerfile 中使用转义字符</p><p>在 Dockerfile 中，escape 默认为 \\</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token comment"># escape=\\  </span>
复制代码
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>但 Windows 系统中的 \\ 是路径分隔符，推荐将 escape 替换为 \`，这和 PowerShell 是一致的</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token comment"># escape=\`</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="_2-常见指令解析" tabindex="-1"><a class="header-anchor" href="#_2-常见指令解析" aria-hidden="true">#</a> 2.常见指令解析</h4><table><thead><tr><th>序号</th><th>指令名</th><th>功能描述</th></tr></thead><tbody><tr><td>1</td><td>FROM</td><td>指定基础镜像或者父级镜像</td></tr><tr><td>2</td><td>LABEL</td><td>为镜像添加元数据</td></tr><tr><td>3</td><td>ENV</td><td>设置环境变量</td></tr><tr><td>4</td><td>WORKDIR</td><td>指定后续指令的工作目录，类似于Linux中的cd命令</td></tr><tr><td>5</td><td>USER</td><td>指定当前构建阶段以及容器运行时的默认用户，以及可选的用户组</td></tr><tr><td>6</td><td>VOLUME</td><td>创建具有指定名称的挂载数据卷，用于数据持久化</td></tr><tr><td>7</td><td>ADD</td><td>将构建上下文中指定目录下的文件复制到镜像文件按系统的指定位置</td></tr><tr><td>8</td><td>COPY</td><td>功能与语法与ADD类似，但是不会自动解压文件，也不能访问网络资源</td></tr><tr><td>9</td><td>EXPOSE</td><td>约定容器运行时监听的端口，通常用于容器与外界之间的通信</td></tr><tr><td>10</td><td>RUN</td><td>用于构建镜像过程中执行目录</td></tr><tr><td>11</td><td>CMD</td><td>构建镜像成功后，所创建的容器启动时执行的命令，常与ENTRYPOINT结合使用</td></tr><tr><td>12</td><td>ENTRYPOINT</td><td>用于配置容器以可执行的方式运行，常与CMD结合使用</td></tr></tbody></table><p><strong>FROM</strong></p><p>指定基础镜像或父级镜像</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code>FORM [--platform=&lt;platform&gt;] &lt;image&gt; [AS &lt;name&gt;]
FORM [--platform=&lt;platform&gt;] &lt;image&gt;[:&lt;tag&gt;] [AS &lt;name&gt;]
FORM [--platform=&lt;platform&gt;] &lt;image&gt;[@&lt;digest&gt;] [AS &lt;name&gt;]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol><li><code>tag</code>或<code>digest</code>是可选项，默认为<strong>latest</strong>版本为基础镜像</li><li>如果不以任何镜像为基础，使用：<code>FORM scratch</code>.<strong>scratch</strong>是一个空镜像，用于构建最小镜像</li></ol><p><strong>LABEL</strong></p><p>为镜像添加元数据</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">LABEL</span> &lt;key&gt;=&lt;value&gt; &lt;key&gt;=&lt;value&gt; &lt;key&gt;=&lt;value&gt;...</span>
示例:
<span class="token instruction"><span class="token keyword">LABEL</span> auth=<span class="token string">&quot;ch&quot;</span> <span class="token operator">\\</span>
	  version=<span class="token string">&quot;1.0.0&quot;</span> <span class="token operator">\\</span>
	  decription=<span class="token string">&quot;Dockerfile&quot;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol><li>使用<code>LABEL</code>定义键值对结构的元数据，一个<strong>LABEL</strong>可指定多个元数据</li><li>定义元数据值时，尽量使用双引号</li><li>当前镜像可以继承继承镜像或者父级镜像中的元数据时，可以覆盖</li><li>可使用以下命令查看元数据</li></ol><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code>docker image inspect -f=&#39;{{json .ContainerConfig.Labels}}&#39; my-image
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>ENV</strong></p><p>设置环境变量</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">ENV</span> &lt;key&gt;=&lt;value&gt;...</span>
<span class="token instruction"><span class="token keyword">ENV</span> &lt;key&gt; &lt;value&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol><li>当前镜像可以继承基础镜像或者父级镜像中的环境变量，也可以覆盖</li><li>使用<code>ENV</code>指定定义的环境变量，最终会持久化到容器中</li><li>运行容器时，可以通过<code>--env =</code>或者<code>-e =</code>覆盖镜像定义中的环境变量</li><li>对只使用在镜像构建过程中的变量，推荐使用<code>ARG</code>，或者内环境变量，这样不会被持久化到最终的镜像中</li></ol><blockquote><p>内环境变量示例：<code>RUN TEMP=&quot;no persisit&quot;</code></p></blockquote><ol start="5"><li>查看最终镜像中的环境变量</li></ol><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code>docker image inspect -f=&#39;{{json .ContainerConfig.Env}}&#39; my-image 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>WORKDIR</strong></p><p>指定后续指令的工作目录，类似<strong>linux</strong>中的cd命令</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">WORKDIR</span> /path/to/workdir</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>使用Dockerfile中设置的环境变量</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">ENV</span> DIR_PATH=/demo</span>
<span class="token instruction"><span class="token keyword">WORKDIR</span> <span class="token variable">$DIR_PATH</span>/<span class="token variable">$DIR_NAME</span></span>
<span class="token instruction"><span class="token keyword">RUN</span> pwd</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>构建镜像时，pwd 的输出结果是 /demo，因为 $DIR_NAME 未显示指定，直接忽略</p><ol><li>默认的工作目录是<code>/</code></li><li>可以使用Dockerfile中显示指定的环境变量，包括父级镜像中的环境变量</li><li>父级镜像可能设置工作目录，最佳实践是显示设置当前镜像的工作目录</li></ol><p><strong>USER</strong></p><p>指定当前构建阶段以及容器运行时的默认用户，以及可选的用户组</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">USER</span> &lt;user&gt;[:&lt;group&gt;]</span>
<span class="token instruction"><span class="token keyword">USER</span> &lt;user&gt;[:&lt;GID&gt;]</span>
<span class="token instruction"><span class="token keyword">USER</span> &lt;UID&gt;[:&lt;group&gt;]</span>
<span class="token instruction"><span class="token keyword">USER</span> &lt;UID&gt;[:&lt;GID&gt;]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol><li>使用USER指定用户后，Dockerfile中构建镜像的<code>RUN</code>,<code>CMD</code>,<code>ENTRYPOINT</code>指令都会使用该用户，同时这个用户也是容器运行时的默认用户</li><li>不指定用户组，使用默认用户组<strong>root</strong></li><li>运行容器时，可以使用<code>-u</code>参数覆盖Dockerfile中默认的用户</li></ol><p><strong>VOLUME</strong></p><p>创建具有指定名称的挂载数据卷，用于数据持久化</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">VOLUME</span> [<span class="token string">&quot;volume1&quot;</span>,<span class="token string">&quot;volume2&quot;</span>,...]</span>
<span class="token instruction"><span class="token keyword">VOLUME</span> volume1 volume2 ...</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>数据卷的特征以及作用：</p><ul><li>数据持久化，避免容器重启后丢失重要数据</li><li>修改数据卷时不会对容器产生影响，防止容器不断膨胀</li><li>有利于多个容器共享数据</li></ul><p><strong>ADD</strong></p><p>将构建上下文中指定目录下的文件**(src)<strong>复制到镜像文件系统的指定位置</strong>(dest)**</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">ADD</span> [--chown=&lt;user&gt;:&lt;group&gt;][--checksum=&lt;checksum&gt;]&lt;src&gt;... &lt;dest&gt;</span>
<span class="token instruction"><span class="token keyword">ADD</span> [--chown=&lt;user&gt;:&lt;group&gt;][<span class="token string">&quot;&lt;src&gt;&quot;</span>, ...<span class="token string">&quot;&lt;dest&gt;&quot;</span>]</span>
<span class="token instruction"><span class="token keyword">ADD</span> &lt;git ref&gt; &lt;dir&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol><li>如果<code>ADD</code>指令对应的src资源有变更，Dockerfile中这条指令后的<strong>构建缓存</strong>都会失效</li><li>Dockerfile中<code>--chown</code>特性只有在linux下才有效，windows是无效的</li><li>src支持通配符</li><li>dest必须是文件夹，用以存放文件</li><li>如果src是<strong>压缩资源</strong>，将会被解压为一个文件</li><li>如果 src 是远程 URL, 并且 dest 不以 / 结尾，Docker 从 URL 下载文件，存到 dest 中</li><li>如果 src 是远程 URL，URL 中含有非空路径，并且 dest 以 / 结尾，Docker 会推断文件名，根据 URL 中的路径，在目标位置创建相同路径，将下载的文件放入其中</li><li>dest 可以是镜像文件系统下的绝对路径，或者是 WORKDIR 下的相对路径</li><li>如果 dest 不是以 / 结尾，Docker 会把它当成普通文件，src 中的内容会被写入这个文件中</li><li>如果目标位置下的某些目录不存在，会自动创建</li><li>ADD 添加网络资源时不支持身份认证，可以使用 RUN wget 或者 RUN curl 实现这个功能</li></ol><p><strong>COPY</strong></p><p>功能与<strong>ADD</strong>类似，但是不会自动解压文件，也不能访问网络资源</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">COPY</span> [--chown=&lt;user&gt;:&lt;group&gt;] &lt;src&gt;... &lt;dest&gt;</span>
<span class="token instruction"><span class="token keyword">COPY</span> [--chown=&lt;user&gt;:&lt;group&gt;] [<span class="token string">&quot;&lt;src&gt;&quot;</span>,... <span class="token string">&quot;&lt;dest&gt;&quot;</span>]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>EXPOSE</strong></p><p>约定容器运行时监听的端口，通常用于容器与外界之间的通信</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">EXPOSE</span> &lt;port&gt; [&lt;port&gt;/&lt;protocol&gt;...]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol><li>支持 TCP 或者 UDP 协议，如果不显式指定协议，默认使用 TCP 协议</li><li>需要同时以 TCP 和 UDP 协议的方式暴露同一个端口时，需要分别指定</li><li>EXPOSE 并不会真正将端口发布到宿主机，而是作为一种约定，让镜像使用者在运行容器时，用 <strong>-p</strong> 分别发布约定端口，或者 <strong>-P</strong> 发布所有约定端口</li><li>如果没有暴露端口，运行容器是也可以通过 <strong>-p</strong> 的方式映射端口</li></ol><p><strong>RUN</strong></p><p>用于构建镜像过程中执行命令，有两种执行方式</p><p>第一种，以<strong>shell</strong>方式运行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>RUN <span class="token operator">&lt;</span>command<span class="token operator">&gt;</span>
RUN <span class="token builtin class-name">echo</span> <span class="token string">&quot;Hello Dockerfile&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>第二种，以<strong>exec</strong>的方式运行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>RUN <span class="token punctuation">[</span><span class="token string">&quot;executable&quot;</span>,<span class="token string">&quot;param1&quot;</span>,<span class="token string">&quot;param2&quot;</span><span class="token punctuation">..</span>.<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>CMD</strong></p><p>构建镜像成功后，所创建的容器启动时执行的命令</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">CMD</span> command param1 param2 #shell</span>
<span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">&quot;executable&quot;</span>,<span class="token string">&quot;param1&quot;</span>,<span class="token string">&quot;param2&quot;</span>] #exec</span>
<span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">&quot;param1&quot;</span>,<span class="token string">&quot;param2&quot;</span>] #作为ENTRYPOINT的默认参数，是exec方式的特殊形式</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol><li>Docker种只有一条<code>CMD</code>指令生效，在多条CMD指令存在的情况下，只有最后一条生效</li><li>虽然Dockerfile中只有一条CMD生效，但每一条CMD指令会新增一个镜像层，所有推荐只定义一条CMD指令，使用<code>&amp;&amp;</code>连接多个指令</li><li>exec方式是通过JSON数组的方式进行解析的，因此需要双引号</li><li>与RUN指令不同，RUN指令是在构建指令的过程中执行，CMD命令是在容器启动时执行</li><li><code>docker run</code>后的命令行参数会覆盖CMD中的命令</li></ol><p><strong>ENTRYPOINT</strong></p><p>用于配置容器以可执行的方式运行。有两种形式</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">ENTRYPOINT</span> [<span class="token string">&quot;executable&quot;</span>,<span class="token string">&quot;param1&quot;</span>,<span class="token string">&quot;param2&quot;</span>] #推荐</span>
<span class="token instruction"><span class="token keyword">ENTRYPOINT</span> command param1 param2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol><li>Dockerfile中只有最后一条<code>ENTRYPOINT</code>指令生效</li><li>运行容器时，docker run --entrypoint 覆盖该指令</li><li>shell 形式的 ENTRYPOINT 会使 CMD 命令 和 docker run <img src="" alt="img"> 中的命令行参数失效。它有一个缺点，ENTRYPOINT 命令将作为 /bin/sh -c 的子命令，不会传递信号。比如，停止容器时，容器内接收不到 SIGTERM 信号，这并不是预期的效果，可以在命令前添加 exec 来解决，如 ENTRYPOINT exec top -b</li><li>指定 ENTRYPOINT 后，CMD 的内容将作为默认参数传给 ENTRYPOINT 指令，形如</li><li>如果 CMD 是在基础镜像中定义的，当前镜像定义的 ENTRYPOINT 会将 CMD 的值重置为空值，这种情况下，需要重新定义 CMD</li></ol><h1 id="docker-compose" tabindex="-1"><a class="header-anchor" href="#docker-compose" aria-hidden="true">#</a> Docker-Compose</h1><p>docker-compose通过一个声明式的配置文件描述整个应用，从而使用一条命令即可完成部署</p><p>docker-compose同使用<strong>YAML</strong>文件来定义多级服务，在使用时默认使用文件名<code>docker-compose.yml</code>，也可以在docker compose运行时使用<code>-f</code>参数来指定具体文件</p><p><strong>compose</strong>的优点</p><ul><li>在单主机上建立多个隔离环境，Compose使用项目名称将环境彼此隔离，可以在多个不同的上下文中使用此项目名称</li><li>创建容器时保留卷数据</li><li>仅重新创建以更改的容器，当服务没有更改时，Compose会使用现有的容器</li><li>变量在环境之间组合重复使用</li></ul><p><strong>多个配置文件</strong></p><p>可以为用一个项目配置多个compose文件，使用多个compose文件能够针对不同的环境或者不同的工作流自定义compose应用程序</p><p>默认情况下，compose读取两个文件，<code>docker-compose.yml</code>和一个可选<code>docker-compose.override.yml</code>文件</p><p>如果在两个文件中都定义了服务，compose会使用override进行合并配置</p><p>当配置文件的名称非默认情况时，可以使用<code>-f</code>指定Compose文件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker-compose</span> <span class="token parameter variable">-f</span> docker-compose.yml <span class="token parameter variable">-f</span> docker-compose.prod.yml up <span class="token parameter variable">-d</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>yaml</strong>文件级</p><p>Docker compose的YAML文件包含有4个一级key:<code>version</code>,<code>services</code>,<code>networks</code>,<code>volumes</code></p><ul><li><code>version</code>:指定版本信息，通常位于文件的第一行。其定义了Compose文件格式的版本。</li><li><code>services</code>:用于定义不用的应用服务。Docker Compose会将每个服务部署在各种的容器中。</li><li><code>networks</code>:用于指引Docker创建新的网络。默认情况下，Docker Compose会创建bridge网络，这个是一个单主机网络，只能实现同一主机上容器的连接。可以使用driver属性指定不同的网络类型</li><li><code>volumes</code>用于指引Docker来创建新的卷</li></ul><h2 id="docker-compose-yml的具体配置" tabindex="-1"><a class="header-anchor" href="#docker-compose-yml的具体配置" aria-hidden="true">#</a> <strong>docker-compose.yml</strong>的具体配置：</h2><h2 id="_1-build" tabindex="-1"><a class="header-anchor" href="#_1-build" aria-hidden="true">#</a> 1.build</h2><p>指定构建镜像的dockerfile的上下文路径，或者详细配置文件</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&quot;3.9&quot;</span>
<span class="token key atrule">services</span><span class="token punctuation">:</span>
	<span class="token key atrule">webapp</span><span class="token punctuation">:</span> 
		<span class="token key atrule">build</span><span class="token punctuation">:</span> ./dir
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或者更详细的写法</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&quot;3.9&quot;</span>
<span class="token key atrule">services</span><span class="token punctuation">:</span>
  <span class="token key atrule">webapp</span><span class="token punctuation">:</span>
    <span class="token key atrule">build</span><span class="token punctuation">:</span>
      <span class="token key atrule">context</span><span class="token punctuation">:</span> ./dir
      <span class="token key atrule">dockerfile</span><span class="token punctuation">:</span> Dockerfile<span class="token punctuation">-</span>alternate
      <span class="token key atrule">args</span><span class="token punctuation">:</span>
        <span class="token key atrule">buildno</span><span class="token punctuation">:</span> <span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>context</strong> 上下文路径，可以是文件路径，也可以是到链接到 git 仓库的 url。当是相对路径时，它被解释为相对于 Compose 文件的位置。</li><li><strong>dockerfile</strong> 指定构建镜像的 Dockerfile 文件名</li><li><strong>args</strong> 构建参数，只能在构建过程中访问的环境变量</li><li><strong>cache_from</strong> 缓存解析镜像列表</li><li><strong>labels</strong> 设置构建镜像的元数据</li><li><strong>network</strong> 设置网络容器连接，<code>none</code> 表示在构建期间禁用网络</li><li><strong>shm_size</strong> 设置<code>/dev/shm</code>此构建容器的分区大小</li><li><strong>target</strong> 多阶段构建，可以指定构建哪一层</li></ul><h2 id="_2-network" tabindex="-1"><a class="header-anchor" href="#_2-network" aria-hidden="true">#</a> 2.network</h2><p>...累了，下次再写</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&#39;3.9&#39;</span>
<span class="token key atrule">services</span><span class="token punctuation">:</span>
  mysql<span class="token punctuation">:</span>
    build<span class="token punctuation">:</span>
      context<span class="token punctuation">:</span> ./mysql
    environment<span class="token punctuation">:</span>
      MYSQL_ROOT_PASSWORD<span class="token punctuation">:</span> admin
    restart<span class="token punctuation">:</span> always
    container_name<span class="token punctuation">:</span> mysql
    volumes<span class="token punctuation">:</span>
    <span class="token punctuation">-</span> /data/edu<span class="token punctuation">-</span>bom/mysql/test<span class="token punctuation">:</span>/var/lib/mysql
    image<span class="token punctuation">:</span> mysql/mysql<span class="token punctuation">:</span><span class="token number">5.7</span>
    ports<span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 3306<span class="token punctuation">:</span><span class="token number">3306</span>
    networks<span class="token punctuation">:</span>
      net<span class="token punctuation">:</span>
  eureka<span class="token punctuation">:</span>
    build<span class="token punctuation">:</span>
      context<span class="token punctuation">:</span> ./edu<span class="token punctuation">-</span>eureka<span class="token punctuation">-</span>boot
    restart<span class="token punctuation">:</span> always
    ports<span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 8761<span class="token punctuation">:</span><span class="token number">8761</span>
    container_name<span class="token punctuation">:</span> edu<span class="token punctuation">-</span>eureka<span class="token punctuation">-</span>boot
    hostname<span class="token punctuation">:</span> edu<span class="token punctuation">-</span>eureka<span class="token punctuation">-</span>boot
    image<span class="token punctuation">:</span> edu/edu<span class="token punctuation">-</span>eureka<span class="token punctuation">-</span>boot<span class="token punctuation">:</span><span class="token number">1.0</span>
    depends_on<span class="token punctuation">:</span>
      <span class="token punctuation">-</span> mysql
    networks<span class="token punctuation">:</span>
      net<span class="token punctuation">:</span>
<span class="token key atrule">networks</span><span class="token punctuation">:</span>
    <span class="token key atrule">net</span><span class="token punctuation">:</span>
<span class="token key atrule">volumes</span><span class="token punctuation">:</span>
    <span class="token key atrule">vol</span><span class="token punctuation">:</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>docker compose常用命令</strong></p><ul><li>构建并启动服务——<code>docker-compose up -d</code></li><li>停止运行并删除服务——<code>docker-compose down</code></li><li>列出所有运行容器——<code>docker-compose ps</code></li><li>查看服务日志——<code>docker-compose logs</code></li><li>构建或重建——<code>docker-compose build</code></li><li>启动服务——<code>docker-compose start</code></li><li>停止运行中的服务——<code>docker-compose stop</code></li><li>重启服务——<code>docker-compose restart</code></li></ul>`,186);function b(h,f){const n=i("ExternalLinkIcon");return t(),l("div",null,[d,e("ul",null,[e("li",null,[e("p",null,[e("a",p,[s("一篇文章带你吃透 Dockerfile - 掘金 (juejin.cn)"),a(n)])])]),e("li",null,[e("p",null,[e("a",u,[s("Dockerfile reference"),a(n)])])]),e("li",null,[e("p",null,[e("a",k,[s("全网最详细的Docker-Compose详细教程 - 掘金 (juejin.cn)"),a(n)])])]),e("li",null,[e("p",null,[e("a",m,[s("docker compose 配置文件 .yml 全面指南 - 知乎 (zhihu.com)"),a(n)])])]),e("li",null,[e("p",null,[e("a",g,[s("compose-spec/spec.md at master · compose-spec/compose-spec · GitHub"),a(n)])])])]),v])}const y=o(r,[["render",b],["__file","Dive into Dockerfile.html.vue"]]);export{y as default};