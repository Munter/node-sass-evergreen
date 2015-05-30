'use strict';

var expect = require('unexpected');

module.exports = function (sass) {
  describe('sync rendering', function () {

    describe('using data', function () {

      it('should render basic example', function () {
        var result = sass.renderSync({
          data: 'body { background: hotpink; }'
        });

        expect(result, 'to exhaustively satisfy', {
          css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: hotpink; }\n'),
          stats: {
            entry: 'data',
            start: expect.it('to be a number'),
            includedFiles: [],
            end: expect.it('to be a number'),
            duration: expect.it('to be a number')
          }
        });
      });

      it('should render basic example with sourceComments', function () {
        var result = sass.renderSync({
          data: 'body { background: hotpink; }',
          sourceComments: true
        });

        expect(result, 'to exhaustively satisfy', {
          css: expect.it('when decoded as', 'utf8', 'to be', '/* line 1, stdin */\nbody {\n  background: hotpink; }\n'),
          stats: expect.it('to satisfy', {
            includedFiles: []
          })
        });
      });

      it('should fail on syntax errors - 1', function () {

        expect(function () {
          sass.renderSync({
            data: 'body {\n  background: hotpink;\n}}'
          });
        }, 'to throw', function (err) {
          expect(err, 'to satisfy', {
            message: 'invalid top-level expression',
            line: 3,
            file: 'stdin'
          });
        });
      });

      it('should fail on syntax errors - 2', function () {
        expect(function () {
          sass.renderSync({
            file: 'fixtures/syntax-error-2.scss',
          });
        }, 'to throw', function (err) {
          expect(err, 'to satisfy', {
            message: 'property "color" must be followed by a \':\'',
            line: 2,
            file: /fixtures\/syntax-error-2\.scss$/
          });
        });
      });

    });
  });
};
