import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import istanbul from 'rollup-plugin-istanbul';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

let plugins = [
  babel(babelrc())
];

if (process.env.BUILD !== 'production') {
  plugins.push(istanbul({
    exclude: ['test/**/*', 'node_modules/**/*']
  }));
}

export default {
  entry: './Nearby.js',
  plugins: plugins,
  external: external,
  targets: [
    {
      dest: pkg.main,
      format: 'umd',
      moduleName: 'Nearby'
    },
    {
      dest: pkg.module,
      format: 'cjs',
      moduleName: "Nearby"
    },
    {
      dest: pkg.es,
      format: 'es',
      moduleName: "Nearby"
    }
  ]
};
