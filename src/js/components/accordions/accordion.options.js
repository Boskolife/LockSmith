/**
 * @typedef accordionOptions
 * @property { HTMLElement | string } containerSelector - Will get accordion container html element from DOM
 * @property { string } itemSelector - Will get item wrapper html element from container
 * @property { string } itemTriggerSelector - Will get button html element from item element
 * @property { string } itemContentSelector - Will get content wrapper html element from item element
 * @property { string } activeClass - Will be added to item which has open state
 * @property { number } duration - Configures the ability to open one or more items at the same time
 * @property { "single" | "multiply" } type - Configures the ability to open one or more items at the same time
 * @property { function | null } onOpenBefore - Event will be called before opening item
 * @property { function | null } onOpenAfter - Event will be called after opened item
 * @property { function | null } onCloseBefore - Event will be called before closing item
 * @property { function | null } onCloseAfter - Event will be called after closed item
 * */

/** @type {accordionOptions} */
export const accordionOptions = {
  containerSelector: ".js-accordion",
  itemSelector: ".js-accordion-item",
  itemTriggerSelector: ".js-accordion-toggler",
  itemContentSelector: ".js-accordion-content",
  activeClass: "_active",
  duration: 500,
  type: "single",
  onOpenBefore: null,
  onOpenAfter: null,
  onCloseBefore: null,
  onCloseAfter: null,
}