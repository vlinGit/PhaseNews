import {PrerendererWebpackPlugin} from '@prerenderer/webpack-plugin'

module.exports = {
  plugins: [
    new PrerendererWebpackPlugin({
      // Required - Routes to render.
      routes: [ '/', '/about', '/some/deep/nested/route' ],
      //renderer: '@prerenderer/renderer-jsdom', // Uncomment if you want to use jsdom
    })
  ]
}