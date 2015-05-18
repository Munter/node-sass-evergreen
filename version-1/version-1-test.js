'use strict';

var expect = require('unexpected');
var sass;
try {
  sass = require('./index');
} catch (err) {
  // Node 0.12 wtf
}

(sass ? describe : describe.skip)('node-sass 1.x', function () {
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

  describe('sourceMap override', function () {
    describe('using `data`', function () {

      it('accord use case', function () {
        expect(function () {
          sass.render({
            data: 'body { background: hotpink; }',
            sourceMap: true
          });
        }, 'to throw', /^options.sourceMap is not supported/);
      });
    });
  });
});
