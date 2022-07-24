const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://localhost:8080',
    secure: true,
    ws: true
  }
]

module.exports = PROXY_CONFIG;
