export const initOrders = {
  orders: [],
  search: {
    orderNo: '',
    account: '',
    email: '',
    orderStatus: 'all',
    totalAmount: {
      gte: '',
      lte: ''
    },
    currentPage: 1
  },
  totalPages: 1,
  dataCount: 0,
  totalAmountGteErr: '',
  totalAmountLteErr: ''
}

export function ordersReducer(state, action) {
  const { type, payload, field } = action

  switch (type) {
    case 'init':
      return { ...initOrders, ...payload }

    case 'update':
      return { ...state, [field]: payload }

    case 'totalAmount-gte':
      return {
        ...state,
        search: {
          ...state.search,
          totalAmount: { ...state.search.totalAmount, gte: payload }
        }
      }

    case 'totalAmount-lte':
      return {
        ...state,
        search: {
          ...state.search,
          totalAmount: { ...state.search.totalAmount, lte: payload }
        }
      }

    case 'obj-update': {
      return { ...state, [field]: { ...state[field], ...payload } }
    }

    case 'totalAmount-gte-err':
      return { ...state, totalAmountGteErr: payload }

    case 'totalAmount-lte-err':
      return { ...state, totalAmountLteErr: payload }

    case 'clear-err':
      return { ...state, totalAmountGteErr: '', totalAmountLteErr: '' }

    default:
      return state
  }
}
