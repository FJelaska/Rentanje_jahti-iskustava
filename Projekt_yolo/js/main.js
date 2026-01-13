document.addEventListener("DOMContentLoaded", () => {
    initDestionationSlider();
    initReferencesSlider();
});

function initDestionationSlider() {
  const slider = document.querySelector(".slider");
  const brac = document.querySelector(".brac");
  const hvar = document.querySelector(".hvar");
  const vis = document.querySelector(".vis");
  const arrowLeft = document.querySelector(".arrowLeft1");
  const arrowRight = document.querySelector(".arrowRight1");
  let slideWidth = 325;

  function handleQueryChange(mediaQuery) {
    if (mediaQuery.matches) {
      slideWidth = 500;
    }
  }
  const mediaQuery = window.matchMedia('(max-width: 1024px)');
  handleQueryChange(mediaQuery);
  mediaQuery.addListener(handleQueryChange);

  function handleQueryChange2(mediaQuery2) {
    if (mediaQuery2.matches) {
      slideWidth = 380;
    }
  }
  const mediaQuery2 = window.matchMedia('(max-width: 768px)');
  handleQueryChange2(mediaQuery2);
  mediaQuery2.addListener(handleQueryChange2);

  function handleQueryChange3(mediaQuery3) {
    if (mediaQuery3.matches) {
      slideWidth = 500;
    }
  }
  const mediaQuery3 = window.matchMedia('(max-width: 470px)');
  handleQueryChange3(mediaQuery3);
  mediaQuery3.addListener(handleQueryChange3);


  let currentTranslateX = 0;

  arrowLeft.addEventListener("click", function () {
      if (currentTranslateX < 0) {
          currentTranslateX += slideWidth;
          brac.style.transform = `translateX(${currentTranslateX}px)`;
          hvar.style.transform = `translateX(${currentTranslateX}px)`;
          vis.style.transform = `translateX(${currentTranslateX}px)`;
      }
      arrowRight.style.opacity = 1;
      if (currentTranslateX >= 0) {
          arrowLeft.style.opacity = 0.2;
      }
  });

  arrowRight.addEventListener("click", function () {
      const maxTranslateX = -(slider.children.length - 1) * slideWidth;
      if (currentTranslateX > maxTranslateX) {
          currentTranslateX -= slideWidth;
          brac.style.transform = `translateX(${currentTranslateX}px)`;
          hvar.style.transform = `translateX(${currentTranslateX}px)`;
          vis.style.transform = `translateX(${currentTranslateX}px)`;
      }
      arrowLeft.style.opacity = 1;
      if (currentTranslateX <= maxTranslateX) {
          arrowRight.style.opacity = 0.2;
      }
  });
};

function initReferencesSlider() {
  const slider = document.querySelector(".slider2");
  const slides = document.querySelectorAll(".slider2 .box");
  const arrowLeft = document.querySelector(".arrowLeft2");
  const arrowRight = document.querySelector(".arrowRight2");
  let slideWidth = 468;
  function handleQueryChange(mediaQuery) {
    if (mediaQuery.matches) {
      slideWidth = 700;
    }
  }
  const mediaQuery = window.matchMedia('(max-width: 1024px)');
  handleQueryChange(mediaQuery);
  mediaQuery.addListener(handleQueryChange);

  function handleQueryChange2(mediaQuery2) {
    if (mediaQuery2.matches) {
      slideWidth = 480;
    }
  }
  const mediaQuery2 = window.matchMedia('(max-width: 768px)');
  handleQueryChange2(mediaQuery2);
  mediaQuery2.addListener(handleQueryChange2);

  function handleQueryChange3(mediaQuery3) {
    if (mediaQuery3.matches) {
      slideWidth = 530;
    }
  }
  const mediaQuery3 = window.matchMedia('(max-width: 470px)');
  handleQueryChange3(mediaQuery3);
  mediaQuery3.addListener(handleQueryChange3);

  function handleQueryChange4(mediaQuery4) {
    if (mediaQuery4.matches) {
      slideWidth = 430;
    }
  }
  const mediaQuery4 = window.matchMedia('(max-width: 375px)');
  handleQueryChange4(mediaQuery4);
  mediaQuery4.addListener(handleQueryChange4);


  let currentIndex = 0;

  arrowLeft.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      const translateX = -currentIndex * slideWidth;
      slider.style.transform = `translateX(${translateX}px)`;
    }
    updateArrowVisibility();
  });

  arrowRight.addEventListener("click", function () {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      const translateX = -currentIndex * slideWidth;
      slider.style.transform = `translateX(${translateX}px)`;
    }
    updateArrowVisibility();
  });

  function updateArrowVisibility() {
    arrowLeft.style.opacity = currentIndex > 0 ? 1 : 0.2;
    arrowRight.style.opacity = currentIndex < slides.length - 1 ? 1 : 0.2;
  }
};