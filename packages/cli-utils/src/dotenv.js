import path from 'path'
import fs from 'fs-extra'
import dotenv from 'dotenv'
import * as logger from './logger'

/**
 * 获取环境变量
 * @param {*} mode
 * @param {*} env
 */
export default (mode, env) => {
  if (mode) {
    return {
      ...expand(parse('.env')),
      ...expand(parse('.env.local')),
      ...expand(parse(`.env.${mode}`)),
      ...expand(parse(`.env.${mode}.local`)),
      ...expand(env)
    }
  } else {
    return {
      ...expand(parse('.env')),
      ...expand(parse('.env.local')),
      ...expand(env)
    }
  }
}

/**
   * 解析.env文件
   * @param {*} file
   */
function parse (file) {
  // 从.env文件读取环境变量
  const filename = path.resolve(process.cwd(), file)
  if (!fs.existsSync(filename)) return {}
  try {
    return dotenv.parse(fs.readFileSync(filename, { encoding: 'utf-8' }))
  } catch (err) {
    logger.error(`${filename} 文件解析错误`)
    return {}
  }
}

/**
 * 解析env变量中的为环境变量值
 * @param {*} env
 */
function expand (env = {}) {
  Object.keys(env).forEach(key => {
    env[key] = interpolate(env[key])
    process.env[key] = env[key]
  })

  return env
}

/**
   * 解析值
   * @param {*} value
   *  @param {*} env
   */
function interpolate (value, env) {
  const matches = value.match(/(.?\${?(?:[a-zA-Z0-9_]+)?}?)/g) || []

  return matches.reduce((envs, match) => {
    const parts = /(.?)\${?([a-zA-Z0-9_]+)?}?/g.exec(match)
    const prefix = parts[1]

    if (prefix === '\\') {
      const replacePart = parts[0]
      return envs.replace(replacePart, replacePart.replace('\\$', '$'))
    } else {
      const key = parts[2]
      const replacePart = parts[0].substring(prefix.length)
      const value = Object.prototype.hasOwnProperty.call(process.env, key) ? process.env[key] : env[key] || ''
      return envs.replace(replacePart, interpolate(value))
    }
  }, value)
}
