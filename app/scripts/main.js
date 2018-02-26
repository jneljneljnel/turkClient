let folder = 'laugh';
let question = 'Record a laugh.';


let recordButton, stopButton, recorder, submitButton, filename, word;
let blob = [];
let url = {
  heroku : 'https://dmaiaudio.herokuapp.com/api/',
  dev : 'http://localhost:3300/api/'
}
let options = {mimeType: 'audio/ogg'};
let random = Math.floor((Math.random() * 2) + 1);
let randomFile = Math.floor((Math.random() * 3) + 1);
let posting = false;

let random5 = Math.floor(Math.random()*90000) + 10000;

if (randomFile == 1){
  word = 'Ball';
  filename = 'images/ball.png';
}
else if (randomFile == 2) {
  word = 'Bee';
  filename = 'images/bee.png';
}
else{
  word = 'Can';
  filename = 'images/can.png'
}

//for browsers that don't allow recording over http
var isSecureOrigin = location.protocol === 'https:' ||
location.hostname === 'localhost';
if (!isSecureOrigin) {
  alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
    '\n\nChanging protocol to HTTPS');
  location.protocol = 'HTTPS';
}
document.getElementById('question').innerHTML = question
document.getElementById('image').src = filename;
document.getElementById('secondImage').src = filename;
document.getElementById('singular').innerHTML = word
document.getElementById('plural').innerHTML = word + 's'

if(random == 1 ){
  document.getElementById('secondImage').style.display = 'none';
}

window.onload = function () {
  recordButton = document.getElementById('record');
  stopButton = document.getElementById('stop');
  submitButton = document.getElementById('submit');

  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  })
  .then(function (stream) {
    recordButton.disabled = false;
    submitButton.disabled = true;
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(options.mimeType + ' is not Supported');
      options = {mimeType: 'audio/ogg'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + ' is not Supported');
        options = {mimeType: 'audio/mpeg'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.log(options.mimeType + ' is not Supported');
          options = {mimeType: ''};
        }
      }
    }
    try {
      recorder = new MediaRecorder(stream, options);
    } catch (e) {
    console.error('Exception while creating MediaRecorder: ' + e);
    alert('Exception while creating MediaRecorder: '
      + e + '. mimeType: ' + options.mimeType);
    return;
  }
  recorder.addEventListener('dataavailable', onRecordingReady);

  });
};

function validate() {
  let tag = document.getElementById('tag').value
  let audio = document.getElementById('audio');
  if(tag.length > 1 && audio.src){
    submitButton.disabled = false;
  }
}

function startRecording() {
  blob = [];
  recordButton.disabled = true;
  stopButton.disabled = false;
  recorder.start();
  setTimeout(function(){
    stopRecording()
  },5001)
}

function stopRecording() {
  recordButton.disabled = false;
  stopButton.disabled = true;
  recorder.stop();
}

function onRecordingReady(e) {
  let audio = document.getElementById('audio');
  let tag = document.getElementById('tag').value
  blob.push(e.data);
  audio.src = URL.createObjectURL(e.data);
  audio.play();
}

function post(){
  let audio = document.getElementById('audio')
  let tag = document.getElementById('tag').value
  let formData = new FormData()
  let datenow = Date.now().toString()
  formData.append('filename', randomFile+'_'+random+'_'+datenow);
  formData.append('plural', random);
  formData.append('tag', tag);
  formData.append('folder', folder);
  formData.append('fileId', randomFile);
  formData.append( randomFile+'_'+random+'_'+datenow, blob[0]);
   console.log('POST', blob[0], blob[0].size);
   if(posting == false) {
     posting = true;
      $.ajax({
        url: url.heroku+'dmai'+folder,
        type: 'POST',
        data:formData,
        processData: false,
        contentType: false,
        success: function(data) {
                console.log(data);
                posting = false;
                alert('Survey code is: '+random5);

        }
      });
   }
}
