// require('babel-core/register');
// require('babel-polyfill');
// require('css-modules-require-hook');
process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/.env` });

require('./server/index');
