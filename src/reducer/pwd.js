export const initPwd = {
  pwdCurrent: '',
  pwdCurrentErr: '',
  pwd: '',
  pwdErr: '',
  confirmPwd: '',
  confirmErr: ''
}

export function pwdReducer(state, action) {
  const { type, payload } = action

  switch (type) {
    case 'init':
      return { ...initPwd, ...payload }

    case 'current':
      return { ...state, pwdCurrent: payload }

    case 'new':
      return { ...state, pwd: payload }

    case 'confirm':
      return { ...state, confirmPwd: payload }

    case 'err-current':
      return { ...state, pwdCurrentErr: payload }

    case 'err-new':
      return { ...state, pwdErr: payload }

    case 'err-confirm':
      return { ...state, confirmErr: payload }

    case 'clear-err':
      return { ...state, pwdCurrentErr: '', pwdErr: '', confirmErr: '' }

    case 'clear':
      return { ...initPwd }

    default:
      return state
  }
}
