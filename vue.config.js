module.exports = {
  devServer: {
    proxy: {
      '/': {
        target: 'http://182.92.208.18:8090',
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  }
}
