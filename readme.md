Draw audio signal waveform, both in browser or node.

## Usage

[![$ npm install audio-waveform](http://nodei.co/npm/audio-waveform.png?mini=true)](http://npmjs.org/package/audio-waveform)


```js
import Waveform from 'audio-waveform';
import Generator from 'audio-generator';
import Speaker from 'audio-speaker';


//create waveform painter
var plotter = new Waveform({
	//what channel to display, 0 - L, 1 - R
	channel: 0,

	//size of a sliding window to display, number of samples
	size: 1024,

	//offset of a window to display, if undefined - the last piece of data is shown
	offset: undefined,

	//how often to update display (node only)
	framesPerSecond: 20,

	//line or point draw style
	line: true,

	//size of a waveform data to store
	bufferSize: 44100,

	//canvas element to render (optional)
	canvas: undefined

	//...pcm-format options, see pcm-util below
});

var speaker = Speaker();

//place plotter element to the DOM (optionally)
document.body.appendChild(plotter.element);


//send audio-stream to the painter
var stream = new Generator(function (time) {
	return Math.sin(Math.PI * 2 * 440 * time);
});

stream.pipe(speaker);
stream.pipe(plotter);
```

## Related

> [pcm-util](https://npmjs.org/package/pcm-util) — utils for working with pcm-streams.<br/>
> [audio-render](https://npmjs.org/package/audio-render) — generic class for implementing any audio-stream rendering.<br/>
> [audio-stat](https://npmjs.org/package/audio-stat) — render any kind of audio info: waveform, spectrogram etc.<br/>
> [boscillate](https://www.npmjs.com/package/boscillate) — paint soundwave in terminal for baudio. API is highly inspired by that.<br/>
> [drawille](https://github.com/madbence/node-drawille) — paint in terminal with braille characters.<br/>