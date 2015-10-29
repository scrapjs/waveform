/**
 * Draw waveform in terminal
 *
 * @module  audio-waveform
 */

var inherits = require('inherits');
var Transform = require('stream').Transform;
var pcm = require('pcm-util');
var extend = require('xtend/mutable');
var Canvas = require('drawille');
var line = require('bresenham')



/**
 * @constructor
 */
function Waveform (options) {
	if (!(this instanceof Waveform)) return new Waveform(options);

	Transform.call(this);

	extend(this, options);

	var self = this;

	//set canvas props according to terminal size
	self.width = process.stdout.columns * 2 - 2;
	self.height = process.stdout.rows * 4;
	self.canvas = new Canvas(self.width, self.height);
	self.canvasSet = self.canvas.set.bind(self.canvas);

	//update params on resize
	process.stdout.on('resize', function () {
		self.width = process.stdout.columns * 2;
		self.height = process.stdout.rows * 4;
		self.canvas = new Canvas(self.width, self.height);
		self.canvasSet = self.canvas.set.bind(self.canvas);
	});

	//data buffer to draw - by default is filled with zeros
	self.data = [];

	//plan rendering of buffer
	self.interval = setInterval(function () {
		self.update();
	}, 1000 / self.framesPerSecond);
}

inherits(Waveform, Transform);


/** Get default format properties */
extend(Waveform.prototype, pcm.defaultFormat);


/** Number of channel to display */
Waveform.prototype.channel = 0;


/** Size of a sliding window */
Waveform.prototype.size = 1024;


/** Max size of a buffer - 1 mins, change if required more */
Waveform.prototype.bufferSize = 44100 * 60;


/** How often to update */
Waveform.prototype.framesPerSecond = 20;


/** Offset of a window to render */
Waveform.prototype.offset;


/** Catch the chunk */
Waveform.prototype._transform = function (chunk, enc, cb) {
	var self = this;
	var channelData = pcm.getChannelData(chunk, self.channel, self);

	//shift data
	self.data = self.data.concat(channelData);

	//ensure window size
	self.data = self.data.slice(-self.bufferSize);

	//release the chunk to prevent blocking pipes
	cb(null, chunk);
}


/** Update canvas */
Waveform.prototype.update = function () {
	var self = this;


	//display through width iteration
	var offset = self.offset;
	if (offset == null) {
		offset = self.data.length - self.size;
	}

	self.canvas.clear();

	var amp = self.height / 2;

	var channelData = self.data.slice(offset, offset + self.size);

	var step = self.size / self.width;
	var middle = amp;

	var prevI = 0;
	var prevSample = 0;

	for (var i = 0; i < self.width; i++) {
		var sampleNumber = Math.round(step * i);

		//ignore undefined data
		if (channelData[sampleNumber] == null) continue;

		var sample = pcm.convertSample(channelData[sampleNumber], self, {float: true});

		if (self.line) {
			line(i, - sample * amp + middle, prevI, - prevSample * amp + middle, self.canvasSet);
		}
		else {
			self.canvas.set(i, - sample * amp + middle);
		}

		prevI = i;
		prevSample = sample;
	}

	process.stdout.write(self.canvas.frame());
}


module.exports = Waveform;