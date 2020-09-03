#!/usr/bin/env node

const yargs = require('yargs');
const Cli = require('../lib');
const { logger } = require('@chrissong/cli-utils');

yargs
  .strict(true)
  .scriptName('easy')
  .usage('$0 <命令> [选项]')
  .alias('help', 'h')
  .alias('version', 'v')
  .wrap(null)
  .fail((msg, err, yargs) => {
    yargs.showHelp();
    logger.error(msg);
    logger.error(new Error(err));
    if (err) process.exit(1);
  });

const cli = new Cli(process.cwd());
debugger
cli.parse(process.argv.slice(2));
