'use strict';

let prism = require('prismjs');

module.exports = ({ config, pug }) => {
  pug.options.filters = {
    hl(text, { lang = 'markup' } = {}) {
      if (text[0] === '\n') {
        text = text.substring(1);
      }
      return `<code lang="${lang}">${prism.highlight(text, prism.languages[lang], lang)}</code>`;
    },
  };

  return config;
};
