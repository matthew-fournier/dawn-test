export const cartItemTemplate = (item, childBundleProducts, isSoftBundleProduct) => {
  const itemTitle = (isSoftBundleProduct && item.properties?._soft_bundle_title)
    ? item.properties?._soft_bundle_title
    : item.product_title

  const itemURL = (isSoftBundleProduct && item.properties?._soft_bundle_url)
    ? item.properties?._soft_bundle_url
    : item.url

  return `
    <cart-item class="cart-item ${isSoftBundleProduct ? 'cart-item--soft-bundle' : ''}"
      data-cart-item
      data-key="${item.key}"
      data-id="${item.id}"
      data-product-id="${item.product_id}"
      ${isSoftBundleProduct ? 'data-cart-item-soft-bundle' : ''}
    >
      <a href="${itemURL}" class="cart-item__image-holder">
        ${
          (isSoftBundleProduct && item.properties?._soft_bundle_image)
            ? `<img src="${item.properties._soft_bundle_image}" width="800" height="800" loading="lazy" alt="Image of ${itemTitle}">`
            : `<img src="${Shopify.Image.getSizedImageUrl(item.image || item.featured_image.url, '800x')}" width="800" height="800" loading="lazy" alt="Image of ${itemTitle}">`
        }
      </a>

      <div class="cart-item__info-holder">
        <a href="${itemURL}" class="cart-item__link">
          <h4 class="cart-item__title body-fine"><strong>${itemTitle}</strong></h4>
        </a>

        ${!item.variant_title || isSoftBundleProduct ? '' : `<p class="cart-item__variant-title body-fine">${item.variant_title}</p>`}
        ${cartItemProperties(item)}

        ${sellingPlanSelect(item)}

        <div class="cart-item__quantity-and-price">
          <p class="cart-item__price body-fine" data-price>
            ${
              isSoftBundleProduct
                ? bundleChildrenPrice(item, childBundleProducts)
                : cartItemPrice(item.final_line_price, item.original_line_price, item)
            }
          </p>
          ${quantitySelectorTemplate(item)}
        </div>

        <button class="cart-item__remove" data-remove-cart-item aria-label="Remove ${itemTitle} from cart">
          ${window.theme.icons.trash}
        </button>

        ${childBundleProducts.length === 0 ? '' : `<div data-bundle-childen>${bundleChildrenDetails(item, childBundleProducts)}</div>`}
      </div>
    </cart-item>
  `
}

export const cartItemTemplateEmpty = (item, childBundleProducts) => {
  return `
    <cart-item class="cart-item hide"
      data-cart-item
      data-cart-item-empty
      data-key="${item.key}"
      data-id="${item.id}"
      data-product-id="${item.product_id}"
    >
    </cart-item>
  `
}

export const cartItemPrice = (finalLinePrice, originalLinePrice = 0, item = null) => {
  const updatedOriginalPrice = (item !== null && item.properties?._original_variant_compare_at_price)
    ? parseFloat(item.properties?._original_variant_compare_at_price, 10) * item.quantity * 100
    : originalLinePrice

  return (updatedOriginalPrice > finalLinePrice)
    ? `
        <strong>
          ${Shopify.formatMoney(finalLinePrice)}
          <s>
            <span class="sr-only">${window.theme.strings.originallyPricedAt}</span>
            ${Shopify.formatMoney(updatedOriginalPrice)}
          </s>
        </strong>
      `
    : `<strong>${Shopify.formatMoney(finalLinePrice)}</strong>`
}

export const cartItemProperties = (item) => {
  if (
    typeof item.properties === 'undefined' ||
    !item.properties ||
    Object.keys(item.properties).length === 0
  ) { return '' }

  return `
    <ul class="cart-item__properties body-fine">
      ${
        Object.keys(item.properties).map((property) => {
          if (property.charAt(0) === '_') { return '' }
          return `<li class="body-fine">${property}: ${item.properties[property]}</li>`
        }).join('')
      }
    </ul>
  `
}

