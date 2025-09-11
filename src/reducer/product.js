export const initProduct = {
  productId: '',
  productNameMain: '',
  productNameSub: '',
  price: 0,
  category: '0',
  inStock: 0,
  size: '',
  enable: false,
  description: [],
  mainPhoto: {
    createAt: null,
    fileKey: null,
    url: null
  },
  subPhotos: []
}

export function productReducer(state, action) {
  const { type, payload, field } = action
  console.log(payload)

  switch (type) {
    case 'init':
      return { ...initProduct, ...payload }

    case 'update':
      return { ...state, [field]: payload }

    case 'arr-add':
      return { ...state, [field]: [...state[field], payload] }

    case 'arr-update': {
      const { index, value } = payload
      return {
        ...state,
        [field]: state[field].map((d, i) => (i === index ? value : d))
      }
    }

    case 'sub-photo-update': {
      const { index, value } = payload
      return {
        ...state,
        [field]: state[field].map((item, i) =>
          i === index ? { ...item, ...value } : item
        )
      }
    }

    case 'arr-remove': {
      const index = payload
      return { ...state, [field]: state[field].filter((_, i) => i !== index) }
    }

    case 'obj-update': {
      return { ...state, [field]: { ...state[field], ...payload } }
    }

    default:
      return state
  }
}
