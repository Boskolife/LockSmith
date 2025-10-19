import { Dropdown } from "./dropdown"
import { selectOptions } from "./select.options"

/**
 * @extends Dropdown
 */
export class Select extends Dropdown {
  /**
   * @param { selectOptions } options
   */
  constructor(options) {
    super({ ...selectOptions, ...options })

    const $triggerValue = this.$trigger.querySelector(this.options.triggerValueSelector)
    this.$triggerValue = $triggerValue ? $triggerValue : this.$trigger

    this.$input = this.$container.querySelector(this.options.inputSelector)
    this.options = this.$dropdown.querySelectorAll(this.options.dropdownOptionSelector)

    this.#init()
  }

  #init() {
    this.options.forEach(($option) => {
      $option.addEventListener("click", this.optionClickHandle.bind(this))
    })
  }

  optionClickHandle(event) {
    const { currentTarget: $options } = event
    const newValue = $options.dataset?.selectValue

    if (!newValue) {
      return console.warn("Cant append new value because value is invalid", this)
    }

    this.$input.value = newValue
    this.$triggerValue.innerHTML = $options.innerHTML

    this.close()
  }
}