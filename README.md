**Reworked version using typescript and vuejs**

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
 [Vue](https://vuejs.org)
 
 [vue-safe-teleport](https://github.com/Akryum/vue-safe-teleport)
 
 [subset-iconfont](https://github.com/dzhuang/subset-iconfont) to generate subset of icons
 
 [RealFaviconGenerator](https://realfavicongenerator.net/) for generating favicon

## Development
1. `npm install`
1. `npm install` inside '\src' to initialize vue
1. `node subset-iconfont.js` Then copy folder '.font-output\material-icons\webfonts' to 'src\public' (filled, outlined variants). Icons are listed in 'used-icons.txt'

   On Windows: `robocopy .font-output\material-icons\webfonts src\public\webfonts *filled* *outlined* /im /is /it`
1. `npm run dev` inside '.\src' starts local server for development
1. `npm run build` inside '.\src' builds production ready assets to '.\dist'

## Support developer
[Available donation methods](https://taplink.cc/atgdev)
