var casper = require('casper').create(),
    downloadUrl = '',
    paths = [];

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)');

casper.start('http://makeappicon.com/', function() {
  this.echo('[^] Uploading image form...');
  this.fill('form', {
    'file': '/Users/leo/Sites/automateGenerationOfIcons/base-icon.png'
  });
});

casper.waitForSelector('.icons-wrapper img', function(response) {
  downloadUrl = response.url;
  var hash = downloadUrl.split('/')[4];
  var sizes = ['Small@2x', 'Small@3x', '40@2x', '40@3x', '60@2x', '60@3x', 'Small', '40', '40@2x', '76', '76@2x'];
  for (var i = 0; i < sizes.length; i++) {
    paths.push('http://makeappicon.com/upload/' + hash + '/ios/AppIcon.appiconset/Icon-' + sizes[i] + '.png');
  }
});

casper.thenOpen(downloadUrl, function() {
    for (var i = 0; i < paths.length; i++) {
      var fileName = paths[i].split('/')[7];
      this.echo('[>] Downloading image: '+ fileName);
      this.download(paths[i], 'out/' + fileName, 'GET');
    }
});

casper.run(function() {
  this.echo('All set here.').exit();
});
