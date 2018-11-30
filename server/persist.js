const fs = require('fs')
const CONFIG_FILE_NAME = 'persistConfig.txt'

const handler = {
  get(target, key) {
    if (typeof target[key] === 'object' && target[key] !== null) {
      return new Proxy(target[key], handler)
    }

    return target[key]
  },

  set(target, key, value) {
    target[key] = value
    console.log('setCalled key:', key, 'value:', value)
    writeConfig(proxy)
  }
}

function writeConfig(config) {
  fs.writeFile(CONFIG_FILE_NAME, JSON.stringify(config), err => {
    if (err) {
      console.error('error', err)
    }
  })
}

let config = {}

try {
  const fileConfig = fs.readFileSync(CONFIG_FILE_NAME, 'utf8')
  config = JSON.parse(fileConfig)
  console.log('config', JSON.stringify(config))
} catch (err) {
  console.error('Config not found')
}

const proxy = new Proxy(config, handler)

module.exports = proxy
