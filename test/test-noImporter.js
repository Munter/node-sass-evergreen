'use strict';

var expect = require('unexpected');

module.exports = function (sass) {
  describe('importer', function () {
    it('should throw when passing in an importer function', function () {
      expect(sass.render.bind(null, {
        data: 'body { background: hotpink; }',
        importer: function () {}
      }), 'to throw');
    });

    it('should throw when passing in an importer array', function () {
      expect(sass.render.bind(null, {
        data: 'body { background: hotpink; }',
        importer: []
      }), 'to throw');
    });
  });

  describe('indentedSyntax', function () {
    it('should throw when passing in the indentedSyntax config', function () {
      expect(sass.render.bind(null, {
        data: 'body { background: hotpink; }',
        indentedSyntax: true
      }), 'to throw');
    });
  });
};
