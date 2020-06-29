const yargs = require('yargs');
const Cli = require('../lib');
const { logger } = require('@chrissong/cli-utils');

yargs
  .strict()
  .scriptName('easy')
  .usage('$0 <命令> [选项]')
  .alias('help', 'h')
  .alias('version', 'v')
  .fail((msg, err, yargs) => {
    yargs.showHelp();
    logger.error(msg);
    if (err) process.exit(1);
  });

const cli = new Cli(process.cwd());

cli.parse(process.argv.slice(2));
