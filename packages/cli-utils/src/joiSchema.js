import Joi from 'joi';

/** 创建shcema
 * @param {Function} fn
 * @returns {Schema}
 */
export const createSchema = (fn) => fn(Joi);

/** 同步校验
 * @param {Schema} fn
 * @param {Any} value
 * @returns {Object} {value,error}
 */
export const validate = (schema, value) => {
  return schema.validate(value);
};

/** 异步校验
 * @param {Schema} fn
 * @param {Any} value
 * @returns {Promise}
 */
export const validateAsync = (schema, value) => {
  return schema.validateAsync(value);
};
