import ora from 'ora'
import chalk from 'chalk'

const spinner = ora()
let lastMsg = null

export const start = (symbol, msg) => {
  if (!msg) {
    msg = symbol
    symbol = chalk.green('🍺')
  }
  if (lastMsg) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text
    })
  }
  spinner.text = ' ' + msg
  lastMsg = {
    symbol: symbol + ' ',
    text: msg
  }
  spinner.start()
}

export const stop = persist => {
  if (lastMsg && persist !== false) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text
    })
  } else {
    spinner.stop()
  }
  lastMsg = null
}

export const resume = () => {
  spinner.start()
}

export const pause = () => {
  spinner.stop()
}
