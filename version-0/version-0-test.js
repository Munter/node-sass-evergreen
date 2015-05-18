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

      it('accord use case', function (done) {
        sass.render({
          file: 'fixtures/basic.scss',
          omitSourceMapUrl: true,
          outFile: 'foo.css',
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

      it('accord use case with sourceComments', function () {
        expect(function () {
          sass.render({
            file: 'fixtures/basic.scss',
            sourceComments: true,
            omitSourceMapUrl: true,
            outFile: 'foo.css',
            sourceMap: true
          });
        }, 'to throw', /^options.sourceComments is not supported/);
      });

    });

  });

});
