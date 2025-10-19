import { slideDown, slideUp } from "../../utils/slideIn"

export class AccordionItem {
  /**
   * @param {Accordion} accordion - Instance of Accordion core
   * @param {HTMLElement} $item - Element from html collection in Accordion
   * @param {number} index - Index of element will be used for id
   */
  constructor(accordion, $item, index) {
    this.options = accordion.options
    this.accordion = accordion

    this.$item = $item
    this.$trigger = this.$item.querySelector(this.options.itemTriggerSelector)
    this.$content = this.$item.querySelector(this.options.itemContentSelector)

    this.index = index

    this.isOpen = false
    this.isLocked = false

    this.onOpenBefore =
      typeof this.options.onOpenBefore === "function" && this.options.onOpenBefore.bind(this)
    this.onOpenAfter =
      typeof this.options.onOpenAfter === "function" && this.options.onOpenAfter.bind(this)
    this.onCloseBefore =
      typeof this.options.onCloseBefore === "function" && this.options.onCloseBefore.bind(this)
    this.onCloseAfter =
      typeof this.options.onCloseAfter === "function" && this.options.onCloseAfter.bind(this)

    this.#init()
  }

  #init() {
    if (!this.$trigger) {
      return console.warn(
        `Accordion item can not be initialize because ${this.options.itemTriggerSelector} not found in`,
        this,
      )
    }
    if (!this.$content) {
      return console.warn(
        `Accordion item can not be initialize because ${this.options.itemContentSelector} not found in`,
        this,
      )
    }

    this.$trigger.addEventListener("click", this.toggle.bind(this))
  }

  open() {
    if (this.isLocked) {
      return
    }

    this.isLocked = true

    this.onOpenBefore && this.onOpenBefore(this)

    this.accordion.closeAllBySingleMode(this.index)

    slideDown(this.$content, this.accordion.duration, () => {
      this.isOpen = true
      this.isLocked = false
      this.$item.classList.add(this.options.activeClass)

      this.onOpenAfter && this.onOpenAfter(this)
    })
  }

  close() {
    if (this.isLocked) {
      return
    }

    this.isLocked = true

    this.onCloseBefore && this.onCloseBefore(this)

    slideUp(this.$content, this.accordion.duration, () => {
      this.isOpen = false
      this.isLocked = false
      this.$item.classList.remove(this.options.activeClass)

      this.onCloseAfter && this.onCloseAfter(this)
    })
  }

  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }
}
