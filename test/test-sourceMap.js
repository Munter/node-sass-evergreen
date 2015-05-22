'use strict';

var expect = require('unexpected');

module.exports = function (sass, options) {
  options = options || {};

  describe('sourceMap', function () {
    if (options.data === false) {

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

    }

    if (options.data !== false) {
      describe('render using `data`', function () {

        it('basic', function (done) {
          sass.render({
            data: 'body { background: hotpink; }',
            outFile: 'foo.css',
            sourceMap: true
          }, function (err, result) {
            expect(err, 'to be null');

            expect(result, 'to satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: hotpink; }\n\n/*# sourceMappingURL=foo.css.map */'),
              map: expect.it('to be a', Buffer),
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

        it('basic, omitSourceMapUrl', function (done) {
          sass.render({
            data: 'body { background: hotpink; }',
            omitSourceMapUrl: true,
            outFile: 'foo.css',
            sourceMap: true
          }, function (err, result) {
            expect(err, 'to be null');

            expect(result, 'to satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: hotpink; }\n'),
              map: expect.it('to be a', Buffer),
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

        it('basic, omitSourceMapUrl, sourceComments', function (done) {
          sass.render({
            data: 'body { background: hotpink; }',
            omitSourceMapUrl: true,
            sourceComments: true,
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

        it('basic, sourceMapContents', function (done) {
          sass.render({
            data: 'body { background: hotpink; }',
            omitSourceMapUrl: true,
            outFile: 'foo.css',
            sourceMap: true,
            sourceMapContents: true
          }, function (err, result) {
            expect(err, 'to be null');

            expect(result, 'to satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: hotpink; }\n'),
              map: expect.it('to be a', Buffer),
              stats: expect.it('to satisfy', {
                includedFiles: []
              })
            });

            expect(JSON.parse(result.map.toString('utf8')), 'to exhaustively satisfy', {
              version: 3,
              file: 'foo.css',
              sources: ['stdin'],
              sourcesContent: [
                'body { background: hotpink; }'
              ],
              mappings: expect.it('to be a string'),
              names: []
            });

            done();
          });
        });

        it('imports, sourceMapContents', function (done) {
          sass.render({
            data: '@import \'import-1\';\n@import \'import-2\';\n@import \'import-3\';\n\nbody {\n  background: hotpink;\n}\n',
            omitSourceMapUrl: true,
            outFile: 'foo.css',
            sourceMap: true,
            sourceMapContents: true,
            includePaths: ['fixtures']
          }, function (err, result) {
            expect(err, 'to be null');

            expect(result, 'to satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', [
                'h1 {\n  background: blue; }\n',
                'h2 {\n  background: green; }\n',
                'h3 {\n  background: yellow; }\n',
                'body {\n  background: hotpink; }\n',
              ].join('\n')),
              map: expect.it('to be a', Buffer),
              stats: expect.it('to satisfy', {
                includedFiles: [
                  /fixtures\/import-1\.scss$/,
                  /fixtures\/import-2\.scss$/,
                  /fixtures\/import-3\.scss$/
                ]
              })
            });

            expect(JSON.parse(result.map.toString('utf8')), 'to exhaustively satisfy', {
              version: 3,
              file: 'foo.css',
              sources: [
                'stdin',
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

      describe('renderSync using `data`', function () {

        it('basic', function () {
          var result = sass.renderSync({
            data: 'body { background: hotpink; }',
            outFile: 'foo.css',
            sourceMap: true
          });

          expect(result, 'to satisfy', {
            css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: hotpink; }\n\n/*# sourceMappingURL=foo.css.map */'),
            map: expect.it('to be a', Buffer),
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
        });

        it('basic, omitSourceMapUrl', function () {
          var result = sass.renderSync({
            data: 'body { background: hotpink; }',
            omitSourceMapUrl: true,
            outFile: 'foo.css',
            sourceMap: true
          });

          expect(result, 'to satisfy', {
            css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: hotpink; }\n'),
            map: expect.it('to be a', Buffer),
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
        });

        it('basic, omitSourceMapUrl, sourceComments', function () {
          var result = sass.renderSync({
            data: 'body { background: hotpink; }',
            omitSourceMapUrl: true,
            sourceComments: true,
            outFile: 'foo.css',
            sourceMap: true
          });

          expect(result, 'to satisfy', {
            css: expect.it('when decoded as', 'utf8', 'to be', '/* line 1, stdin */\nbody {\n  background: hotpink; }\n'),
            map: expect.it('to be a', Buffer),
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
        });


        it('basic, sourceMapContents', function () {
          var result = sass.renderSync({
            data: 'body { background: hotpink; }',
            omitSourceMapUrl: true,
            outFile: 'foo.css',
            sourceMap: true,
            sourceMapContents: true
          });

          expect(result, 'to satisfy', {
            css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: hotpink; }\n'),
            map: expect.it('to be a', Buffer),
            stats: expect.it('to satisfy', {
              includedFiles: []
            })
          });

          expect(JSON.parse(result.map.toString('utf8')), 'to exhaustively satisfy', {
            version: 3,
            file: 'foo.css',
            sources: ['stdin'],
            sourcesContent: [
              'body { background: hotpink; }'
            ],
            mappings: expect.it('to be a string'),
            names: []
          });
        });

        it('imports, sourceMapContents', function () {
          var result = sass.renderSync({
            data: '@import \'import-1\';\n@import \'import-2\';\n@import \'import-3\';\n\nbody {\n  background: hotpink;\n}\n',
            omitSourceMapUrl: true,
            outFile: 'foo.css',
            sourceMap: true,
            sourceMapContents: true,
            includePaths: ['fixtures']
          });

          expect(result, 'to satisfy', {
            css: expect.it('when decoded as', 'utf8', 'to be', [
              'h1 {\n  background: blue; }\n',
              'h2 {\n  background: green; }\n',
              'h3 {\n  background: yellow; }\n',
              'body {\n  background: hotpink; }\n',
            ].join('\n')),
            map: expect.it('to be a', Buffer),
            stats: expect.it('to satisfy', {
              includedFiles: [
                /fixtures\/import-1\.scss$/,
                /fixtures\/import-2\.scss$/,
                /fixtures\/import-3\.scss$/
              ]
            })
          });

          expect(JSON.parse(result.map.toString('utf8')), 'to exhaustively satisfy', {
            version: 3,
            file: 'foo.css',
            sources: [
              'stdin',
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
        });

      });
    }

    if (options.file !== false) {
      describe('render using `file`', function () {

        it('basic', function (done) {
          sass.render({
            file: 'fixtures/basic.scss',
            outFile: 'foo.css',
            sourceMap: true
          }, function (err, result) {
            expect(err, 'to be null');
            expect(result, 'to satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: red; }\n\n/*# sourceMappingURL=foo.css.map */'),
              map: expect.it('to be a', Buffer),
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
              map: expect.it('to be a', Buffer),
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

        if (options.oldSourceComments !== true) {

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
                map: expect.it('to be a', Buffer),
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

        }

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
              map: expect.it('to be a', Buffer),
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
              map: expect.it('to be a', Buffer),
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


      describe('renderSync using `file`', function () {

        it('basic', function () {
          var result = sass.renderSync({
            file: 'fixtures/basic.scss',
            outFile: 'foo.css',
            sourceMap: true
          });

          expect(result, 'to satisfy', {
            css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: red; }\n\n/*# sourceMappingURL=foo.css.map */'),
            map: expect.it('to be a', Buffer),
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

        });

        it('basic, omitSourceMapUrl', function () {
          var result = sass.renderSync({
            file: 'fixtures/basic.scss',
            outFile: 'foo.css',
            omitSourceMapUrl: true,
            sourceMap: true
          });

          expect(result, 'to satisfy', {
            css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: red; }\n'),
            map: expect.it('to be a', Buffer),
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

        });

        if (options.oldSourceComments !== true) {

          it('basic, sourceComments, omitSourceMapUrl', function () {
            var result = sass.renderSync({
              file: 'fixtures/basic.scss',
              sourceComments: true,
              omitSourceMapUrl: true,
              outFile: 'foo.css',
              sourceMap: true
            });

            expect(result, 'to satisfy', {
              css: expect.it('when decoded as', 'utf8', 'to be', '/* line 3, ' + process.cwd() + '/fixtures/basic.scss */\nbody {\n  background: red; }\n'),
              map: expect.it('to be a', Buffer),
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

          });

        }

        it('basic, sourceMapContents', function () {
          var result = sass.renderSync({
            file: 'fixtures/basic.scss',
            omitSourceMapUrl: true,
            outFile: 'foo.css',
            sourceMap: true,
            sourceMapContents: true
          });

          expect(result, 'to satisfy', {
            css: expect.it('when decoded as', 'utf8', 'to be', 'body {\n  background: red; }\n'),
            map: expect.it('to be a', Buffer),
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

        });

        it('imports, sourceMapContents', function () {
          var result = sass.renderSync({
            file: 'fixtures/imports.scss',
            omitSourceMapUrl: true,
            outFile: 'foo.css',
            sourceMap: true,
            sourceMapContents: true
          });

          expect(result, 'to satisfy', {
            css: expect.it('when decoded as', 'utf8', 'to be', [
              'h1 {\n  background: blue; }\n',
              'h2 {\n  background: green; }\n',
              'h3 {\n  background: yellow; }\n',
              'body {\n  background: hotpink; }\n',
            ].join('\n')),
            map: expect.it('to be a', Buffer),
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

        });

      });
    }

  });
};
