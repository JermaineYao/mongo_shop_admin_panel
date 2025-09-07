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
  console.log(payload)

  switch (type) {
    case 'init':
      return { ...initAccount, ...payload }

    case 'photo':
      return { ...state, photo: { ...payload } }

    case 'phoneNumber':
      return { ...state, phoneNumber: payload }

    case 'address':
      return { ...state, address: payload }

    case 'active':
      return { ...state, active: payload }

    case 'clear':
      return { ...initAccount, photo: { ...initAccount.photo } }

    default:
      return state
  }
}
