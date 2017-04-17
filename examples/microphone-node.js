'use strict'

const waveform = require('../')
const mic      = require('mic')


const CHANNEL_COUNT = 1
const SAMPLE_RATE = 44100

const drawer = waveform({
  size: SAMPLE_RATE * 0.5,
  // offset: 0,
  bufferSize: SAMPLE_RATE * 5
})

const micInstance = mic({ 'rate': SAMPLE_RATE.toString(), 'channels': CHANNEL_COUNT.toString(), 'debug': false, 'exitOnSilence': 0 })


micInstance.getAudioStream()
  .pipe(drawer)
  .on('render', function (canvas) {
    if (process.stdout) {
      process.stdout.write(canvas._canvas.frame())
    }
  })

micInstance.start()
