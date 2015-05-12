'use strict';

var expect = require('unexpected');

module.exports = function (sass) {
  describe('types', function () {
    it('should throw when calling types.Number', function () {
      expect(sass.types.Number, 'to throw');
    });

    it('should throw when calling types.String', function () {
      expect(sass.types.String, 'to throw');
    });

    it('should throw when calling types.Color', function () {
      expect(sass.types.Color, 'to throw');
    });

    it('should throw when calling types.Boolean', function () {
      expect(sass.types.Boolean, 'to throw');
    });

    it('should throw when calling types.List', function () {
      expect(sass.types.List, 'to throw');
    });

    it('should throw when calling types.Map', function () {
      expect(sass.types.Map, 'to throw');
    });

    it('should throw when calling types.Null', function () {
      expect(sass.types.Null, 'to throw');
    });
  });
};
