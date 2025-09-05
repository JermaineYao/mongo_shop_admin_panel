export const initNewAccount = {
  account: '',
  accountErr: '',
  email: '',
  emailErr: ''
}

export function addAccountReducer(state, action) {
  const { type, payload } = action

  switch (type) {
    case 'init':
      return { ...initNewAccount, ...payload }

    case 'account':
      return { ...state, account: payload }

    case 'email':
      return { ...state, email: payload }

    case 'account-err':
      return { ...state, accountErr: payload }

    case 'email-err':
      return { ...state, emailErr: payload }

    case 'clear-err':
      return { ...state, accountErr: '', emailErr: '' }

    case 'clear':
      return { ...initNewAccount }

    default:
      return state
  }
}
