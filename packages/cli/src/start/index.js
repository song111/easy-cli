export default (cli) => {
  cli.register(
    'start',
    '启动项目开发服务',
    (yargs) => {
      yargs
        .option('open', {
          alias: 'o',
          type: 'boolean',
          default: false,
          describe: '是否自动打开浏览器'
        })
        .option('port', {
          alias: 'p',
          type: 'number',
          default: 3000,
          requiresArg: true,
          describe: '指定 devServer 端口号'
        });
    },
    (argv) => {
      require('./start.js')(cli, argv);
    }
  );
};
