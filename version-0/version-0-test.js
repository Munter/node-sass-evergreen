'use strict';

var sass = require('./index');
var expect = require('unexpected');

describe('node-sass 0.x', function () {
  it('should load the correct version', function () {
    expect(sass._version, 'to match', /^0.\d+.\d+$/);
  });

  describe('async rendering', function () {
    it('should render basic data', function (done) {
      sass.render({
        data: 'body { background: hotpink; }'
      }, function (err, result) {
        expect(err, 'to be undefined');
        expect(result, 'to exhaustively satisfy', {
          css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: hotpink; }\n'),
          map: expect.it('when decoded as', 'utf8', 'to be', ''),
          stats: {
            entry: 'data',
            start: expect.it('to be a number'),
            includedFiles: [],
            end: expect.it('to be a number'),
            duration: expect.it('to be a number'),
            sourceMap: undefined
          }
        });

        done();
      });
    });

    it('should render basic data with sourceComments', function (done) {
      sass.render({
        data: 'body { background: hotpink; }',
        sourceComments: true
      }, function (err, result) {
        expect(err, 'to be undefined');
        expect(result, 'to exhaustively satisfy', {
          css: expect.it('when decoded as', 'utf8', 'to be', '/* line 1, source string */\nbody {\n  background: hotpink; }\n'),
          map: expect.it('when decoded as', 'utf8', 'to be', ''),
          stats: expect.it('to satisfy', {
            includedFiles: [],
            sourceMap: undefined
          })
        });

        done();
      });
    });
  });
});
