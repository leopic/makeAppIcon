'use strict';

// Module dependencies
const _ = require('lodash'),
    fs = require('fs'),
    gm = require('gm'),
    ERROR_CODE = require('./errors'),
    FILE_NAMES = require('./filenames');

const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const existsAsync = promisify(fs.exists);
const readDirAsync = promisify(fs.readdir);
const mkDirAsync = promisify(fs.mkdir);

// Script output...
let output = '';

/**
 * Script entry point.
 * Verifies base icon path and output dir paths exist and
 * shows either the help banner or calls generateThumbs.
 * @param args
 * @returns {Promise<any>}
 */
const init = (args) => {
    const baseIconPath = args.iconPath,
        helpFlag = args.helpFlag;

    return new Promise((resolve, reject) => {
        if (helpFlag || !baseIconPath) {
            return resolve(showHelpBanner());
        }

        return existsAsync(baseIconPath)
            .then(stepIntoDirectory(baseIconPath, resolve, reject))
            .catch(e => reject(ERROR_CODE.WRONG_PATH));
    });
};

/**
 *
 */
const showHelpBanner = () => {
    return readFileAsync(FILE_NAMES.HELP_BANNER_PATH, 'utf8');
};

/**
 *
 * @param baseIconPath
 * @param resolve
 * @param reject
 * @returns {Promise<T | never>}
 */
const stepIntoDirectory = (baseIconPath, resolve, reject) => {
    return readDirAsync(FILE_NAMES.OUTPUT_DIR_PATH)
        .then(() => resolve(generateThumbs(baseIconPath, success)))
        .catch(err => {
            const directoryDoesNotExist = _.includes([-2, 34], err.errno);
            if (directoryDoesNotExist) {
                resolve(outputPathDoesNotExist(baseIconPath, success));
            } else {
                reject(ERROR_CODE.OTHER_FAILURE);
            }
        });
};

/**
 * Generates all thumbnails.
 * @param baseIconPath
 * @param success
 * @returns {Promise<any>}
 */
const generateThumbs = (baseIconPath, success) => {
    let totalReady = 0,
        sizes = {
            20: [1, 2, 3],
            29: [1, 2, 3],
            40: [1, 2, 3],
            60: [2, 3],
            76: [1, 2],
            '83.5': [2],
            1024: [1]
        };

    let totalImages = _.reduce(sizes, (memo, num) => {
        return memo + num.length;
    }, 0);

    return new Promise((resolve, reject) => {
        console.log('Creating icons...');

        _.forEach(sizes, (multipliers, dimension) => {
            dimension = parseFloat(dimension);

            _.forEach(multipliers, (multiplier) => {
                let fileName = FILE_NAMES.THUMBS_PATH + dimension,
                    size = dimension * multiplier,
                    quality = 100;

                fileName += (multiplier > 1 ? ('@' + multiplier + 'x') : '') + '.png';

                gm(baseIconPath).thumb(size, size, fileName, quality, err => {
                    if (err) {
                        const unableToOpenFile = err.code === 1;
                        return reject(unableToOpenFile ? ERROR_CODE.UNABLE_TO_OPEN_FILE : ERROR_CODE.OTHER_FAILURE);
                    }
                    
                    totalReady++;

                    if (totalImages === totalReady) {
                        output += `\nAll set!\n`;
                        return resolve(success());
                    } else {
                      process.stdout.write('.');
                    }
                });
            });
        });
    });
};

/**
 * Creates the directory to house all icons.
 * @param baseIconPath
 * @param success
 * @returns {Promise<T | number>}
 */
const outputPathDoesNotExist = (baseIconPath, success) => {
    return mkDirAsync(FILE_NAMES.OUTPUT_DIR_PATH)
        .then(() => {
            output += 'Creating output directory. \n';

            return readDirAsync(FILE_NAMES.OUTPUT_DIR_PATH).then(() => {
                return generateThumbs(baseIconPath, success);
            });
        })
        .catch(e => {
            return ERROR_CODE.UNABLE_TO_CREATE_DIRECTORY;
        });
};

/**
 * Called upon successfully creating all thumbnails.
 * @returns {PromiseLike<T | never> | Promise<T | never>}
 */
const success = () => {
    return readFileAsync(FILE_NAMES.SUCCESS_BANNER_PATH, 'utf8')
        .then(successBanner => {
            fs.createReadStream(FILE_NAMES.CONTENTS_JSON_PATH)
                .pipe(fs.createWriteStream(FILE_NAMES.CONTENTS_JSON_OUTPUT_PATH));
            return output += successBanner;
        });
};

module.exports = init;
