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

	//nothing bad in creating canvas each time anew, to accord to terminal size
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
	self.data = Array(self.windowSize);

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
Waveform.prototype.windowSize = 1024;


/** How often to update */
Waveform.prototype.framesPerSecond = 20;


/** Catch the chunk */
Waveform.prototype._transform = function (chunk, enc, cb) {
	var self = this;
	var channelData = pcm.getChannelData(chunk, self.channel, self);

	//shift data
	self.data = self.data.concat(channelData);

	//ensure window size
	self.data = self.data.slice(-self.windowSize);

	//release the chunk to prevent blocking pipes
	cb(null, chunk);
}


/** Update canvas */
Waveform.prototype.update = function () {
	var self = this;

	self.canvas.clear();

	var amp = self.height / 2;

	var channelData = self.data;
	var step = channelData.length / self.width;
	var middle = amp;

	var prevI = 0;
	var prevSample = 0;

	//display through width iteration
	for (var i = 0; i < self.width; i++) {
		var sampleNumber = Math.round(step * i);

		if (channelData[sampleNumber] == null) continue;

		var sample = pcm.convertSample(channelData[sampleNumber], self, {float: true});

		if (self.line) {
			line(i, sample * amp + middle, prevI, prevSample * amp + middle, self.canvasSet);
		}
		else {
			self.canvas.set(i, sample * amp + middle);
		}

		prevI = i;
		prevSample = sample;
	}

	process.stdout.write(self.canvas.frame());
}


module.exports = Waveform;