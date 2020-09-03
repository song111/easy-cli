# easy-cli
> 基于react,webpack,webpack-chain,nodejs,yargs 的脚手架工具

## 文档目录

- [@chrrissong/cli](./packages/cli/README.md)
- [@chrrissong/cli-utils](./packages/cli-utils/README.md)
- [@chrrissong/cli-webpack](./packages/cli-webpack/README.md)
- [@chrrissong/babel-preset-easy](./packages/babel-preset-easy/README.md)
- [@chrrissong/eslint-config-standard](./packages/eslint-config-standard/README.md)


## 开发

开发合并到develop，发布合并到master分支发布
```bash
clone https://github.com/song111/easy-cli.git 

cd easy-cli 

# 切换到develop分支开发
git checkout develop

# 安装
yarn 

# 编译所有文件，并监听变化
npm run dev

# 打包所有文件
npm run build

# 发布
npm run publish 

```

## 安装使用
```bash
# 全局安装使用
npm i @chrissong/cli -g 

# 在当前目录初始化一个项目,并完成依赖安装
npm init projectName 

# 启动开发服务
cd projectName

npm run start 

# 打包项目
npm run build 
```

## 暂时存在的问题
- ~~开发服务端口号不能用~~  `2020-09-03 17:11`
- eslint 命令未开放
- 代理服务未测试，需要在本地开启第三方服务进行测试
- easy.config.js 配置格式校验，用joi库
- ~~css modules 开启~~       `2020-09-03 17:11`