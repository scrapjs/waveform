var Generator = require('audio-generator');
var Waveform = require('./');
var Speaker = require('speaker');

Generator(function (time) {
	return [
		Math.sin(Math.PI * 2 * 100 * time)/2
	]
}).pipe(Waveform({
	framesPerSecond: 20,
	windowSize: 1000,
	line: false
})).pipe(Speaker());