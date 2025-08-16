export const DEFAULT_SETTINGS = { 
  containerId: '#carousel', slideId: '.slide', TIMER_INTERVAL: 1000, isPlaying: true 
};

export const CSS_CLASSES = {
  ACTIVE: 'active',
  INDICATORS: 'indicators',
  INDICATOR:  'indicator', 
  INDICATOR_ACTIVE: 'indicator active',
  CONTROLS: 'controls',
  PAUSE_BTN: 'control control-pause',
  NEXT_BTN: 'control control-next',
  PREV_BTN: 'control control-prev',
}

export const ELEMENT_IDS = {
  INDICATORS_CONTAINER: 'indicators-container',
  PAUSE_BTN: 'pause-btn',
  NEXT_BTN: 'next-btn',
  PREV_BTN: 'prev-btn',
}

export const KEYBOARD_CODES = {
  SPACE: 'Space',
  LEFT_ARROW: 'ArrowLeft',
  RIGHT_ARROW: 'ArrowRight',
}

export default {
  DEFAULT_SETTINGS,
  CSS_CLASSES,
  ELEMENT_IDS,
  KEYBOARD_CODES,
};