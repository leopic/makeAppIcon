# makeappicon
If you have never used [makeappicon.com](http://makeappicon.com/) to generate all icons for your iOS Apps you are missing out!
Well, were missing out, this module aims to enhance the experience of the site plus allow give you a drag
and drop ready icon set!

## Requirements

You need `gm/covert` binaries in your `$PATH` as [explained here](http://stackoverflow.com/questions/17756587/installing-graphicsmagick-on-mac-os-x-10-8). On MacOS, run the following:

```bash
brew uninstall imagemagick graphicsmagick libpng jpeg
brew cleanup -s
brew install graphicsmagick
```

## Usage:
Fire up a terminal and type:

```bash
npm install -g makeappicon
```

Create a 1024x1024 png image and call the script as such:

```bash
makeappicon --base-icon pathToBaseIcon.png
```

That take upload your base icon file and generate all the images that you need into the *AppIcon.appiconset*
directory. Open XCode, open your *Images.xcassets* pane and delete the default AppIcon entry, now drag and
drop the entire *AppIcon.appiconset* directory into that pane and you should be good to go! Build your app
and you should see your new icon all over the place.

## gm/convert binaries can't be found

If you get a message saying "this most likely means the gm/convert binaries can't be found", refer to Requirements.

## Credits:
- [makeappicon.com](http://makeappicon.com) for the idea
- Toaster ASCII Art from [retrokunkie](http://www.retrojunkie.com/asciiart/food/toasters.htm)

## Todo:
- Tests

## Other
This module is in no way, shape or form associated with OURSKY.

