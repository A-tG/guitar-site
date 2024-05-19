// npm install -D material-icons @material-design-icons/svg
const subset = require('subset-iconfont');
const fs = require('fs')

const readFileLines = filename => fs
  .readFileSync(filename)
  .toString('UTF8')
  .split(/\r?\n/)
  .map(s => s.trim())

const mi = new subset.MiProvider(
  readFileLines('used-icons.txt'), {
    formats: ['ttf', 'woff', 'woff2'],
    writeOutFiles: ['webfonts', 'css', 'licenses', 'web'],
    cssChoices: []}
);

mi.makeFonts('./.font-output').then((result) => {
  console.log('Done!');
});