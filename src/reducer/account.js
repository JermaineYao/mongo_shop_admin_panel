export const initAccount = {
  account: '',
  email: '',
  role: '',
  active: true,
  photo: {
    createAt: null,
    fileKey: null,
    url: null
  },
  phoneNumber: '',
  address: '',
  userId: null
}

export function accountReducer(state, action) {
  const { type, payload } = action

  switch (type) {
    case 'init':
      return { ...initAccount, ...payload }

    case 'photo':
      return { ...state, photo: { ...payload.photo } }

    case 'phone':
      return { ...state, phoneNumber: payload.phoneNumber }

    case 'address':
      return { ...state, address: payload.address }

    case 'active':
      return { ...state, active: payload.active }

    case 'clear':
      return { ...initAccount, photo: { ...initAccount.photo } }

    default:
      return state
  }
}
