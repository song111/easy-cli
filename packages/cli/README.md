# @chrissong/cli

> 脚手架工具的命令部分，基于 yargs 实现命令参数获取，初始化脚手架工具，调用功能函数或插件

## 完整配置

```js
const { CheckerPlugin } = require('awesome-typescript-loader');

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
  chainWebpack: (config) => {
    config.resolve.extensions.add('.ts').add('.tsx');

    config.module
      .rule('typecript')
      .test(/\.tsx?$/)
      .use('awesome-typescript-loader')
      .loader('awesome-typescript-loader');

    config.plugin('typescript').use(CheckerPlugin);
  },
  proxy: {
    
  }
};
```
