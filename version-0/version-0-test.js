'use strict';

var sass = require('./index');
var expect = require('unexpected');

describe('node-sass 0.x', function () {
  it('should load the correct version', function () {
    expect(sass._version, 'to match', /^0.\d+.\d+$/);
  });

  describe('types', function () {
    it('should throw when calling types.Number', function () {
      expect(sass.types.Number, 'to throw');
    });

    it('should throw when calling types.String', function () {
      expect(sass.types.String, 'to throw');
    });

    it('should throw when calling types.Color', function () {
      expect(sass.types.Color, 'to throw');
    });

    it('should throw when calling types.Boolean', function () {
      expect(sass.types.Boolean, 'to throw');
    });

    it('should throw when calling types.List', function () {
      expect(sass.types.List, 'to throw');
    });

    it('should throw when calling types.Map', function () {
      expect(sass.types.Map, 'to throw');
    });

    it('should throw when calling types.Null', function () {
      expect(sass.types.Null, 'to throw');
    });
  });

  describe('async rendering', function () {
    describe('using `data`', function () {
      it('should render basic example', function (done) {
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

      it('should render basic example with sourceComments', function (done) {
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

      it('should fail on syntax errors', function (done) {
        sass.render({
          data: 'body {\n  background: hotpink;\n}}',
          sourceComments: true
        }, function (err, result) {
          expect(err, 'to satisfy', {
            message: 'invalid top-level expression',
            line: 3,
            file: 'source string'
          });

          done();
        });
      });

    });
  });
});
