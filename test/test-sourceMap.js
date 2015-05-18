'use strict';

var expect = require('unexpected');

module.exports = function (sass, options) {
  options = options || {};

  describe('sourceMap', function () {

    if (options.data !== false) {
      describe('using `data`', function () {

        it('accord use case', function (done) {
          sass.render({
            data: 'body { background: hotpink; }',
            omitSourceMapUrl: true,
            outFile: 'foo.css',
            sourceMap: true
          }, function (err, result) {
            expect(err, 'to be null');
            expect(result, 'to exhaustively satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: hotpink; }\n'),
              map: expect.it('when decoded as', 'utf8', JSON.parse, 'to satisfy', {
                version: 3,
                file: 'foo.css',
                sources: ['stdin'],
                sourcesContent: [],
                mappings: expect.it('to be a string'),
                names: []
              }),
              stats: expect.it('to satisfy', {
                includedFiles: []
              })
            });

            done();
          });
        });

        it('accord use case with sourceComments', function (done) {
          sass.render({
            data: 'body { background: hotpink; }',
            sourceComments: true,
            omitSourceMapUrl: true,
            outFile: 'foo.css',
            sourceMap: true
          }, function (err, result) {
            expect(err, 'to be null');
            expect(result, 'to exhaustively satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', '/* line 1, stdin */\nbody {\n  background: hotpink; }\n'),
              map: expect.it('when decoded as', 'utf8', JSON.parse, 'to satisfy', {
                version: 3,
                file: 'foo.css',
                sources: ['stdin'],
                sourcesContent: [],
                mappings: expect.it('to be a string'),
                names: []
              }),
              stats: expect.it('to satisfy', {
                includedFiles: []
              })
            });

            done();
          });
        });

      });
    }

    if (options.file !== false) {
      describe('using `file`', function () {

        it('basic', function (done) {
          sass.render({
            file: 'fixtures/basic.scss',
            outFile: 'foo.css',
            sourceMap: true
          }, function (err, result) {
            expect(err, 'to be null');
            expect(result, 'to exhaustively satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: red; }\n\n/*# sourceMappingURL=foo.css.map */'),
              map: expect.it('when decoded as', 'utf8', JSON.parse, 'to satisfy', {
                version: 3,
                file: 'foo.css',
                sources: ['stdin'],
                sourcesContent: [],
                mappings: expect.it('to be a string'),
                names: []
              }),
              stats: expect.it('to satisfy', {
                includedFiles: [
                  /fixtures\/basic\.scss$/
                ]
              })
            });

            done();
          });
        });

        it('basic, omitSourceMapUrl', function (done) {
          sass.render({
            file: 'fixtures/basic.scss',
            outFile: 'foo.css',
            omitSourceMapUrl: true,
            sourceMap: true
          }, function (err, result) {
            expect(err, 'to be null');
            expect(result, 'to exhaustively satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: red; }\n'),
              map: expect.it('when decoded as', 'utf8', JSON.parse, 'to satisfy', {
                version: 3,
                file: 'foo.css',
                sources: ['stdin'],
                sourcesContent: [],
                mappings: expect.it('to be a string'),
                names: []
              }),
              stats: expect.it('to satisfy', {
                includedFiles: [
                  /fixtures\/basic\.scss$/
                ]
              })
            });

            done();
          });
        });

        it('basic, sourceComments, omitSourceMapUrl', function (done) {
          sass.render({
            file: 'fixtures/basic.scss',
            sourceComments: true,
            omitSourceMapUrl: true,
            outFile: 'foo.css',
            sourceMap: true
          }, function (err, result) {
            expect(err, 'to be null');
            expect(result, 'to exhaustively satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', '/* line 3, ' + process.cwd() + '/fixtures/basic.scss */\nbody {\n  background: red; }\n'),
              map: expect.it('when decoded as', 'utf8', JSON.parse, 'to satisfy', {
                version: 3,
                file: 'foo.css',
                sources: ['stdin'],
                sourcesContent: [],
                mappings: expect.it('to be a string'),
                names: []
              }),
              stats: expect.it('to satisfy', {
                includedFiles: [
                  /fixtures\/basic\.scss$/
                ]
              })
            });

            done();
          });
        });

      });
    }

  });
};
