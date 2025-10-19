import { AccordionItem } from "./accordion-item"
import { accordionOptions } from "./accordion.options"

export class Accordion {
  /**
   * @param { accordionOptions } options
   */
  constructor(options) {
    this.options = { ...accordionOptions, ...options }

    this.$container =
      this.options.containerSelector instanceof window.HTMLElement
        ? this.options.containerSelector
        : document.querySelector(this.options.containerSelector)

    if (!this.$container) {
      return console.warn("Can not initialize accordion with out container", this)
    }

    this.duration = this.options.duration
    this.activeIndex = null
    this.type = this.options.type

    this.items = this.$container ? this.$container.querySelectorAll(this.options.itemSelector) : []

    this.#init()
  }

  #init() {
    if (!this.$container) {
      return console.warn(
        `Accordion can not be initialize because ${this.options.containerSelector} is not found`,
        this,
      )
    }

    if (!this.items?.length) {
      return console.warn(
        `Accordion items can not be initialize because ${this.options.itemSelector} is not defined in`,
        this,
      )
    }

    this.items = [...this.items].map(($item, index) => new AccordionItem(this, $item, index))
  }

  openByIndex(index) {
    if (!this.items[index]) {
      return console.warn(`Can not open accordion item by index : ${index}, because the item is not found in`, this)
    }

    this.items[index].open()
  }

  closeAllBySingleMode(index) {
    if (this.type === "multiply") {
      return
    }

    this.activeIndex = index

    this.items.forEach((item, index) => {
      if (index !== this.activeIndex) {
        item.close()
      }
    })
  }
}
