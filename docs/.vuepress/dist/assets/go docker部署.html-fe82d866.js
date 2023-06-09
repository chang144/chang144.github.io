import{_ as e,o as n,c as i,e as d}from"./app-f1c34f66.js";const s={},l=d(`<h1 id="使用docker-以及docker-compose部署go程序" tabindex="-1"><a class="header-anchor" href="#使用docker-以及docker-compose部署go程序" aria-hidden="true">#</a> 使用Docker 以及Docker Compose部署Go程序</h1><h2 id="为什么需要docker" tabindex="-1"><a class="header-anchor" href="#为什么需要docker" aria-hidden="true">#</a> 为什么需要docker</h2><blockquote><p>使用docker的主要目标是其容器化。可以为应用程序提供一致的环境，而不依赖它运行的主机</p></blockquote><h3 id="部署示例" tabindex="-1"><a class="header-anchor" href="#部署示例" aria-hidden="true">#</a> 部署示例</h3><h4 id="_1-准备代码" tabindex="-1"><a class="header-anchor" href="#_1-准备代码" aria-hidden="true">#</a> 1.准备代码</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>package main

import (
	&quot;fmt&quot;
	&quot;net/http&quot;
)

func main() {
	http.HandleFunc(&quot;/&quot;, hello)
	server := &amp;http.Server{
		Addr: &quot;:8888&quot;,
	}
  fmt.Println(&quot;server startup...&quot;)
	if err := server.ListenAndServe(); err != nil {
		fmt.Printf(&quot;server startup failed, err:%v\\n&quot;, err)
	}
}

func hello(w http.ResponseWriter, _ *http.Request) {
	w.Write([]byte(&quot;hello liwenzhou.com!&quot;))
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里是简单代码</p><h4 id="_2-创建docker镜像" tabindex="-1"><a class="header-anchor" href="#_2-创建docker镜像" aria-hidden="true">#</a> 2.创建Docker镜像</h4><blockquote><p>镜像(image)包含运行应用程序所需的所有东西——代码/二进制文件、运行时、依赖项以及所需的任何其它人间系统对象</p></blockquote><p>简单讲，镜像是定义应用程序以及运行所需的一切</p><h4 id="_3-编写dockerfile" tabindex="-1"><a class="header-anchor" href="#_3-编写dockerfile" aria-hidden="true">#</a> 3.编写Dockerfile</h4><p>要创建Docker镜像(image)必须在配置文件中的指定步骤，这个文件默认称为<code>Dockerfile</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>FROM golang:alpine

# 为我们的镜像设置必要的环境变量
ENV GO111MODULE=on \\
    CGO_ENABLED=0 \\
    GOOS=linux \\
    GOARCH=amd64

# 移动到工作目录：/build
WORKDIR /build

# 将代码复制到容器中
COPY . .

# 将我们的代码编译成二进制可执行文件app
RUN go build -o app .

# 移动到用于存放生成的二进制文件的 /dist 目录
WORKDIR /dist

# 将二进制文件从 /build 目录复制到这里
RUN cp /build/app .

# 声明服务端口
EXPOSE 8888

# 启动容器时运行的命令
CMD [&quot;/dist/app&quot;]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-dockerfile解析" tabindex="-1"><a class="header-anchor" href="#_4-dockerfile解析" aria-hidden="true">#</a> 4.Dockerfile解析</h4><ul><li><strong>From</strong></li></ul><p>使用了基础镜像 <code>golang:alpine</code>来创建镜像。这个镜像运行的是alpine Linux发行版，该发行版的大小很小并内置了Go。有大量公开可用的Docker镜像，请查看https://hub.docker.com/_/golang</p><ul><li>Env</li></ul><p>用来设置编译阶段需要的环境变量</p><ul><li>WORKDIR,COPY,RUN</li><li>EXPORT,CMD</li></ul><p>声明服务端口，应用程序监听这个端口并通过这个端口对外提供服务。还定义了运行镜像执行的默认执行命令<code>CMD [&quot;/dist/app&quot;]</code></p><h3 id="构建镜像" tabindex="-1"><a class="header-anchor" href="#构建镜像" aria-hidden="true">#</a> 构建镜像</h3><p>在项目目录下面，在终端输入下面的命令创建镜像，并指定镜像名称为<code>go_app</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker build . -t go_app
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>等待构建结束，输出 <code>Successfully</code></p><p>等输出 <code>Successfully</code>后，此时镜像已经准备好了，但是目前什么项目都没有，需要运行下面的代码来运行镜像。注：<strong>运行中的镜像称为镜像</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker run -p 8888:8888 go_app
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>标志位<code>-p</code>来定义端口绑定，由于容器中的应用程序在端口8888上运行，这里绑定的主机端口也是8888。如果要绑定另一个端口，则可以使用 <code>-p $HOST_PORT:8888</code></p><p>到这里就可以测试我们的程序是否工作正常，打开 http://127.0.0.1:8888 查看事先定义的响应内容。</p><h3 id="分阶段构建示例" tabindex="-1"><a class="header-anchor" href="#分阶段构建示例" aria-hidden="true">#</a> 分阶段构建示例</h3><p>Go程序编译之后可得到一个可执行的二进制文件，在最终的镜像中不需要go编译器，也就是说我们只需要一个运行最终二进制文件的容器即可。</p><p>Docker的最佳实践之一是通过仅保留二进制文件来减小镜像大小，为此，我们将使用一种称为多阶段构建的技术</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>FROM golang:alpine AS builder

# 为我们的镜像设置必要的环境变量
ENV GO111MODULE=on \\
    CGO_ENABLED=0 \\
    GOOS=linux \\
    GOARCH=amd64

# 移动到工作目录：/build
WORKDIR /build

# 将代码复制到容器中
COPY . .

# 将我们的代码编译成二进制可执行文件 app
RUN go build -o app .

###################
# 接下来创建一个小镜像
###################
FROM scratch

# 从builder镜像中把/dist/app 拷贝到当前目录
COPY --from=builder /build/app /

# 需要运行的命令
ENTRYPOINT [&quot;/app&quot;]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用这种技术，我们剥离了使用<code>golang:alpine</code>作为编译镜像来编译得到二进制可执行文件的过程，并基于<code>scratch</code>生成一个简单的、非常小的新镜像。我们将二进制文件从命名为<code>builder</code>的第一个镜像中复制到新创建的<code>scratch</code>镜像中。有关scratch镜像的更多信息，请查看https://hub.docker.com/_/scratch</p><h3 id="附带其他文件的部署示例" tabindex="-1"><a class="header-anchor" href="#附带其他文件的部署示例" aria-hidden="true">#</a> 附带其他文件的部署示例</h3><p>web项目(前后端不分离)一般会有静态文件或者配置文件，需要拷贝到最终的镜像文件中</p><p>例如 <code>templates</code> | <code>static</code> | <code>conf</code> 三个文件的内容拷贝到镜像文件中</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>FROM golang:alpine AS builder

# 为我们的镜像设置必要的环境变量
ENV GO111MODULE=on \\
    CGO_ENABLED=0 \\
    GOOS=linux \\
    GOARCH=amd64

# 移动到工作目录：/build
WORKDIR /build

# 复制项目中的 go.mod 和 go.sum文件并下载依赖信息
COPY go.mod .
COPY go.sum .
RUN go mod download

# 将代码复制到容器中
COPY . .

# 将我们的代码编译成二进制可执行文件 bubble
RUN go build -o bubble .

###################
# 接下来创建一个小镜像
###################
FROM scratch

COPY ./templates /templates
COPY ./static /static
COPY ./conf /conf

# 从builder镜像中把/dist/app 拷贝到当前目录
COPY --from=builder /build/bubble /

# 需要运行的命令
ENTRYPOINT [&quot;/bubble&quot;, &quot;conf/config.ini&quot;]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Tips：</strong> 这里把COPY静态文件的步骤放在上层，把COPY二进制可执行文件放在下层，争取多使用缓存。</p><h3 id="关联其他容器" tabindex="-1"><a class="header-anchor" href="#关联其他容器" aria-hidden="true">#</a> 关联其他容器</h3><p>项目中使用了MySQL，可以选择使用如下命令启动一个MySQL容器，它的别名为<code>mysql8019</code>；root用户的密码为<code>root1234</code>；挂载容器中的<code>/var/lib/mysql</code>到本地的<code>/Users/docker/mysql</code>目录；内部服务端口为3306，映射到外部的13306端口。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker run --name mysql8019 -p 13306:3306 -e MYSQL_ROOT_PASSWORD=root1234 -v /Users/q1mi/docker/mysql:/var/lib/mysql -d mysql:8.0.19
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这里需要修改一下我们程序中配置的MySQL的host地址为容器别名，使它们在内部通过别名（此处为mysql8019）联通。</p><div class="language-ini line-numbers-mode" data-ext="ini"><pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">mysql</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">user</span> <span class="token punctuation">=</span> <span class="token value attr-value">root</span>
<span class="token key attr-name">password</span> <span class="token punctuation">=</span> <span class="token value attr-value">root1234</span>
<span class="token key attr-name">host</span> <span class="token punctuation">=</span> <span class="token value attr-value">mysql8019</span>
<span class="token key attr-name">port</span> <span class="token punctuation">=</span> <span class="token value attr-value">3306</span>
<span class="token key attr-name">db</span> <span class="token punctuation">=</span> <span class="token value attr-value">bubble</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改后记得重新构建<code>bubble_app</code>镜像：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> build <span class="token builtin class-name">.</span> <span class="token parameter variable">-t</span> bubble_app
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>我们这里运行<code>bubble_app</code>容器的时候需要使用<code>--link</code>的方式与上面的<code>mysql8019</code>容器关联起来，具体命令如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">--link</span><span class="token operator">=</span>mysql8019:mysql8019 <span class="token parameter variable">-p</span> <span class="token number">8888</span>:8888 bubble_app
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="docker-compose模式" tabindex="-1"><a class="header-anchor" href="#docker-compose模式" aria-hidden="true">#</a> Docker Compose模式</h3><p>除了像上面一样使用<code>--link</code>的方式来关联两个容器之外，我们还可以使用<code>Docker Compose</code>来定义和运行多个容器。</p><p><code>Compose</code>是用于定义和运行多容器 Docker 应用程序的工具。通过 Compose，你可以使用 YML 文件来配置应用程序需要的所有服务。然后，使用一个命令，就可以从 YML 文件配置中创建并启动所有服务。</p><p>使用Compose基本上是一个三步过程：</p><ol><li>使用<code>Dockerfile</code>定义你的应用环境以便可以在任何地方复制。</li><li>定义组成应用程序的服务，<code>docker-compose.yml</code> 以便它们可以在隔离的环境中一起运行。</li><li>执行 <code>docker-compose up</code>命令来启动并运行整个应用程序。</li></ol><p>我们的项目需要两个容器分别运行<code>mysql</code>和<code>bubble_app</code>，我们编写的<code>docker-compose.yml</code>文件内容如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># yaml 配置
version: &quot;3.7&quot;
services:
  mysql8019:
    image: &quot;mysql:8.0.19&quot;
    ports:
      - &quot;33061:3306&quot;
    command: &quot;--default-authentication-plugin=mysql_native_password --init-file /data/application/init.sql&quot;
    environment:
      MYSQL_ROOT_PASSWORD: &quot;root1234&quot;
      MYSQL_DATABASE: &quot;bubble&quot;
      MYSQL_PASSWORD: &quot;root1234&quot;
    volumes:
      - ./init.sql:/data/application/init.sql
  bubble_app:
    build: .
    command: sh -h &quot;./wait-for.sh mysql8019:3306 -- ./bubble ./conf/config.ini&quot;
    depends_on:
      - mysql8019
    ports:
      - &quot;8888:8888&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个 Compose 文件定义了两个服务：<code>bubble_app</code> 和 <code>mysql8019</code>。其中：</p><h5 id="bubble-app" tabindex="-1"><a class="header-anchor" href="#bubble-app" aria-hidden="true">#</a> bubble_app</h5><p>使用当前目录下的<code>Dockerfile</code>文件构建镜像，并通过<code>depends_on</code>指定依赖<code>mysql8019</code>服务，声明服务端口8888并绑定对外8888端口。</p><h5 id="mysql8019" tabindex="-1"><a class="header-anchor" href="#mysql8019" aria-hidden="true">#</a> mysql8019</h5><p>mysql8019 服务使用 Docker Hub 的公共 mysql:8.0.19 镜像，内部端口3306，外部端口33061。</p><p>这里需要注意一个问题就是，我们的<code>bubble_app</code>容器需要等待<code>mysql8019</code>容器正常启动之后再尝试启动，因为我们的web程序在启动的时候会初始化MySQL连接。这里共有两个地方要更改，第一个就是我们<code>Dockerfile</code>中要把最后一句注释掉：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># Dockerfile
...
# 需要运行的命令（注释掉这一句，因为需要等MySQL启动之后再启动我们的Web程序）
# ENTRYPOINT [&quot;/bubble&quot;, &quot;conf/config.ini&quot;]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二个地方是在<code>bubble_app</code>下面添加如下命令，使用提前编写的<code>wait-for.sh</code>脚本检测<code>mysql8019:3306</code>正常后再执行后续启动Web应用程序的命令：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>command: sh -h &quot;./wait-for.sh mysql8019:3306 -- ./bubble ./conf/config.ini&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>当然，因为我们现在要在<code>bubble_app</code>镜像中执行sh命令，所以不能在使用<code>scratch</code>镜像构建了，这里改为使用<code>debian:stretch-slim</code>，同时还要安装<code>wait-for.sh</code>脚本用到的<code>netcat</code>，最后不要忘了把<code>wait-for.sh</code>脚本文件COPY到最终的镜像中，并赋予可执行权限哦。更新后的<code>Dockerfile</code>内容如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>FROM golang:alpine AS builder

# 为我们的镜像设置必要的环境变量
ENV GO111MODULE=on \\
    CGO_ENABLED=0 \\
    GOOS=linux \\
    GOARCH=amd64

# 移动到工作目录：/build
WORKDIR /build

# 复制项目中的 go.mod 和 go.sum文件并下载依赖信息
COPY go.mod .
COPY go.sum .
RUN go mod download

# 将代码复制到容器中
COPY . .

# 将我们的代码编译成二进制可执行文件 bubble
RUN go build -o bubble .

###################
# 接下来创建一个小镜像
###################
FROM debian:stretch-slim

COPY ./wait-for.sh /
COPY ./templates /templates
COPY ./static /static
COPY ./conf /conf


# 从builder镜像中把/dist/app 拷贝到当前目录
COPY --from=builder /build/bubble /

RUN set -eux; \\
	apt-get update; \\
	apt-get install -y \\
		--no-install-recommends \\
		netcat; \\
        chmod 755 wait-for.sh

# 需要运行的命令
# ENTRYPOINT [&quot;/bubble&quot;, &quot;conf/config.ini&quot;]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所有的条件都准备就绪后，就可以执行下面的命令跑起来了：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker-compose</span> up
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,67),a=[l];function c(r,o){return n(),i("div",null,a)}const u=e(s,[["render",c],["__file","go docker部署.html.vue"]]);export{u as default};
