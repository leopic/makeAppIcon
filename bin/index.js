#!/usr/bin/env node

// Module dependencies
const argv = require('yargs').argv;

const lib = require('../lib/index.js'),
    ERROR_CODE = require('../lib/errors');

// CLI Arguments
const args = {
    helpFlag: argv['h'] || false,
    iconPath: argv['base-icon'] || ''
};

lib(args)
    .then(console.log)
    .catch(reason => {
        switch (reason) {
            case ERROR_CODE.WRONG_PATH:
                console.error('Please provide a base icon using the --base-icon option');
                break;
            case ERROR_CODE.UNABLE_TO_CREATE_DIRECTORY:
                console.error('Unable to create target directory');
                break;
            case ERROR_CODE.UNABLE_TO_OPEN_FILE:
                console.error('Unable to open base icon file');
                break;
            default:
                console.error('General error');
        }

        process.exit(1);
    });
