Draw audio signal waveform, both in browser or node.

## Usage

[![$ npm install audio-waveform](http://nodei.co/npm/audio-waveform.png?mini=true)](http://npmjs.org/package/audio-waveform)


```js
import Waveform from 'audio-waveform';
import Generator from 'audio-generator';


//create waveform painter
var plotter = new Waveform();

//place plotter element to the DOM (optionally)
document.body.appendChild(plotter.element);


//send audio-stream to the painter
var stream = new Generator(function (time) {
	return Math.sin(Math.PI * 2 * 440 * time);
});
stream.pipe(plotter);
```

## Related

> [audio-stat](https://npmjs.org/package/audio-stat) — render any kind of audio info: waveform, spectrogram etc.<br/>
> [boscillate](https://www.npmjs.com/package/boscillate) — paint soundwave in terminal for baudio.<br/>
> [drawille](https://github.com/madbence/node-drawille) — paint in terminal with braille characters.<br/>