export const bundleChildrenPrice = (item, bundleChildren) => {
  if (bundleChildren.length === 0) { return '$0' }
  const finalBundleChildrenPrice = bundleChildren.reduce((prev, cur) => prev + cur.final_line_price, 0)
  return Shopify.formatMoney(finalBundleChildrenPrice)
}

export const bundleChildrenDetails = (item, bundleChildren) => {
  if (bundleChildren.length === 0) { return '' }

  return `
    <details class="cart-item__bundle-children" data-bundle-details>
      <summary>
        <span>
          ${window.theme.icons.plus}
          ${window.theme.icons.minus}
          ${window.theme.strings.bundledProducts}
        </span>

        <span>
          ${bundleChildrenPrice(item, bundleChildren)}
        </span>
      </summary>

      <ul>
        ${
          bundleChildren.map((childItem) => `
            <li>
              <span>
                ${childItem.product_title}
                ${!childItem.variant_title ? '' : `<br> <span class="p--small">${childItem.variant_title}</span>`}
              </span>

              <span>
                ${cartItemPrice(childItem.final_line_price)}
              </span>
            </li>
          `).join('')
        }
      </ul>
    </detials>
  `
}

export const sellingPlanSelect = (item) => {
  try {
    const planOptionsString = item.properties?._selling_plan_options
    if (typeof planOptionsString === 'undefined' || !planOptionsString) { return '' }

    const planOptions = JSON.parse(planOptionsString.replace(/`/g, '"'))

    const sellingPlanCurrent = item.selling_plan_allocation?.selling_plan?.id
    if (!planOptions || planOptions.length === 0) { return '' }

    return `
      <label class="visually-hidden" for="selling-plan-select--${item.key.replace(':', '')}">Selling Plan</label>
      <dropdown-select class="cart-item__selling-plan-select">
        <select data-selling-plan-select id="selling-plan-select--${item.key.replace(':', '')}">
          <option
            value
            ${!sellingPlanCurrent ? 'selected' : ''}
          >
            ${window.theme.strings.sellingPlanSingle}
          </option>
          ${
            planOptions.map(option => `
              <option
                value="${option.sellingPlan.id.split('SellingPlan/')[1]}"
                ${
                  option.sellingPlan.id.split('SellingPlan/')[1] === sellingPlanCurrent?.toString() && sellingPlanCurrent
                    ? 'selected'
                    : ''
                }
              >
                ${option.sellingPlan.name}
              </option>
            `).join('')
          }
        </select>
      </dropdown-select>
    `
  } catch (err) {
    console.error(err)
    return ''
  }
}

export const quantitySelectorTemplate = (item) => {
  return `
    <quantity-selector class="cart-item__quantity-selector-holder">
      <div class="cart-item__quantity-selector quantity-selector">
        <button class="quantity-selector__btn" type="button"
          data-quantity-button
          data-action="minus"
          aria-label="Minus ${item.title} Quantity"
        >${window.theme.icons.qtyMinus}</button>

        <input class="quantity-selector__input" type="number" name="quantity"
          data-quantity-input
          min="0"
          ${
            typeof item.properties?._inventory_quantity !== 'undefined' && item.properties?._inventory_quantity !== null
              ? `max="${parseInt(item.properties._inventory_quantity, 10)}"`
              : ''
          }
          value="${item.quantity}"
          aria-label="${item.title} Quantity Input"
        >

        <button class="quantity-selector__btn " type="button"
          data-quantity-button
          data-action="plus"
          aria-label="Plus ${item.title} Quantity"
        >${window.theme.icons.qtyPlus}</button>
      </div>

      <span class="quantity-selector-notice hide"
        data-quantity-limit-notice
        data-text="${window.theme.strings.productLimitReached}"
      >${window.theme.strings.productLimitReached}</span>
    </quantity-selector>
  `
}
