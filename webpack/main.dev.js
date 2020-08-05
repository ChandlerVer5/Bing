/* eslint-disable node/no-missing-require */
require('@babel/register')(require('./main.dev.config'))
// eslint-disable-next-line import/no-unresolved
require('../src/main')
