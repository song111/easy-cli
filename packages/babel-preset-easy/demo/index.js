const preset = require('../lib')
const babel = require('@babel/core')

const config = {
  babelrc: false,
  presets: [
    [
      preset,
      {
        '@babel/preset-env': {}
      }
    ]
  ],
  filename: 'test-entry-file.js'
}


let { code } = babel.transformFileSync(require.resolve('./demo.js'), config)
console.log(code)
