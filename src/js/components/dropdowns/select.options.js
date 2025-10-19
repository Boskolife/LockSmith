/**
 * @typedef selectOptions
 * @property { HTMLElement | string } container - Will get dropdown container html element from DOM
 * @property { string } inputSelector - Will get dropdown element in container
 * @property { string } triggerSelector - Will get trigger button element in container
 * @property { string } triggerValueSelector - Will get holder element in trigger button, button will not contain new selected value will be pushed to button
 * @property { string } dropdownItemSelector - Will get dropdown element in container
 * @property { string } dropdownOptionSelector - Will get option items in dropdown element
 * */

/** @type { selectOptions } */
export const selectOptions = {
  container: ".js-select",
  inputSelector: ".js-select-input",
  triggerSelector: ".js-select-trigger",
  triggerValueSelector: ".js-select-trigger-value",
  dropdownItemSelector: ".js-select-dropdown",
  dropdownOptionSelector: ".js-select-option",
}
