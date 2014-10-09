var diread = require('../index.js');
var assert = require('assert');

describe('Check reading folder files', function() {
    it('should return 2 file names', function() {
        diread({ src: 'test/folder' }).list(function(list) {
            assert.equal(2, list.length);
        });
    });

    it('should find file with name file2.js', function() {
        diread({
            src: 'test/folder',
            mask: function(file_name) {
                return file_name.indexOf('file2.js') !== -1;
            }
        }).list(function(list) {
            assert.equal(1, list.length);
        });
    });
});
