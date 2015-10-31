/**
 * Draw waveform in terminal/canvas
 *
 * @module  audio-waveform
 */

var inherits = require('inherits');
var pcm = require('pcm-util');
var RenderStream = require('audio-render');


/**
 * @constructor
 */
function Waveform (options) {
	if (!(this instanceof Waveform)) return new Waveform(options);

	RenderStream.call(this, options);
}

inherits(Waveform, RenderStream);


/** Offset of a sliding window */
Waveform.prototype.offset;


/** Size of a sliding window */
Waveform.prototype.size = 1024;


/** Draw in canvas */
Waveform.prototype.render = function (canvas, data) {
	var self = this;

	var offset = self.offset;

	//if offset is undefined - show last piece of data
	if (offset == null) {
		offset = data.length - self.size;
		if (offset < 0) offset = 0;
	}

	var context = canvas.getContext('2d');

	context.clearRect(0, 0, canvas.width, canvas.height);

	var amp = canvas.height / 2;

	var frameData = data.slice(offset, offset + self.size);

	var step = self.size / canvas.width;
	var middle = amp;

	context.beginPath();
	context.moveTo(0, middle);

	for (var i = 0; i < canvas.width; i++) {
		var sampleNumber = Math.round(step * i);
		var sample = frameData[sampleNumber];

		//ignore undefined data
		if (sample == null) continue;

		context.lineTo(i, -sample * amp + middle);
	}

	context.stroke();
}


module.exports = Waveform;