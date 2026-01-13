 
 let galleries = {
  specs: [
    "../../assets/img/spec1.png",
    "../../assets/img/spec2.png"
  ],
  sundeck: [
    "../../assets/img/sun2.png",
    "../../assets/img/sun3.png",
    "../../assets/img/sun4.png",
    "../../assets/img/sun5.png"
  ],
  maindeck: [
    "../../assets/img/main1.png",
    "../../assets/img/main2.png",
    "../../assets/img/main3.png",
    "../../assets/img/main4.png",
    "../../assets/img/main5.png"
  ],
  belowdeck: [
    "../../assets/img/below1.png",
    "../../assets/img/below2.png",
    "../../assets/img/below3.png",
    "../../assets/img/below4.png"
  ],
  exterior: [
    "../../assets/img/DJI_0084p.png",
    "../../assets/img/Rectangle 55.png",
    "../../assets/img/ext1.png",
    "../../assets/img/ext2.png",
    "../../assets/img/ext3.png",
    "../../assets/img/ext4.png"
  ]
};

let currentGallery = [];
let currentIndex = 0;

function openGallery(type) {
  currentGallery = galleries[type];
  currentIndex = 0;

  document.getElementById("overlayImage").src = currentGallery[currentIndex];
  document.getElementById("imageOverlay").style.display = "flex";
}

function closeGallery() {
  document.getElementById("imageOverlay").style.display = "none";
}

function nextImage() {
  currentIndex = (currentIndex + 1) % currentGallery.length;
  document.getElementById("overlayImage").src = currentGallery[currentIndex];
}

function prevImage() {
  currentIndex =
    (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  document.getElementById("overlayImage").src = currentGallery[currentIndex];
}

document.addEventListener("keydown", function (e) {
  const overlay = document.getElementById("imageOverlay");
  if(!overlay) return;

  const isOpen = overlay.style.display === "flex";
  if(!isOpen) return;

  if(e.key === "ArrowLeft") {
    e.preventDefault();
    prevImage();
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    nextImage();
  } else if (e.key === "Escape") {
    e.preventDefault();
    closeGallery();
  }
});