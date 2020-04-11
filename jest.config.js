/* eslint-disable @typescript-eslint/no-var-requires */
const jestMongoDbPreset = require('@shelf/jest-mongodb/jest-preset');
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    ...tsjPreset.transform,
    ...jestMongoDbPreset,
  },
};
