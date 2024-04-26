**Reworked version using typescript and knockoutjs MVVM**

# [Website for guitar practicing](https://a-tg.github.io)
* All tools in one browser tab
* Minimal response time - website works completly on the client side
* Day/night color themes
* Share your link with others
## What already works:
### Metronome
* High-precision click 
* Logarithmic volume control - smooth click volume control
* Tempo range from 40 to 320
* Notes per measure from 1 to 16
* Duration from whole note to 32nd
### Scales calculator
* Ability to choose number of strings
* Ready tunings presets or custom for each string
* Triads, can show intervals instead of notes
* Toggle hiding any scale note
* Scale box on any fret
## Planned:
 * Chords
 * Chord finder
 * Chord progressions
 * And other useful tools

## Used:
 [Knockout](https://knockoutjs.com)

 [webpack](https://webpack.js.org) to compile typecript into browser ready js
 
 [subset-iconfont](https://github.com/dzhuang/subset-iconfont) to generate subset of icons
 
 [RealFaviconGenerator](https://realfavicongenerator.net/) for generating favicon

## Development
1. `npm install`
1. `node subset-iconfont.js` then copy folder '.font-output\material-icons\webfonts' to 'src\' (filled, outlined variants)

   On Windows: `robocopy .font-output/material-icons/webfonts src/webfonts *filled* *outlined* /im /is /it`
1. `npx webpack` Compiles TypeScript into js
1. Now you should start local server (any of your preference) in 'stc\index.html'

   Metronome requires WebWorker and will not work if index.html just opened in browser because of CORS policy

## Support developer
[Available methods](https://taplink.cc/atgdev)
