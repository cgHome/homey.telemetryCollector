'use strict';

const { FlatCompat } = require('@eslint/eslintrc');

// eslint-disable-next-line import/no-extraneous-dependencies
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [{
  ignores: ['.homeybuild/*'],
}, ...compat.extends('athom')];
