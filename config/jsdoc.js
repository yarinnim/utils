module.exports = {
  plugins: [],
  recurseDepth: 10,
  source: {
    includePattern: '.+\\.js(doc|x)?$',
    excludePattern: '(^|\\/|\\\\)_',
    include: ['src', 'README.md', 'package.json'],
  },
  sourceType: 'module',
  tags: {
    allowUnknownTags: true,
    dictionaries: ['jsdoc', 'closure'],
  },
  templates: {
    cleverLinks: false,
    monospaceLinks: false,
  },

  opts: {
    readme: './README.md',
    destination: 'jsdoc',
    template: '../../../node_modules/clean-jsdoc-theme',
    default_theme: 'dark',
  },
  markdown: {
    hardwrap: false, // This is important, otherwise some features might not work.
    idInHeadings: true, // This is important, otherwise some features might not work.
  },
};
