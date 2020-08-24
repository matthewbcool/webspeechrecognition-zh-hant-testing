var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var colors = [
  ['black', '黑色'],
  ['blue', '藍色'],
  ['brown', '棕色'],
  ['green', '綠色'],
  ['pink', '粉紅色'],
  ['purple', '紫色'],
  ['red', '紅色'],
  ['white', '白色'],
  ['yellow', '黃色'],
]

const colorMap = {
  紅色: 'red',
  粉紅色: 'pink',
  橙色: 'orange',
  綠色: 'green',
  白色: 'white',
  棕色: 'brown',
  黑色: 'black',
  黃色: 'yellow',
  紫色: 'purple',
  藍色: 'blue',
}

var grammar =
  '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

var recognition = new SpeechRecognition()
var speechRecognitionList = new SpeechGrammarList()
speechRecognitionList.addFromString(grammar, 1)
recognition.grammars = speechRecognitionList
recognition.continuous = false
recognition.lang = 'zh-Hant'
recognition.interimResults = false
recognition.maxAlternatives = 1

var diagnostic = document.querySelector('.output')
var bg = document.querySelector('html')
var hints = document.querySelector('.hints')

var colorHTML = ''
colors.forEach(function (v, i, a) {
  colorHTML +=
    '<span style="background-color:' + v[0] + ';"> ' + v[0] + ' </span>'
})
hints.innerHTML =
  'How many of these colors can you say in Mandarin? ' + colorHTML

document.body.onclick = function () {
  recognition.start()
  console.log('Ready to receive a color command.')
}

recognition.onresult = function (event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  var color = event.results[0][0].transcript
  diagnostic.textContent = 'Result received: ' + color + '.'
  color = color.toString()

  bg.style.backgroundColor = colorMap[color]
  console.log('Confidence: ' + event.results[0][0].confidence)
}

recognition.onspeechend = function () {
  recognition.stop()
}

recognition.onnomatch = function (event) {
  diagnostic.textContent = "I didn't recognise that color."
}

recognition.onerror = function (event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error
}
