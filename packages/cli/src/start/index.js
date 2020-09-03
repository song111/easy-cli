import command from './command';

export default (cli) => {
  cli.register(...command, (argv) => {
    require('./start.js')(cli, argv);
  });
};
