'use strict';

var Diread = require('../index.js');
var Path = require('path');
var assert = require('assert');

describe('Check reading folder files', function() {
    it('should return 2 file names', function() {
        Diread({ src: 'test/folder' }).list(function(list) {
            assert.equal(3, list.length);
        });
    });

    it('should find file with name file1-2.js', function() {
        Diread({
            src: 'test/folder',
            mask: function(path) {
                return path.indexOf('file1-2.js') !== -1;
            }
        }).list(function(list) {
            assert.equal(1, list.length);
        });
    });

    it('should return file path', function() {
        Diread({
            src: 'test/folder/folder',
            mask: function(path) {
                return path.indexOf('file1') !== -1;
            }
        }).each(function(path) {
            assert.equal('file2-1.js', Path.basename(path));
        });
    });

    it('should return paths to all items', function() {
        Diread({
            src: 'test/folder',
            directories: true
        }).list(function(list) {
            assert.equal(4, list.length);
        });
    });

    it('should return files from first level', function() {
        Diread({
            src: 'test/folder',
            level: 1
        }).list(function(list) {
            assert.equal(2, list.length);
        });
    });

    it('should return files and directories from first level', function() {
        Diread({
            src: 'test/folder',
            directories: true,
            level: 1
        }).list(function(list) {
            assert.equal(3, list.length);
        });
    });

    it('should not check self directory', function() {
        var initial_folder = Path.resolve(process.cwd(), 'test/folder');

        Diread({
            src: initial_folder,
            directories: true,
            ignoreError: false,
            mask: function(path) {
                assert.notEqual(initial_folder, path);
                return true;
            }
        });
    });
});
