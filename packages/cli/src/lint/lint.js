import { CLIEngine } from 'eslint';
import path from 'path';
import { logger } from '@chrissong/cli-utils';

export default (cli, argv) => {
  debugger
  const eslintCli = new CLIEngine({
    fix: argv.fix,
    extensions: argv.ext,
    cwd: cli.root
  });

  const report = eslintCli.executeOnFiles(argv.files.map((file) => path.resolve(cli.cwd, file)));
  // 自动修复
  if (argv.fix) CLIEngine.outputFixes(report);
  // 告警
  if (report.errorCount || report.warningCount) {
    // 错误警告太多就用stylish显示
    const formatter = report.errorCount + report.warningCount > 30 ? 'stylish' : 'codeframe';
    logger.log(cli.getFormatter(formatter)(report.results));
    cli.exit(1);
  }
};
