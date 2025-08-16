function Carousel() {}

Carousel.prototype = {
  _initProps() {
    this.container = document.querySelector('#carousel');
    this.slidesContainer = this.container.querySelector('#slides-container');
    this.slides = this.container.querySelectorAll('.slide');
  
    this.SLIDES_COUNT = this.slides.length;
    this.CODE_ARROW_RIGHT = 'ArrowRight';
    this.CODE_ARROW_LEFT = 'ArrowLeft';
    this.CODE_SPACE = 'Space';
    this.FA_PAUSE = '<i class="fas fa-pause"></i>';
    this.FA_PLAY = '<i class="fas fa-play"></i>';
    this.FA_PREV = '<i class="fas fa-chevron-left"></i>';
    this.FA_NEXT = '<i class="fas fa-chevron-right"></i>';
    this.TIMER_INTERVAL = 2000;
    this.SWIPE_THRESHOLD = 100;
  
    this.currentSlide = 0;
    this.isPlaying = true;
    this.timerId = null;
    this.swipeStartX = null;
    this.swipeEndX = null;
  },

  _initControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('controls');
    controlsContainer.setAttribute('id', 'controls-container');

    const PAUSE_BTN = `<div class="control control-pause" id="pause-btn">
      ${this.FA_PAUSE}
    </div>`;

    const PREV_BTN = `<div class="control control-prev" id="prev-btn">
      ${this.FA_PREV}
    </div>`;

    const NEXT_BTN = `<div class="control control-next" id="next-btn">
      ${this.FA_NEXT}
    </div>`;

    controlsContainer.innerHTML = PAUSE_BTN + PREV_BTN + NEXT_BTN;

    this.container.append(controlsContainer);

    this.pauseButton = this.container.querySelector('#pause-btn');
    this.nextButton = this.container.querySelector('#next-btn');
    this.prevButton = this.container.querySelector('#prev-btn');
  },

  _initIndicators() {
    // <div class="indicators" id="indicators-container">
    //   <div class="indicator active" data-slide-to="0"></div>
    //   <div class="indicator" data-slide-to="1"></div>
    //   <div class="indicator" data-slide-to="2"></div>
    //   <div class="indicator" data-slide-to="3"></div>
    //   <div class="indicator" data-slide-to="4"></div>
    // </div>

    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.classList.add('indicators');
    indicatorsContainer.setAttribute('id', 'indicators-container');

    this.container.append(indicatorsContainer);

    for (let i = 0; i < this.SLIDES_COUNT; i++) {
      const indicator = document.createElement('div');
      indicator.setAttribute('class', i ? 'indicator' : 'indicator active');
      indicator.dataset.slideTo = `${i}`;
  
      indicatorsContainer.append(indicator);
    }

    this.indicatorsContainer = this.container.querySelector('#indicators-container');
    this.indicators = this.container.querySelectorAll('.indicator');
  },
  
  _initEventListeners() {
    this.pauseButton.addEventListener('click', this.pausePlayHandler.bind(this));
    this.nextButton.addEventListener('click', this.nextHandler.bind(this));
    this.prevButton.addEventListener('click', this.prevHandler.bind(this));
    this.indicatorsContainer.addEventListener('click', this._indicatorClickHandler.bind(this));
    document.addEventListener('keydown', this._keydownHandler.bind(this));
  },
  
  _goToNth(n) {
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicators[this.currentSlide].classList.toggle('active');
    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT;
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicators[this.currentSlide].classList.toggle('active');
  },
  
  _goToNext() {
    this._goToNth(this.currentSlide + 1);
  },
  
  _goToPrev() {
    this._goToNth(this.currentSlide - 1);
  },
  
  _tick() {
    this.timerId = setInterval(() => this._goToNext, this.TIMER_INTERVAL);
  },
  
  _indicatorClickHandler(e) {
    const { target } = e;
    const slideTo = +target.dataset.slideTo;
    this.pauseHandler();
    this._goToNth(slideTo);
  },
  
  _keydownHandler(e) {
    const { code } = e;
    if (code === this.CODE_ARROW_RIGHT) this.nextHandler();
    if (code === this.CODE_ARROW_LEFT)  this.prevHandler();
    if (code === this.CODE_SPACE) {
      e.preventDefault();
      this.pausePlayHandler();
    }
  },
  
  init() {
    this._initProps();
    this._initControls();
    this._initIndicators();
    this._initEventListeners();
    this._tick();
  },
  
  playHandler() {
    this.pauseButton.innerHTML = this.FA_PAUSE;   
    this.isPlaying = true;
    this._tick();
  },
  
  pauseHandler() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.pauseButton.innerHTML = this.FA_PLAY;
    clearInterval(this.timerId);
  },
  
  pausePlayHandler() {
    this.isPlaying ? this.pauseHandler() : this.playHandler();
  },
  
  prevHandler() {
    this.pauseHandler();
    this._goToPrev();
  },
  
  nextHandler() {
    this.pauseHandler();
    this._goToNext();
  }
};

Carousel.prototype.constructor = Carousel;

function SwipeCarousel() {
  Carousel.apply(this);
}

SwipeCarousel.prototype = Object.create(Carousel.prototype);
SwipeCarousel.prototype.constructor = SwipeCarousel;

SwipeCarousel.prototype._initEventListeners = function() {
  Carousel.prototype._initEventListeners.apply(this);
  this.slidesContainer.addEventListener('touchstart', this._swipeStartHandler.bind(this));
  this.slidesContainer.addEventListener('mousedown', this._swipeStartHandler.bind(this));
  this.slidesContainer.addEventListener('touchend', this._swipeEndHandler.bind(this));
  this.slidesContainer.addEventListener('mouseup', this._swipeEndHandler.bind(this));
},

SwipeCarousel.prototype._swipeStartHandler = function(e) {
  this.swipeStartX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX;
};

SwipeCarousel.prototype._swipeEndHandler = function(e) {
  this.swipeEndX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX;

  const diffX = this.swipeEndX - this.swipeStartX;
  if (diffX >  this.SWIPE_THRESHOLD) this.prevHandler();
  if (diffX < -this.SWIPE_THRESHOLD) this.nextHandler();
};

const carousel = new SwipeCarousel();
carousel.init();