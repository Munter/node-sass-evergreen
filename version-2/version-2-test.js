'use strict';

var expect = require('unexpected');
var sass = require('./index');

describe('node-sass 2.x', function () {
  it('should load the correct version', function () {
    expect(sass.version, 'to match', /^2.\d+.\d+$/);
  });

  it('should show the relevant info', function () {
    expect(sass.info, 'to match', /\s2.\d+.\d+\n/);
  });

  require('../test/test-noTypes')(sass);

  require('../test/test-render')(sass);
  require('../test/test-renderSync')(sass);
});
