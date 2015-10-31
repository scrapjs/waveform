var Generator = require('audio-generator');
var Waveform = require('./');
var Speaker = require('audio-speaker');

var duration = 5;
var drawer;

Generator({
	generate: function (time) {
		return [
			(1 - time/duration) * Math.sin(Math.PI * 2 * 100 * time)/2
		]
	},
	duration: duration
}).pipe(drawer = Waveform({
	size: 44100 * 0.5,
	// offset: 0,
	bufferSize: 44100 * 5
}))
.on('render', function (canvas) {
	if (process.stdout) {
		process.stdout.write(canvas._canvas.frame());
	}
})
.pipe(Speaker());


if (typeof document !== 'undefined') {
	document.documentElement.appendChild(drawer.canvas)
}