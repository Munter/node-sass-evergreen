'use strict';

var expect = require('unexpected');

module.exports = function (sass) {
  describe('async rendering', function () {
    describe('using `data`', function () {
      it('should render basic example', function (done) {
        sass.render({
          data: 'body { background: hotpink; }'
        }, function (err, result) {
          expect(err, 'to be undefined');
          expect(result, 'to exhaustively satisfy', {
            css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: hotpink; }\n'),
            map: undefined,
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
            map: undefined,
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
          data: 'body {\n  background: hotpink;\n}}'
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
};
