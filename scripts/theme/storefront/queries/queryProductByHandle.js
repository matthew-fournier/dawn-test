/**
 * @desc Queries a product information by Handle
 * @param {String} handle -> Product Handle
 */

const queryProductByHandle = (handle) => {
  const graphQlVariables = {
    handle: `${handle}`
  }

  const graphQlQuery = `
    query($handle: String!) {
      productByHandle(handle: $handle) {
        title
        tags
        productType
        variants(first: 100) {
          edges {
            node {
              id
              price
              title
              compareAtPrice
              availableForSale
              quantityAvailable
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `

  return JSON.stringify({
    query: graphQlQuery,
    variables: graphQlVariables
  })
}

export default queryProductByHandle
