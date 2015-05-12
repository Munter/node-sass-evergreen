'use strict';

var expect = require('unexpected');

module.exports = function (sass) {
  describe('indentedSyntax', function () {
    it('should throw when passing in the indentedSyntax config', function () {
      expect(sass.render.bind(null, {
        data: 'body { background: hotpink; }',
        indentedSyntax: true
      }), 'to throw');
    });
  });
};
