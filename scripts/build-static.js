var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

var root = path.resolve(__dirname, '..');
var dist = path.join(root, 'dist');
var template = path.join(root, 'views', 'index.ejs');

function normalizeBasePath(value) {
  if (!value || value === '/') return '';
  return '/' + String(value).replace(/^\/+|\/+$/g, '');
}

var basePath = normalizeBasePath(process.env.BASE_PATH || '/exoplanets');
var data = {
  layout: false,
  exo: require(path.join(root, 'cache', 'periods.json')),
  people: require(path.join(root, 'data', 'people.json')),
  date: null,
  basePath: basePath
};

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.cpSync(path.join(root, 'public'), dist, { recursive: true });

var html = ejs.render(fs.readFileSync(template, 'utf8'), data, { filename: template });

fs.writeFileSync(path.join(dist, 'index.html'), html);
fs.writeFileSync(path.join(dist, '404.html'), html);
fs.writeFileSync(path.join(dist, '.nojekyll'), '');

console.log('Built static site in dist with basePath=' + (basePath || '/'));
