var diread = function(options) {
    var dir_path = options.src,
        mask = typeof options.mask === 'function'? options.mask : function() { return true; },
        execute_dir = process.cwd();

    var fs = require('fs'),
        path = require('path'),
        full_dir_path = path.resolve(execute_dir, dir_path),
        list_of_file_path = [],

        read_by_path = function(dir_path, file_name) {
            var file_path = path.join(dir_path, file_name),
                is_directory = fs.statSync(file_path).isDirectory();

            if(is_directory) {
                read_directory(file_path);
            } else if(mask(file_name)) {
                list_of_file_path.push(file_path);
            }
        },
        read_directory = function(dir_path) {
            var files = fs.readdirSync(dir_path);

            files.forEach(function(file_name) {
                read_by_path(dir_path, file_name);
            });
        };

    try {
        read_by_path(full_dir_path, '');
    } catch(err) {
    }

    return {
        list: function(callback) {
            return callback(list_of_file_path);
        },
        each: function(callback) {
            return list_of_file_path.forEach(callback);
        },
        map: function(callback) {
            return list_of_file_path.map(callback);
        }
    };
};

module.exports = diread;
