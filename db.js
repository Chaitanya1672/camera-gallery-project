
let db;
let openRequest = indexedDB.open('cameraGalleryDB')

openRequest.addEventListener("success",(e)=>{
  db = openRequest.result
  console.log('open db success');
})

openRequest.addEventListener("error",(e)=>{
  console.log("db error");
})

openRequest.addEventListener("upgradeneeded", (e)=>{
  db = openRequest.result
  console.log('db upgraded')
  db.createObjectStore('video', {keyPath: "id"})
  db.createObjectStore('image', {keyPath: "id"})
})