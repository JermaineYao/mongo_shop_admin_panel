export const initNewAccount = {
  account: '',
  accountErr: '',
  email: '',
  emailErr: ''
}

export function addAccountReducer(state, action) {
  const { type, payload, field } = action

  switch (type) {
    case 'update':
      return { ...state, [field]: payload }

    default:
      return state
  }
}
