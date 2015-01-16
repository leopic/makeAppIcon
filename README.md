# makeAppIcon.js
makeAppIcon.js is a CLI interface for http://makeappicon.com/ a great site to help you balance the madness
of creating all different icon sizes for your iOS App. All credit go to them, I'm just lazy and wanted to
do as little clicks as possible.

## Requirements:
- casperJS ~ 1.1.0-beta3

## Usage:
Replace the base-icon.png file with your own, MakeAppIcon recommends a 1024x1024px image, fire up a
terminal and run:
```
$: casperjs makeAppIcon.js
```
That will upload your base icon file to the service, download all the generated files and download the
generated files into the *AppIcon.appiconset* directory. Open XCode, open your Images.xcassets pane and delete
the default AppIcon entry, now drag and drop the entire *AppIcon.appiconset* directory into that pane and
you should be good to go! Build your app and you should see your new icon all over the place.

## Credits:
- http://makeappicon.com
- Toaster http://www.retrojunkie.com/asciiart/food/toasters.htm
