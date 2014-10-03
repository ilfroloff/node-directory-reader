var diread = function(options) {
    var dir_path = options.src,
        mask = typeof options.mask === 'function'? options.mask : function() { return true; },
        execute_dir = process.cwd();

    var fs = require('fs'),
        path = require('path'),
        full_dir_path = path.join(execute_dir, dir_path),
        list_of_file_path = [],

        read_directory = function(dir_path) {
            var template_names = fs.readdirSync(dir_path);

            template_names.forEach(function(name) {
                var file_path = path.join(dir_path, name),
                    is_directory = fs.lstatSync(file_path).isDirectory();

                if(is_directory) {
                    read_directory(file_path);
                } else if(mask(name)) {
                    list_of_file_path.push(file_path);
                }
            });
        };

    read_directory(full_dir_path);

    return {
        each: function(callback) {
            return list_of_file_path.forEach(callback);
        },
        map: function(callback) {
            return list_of_file_path.map(callback);
        }
    };
};

module.exports = diread;
