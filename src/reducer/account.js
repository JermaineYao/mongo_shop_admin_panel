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
  const { type, payload, field } = action

  switch (type) {
    case 'init':
      return { ...initAccount, ...payload }

    case 'update':
      return { ...state, [field]: payload }

    case 'clear':
      return { ...initAccount, photo: { ...initAccount.photo } }

    default:
      return state
  }
}
