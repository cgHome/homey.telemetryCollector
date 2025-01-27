'use strict';

const { FlatCompat } = require('@eslint/eslintrc');

const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [{
  ignores: ['.homeybuild/*'],
}, ...compat.extends('athom')];
