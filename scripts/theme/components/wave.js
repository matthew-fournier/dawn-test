import wavePaths from './wave-paths'

(() => {
  if (typeof window.customElements.get('animated-wave') !== 'undefined') { return }

  window.customElements.define('animated-wave', class AnimatedWave extends HTMLElement {
    constructor () {
      super()
      this.activePathIndex = 0
      this.path = this.querySelector('[data-path]')
      if (!this.path) { return }
      this.initWave()
    }

    initWave () {
      const speed = this.path.getAttribute('data-speed') === null
        ? 5000
        : parseInt(this.path.getAttribute('data-speed'), 10) * 1000
      if (speed === 0) { return }

      this.animateWave()
      setInterval(() => {
        this.animateWave()
      }, speed)
    }

    async animateWave () {
      this.activePathIndex = await this.getRandomIndex()
      this.path.setAttribute('d', wavePaths[this.activePathIndex])
    }

    getRandomIndex () {
      let randIndex = null
      while (!randIndex || randIndex === this.activePathIndex) {
        randIndex = Math.floor(Math.random() * wavePaths.length)
      }
      return randIndex
    }
  })
})()
