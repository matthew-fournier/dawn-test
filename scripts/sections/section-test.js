import cartAPI from '@cart/cart-api'

console.log('hi')

const x = 27

document.addEventListener('DOMContentLoaded', async () => {
  console.log('softly')

  const newDIv = document.createElement('div')
  await cartAPI.cart()
  newDIv.innerHTML = JSON.stringify(await cartAPI.getCartData())
  document.body.prepend(newDIv)
})
