const fs = require('fs')
const CONFIG_FILE_NAME = 'persistConfig.json'

const handler = {
  get(target, key) {
    if (typeof target[key] === 'object' && target[key] !== null) {
      return new Proxy(target[key], handler)
    }

    return target[key]
  },

  set(target, key, value) {
    target[key] = value
    //console.log('setCalled key:', key, 'value:', value)
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
  if (fs.existsSync(CONFIG_FILE_NAME)) {
    const fileConfig = fs.readFileSync(CONFIG_FILE_NAME, 'utf8')
    config = JSON.parse(fileConfig)
    console.log('config', JSON.stringify(config))
  } else {
    console.log('Config file not found!')
  }
} catch (err) {
  if (fs.existsSync(CONFIG_FILE_NAME)) {
    fs.renameSync(
      CONFIG_FILE_NAME,
      CONFIG_FILE_NAME + '_' + Date.now().toString()
    )
    console.log('Config File renamed due to corruption')
  }
}

const proxy = new Proxy(config, handler)

module.exports = proxy
