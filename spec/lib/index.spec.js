'use strict';

const lib = require('../../lib/index'),
    ERROR_CODE = require('../../lib/errors');

describe('Basic functionality', () => {
    it('displays the help banner when no params are given', function () {
        lib({})
            .then(result => expect(result).toContain('Usage: makeappicon --base-icon ICON_PATH'))
            .catch();
    });

    it('displays the help banner when the help flag is set to true', function () {
        lib({helpFlag: true})
            .then(result => expect(result).toContain('Usage: makeappicon --base-icon ICON_PATH'))
            .catch();
    });

    it('should fail to find the icon', () => {
        lib({iconPath: '/som.tin.wrong.png'})
            .catch(err => expect(err).toBe(ERROR_CODE.UNABLE_TO_OPEN_FILE));
    });

    it('should correctly generate 15 images', (done) => {
        const path = require('path');
        const filePath = `${process.cwd() + path.sep}test/icon-1024.png`;

        lib({iconPath: filePath})
            .then(result => {
                expect(result).toContain('Created 15 images.');
                done();
            })
    });
});
