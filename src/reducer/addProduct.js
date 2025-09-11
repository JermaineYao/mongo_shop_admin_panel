export const initNewProduct = {
  productNameMain: '',
  productNameSub: '',
  productNameMainErr: '',
  productNameSubErr: '',
  price: 1,
  category: '0',
  inStock: 0,
  description: ['']
}

export function addProductReducer(state, action) {
  const { type, payload, field } = action

  switch (type) {
    case 'desc-add':
      return { ...state, description: [...state.description, payload] }

    case 'desc-update': {
      const { index, value } = payload
      return {
        ...state,
        description: state.description.map((d, i) => (i === index ? value : d))
      }
    }

    case 'desc-remove': {
      const { index } = payload
      return {
        ...state,
        description: state.description.filter((_, i) => i !== index)
      }
    }

    case 'update':
      return { ...state, [field]: payload }

    default:
      return state
  }
}
