import os from 'os'

/**
 * 获取局域网ip
 */
export default (port, baseURL) => {
  const ifaces = os.networkInterfaces()
  baseURL = baseURL.replace(/^\/+|\/+$/g, '')
  return Object.keys(ifaces).reduce((ips, key) => {
    ifaces[key].forEach(iface => {
      if (iface.family === 'IPv4') {
        ips.push(`http://${iface.address}:${port}/${baseURL}`)
      }
    })
    return ips
  }, [])
}
