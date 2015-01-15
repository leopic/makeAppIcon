# makeAppIcon.js
makeAppIcon.js is a CLI interface for http://makeappicon.com/ a great site to
help you balance the madness of creating all different icon sizes for your iOS
App. All credit go to them.

## Requirements:
- node
- phantomJS
- casperJS

## Usage:
Replace the base-icon.png file with your own, MakeAppIcon recommends a 1024x1024
image, fire up a terminal and run:
```
$: casperjs makeAppIcon.js
```
That will upload your base icon file, download all the generated files on the
"out" directory, drag and drop into XCode and you are good to go.

## Credits:
- http://makeappicon.com 

