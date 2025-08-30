export const catchErr = (promise) => {
  return promise.catch((err) => {
    console.error(err)

    return Promise.reject(err)
  })
}
