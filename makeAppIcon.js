// Simple CLI for http://makeappicon.com
// https://github.com/leopic/makeAppIcon

var casper = require('casper').create({
      pageSettings: {
        webSecurityEnabled: false
      }
    }),
    downloadUrl = '',
    paths = [];

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)');

casper.start('http://makeappicon.com/', function() {
  var banner = '[ ↑] Uploading base icon to http://makeappicon.com ...\n';
  banner += '                      .___________.\n';
  banner += '                      |           |\n';
  banner += '       ___________.   |  |    /~\\ |\n';
  banner += '      / __   __  /|   | _ _   |_| |\n';
  banner += '     / /:/  /:/ / |   !________|__!\n';
  banner += '    / /:/  /:/ /  |            |\n';
  banner += '   / /:/  /:/ /   |____________!\n';
  banner += '  / /:/  /:/ /    |\n';
  banner += ' / /:/  /:/ /     |\n';
  banner += '/  ~~   ~~ /      |\n';
  banner += '|~~~~~~~~~~|      |\n';
  banner += '|    ::    |     /\n';
  banner += '|    ==    |    /\n';
  banner += '|    ::    |   /\n';
  banner += '|    ::    |  /\n';
  banner += '|    ::  @ | /\n';
  banner += '!__________!/\n';
  this.echo(banner);
  this.fill('form', {
    'file': 'base-icon.png'
  });
});

casper.waitForSelector('.icons-wrapper img', function(response) {
  downloadUrl = response.url;
  var hash = downloadUrl.split('/')[4],
      iconSizes = ['40', '40@2x', '40@3x', '60@2x', '60@3x', '76', '76@2x', 'Small', 'Small@2x', 'Small@3x'];

  this.echo('[ →] Your generated files can be re-downloaded at http://makeappicon.com/download/' + hash);
  iconSizes.forEach(function(size) {
    paths.push('http://makeappicon.com/upload/' + hash + '/ios/AppIcon.appiconset/Icon-' + size + '.png');
  });
});

casper.thenOpen(downloadUrl, function() {
  var self = this;
    paths.forEach(function(iconUrl) {
      var fileName = iconUrl.split('/')[7];
      self.echo('[ ↓] Downloading image: ' + fileName);
      self.download(iconUrl, 'AppIcon.appiconset/' + fileName, 'GET');
    });
});

casper.run(function() {
  this.echo('[ →] All set, drag and drop the "AppIcon.appiconset" directory into your image assets in XCode.')
      .exit();
});
