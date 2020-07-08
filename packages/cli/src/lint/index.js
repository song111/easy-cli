export default (cli) => {
  cli.register(
    'lint [files...]',
    'eslint 检查代码',
    (yargs) => {
      yargs
        .positional('files', {
          type: 'string',
          default: ['.'],
          describe: '文件或目录'
        })
        .option('ext', {
          alias: 'e',
          type: 'array',
          default: ['.js', '.jsx'],
          requiresArg: true,
          coerce: (val) => val.join(',').split(','),
          describe: '需要检测的文件扩展名，多个使用","号分割'
        })
        .option('fix', {
          alias: 'f',
          type: 'boolean',
          default: false,
          describe: '自动修复 eslint 错误'
        });
    },
    (argv) => {
      require('./lint')(cli, argv);
    }
  );
};
