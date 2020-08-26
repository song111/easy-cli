"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

/**
 * 把任务集合转换为串行任务
 * 串行执行时可指定每次同时(并发)可执行任务的条数
 * @param {Array} items 任务列表
 * @param {Number} length 每次并发任务的条数
 * @return {Promise<Array>} Promise对象按切片执行结果
 */
var _default = function _default(items) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return new Promise(function (resolve, reject) {
    var res = [];

    function next(i) {
      var slice = items.slice(i, i + length);
      i += length; // 如果数据执行完之后就直接返回

      if (slice.length) {
        // 执行处理逻辑
        Promise.all(slice.map(function (item) {
          return item();
        })).then(function (value) {
          res.push.apply(res, (0, _toConsumableArray2["default"])(value));
          next(i);
        })["catch"](function (err) {
          return reject(err);
        });
      } else {
        resolve(res);
      }
    }

    next(0);
  });
};

exports["default"] = _default;
module.exports = exports.default;