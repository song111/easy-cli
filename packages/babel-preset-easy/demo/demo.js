import 'es6-promise/auto'
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { useStrict } from 'mobx'
import { AppContainer } from 'react-hot-loader'
import moment from 'moment'
import 'moment/locale/zh-cn'

import App from './router'

import './index.less'

moment.locale('zh-cn')
moment.defaultFormat = 'YYYY-MM-DD HH:mm'

if (process.env.NODE_ENV !== 'production') {
  require('./utils/mock')
}

useStrict(process.env.NODE_ENV !== 'production')

function render (Component) {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('layout-content')
  )
}

render(App)

if (module.hot) {
  module.hot.accept(App, () => {
    render(App)
  })
}

Promise.all([import('./lib/import1'), import('./lib/import2')]).then(([Import1, Import2]) => {
  console.log(Import1)
  /* CODE HERE */
})

function * a () {
  yield console.log('sada')
}

export default a
