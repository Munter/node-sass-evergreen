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

            expect(result, 'to satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: hotpink; }\n'),
              stats: expect.it('to satisfy', {
                includedFiles: []
              })
            });

            expect(JSON.parse(result.map.toString('utf8')), 'to exhaustively satisfy', {
              version: 3,
              file: 'foo.css',
              sources: ['stdin'],
              sourcesContent: [],
              mappings: expect.it('to be a string'),
              names: []
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

            expect(result, 'to satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', '/* line 1, stdin */\nbody {\n  background: hotpink; }\n'),
              stats: expect.it('to satisfy', {
                includedFiles: []
              })
            });

            expect(JSON.parse(result.map.toString('utf8')), 'to exhaustively satisfy', {
              version: 3,
              file: 'foo.css',
              sources: ['stdin'],
              sourcesContent: [],
              mappings: expect.it('to be a string'),
              names: []
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
            expect(result, 'to satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: red; }\n\n/*# sourceMappingURL=foo.css.map */'),
              stats: expect.it('to satisfy', {
                includedFiles: [
                  /fixtures\/basic\.scss$/
                ]
              })
            });

            expect(JSON.parse(result.map.toString('utf8')), 'to exhaustively satisfy', {
              version: 3,
              file: 'foo.css',
              sources: ['fixtures/basic.scss'],
              sourcesContent: [],
              mappings: expect.it('to be a string'),
              names: []
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
            expect(result, 'to satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: red; }\n'),
              stats: expect.it('to satisfy', {
                includedFiles: [
                  /fixtures\/basic\.scss$/
                ]
              })
            });

            expect(JSON.parse(result.map.toString('utf8')), 'to exhaustively satisfy', {
              version: 3,
              file: 'foo.css',
              sources: ['fixtures/basic.scss'],
              sourcesContent: [],
              mappings: expect.it('to be a string'),
              names: []
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

            expect(result, 'to satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', '/* line 3, ' + process.cwd() + '/fixtures/basic.scss */\nbody {\n  background: red; }\n'),
              stats: expect.it('to satisfy', {
                includedFiles: [
                  /fixtures\/basic\.scss$/
                ]
              })
            });

            expect(JSON.parse(result.map.toString('utf8')), 'to exhaustively satisfy', {
              version: 3,
              file: 'foo.css',
              sources: ['fixtures/basic.scss'],
              sourcesContent: [],
              mappings: expect.it('to be a string'),
              names: []
            });

            done();
          });
        });

        it('basic, sourceMapContents', function (done) {
          sass.render({
            file: 'fixtures/basic.scss',
            omitSourceMapUrl: true,
            outFile: 'foo.css',
            sourceMap: true,
            sourceMapContents: true
          }, function (err, result) {
            expect(err, 'to be null');

            expect(result, 'to satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: red; }\n'),
              stats: expect.it('to satisfy', {
                includedFiles: [
                  /fixtures\/basic\.scss$/
                ]
              })
            });

            expect(JSON.parse(result.map.toString('utf8')), 'to exhaustively satisfy', {
              version: 3,
              file: 'foo.css',
              sources: ['fixtures/basic.scss'],
              sourcesContent: [
                '$red: red;\n\nbody {\n  background: $red;\n}\n'
              ],
              mappings: expect.it('to be a string'),
              names: []
            });

            done();
          });
        });

      });
    }

  });
};
