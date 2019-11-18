## 微前端框架练习 知识点记录

> 根据百度张亚涛老师的教程 https://segmentfault.com/a/1190000020832808，抽出一下关键知识点记录下，并附加一些文中没写到的要点，非原创啊只是学习记录

####使用rollup来构建、打包项目

- -c 表示通过配置文件执行rollup
- -w 表示watch
- rollup.config.js的配置和webpack几乎差不多
- output中的format 模块规范 支持cmd之外的所有方式（umd esm amd commonjs systemjs...）

#### 配置browserslist

> 是在不同的前端工具之间共用目标浏览器和 node 版本的配置工具
>
> https://juejin.im/post/5b8cff326fb9a019fd1474d6

在package.json中配置browserslist，babel（babel引入了这个库）就会自动读取当前项目规划的目标浏览器范围。比方说如果一个项目只在chrome中运行的话，就不需要去编译ie的东西了。

```
"ie >=11",
"last 10 Safari major versions", // 大版本
"last 2 version"  //所有浏览器最后的两个版本
">1%" 所有浏览器 使用量>1%的都覆盖

list列表取并集 都覆盖
```

#### 模式、概念

把独立的功能模块抽出来做成单独的应用（插件），外面包裹一个壳子来控制，插件和插件之间是不会通信的，互相不能调用，因为一个插件内是不能知道另一个插件有没有被系统装载过，所以通信都放到外面的壳子来处理。

应用场景：

1.大型应用拆分成多个app（比如百度网盘）

2.把不同应用当成app组合在一起加载（比如不同的应用用的不同的技术栈等）

#### App

为了框架便于管理所有的应用，app要有自己的生命周期 bootstrap`、`mount`、`unmount`、`update

还有app的状态，这个状态不是app内部的，内部只是实现自己的功能，状态是框架里的给app设定的

状态见原文章，记一些原文没写的点

- NOT_LOADED 未加载 代表服务发现了
- LOAD_SOURCE_CODE 加载 比如到cdn下载bundle文件
- 应用的加载、启动只会执行一次 挂载和卸载可以多次
- 挂载MOUNTING->MOUNTED react来说就是render了view 其中如果fullfilled就会进入失败状态 成功就是view已经挂载到页面上了
- 比如路由切换 /home对应app1，/index对应app2，从home切换路由到index时，要先卸载app1，然后加载app2（卸载不需要时间，加载需要时间，所以先卸载再加载可以在中间加个loading状态，体验比较好）
- UNMOUNTING 卸载 react中 ReactDOM.unmountComponentAtNode(element)，组件挂载的element可以通过 ReactDOM.findNode(reactInstance)来获取

#### 路由拦截

微前端中应用分两种：

app：根据Location变化的

service: 纯功能级别的的（比如一个页面里根据不同的文件type，使用了不同的预览器）

由于应用内可能用到路由分发react-router这种，所以Location要在框架中最初拦截下来，第一步处理要给微前端框架。因为切换路由的时候有可能是先卸载后加载app这种，所以先在框架中处理路由也可以避免冗余操作，处理好最终挂载的app然后再把路由放下去给app里面处理。

对原生Location相关事件进行拦截（hijack），监听hashchange/popstate，变化就启动核心程序。重写addEventListener和removeEventListener，因为要优先在框架处理处理完了再去触发原先hijack的（存起来），同时重写pushstate、replacestate等方法，因为history的push replace方法不会触发popstate，只有浏览器前进后退才会。

#### 流程

按教程中的核心流程图

首先通过浏览器触发、手动触发来触发核心程序，每次触发都是一个promise，就像是浏览器事件循环机制一样，一个个promise放到事件队列中，一批处理完（finish）再回来看一下队列里是不是清空了，还有就继续处理，处理中时整个系统会标记一个处理中的状态。新的触发来的时候会看当前是否正在处理中，正在处理则会往队列里push，空闲的话就开始处理。finish之后路由