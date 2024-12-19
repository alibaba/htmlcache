const fs = require('fs');
const uglify = require('uglify-js');

const minifiedLoader = uglify.minify(
  fs.readFileSync('./src/htmlcache-loader.js', 'utf8')
).code;
fs.writeFileSync(
  './src/inject-loader.js',
  '/* GENERATED FILE, DO NOT EDIT DIRECTLY */\n' +
    fs
      .readFileSync('./src/inject-loader-template.js', 'utf8')
      .replace(/\/\*LOADER\*\//, minifiedLoader)
);
