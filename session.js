const LAST_USER_KEY = "kaficko_last_user"

const saveLastUser = (userId) => {
  if (!userId) return
  try {
    sessionStorage.setItem(LAST_USER_KEY, userId)
  } catch (e) {
    
  }
}

const getLastUser = () => {
  try {
    return sessionStorage.getItem(LAST_USER_KEY)
  } catch (e) {
    return null
  }
}

const applyLastUser = (selectEl) => {
  const last = getLastUser()
  if (!last) return
  const option = selectEl.querySelector(`option[value="${CSS.escape(last)}"]`)
  if (option) {
    selectEl.value = last
  }
}

window.sessionUser = { saveLastUser, getLastUser, applyLastUser }
