(() => {
  if (typeof window.customElements.get('parallax-item') !== 'undefined') { return }

  window.customElements.define('parallax-item', class ParallaxItem extends HTMLElement {
    constructor () {
      super()
      this.z = this.getAttribute('data-z') === null
        ? 1
        : parseInt(this.getAttribute('data-z', 10))

      this.d = this.getAttribute('data-d') === null
        ? 1
        : parseInt(this.getAttribute('data-d', 10))

      this.moveLimit = 300

      this.init()
    }

    init () {
      this.style.zIndex = this.z
      this.getValues()
      this.checkPositions()
    }

    getValues () {
      this.targetHeight = this.scrollHeight
      this.windowHeight = window.innerHeight
    }

    checkPositions () {
      this.style.transform = 'translateY(0)'
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const target = (this.getBoundingClientRect().top + scrollTop + (this.targetHeight * 0.5)) - (this.windowHeight * 0.5)
      const diff = (target - scrollTop) / this.d
      const moveAmout =
        (diff > this.moveLimit && this.moveLimit) ||
        (diff < this.moveLimit * -1 && this.moveLimit * -1) ||
        diff

      this.style.transform = `translateY(${moveAmout}px)`
    }
  })
})()

const parallaxEventListeners = () => {
  const items = document.querySelectorAll('parallax-item')
  if (!items || items.length === 0) { return }

  window.addEventListener('scroll', () => {
    items.forEach((item) => {
      item.checkPositions()
    })
  })

  window.addEventListener('resize', () => {
    items.forEach((item) => {
      item.getValues()
      item.checkPositions()
    })
  })
}

window.addEventListener('DOMContentLoaded', () => {
  parallaxEventListeners()
})
