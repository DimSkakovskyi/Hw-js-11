import { DEFAULT_SETTINGS, ELEMENT_IDS, CSS_CLASSES, KEYBOARD_CODES } from "./helpers/config.js";

class Carousel {
  //Private state variables
  #currentSlide;
  #timerId;

  //Private DOM elements
  #pauseBtn;
  #nextBtn;
  #prevBtn;
  #indicatorsContainer;
  #indicatorsItems;
  #playIcon;
  #pauseIcon;

  //Private contsnts
  #SLIDES_COUNT;
  #CODE_ARROW_RIGHT;
  #CODE_ARROW_LEFT;
  #CODE_SPACE;
  #FA_PAUSE;
  #FA_PLAY;
  #FA_PREV;
  #FA_NEXT;

  constructor(options) {
    const settings = {
      ...DEFAULT_SETTINGS, ...options
    };

    this.container = document.querySelector(`${settings.containerId}`);
    this.slides = this.container.querySelectorAll(`${settings.slideId}`);
    if (!this.slides[0].classList.contains('active')) {
      this.slides[0].classList.add('active');
    };
    this.TIMER_INTERVAL = options.interval || DEFAULT_SETTINGS.TIMER_INTERVAL;
    this.isPlaying = settings.isPlaying;
    this.pauseOnHover = Boolean(settings.pauseOnHover);
  }

  #initProps() {
    this.#currentSlide = 0;

    this.#SLIDES_COUNT = this.slides.length;
    this.#CODE_ARROW_RIGHT = KEYBOARD_CODES.RIGHT_ARROW;
    this.#CODE_ARROW_LEFT = KEYBOARD_CODES.LEFT_ARROW;
    this.#CODE_SPACE = KEYBOARD_CODES.SPACE;
    this.#FA_PAUSE = '<i id="fa-pause-icon" class="fas fa-pause"></i>';
    this.#FA_PLAY = '<i id="fa-play-icon" class="fas fa-play"></i>';
    this.#FA_PREV = '<i id="fa-prev-icon" class="fas fa-chevron-left"></i>';
    this.#FA_NEXT = '<i id="fa-next-icon" class="fas fa-chevron-right"></i>';

  }

  #initControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add(CSS_CLASSES.CONTROLS);
    controlsContainer.setAttribute('id', ELEMENT_IDS.CONTROLS);

    const PAUSE_BTN = `<div class="control control-pause" id="${ELEMENT_IDS.PAUSE_BTN}">
     ${this.#FA_PAUSE}${this.#FA_PLAY}
    </div>`;

    const PREV_BTN = `<div class="control control-prev" id="${ELEMENT_IDS.PREV_BTN}">
      ${this.#FA_PREV}
    </div>`;

    const NEXT_BTN = `<div class="control control-next" id="${ELEMENT_IDS.NEXT_BTN}">
      ${this.#FA_NEXT}
    </div>`;

    controlsContainer.innerHTML = PAUSE_BTN + PREV_BTN + NEXT_BTN;

    this.container.append(controlsContainer);

    this.#pauseBtn = this.container.querySelector(`#${ELEMENT_IDS.PAUSE_BTN}`);
    this.#nextBtn = this.container.querySelector(`#${ELEMENT_IDS.NEXT_BTN}`);
    this.#prevBtn = this.container.querySelector(`#${ELEMENT_IDS.PREV_BTN}`);

    this.#pauseIcon = this.#pauseBtn.querySelector('#fa-pause-icon');
    this.#playIcon = this.#pauseBtn.querySelector('#fa-play-icon');

    this.#pauseIcon.style.opacity = this.isPlaying ? 1 : 0;
    this.#playIcon.style.opacity = this.isPlaying ? 0 : 1;
  }

  #initIndicators() {
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.classList.add(CSS_CLASSES.INDICATORS);
    indicatorsContainer.setAttribute('id', ELEMENT_IDS.INDICATORS_CONTAINER);

    this.container.append(indicatorsContainer);

    for (let i = 0; i < this.#SLIDES_COUNT; i++) {
      const indicator = document.createElement('div');
      indicator.setAttribute('class', i ? CSS_CLASSES.INDICATOR : CSS_CLASSES.INDICATOR_ACTIVE);
      indicator.dataset.slideTo = `${i}`;

      indicatorsContainer.append(indicator);
    }

    this.#indicatorsContainer = this.container.querySelector(`#${ELEMENT_IDS.INDICATORS_CONTAINER}`);
    this.#indicatorsItems = this.container.querySelectorAll(`.${CSS_CLASSES.INDICATOR}`);
  }

  #initEventListeners() {
    this.#pauseBtn.addEventListener('click', this.pausePlay.bind(this));
    this.#nextBtn.addEventListener('click', this.next.bind(this));
    this.#prevBtn.addEventListener('click', this.prev.bind(this));
    this.#indicatorsContainer.addEventListener('click', this.#indicatorClickHandler.bind(this));
    document.addEventListener('keydown', this.#keydown.bind(this));
 }

  #gotoNth(n) {
    console.log(`${this.#currentSlide} - Going to slide: ${n}`);
    this.slides[this.#currentSlide].classList.toggle(CSS_CLASSES.ACTIVE);
    this.#indicatorsItems[this.#currentSlide].classList.toggle(CSS_CLASSES.ACTIVE);
    this.#currentSlide = (n + this.#SLIDES_COUNT) % this.#SLIDES_COUNT;
    this.slides[this.#currentSlide].classList.toggle(CSS_CLASSES.ACTIVE);
    this.#indicatorsItems[this.#currentSlide].classList.toggle(CSS_CLASSES.ACTIVE);
  }

  #goToNext() {
    this.#gotoNth(this.#currentSlide + 1);
  }

  #goToPrev() {
    this.#gotoNth(this.#currentSlide - 1);
  }

  #tick() {
    clearInterval(this.#timerId);
    this.#timerId = setInterval(() => this.#goToNext(), this.TIMER_INTERVAL);
  }

  #onMouseEnter = () => { this.pause(); };
  #onMouseLeave = () => { this.play();  };


  #indicatorClickHandler(e) {
    const target = e.target;

    if (target && target.classList.contains(CSS_CLASSES.INDICATOR)) {
      this.pause();
      this.#gotoNth(+target.dataset.slideTo);
    }
  }

  #keydown(e) {
    const { code } = e;
    if (code === this.#CODE_ARROW_RIGHT) this.next();
    if (code === this.#CODE_ARROW_LEFT)  this.prev();
    if (code === this.#CODE_SPACE) {
      e.preventDefault();
      this.pausePlay();
    }
  }

  init() { 
    this.#initProps();
    this.#initControls();
    this.#initIndicators();
    this.#initEventListeners();
    if (this.pauseOnHover) {
      this.container.addEventListener('mouseenter', this.#onMouseEnter);
      this.container.addEventListener('mouseleave', this.#onMouseLeave);
    }

    if (this.isPlaying) this.#tick();
  }

  play() {
    if(this.isPlaying) return;  
    this.isPlaying = true;
    this.#pauseIcon.style.opacity = 1;
    this.#playIcon.style.opacity = 0;
    this.#tick();
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.#pauseIcon.style.opacity = 0;
    this.#playIcon.style.opacity = 1;
    clearInterval(this.#timerId);
  }

  pausePlay() {
    this.isPlaying ? this.pause() : this.play();
  }

  prev() {
    this.pause();
    this.#goToPrev();
  }

  next() {
    this.pause();
    this.#goToNext();
  }
}

export default Carousel;