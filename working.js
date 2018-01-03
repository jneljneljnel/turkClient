var recordButton, stopButton, recorder, submitButton;
var blob = [];
var url = {
  heroku : "https://dmaiaudio.herokuapp.com/api/kb8",
  dev : "http://localhost:3300/api/kb8"
}
var options = {mimeType: 'audio/webm'};
var random = Math.floor((Math.random() * 2) + 1);
var randomFile = Math.floor((Math.random() * 3) + 1);
var filename, word;

if (randomFile == 1){
  word = "Ball";
  filename = "images/ball.png";
}
else if (randomFile == 2) {
  word = "Bee";
  filename = "images/bee.png";
}
else{
  word = "Can";
  filename = "images/can.png"
}

var isSecureOrigin = location.protocol === 'https:' ||
location.hostname === 'localhost';
if (!isSecureOrigin) {
  alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
    '\n\nChanging protocol to HTTPS');
  location.protocol = 'HTTPS';
}

document.getElementById("image").src = filename;
document.getElementById("secondImage").src = filename;
document.getElementById('singular').innerHTML = word
document.getElementById('plural').innerHTML = word + "s"

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
    recorder = new MediaRecorder(stream, options);
    recorder.addEventListener('dataavailable', onRecordingReady);
  });
};

function validate(){
  var tag = document.getElementById('tag').value
  var audio = document.getElementById('audio');
  if(tag.length > 2 && audio.src){
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
  var audio = document.getElementById('audio');
  var tag = document.getElementById('tag').value
  blob.push(e.data);
  audio.src = URL.createObjectURL(e.data);
  audio.play();
}

function post(){
  var audio = document.getElementById('audio')
  var tag = document.getElementById('tag').value
  var formData = new FormData()
   formData.append('source', blob[0]);
   formData.append('plural', random);
   formData.append('tag', tag);
   formData.append('fileId', randomFile);
   console.log("POST", blob[0], blob[0].size);
  $.ajax({
    url: 'http://localhost:3300/api/kb8',
    type: "POST",
    data:formData,
    processData: false,
    contentType: false,
    success: function(data) {
            console.log(data);
    }
  });

}
