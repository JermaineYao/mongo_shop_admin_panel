// 驗證 email
export function isValidEmail(email) {
  const strictEmailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/

  if (typeof email === 'string' && email.trim().length > 0)
    return strictEmailRegex.test(email.trim())
}
