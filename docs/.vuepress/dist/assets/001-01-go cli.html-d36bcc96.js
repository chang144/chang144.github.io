import{_ as a,r as i,o as s,c as n,a as e,b as o,d as t,e as c}from"./app-dc2a6862.js";const r={},d=c(`<h1 id="_001-01-go-命令行程序" tabindex="-1"><a class="header-anchor" href="#_001-01-go-命令行程序" aria-hidden="true">#</a> 001 - 01 -Go 命令行程序</h1><p>命令行接口（Command Line Interface，简称CLI）程序是一种允许用户使用文本命令和参数于计算机系统互动的软件。</p><p>通常CLI程序有以下使用场景：</p><ul><li>自动化脚本</li><li>数据处理</li><li>系统管理</li><li>其它需要低级控制和灵活性的任务上</li></ul><h2 id="_1-准备go语言环境-缺省" tabindex="-1"><a class="header-anchor" href="#_1-准备go语言环境-缺省" aria-hidden="true">#</a> 1.准备GO语言环境（缺省）</h2><p>？？？？？？</p><h2 id="_2-设计用户接口" tabindex="-1"><a class="header-anchor" href="#_2-设计用户接口" aria-hidden="true">#</a> 2.设计用户接口</h2><p>编写一个好的CLI程序，最重要的是设计一个<strong>用户友好的接口</strong>。好的命令行用户接口应该是一致的、直观的、和富有表现力的。</p><p><strong>设计需求</strong>：</p><ol><li>为命令行程序命名</li><li>选择命令结构（command structure）</li><li>如何使用标志（flag）</li><li>参数（args）</li><li>子命令（subcommand）</li><li>选项（option）作为输入参数</li></ol><p>将使用<code>cobra</code>或者<code>kingpin</code>等解析和验证用户输入</p><blockquote><p>了解CLI程序的命令结构</p><p>A. 一个带有多个标志（flag）和参数（args）的单一命令（such as：curl、tar、grep...）</p><p>B. 带有多个子命令（subcommand）的单一命令（such as：git、docker、kubectl...）</p><p>C. 具有共同前缀的多个命令（such as：aws s3、gcloud compute、az vm...)</p></blockquote><p>了解完CLI程序的命令结构后，我们需要知道怎么为我们的程序选择合适的命令结构：</p><ul><li>当程序只有一个主要功能或操作模式（operation modes）时，可选择A</li><li>当程序有多个相关但又不同的功能或者操作时，可选择B</li><li>当程序有多个不相关或独立的功能或操作模式，可选择C</li></ul><p><strong>使用标志、参数、子命令和选项</strong></p><ul><li>flag--<strong>标志</strong>是一个或多个（通常是2个）中划线<code>-</code>开头的输出参数，它可以修改CLI程序的行为或输出</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-o</span> output.text https://example.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>args--<strong>参数</strong>是不以中划线<code>-</code>开头的输入参数，为CLI程序提供额外的信息或数据</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">tar</span> xvf archive.tar.gz
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>subcommand--<strong>子命令</strong>是输入参数，作为主命令下的辅助命令，通常子命令有自己的一组标志和参数</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;Initial commit&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>option--<strong>选项</strong>是输入参数，它可以使用使用等号<code>=</code>将标志和参数合并作为一个参数</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">--name</span><span class="token operator">=</span>my-container ubuntu:latest
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>使用cobra包构建命令行程序</strong></p><p><code>cobra</code>是一个Go包，它提供了简单的接口来创建强大的CLI程序。支持子命令、标志、参数、选项、环境变量和配置文件。与此同时，<code>cobra</code>可以很好地与其他库集成，比如：<code>viper</code>（用于配置管理）、<code>pflag</code>（用于POSIX/GNU风格的标志）和<code>Docopt</code>（用于生成文档）</p><p><strong>POSIX惯例和GNU扩展的CLI语法</strong></p><ul><li>单字母标志(single-letter flag)以一个中划线（-）开始，可以组合在一起（例如：-a -b -c 或 -abc )</li><li>长标志(long flag)以两个中划线（--）开头，但不能组合在一起（例如：--all、--backup、--color )</li><li>选项使用等号(=)来分隔标志名和参数值(例如：--name=my-container )</li><li>参数跟在标志或选项之后，没有任何分隔符（例如：curl -o output.txt https://example.com ）。</li><li>子命令跟在主命令之后，没有任何分隔符（例如：git commit -m &quot;Initial commit&quot; )</li><li>一个双中划线（--）表示标志或选项的结束和参数的开始（例如：rm -- -f 表示要删除“-f”这个文件，由于双破折线的存在，这里的“-f”不再是标志)</li></ul><h2 id="_3-处理错误和信号" tabindex="-1"><a class="header-anchor" href="#_3-处理错误和信号" aria-hidden="true">#</a> 3.处理错误和信号</h2><p>编写好的CLI程序的一个重要环节是<strong>优雅处理错误和信号</strong></p><ol><li>使用<code>log</code>,<code>fmt</code>,<code>errors</code>包进行日志处理和错误处理</li><li>使用<code>os.Exit</code>和<code>defer</code>语句实现CLI程序的优雅终止</li><li>使用<code>os.signal</code>和<code>context</code>包来实现中断和取消操作</li></ol><p><strong>CLI程序的退出状态代码惯例</strong></p><p>主要的约定和扩展如下：。</p><ul><li>退出状态代码为0表示程序执行成功（例如：os.Exit(0) )</li><li>非零的退出状态代码表示失败（例如：os.Exit(1) ）。</li><li>不同的非零退出状态代码可能表示不同的失败类型或原因（例如：os.Exit(2)表示使用错误，os.Exit(3)表示权限错误等等）。</li><li>大于125的退出状态代码可能表示被外部信号终止（例如，os.Exit(130)为被信号中断）。</li></ul><h2 id="_4-编写文档" tabindex="-1"><a class="header-anchor" href="#_4-编写文档" aria-hidden="true">#</a> 4.编写文档</h2><ol><li><p>为CLI程序写一个清晰简洁的README文件</p><ul><li>使用一个描述性的、醒目的标题，反映你的程序的目的和功能。</li><li>提供一个简短的介绍，解释你的程序是做什么的，为什么它是有用的或独特的。</li><li>包括一个usage部分，说明如何用不同的标志、参数、子命令和选项来调用你的程序。你可以使用代码块或屏幕截图来说明这些例子。</li><li>包括一个安装(install)部分，解释如何在不同的平台上下载和安装你的程序。你可以使用go install、go get、<strong>goreleaser</strong>[24]或其他工具来简化这一过程。</li><li>指定你的程序的发行许可，并提供一个许可全文的链接。你可以使用<strong>SPDX标识符</strong>[25]来表示许可证类型。</li><li>为想要报告问题、请求新功能、贡献代码或提问的用户或开发者提供联系信息。你可以使用github issue、pr、discussion、电子邮件或其他渠道来达到这个目的。</li></ul></li><li><p>为CLI程序编写有用的<strong>usage</strong>和<strong>help</strong>标志</p></li></ol><p>usage信息是一段简短的文字，总结了如何使用你的程序以及可用的标志、参数、子命令和选项。</p><p>help标志是一个特殊的标志（通常是<code>-h</code>或<code>-help</code>），它可以触发显示使用信息和一些关于你的程序的额外信息</p><p>编写CLI程序的有用信息usage和help标志，应该遵循一些准则：</p><ul><li>使用一致而简洁的语法来描述标志、参数、子命令和选项。你可以用方括号“[ ]”表示可选元素，使用角括号“&lt; &gt;”表示必需元素，使用省略号“...”表示重复元素，使用管道“|”表示备选，使用中划线“-”表示标志(flag)，使用等号“=”表示标志的值等等。</li><li>对标志、参数、子命令和选项应使用描述性的名称，以反映其含义和功能。避免使用单字母名称，除非它们非常常见或非常直观（如-v按惯例表示verbose模式）。</li><li>为每个标志、参数、子命令和选项提供简短而清晰的描述，解释它们的作用以及它们如何影响你的程序的行为。你可以用圆括号“（ ）”来表达额外的细节或例子。</li><li>使用标题或缩进将相关的标志、参数、子命令和选项组合在一起。你也可以用空行或水平线（---）来分隔usage的不同部分。</li><li>在每组中按名称的字母顺序排列标志。在每组中按重要性或逻辑顺序排列参数。在每组中按使用频率排列子命令。</li></ul><h2 id="_5-测试和发布cli程序" tabindex="-1"><a class="header-anchor" href="#_5-测试和发布cli程序" aria-hidden="true">#</a> 5.测试和发布CLI程序</h2><p>编写一个优秀的CLI程序的最后一个环节是测试和发布CLI程序</p><p>使用<code>testing</code>、<code>testify/assert</code>、<code>mock</code>包对CLI的代码进行单元测试，使用<code>go test</code>、<code>coverage</code>、<code>benchmark</code>工具来运行和测试程序性能以及使用<code>goreleaser</code>包来构建跨平台的二进制文件</p><ol><li>使用testing、testify的assert及mock包对你的代码进行单元测试</li><li>使用Go的测试、覆盖率、性能基准工具来运行测试和测量性能</li></ol>`,43),p={href:"https://tonybai.com/2023/03/25/the-guide-of-developing-cli-program-in-go/",target:"_blank",rel:"noopener noreferrer"};function u(g,h){const l=i("ExternalLinkIcon");return s(),n("div",null,[d,e("blockquote",null,[e("p",null,[o("learn from："),e("a",p,[o("Go开发命令行程序指南 | Tony Bai"),t(l)])])])])}const b=a(r,[["render",u],["__file","001-01-go cli.html.vue"]]);export{b as default};