export function getToken() {
    return localStorage.getItem('token')
}

export function getUserId() {
    return localStorage.getItem('userId')
}

export function getName() {
    return localStorage.getItem('name')
}

export function isLoggedIn() {
    const token = getToken()
    if (!token) return false

    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.exp && Date.now() >= payload.exp * 1000) return false
        return true
    } catch {
        return false
    }
}

// Använd på sidor där login krävs
export function requireAuth(redirectUrl = '../pages/login.html') {
    if (!isLoggedIn()) {
        alert('Du måste logga in först')
        window.location.href = redirectUrl
        return false
    }
    return true
}
