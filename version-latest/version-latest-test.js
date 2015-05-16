'use strict';

var sass = require('./index');
var expect = require('unexpected');

describe('node-sass latest', function () {
  it('should load the correct version', function () {
    expect(sass.version, 'to match', /^3.\d+.\d+$/);
  });

  it('should show the relevant info', function () {
    expect(sass.info, 'to match', /\t3.\d+.\d+\t/);
  });

  // require('../test/test-noTypes')(sass);
  // require('../test/test-noImporter')(sass);
  // require('../test/test-noIndentedSyntax')(sass);

  require('../test/test-render')(sass);
  require('../test/test-renderSync')(sass);

  require('../test/test-sourceMap')(sass);
});
