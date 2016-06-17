'use strict';

var FS = require('fs');
var Path = require('path');

/**
 *
 * @class
 * @param options
 * @returns {Diread}
 */
function Diread(options) {
    if(!(this instanceof Diread)) {
        return new Diread(options);
    }

    this.initialize(options);
}

/**
 * Creates directory reader
 *
 * @param {Object}    options
 * @param {String}    options.src
 * @param {Boolean}  [options.directories=false]
 * @param {Number}   [options.level]
 * @param {Function} [options.mask]
 */
Diread.prototype.initialize = function(options) {
    this._directory_path = Path.resolve(process.cwd(), options.src);
    this._level = options.level || -1;
    this._check_directories = options.directories || false;
    this._mask = typeof options.mask === 'function'?
        options.mask :
        function() { return true; };

    this._current_read_level = 0;
    this._list_of_file_path = [];

    try {
        this._read_by_path(this._directory_path, '');
    } catch(err) {
    }
};

/**
 * Returns list of find paths
 *
 * @param {Function} callback
 */
Diread.prototype.list = function(callback) {
    callback(this._list_of_file_path);
};

/**
 * Iterates by all paths
 *
 * @param {Function} callback
 */
Diread.prototype.each = function(callback) {
    this._list_of_file_path.forEach(callback);
};

/**
 * Maps by all paths
 *
 * @param {Function} callback
 * @returns {Array}
 */
Diread.prototype.map = function(callback) {
    return this._list_of_file_path.map(callback);
};

/**
 * Reads by directory path and filters by directory path or/and file name
 *
 * @param {String} directory_path
 * @param {String} [filename]
 */
Diread.prototype._read_by_path = function(directory_path, filename) {
    var path = Path.join(directory_path, filename);
    var is_directory = FS.statSync(path).isDirectory();

    if(is_directory) {
        if(this._check_directories) {
            if(!this._mask(path)) {
                return;
            }

            if(path !== this._directory_path) {
                this._list_of_file_path.push(path);
            }
        }

        this._current_read_level++;
        this._read_directory(path);

        return;
    }

    if(this._mask(path, filename)) {
        this._list_of_file_path.push(path);
    }
};

/**
 * Reads and iterates directory content
 *
 * @param {String} directory_path
 */
Diread.prototype._read_directory = function(directory_path) {
    if(this._level !== -1) {
        if(this._current_read_level > this._level) {
            this._current_read_level--;
            return;
        }
    }

    var self = this;
    var files = FS.readdirSync(directory_path);

    files.forEach(function(content_name) {
        self._read_by_path(directory_path, content_name);
    });

    this._current_read_level--;
};

module.exports = Diread;
