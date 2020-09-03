# @chrissong/cli

> 脚手架工具的命令部分，基于 yargs 实现命令参数获取，初始化脚手架工具，调用功能函数或插件

## 完整配置

```js
module.exports = {
  pages: {
    index: {
      entry: './src/index.js',
      template: './public/index.html',
      hash: true
    }
  },
  alias: {
    public: './public',
    src: './src'
  },
  proxy: {
      
  },
  chainWebpack: (config) => {}
};
```
