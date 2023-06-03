import {defaultTheme, defineUserConfig} from 'vuepress'

export default defineUserConfig({
    lang: 'zh-CN',
    title: '"hello"',
    description: '这是我的第一个 VuePress 站点',

    theme: defaultTheme({
        home: '/',
        repo: 'chang144/chang144.github.io',
        repoLabel: '',
        lastUpdated: true,

        // 默认主题配置
        navbar: [
            { text: '首页', link: '/',},
            { text: '导航', link: '/guide/',},
            {   text: '计算机基础',
                children: [
                    {
                        text: '计网',
                        children: [
                            { text: '基础篇', link: '/basic/network/01-basic'},
                            { text: 'HTTP', link: '/basic/network/02-http'},
                            { text: 'TCP', link: '/basic/network/03-tcp'},
                            { text: 'IP', link: '/basic/network/04-ip'},
                        ],
                    },
                    {
                        text: '数据库',
                        children: [
                            { text: 'mysql', link: '/basic/db/mysql/',},
                            { text: 'redis', link: '/basic/db/redis/',}
                        ],

                    },
                    {
                        text: '操作系统',
                        children:[

                        ],
                        // link: "/basic/linux/"
                    },
                ],
                link: '/basic/',
            },
            {
                text: '算法',
                children: [
                    {text: '数组', link: ''}
                ]
            },
            {
                text: "后端",
                children: [
                    {text: "Go", link: "/backend/Golang/"},
                ],
            },
            {
                text: '部署',
                children: [
                    {text: 'docker', link: '/deploy/docker/'},
                    {text: 'k8s', link: '/deploy/k8s/'},
                ]
            },
            {
              text: '八股',
              children: [
                  {text: 'golang', link: '/eight/golang/'}
              ]
            },
        ],
        // 可折叠的侧边栏
        sidebar: {
            '/guide/': [
                {
                    text: 'Guide',
                    link: '/guide/',
                },
            ],
            '/basic/network/': [
                {
                    text: '计算机网络',
                    children: [
                        {
                            text: '计算机网络 - 基础篇',
                            children: [
                                '/basic/network/01-basic/01-TCP&IP网络模型有几层.md',
                                '/basic/network/01-basic/02-键入网址到网页显示，期间发送了什么.md',
                            ],
                            link: '/basic/network/01-basic'
                        },
                        {
                            text: '计算机网络 - http篇',
                            children: [],
                            link: '/basic/network/02-http'
                        },
                        {
                            text: '计算机网络 - tcp篇',
                            children: [],
                            link: '/basic/network/03-tcp'
                        },
                        {
                            text: '计算机网络 - ip篇',
                            children: [],
                            link: '/basic/network/04-ip'
                        },
                    ]
                }
            ],
            '/basic/db/': [
                {
                    text: 'MySQL',
                    children: [
                        {
                            text: '0001 - 基础',
                            children: [
                                '/basic/db/mysql/0001-基础/执行select语句，期间发生了什么.md',
                            ],
                            // link: '/basic/db/mysql/'
                        }
                    ],
                    link: '/basic/db/mysql/'
                },
                {
                    text: 'Redis',
                    children: [

                    ],
                    link: '/basic/db/redis/'
                }
            ],
            '/backend/': [
                {
                    text: 'Golang',
                    collapsible: true,
                    children: [
                        '/backend/Golang/001-go命令行操作.md',
                        '/backend/Golang/go cli.md',
                        '/backend/Golang/Go Project Layout.md'
                    ],
                },
            ],
            '/deploy/': [
                {
                    text: 'docker',
                    collapsible: true,
                    children: [
                        '/deploy/docker/docker.md',
                        '/deploy/docker/Dive into Dockerfile.md',
                        '/deploy/docker/go docker部署 .md',
                    ]
                }
            ],
            '/eight/golang/': [
                {
                    text: 'golang',
                    collapsible: false,
                    link: "/eight/golang/README.md",
                }
            ]
        },
        // edit
        editLink: true,
        docsRepo: 'https://github.com/chang144/chang144.github.io',
        docsBranch: 'edit',
        docsDir: 'docs',
        editLinkPattern: ':repo/edit/:branch/:path',
    }),
})


