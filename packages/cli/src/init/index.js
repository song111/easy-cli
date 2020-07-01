export default (cli) => {
  cli.register(
    'init <name>',
    '初始化项目',
    (yargs) => {
      debugger;
      yargs.positional('name', {
        type: 'string',
        describe: '项目名称'
      });
    },
    (argv) => require('./init')(cli, argv)
  );
};
