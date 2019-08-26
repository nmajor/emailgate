// require('babel-core/register');
// require('babel-polyfill');
// require('css-modules-require-hook');
process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;

require('./server/index');
