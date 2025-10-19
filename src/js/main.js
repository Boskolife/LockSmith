// import Swiper JS
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { Accordion } from './components/accordions/accordion';
// import Swiper styles

// Store select instances
const selectInstances = new Map();

/**
 * Initialize a single custom select
 */
function initCustomSelect(selectElement) {
  const container = selectElement.closest('[data-select]');
  const trigger = container.querySelector('[data-select-trigger]');
  const valueDisplay = container.querySelector('[data-select-value]');
  const options = container.querySelector('[data-select-options]');
  const optionElements = container.querySelectorAll('.select-option');

  // ARIA wiring
  const listboxId = `listbox-${Math.random().toString(36).slice(2, 9)}`;
  options.id = listboxId;
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', listboxId);
  options.setAttribute('role', 'listbox');
  optionElements.forEach(opt => {
    opt.setAttribute('role', 'option');
    opt.setAttribute('aria-selected', 'false');
    opt.setAttribute('tabindex', '-1');
  });

  const state = {
    isOpen: false,
    selectedIndex: -1,
    select: selectElement,
    container,
    trigger,
    valueDisplay,
    options,
    optionElements,
  };

  // Store instance
  selectInstances.set(selectElement, state);

  // Bind events
  bindSelectEvents(state);
}

/**
 * Bind events for custom select
 */
function bindSelectEvents(state) {
  const { trigger, container, optionElements, options } = state;

  // Click on trigger
  trigger.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    toggleSelect(state);
  });

  // Click on options
  optionElements.forEach((option, index) => {
    option.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      selectOption(state, index);
    });

    // Mouse events for hover effects
    option.addEventListener('mouseenter', () => {
      state.selectedIndex = index;
      updateSelectHoverState(state);
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!container.contains(e.target)) {
      closeSelect(state);
    }
  });

  // Close on escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && state.isOpen) {
      closeSelect(state);
    }
  });

  // Keyboard navigation
  trigger.addEventListener('keydown', e => {
    if (!state.isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        openSelect(state);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        navigateSelectDown(state);
        break;
      case 'ArrowUp':
        e.preventDefault();
        navigateSelectUp(state);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (state.selectedIndex >= 0) {
          selectOption(state, state.selectedIndex);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeSelect(state);
        break;
    }
  });

  // Prevent focus leaving when open
  options.addEventListener('keydown', e => {
    if (!state.isOpen) return;
    if (e.key === 'Tab') e.preventDefault();
  });
}

/**
 * Toggle select open/close
 */
function toggleSelect(state) {
  if (state.isOpen) {
    closeSelect(state);
  } else {
    openSelect(state);
  }
}

/**
 * Open select dropdown
 */
function openSelect(state) {
  const { container, options, trigger } = state;

  state.isOpen = true;
  container.classList.add('active');
  options.classList.add('show');
  trigger.classList.add('active');
  trigger.setAttribute('aria-expanded', 'true');

  // Focus management
  trigger.focus();
}

/**
 * Close select dropdown
 */
function closeSelect(state) {
  const { container, options, trigger } = state;

  state.isOpen = false;
  container.classList.remove('active');
  options.classList.remove('show');
  trigger.classList.remove('active');
  trigger.setAttribute('aria-expanded', 'false');

  // Reset hover state
  state.selectedIndex = -1;
  updateSelectHoverState(state);
}

/**
 * Select an option
 */
function selectOption(state, index) {
  const { optionElements, valueDisplay, select } = state;
  const option = optionElements[index];
  const value = option.getAttribute('data-value');
  const text = option.textContent;

  // Update display
  valueDisplay.textContent = text;
  valueDisplay.classList.remove('placeholder');

  // Update hidden select
  select.value = value;

  // Update option states
  optionElements.forEach((opt, i) => {
    opt.classList.toggle('selected', i === index);
    opt.setAttribute('aria-selected', String(i === index));
  });

  // Trigger change event
  select.dispatchEvent(new window.Event('change', { bubbles: true }));

  // Close dropdown
  closeSelect(state);
}

