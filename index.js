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
	self.width = 30//process.stdout.columns * 2;
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
}

inherits(Waveform, Transform);


/** Get default format properties */
extend(Waveform.prototype, pcm.defaultFormat);


/** Catch the chunk */
Waveform.prototype._transform = function (chunk, enc, cb) {
	var channelsData = pcm.getChannelsData(chunk, this);
	var self = this;

	//release the chunk to prevent blocking pipes
	cb(null, chunk);

	//render in next frame
	setTimeout(function () {
		self.canvas.clear();

		var channelHeight = self.height / channelsData.length;
		var amp = channelHeight / 2;

		for (var channel = 0; channel < channelsData.length; channel++) {
			var channelData = channelsData[channel];
			var step = channelData.length / self.width;
			var middle = amp + channelHeight * channel;
			var prevI = 0;
			var prevSample = 0;

			for (var i = 0; i < self.width; i++) {
				var sampleNumber = Math.round(step * i);
				var sample = pcm.convertSample(channelData[sampleNumber], this, {float: true});

				self.canvas.set(i, sample * amp + middle);
				line(prevI, prevSample * amp + middle, i, sample * amp + middle, self.canvasSet);

				prevI = i;
				prevSample = sample;
			}
		}

		process.stdout.write(self.canvas.frame(''));
	}, 1);
}


module.exports = Waveform;