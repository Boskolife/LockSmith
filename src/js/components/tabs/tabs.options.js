/**
 * @typedef defaultTabsOptions
 * @property { string | HTMLElement } container - Will get tabs container html element from DOM
 * @property { string } itemTriggerSelector - Will get button html element from container
 * @property { string } itemContentSelector - Will get content wrapper html element from container
 * @property { string } activeClass - Will be added to button trigger and item target on open state
 * @property { number } duration - Configures the ability to open one or more items at the same time
 * @property { number } activeIndex - Configures the active index on init
 * */

/** @type defaultTabsOptions */
export const defaultTabsOptions = {
  /**
   * Will get tabs container html element from DOM
   * @type string | HTMLElement
   */
  container: ".js-tabs",

  /**
   * Will get button html element from container
   * @type string
   */
  itemTriggerSelector: ".js-tab-btn",

  /**
   * Will get content wrapper html element from container
   * @type string
   */
  itemContentSelector: ".js-tabs-item",

  /**
   * Will be added to button trigger and item target on open state
   * @type string
   */
  activeClass: "_active",

  /**
   * Configures the ability to open one or more items at the same time
   * @type number
   */
  duration: 500,

  /**
   * Configures the active index on init
   * @type number
   */
  activeIndex: 10,
}
