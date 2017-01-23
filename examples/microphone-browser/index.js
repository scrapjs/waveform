'use strict'

const waveform     = require('../../')
const waveRecorder = require('wave-recorder')


const CHANNEL_COUNT = 1
const SAMPLE_RATE = 44100

const drawer = waveform({
  size: SAMPLE_RATE * 0.5,
  // offset: 0,
  bufferSize: SAMPLE_RATE * 5
})


function getUserMedia(callback, error)
{
  try {
    navigator.getUserMedia = 
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
    navigator.getUserMedia({ audio: true, video: false }, callback, error)
  } catch (e) {
    alert('getUserMedia threw exception :' + e)
  }
}

function gotStream(stream)
{ 
  var audioContext = new AudioContext()
  var audioInput = audioContext.createMediaStreamSource(stream)

  // create the recorder instance 
  var recorder = waveRecorder(audioContext, {
    channels: CHANNEL_COUNT,
    bitDepth: 16
  })

  const isMobile = false
  const op = {
    log: true,
    minDecibels: -40,
    fontRatio: isMobile ? 1.05 : 1,
    rows: isMobile ? 4 : 7
    // samples: data
  }
  audioInput.connect(recorder.input, op)

  recorder.pipe(drawer)
}

getUserMedia(gotStream, function(err) {
  console.error("There was an error accessing audio input. Please check.")
})

document.documentElement.appendChild(drawer.canvas)
