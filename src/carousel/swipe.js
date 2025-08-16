import Carousel from './core.js';
import { DEFAULT_SETTINGS } from './helpers/config.js';

class SwipeCarousel extends Carousel {
  #swipeThreshold;
  #swipeStartX
  #swipeEndX;
  #slidesContainer;

  constructor(options) {
    const swipeSettings = {...DEFAULT_SETTINGS, ...options, swipeThreshold: 100};
    super(options);

    this.#slidesContainer = this.slides[0].parentElement;
    this.#swipeThreshold = swipeSettings.swipeThreshold;
  }

  init() {
    super.init();
    this.container.addEventListener('dragstart', this.#preventDrag);
    this.container.addEventListener('touchstart', this.#swipeStartHandler.bind(this));
    this.container.addEventListener('mousedown', this.#swipeStartHandler.bind(this));
    this.container.addEventListener('touchend', this.#swipeEndHandler.bind(this));
    this.container.addEventListener('mouseup', this.#swipeEndHandler.bind(this));
  }

  #preventDrag(e) {
    e.preventDefault();
    return false;
  }
  
  #swipeStartHandler(e) {
    const t = e.changedTouches && e.changedTouches[0];
    this.#swipeStartX =
      (t && (t.pageX ?? t.clientX)) ??
      (e.pageX ?? e.clientX) ??
      0;
  }
  
  #swipeEndHandler(e) {
    const t = e.changedTouches && e.changedTouches[0];
    const endX =
      (t && (t.pageX ?? t.clientX)) ??
      (e.pageX ?? e.clientX) ??
      0;

    const diffX = endX - this.#swipeStartX;

    if (diffX <= -this.#swipeThreshold) this.next();
    else if (diffX >= this.#swipeThreshold) this.prev();
  }
}

export default SwipeCarousel;