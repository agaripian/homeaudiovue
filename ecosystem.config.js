module.exports = {
  apps: [
    {
      name: 'HomeAudioVue',
      script: 'npm run start',
      //cwd: '/home/pi/git/homeaudiovue',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 1,
      autorestart: true,
      watch: false,
      listen_timeout: 3000,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        CORS: 'true'
      }
    }
  ],

  deploy: {
    production: {
      user: 'node',
      host: '',
      ref: 'origin/master',
      repo: 'git@github.com:agaripian/homeaudiovue.git',
      path: '/var/www/production',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
}
