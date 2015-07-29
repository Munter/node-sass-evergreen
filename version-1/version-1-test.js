'use strict';

var expect = require('unexpected');
var sass = require('./index');

(process.version.indexOf('v0.12') !== 0 ? describe : describe.skip)('node-sass 1.x', function () {
  it('should load the correct version', function () {
    expect(sass.version, 'to match', /^1.\d+.\d+$/);
  });

  it('should show the relevant info', function () {
    expect(sass.info, 'to match', /\t1.\d+.\d+\t/);
  });

  require('../test/test-noTypes')(sass);
  require('../test/test-noImporter')(sass);
  require('../test/test-noIndentedSyntax')(sass);

  require('../test/test-render')(sass);
  require('../test/test-renderSync')(sass);

  require('../test/test-sourceMap')(sass, {
    data: false
  });
});
