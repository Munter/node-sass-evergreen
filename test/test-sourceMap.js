'use strict';

var expect = require('unexpected');

module.exports = function (sass) {
  describe('sourceMap', function () {

    it('should use the outFile setting to augment... stuff', function (done) {
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
          // map: expect.it('when decoded as', 'utf8', 'when parsed as json', 'to be', '{\n\t"version": 3,\n\t"file": "foo.css",\n\t"sources": [\n\t\t"stdin"\n\t],\n\t"sourcesContent": [],\n\t"mappings": ";AAAA,IAAI,CAAC;EAAE,UAAU,EAAE,OAAQ,GAArB",\n\t"names": []\n}'),
          map: expect.it('when decoded as', 'utf8', function (str) {
            var obj = JSON.parse(str);

            expect(obj, 'to satisfy', {
              version: 3,
              file: 'foo.css',
              sources: ['stdin'],
              sourcesContent: [],
              mappings: expect.it('to be a string'),
              names: []
            });
          }),
          stats: expect.it('to satisfy', {
            includedFiles: []
          })
        });

        done();
      });
    });
  });
};
