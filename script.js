const video = document.querySelector('video')
const recordBtnCont = document.querySelector('.record-btn-cont')
const recordBtn = document.querySelector('.record-btn')
const captureBtnCont = document.querySelector(".capture-btn-cont")
const captureBtn = document.querySelector(".capture-btn")
const timer = document.querySelector('.timer')

let recordFlag = false
let recorder;
let chunks = []

let counter = 0
let timerID;

let constraints = {
  video: true,
  audio: true
}

navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    video.srcObject = stream
    
    recorder = new MediaRecorder(stream)
    
    recorder.addEventListener('start', ()=>{
      chunks = []
    })
  
    recorder.addEventListener('dataavailable', (e)=>{
      chunks.push(e.data)
    })
    
    recorder.addEventListener('stop',()=>{
      let blob = new Blob(chunks, { type: 'video' })
      let videoURL = URL.createObjectURL(blob)
      
      let a = document.createElement('a')
      a.href = videoURL
      a.download = 'stream.mp4'
      a.click()
    })
  })
  
recordBtnCont.addEventListener('click', (e) => {
  if(!recorder) return
  recordFlag = !recordFlag
  
  if (recordFlag) {
    recorder.start();
    recordBtn.classList.add('scale-record');
    startTimer()
  } else{
    recorder.stop()
    recordBtn.classList.remove('scale-record')
    stopTimer()
  }
})

captureBtn.addEventListener('click', ()=>{
  const canvas = document.createElement('canvas')
  canvas.height = video.videoHeight
  canvas.width = video.videoWidth
  
  let tool = canvas.getContext('2d')
  tool.drawImage(video, 0, 0, canvas.width, canvas.height)
  
  let imageURL = canvas.toDataURL()
  let a = document.createElement('a')
  a.href = imageURL
  a.download = "cameraImage.jpg"
  a.click()
})

function displayTimer() {
  let totalSeconds = counter
  let hours = Number.parseInt(totalSeconds/3600)
  totalSeconds = totalSeconds % 3600
  let minutes = Number.parseInt(totalSeconds/60)
  totalSeconds = totalSeconds % 60
  let seconds = totalSeconds
  
  hours = (hours < 10) ? `0${hours}` : hours
  minutes = (minutes < 10) ? `0${minutes}` : minutes
  seconds = (seconds < 10) ? `0${seconds}` : seconds
  timer.innerText = `${hours}:${minutes}:${seconds}`
  counter++
}

function startTimer() {
  timer.style.display = "block"
  timerID = setInterval(displayTimer, 1000); 
}

function stopTimer() {
  timer.style.display = "none"
  clearInterval(timerID)
  timer.innerHTML = "00:00:00"
}