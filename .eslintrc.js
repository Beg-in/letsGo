'use strict';

module.exports = require('begin-project/lint');
module.exports.rules['import/extensions'] = 0;
module.exports.rules['global-require'] = 0;
module.exports.parserOptions = { sourceType: 'module' };
module.exports.rules.strict = 0;
