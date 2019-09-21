'use strict';

const lib = require('../../lib/index'),
    ERROR_CODE = require('../../lib/errors');

const path = require('path');
const fs = require('fs');


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

        const directoryPath = path.join(__dirname, '../../AppIcon.appiconset');

      lib({iconPath: filePath})
            .then(result => {
                // expect(result).toContain('Created 15 images.');

              fs.readdir(directoryPath, function (err, files) {
                //handling error
                if (err) {
                  done();
                  return console.log('Unable to scan directory: ' + err);
                }
                //listing all files using forEach
                // files.forEach(function (file) {
                //   // Do whatever you want to do with the file
                //   console.log(file);
                // });

                expect(files.length).toEqual(16);

                done();
              });

                // done();
            })
    });
});
