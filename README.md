# makeappicon
If you have never used http://makeappicon.com/ to generate all icons for your iOS Apps you are missing out!
Well, were missing out, this module aims to enhance the experience of the site plus allow give you a drag
and drop ready icon set!

## Usage:
Fire up a terminal and type:
```
$: npm install -g makeappicon
```
Create a 1024x1024 png image and name it "base-icon.png", then type:
```
$: makeappicon [--base-icon pathToBaseIcon.png --output-dir pathToOutputDir]
```
That take upload your base icon file and generate the 10 images that you need into the *AppIcon.appiconset*
directory. Open XCode, open your *Images.xcassets* pane and delete the default AppIcon entry, now drag and
drop the entire *AppIcon.appiconset* directory into that pane and you should be good to go! Build your app
and you should see your new icon all over the place.

## Credits:
- http://makeappicon.com for the idea
- Toaster ASCII Art from http://www.retrojunkie.com/asciiart/food/toasters.htm

## Todo:
- Tests

### Other
This module is in no way, shape or form associated with OURSKY.
