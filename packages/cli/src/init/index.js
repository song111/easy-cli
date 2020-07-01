export default (cli) => {
  cli.register(
    'init <name>',
    '初始化项目',
    (yargs) => {
      yargs.positional('name', {
        type: 'string',
        describe: '项目名称'
      });
    },
    (argv) => require('./init')(cli, argv)
  );
};
