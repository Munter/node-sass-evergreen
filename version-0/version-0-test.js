'use strict';

var sass = require('./index');
var expect = require('unexpected');

describe('node-sass 0.x', function () {
  it('should load the correct version', function () {
    expect(sass.version, 'to match', /^0.\d+.\d+$/);
  });

  it('should show the relevant info', function () {
    expect(sass.info, 'to match', /\t0.\d+.\d+\t/);
  });

  require('../test/test-noTypes')(sass);
  require('../test/test-noImporter')(sass);
  require('../test/test-noIndentedSyntax')(sass);

  require('../test/test-render')(sass);
  require('../test/test-renderSync')(sass);

  describe('sourceMap', function () {
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

      it('basic, sourceComments', function () {
        expect(function () {
          sass.render({
            file: 'fixtures/basic.scss',
            sourceComments: true,
            outFile: 'foo.css',
            sourceMap: true
          });
        }, 'to throw', /^options.sourceComments is not supported/);
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

      it('imports, sourceMapContents', function (done) {
        sass.render({
          file: 'fixtures/imports.scss',
          omitSourceMapUrl: true,
          outFile: 'foo.css',
          sourceMap: true,
          sourceMapContents: true
        }, function (err, result) {
          expect(err, 'to be null');

          expect(result, 'to satisfy', {
            css: expect.it('when decoded as', 'utf8', 'to be', [
              'h1 {\n  background: blue; }\n',
              'h2 {\n  background: green; }\n',
              'h3 {\n  background: yellow; }\n',
              'body {\n  background: hotpink; }\n',
            ].join('\n')),
            stats: expect.it('to satisfy', {
              includedFiles: [
                /fixtures\/import-1\.scss$/,
                /fixtures\/import-2\.scss$/,
                /fixtures\/import-3\.scss$/,
                /fixtures\/imports\.scss$/
              ]
            })
          });

          expect(JSON.parse(result.map.toString('utf8')), 'to exhaustively satisfy', {
            version: 3,
            file: 'foo.css',
            sources: [
              'fixtures/imports.scss',
              'fixtures/import-1.scss',
              'fixtures/import-2.scss',
              'fixtures/import-3.scss'
            ],
            sourcesContent: [
              '@import \'import-1\';\n@import \'import-2\';\n@import \'import-3\';\n\nbody {\n  background: hotpink;\n}\n',
              'h1 {\n  background: blue;\n}\n',
              'h2 {\n  background: green;\n}\n',
              'h3 {\n  background: yellow;\n}\n',
            ],
            mappings: expect.it('to be a string'),
            names: []
          });

          done();
        });
      });

    });

  });

});
