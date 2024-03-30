setTimeout(() => {
  if (db) {
    // videos retrieval
    const dbTransaction = db.transaction("video", "readonly");
    const videoStore = dbTransaction.objectStore("video");
    const videoRequest = videoStore.getAll();
    videoRequest.onsuccess = (e) => {
      const galleryCont = document.querySelector(".gallery-cont");
      const videoResult = videoRequest.result;

      console.log(videoResult);
      videoResult.forEach((video) => {
        const videoUrl = URL.createObjectURL(video.blobData);
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", video.id);

        mediaElem.innerHTML = `
          <div class="media">
            <video autoplay loop src="${videoUrl}"></video>
          </div>
          <div class="delete action-btn">DELETE</div>
          <div class="download action-btn">DOWNLOAD</div>
        `;

        galleryCont.appendChild(mediaElem);

        // Listeners
        let deleteBtn = mediaElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteListener);
        let downloadBtn = mediaElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListener);
      });
    };

    // image retrieval
    const imageDbTransaction = db.transaction("image", "readonly");
    const imageStore = imageDbTransaction.objectStore("image");
    const imageRequest = imageStore.getAll();
    imageRequest.onsuccess = (e) => {
      const galleryCont = document.querySelector(".gallery-cont");
      const imageResult = imageRequest.result;

      console.log(imageResult);
      imageResult.forEach((image) => {
        const imageUrl = image.url;
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", image.id);

        mediaElem.innerHTML = `
          <div class="media">
            <img src="${imageUrl}" />
          </div>
          <div class="delete action-btn">DELETE</div>
          <div class="download action-btn">DOWNLOAD</div>
        `;

        galleryCont.appendChild(mediaElem);

        // Listeners
        let deleteBtn = mediaElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteListener);
        let downloadBtn = mediaElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListener);
      });
    };
  }
}, 50);

// UI remove, DB remove
function deleteListener(e) {
  // DB removal
  let id = e.target.parentElement.getAttribute("id");
  let type = id.slice(0, 3);
  if (type === "vid") {
    let videoDBTransaction = db.transaction("video", "readwrite");
    let videoStore = videoDBTransaction.objectStore("video");
    videoStore.delete(id);
  } else if (type === "img") {
    let imageDBTransaction = db.transaction("image", "readwrite");
    let imageStore = imageDBTransaction.objectStore("image");
    imageStore.delete(id);
  }
  // UI removal
  e.target.parentElement.remove();
}

function downloadListener(e) {
  let id = e.target.parentElement.getAttribute("id");
  let type = id.slice(0, 3);
  if (type === "vid") {
    let videoDBTransaction = db.transaction("video", "readwrite");
    let videoStore = videoDBTransaction.objectStore("video");
    let videoRequest = videoStore.get(id);
    videoRequest.onsuccess = (e) => {
      let videoResult = videoRequest.result;

      let videoURL = URL.createObjectURL(videoResult.blobData);

      let a = document.createElement("a");
      a.href = videoURL;
      a.download = "stream.mp4";
      a.click();
    };
  } else if (type === "img") {
    let imageDBTransaction = db.transaction("image", "readwrite");
    let imageStore = imageDBTransaction.objectStore("image");
    let imageRequest = imageStore.get(id);
    imageRequest.onsuccess = (e) => {
      let imageResult = imageRequest.result;

      let a = document.createElement("a");
      a.href = imageResult.url;
      a.download = "image.jpg";
      a.click();
    };
  }
}
