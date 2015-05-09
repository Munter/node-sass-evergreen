var sass = require('./index');
var expect = require('unexpected');

describe('node-sass 0.x', function () {
  it('should load the correct version', function () {
    expect(sass.version, 'to match', /^0.\d+.\d+$/);
  });
});
