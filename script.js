const { randomUUID } = new ShortUniqueId({ length: 10 });

const video = document.querySelector('video')
const recordBtnCont = document.querySelector('.record-btn-cont')
const recordBtn = document.querySelector('.record-btn')
const captureBtnCont = document.querySelector(".capture-btn-cont")
const captureBtn = document.querySelector(".capture-btn")
const timer = document.querySelector('.timer')
const allFilters = document.querySelectorAll('.filter')
const filterLayer = document.querySelector('.filter-layer')

let recordFlag = false
let recorder;
let chunks = []
let transparentColor = "transparent";

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
      
      if(db){
        let videoID = randomUUID()
        let dbTransaction = db.transaction("video", "readwrite")
        let videoStore = dbTransaction.objectStore("video");
        let videoEntry = {
          id: `vid-${videoID}`,
          blobData: blob
        }
        videoStore.add(videoEntry)
      }
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

captureBtnCont.addEventListener('click', ()=>{
  captureBtn.classList.add('scale-capture')
  
  const canvas = document.createElement('canvas')
  canvas.height = video.videoHeight
  canvas.width = video.videoWidth
  
  let tool = canvas.getContext('2d')
  tool.drawImage(video, 0, 0, canvas.width, canvas.height)
  //filltreing
  tool.fillStyle = transparentColor
  tool.fillRect(0, 0, canvas.width, canvas.height)
  
  let imageURL = canvas.toDataURL()
  if(db){
    let imageID = randomUUID()
    let dbTransaction = db.transaction("image", "readwrite")
    let imageStore = dbTransaction.objectStore("image");
    let imageEntry = {
      id: `img-${imageID}`,
      url: imageURL
    }
    imageStore.add(imageEntry)
  }
  setTimeout(()=>{
    captureBtn.classList.remove('scale-capture')
  }, 500)
})

allFilters.forEach((filterElem)=>{
  filterElem.addEventListener("click",()=>{
    transparentColor = getComputedStyle(filterElem).getPropertyValue('background-color')
    filterLayer.style.backgroundColor = getComputedStyle(filterElem).getPropertyValue('background-color')
  })
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