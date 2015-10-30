var Generator = require('audio-generator');
var Waveform = require('./');
var Speaker = require('speaker');

var duration = 5;

Generator({
	generate: function (time) {
		return [
			(1 - time/duration) * Math.sin(Math.PI * 2 * 100 * time)/2
		]
	},
	duration: duration
}).pipe(Waveform({
	framesPerSecond: 20,
	size: 44100 / duration,
	// offset: 0,
	bufferSize: 44100 * duration / 2,
	line: true
})).pipe(Speaker());