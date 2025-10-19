import { fadeIn, fadeOut } from "../../utils/fade"
import { defaultTabsOptions } from "./tabs.options"

export class Tabs {
  /**
   * @param { defaultTabsOptions } options
   */
  constructor(options) {
    this.options = { ...defaultTabsOptions, ...options }

    this.$container =
      this.options.container instanceof window.HTMLElement
        ? this.options.container
        : document.querySelector(this.options.container)

    if (!this.$container) {
      return console.warn("Can not initialize tabs with out container", this)
    }

    this.isLocked = false

    this.duration = this.options.duration / 2

    this.activeIndex = this.options.activeIndex

    this.triggers = this.$container.querySelectorAll(this.options.itemTriggerSelector)

    this.items = this.$container.querySelectorAll(this.options.itemContentSelector)

    this.currentItemIndex = null
    this.currentTrigger = null
    this.currentItem = null

    this.#init()
  }

  #init() {
    this.setNewTabByIndex(this.activeIndex)

    this.triggers.forEach(($button) => {
      const tabTargetID = $button.dataset.tabId?.toLowerCase()

      if (!tabTargetID) {
        return console.warn(`Current tab trigger ${$button} does not have attribute or value [data-tab-id] in`, this)
      }

      $button.addEventListener("click", () => this.setNewTabByID(tabTargetID))
    })
  }

  #changeTab($newItem) {
    if (this.currentItem === $newItem) {
      return
    }

    if (this.currentItem) {
      fadeOut(this.currentItem, this.duration, () => {
        this.currentItem.classList.remove(this.options.activeClass)

        this.currentItem = $newItem

        fadeIn(this.currentItem, this.duration, () => {
          this.currentItem.classList.add(this.options.activeClass)

          this.changeActiveButton()

          this.isLocked = false
        })
      })
    } else {
      this.currentItem = $newItem

      fadeIn(this.currentItem, this.duration, () => {
        this.currentItem.classList.add(this.options.activeClass)

        this.changeActiveButton()

        this.isLocked = false
      })
    }
  }

  setNewTabByID(id) {
    if (this.isLocked) {
      return
    }

    const $newItem = [...this.items].find(($item) => {
      const itemID = $item.id?.toLowerCase()

      return itemID === id
    })

    this.#changeTab($newItem)
  }

  setNewTabByIndex(index) {
    if (this.isLocked) {
      return
    }

    this.isLocked = true

    let $newItem = this.items[index]

    if (!$newItem) {
      this.currentItemIndex = 0
      $newItem = this.items[0]

      console.warn(`Can not find tab item with index ${index} in`, this)
    } else {
      this.currentItemIndex = index
    }

    this.isLocked = true

    this.#changeTab($newItem)
  }

  changeActiveButton() {
    const currentTabID = this.currentItem.id?.toLowerCase()

    this.triggers.forEach(($button) => {
      const tabTargetID = $button.dataset.tabId?.toLowerCase()

      if (tabTargetID === currentTabID) {
        this.currentTrigger = $button

        this.currentTrigger.classList.add(this.options.activeClass)
      } else {
        $button.classList.remove(this.options.activeClass)
      }
    })
  }
}
