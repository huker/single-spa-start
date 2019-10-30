## 微前端框架实现练习知识点

> 根据百度张亚涛老师的教程 https://segmentfault.com/a/1190000020832808

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