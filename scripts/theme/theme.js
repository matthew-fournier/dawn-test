// // Core
import '@scripts/theme/core/a11y'

// // Components
// import '@scripts/theme/components/drawers'
// import '@scripts/theme/components/required-validation'
// import '@scripts/theme/components/dropdown-select'

// // Cart
import cartAPI from '@scripts/theme/cart/cart-api'
// import '@scripts/theme/cart/components/atc-form'
// import '@scripts/theme/cart/components/cart-condition-display'
// import '@scripts/theme/cart/components/cart-info'
// import '@scripts/theme/cart/components/cart-items'
// import '@scripts/theme/cart/components/cart-note'

// // StoreFront
// import '@scripts/theme/storefront/storefront'
;(async () => {
  await cartAPI.cart()
  console.log(cartAPI.getCartData())
})()
