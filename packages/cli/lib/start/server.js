"use strict";

var _cliWebpack = require("@chrissong/cli-webpack");

var _cliUtils = require("@chrissong/cli-utils");

// 先设置环境变量，以便在配置文件中使用
//  加载环境变量
(0, _cliUtils.loadEnv)(process.cwd());
const env = Object.assign(process.env, {
  CMD: 'start',
  NODE_ENV: 'development',
  BABEL_ENV: 'development'
});
(0, _cliWebpack.start)({
  env: env,
  argv: process.argv.slice(2),
  context: process.cwd(),
  easyConfig: (0, _cliUtils.getEasyConfig)(process.cwd())
}).catch(err => {
  _cliUtils.logger.log(err);

  process.send('EXIT_WITH_ERROR');
});
//# sourceMappingURL=server.js.map