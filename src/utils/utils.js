// 驗證帳號
export function isValidAccount(value) {
  const strictRegex = /^[a-zA-Z][a-zA-Z0-9]*$/

  if (typeof value === 'string' && value.trim().length > 0)
    return strictRegex.test(value.trim())
}

// 驗證 email
export function isValidEmail(value) {
  const strictRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/

  if (typeof value === 'string' && value.trim().length > 0)
    return strictRegex.test(value.trim())
}

// 驗證密碼
export function isValidPwd(value) {
  const strictRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}|\\,./<>?;:'"~`]).{8,}$/

  if (typeof value === 'string' && value.trim().length > 0) {
    return strictRegex.test(value.trim())
  }
  return false
}

// 驗證電話
export function isValidPhoneNumber(value) {
  const strictRegex = /^09\d{2}-\d{3}-\d{3}$/

  if (typeof value === 'string' && value.trim().length > 0) {
    return strictRegex.test(value.trim())
  } else if (typeof value === 'string' && value.trim().length === 0) {
    return true
  } else if (!value) {
    return true
  }

  return false
}
