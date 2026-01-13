function myFunction() {
    let x = document.getElementById("my");
    if (!x) return;
    let y = document.getElementById("headerMain");
    let z = document.getElementById("sectionMain");

    if(x.style.width === "0%"){
      x.style.width = "100%";
      x.style.zIndex = "2";
    }else{
      x.style.width = "0%";
    }
  }

 function scrollOnClick(event) {
    event.preventDefault();
  
    const scrollPercentage = 1.08;
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * scrollPercentage;
    const currentPosition = window.scrollY;
    const targetPosition = currentPosition + scrollAmount;

    const distance = targetPosition - currentPosition;
  
    const animationDuration = 1500;
  
    let startTime = null;
  
    function scrollAnimation(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }
  
      const elapsedTime = timestamp - startTime;
  
      const progress = Math.min(elapsedTime / animationDuration, 1);
      const easedProgress = easeInOutCubic(progress);
      const newPosition = currentPosition + distance * easedProgress;
  
      window.scrollTo(0, newPosition);
  
      if (elapsedTime < animationDuration) {
        requestAnimationFrame(scrollAnimation);
      }
    }
  
    requestAnimationFrame(scrollAnimation);
  }
 
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const scrollButton = document.getElementById('scroll');
    if(scrollButton) {
        scrollButton.addEventListener('click', scrollOnClick);
    }
  });
