<template><div><h1 id="go-project-layout" tabindex="-1"><a class="header-anchor" href="#go-project-layout" aria-hidden="true">#</a> Go Project Layout</h1>
<blockquote>
<p>参考链接<a href="https://github.com/golang-standards/project-layout/blob/master/README_zh.md" target="_blank" rel="noopener noreferrer">project-layout/README_zh.md at master · golang-standards/project-layout (github.com)<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="go-目录" tabindex="-1"><a class="header-anchor" href="#go-目录" aria-hidden="true">#</a> Go 目录</h2>
<hr>
<ul>
<li>
<p><strong>/cmd</strong></p>
<p>本项目的主干</p>
<p>每个应用程序的目录名应该与想要的可执行文件名称相匹配[/cmd/myapp]</p>
</li>
<li>
<p><strong>/internal</strong></p>
<p>私有应用程序和库代码。这是你不希望其他人在其应用程序或库中导入代码。请注意，这个布局模式是由 Go 编译器本身执行的。有关更多细节，请参阅Go 1.4 <a href="https://golang.org/doc/go1.4#internalpackages" target="_blank" rel="noopener noreferrer"><code v-pre>release notes</code><ExternalLinkIcon/></a> 。注意，你并不局限于顶级 <code v-pre>internal</code> 目录。在项目树的任何级别上都可以有多个内部目录。</p>
<p>你可以选择向 internal 包中添加一些额外的结构，以分隔共享和非共享的内部代码。这不是必需的(特别是对于较小的项目)，但是最好有有可视化的线索来显示预期的包的用途。你的实际应用程序代码可以放在 <code v-pre>/internal/app</code> 目录下(例如 <code v-pre>/internal/app/myapp</code>)，这些应用程序共享的代码可以放在 <code v-pre>/internal/pkg</code> 目录下(例如 <code v-pre>/internal/pkg/myprivlib</code>)。</p>
</li>
<li>
<p><strong>/pkg</strong>（可以理解为公共类/工具类）</p>
<p>外部应用程序可以使用的库代码(例如 <code v-pre>/pkg/mypubliclib</code>)。其他项目会导入这些库，希望它们能正常工作，所以在这里放东西之前要三思:-)注意，<code v-pre>internal</code> 目录是确保私有包不可导入的更好方法，因为它是由 Go 强制执行的。<code v-pre>/pkg</code> 目录仍然是一种很好的方式，可以显式地表示该目录中的代码对于其他人来说是安全使用的好方法。由 Travis Jeffery 撰写的 <a href="https://travisjeffery.com/b/2019/11/i-ll-take-pkg-over-internal/" target="_blank" rel="noopener noreferrer"><code v-pre>I'll take pkg over internal</code><ExternalLinkIcon/></a> 博客文章提供了 <code v-pre>pkg</code> 和 <code v-pre>internal</code> 目录的一个很好的概述，以及什么时候使用它们是有意义的。</p>
<p>当根目录包含大量非 Go 组件和目录时，这也是一种将 Go 代码分组到一个位置的方法，这使得运行各种 Go 工具变得更加容易（正如在这些演讲中提到的那样: 来自 GopherCon EU 2018 的 <a href="https://www.youtube.com/watch?v=PTE4VJIdHPg" target="_blank" rel="noopener noreferrer"><code v-pre>Best Practices for Industrial Programming</code><ExternalLinkIcon/></a> , <a href="https://www.youtube.com/watch?v=oL6JBUk6tj0" target="_blank" rel="noopener noreferrer">GopherCon 2018: Kat Zien - How Do You Structure Your Go Apps<ExternalLinkIcon/></a> 和 <a href="https://www.youtube.com/watch?v=3gQa1LWwuzk" target="_blank" rel="noopener noreferrer">GoLab 2018 - Massimiliano Pippi - Project layout patterns in Go<ExternalLinkIcon/></a> ）。</p>
<p>如果你想查看哪个流行的 Go 存储库使用此项目布局模式，请查看 <a href="https://github.com/golang-standards/project-layout/blob/master/pkg/README.md" target="_blank" rel="noopener noreferrer"><code v-pre>/pkg</code><ExternalLinkIcon/></a> 目录。这是一种常见的布局模式，但并不是所有人都接受它，一些 Go 社区的人也不推荐它。</p>
<p>如果你的应用程序项目真的很小，并且额外的嵌套并不能增加多少价值(除非你真的想要:-)，那就不要使用它。当它变得足够大时，你的根目录会变得非常繁琐时(尤其是当你有很多非 Go 应用组件时)，请考虑一下。</p>
</li>
<li>
<p><strong>/vendor</strong></p>
<p>应用程序依赖项(手动管理或使用你喜欢的依赖项管理工具，如新的内置 <a href="https://github.com/golang/go/wiki/Modules" target="_blank" rel="noopener noreferrer"><code v-pre>Go Modules</code><ExternalLinkIcon/></a> 功能)。<code v-pre>go mod vendor</code> 命令将为你创建 <code v-pre>/vendor</code> 目录。请注意，如果未使用默认情况下处于启用状态的 Go 1.14，则可能需要在 <code v-pre>go build</code> 命令中添加 <code v-pre>-mod=vendor</code> 标志。</p>
<p>如果你正在构建一个库，那么不要提交你的应用程序依赖项。</p>
<p>注意，自从 <a href="https://golang.org/doc/go1.13#modules" target="_blank" rel="noopener noreferrer"><code v-pre>1.13</code><ExternalLinkIcon/></a> 以后，Go 还启用了模块代理功能(默认使用 <a href="https://proxy.golang.org/" target="_blank" rel="noopener noreferrer"><code v-pre>https://proxy.golang.org</code><ExternalLinkIcon/></a> 作为他们的模块代理服务器)。在<a href="https://blog.golang.org/module-mirror-launch" target="_blank" rel="noopener noreferrer"><code v-pre>here</code><ExternalLinkIcon/></a> 阅读更多关于它的信息，看看它是否符合你的所有需求和约束。如果需要，那么你根本不需要 <code v-pre>vendor</code> 目录。</p>
<p>国内模块代理功能默认是被墙的，七牛云有维护专门的的<a href="https://github.com/goproxy/goproxy.cn/blob/master/README.zh-CN.md" target="_blank" rel="noopener noreferrer"><code v-pre>模块代理</code><ExternalLinkIcon/></a> 。</p>
</li>
<li>
<p><strong>/api</strong></p>
<p>OpenAPI/Swagger 规范，JSON 模式文件，协议定义文件。</p>
</li>
<li>
<p><strong>/web</strong></p>
<p>特定于 Web 应用程序的组件:静态 Web 资产、服务器端模板和 SPAs。</p>
</li>
<li>
<p><strong>/configs</strong></p>
<p>配置文件模板或默认配置。</p>
<p>将你的 <code v-pre>confd</code> 或 <code v-pre>consul-template</code> 模板文件放在这里。</p>
</li>
<li>
<p><strong>/init</strong></p>
<p>System init（systemd，upstart，sysv）和 process manager/supervisor（runit，supervisor）配置。</p>
</li>
<li>
<p><strong>/scripts</strong></p>
<p>执行各种构建、安装、分析等操作的脚本</p>
<p>这些脚本保持了根级别的Makefile变得小而简单</p>
<p>(<a href="https://github.com/hashicorp/terraform/blob/master/Makefile" target="_blank" rel="noopener noreferrer"><code v-pre>https://github.com/hashicorp/terraform/blob/master/Makefile</code><ExternalLinkIcon/></a>)</p>
</li>
<li>
<p><strong>/build</strong></p>
<p>打包和持续集成。</p>
<p>将你的云(AMI)、容器(Docker)、操作系统(deb\rpm\pkg)包配置和脚本放在 <code v-pre>/build/package</code></p>
</li>
<li>
<p><strong>/deployments</strong></p>
<p>IaaS、PaaS、系统和容器编排部署配置和模板(docker-compose、kubernetes/helm、mesos、terraform、bosh)。注意，在一些存储库中(特别是使用 kubernetes 部署的应用程序)</p>
</li>
<li>
<p><strong>/test</strong></p>
<p>额外的外部测试应用程序和测试数据。可以随时根据需求构造/test目录。对于较大的项目，可以搭建一个数据子目录。例如 <code v-pre>/test/data</code>，如果需要忽略目录中的文件，可以使用以“.”或者“_”开头的目录或者文件，Go会忽略这些文件。</p>
</li>
<li>
<p><strong>/docs</strong></p>
<p>设计和用户文档（除了 godoc生成的文档之外）</p>
</li>
<li>
<p><strong>/tools</strong></p>
<p>这个项目的支持工具。notice：这些工具可以从 <code v-pre>/pkg</code> 和 <code v-pre>/internal</code> 目录导入代码</p>
</li>
<li>
<p><strong>/example</strong></p>
<p>你的应用程序和或者公共库的示例</p>
</li>
<li>
<p><strong>/third_party</strong>（第三方支持，例如插件）</p>
<p>外部辅助工具、分叉代码和其他第三方工具（例如 Swagger UI）</p>
</li>
<li>
<p><strong>/githooks</strong></p>
<p>Git hooks</p>
</li>
<li>
<p><strong>/assets</strong></p>
<p>和存储库一起使用的其他资产（图像、徽标等）</p>
</li>
<li>
<p><strong>/website</strong></p>
<p>如果不使用Github页面，则在这里放置项目的网站数据。</p>
<hr>
<p>不应该拥有的目录</p>
<p><strong>/src</strong></p>
</li>
</ul>
</div></template>