/**
 * Navigate down in select
 */
function navigateSelectDown(state) {
  if (state.selectedIndex < state.optionElements.length - 1) {
    state.selectedIndex++;
  } else {
    state.selectedIndex = 0;
  }
  updateSelectHoverState(state);
}

/**
 * Navigate up in select
 */
function navigateSelectUp(state) {
  if (state.selectedIndex > 0) {
    state.selectedIndex--;
  } else {
    state.selectedIndex = state.optionElements.length - 1;
  }
  updateSelectHoverState(state);
}

/**
 * Update hover state in select
 */
function updateSelectHoverState(state) {
  state.optionElements.forEach((option, index) => {
    option.classList.toggle('hover', index === state.selectedIndex);
  });
}

// ===== VIDEO PLAYER FUNCTIONALITY =====

// Dev logging guard
const IS_DEV = process.env.NODE_ENV !== 'production';
const devLog = (...args) => {
  if (IS_DEV) console.log(...args); // eslint-disable-line no-console
};

/**
 * Create error message element
 * @param {string} message - Error message
 * @param {string} details - Error details
 * @param {string} className - CSS class name
 * @param {string} linkText - Optional link text
 * @param {string} linkHref - Optional link href
 * @returns {HTMLElement} Error message element
 */
function createErrorMessage(message, details = '', className = 'error-message', linkText = '', linkHref = '') {
  const errorDiv = document.createElement('div');
  errorDiv.className = className;
  
  let linkHtml = '';
  if (linkText && linkHref) {
    linkHtml = `<p><a href="${linkHref}" download>${linkText}</a></p>`;
  }
  
  errorDiv.innerHTML = `
    <p><strong>${message}</strong></p>
    ${details ? `<p>${details}</p>` : ''}
    ${linkHtml}
  `;
  
  return errorDiv;
}

/**
 * Get element safely with warning if not found
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (default: document)
 * @returns {Element|null} Found element or null
 */
function getElementSafely(selector, context = document) {
  const element = context.querySelector(selector);
  if (!element) {
    console.warn(`Element not found: ${selector}`); // eslint-disable-line no-console
  }
  return element;
}

/**
 * Get element by ID safely with warning if not found
 * @param {string} id - Element ID
 * @returns {Element|null} Found element or null
 */
