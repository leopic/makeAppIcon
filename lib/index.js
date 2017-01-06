'use strict';

// Module dependencies
var _ = require('lodash'),
    argv = require('yargs').argv,
    fs = require('fs'),
    gm = require('gm'),
    path = require('path');

// CLI Flags
var HELP_FLAG = argv['h'],
    ICON_PATH = argv['base-icon'];

// Global variables
var EXECUTION_PATH = process.cwd() + path.sep,
    MODULE_PATH = __dirname + path.sep;

// File and directory names
var CONTENTS_JSON = 'Contents.json',
    SUCCESS_BANNER = 'banner.txt',
    HELP_BANNER = 'help.txt',
    ICON_PREFIX = 'Icon-',
    THUMBS_OUTPUT_DIR = 'AppIcon.appiconset';

// File paths
var OUTPUT_DIR_PATH = EXECUTION_PATH + THUMBS_OUTPUT_DIR + path.sep,
    CONTENTS_JSON_OUTPUT_PATH = OUTPUT_DIR_PATH + CONTENTS_JSON,
    CONTENTS_JSON_PATH = MODULE_PATH + CONTENTS_JSON,
    HELP_BANNER_PATH =  MODULE_PATH + HELP_BANNER,
    SUCCESS_BANNER_PATH = MODULE_PATH + SUCCESS_BANNER,
    THUMBS_PATH = OUTPUT_DIR_PATH + ICON_PREFIX;

/**
 * Called upon successfully creating all thumbnails.
 */
var success = function() {
    fs.readFile(SUCCESS_BANNER_PATH, 'utf8', function(err, successBanner) {
        if (!err) {
            console.log(successBanner);
            fs.createReadStream(CONTENTS_JSON_PATH)
                .pipe(fs.createWriteStream(CONTENTS_JSON_OUTPUT_PATH));
        } else {
            console.log(err);
        }
    });
};

/**
 * Generates all thumbnails.
 */
var generateThumbs = function() {
    var totalReady = 0,
        sizes = {
            20:     [1, 2, 3],
            29:     [1, 2, 3],
            40:     [1, 2, 3],
            60:     [2, 3],
            76:     [1, 2],
            '83.5': [2]
        };

    var totalImages = _.reduce(sizes, function(memo, num) {
        return memo + num.length;
    }, 0);

    console.log('Creating icons.');
    _.forEach(sizes, function(multipliers, dimension) {
        dimension = parseFloat(dimension);

        _.forEach(multipliers, function(multiplier) {
            var fileName = THUMBS_PATH + dimension,
                size = dimension * multiplier,
                quality = 100;

            fileName += (multiplier > 1 ? ('@' + multiplier + 'x') : '') + '.png';

            gm(ICON_PATH).thumb(size, size, fileName, quality, function(err) {
                if (!err) {
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
 * Script entry point.
 * Verifies base icon path and output dir paths exist and
 * shows either the help banner or calls generateThumbs.
 */
var init = function() {
    if (HELP_FLAG || !ICON_PATH) {
        fs.readFile(HELP_BANNER_PATH, 'utf8', function(err, helpBanner) {
            console.log(err || helpBanner);
        });
    } else {
        fs.exists(ICON_PATH, function(exists) {
            if (exists) {
                fs.readdir(OUTPUT_DIR_PATH, function(err) {
                    if (!err) {
                        generateThumbs();
                    } else if (_.contains([-2, 34], err.errno)) { // Directory does not exist.
                        console.log('Creating output directory.');

                        fs.mkdir(OUTPUT_DIR_PATH, function(exc) {
                            if (!exc) {
                                fs.readdir(OUTPUT_DIR_PATH, function(eff) {
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
                console.log('Please provide a base icon using the --base-icon option.');
            }
        });
    }
};

module.exports = init;
