module.exports = {
  devServer: {
    proxy: {
      '/': {
        target: 'http://182.92.***.18:8090',
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  }
}
