export const initProducts = {
  products: [],
  search: {
    productNameMain: '',
    productNameSub: '',
    category: 'all',
    enable: 'all',
    price: {
      gte: '',
      lte: ''
    },
    currentPage: 1
  },
  totalPages: 1,
  dataCount: 0,
  priceGteErr: '',
  priceLteErr: ''
}

export function productsReducer(state, action) {
  const { type, payload } = action

  switch (type) {
    case 'search':
      return { ...state, search: { ...state.search, ...payload } }

    case 'price-gte':
      return {
        ...state,
        search: { ...state.search, price: { ...state.search.price, gte: payload } }
      }

    case 'price-lte':
      return {
        ...state,
        search: { ...state.search, price: { ...state.search.price, lte: payload } }
      }

    case 'set-page':
      return {
        ...state,
        search: { ...state.search, currentPage: payload }
      }

    case 'products':
      return { ...state, products: payload }

    case 'update-product':
      return {
        ...state,
        products: state.products.map((product) =>
          product._id === payload._id ? { ...product, ...payload.update } : product
        )
      }

    case 'total-page':
      return { ...state, totalPages: payload }

    case 'data-count':
      return { ...state, dataCount: payload }

    case 'price-gte-err':
      return { ...state, priceGteErr: payload }

    case 'price-lte-err':
      return { ...state, priceLteErr: payload }

    case 'clear-err':
      return { ...state, priceGteErr: '', priceLteErr: '' }

    default:
      return state
  }
}
