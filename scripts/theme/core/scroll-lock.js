const siteHtml = document.querySelector('[data-site-html]')
const siteBody = document.querySelector('[data-site-body]')
const siteContainer = document.querySelector('[data-site-container]')

export function scrollLockOpen () {
  siteHtml.classList.add('scroll-lock')
  siteBody.classList.add('scroll-lock')
  setTimeout(() => {
    window.dispatchEvent(new Event('forceHeaderOpen'))
  }, 10)
}

export function scrollLockClose () {
  siteHtml.classList.remove('scroll-lock')
  siteBody.classList.remove('scroll-lock')
  siteContainer.style.top = ''
  setTimeout(() => {
    window.dispatchEvent(new Event('forceHeaderOpen'))
  }, 10)
}
