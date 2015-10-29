var Generator = require('audio-generator');
var Waveform = require('./');
var Speaker = require('speaker');

Generator(function (time) {
	return [
		Math.sin(Math.PI * 2 * 100 * time)/2
	]
}).pipe(Waveform({
	framesPerSecond: 20,
	size: 1024,
	offset: 0,
	bufferSize: 44100 * 5,
	line: true
})).pipe(Speaker());