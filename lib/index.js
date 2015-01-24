'use strict';

var _ = require('lodash'),
    argv = require('yargs').argv,
    fs = require('fs'),
    gm = require('gm');

var outputDir = argv['output-dir'] || 'AppIcon.appiconset',
    pathBaseIcon = argv['base-icon'] || 'base-icon.png',
    outputDirPath = process.cwd() + '/' + outputDir;

/**
 * Called upon successfully creating all thumbnails.
 * @param imagesCreated
 */
var success = function() {
    var contentsJSON = '/Contents.json',
        pathBanner = __dirname + '/banner.txt',
        pathContentsJSON = __dirname + contentsJSON;

    fs.readFile(pathBanner, 'utf8', function(err, banner) {
        if (!err) {
            console.log(banner);
            fs.createReadStream(pathContentsJSON)
                .pipe(fs.createWriteStream(outputDirPath + contentsJSON));
        } else {
            console.log(err);
        }
    });
};

/**
 * Generates all thumbnails.
 */
var generateThumbs = function() {
    var prefix = outputDir + '/Icon-',
        totalReady = 0,
        sizes = {
            29: [1, 2, 3],
            40: [1, 2, 3],
            60: [2, 3],
            76: [1, 2]
        };

    var totalImages = _.reduce(sizes, function(memo, num) {
        return memo + num.length;
    }, 0);

    console.log('Creating thumbnails.');
    _.forEach(sizes, function(multipliers, dimension) {
        _.forEach(multipliers, function(multiplier) {
            var fileName = prefix + dimension,
                size = dimension * multiplier;

            fileName += (multiplier > 1 ? ('@' + multiplier + 'x') : '') + '.png';

            gm(pathBaseIcon).thumb(size, size, fileName, 100, function(err) {
                if (!err) {
                    //console.log(fileName + ' was created.');
                    totalReady++;
                    (totalImages == totalReady) &&  success();
                } else {
                    console.log(err);
                }
            });
        });
    });
};


/**
 * Entry point.
 * Verifies base icon path and output dir paths exist and calls generateThumbs.
 */
var init = function() {
    fs.exists(pathBaseIcon, function(exists) {
        if (exists) {
            console.log('Creating output directory.');

            fs.readdir(outputDirPath, function(err) {
                if (!err) {
                    generateThumbs();
                } else if (err.errno == 34) { // Directory doesnt exist.
                    fs.mkdir(dirPath, function(exc) {
                        if (!exc) {
                            fs.readdir(dirPath, function(eff) {
                                if (!eff) {
                                    generateThumbs();
                                } else {
                                    console.log(eff);
                                }
                            });
                        } else {
                            console.log(exc);
                        }
                    });
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log('Can not go on without a base icon.');
        }
    });
};

module.exports = init;