function getElementByIdSafely(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with ID not found: ${id}`); // eslint-disable-line no-console
  }
  return element;
}

// Store video player state
let videoPlayerState = {
  video: null,
  playButton: null,
  isPlaying: false,
};

/**
 * Initialize video player
 */
function initVideoPlayer() {
  const video = getElementByIdSafely('hero-video');
  const playButton = getElementByIdSafely('play-video-btn');

  if (!video || !playButton) {
    console.warn('Video player elements not found'); // eslint-disable-line no-console
    return;
  }

  // Check if video source exists
  if (!video.src && !video.querySelector('source')) {
    console.warn('No video source found'); // eslint-disable-line no-console
    showVideoSourceError();
    return;
  }

  videoPlayerState = {
    video,
    playButton,
    isPlaying: false,
  };

  bindVideoEvents();
  setupVideoKeyboardControls();
  setupVideoAttributes();

  // Test video loading
  testVideoLoading();
}

/**
 * Show video source error
 */
function showVideoSourceError() {
  const videoContainer = getElementSafely('.video_content');
  if (!videoContainer) return;

  const errorMessage = createErrorMessage(
    'Video not available',
    'No video source has been configured.',
    'video-error'
  );

  videoContainer.appendChild(errorMessage);
}

/**
 * Test video loading
 */
function testVideoLoading() {
  const { video } = videoPlayerState;

  devLog('Testing video loading...', {
    src: video.src,
    currentSrc: video.currentSrc,
    networkState: video.networkState,
    readyState: video.readyState,
  });

  // Try to load the video
  video.load();
}

/**
 * Bind video player events
 */
function bindVideoEvents() {
  const { video, playButton } = videoPlayerState;

  // Play button click
  playButton.addEventListener('click', e => {
    e.preventDefault();
    toggleVideoPlay();
  });

  // Video events
  video.addEventListener('play', () => {
    videoPlayerState.isPlaying = true;
    updateVideoButtonState();
  });

  video.addEventListener('pause', () => {
    videoPlayerState.isPlaying = false;
    updateVideoButtonState();
  });

  video.addEventListener('ended', () => {
    videoPlayerState.isPlaying = false;
    updateVideoButtonState();
  });

  // Error handling
  video.addEventListener('error', e => {
    console.error('Video error:', e); // eslint-disable-line no-console
    const error = video.error;
    if (error) {
      console.error('Video error details:', { // eslint-disable-line no-console
        code: error.code,
        message: error.message,
        networkState: video.networkState,
        readyState: video.readyState,
      });
    }
    handleVideoError();
  });

  // Loading states
  video.addEventListener('loadstart', () => {
    devLog('Video loading started');
    playButton.setAttribute('aria-label', 'Loading video...');
  });

  video.addEventListener('loadedmetadata', () => {
    devLog('Video metadata loaded', {
      duration: video.duration,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
    });
  });

  video.addEventListener('canplay', () => {
    devLog('Video can start playing');
    playButton.setAttribute('aria-label', 'Play video');
  });

  video.addEventListener('loadeddata', () => {
    devLog('Video data loaded');
  });
}

/**
 * Setup keyboard controls for video
 */
function setupVideoKeyboardControls() {
  const { video, playButton } = videoPlayerState;

  // Space bar to play/pause
  video.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      e.preventDefault();
      toggleVideoPlay();
    }
  });

  // Enter key on button
  playButton.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleVideoPlay();
    }
  });
}

/**
 * Setup video attributes for accessibility
 */
function setupVideoAttributes() {
  const { video } = videoPlayerState;

  // Ensure video is keyboard focusable
  video.setAttribute('tabindex', '0');
  // Removed invalid role/aria-live/loading for video element
}

/**
 * Toggle video play/pause
 */
function toggleVideoPlay() {
  if (videoPlayerState.isPlaying) {
    pauseVideo();
  } else {
    playVideo();
  }
}

/**
 * Play video
 */
async function playVideo() {
  const { video, playButton } = videoPlayerState;

  try {
    await video.play();
    video.setAttribute('controls', 'controls');
    playButton.setAttribute('aria-label', 'Pause video');
    playButton.classList.add('playing');

    // Focus management
    video.focus();
  } catch (error) {
    console.error('Error playing video:', error); // eslint-disable-line no-console
    handleVideoPlayError();
  }
}

/**
 * Pause video
 */
function pauseVideo() {
  const { video, playButton } = videoPlayerState;

  video.pause();
  playButton.setAttribute('aria-label', 'Play video');
  playButton.classList.remove('playing');
}

/**
 * Update video button state
 */
function updateVideoButtonState() {
  const { playButton } = videoPlayerState;

  if (videoPlayerState.isPlaying) {
    playButton.classList.add('playing');
    playButton.setAttribute('aria-label', 'Pause video');
  } else {
    playButton.classList.remove('playing');
    playButton.setAttribute('aria-label', 'Play video');
  }
}

/**
 * Handle video error
 */
function handleVideoError() {
  const { video, playButton } = videoPlayerState;

  // Get error details
  const error = video.error;
  let errorText = 'Sorry, this video cannot be played.';
  let errorDetails = '';

  if (error) {
    switch (error.code) {
      case error.MEDIA_ERR_ABORTED:
        errorText = 'Video playback was aborted.';
        errorDetails = 'The video was stopped before it finished loading.';
        break;
      case error.MEDIA_ERR_NETWORK:
        errorText = 'Network error occurred.';
        errorDetails = 'A network error caused the video download to fail.';
        break;
      case error.MEDIA_ERR_DECODE:
        errorText = 'Video format not supported.';
        errorDetails = 'The video format is not supported by your browser.';
        break;
      case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorText = 'Video source not found.';
        errorDetails = 'The video file could not be found or is not supported.';
        break;
      default:
        errorText = 'Unknown video error occurred.';
        errorDetails = 'An unexpected error occurred while loading the video.';
    }
  }

  // Show fallback message
  const errorMessage = createErrorMessage(
    errorText,
    errorDetails,
    'video-error',
    'Download video instead',
    video.src
  );

  video.parentNode.appendChild(errorMessage);
  // Hide play button via CSS class instead of inline styles
  playButton.classList.add('is-hidden');
}

/**
 * Handle video play error
 */
function handleVideoPlayError() {
  const { video } = videoPlayerState;

  // Show user-friendly error message
  const errorMessage = createErrorMessage(
    'Unable to play video. Please try again.',
    '',
    'video-play-error'
  );

  video.parentNode.appendChild(errorMessage);

  // Remove error message after 3 seconds
  window.setTimeout(() => {
    if (errorMessage.parentNode) {
      errorMessage.parentNode.removeChild(errorMessage);
    }
  }, 3000);
}

/**
 * Get video current time
 */
function getVideoCurrentTime() {
  return videoPlayerState.video ? videoPlayerState.video.currentTime : 0;
}

/**
 * Get video duration
 */
function getVideoDuration() {
  return videoPlayerState.video ? videoPlayerState.video.duration : 0;
}

/**
 * Set video volume
 */
function setVideoVolume(volume) {
  if (videoPlayerState.video) {
    videoPlayerState.video.volume = Math.max(0, Math.min(1, volume));
  }
}

/**
 * Get video volume
 */
function getVideoVolume() {
  return videoPlayerState.video ? videoPlayerState.video.volume : 1;
}

/**
 * Mute video
 */
function muteVideo() {
  if (videoPlayerState.video) {
    videoPlayerState.video.muted = true;
  }
}

/**
 * Unmute video
 */
function unmuteVideo() {
  if (videoPlayerState.video) {
    videoPlayerState.video.muted = false;
  }
}

// ===== SWIPER FUNCTIONALITY =====

/**
 * Initialize Swiper sliders
 */
function initSwiper() {
  const swiperContainer = document.querySelector(
    '.reviews-testimonials_swiper'
  );

  if (swiperContainer) {
    new Swiper('.reviews-testimonials_swiper', {
      speed: 1400,
      slidesPerView: 2,
      spaceBetween: 20,
      modules: [Navigation],
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
      },
    });
  }
}

// ===== ACCORDION FUNCTIONALITY =====

/**
 * Initialize accordions
 */
function initAccordions() {
  const accordionContainer = document.querySelector('.js-accordion');

  if (accordionContainer) {
    new Accordion({
      containerSelector: '.js-accordion',
      itemSelector: '.js-accordion-item',
      itemTriggerSelector: '.js-accordion-toggler',
      itemContentSelector: '.js-accordion-content',
      type: 'multiply',
    });
  }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Initialize all custom selects on the page
 */
function initCustomSelects() {
  const customSelects = document.querySelectorAll('[data-select]');

  customSelects.forEach(selectContainer => {
    const selectElement = selectContainer.querySelector('select');
    if (selectElement) {
      initCustomSelect(selectElement);
    }
  });
}

/**
 * Initialize form validation
 */
function initFormValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      handleFormSubmit(form);
    });
  });
}

/**
 * Handle form submission
 */
function handleFormSubmit(form) {
  const formData = new window.FormData(form);
  const data = Object.fromEntries(formData);

  // Basic validation
  if (!data.email || !data.service) {
    showFormError('Please fill in all required fields.');
    return;
  }

  // Email validation
  if (!isValidEmail(data.email)) {
    showFormError('Please enter a valid email address.');
    return;
  }

  // Simulate form submission
  devLog('Form submitted:', data);
  showFormSuccess('Thank you! We will contact you soon.');

  // Reset form
  form.reset();
}

/**
 * Validate email address
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Show form error message
 */
function showFormError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-error';
  errorDiv.textContent = message;

  // Add to form
  const form = document.querySelector('form');
  form.appendChild(errorDiv);

  // Remove after 5 seconds
  window.setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.parentNode.removeChild(errorDiv);
    }
  }, 5000);
}

/**
 * Show form success message
 */
function showFormSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'form-success';
  successDiv.textContent = message;

  // Add to form
  const form = document.querySelector('form');
  form.appendChild(successDiv);

  // Remove after 5 seconds
  window.setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.parentNode.removeChild(successDiv);
    }
  }, 5000);
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      const targetId = link.getAttribute('href').substring(1);
      const targetElement = getElementByIdSafely(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new window.IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      }
    );

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
}

/**
 * Initialize accessibility features
 */
function initAccessibility() {
  // Skip to main content link
  const skipLink = document.createElement('a');
  skipLink.href = '#main';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Focus management
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
}

// ===== HEADER SCROLL FUNCTIONALITY =====

/**
 * Initialize header scroll functionality
 */
function initHeaderScroll() {
  const header = getElementByIdSafely('header');
  const headerInfoBanner = getElementSafely('.header_info-banner');

  if (!header) {
    console.warn('Header element not found'); // eslint-disable-line no-console
    return;
  }

  const headerInfoBannerHeight = headerInfoBanner.offsetHeight;

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Добавляем класс активности если страница не в самом верху
    if (scrollTop > 0) {
      header.classList.add('header_scrolled');
      header.style.transform = `translateY(-${headerInfoBannerHeight}px)`;
    } else {
      header.classList.remove('header_scrolled');
      header.style.transform = `translateY(0)`;
    }

    // Скрываем header_info-banner если страница не в самом верху
    if (headerInfoBanner) {
      if (scrollTop > 0) {
        headerInfoBanner.classList.add('header_info-banner_hidden');
      } else {
        headerInfoBanner.classList.remove('header_info-banner_hidden');
      }
    }
  }

  // Throttle scroll events for better performance
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }

  function onScroll() {
    ticking = false;
    requestTick();
  }

  // Add scroll event listener
  window.addEventListener('scroll', onScroll, { passive: true });

  // Check initial scroll position
  handleScroll();

  devLog('Header scroll functionality initialized');
}

// ===== INITIALIZATION =====

/**
 * Initialize all functionality when DOM is loaded
 */
function init() {
  // Initialize all components
  initSwiper();
  initAccordions();
  initCustomSelects();
  initVideoPlayer();
  initFormValidation();
  initSmoothScrolling();
  initLazyLoading();
  initAccessibility();
  initHeaderScroll();

  // Make functions globally available for debugging
  window.LockSmith = {
    initSwiper,
    initAccordions,
    initCustomSelects,
    initVideoPlayer,
    initFormValidation,
    initSmoothScrolling,
    initLazyLoading,
    initAccessibility,
    initHeaderScroll,
    // Video controls
    playVideo,
    pauseVideo,
    toggleVideoPlay,
    getVideoCurrentTime,
    getVideoDuration,
    setVideoVolume,
    getVideoVolume,
    muteVideo,
    unmuteVideo,
  };

  devLog('LockSmith website initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export functions for potential module usage
if (typeof window !== 'undefined' && window.module && window.module.exports) {
  window.module.exports = {
    initSwiper,
    initAccordions,
    initCustomSelects,
    initVideoPlayer,
    initFormValidation,
    initSmoothScrolling,
    initLazyLoading,
    initAccessibility,
    initHeaderScroll,
    init,
  };
}
