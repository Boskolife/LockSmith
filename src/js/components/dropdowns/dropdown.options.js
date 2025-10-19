/**
 * @typedef dropdownOptions
 * @property { HTMLElement | string } container - Will get dropdown container html element from DOM
 * @property { string } triggerSelector - Will get trigger button element in container
 * @property { string } dropdownItemSelector - Will get dropdown element in container
 * */

/** @type { dropdownOptions } */
export const dropdownOptions = {
  container: ".js-dropdown",
  triggerSelector: ".js-dropdown-trigger",
  dropdownItemSelector: ".js-dropdown-item",
}
