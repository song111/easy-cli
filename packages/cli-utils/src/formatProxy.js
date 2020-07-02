/**
 * 格式化webpack代理配置
 * @param {Array|Object} proxy
 * @return {Array}
 */
export default function formatProxy (proxy) {
  /**
   * webpack-dev-server源码proxy格式化方式
   * https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js#L228-L254
   */
  if (!Array.isArray(proxy)) {
    if (Object.prototype.hasOwnProperty.call(proxy, 'target')) {
      proxy = [proxy]
    } else {
      proxy = Object.keys(proxy).map(key => {
        // For backwards compatibility reasons.
        const context = key.replace(/^\*$/, '**').replace(/\/\*$/, '')

        if (typeof proxy[key] === 'string') {
          return {
            context,
            target: proxy[key]
          }
        } else {
          return {
            ...proxy[key],
            context
          }
        }
      })
    }
  }
  return proxy
}
