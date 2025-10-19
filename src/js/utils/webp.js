/**
 * WebP Support Utilities
 * Simplified version - only essential functions
 */

/**
 * Check WebP support in browser
 * @returns {Promise<boolean>} Whether browser supports WebP
 */
export const isWebPSupported = () => {
  return new Promise(resolve => {
       const webP = new window.Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Add WebP support class to body
 * @param {string} className - Class name to add
 */
export const addWebPClass = (className = 'webp') => {
  isWebPSupported().then(supported => {
    if (supported) {
      document.body.classList.add(className);
      document.documentElement.classList.add(className);
    } else {
      document.body.classList.add('no-webp');
      document.documentElement.classList.add('no-webp');
    }
  });
};

/**
 * Initialize WebP support
 * Called on page load
 */
export const initWebPSupport = () => {
  // Add support class
  addWebPClass();
};

// Note: initWebPSupport() should be called from main.js
