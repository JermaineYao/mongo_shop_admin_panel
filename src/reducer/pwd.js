export const initPwd = {
  pwdCurrent: '',
  pwdCurrentErr: '',
  pwd: '',
  pwdErr: '',
  confirmPwd: '',
  confirmErr: ''
}

export function pwdReducer(state, action) {
  const { type, payload, field } = action

  switch (type) {
    case 'init':
      return { ...initPwd, ...payload }

    case 'update':
      return { ...state, [field]: payload }

    case 'clear':
      return { ...initPwd }

    default:
      return state
  }
}
