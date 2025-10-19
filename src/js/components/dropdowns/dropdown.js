import { dropdownOptions } from "./dropdown.options"

export class Dropdown {
  /**
   * @param { dropdownOptions } options
   */
  constructor(options) {
    this.options = { ...dropdownOptions, ...options }

    this.$container =
      this.options.container instanceof window.HTMLElement
        ? this.options.container
        : document.querySelector(this.options.container)

    if (!this.$container) {
      return console.warn("Can not initialize dropdown with out container", this)
    }

    this.$trigger = this.$container.querySelector(this.options.triggerSelector)
    this.$dropdown = this.$container.querySelector(this.options.dropdownItemSelector)

    this.isOpened = false

    this.#init()
  }

  #init() {
    this.$trigger.addEventListener("click", this.triggerClickHandle.bind(this))
  }

  #windowClickHandle = ({ target }) => {
    if (!this.$container.contains(target) && !this.$dropdown.contains(target)) {
      this.close()
    }
  }

  triggerClickHandle() {
    this.toggle()
  }

  toggle() {
    if (this.isOpened) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    this.$container.classList.add("_active")
    window.addEventListener("click", this.#windowClickHandle)
    this.isOpened = true
  }

  close() {
    this.$container.classList.remove("_active")
    window.removeEventListener("click", this.#windowClickHandle)
    this.isOpened = false
  }
}
