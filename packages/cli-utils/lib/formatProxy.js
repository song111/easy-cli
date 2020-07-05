"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = formatProxy;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * 格式化webpack代理配置
 * @param {Array|Object} proxy
 * @return {Array}
 */
function formatProxy(proxy) {
  /**
   * webpack-dev-server源码proxy格式化方式
   * https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js#L228-L254
   */
  if (!Array.isArray(proxy)) {
    if (Object.prototype.hasOwnProperty.call(proxy, 'target')) {
      proxy = [proxy];
    } else {
      proxy = Object.keys(proxy).map(function (key) {
        // For backwards compatibility reasons.
        var context = key.replace(/^\*$/, '**').replace(/\/\*$/, '');

        if (typeof proxy[key] === 'string') {
          return {
            context: context,
            target: proxy[key]
          };
        } else {
          return _objectSpread(_objectSpread({}, proxy[key]), {}, {
            context: context
          });
        }
      });
    }
  }

  return proxy;
}

module.exports = exports.default;
//# sourceMappingURL=formatProxy.js.map