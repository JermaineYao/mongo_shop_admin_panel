export const initUsers = {
  users: [],
  search: {
    account: '',
    email: '',
    role: 'all',
    active: 'all',
    currentPage: 1
  },
  totalPages: 1,
  dataCount: 0
}

export function usersReducer(state, action) {
  const { type, payload } = action
  console.log(payload)

  switch (type) {
    case 'init':
      return { ...initUsers, ...payload }

    case 'search':
      return { ...state, search: { ...state.search, ...payload.search } }

    case 'users':
      return { ...state, users: payload.users }

    case 'update-user':
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === payload._id ? { ...user, ...payload.update } : user
        )
      }

    case 'total-page':
      return { ...state, totalPages: payload }

    case 'data-count':
      return { ...state, dataCount: payload }

    case 'clear-users':
      return { ...state, users: [] }

    case 'clear-all':
      return { users: [], search: { ...initUsers.search }, totalPages: 1, dataCount: 0 }

    default:
      return state
  }
}
